#!/usr/bin/env node
// One-off generator: js/pages.js (+ static structure from calendars.html)
//   -> flutter_app/lib/i18n/pages_i18n.dart
// Evaluates the actual JS objects so every string is byte-faithful.
// Companion to tools/gen_i18n_dart.js (same approach, same escaping).
//
// Extracted data:
//   PageI18N          (en/pl/eo)  — page strings, per-calendar descriptions,
//                                   methodology sections, about card
//   CAL_MONTH_META                — month-season visualization data
//   SEASON_LABELS     (en/pl/eo)  — season names
//   CAL_GROUPS        (in IIFE)   — TOC grouping + card/section order
//   methSections      (in IIFE)   — methodology section order
//   calendars.html                — static variant labels/leap-year notes
//                                   (the <strong>/.cal-variant-leaps text the
//                                   JS never translates)
//
// Also writes /tmp/pages_i18n_node.json — the canonical JSON used for the
// round-trip fidelity diff against the generated Dart.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const src = fs.readFileSync(path.join(ROOT, 'js/pages.js'), 'utf8');

// ---- evaluate the data section (everything before the DOM IIFE) ----
const iifeStart = src.indexOf('(() => {');
if (iifeStart < 0) throw new Error('IIFE start not found in js/pages.js');
const head = src.slice(0, iifeStart);
const { PageI18N, CAL_MONTH_META, SEASON_LABELS } = new Function(
  head + '\n;return { PageI18N, CAL_MONTH_META, SEASON_LABELS };'
)();

// ---- structural constants that live inside the IIFE ----
const groupsMatch = src.match(/const CAL_GROUPS = (\[[\s\S]*?\]);/);
if (!groupsMatch) throw new Error('CAL_GROUPS not found');
const CAL_GROUPS = new Function('return ' + groupsMatch[1])();

const methMatch = src.match(/var methSections = (\[[^\]]*\]);/);
if (!methMatch) throw new Error('methSections not found');
const METH_SECTIONS = new Function('return ' + methMatch[1])();

// ---- static variant labels from calendars.html ----
// JS fills only .cal-variant-desc from PageI18N.<cal>.variantsItems[i];
// the <strong> label and the leap-year note are static HTML the Dart side
// needs to render the variant list.
function decodeEntities(s) {
  return s
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}
function htmlText(s) {
  return decodeEntities(s.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
}

const calHtml = fs.readFileSync(path.join(ROOT, 'calendars.html'), 'utf8');
const variantLabels = {}; // calId -> [{id, label, note}]
{
  const tok = /data-cal="([\w]+)"|<li data-variant-id="([^"]+)">\s*<strong>([\s\S]*?)<\/strong>([\s\S]*?)<span class="cal-variant-desc">/g;
  let cur = null, m;
  while ((m = tok.exec(calHtml)) !== null) {
    if (m[1]) { cur = m[1]; continue; }
    if (!cur) throw new Error('variant <li> before any data-cal article');
    const id = m[2];
    const label = htmlText(m[3]);
    let note = htmlText(m[4]);
    note = note.replace(/[—-]\s*$/, '').trim(); // trailing em-dash separator
    (variantLabels[cur] = variantLabels[cur] || []).push({ id, label, note });
  }
}

// ---- categorize PageI18N ----
const CAL_IDS = Object.keys(CAL_MONTH_META);
const langs = Object.keys(PageI18N); // en, pl, eo

const isStr = (x) => typeof x === 'string';
const allStr = (o) => Object.values(o).every(isStr);

const cat = {}; // lang -> {strings, nav, about, cals, variantItems, meth, methItems}
for (const lang of langs) {
  const c = { strings: {}, nav: null, about: null, cals: {}, variantItems: {}, meth: {}, methItems: null };
  for (const [k, v] of Object.entries(PageI18N[lang])) {
    if (isStr(v)) { c.strings[k] = v; continue; }
    if (k === 'nav' || k === 'about') {
      if (!allStr(v)) throw new Error(`${lang}.${k}: non-string value`);
      c[k] = v; continue;
    }
    if (CAL_IDS.includes(k)) {
      const fields = {};
      for (const [f, fv] of Object.entries(v)) {
        if (f === 'variantsItems') {
          if (!Array.isArray(fv) || !fv.every(isStr)) throw new Error(`${lang}.${k}.variantsItems: bad shape`);
          c.variantItems[k] = fv;
        } else if (isStr(fv)) fields[f] = fv;
        else throw new Error(`${lang}.${k}.${f}: unexpected type`);
      }
      c.cals[k] = fields; continue;
    }
    if (/^meth/.test(k) && v && typeof v === 'object') {
      const fields = {};
      for (const [f, fv] of Object.entries(v)) {
        if (f === 'items') {
          if (!Array.isArray(fv) || !fv.every((it) => Array.isArray(it) && it.length === 3 && it.every(isStr)))
            throw new Error(`${lang}.${k}.items: expected [before, em, after] string triples`);
          c.methItems = fv;
        } else if (isStr(fv)) fields[f] = fv;
        else throw new Error(`${lang}.${k}.${f}: unexpected type`);
      }
      c.meth[k] = fields; continue;
    }
    throw new Error(`${lang}.${k}: unexpected top-level value`);
  }
  if (!c.nav || !c.about || !c.methItems) throw new Error(`${lang}: missing nav/about/methSources.items`);
  cat[lang] = c;
}

// ---- coverage report ----
for (const lang of langs) {
  const c = cat[lang];
  const nFlat = Object.keys(c.strings).length;
  const nNav = Object.keys(c.nav).length;
  const nAbout = Object.keys(c.about).length;
  const nCals = Object.keys(c.cals).length;
  const calLeaves = Object.values(c.cals).reduce((a, v) => a + Object.keys(v).length, 0);
  const varLeaves = Object.values(c.variantItems).reduce((a, v) => a + v.length, 0);
  const methLeaves = Object.values(c.meth).reduce((a, v) => a + Object.keys(v).length, 0);
  const srcLeaves = c.methItems.length * 3;
  const total = nFlat + nNav + nAbout + calLeaves + varLeaves + methLeaves + srcLeaves;
  console.error(
    `${lang}: flat=${nFlat} nav=${nNav} about=${nAbout} calendars=${nCals} (fields=${calLeaves}, variantItems=${varLeaves}) ` +
    `methSections=${Object.keys(c.meth).length} (fields=${methLeaves}) methSourceItems=${c.methItems.length} totalLeafStrings=${total}`
  );
  const missCal = CAL_IDS.filter((id) => !cat[lang].cals[id]);
  if (missCal.length) console.error(`${lang}: calendars missing vs CAL_MONTH_META: [${missCal}]`);
}
{
  const en = new Set(Object.keys(cat.en.cals).flatMap((id) => Object.keys(cat.en.cals[id]).map((f) => id + '.' + f)));
  for (const lang of langs.slice(1)) {
    const k = new Set(Object.keys(cat[lang].cals).flatMap((id) => Object.keys(cat[lang].cals[id]).map((f) => id + '.' + f)));
    const missing = [...en].filter((x) => !k.has(x));
    const extra = [...k].filter((x) => !en.has(x));
    console.error(`${lang}: calendar fields missing vs en: ${missing.length} [${missing.join(', ')}]; extra: [${extra.join(', ')}]`);
  }
}

// ---- canonical JSON for the round-trip diff ----
const canonical = {
  strings: Object.fromEntries(langs.map((l) => [l, cat[l].strings])),
  nav: Object.fromEntries(langs.map((l) => [l, cat[l].nav])),
  about: Object.fromEntries(langs.map((l) => [l, cat[l].about])),
  calendarDescriptions: Object.fromEntries(langs.map((l) => [l, cat[l].cals])),
  calendarVariantItems: Object.fromEntries(langs.map((l) => [l, cat[l].variantItems])),
  methSections: Object.fromEntries(langs.map((l) => [l, cat[l].meth])),
  methSourceItems: Object.fromEntries(langs.map((l) => [l, cat[l].methItems])),
  seasonLabels: SEASON_LABELS,
  methSectionOrder: METH_SECTIONS,
  calGroups: CAL_GROUPS.map((g) => [g.group, g.ids]),
  calMonthMeta: Object.fromEntries(Object.entries(CAL_MONTH_META).map(([id, [key, days, seasons]]) =>
    [id, [key, days.split(','), seasons ? seasons.split(',').map(Number) : null]])),
  variantLabels: Object.fromEntries(Object.entries(variantLabels).map(([id, vs]) =>
    [id, vs.map((v) => [v.id, v.label, v.note])])),
};
fs.writeFileSync('/tmp/pages_i18n_node.json', JSON.stringify(canonical));
console.error('wrote /tmp/pages_i18n_node.json');

// ---- dart emission ----
function dstr(s) {
  let out = "'";
  for (const ch of s) {
    if (ch === '\\') out += '\\\\';
    else if (ch === "'") out += "\\'";
    else if (ch === '$') out += '\\$';
    else if (ch === '\n') out += '\\n';
    else if (ch === '\r') out += '\\r';
    else if (ch === '\t') out += '\\t';
    else out += ch;
  }
  return out + "'";
}

function emitStrMap(obj, indent) {
  const pad = ' '.repeat(indent);
  const lines = Object.entries(obj).map(([k, v]) => `${pad}${dstr(k)}: ${dstr(v)},`);
  return '{\n' + lines.join('\n') + '\n' + ' '.repeat(indent - 2) + '}';
}

function emitList(arr, indent) {
  const pad = ' '.repeat(indent);
  return '[\n' + arr.map((v) => `${pad}${dstr(v)},`).join('\n') + '\n' + ' '.repeat(indent - 2) + ']';
}

const out = [];
out.push(`// GENERATED from js/pages.js + calendars.html by tools/gen_pages_i18n_dart.js
// — do not edit strings by hand; rerun the generator instead.
//
// kalkal — subpage (Calendars / Methodology / About) content for the Flutter
// port. Languages: English, Polish, Esperanto (js/pages.js has no Arabic
// block; the web subpages are en/pl/eo only).
//
// Contents:
//   * PageI18N            -> [PagesI18n.strings] / [nav] / [about] /
//                            [calendarDescriptions] / [calendarVariantItems] /
//                            [methSections] / [methSourceItems]
//   * SEASON_LABELS       -> [PagesI18n.seasonLabels]
//   * CAL_MONTH_META      -> [PagesI18n.calMonthMeta] (month-season grid)
//   * CAL_GROUPS (IIFE)   -> [PagesI18n.calGroups] (TOC grouping, card order)
//   * methSections (IIFE) -> [PagesI18n.methSectionOrder]
//   * calendars.html      -> [PagesI18n.variantLabels] (static <strong> labels
//                            and leap-year notes of the variant lists, which
//                            the JS never localizes)
//
// ignore_for_file: lines_longer_than_80_chars

/// One entry of the month-season visualization grid (CAL_MONTH_META in
/// js/pages.js): which month-name array to use, day counts per month
/// (verbatim, e.g. '28/29'), and the season of each month
/// (0=spring, 1=summer, 2=autumn, 3=winter; null = wandering/lunar calendar
/// with no fixed season mapping).
class CalMonthMeta {
  const CalMonthMeta(this.monthsKey, this.days, this.seasons);
  final String monthsKey;
  final List<String> days;
  final List<int>? seasons;
}

/// One calendar group of the Calendars page (CAL_GROUPS in js/pages.js):
/// TOC grouping and card/section order. Group labels are localized via
/// I18n.calendarGroup(lang, id).
class PageCalGroup {
  const PageCalGroup(this.id, this.calendarIds);
  final String id;
  final List<String> calendarIds;
}

/// One static variant label of a cal-variants-list in calendars.html:
/// the variant id (data-variant-id), its bold label (e.g. 'IIc — Wüstenfeld'),
/// and the untranslated leap-year/epoch note (may be empty). The localized
/// description comes from [PagesI18n.calendarVariantItems] at the same index.
class CalVariantLabel {
  const CalVariantLabel(this.id, this.label, this.note);
  final String id;
  final String label;
  final String note;
}

class PagesI18n {
  PagesI18n._();

  /// Languages present in PageI18N, in source order.
  static const List<String> supportedLangs = [${langs.map((l) => `'${l}'`).join(', ')}];
`);

out.push(`  /// Flat page strings (titles, subtitles, labels): lang -> key -> value.
  static const Map<String, Map<String, String>> strings = {`);
for (const lang of langs) out.push(`    '${lang}': ${emitStrMap(cat[lang].strings, 6)},`);
out.push('  };\n');

out.push(`  /// Subpage navigation labels: lang -> key -> label.
  static const Map<String, Map<String, String>> nav = {`);
for (const lang of langs) out.push(`    '${lang}': ${emitStrMap(cat[lang].nav, 6)},`);
out.push('  };\n');

out.push(`  /// About page (author card) strings: lang -> key -> value.
  static const Map<String, Map<String, String>> about = {`);
for (const lang of langs) out.push(`    '${lang}': ${emitStrMap(cat[lang].about, 6)},`);
out.push('  };\n');

out.push(`  /// Per-calendar descriptions for the Calendars page:
  /// lang -> calendar id -> field -> text.
  /// Fields (presence varies by calendar/language): name, type, epoch, intro,
  /// body, adoption, usage, tabular, arithmetic, variantsDivergence, source,
  /// warning, months.
  static const Map<String, Map<String, Map<String, String>>> calendarDescriptions = {`);
for (const lang of langs) {
  out.push(`    '${lang}': {`);
  for (const [id, fields] of Object.entries(cat[lang].cals)) {
    out.push(`      ${dstr(id)}: ${emitStrMap(fields, 8)},`);
  }
  out.push('    },');
}
out.push('  };\n');

out.push(`  /// Localized variant descriptions (JS \`variantsItems\`), aligned by index
  /// with [variantLabels]: lang -> calendar id -> descriptions.
  static const Map<String, Map<String, List<String>>> calendarVariantItems = {`);
for (const lang of langs) {
  out.push(`    '${lang}': {`);
  for (const [id, items] of Object.entries(cat[lang].variantItems)) {
    out.push(`      ${dstr(id)}: ${emitList(items, 8)},`);
  }
  out.push('    },');
}
out.push('  };\n');

out.push(`  /// Methodology page sections: lang -> section id -> field -> text.
  /// Fields: title, body, body2, warning, note (presence varies).
  /// methSources additionally has [methSourceItems]; methLinks has title only.
  static const Map<String, Map<String, Map<String, String>>> methSections = {`);
for (const lang of langs) {
  out.push(`    '${lang}': {`);
  for (const [id, fields] of Object.entries(cat[lang].meth)) {
    out.push(`      ${dstr(id)}: ${emitStrMap(fields, 8)},`);
  }
  out.push('    },');
}
out.push('  };\n');

out.push(`  /// Bibliography entries of the methSources section, each a
  /// [before, italicized title, after] triple: lang -> entries.
  static const Map<String, List<List<String>>> methSourceItems = {`);
for (const lang of langs) {
  out.push(`    '${lang}': [`);
  for (const item of cat[lang].methItems) {
    out.push(`      ${emitList(item, 8)},`);
  }
  out.push('    ],');
}
out.push('  };\n');

out.push(`  /// Season names (spring, summer, autumn, winter): lang -> 4 labels.
  static const Map<String, List<String>> seasonLabels = {`);
for (const lang of Object.keys(SEASON_LABELS)) out.push(`    '${lang}': ${emitList(SEASON_LABELS[lang], 6)},`);
out.push('  };\n');

out.push(`  /// Methodology section ids in display order.
  static const List<String> methSectionOrder = ${emitList(METH_SECTIONS, 4)};\n`);

out.push(`  /// Calendar groups in display order (TOC grouping and card order of the
  /// Calendars page).
  static const List<PageCalGroup> calGroups = [`);
for (const g of CAL_GROUPS) {
  out.push(`    PageCalGroup('${g.group}', [${g.ids.map((id) => `'${id}'`).join(', ')}]),`);
}
out.push('  ];\n');

out.push(`  /// Month-season visualization data per calendar id.
  static const Map<String, CalMonthMeta> calMonthMeta = {`);
for (const [id, [key, days, seasons]] of Object.entries(CAL_MONTH_META)) {
  const daysList = '[' + days.split(',').map(dstr).join(', ') + ']';
  const seasonsList = seasons ? '[' + seasons.split(',').join(', ') + ']' : 'null';
  out.push(`    '${id}': CalMonthMeta('${key}', ${daysList}, ${seasonsList}),`);
}
out.push('  };\n');

out.push(`  /// Static variant labels per calendar id (from calendars.html), aligned by
  /// index with [calendarVariantItems].
  static const Map<String, List<CalVariantLabel>> variantLabels = {`);
for (const [id, vs] of Object.entries(variantLabels)) {
  out.push(`    '${id}': [`);
  for (const v of vs) out.push(`      CalVariantLabel(${dstr(v.id)}, ${dstr(v.label)}, ${dstr(v.note)}),`);
  out.push('    ],');
}
out.push('  };\n');

out.push(`  // ---------------------------------------------------------------------
  // Accessors (mirror how js/pages.js consumes PageI18N: \`const t =
  // PageI18N[lang];\` then per-key application — setT() only overwrites the
  // static English HTML when the localized string exists, so the effective
  // fallback is per-field to English).
  // ---------------------------------------------------------------------

  /// Flat page string for [key]; falls back to English, then the key itself.
  static String t(String lang, String key) =>
      strings[lang]?[key] ?? strings['en']![key] ?? key;

  /// Navigation label; falls back to English, then the key itself.
  static String navT(String lang, String key) =>
      nav[lang]?[key] ?? nav['en']![key] ?? key;

  /// About page string; falls back to English, then the key itself.
  static String aboutT(String lang, String key) =>
      about[lang]?[key] ?? about['en']![key] ?? key;

  /// One field of a calendar description (e.g. calT('pl', 'hijri', 'intro'));
  /// falls back to English; null when the field exists in neither language.
  static String? calT(String lang, String calendarId, String field) =>
      calendarDescriptions[lang]?[calendarId]?[field] ??
      calendarDescriptions['en']![calendarId]?[field];

  /// Full description map for [calendarId]: English fields overlaid with the
  /// localized ones (per-field fallback, as on the web page where
  /// untranslated fields keep the static English HTML text).
  static Map<String, String> calendarDescription(String lang, String calendarId) => {
        ...?calendarDescriptions['en']![calendarId],
        ...?calendarDescriptions[lang]?[calendarId],
      };

  /// Localized variant descriptions for [calendarId] (empty list when the
  /// calendar has no variants); falls back to English.
  static List<String> variantItems(String lang, String calendarId) =>
      calendarVariantItems[lang]?[calendarId] ??
      calendarVariantItems['en']![calendarId] ??
      const <String>[];

  /// One field of a methodology section (e.g. methT('eo', 'methJDN', 'body'));
  /// falls back to English; null when absent in both.
  static String? methT(String lang, String sectionId, String field) =>
      methSections[lang]?[sectionId]?[field] ??
      methSections['en']![sectionId]?[field];

  /// Bibliography triples of the methSources section; falls back to English.
  static List<List<String>> methSources(String lang) =>
      methSourceItems[lang] ?? methSourceItems['en']!;

  /// Season labels for [lang]; falls back to English.
  static List<String> seasonLabelsFor(String lang) =>
      seasonLabels[lang] ?? seasonLabels['en']!;
}`);

const target = path.join(ROOT, 'flutter_app/lib/i18n/pages_i18n.dart');
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, out.join('\n') + '\n');
console.error('wrote ' + target);

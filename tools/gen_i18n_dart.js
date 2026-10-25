#!/usr/bin/env node
// One-off generator: js/i18n.js -> flutter_app/lib/i18n/i18n.dart
// Evaluates the actual JS I18N object so every string is byte-faithful.
// Arabic block was removed from js/i18n.js in commit 641cd62; we recover the
// last committed version from git (641cd62^) so the Flutter app keeps 4 langs.

const fs = require('fs');
const { execFileSync } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function loadI18N(src) {
  return new Function(src + '\n;return I18N;')();
}

const cur = loadI18N(fs.readFileSync(path.join(ROOT, 'js/i18n.js'), 'utf8'));

// Arabic: removed from js/i18n.js in 641cd62; the block in 641cd62^ is broken
// JS (corrupted apostrophe escaping in armenianMonths / babylonianMonths).
// Use the last clean snapshot (Syncthing conflict copy, 2026-06-27) and overlay
// the 5 newer keys whose lines are intact in 641cd62^.
const sync = loadI18N(fs.readFileSync(path.join(ROOT, 'js/i18n.sync-conflict-20260627-003504-DDHSDMD.js'), 'utf8'));
if (!sync.ar) throw new Error('ar block not found in sync-conflict file');
const oldSrc = execFileSync('git', ['show', '641cd62^:js/i18n.js'], { cwd: ROOT, encoding: 'utf8' });
const arText = oldSrc.match(/^  ar: \{([\s\S]*?)^\};/m)[1];
const RECOVER = ['navAuthor', 'copyHelp', 'copySetDefault', 'copyToggleOptions', 'aboutCalendarTpl'];
const ar = { ...sync.ar };
for (const k of RECOVER) {
  const m = arText.match(new RegExp(`^    ${k}: ('(?:[^'\\\\]|\\\\.)*'),?$`, 'm'));
  if (!m) throw new Error(`could not recover ar key ${k} from 641cd62^`);
  ar[k] = new Function('return ' + m[1])();
  console.error(`recovered ar.${k} = ${JSON.stringify(ar[k])}`);
}
// Yazdgerdi's 13th "month" (epagomenal days, TASK-14): same as the JS keys,
// Arabic recovered from persianMonths + أندرگاه (Andargāh).
ar.yazdgerdiMonths = [...ar.persianMonths, '\u0623\u0646\u062f\u0631\u06af\u0627\u0647'];
const I18N = { en: cur.en, pl: cur.pl, ar, eo: cur.eo };

// ---- report key coverage ----
const enKeys = new Set(Object.keys(cur.en));
for (const lang of ['pl', 'ar', 'eo']) {
  const keys = new Set(Object.keys(I18N[lang]));
  const missing = [...enKeys].filter((k) => !keys.has(k));
  const extra = [...keys].filter((k) => !enKeys.has(k));
  console.error(`${lang}: ${keys.size} top-level keys; missing vs en: [${missing}]; extra vs en: [${extra}]`);
}

// ---- categorize ----
const SPECIAL_MAPS = ['calendars', 'calendarGroups'];
const SPECIAL_LISTS = ['weekdays', 'zodiacSigns'];

function categorize(langObj) {
  const strings = {}, months = {}, lists = {}, nested = {};
  for (const [k, v] of Object.entries(langObj)) {
    if (typeof v === 'string') strings[k] = v;
    else if (Array.isArray(v)) {
      if (!v.every((x) => typeof x === 'string')) throw new Error(`non-string array ${k}`);
      if (SPECIAL_LISTS.includes(k)) lists[k] = v;
      else if (/Months(Gen)?$/.test(k)) months[k] = v;
      else throw new Error(`unexpected list key ${k}`);
    } else if (v && typeof v === 'object') {
      if (!Object.values(v).every((x) => typeof x === 'string')) throw new Error(`non-flat object ${k}`);
      if (!SPECIAL_MAPS.includes(k)) nested[k] = v;
    } else throw new Error(`unexpected value for ${k}`);
  }
  return { strings, months, lists, nested };
}

const cat = {};
for (const lang of Object.keys(I18N)) cat[lang] = categorize(I18N[lang]);

// counts for the report
for (const lang of Object.keys(I18N)) {
  const c = cat[lang];
  const nStr = Object.keys(c.strings).length;
  const nCal = Object.keys(I18N[lang].calendars || {}).length;
  const nGrp = Object.keys(I18N[lang].calendarGroups || {}).length;
  const nMon = Object.keys(c.months).length;
  const nNested = Object.entries(c.nested).reduce((a, [, v]) => a + Object.keys(v).length, 0);
  const total = nStr + nCal + nGrp + nNested +
    Object.values(c.months).reduce((a, v) => a + v.length, 0) +
    Object.values(c.lists).reduce((a, v) => a + v.length, 0);
  console.error(`${lang}: flat=${nStr} calendars=${nCal} groups=${nGrp} monthArrays=${nMon} nestedLeaves=${nNested} totalLeafStrings=${total}`);
}

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

const langs = ['en', 'pl', 'ar', 'eo'];
let out = [];
out.push(`// GENERATED from js/i18n.js by tools/gen_i18n_dart.js — do not edit strings by hand.
//
// kalkal — internationalization strings for the Flutter port.
// Languages: English, Polish, Arabic (RTL), Esperanto.
//
// Provenance:
//   en / pl / eo — js/i18n.js (working tree, faithful byte-for-byte).
//   ar           — the Arabic block was removed from js/i18n.js in commit
//                  641cd62 ("i18n: remove Arabic block") and the copy in
//                  641cd62^ is syntactically corrupted; recovered from the
//                  last clean snapshot js/i18n.sync-conflict-20260627-*.js
//                  plus 5 intact newer keys (navAuthor, copyHelp,
//                  copySetDefault, copyToggleOptions, aboutCalendarTpl) from
//                  641cd62^. Keys added to en after that date fall back to
//                  English via the accessors below.
//
// ignore_for_file: lines_longer_than_80_chars

/// Languages supported by the app, in display order.
const List<String> supportedLangs = ['en', 'pl', 'ar', 'eo'];

/// Whether [lang] is written right-to-left.
bool isRtl(String lang) => lang == 'ar';

class I18n {
  I18n._();
`);

// strings
out.push(`  /// Flat UI strings: lang -> key -> value.
  static const Map<String, Map<String, String>> strings = {`);
for (const lang of langs) out.push(`    '${lang}': ${emitStrMap(cat[lang].strings, 6)},`);
out.push('  };\n');

// calendarNames
out.push(`  /// Calendar display names (JS \`calendars\`): lang -> calendar key -> name.
  /// Keys are the JS registry ids; engine ids that differ are resolved through
  /// [_calendarNameAlias] in [calendarName].
  static const Map<String, Map<String, String>> calendarNames = {`);
for (const lang of langs) out.push(`    '${lang}': ${emitStrMap(I18N[lang].calendars || {}, 6)},`);
out.push('  };\n');

// calendarGroups
out.push(`  /// Calendar group headings: lang -> group id -> label.
  static const Map<String, Map<String, String>> calendarGroups = {`);
for (const lang of langs) out.push(`    '${lang}': ${emitStrMap(I18N[lang].calendarGroups || {}, 6)},`);
out.push('  };\n');

// months
out.push(`  /// Month-name arrays, keyed by the original JS key
  /// ('gregorianMonths', 'hijriMonths', 'gregorianMonthsGen', ...): lang -> key -> names.
  static const Map<String, Map<String, List<String>>> months = {`);
for (const lang of langs) {
  out.push(`    '${lang}': {`);
  for (const [k, v] of Object.entries(cat[lang].months)) {
    out.push(`      ${dstr(k)}: ${emitList(v, 8)},`);
  }
  out.push('    },');
}
out.push('  };\n');

// weekdays + zodiac
out.push(`  /// Weekday names, Sunday-first (7 entries): lang -> names.
  static const Map<String, List<String>> weekdays = {`);
for (const lang of langs) out.push(`    '${lang}': ${emitList(cat[lang].lists.weekdays, 6)},`);
out.push('  };\n');

out.push(`  /// Zodiac sign names, Aries-first (12 entries): lang -> names.
  static const Map<String, List<String>> zodiacSigns = {`);
for (const lang of langs) out.push(`    '${lang}': ${emitList(cat[lang].lists.zodiacSigns, 6)},`);
out.push('  };\n');

// nested groups
const nestedGroups = Object.keys(cat.en.nested);
out.push(`  /// Nested string groups (${nestedGroups.join(', ')}):
  /// lang -> group -> key -> value.
  static const Map<String, Map<String, Map<String, String>>> nested = {`);
for (const lang of langs) {
  out.push(`    '${lang}': {`);
  for (const [g, obj] of Object.entries(cat[lang].nested)) {
    out.push(`      ${dstr(g)}: ${emitStrMap(obj, 8)},`);
  }
  out.push('    },');
}
out.push('  };\n');

// accessors
out.push(`  // ---------------------------------------------------------------------
  // Accessors (mirror how js/app.js and js/pages.js consume I18N:
  // \`var t = I18N[currentLang] || I18N.en;\` then property access with
  // per-key fallback, e.g. \`t.calendars[cal.id] || cal.id\`).
  // ---------------------------------------------------------------------

  /// Flat UI string for [key]; falls back to English, then to the key itself.
  static String t(String lang, String key) =>
      strings[lang]?[key] ?? strings['en']![key] ?? key;

  /// Engine calendar ids (flutter_app/lib/engine/calendars.dart) whose
  /// display-name key differs in the JS i18n data. Variant calendars map to
  /// their parent calendar's name, mirroring the JS app where they are
  /// variants, not separate registry entries.
  static const Map<String, String> _calendarNameAlias = {
    'solar_hijri': 'solarHijri',
    'auc': 'roman',
    'seleucid_bab': 'seleucid',
    'alexandrian': 'byzantine',
    'chron_pasch': 'byzantine',
    'qadimi': 'yazdgerdi',
    'fasli': 'yazdgerdi',
  };

  /// Localized display name for a calendar id (engine or JS registry id);
  /// falls back to English, then to the id itself (as js/app.js does).
  static String calendarName(String lang, String calendarId) {
    final key = _calendarNameAlias[calendarId] ?? calendarId;
    return calendarNames[lang]?[key] ?? calendarNames['en']![key] ?? calendarId;
  }

  /// Localized calendar group heading; falls back to English, then the id.
  static String calendarGroup(String lang, String groupId) =>
      calendarGroups[lang]?[groupId] ?? calendarGroups['en']![groupId] ?? groupId;

  /// Engine/JS calendar id -> months key in [months].
  /// Mirrors the monthNames wiring of the CALENDARS registry in js/app.js.
  static const Map<String, String> monthsKeyForCalendar = {
    'gregorian': 'gregorianMonths',
    'julian': 'gregorianMonths',
    'hijri': 'hijriMonths',
    'solar_hijri': 'persianMonths',
    'solarHijri': 'persianMonths',
    'coptic': 'copticMonths',
    'ethiopian': 'ethiopianMonths',
    'yazdgerdi': 'yazdgerdiMonths',
    'qadimi': 'yazdgerdiMonths',
    'fasli': 'yazdgerdiMonths',
    'armenian': 'armenianMonths',
    'egyptian': 'egyptianMonths',
    'byzantine': 'byzantineMonths',
    'alexandrian': 'alexandrianMonths',
    'chron_pasch': 'alexandrianMonths',
    'seleucid': 'seleucidMonths',
    'seleucid_bab': 'seleucidBabMonths',
    'syriac': 'syriacMonths',
    'rumi': 'gregorianMonths',
    'ilkhani': 'persianMonths',
    'auc': 'romanMonths',
    'roman': 'romanMonths',
    'spanish': 'gregorianMonths',
    'antiochene': 'seleucidMonths',
    'olympiad': 'gregorianMonths',
    'macedonian': 'macedonianMonths',
    'hebrew': 'hebrewMonths',
    'babylonian': 'babylonianMonths',
    'bp': 'gregorianMonths',
    'human': 'gregorianMonths',
  };

  /// Month names for a calendar id in [lang]; falls back to English.
  static List<String> monthNames(String lang, String calendarId) {
    final key = monthsKeyForCalendar[calendarId] ?? '\${calendarId}Months';
    return months[lang]?[key] ?? months['en']![key] ?? const <String>[];
  }

  /// Raw month array by JS key (e.g. 'gregorianMonthsGen'); null when the
  /// key exists in no language (Polish genitive months have no en fallback,
  /// mirroring \`t.gregorianMonthsGen || t.gregorianMonths\` in js/app.js).
  static List<String>? monthList(String lang, String monthsKey) =>
      months[lang]?[monthsKey] ?? months['en']![monthsKey];

  /// Weekday names (Sunday-first) for [lang]; falls back to English.
  static List<String> weekdaysFor(String lang) =>
      weekdays[lang] ?? weekdays['en']!;

  /// Zodiac sign names (Aries-first) for [lang]; falls back to English.
  static List<String> zodiacFor(String lang) =>
      zodiacSigns[lang] ?? zodiacSigns['en']!;

  /// Nested lookup (e.g. nestedT('pl', 'moonPhases', 'full'),
  /// nestedT('en', 'eclipseNotes', '10029crucifixion')); falls back to
  /// English, then to the key itself.
  static String nestedT(String lang, String group, String key) =>
      nested[lang]?[group]?[key] ?? nested['en']![group]?[key] ?? key;
}`);

const target = path.join(ROOT, 'flutter_app/lib/i18n/i18n.dart');
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, out.join('\n') + '\n');
console.error('wrote ' + target);

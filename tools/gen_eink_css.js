#!/usr/bin/env node
// Generuje sekcję "minimalny rozmiar fontu" w css/eink.css.
//
// CSS nie ma odpowiednika min-font-size, a style.css ma kilkadziesiąt reguł
// z fontem 0.55–0.70rem (9–11 px) albo ułamkiem em — na e-ink nieczytelnych. Skrypt przechodzi
// po style.css, dla każdej reguły z `font-size: X rem` (X < MIN_REM) emituje
// kopię z fontem MIN_REM (dla `X em`, X < 1: max(MIN_REM, X em)), ze selektorem poprzedzonym html[data-display="eink"]
// i w tym samym opakowaniu @media (kolejność i względna specyficzność zostają).
//
// Uruchom po każdej zmianie rozmiarów w css/style.css:
//   node tools/gen_eink_css.js          # przepisuje obszar BEGIN/END w css/eink.css
//   node tools/gen_eink_css.js --check  # exit 1, gdy eink.css jest nieaktualny
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'css', 'style.css');
const DST = path.join(ROOT, 'css', 'eink.css');
const MIN_REM = 0.72;
const PREFIX = 'html[data-display="eink"]';
const BEGIN = '/* BEGIN GENERATED: min-font-size (node tools/gen_eink_css.js) */';
const END = '/* END GENERATED: min-font-size */';

// Usuwa komentarze, zachowując resztę (stringi/url() nie zawierają tu "/*").
function stripComments(s) {
  return s.replace(/\/\*[\s\S]*?\*\//g, '');
}

// Zwraca drzewo: [{ sel, body }] oraz [{ at, children }] (blok at-reguły).
function parse(text) {
  let i = 0;
  function block() {
    const items = [];
    while (i < text.length) {
      // prelude do najbliższego { lub } lub ;
      let start = i, q = null;
      while (i < text.length) {
        const c = text[i];
        if (q) { if (c === q && text[i - 1] !== '\\') q = null; }
        else if (c === '"' || c === "'") q = c;
        else if (c === '(' ) { // url(...) / var(...) mogą mieć dowolne znaki
          let depth = 1; i++;
          while (i < text.length && depth) {
            if (text[i] === '(') depth++;
            else if (text[i] === ')') depth--;
            i++;
          }
          continue;
        }
        else if (c === '{' || c === '}' || c === ';') break;
        i++;
      }
      const prelude = text.slice(start, i).trim();
      if (i >= text.length) break;
      const c = text[i];
      if (c === '}') { i++; return items; }
      if (c === ';') { i++; continue; }          // @import / @charset
      i++;                                       // za '{'
      if (prelude.startsWith('@')) {
        const name = prelude.split(/[\s(]/)[0];
        if (name === '@media' || name === '@supports' || name === '@layer') {
          items.push({ at: prelude, children: block() });
        } else {                                 // @keyframes, @font-face…: pomiń
          skipBlock();
        }
      } else {
        const bs = i; skipBlock();
        items.push({ sel: prelude, body: text.slice(bs, i - 1) });
      }
    }
    return items;
  }
  function skipBlock() {
    let depth = 1, q = null;
    while (i < text.length && depth) {
      const c = text[i];
      if (q) { if (c === q && text[i - 1] !== '\\') q = null; }
      else if (c === '"' || c === "'") q = c;
      else if (c === '{') depth++;
      else if (c === '}') depth--;
      i++;
    }
  }
  return block();
}

function prefixSelector(sel) {
  return sel.split(',').map(s => {
    s = s.trim();
    if (!s) return null;
    // html[dir="rtl"] .x  ->  html[data-display="eink"][dir="rtl"] .x
    if (/^html\b/.test(s)) return PREFIX + s.slice(4);
    if (/^:root\b/.test(s)) return PREFIX + s.slice(5);
    return PREFIX + ' ' + s;
  }).filter(Boolean).join(',\n');
}

function smallFontDecl(body) {
  // ostatnia deklaracja font-size w regule wygrywa
  let found = null;
  const re = /(?:^|[;\s])font-size\s*:\s*([0-9.]+)(rem|em)\s*(!important)?/g;
  let m;
  while ((m = re.exec(body))) found = { n: parseFloat(m[1]), unit: m[2], important: !!m[3] };
  if (!found) return null;
  // rem < MIN  -> MIN;  em < 1 (względem rodzica, więc nieznane) -> max(MIN, X em)
  if (found.unit === 'rem' && found.n < MIN_REM) return { value: `${MIN_REM}rem`, important: found.important };
  if (found.unit === 'em' && found.n < 1) return { value: `max(${MIN_REM}rem, ${found.n}em)`, important: found.important };
  return null;
}

function emit(items, indent) {
  const out = [];
  for (const it of items) {
    if (it.children) {
      const inner = emit(it.children, indent + '  ');
      if (inner.length) out.push(`${indent}${it.at} {`, ...inner, `${indent}}`);
    } else {
      const f = smallFontDecl(it.body);
      if (!f) continue;
      const sel = prefixSelector(it.sel).split('\n').map(l => indent + l).join('\n');
      out.push(`${sel} { font-size: ${f.value}${f.important ? ' !important' : ''}; }`);
    }
  }
  return out;
}

const tree = parse(stripComments(fs.readFileSync(SRC, 'utf8')));
const lines = emit(tree, '');
const generated = `${BEGIN}\n${lines.join('\n')}\n${END}`;

const dst = fs.readFileSync(DST, 'utf8');
const bi = dst.indexOf(BEGIN), ei = dst.indexOf(END);
if (bi < 0 || ei < 0) {
  console.error(`Brak znaczników BEGIN/END w ${DST}`);
  process.exit(2);
}
const next = dst.slice(0, bi) + generated + dst.slice(ei + END.length);

if (process.argv.includes('--check')) {
  if (next !== dst) { console.error('css/eink.css jest nieaktualny — uruchom node tools/gen_eink_css.js'); process.exit(1); }
  console.log('css/eink.css aktualny');
} else {
  fs.writeFileSync(DST, next);
  console.log(`Zapisano ${lines.length} linii (min ${MIN_REM}rem) do css/eink.css`);
}

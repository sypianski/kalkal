// Cross-verification: compare kalkal's Cal against independent reference implementations
// Sources: Fourmilab (John Walker), Intl.DateTimeFormat, Python hijri-converter results
//
// NOTE: new Function() is used intentionally to load the browser-targeted Cal IIFE in Node.js.
// This is safe — it only loads our own trusted local source file (js/hijri.js).

const fs = require('fs');
const path = require('path');

// Load Cal from browser IIFE for Node.js usage
const hijriCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'hijri.js'), 'utf8');
const Cal = (new Function(hijriCode + '; return Cal;'))(); // eslint-disable-line no-new-func

// ================================================================
// INDEPENDENT REFERENCE: Fourmilab algorithm (public domain)
// Leap cycle: [1, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29] — this is IIa
// Epoch: JD 1948439.5
// ================================================================

const REF_EPOCH = 1948439.5;

function refHijriToJD(year, month, day) {
  return day + Math.ceil(29.5001 * (month - 1)) + (year - 1) * 354 +
    Math.floor((3 + 11 * year) / 30) + REF_EPOCH - 1;
}

function refJDToHijri(jd) {
  const jd1 = Math.floor(jd) + 0.5;
  const year = Math.floor((30 * (jd1 - REF_EPOCH) + 10646) / 10631);
  let month = Math.min(12, Math.ceil((jd1 - (29 + refHijriToJD(year, 1, 1))) / 29.5) + 1);
  if (month < 1) month = 1;
  const day = jd1 - refHijriToJD(year, month, 1) + 1;
  return { year, month, day: Math.round(day) };
}

function refGregToJD(y, m, d) {
  if (m <= 2) { y--; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
}

function refJDToGreg(jd) {
  const z = Math.floor(jd + 0.5);
  const a = Math.floor((z - 1867216.25) / 36524.25);
  const A = z + 1 + a - Math.floor(a / 4);
  const B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);
  const day = B - D - Math.floor(30.6001 * E);
  const month = E < 14 ? E - 1 : E - 13;
  const year = month > 2 ? C - 4716 : C - 4715;
  return { year, month, day };
}

// ================================================================
// Comparison
// ================================================================

let pass = 0, fail = 0, warn = 0;
const issues = [];

function check(desc, got, expected) {
  if (got === expected) { pass++; return true; }
  fail++;
  issues.push('FAIL: ' + desc + ' — got ' + got + ', expected ' + expected);
  return false;
}

function note(desc) { warn++; issues.push('NOTE: ' + desc); }

console.log('╔══════════════════════════════════════════════════════════╗');
console.log('║        KALKAL CROSS-VERIFICATION REPORT                ║');
console.log('╚══════════════════════════════════════════════════════════╝');
console.log();

// 1. EPOCH
console.log('1. EPOCH VERIFICATION');
const kalkalEpochIIa = Cal.hijriToJD(1, 1, 1, 'IIa');
const kalkalEpochIIc = Cal.hijriToJD(1, 1, 1, 'IIc');
check('IIa epoch matches Fourmilab', kalkalEpochIIa, REF_EPOCH);
check('IIc epoch matches Fourmilab', kalkalEpochIIc, REF_EPOCH);
const epochJul = Cal.jdToJulian(kalkalEpochIIc);
check('Epoch Julian date', epochJul.year * 10000 + epochJul.month * 100 + epochJul.day, 6220716);
console.log('   Fourmilab: JD ' + REF_EPOCH + ' = 16 Jul 622 Julian');
console.log('   kalkal IIa: JD ' + kalkalEpochIIa, kalkalEpochIIa === REF_EPOCH ? '✓' : '✗');
console.log('   kalkal IIc: JD ' + kalkalEpochIIc, kalkalEpochIIc === REF_EPOCH ? '✓' : '✗');
console.log('   Julian: ' + epochJul.year + '/' + epochJul.month + '/' + epochJul.day, '✓');
console.log();

// 2. GREGORIAN ↔ JD
console.log('2. GREGORIAN ↔ JD (vs Meeus reference)');
const gregTests = [
  [2000, 1, 1, 2451544.5], [1582, 10, 15, 2299160.5],
  [2024, 7, 8, 2460499.5], [1900, 1, 1, 2415020.5],
];
for (const [y, m, d, expectedJD] of gregTests) {
  const kalJD = Cal.gregorianToJD(y, m, d);
  const refJD = refGregToJD(y, m, d);
  check('Greg ' + y + '/' + m + '/' + d + ' JD', kalJD, expectedJD);
  console.log('   ' + y + '/' + m + '/' + d + ' → kal: ' + kalJD + ', ref: ' + refJD + ', expected: ' + expectedJD,
    kalJD === expectedJD ? '✓' : '✗');
}
console.log();

// 3. HIJRI → GREGORIAN (IIa vs Fourmilab)
console.log('3. HIJRI → GREGORIAN (IIa vs Fourmilab reference)');
const hijriTests = [
  [1, 1, 1], [2, 9, 17], [100, 1, 1], [500, 1, 1],
  [1000, 1, 1], [1200, 1, 1], [1400, 1, 1],
  [1443, 8, 15], [1445, 9, 1], [1446, 1, 1], [1447, 1, 1],
];
let iiaMatches = 0;
for (const [hy, hm, hd] of hijriTests) {
  const kalJD = Cal.hijriToJD(hy, hm, hd, 'IIa');
  const refJD = refHijriToJD(hy, hm, hd);
  const kalG = Cal.jdToGregorian(kalJD);
  const refG = refJDToGreg(refJD);
  const jdMatch = kalJD === refJD;
  if (jdMatch) iiaMatches++;
  check('H ' + hy + '/' + hm + '/' + hd + ' IIa JD', kalJD, refJD);
  console.log('   H ' + hy + '/' + hm + '/' + hd +
    ' → kal JD ' + kalJD + ' (G ' + kalG.year + '/' + kalG.month + '/' + kalG.day +
    ') | ref JD ' + refJD + ' (G ' + refG.year + '/' + refG.month + '/' + refG.day + ')',
    jdMatch ? '✓' : '✗ diff=' + (kalJD - refJD));
}
console.log('   IIa match rate: ' + iiaMatches + '/' + hijriTests.length);
console.log();

// 4. ROUND-TRIP H→JD→H (all variants)
console.log('4. ROUND-TRIP H→JD→H (all variants, ~2000 dates each)');
const variants = ['IIc', 'IIa', 'IIIa', 'IVa'];
for (const v of variants) {
  let ok = 0, total = 0;
  for (let y = 1; y <= 1500; y += 3) {
    for (let m = 1; m <= 12; m += 3) {
      const d = 1 + (y * m) % 28;
      if (d > Cal.hijriMonthLength(y, m, v)) continue;
      total++;
      const jd = Cal.hijriToJD(y, m, d, v);
      const back = Cal.jdToHijri(jd, v);
      if (back.year === y && back.month === m && back.day === d) ok++;
    }
  }
  const allOk = ok === total;
  if (allOk) pass++; else fail++;
  console.log('   ' + v + ': ' + ok + '/' + total, allOk ? '✓' : '✗');
}
console.log();

// 5. G→H→G round-trip
console.log('5. ROUND-TRIP G→H→G (IIc, 600+ dates across 1400 years)');
let grtOk = 0, grtTotal = 0;
for (let y = 700; y <= 2100; y += 7) {
  for (let m = 1; m <= 12; m += 4) {
    grtTotal++;
    const jd = Cal.gregorianToJD(y, m, 15);
    const h = Cal.jdToHijri(jd, 'IIc');
    const jdBack = Cal.hijriToJD(h.year, h.month, h.day, 'IIc');
    if (jd === jdBack) grtOk++;
  }
}
console.log('   ' + grtOk + '/' + grtTotal, grtOk === grtTotal ? '✓' : '✗');
if (grtOk === grtTotal) pass++; else fail++;
console.log();

// 6. vs Intl.DateTimeFormat islamic-civil (IIa)
console.log('6. vs Intl.DateTimeFormat islamic-civil');
const intlCases = [
  { g: [2000, 1, 1], intlH: [1420, 9, 24] },
  { g: [2024, 1, 1], intlH: [1445, 6, 19] },
  { g: [2026, 3, 21], intlH: [1447, 10, 2] },
];
for (const tc of intlCases) {
  const jd = Cal.gregorianToJD(...tc.g);
  const hIIa = Cal.jdToHijri(jd, 'IIa');
  const hIIc = Cal.jdToHijri(jd, 'IIc');
  const iiaMatch = hIIa.year === tc.intlH[0] && hIIa.month === tc.intlH[1] && hIIa.day === tc.intlH[2];
  const iicMatch = hIIc.year === tc.intlH[0] && hIIc.month === tc.intlH[1] && hIIc.day === tc.intlH[2];
  if (iiaMatch) pass++; else { fail++; issues.push('Intl mismatch IIa: G ' + tc.g + ' got ' + hIIa.year + '/' + hIIa.month + '/' + hIIa.day); }
  console.log('   G ' + tc.g.join('/') + ' → IIa: ' + hIIa.year + '/' + hIIa.month + '/' + hIIa.day +
    (iiaMatch ? ' ✓' : ' ✗') + ' | IIc: ' + hIIc.year + '/' + hIIc.month + '/' + hIIc.day +
    (iicMatch ? ' (=Intl)' : '') + ' | Intl: ' + tc.intlH.join('/'));
}
console.log();

// 7. vs Python hijri-converter (Umm al-Qura)
console.log('7. vs Python hijri-converter (Umm al-Qura, observation-based)');
console.log('   (1-2 day differences from tabular are expected)');
const pythonH2G = [
  { h: [1400, 1, 1], pyG: [1979, 11, 20] },
  { h: [1443, 8, 15], pyG: [2022, 3, 18] },
  { h: [1445, 9, 1], pyG: [2024, 3, 11] },
  { h: [1446, 1, 1], pyG: [2024, 7, 7] },
  { h: [1447, 1, 1], pyG: [2025, 6, 26] },
];
const pyGtoH = [
  { g: [2000, 1, 1], pyH: [1420, 9, 24] },
  { g: [2024, 1, 1], pyH: [1445, 6, 19] },
  { g: [2026, 3, 21], pyH: [1447, 10, 2] },
];

for (const tc of pythonH2G) {
  const jdIIc = Cal.hijriToJD(...tc.h, 'IIc');
  const gIIc = Cal.jdToGregorian(jdIIc);
  const jdIIa = Cal.hijriToJD(...tc.h, 'IIa');
  const gIIa = Cal.jdToGregorian(jdIIa);
  const pyJD = refGregToJD(...tc.pyG);
  const diffIIc = jdIIc - pyJD;
  const diffIIa = jdIIa - pyJD;
  const tag = diffIIc === 0 ? '✓' : (Math.abs(diffIIc) <= 2 ? '~' + diffIIc + 'd' : '✗ ' + diffIIc + 'd');
  console.log('   H ' + tc.h.join('/') + ' → IIc: G ' + gIIc.year + '/' + gIIc.month + '/' + gIIc.day +
    ' (' + tag + ') | IIa: G ' + gIIa.year + '/' + gIIa.month + '/' + gIIa.day +
    ' (' + (diffIIa === 0 ? '✓' : '~' + diffIIa + 'd') + ') | Py: G ' + tc.pyG.join('/'));
  if (Math.abs(diffIIc) <= 2) pass++; else fail++;
}

for (const tc of pyGtoH) {
  const jd = Cal.gregorianToJD(...tc.g);
  const hIIc = Cal.jdToHijri(jd, 'IIc');
  const match = hIIc.year === tc.pyH[0] && hIIc.month === tc.pyH[1] && hIIc.day === tc.pyH[2];
  console.log('   G ' + tc.g.join('/') + ' → IIc: H ' + hIIc.year + '/' + hIIc.month + '/' + hIIc.day +
    ' | Py: H ' + tc.pyH.join('/'), match ? '✓' : 'diff');
  if (match) pass++; else note('Py G→H diff: kal ' + hIIc.year + '/' + hIIc.month + '/' + hIIc.day + ' vs py ' + tc.pyH.join('/'));
}
console.log();

// 8. VARIANT DIVERGENCE
console.log('8. VARIANT DIVERGENCE (IIc vs IIa, first 5 years)');
let divergences = 0;
for (let y = 1; y <= 1500; y++) {
  const jdIIc = Cal.hijriToJD(y, 1, 1, 'IIc');
  const jdIIa = Cal.hijriToJD(y, 1, 1, 'IIa');
  if (jdIIc !== jdIIa) {
    divergences++;
    if (divergences <= 5) {
      const gIIc = Cal.jdToGregorian(jdIIc);
      const gIIa = Cal.jdToGregorian(jdIIa);
      console.log('   Year ' + y + ': IIc=' + gIIc.year + '/' + gIIc.month + '/' + gIIc.day +
        ' IIa=' + gIIa.year + '/' + gIIa.month + '/' + gIIa.day + ' (diff=' + (jdIIc - jdIIa) + 'd)');
    }
  }
}
console.log('   Total divergent years (1-1500): ' + divergences);
console.log();

// 9. OTHER CALENDARS vs Intl
console.log('9. OTHER CALENDARS vs Intl.DateTimeFormat');
const intlCoptic = [
  { g: [2024, 1, 7], intl: [1740, 4, 28] },
  { g: [2026, 3, 21], intl: [1742, 7, 12] },
];
for (const tc of intlCoptic) {
  const jd = Cal.gregorianToJD(...tc.g);
  const cop = Cal.jdToCoptic(jd);
  const match = cop.year === tc.intl[0] && cop.month === tc.intl[1] && cop.day === tc.intl[2];
  console.log('   [coptic] G ' + tc.g.join('/') + ' → kal: ' + cop.year + '/' + cop.month + '/' + cop.day +
    ' | Intl: ' + tc.intl.join('/'), match ? '✓' : '✗');
  if (match) pass++; else { fail++; issues.push('Coptic: kal ' + cop.year + '/' + cop.month + '/' + cop.day + ' vs Intl ' + tc.intl.join('/')); }
}

const intlEth = [
  { g: [2023, 9, 12], intl: [2016, 1, 1] },
  { g: [2026, 3, 21], intl: [2018, 7, 12] },
];
for (const tc of intlEth) {
  const jd = Cal.gregorianToJD(...tc.g);
  const eth = Cal.jdToEthiopian(jd);
  const match = eth.year === tc.intl[0] && eth.month === tc.intl[1] && eth.day === tc.intl[2];
  console.log('   [ethiopian] G ' + tc.g.join('/') + ' → kal: ' + eth.year + '/' + eth.month + '/' + eth.day +
    ' | Intl: ' + tc.intl.join('/'), match ? '✓' : '✗');
  if (match) pass++; else { fail++; issues.push('Ethiopian: kal ' + eth.year + '/' + eth.month + '/' + eth.day + ' vs Intl ' + tc.intl.join('/')); }
}

const intlPersian = [
  { g: [2025, 3, 21], intl: [1404, 1, 1] },
  { g: [2026, 3, 21], intl: [1405, 1, 1] },
];
for (const tc of intlPersian) {
  const jd = Cal.gregorianToJD(...tc.g);
  const sh = Cal.jdToSolarHijri(jd);
  const match = sh.year === tc.intl[0] && sh.month === tc.intl[1] && sh.day === tc.intl[2];
  console.log('   [solarHijri] G ' + tc.g.join('/') + ' → kal: ' + sh.year + '/' + sh.month + '/' + sh.day +
    ' | Intl: ' + tc.intl.join('/'), match ? '✓' : '✗');
  if (match) pass++; else { fail++; issues.push('Solar Hijri: kal ' + sh.year + '/' + sh.month + '/' + sh.day + ' vs Intl ' + tc.intl.join('/')); }
}
console.log();

// 10. JULIAN/GREGORIAN CUTOVER
console.log('10. JULIAN/GREGORIAN CUTOVER');
const lastJulJD = Cal.julianToJD(1582, 10, 4);
const firstGregJD = Cal.gregorianToJD(1582, 10, 15);
check('Cutover JD continuity', firstGregJD - lastJulJD, 1);
console.log('   4 Oct 1582 Jul → JD ' + lastJulJD);
console.log('   15 Oct 1582 Greg → JD ' + firstGregJD);
console.log('   Diff: ' + (firstGregJD - lastJulJD), firstGregJD - lastJulJD === 1 ? '✓' : '✗');

const hBefore = Cal.jdToHijri(lastJulJD, 'IIc');
const hAfter = Cal.jdToHijri(firstGregJD, 'IIc');
const hijriCont = (hAfter.day - hBefore.day === 1) || (hAfter.day === 1);
console.log('   Hijri: ' + hBefore.year + '/' + hBefore.month + '/' + hBefore.day +
  ' → ' + hAfter.year + '/' + hAfter.month + '/' + hAfter.day, hijriCont ? '✓' : '✗');
if (hijriCont) pass++; else fail++;
console.log();

// SUMMARY
console.log('════════════════════════════════════════════════════════');
console.log('RESULTS: ' + pass + ' passed, ' + fail + ' failed, ' + warn + ' notes');
console.log('════════════════════════════════════════════════════════');
if (issues.length > 0) {
  console.log();
  console.log('Issues:');
  for (const i of issues) console.log('  ' + i);
}

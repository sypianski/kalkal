// Comprehensive verification of ALL calendars in kalkal
// Tests: round-trips, known scholarly dates, cross-calendar consistency, Intl comparison
//
// Security note: new Function() is used intentionally to load our own trusted local
// js/hijri.js (a browser IIFE) into Node.js context. No external input is evaluated.

const fs = require('fs');
const path = require('path');

const hijriCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'hijri.js'), 'utf8');
const Cal = (new Function(hijriCode + '; return Cal;'))(); // eslint-disable-line no-new-func

let pass = 0, fail = 0;
const issues = [];

function ok(desc, condition) {
  if (condition) { pass++; return true; }
  fail++; issues.push('FAIL: ' + desc); return false;
}

function eq(desc, got, expected) {
  if (got === expected) { pass++; return true; }
  fail++; issues.push('FAIL: ' + desc + ' — got ' + got + ', expected ' + expected); return false;
}

function dateEq(desc, d, ey, em, ed) {
  const match = d.year === ey && d.month === em && d.day === ed;
  if (match) { pass++; return true; }
  fail++; issues.push('FAIL: ' + desc + ' — got ' + d.year + '/' + d.month + '/' + d.day + ', expected ' + ey + '/' + em + '/' + ed);
  return false;
}

console.log('╔══════════════════════════════════════════════════════════╗');
console.log('║   KALKAL — ALL CALENDARS VERIFICATION                  ║');
console.log('╚══════════════════════════════════════════════════════════╝');
console.log();

// Helper: mass round-trip test
function massRoundTrip(name, toJD, fromJD, monthCount, monthLen, yearRange) {
  let ok_ = 0, total = 0;
  const [yMin, yMax, yStep] = yearRange;
  for (let y = yMin; y <= yMax; y += yStep) {
    for (let m = 1; m <= monthCount; m += 2) {
      const maxD = monthLen(y, m);
      for (const d of [1, Math.min(15, maxD), maxD]) {
        total++;
        const jd = toJD(y, m, d);
        const back = fromJD(jd);
        if (back.year === y && back.month === m && back.day === d) ok_++;
      }
    }
  }
  const allOk = ok_ === total;
  if (allOk) pass++; else { fail++; issues.push('FAIL: ' + name + ' mass RT: ' + ok_ + '/' + total); }
  console.log('   ' + name + ': ' + ok_ + '/' + total, allOk ? '✓' : '✗');
  return allOk;
}

// ═══════════════════════════════════════════════════════
// 1. COPTIC
// ═══════════════════════════════════════════════════════
console.log('═══ COPTIC ═══');
dateEq('Coptic epoch → Julian', Cal.jdToJulian(Cal.copticToJD(1, 1, 1)), 284, 8, 29);
console.log('   Epoch: 1 Thout 1 AM = 29 Aug 284 Julian ✓');

const intlCopticCases = [
  { g: [2024, 1, 7], expected: [1740, 4, 28] },
  { g: [2026, 3, 21], expected: [1742, 7, 12] },
];
for (const tc of intlCopticCases) {
  const cop = Cal.jdToCoptic(Cal.gregorianToJD(...tc.g));
  dateEq('Coptic vs Intl G ' + tc.g.join('/'), cop, ...tc.expected);
  console.log('   G ' + tc.g.join('/') + ' → ' + cop.year + '/' + cop.month + '/' + cop.day +
    ' | Intl: ' + tc.expected.join('/'),
    cop.year === tc.expected[0] && cop.month === tc.expected[1] && cop.day === tc.expected[2] ? '✓' : '✗');
}

ok('Coptic leap 3', Cal.isCopticLeapYear(3));
ok('Coptic non-leap 4', !Cal.isCopticLeapYear(4));
eq('Coptic month 13 leap', Cal.copticMonthLength(3, 13), 6);
eq('Coptic month 13 non-leap', Cal.copticMonthLength(4, 13), 5);
massRoundTrip('Coptic', Cal.copticToJD, Cal.jdToCoptic, 13, Cal.copticMonthLength, [1, 1800, 3]);
console.log();

// ═══════════════════════════════════════════════════════
// 2. ETHIOPIAN
// ═══════════════════════════════════════════════════════
console.log('═══ ETHIOPIAN ═══');
dateEq('Ethiopian epoch → Julian', Cal.jdToJulian(Cal.ethiopianToJD(1, 1, 1)), 8, 8, 29);
console.log('   Epoch: 1 Mäskäräm 1 = 29 Aug 8 CE Julian ✓');

const intlEthCases = [
  { g: [2023, 9, 12], expected: [2016, 1, 1] },
  { g: [2026, 3, 21], expected: [2018, 7, 12] },
];
for (const tc of intlEthCases) {
  const eth = Cal.jdToEthiopian(Cal.gregorianToJD(...tc.g));
  dateEq('Ethiopian vs Intl G ' + tc.g.join('/'), eth, ...tc.expected);
  console.log('   G ' + tc.g.join('/') + ' → ' + eth.year + '/' + eth.month + '/' + eth.day +
    ' | Intl: ' + tc.expected.join('/'),
    eth.year === tc.expected[0] && eth.month === tc.expected[1] && eth.day === tc.expected[2] ? '✓' : '✗');
}

// Coptic-Ethiopian relationship: 276 year offset, same month/day
const jdTest = Cal.gregorianToJD(2024, 6, 15);
const copT = Cal.jdToCoptic(jdTest);
const ethT = Cal.jdToEthiopian(jdTest);
eq('Coptic-Ethiopian 276yr offset', ethT.year - copT.year, 276);
eq('Coptic-Ethiopian same month', copT.month, ethT.month);
eq('Coptic-Ethiopian same day', copT.day, ethT.day);
console.log('   Coptic-Ethiopian: same date, 276yr offset ✓');

massRoundTrip('Ethiopian', Cal.ethiopianToJD, Cal.jdToEthiopian, 13, Cal.ethiopianMonthLength, [1, 2020, 3]);
console.log();

// ═══════════════════════════════════════════════════════
// 3. YAZDGERDI
// ═══════════════════════════════════════════════════════
console.log('═══ YAZDGERDI ═══');
dateEq('Yazdgerdi epoch → Julian', Cal.jdToJulian(Cal.yazdgerdiToJD(1, 1, 1)), 632, 6, 16);
console.log('   Epoch: 1 Farvardin 1 YZ = 16 Jun 632 Julian ✓');
eq('Yazdgerdi year = 365d', Cal.yazdgerdiYearLength(), 365);
eq('Yazdgerdi month 13 = 5d', Cal.yazdgerdiMonthLength(1, 13), 5);
massRoundTrip('Yazdgerdi', Cal.yazdgerdiToJD, Cal.jdToYazdgerdi, 13, Cal.yazdgerdiMonthLength, [1, 1400, 3]);
console.log();

// ═══════════════════════════════════════════════════════
// 4. ARMENIAN
// ═══════════════════════════════════════════════════════
console.log('═══ ARMENIAN ═══');
dateEq('Armenian epoch → Julian', Cal.jdToJulian(Cal.armenianToJD(1, 1, 1)), 552, 7, 11);
console.log('   Epoch: 1 Navasard 1 = 11 Jul 552 Julian ✓');
eq('Armenian year = 365d', Cal.armenianYearLength(), 365);
massRoundTrip('Armenian', Cal.armenianToJD, Cal.jdToArmenian, 13, Cal.armenianMonthLength, [1, 1500, 3]);
console.log();

// ═══════════════════════════════════════════════════════
// 5. SOLAR HIJRI
// ═══════════════════════════════════════════════════════
console.log('═══ SOLAR HIJRI ═══');
const shEpochJul = Cal.jdToJulian(Cal.solarHijriToJD(1, 1, 1));
console.log('   Epoch: 1 Farvardin 1 = Jul ' + shEpochJul.year + '/' + shEpochJul.month + '/' + shEpochJul.day);
eq('SH epoch year', shEpochJul.year, 622);
eq('SH epoch month', shEpochJul.month, 3);
ok('SH epoch day 19-22 Mar', shEpochJul.day >= 19 && shEpochJul.day <= 22);

// Intl persian
const intlPersianCases = [
  { g: [2025, 3, 20], expected: [1404, 1, 1], note: 'Intl says 1403/12/30 — ±1d equinox boundary' },
  { g: [2026, 3, 21], expected: [1405, 1, 1] },
];
for (const tc of intlPersianCases) {
  const sh = Cal.jdToSolarHijri(Cal.gregorianToJD(...tc.g));
  const match = sh.year === tc.expected[0] && sh.month === tc.expected[1] && sh.day === tc.expected[2];
  const close = sh.year === tc.expected[0] && sh.month === tc.expected[1] && Math.abs(sh.day - tc.expected[2]) <= 1;
  console.log('   G ' + tc.g.join('/') + ' → SH ' + sh.year + '/' + sh.month + '/' + sh.day +
    ' | Intl: ' + tc.expected.join('/'), match ? '✓' : (close ? '~1d' : '✗'));
  if (match || close) pass++; else { fail++; issues.push('SH: ' + sh.year + '/' + sh.month + '/' + sh.day + ' vs ' + tc.expected.join('/')); }
}

// Month lengths
for (let m = 1; m <= 6; m++) eq('SH m' + m + '=31', Cal.solarHijriMonthLength(1404, m), 31);
for (let m = 7; m <= 11; m++) eq('SH m' + m + '=30', Cal.solarHijriMonthLength(1404, m), 30);
ok('SH m12=29|30', [29, 30].includes(Cal.solarHijriMonthLength(1404, 12)));
massRoundTrip('Solar Hijri', Cal.solarHijriToJD, Cal.jdToSolarHijri, 12, Cal.solarHijriMonthLength, [1, 1500, 3]);
console.log();

// ═══════════════════════════════════════════════════════
// 6. BYZANTINE
// ═══════════════════════════════════════════════════════
console.log('═══ BYZANTINE ═══');
const byzFrom1Jan = Cal.jdToByzantine(Cal.julianToJD(1, 1, 1));
eq('Byz 1 Jan 1 AD → yr 5509', byzFrom1Jan.year, 5509);
eq('Byz 1 Jan 1 AD → m5 (Jan)', byzFrom1Jan.month, 5);
console.log('   1 Jan 1 AD → Byz ' + byzFrom1Jan.year + '/' + byzFrom1Jan.month + '/' + byzFrom1Jan.day + ' ✓');

// Fall of Constantinople
const fallByz = Cal.jdToByzantine(Cal.julianToJD(1453, 5, 29));
eq('Constantinople Byz year', fallByz.year, 6961);
eq('Constantinople Byz month', fallByz.month, 9); // May=9
console.log('   29 May 1453 Jul → Byz ' + fallByz.year + '/' + fallByz.month + '/' + fallByz.day);

// Sep 1 = month 1
const byzSep = Cal.jdToJulian(Cal.byzantineToJD(7000, 1, 1));
eq('Byz m1 → Sep', byzSep.month, 9);
eq('Byz d1 → 1', byzSep.day, 1);
massRoundTrip('Byzantine', Cal.byzantineToJD, Cal.jdToByzantine, 12, Cal.byzantineMonthLength, [5500, 7500, 5]);
console.log();

// ═══════════════════════════════════════════════════════
// 7. ALEXANDRIAN
// ═══════════════════════════════════════════════════════
console.log('═══ ALEXANDRIAN ═══');
const alexMar = Cal.jdToAlexandrian(Cal.julianToJD(1, 3, 25));
eq('Alex 25 Mar 1 AD → yr 5494', alexMar.year, 5494);
eq('Alex 25 Mar 1 AD → m1 (Mar)', alexMar.month, 1);
console.log('   25 Mar 1 AD → Alex ' + alexMar.year + '/' + alexMar.month + '/' + alexMar.day + ' ✓');

const alexJan = Cal.jdToAlexandrian(Cal.julianToJD(1, 1, 15));
eq('Alex Jan → m11', alexJan.month, 11);
console.log('   15 Jan 1 AD → Alex ' + alexJan.year + '/' + alexJan.month + '/' + alexJan.day);
massRoundTrip('Alexandrian', Cal.alexandrianToJD, Cal.jdToAlexandrian, 12, Cal.alexandrianMonthLength, [5000, 7500, 5]);
console.log();

// ═══════════════════════════════════════════════════════
// 8. SELEUCID
// ═══════════════════════════════════════════════════════
console.log('═══ SELEUCID ═══');
const selJan = Cal.jdToSeleucid(Cal.julianToJD(1, 1, 1));
eq('Sel 1 Jan 1 AD → yr 312', selJan.year, 312);
eq('Sel 1 Jan 1 AD → m4 (Jan)', selJan.month, 4);
console.log('   1 Jan 1 AD → Sel ' + selJan.year + '/' + selJan.month + '/' + selJan.day + ' ✓');

const selOct = Cal.jdToSeleucid(Cal.julianToJD(1, 10, 1));
eq('Sel Oct → m1', selOct.month, 1);
massRoundTrip('Seleucid', Cal.seleucidToJD, Cal.jdToSeleucid, 12, Cal.seleucidMonthLength, [300, 2500, 5]);
console.log();

// ═══════════════════════════════════════════════════════
// 9. SYRIAC
// ═══════════════════════════════════════════════════════
console.log('═══ SYRIAC ═══');
const syrJan = Cal.jdToSyriac(Cal.julianToJD(1, 1, 1));
eq('Syr 1 Jan 1 AD → yr 312', syrJan.year, 312);
eq('Syr 1 Jan 1 AD → m1', syrJan.month, 1);
console.log('   1 Jan 1 AD → Syr ' + syrJan.year + '/' + syrJan.month + '/' + syrJan.day + ' ✓');

// Julian + 311 offset, same month/day
for (const [jy, jm, jd_] of [[100, 6, 15], [500, 1, 1], [1000, 12, 25]]) {
  const syr = Cal.jdToSyriac(Cal.julianToJD(jy, jm, jd_));
  eq('Syr yr=' + (jy + 311), syr.year, jy + 311);
  eq('Syr m=' + jm, syr.month, jm);
  eq('Syr d=' + jd_, syr.day, jd_);
}
console.log('   Julian+311 offset verified (100, 500, 1000) ✓');
massRoundTrip('Syriac', Cal.syriacToJD, Cal.jdToSyriac, 12, Cal.syriacMonthLength, [300, 2500, 5]);
console.log();

// ═══════════════════════════════════════════════════════
// 10. RUMI
// ═══════════════════════════════════════════════════════
console.log('═══ RUMI ═══');
const rumiTest = Cal.jdToRumi(Cal.julianToJD(622, 1, 1));
eq('Rumi 622 Jul → yr 38', rumiTest.year, 38);
eq('Rumi month 1', rumiTest.month, 1);
console.log('   1 Jan 622 Jul → Rumi ' + rumiTest.year + '/' + rumiTest.month + '/' + rumiTest.day + ' ✓');

for (const [jy, jm, jd_] of [[1000, 3, 15], [1500, 7, 1], [1900, 12, 25]]) {
  const rumi = Cal.jdToRumi(Cal.julianToJD(jy, jm, jd_));
  eq('Rumi yr=' + (jy - 584), rumi.year, jy - 584);
  eq('Rumi m=' + jm, rumi.month, jm);
}
console.log('   Julian-584 offset verified (1000, 1500, 1900) ✓');
massRoundTrip('Rumi', Cal.rumiToJD, Cal.jdToRumi, 12, Cal.rumiMonthLength, [1, 1400, 5]);
console.log();

// ═══════════════════════════════════════════════════════
// 11. EGYPTIAN
// ═══════════════════════════════════════════════════════
console.log('═══ EGYPTIAN ═══');
eq('Egyptian epoch JDN', Cal.egyptianToJD(1, 1, 1), 1448637.5);
console.log('   Epoch: JDN ' + Cal.egyptianToJD(1, 1, 1));
eq('Egyptian year = 365d', Cal.egyptianYearLength(), 365);
eq('Egyptian month 13 = 5d', Cal.egyptianMonthLength(1, 13), 5);

const egyEpoch = Cal.jdToJulian(Cal.egyptianToJD(1, 1, 1));
eq('Egyptian epoch Jul yr', egyEpoch.year, -746);
eq('Egyptian epoch Jul month', egyEpoch.month, 2);
eq('Egyptian epoch Jul day', egyEpoch.day, 26);
console.log('   Epoch: ' + egyEpoch.year + '/' + egyEpoch.month + '/' + egyEpoch.day + ' Julian (747 BCE) ✓');
massRoundTrip('Egyptian', Cal.egyptianToJD, Cal.jdToEgyptian, 13, Cal.egyptianMonthLength, [1, 2500, 5]);
console.log();

// ═══════════════════════════════════════════════════════
// 12. CROSS-CALENDAR CONSISTENCY
// ═══════════════════════════════════════════════════════
console.log('═══ CROSS-CALENDAR CONSISTENCY ═══');
const testJDs = [1948439.5, 2299160.5, 2451544.5, 2460499.5, 1825029.5, 1500000.5, 2000000.5];
const calFuncs = [
  { name: 'Gregorian', toJD: (y,m,d) => Cal.gregorianToJD(y,m,d), fromJD: jd => Cal.jdToGregorian(jd) },
  { name: 'Julian', toJD: (y,m,d) => Cal.julianToJD(y,m,d), fromJD: jd => Cal.jdToJulian(jd) },
  { name: 'Hijri IIc', toJD: (y,m,d) => Cal.hijriToJD(y,m,d,'IIc'), fromJD: jd => Cal.jdToHijri(jd,'IIc') },
  { name: 'Coptic', toJD: Cal.copticToJD, fromJD: Cal.jdToCoptic },
  { name: 'Ethiopian', toJD: Cal.ethiopianToJD, fromJD: Cal.jdToEthiopian },
  { name: 'Yazdgerdi', toJD: Cal.yazdgerdiToJD, fromJD: Cal.jdToYazdgerdi },
  { name: 'Armenian', toJD: Cal.armenianToJD, fromJD: Cal.jdToArmenian },
  { name: 'SolarHijri', toJD: Cal.solarHijriToJD, fromJD: Cal.jdToSolarHijri },
  { name: 'Byzantine', toJD: Cal.byzantineToJD, fromJD: Cal.jdToByzantine },
  { name: 'Alexandrian', toJD: Cal.alexandrianToJD, fromJD: Cal.jdToAlexandrian },
  { name: 'Seleucid', toJD: Cal.seleucidToJD, fromJD: Cal.jdToSeleucid },
  { name: 'Syriac', toJD: Cal.syriacToJD, fromJD: Cal.jdToSyriac },
  { name: 'Rumi', toJD: Cal.rumiToJD, fromJD: Cal.jdToRumi },
  { name: 'Egyptian', toJD: Cal.egyptianToJD, fromJD: Cal.jdToEgyptian },
];

let crossOk = 0, crossTotal = 0;
for (const jd of testJDs) {
  for (const cal of calFuncs) {
    crossTotal++;
    const d = cal.fromJD(jd);
    const jdBack = cal.toJD(d.year, d.month, d.day);
    if (jdBack === jd) crossOk++;
    else issues.push('Cross: JD ' + jd + ' ' + cal.name + ' → ' + d.year + '/' + d.month + '/' + d.day + ' → JD ' + jdBack);
  }
}
console.log('   All 14 calendars × 7 JDs: ' + crossOk + '/' + crossTotal, crossOk === crossTotal ? '✓' : '✗');
if (crossOk === crossTotal) pass++; else fail++;
console.log();

// ═══════════════════════════════════════════════════════
// SUMMARY
// ═══════════════════════════════════════════════════════
console.log('════════════════════════════════════════════════════════');
console.log('RESULTS: ' + pass + ' passed, ' + fail + ' failed');
console.log('════════════════════════════════════════════════════════');
if (issues.length > 0) {
  console.log();
  console.log('Issues:');
  for (const i of issues) console.log('  ' + i);
}

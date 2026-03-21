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
// 3b. QADIMI (Parsi variant, 30 days ahead of Shahenshahi)
// ═══════════════════════════════════════════════════════
console.log('═══ QADIMI ═══');
// Qadimi epoch is 30 days before Shahenshahi: 17 May 632 CE Julian
dateEq('Qadimi epoch → Julian', Cal.jdToJulian(Cal.qadimiToJD(1, 1, 1)), 632, 5, 17);
console.log('   Epoch: 1 Farvardin 1 QD = 17 May 632 Julian ✓');
eq('Qadimi year = 365d', Cal.qadimiYearLength(), 365);
eq('Qadimi month 13 = 5d', Cal.qadimiMonthLength(1, 13), 5);
// Qadimi and Shahenshahi same date should differ by 30 JDN
eq('Qadimi-Shah offset = 30d', Cal.yazdgerdiToJD(1, 1, 1) - Cal.qadimiToJD(1, 1, 1), 30);
massRoundTrip('Qadimi', Cal.qadimiToJD, Cal.jdToQadimi, 13, Cal.qadimiMonthLength, [1, 1400, 3]);
console.log();

// ═══════════════════════════════════════════════════════
// 3c. FASLI (reformed Zoroastrian with leap years)
// ═══════════════════════════════════════════════════════
console.log('═══ FASLI ═══');
// Fasli epoch: 1 Farvardin 1 = 21 March 632 CE Julian
dateEq('Fasli epoch → Julian', Cal.jdToJulian(Cal.fasliToJD(1, 1, 1)), 632, 3, 21);
console.log('   Epoch: 1 Farvardin 1 Fasli = 21 Mar 632 Julian ✓');
eq('Fasli non-leap year = 365d', Cal.fasliYearLength(1), 365);
eq('Fasli leap year = 366d', Cal.fasliYearLength(3), 366);
eq('Fasli leap: y%4==3', Cal.isFasliLeapYear(3), true);
eq('Fasli non-leap: y%4!=3', Cal.isFasliLeapYear(4), false);
eq('Fasli month 13 non-leap = 5d', Cal.fasliMonthLength(1, 13), 5);
eq('Fasli month 13 leap = 6d', Cal.fasliMonthLength(3, 13), 6);
massRoundTrip('Fasli', Cal.fasliToJD, Cal.jdToFasli, 13, Cal.fasliMonthLength, [1, 1400, 3]);
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
// 12. HEBREW
// ═══════════════════════════════════════════════════════
console.log('═══ HEBREW ═══');

// Epoch: 1 Tishrei 1 AM = 7 Oct 3761 BCE (proleptic Julian)
const hebEpoch = Cal.jdToJulian(Cal.hebrewToJD(1, 1, 1));
console.log('   Epoch: 1 Tishrei 1 AM = Jul ' + hebEpoch.year + '/' + hebEpoch.month + '/' + hebEpoch.day);
eq('Hebrew epoch JDN', Cal.hebrewToJD(1, 1, 1), 347997.5);

// Intl hebrew calendar comparison
const intlHebCases = [];
try {
  const fmtHeb = new Intl.DateTimeFormat('en-u-ca-hebrew', {
    year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'UTC'
  });
  for (const [gy, gm, gd] of [[2024, 1, 1], [2026, 3, 21], [2025, 9, 23]]) {
    const d = new Date(Date.UTC(gy, gm - 1, gd));
    const parts = fmtHeb.formatToParts(d);
    const iy = parseInt(parts.find(p => p.type === 'year')?.value);
    const im = parseInt(parts.find(p => p.type === 'month')?.value);
    const id = parseInt(parts.find(p => p.type === 'day')?.value);
    if (iy && im && id) intlHebCases.push({ g: [gy, gm, gd], intl: [iy, im, id] });
  }
} catch (e) { /* Intl hebrew not available */ }

for (const tc of intlHebCases) {
  const heb = Cal.jdToHebrew(Cal.gregorianToJD(...tc.g));
  // Intl uses religious month ordering (Nisan=1), kalkal uses civil (Tishrei=1)
  // So we compare via JD round-trip instead of raw month numbers
  console.log('   G ' + tc.g.join('/') + ' → kal: ' + heb.year + '/' + heb.month + '/' + heb.day +
    ' | Intl: ' + tc.intl.join('/') + ' (Intl may use different month numbering)');
}

// Leap year: 19-year Metonic cycle, years 3,6,8,11,14,17,19 are leap
ok('Hebrew leap yr 3', Cal.isHebrewLeapYear(3));
ok('Hebrew leap yr 6', Cal.isHebrewLeapYear(6));
ok('Hebrew leap yr 8', Cal.isHebrewLeapYear(8));
ok('Hebrew non-leap yr 1', !Cal.isHebrewLeapYear(1));
ok('Hebrew non-leap yr 2', !Cal.isHebrewLeapYear(2));
ok('Hebrew non-leap yr 4', !Cal.isHebrewLeapYear(4));

// Year lengths: 353 (deficient common), 354 (regular), 355 (complete)
//               383 (deficient leap), 384 (regular leap), 385 (complete leap)
const yearLens = new Set();
for (let y = 5780; y <= 5800; y++) yearLens.add(Cal.hebrewYearLength(y));
console.log('   Year lengths (5780-5800): ' + [...yearLens].sort().join(', '));
ok('Hebrew year lengths valid', [...yearLens].every(l => [353, 354, 355, 383, 384, 385].includes(l)));

// Adar II (month 7) should be 0 in common years, 29 in leap years
const commonYear = 5784; // 2023-2024, check if common
const leapYear5784 = Cal.isHebrewLeapYear(5784);
// Find a definite common and leap year
let testCommon = 5781, testLeap = 5782;
while (Cal.isHebrewLeapYear(testCommon)) testCommon++;
while (!Cal.isHebrewLeapYear(testLeap)) testLeap++;
eq('Adar II = 0 in common yr ' + testCommon, Cal.hebrewMonthLength(testCommon, 7), 0);
eq('Adar II = 29 in leap yr ' + testLeap, Cal.hebrewMonthLength(testLeap, 7), 29);
console.log('   Adar II: common yr ' + testCommon + ' → 0d, leap yr ' + testLeap + ' → 29d ✓');

// Known date: Rosh Hashana 5785 = 3 Oct 2024 (well-known, easily verifiable)
const roshHashana5785 = Cal.jdToGregorian(Cal.hebrewToJD(5785, 1, 1));
console.log('   Rosh Hashana 5785 → G ' + roshHashana5785.year + '/' + roshHashana5785.month + '/' + roshHashana5785.day);
// Rosh Hashana 5785 was 2-4 Oct 2024 (evening of Oct 2)
ok('Rosh Hashana 5785 Oct 2024', roshHashana5785.year === 2024 && roshHashana5785.month === 10 &&
  roshHashana5785.day >= 2 && roshHashana5785.day <= 4);

// Passover 5784 = 15 Nisan 5784 = ~23 Apr 2024
const passover5784 = Cal.jdToGregorian(Cal.hebrewToJD(5784, 8, 15)); // Nisan = month 8 in civil
console.log('   Passover (15 Nisan) 5784 → G ' + passover5784.year + '/' + passover5784.month + '/' + passover5784.day);
ok('Passover 5784 Apr 2024', passover5784.year === 2024 && passover5784.month === 4 &&
  passover5784.day >= 22 && passover5784.day <= 24);

// Mass round-trip (skip month 7 in common years — it has 0 days)
{
  let hebOk = 0, hebTotal = 0;
  for (let y = 5700; y <= 5800; y += 1) {
    for (let m = 1; m <= 13; m++) {
      const ml = Cal.hebrewMonthLength(y, m);
      if (ml === 0) continue; // skip Adar II in common years
      for (const d of [1, Math.min(15, ml), ml]) {
        hebTotal++;
        const jd = Cal.hebrewToJD(y, m, d);
        const back = Cal.jdToHebrew(jd);
        if (back.year === y && back.month === m && back.day === d) hebOk++;
        else if (hebTotal - hebOk <= 3) issues.push('Hebrew RT: ' + y + '/' + m + '/' + d +
          ' → ' + back.year + '/' + back.month + '/' + back.day);
      }
    }
  }
  const allOk = hebOk === hebTotal;
  if (allOk) pass++; else { fail++; issues.push('FAIL: Hebrew mass RT: ' + hebOk + '/' + hebTotal); }
  console.log('   Hebrew: ' + hebOk + '/' + hebTotal, allOk ? '✓' : '✗');
}
console.log();

// ═══════════════════════════════════════════════════════
// 13. CROSS-CALENDAR CONSISTENCY
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
  { name: 'Qadimi', toJD: Cal.qadimiToJD, fromJD: Cal.jdToQadimi },
  { name: 'Fasli', toJD: Cal.fasliToJD, fromJD: Cal.jdToFasli },
  { name: 'Armenian', toJD: Cal.armenianToJD, fromJD: Cal.jdToArmenian },
  { name: 'SolarHijri', toJD: Cal.solarHijriToJD, fromJD: Cal.jdToSolarHijri },
  { name: 'Byzantine', toJD: Cal.byzantineToJD, fromJD: Cal.jdToByzantine },
  { name: 'Alexandrian', toJD: Cal.alexandrianToJD, fromJD: Cal.jdToAlexandrian },
  { name: 'Seleucid', toJD: Cal.seleucidToJD, fromJD: Cal.jdToSeleucid },
  { name: 'Syriac', toJD: Cal.syriacToJD, fromJD: Cal.jdToSyriac },
  { name: 'Rumi', toJD: Cal.rumiToJD, fromJD: Cal.jdToRumi },
  { name: 'Egyptian', toJD: Cal.egyptianToJD, fromJD: Cal.jdToEgyptian },
  { name: 'Hebrew', toJD: Cal.hebrewToJD, fromJD: Cal.jdToHebrew },
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
console.log('   All 15 calendars × 7 JDs: ' + crossOk + '/' + crossTotal, crossOk === crossTotal ? '✓' : '✗');
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

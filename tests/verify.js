// Verification script — runs Cal functions and outputs test cases as JSON
// Usage: node tests/verify.js
// Note: eval() is used intentionally here to load the browser-targeted Cal module in Node.js

const fs = require('fs');
const path = require('path');

// Load Cal from hijri.js (browser IIFE → needs wrapping for Node)
const hijriCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'hijri.js'), 'utf8');
const Cal = (new Function(hijriCode + '; return Cal;'))(); // eslint-disable-line no-new-func

// ============================================================
// TEST CASES: known dates from multiple scholarly sources
// ============================================================

const TEST_CASES = [
  // Epoch
  { desc: 'Hijri epoch (1 Muharram 1 AH)', hijri: [1, 1, 1], julian: [622, 7, 16] },
  // Well-known historical dates
  { desc: 'Battle of Badr (17 Ramadan 2)', hijri: [2, 9, 17], julian: [624, 3, 13] },
  { desc: 'Fall of Baghdad (1258 CE)', gregorian: [1258, 2, 10], hijriExpected: { y: 656, m: 2 } },
  { desc: 'Ottoman conquest of Constantinople', julian: [1453, 5, 29], hijriExpected: { y: 857, m: 6 } },
  // Modern dates
  { desc: '1 Jan 2000', gregorian: [2000, 1, 1] },
  { desc: '1 Jan 2024', gregorian: [2024, 1, 1] },
  { desc: '21 Mar 2026 (today)', gregorian: [2026, 3, 21] },
  { desc: '1 Muharram 1446', hijri: [1446, 1, 1] },
  { desc: '1 Muharram 1447', hijri: [1447, 1, 1] },
  { desc: '1 Ramadan 1445', hijri: [1445, 9, 1] },
  // Edge: leap year in Hijri
  { desc: 'End of leap year 2 AH', hijri: [2, 12, 30] },
  { desc: 'End of non-leap year 1 AH', hijri: [1, 12, 29] },
  // Gregorian/Julian cutover boundary
  { desc: 'Last Julian day (4 Oct 1582)', julian: [1582, 10, 4] },
  { desc: 'First Gregorian day (15 Oct 1582)', gregorian: [1582, 10, 15] },
  // Additional spread
  { desc: '1 Muharram 100', hijri: [100, 1, 1] },
  { desc: '1 Muharram 500', hijri: [500, 1, 1] },
  { desc: '1 Muharram 1000', hijri: [1000, 1, 1] },
  { desc: '1 Muharram 1200', hijri: [1200, 1, 1] },
  { desc: '1 Muharram 1400', hijri: [1400, 1, 1] },
  { desc: '15 Shaban 1443', hijri: [1443, 8, 15] },
];

const VARIANTS = ['IIc', 'IIa', 'IIIa', 'IVa'];

const results = [];

for (const tc of TEST_CASES) {
  const entry = { desc: tc.desc, conversions: {} };

  if (tc.hijri) {
    const [hy, hm, hd] = tc.hijri;
    for (const v of VARIANTS) {
      const jd = Cal.hijriToJD(hy, hm, hd, v);
      const greg = Cal.jdToGregorian(jd);
      const jul = Cal.jdToJulian(jd);
      const dow = Cal.getDayOfWeek(jd);
      entry.conversions[v] = {
        hijri: { y: hy, m: hm, d: hd },
        jd, gregorian: greg, julian: jul, dow,
      };
      const backH = Cal.jdToHijri(jd, v);
      entry.conversions[v].roundTrip = {
        hijriBack: backH,
        match: backH.year === hy && backH.month === hm && backH.day === hd
      };
    }
  }

  if (tc.gregorian) {
    const [gy, gm, gd] = tc.gregorian;
    const jd = Cal.gregorianToJD(gy, gm, gd);
    for (const v of VARIANTS) {
      const h = Cal.jdToHijri(jd, v);
      if (!entry.conversions[v]) entry.conversions[v] = {};
      entry.conversions[v].fromGregorian = {
        gregorian: { y: gy, m: gm, d: gd }, jd, hijri: h, dow: Cal.getDayOfWeek(jd),
      };
      const jdBack = Cal.hijriToJD(h.year, h.month, h.day, v);
      entry.conversions[v].fromGregorian.roundTripJD = jdBack;
      entry.conversions[v].fromGregorian.roundTripMatch = (jdBack === jd);
    }
  }

  if (tc.julian) {
    const [jy, jm, jd_] = tc.julian;
    const jd = Cal.julianToJD(jy, jm, jd_);
    for (const v of VARIANTS) {
      const h = Cal.jdToHijri(jd, v);
      if (!entry.conversions[v]) entry.conversions[v] = {};
      entry.conversions[v].fromJulian = {
        julian: { y: jy, m: jm, d: jd_ }, jd, hijri: h, dow: Cal.getDayOfWeek(jd),
      };
    }
  }

  if (tc.hijriExpected) entry.expected = tc.hijriExpected;
  results.push(entry);
}

// ============================================================
// Other calendars: round-trip tests
// ============================================================

const calendarTests = [];

// Coptic
for (const tc of [
  { desc: 'Coptic 1 Thout 1 AM', coptic: [1, 1, 1], julianExpected: [284, 8, 29] },
  { desc: 'Coptic Christmas 1740', coptic: [1740, 4, 29] },
]) {
  const [cy, cm, cd] = tc.coptic;
  const jd = Cal.copticToJD(cy, cm, cd);
  const back = Cal.jdToCoptic(jd);
  calendarTests.push({
    calendar: 'coptic', desc: tc.desc,
    input: { y: cy, m: cm, d: cd }, jd,
    gregorian: Cal.jdToGregorian(jd), julian: Cal.jdToJulian(jd),
    roundTrip: back, match: back.year === cy && back.month === cm && back.day === cd,
    julianExpected: tc.julianExpected,
  });
}

// Ethiopian
for (const tc of [
  { desc: 'Ethiopian 1 Mäskäräm 1', eth: [1, 1, 1] },
  { desc: 'Ethiopian New Year 2016', eth: [2016, 1, 1] },
]) {
  const [ey, em, ed] = tc.eth;
  const jd = Cal.ethiopianToJD(ey, em, ed);
  const back = Cal.jdToEthiopian(jd);
  calendarTests.push({
    calendar: 'ethiopian', desc: tc.desc,
    input: { y: ey, m: em, d: ed }, jd,
    gregorian: Cal.jdToGregorian(jd),
    roundTrip: back, match: back.year === ey && back.month === em && back.day === ed,
  });
}

// Solar Hijri
for (const tc of [
  { desc: 'Nowruz 1404', sh: [1404, 1, 1] },
  { desc: 'Nowruz 1405', sh: [1405, 1, 1] },
  { desc: '1 Farvardin 1', sh: [1, 1, 1] },
]) {
  const [sy, sm, sd] = tc.sh;
  const jd = Cal.solarHijriToJD(sy, sm, sd);
  const back = Cal.jdToSolarHijri(jd);
  calendarTests.push({
    calendar: 'solarHijri', desc: tc.desc,
    input: { y: sy, m: sm, d: sd }, jd,
    gregorian: Cal.jdToGregorian(jd), julian: Cal.jdToJulian(jd),
    roundTrip: back, match: back.year === sy && back.month === sm && back.day === sd,
  });
}

// Output JSON for cross-referencing
const output = { hijriResults: results, calendarResults: calendarTests, timestamp: new Date().toISOString() };
fs.writeFileSync(path.join(__dirname, 'verify-output.json'), JSON.stringify(output, null, 2));

// ============================================================
// Pretty print
// ============================================================

console.log('=== KALKAL VERIFICATION ===\n');
console.log('--- Hijri ↔ Gregorian/Julian (Wüstenfeld IIc) ---\n');

for (const r of results) {
  const c = r.conversions['IIc'];
  if (c && c.hijri) {
    const g = c.gregorian, j = c.julian;
    const rt = c.roundTrip.match ? 'OK' : 'FAIL';
    console.log(`${r.desc}`);
    console.log(`  H ${c.hijri.y}/${c.hijri.m}/${c.hijri.d} → G ${g.year}/${g.month}/${g.day} | J ${j.year}/${j.month}/${j.day} | JD ${c.jd} | RT: ${rt}`);
  }
  if (c && c.fromGregorian) {
    const fg = c.fromGregorian;
    const rt = fg.roundTripMatch ? 'OK' : 'FAIL';
    console.log(`${r.desc}`);
    console.log(`  G ${fg.gregorian.y}/${fg.gregorian.m}/${fg.gregorian.d} → H ${fg.hijri.year}/${fg.hijri.month}/${fg.hijri.day} | JD ${fg.jd} | RT: ${rt}`);
    if (r.expected) console.log(`  Expected: ~${r.expected.y}/${r.expected.m}, Got: ${fg.hijri.year}/${fg.hijri.month}`);
  }
  if (c && c.fromJulian) {
    const fj = c.fromJulian;
    console.log(`${r.desc}`);
    console.log(`  Jul ${fj.julian.y}/${fj.julian.m}/${fj.julian.d} → H ${fj.hijri.year}/${fj.hijri.month}/${fj.hijri.day} | JD ${fj.jd}`);
    if (r.expected) console.log(`  Expected: ~${r.expected.y}/${r.expected.m}, Got: ${fj.hijri.year}/${fj.hijri.month}`);
  }
}

console.log('\n--- Other Calendars (round-trip) ---\n');
for (const ct of calendarTests) {
  const rt = ct.match ? 'OK' : 'FAIL';
  console.log(`[${ct.calendar}] ${ct.desc}: ${ct.input.y}/${ct.input.m}/${ct.input.d} → JD ${ct.jd} → G ${ct.gregorian.year}/${ct.gregorian.month}/${ct.gregorian.day} | RT: ${rt}`);
  if (ct.julianExpected) {
    const [ey, em, ed] = ct.julianExpected;
    const jm = ct.julian;
    const match = jm.year === ey && jm.month === em && jm.day === ed;
    console.log(`  Julian expected: ${ey}/${em}/${ed}, got: ${jm.year}/${jm.month}/${jm.day} → ${match ? 'OK' : 'MISMATCH'}`);
  }
}

console.log('\n--- Variant Comparison (1 Muharram 1446) ---\n');
for (const v of VARIANTS) {
  const jd = Cal.hijriToJD(1446, 1, 1, v);
  const g = Cal.jdToGregorian(jd);
  console.log(`  ${v}: JD ${jd} → ${g.year}-${String(g.month).padStart(2,'0')}-${String(g.day).padStart(2,'0')}`);
}

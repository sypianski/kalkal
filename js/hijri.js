// kalkal — Core calendar conversion algorithms
// Based on the Kuwaiti algorithm (tabular/arithmetic Islamic calendar)
// All conversions go through Julian Day Number (JDN) as intermediary

const Cal = (() => {
  // Hijri tabular calendar variants (differ only in which years of 30-year cycle are leap)
  const HIJRI_VARIANTS = {
    IIc:  [2, 5, 7, 10, 13, 16, 19, 21, 24, 26, 29], // Wüstenfeld — historiographic standard
    IIa:  [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29], // East Islamic civil, Microsoft/Kuwaiti
    IIIa: [2, 5, 8, 10, 13, 16, 19, 21, 24, 27, 29], // West Islamic civil
    IVa:  [2, 5, 8, 11, 13, 16, 19, 21, 24, 27, 30], // Ḥabash al-Ḥāsib
  };

  // Default variant
  const HIJRI_DEFAULT = 'IIc';

  // Hijri epoch in JDN (July 16, 622 CE Julian = 1 Muharram 1 AH)
  const HIJRI_EPOCH = 1948439.5;

  // Gregorian calendar adoption: October 15, 1582
  const GREGORIAN_CUTOVER_JD = 2299160.5;

  function isHijriLeapYear(year, variant) {
    const leaps = HIJRI_VARIANTS[variant || HIJRI_DEFAULT];
    return leaps.includes(((year - 1) % 30) + 1);
  }

  function hijriMonthLength(year, month, variant) {
    if (month < 1 || month > 12) return 0;
    if (month % 2 === 1) return 30;
    if (month === 12 && isHijriLeapYear(year, variant)) return 30;
    return 29;
  }

  function hijriYearLength(year, variant) {
    return isHijriLeapYear(year, variant) ? 355 : 354;
  }

  function isGregorianLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  function isJulianLeapYear(year) {
    return year % 4 === 0;
  }

  function gregorianMonthLength(year, month) {
    const lengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month === 2 && isGregorianLeapYear(year)) return 29;
    return lengths[month - 1];
  }

  function julianMonthLength(year, month) {
    const lengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month === 2 && isJulianLeapYear(year)) return 29;
    return lengths[month - 1];
  }

  // Gregorian date to Julian Day Number
  function gregorianToJD(year, month, day) {
    if (month <= 2) {
      year -= 1;
      month += 12;
    }
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (year + 4716)) +
           Math.floor(30.6001 * (month + 1)) +
           day + B - 1524.5;
  }

  // Julian (old calendar) date to Julian Day Number
  function julianToJD(year, month, day) {
    if (month <= 2) {
      year -= 1;
      month += 12;
    }
    return Math.floor(365.25 * (year + 4716)) +
           Math.floor(30.6001 * (month + 1)) +
           day - 1524.5;
  }

  // Julian Day Number to Gregorian date
  function jdToGregorian(jd) {
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

  // Julian Day Number to Julian (old calendar) date
  function jdToJulian(jd) {
    const z = Math.floor(jd + 0.5);
    const A = z;
    const B = A + 1524;
    const C = Math.floor((B - 122.1) / 365.25);
    const D = Math.floor(365.25 * C);
    const E = Math.floor((B - D) / 30.6001);

    const day = B - D - Math.floor(30.6001 * E);
    const month = E < 14 ? E - 1 : E - 13;
    const year = month > 2 ? C - 4716 : C - 4715;

    return { year, month, day };
  }

  // Count leap years from year 1 to year N inclusive
  function hijriLeapCountUpTo(N, variant) {
    const leaps = HIJRI_VARIANTS[variant || HIJRI_DEFAULT];
    const full = Math.floor(N / 30);
    const rem = N % 30;
    let partial = 0;
    for (let i = 0; i < leaps.length; i++) {
      if (leaps[i] <= rem) partial++; else break;
    }
    return full * 11 + partial;
  }

  // Hijri date to Julian Day Number
  function hijriToJD(year, month, day, variant) {
    return HIJRI_EPOCH
      + (year - 1) * 354 + hijriLeapCountUpTo(year - 1, variant)
      + Math.floor((month - 1) * 29.5 + 0.99)
      + (day - 1);
  }

  // Julian Day Number to Hijri date
  function jdToHijri(jd, variant) {
    const jd1 = Math.floor(jd) + 0.5;
    // Estimate year (354.36667 avg days/year)
    let year = Math.floor((jd1 - HIJRI_EPOCH) / 354.36667) + 1;
    // Adjust
    while (hijriToJD(year + 1, 1, 1, variant) <= jd1) year++;
    while (hijriToJD(year, 1, 1, variant) > jd1) year--;
    // Find month
    let month = 1;
    while (month < 12 && hijriToJD(year, month + 1, 1, variant) <= jd1) month++;
    const day = jd1 - hijriToJD(year, month, 1, variant) + 1;
    return { year, month, day: Math.round(day) };
  }

  // Composition functions
  function gregorianToHijri(gYear, gMonth, gDay) {
    const jd = gregorianToJD(gYear, gMonth, gDay);
    return { ...jdToHijri(jd), jd };
  }

  function hijriToGregorian(hYear, hMonth, hDay) {
    const jd = hijriToJD(hYear, hMonth, hDay);
    return { ...jdToGregorian(jd), jd };
  }

  function julianToHijri(jYear, jMonth, jDay) {
    const jd = julianToJD(jYear, jMonth, jDay);
    return { ...jdToHijri(jd), jd };
  }

  function hijriToJulian(hYear, hMonth, hDay) {
    const jd = hijriToJD(hYear, hMonth, hDay);
    return { ...jdToJulian(jd), jd };
  }

  // Auto-detect: use Julian before Oct 15, 1582; Gregorian after
  function civilToJD(year, month, day) {
    const jdGreg = gregorianToJD(year, month, day);
    if (jdGreg < GREGORIAN_CUTOVER_JD) {
      return julianToJD(year, month, day);
    }
    return jdGreg;
  }

  function jdToCivil(jd) {
    if (jd < GREGORIAN_CUTOVER_JD) {
      return { ...jdToJulian(jd), calendar: 'julian' };
    }
    return { ...jdToGregorian(jd), calendar: 'gregorian' };
  }

  // Day of week from JDN: 0=Sunday, 1=Monday, ..., 6=Saturday
  function getDayOfWeek(jd) {
    return Math.floor(jd + 1.5) % 7;
  }

  // Range: Gregorian month → overlapping Hijri period
  function gregorianMonthToHijriRange(gYear, gMonth) {
    const firstDay = gregorianToJD(gYear, gMonth, 1);
    const lastDay = gregorianToJD(gYear, gMonth, gregorianMonthLength(gYear, gMonth));
    const startHijri = jdToHijri(firstDay);
    const endHijri = jdToHijri(lastDay);

    const overlapping = [];
    let y = startHijri.year, m = startHijri.month;
    while (y < endHijri.year || (y === endHijri.year && m <= endHijri.month)) {
      overlapping.push({ year: y, month: m });
      m++;
      if (m > 12) { m = 1; y++; }
    }

    return {
      startGregorian: { year: gYear, month: gMonth, day: 1 },
      endGregorian: { year: gYear, month: gMonth, day: gregorianMonthLength(gYear, gMonth) },
      startHijri,
      endHijri,
      startJD: firstDay,
      endJD: lastDay,
      overlapping
    };
  }

  // Range: Julian month → overlapping Hijri period
  function julianMonthToHijriRange(jYear, jMonth) {
    const firstDay = julianToJD(jYear, jMonth, 1);
    const lastDay = julianToJD(jYear, jMonth, julianMonthLength(jYear, jMonth));
    const startHijri = jdToHijri(firstDay);
    const endHijri = jdToHijri(lastDay);

    const overlapping = [];
    let y = startHijri.year, m = startHijri.month;
    while (y < endHijri.year || (y === endHijri.year && m <= endHijri.month)) {
      overlapping.push({ year: y, month: m });
      m++;
      if (m > 12) { m = 1; y++; }
    }

    return {
      startJulian: { year: jYear, month: jMonth, day: 1 },
      endJulian: { year: jYear, month: jMonth, day: julianMonthLength(jYear, jMonth) },
      startHijri,
      endHijri,
      startJD: firstDay,
      endJD: lastDay,
      overlapping
    };
  }

  // Range: Hijri month → corresponding Gregorian/Julian period
  function hijriMonthToGregorianRange(hYear, hMonth) {
    const firstDay = hijriToJD(hYear, hMonth, 1);
    const lastDay = hijriToJD(hYear, hMonth, hijriMonthLength(hYear, hMonth));
    const startCivil = jdToCivil(firstDay);
    const endCivil = jdToCivil(lastDay);

    return {
      startHijri: { year: hYear, month: hMonth, day: 1 },
      endHijri: { year: hYear, month: hMonth, day: hijriMonthLength(hYear, hMonth) },
      startCivil,
      endCivil,
      startJD: firstDay,
      endJD: lastDay
    };
  }

  // Range: Hijri year → corresponding civil period + month breakdown
  function hijriYearToGregorianRange(hYear) {
    const firstDay = hijriToJD(hYear, 1, 1);
    const lastDay = hijriToJD(hYear, 12, hijriMonthLength(hYear, 12));
    const startCivil = jdToCivil(firstDay);
    const endCivil = jdToCivil(lastDay);

    const months = [];
    for (let m = 1; m <= 12; m++) {
      const mStart = hijriToJD(hYear, m, 1);
      const mEnd = hijriToJD(hYear, m, hijriMonthLength(hYear, m));
      months.push({
        month: m,
        days: hijriMonthLength(hYear, m),
        startCivil: jdToCivil(mStart),
        endCivil: jdToCivil(mEnd),
        startJD: mStart,
        endJD: mEnd
      });
    }

    return {
      year: hYear,
      leap: isHijriLeapYear(hYear),
      days: hijriYearLength(hYear),
      startCivil,
      endCivil,
      startJD: firstDay,
      endJD: lastDay,
      months
    };
  }

  // Range: Gregorian/Julian year → corresponding Hijri period + month breakdown
  function civilYearToHijriRange(cYear) {
    const isJulian = cYear < 1582;
    const toJD = isJulian ? julianToJD : gregorianToJD;
    const monthLen = isJulian ? julianMonthLength : gregorianMonthLength;

    const firstDay = toJD(cYear, 1, 1);
    const lastDay = toJD(cYear, 12, monthLen(cYear, 12));
    const startHijri = jdToHijri(firstDay);
    const endHijri = jdToHijri(lastDay);

    const overlapping = [];
    let y = startHijri.year, m = startHijri.month;
    while (y < endHijri.year || (y === endHijri.year && m <= endHijri.month)) {
      const mStartJD = hijriToJD(y, m, 1);
      const mEndJD = hijriToJD(y, m, hijriMonthLength(y, m));
      overlapping.push({ year: y, month: m, days: hijriMonthLength(y, m), startJD: mStartJD, endJD: mEndJD });
      m++;
      if (m > 12) { m = 1; y++; }
    }

    return {
      year: cYear,
      calendar: isJulian ? 'julian' : 'gregorian',
      startHijri,
      endHijri,
      startJD: firstDay,
      endJD: lastDay,
      overlapping
    };
  }

  // ================================================================
  // Coptic calendar (Era of Martyrs / Diocletian, epoch 29 Aug 284 CE Julian)
  // 12 months × 30 days + 5 (or 6 in leap year) epagomenal days (month 13)
  // ================================================================

  const COPTIC_EPOCH = 1825029.5; // JDN of 1 Thout 1 AM (29 Aug 284 Julian)

  function isCopticLeapYear(year) {
    return year % 4 === 3;
  }

  function copticMonthLength(year, month) {
    if (month <= 12) return 30;
    return isCopticLeapYear(year) ? 6 : 5; // month 13 = epagomenal
  }

  function copticYearLength(year) {
    return isCopticLeapYear(year) ? 366 : 365;
  }

  function copticToJD(year, month, day) {
    return COPTIC_EPOCH - 1 + 365 * (year - 1) + Math.floor(year / 4)
           + 30 * (month - 1) + day;
  }

  function jdToCoptic(jd) {
    const jd1 = Math.floor(jd) + 0.5;
    const year = Math.floor((4 * (jd1 - COPTIC_EPOCH) + 1463) / 1461);
    const month = Math.floor((jd1 - copticToJD(year, 1, 1)) / 30) + 1;
    const day = jd1 - copticToJD(year, month, 1) + 1;
    return { year, month, day };
  }

  // ================================================================
  // Ethiopian calendar (epoch 29 Aug 8 CE Julian)
  // Same structure as Coptic, different epoch
  // ================================================================

  const ETHIOPIAN_EPOCH = 1724220.5; // JDN of 1 Mäskäräm 1 (29 Aug 8 CE Julian)

  function isEthiopianLeapYear(year) {
    return year % 4 === 3;
  }

  function ethiopianMonthLength(year, month) {
    if (month <= 12) return 30;
    return isEthiopianLeapYear(year) ? 6 : 5;
  }

  function ethiopianYearLength(year) {
    return isEthiopianLeapYear(year) ? 366 : 365;
  }

  function ethiopianToJD(year, month, day) {
    return ETHIOPIAN_EPOCH - 1 + 365 * (year - 1) + Math.floor(year / 4)
           + 30 * (month - 1) + day;
  }

  function jdToEthiopian(jd) {
    const jd1 = Math.floor(jd) + 0.5;
    const year = Math.floor((4 * (jd1 - ETHIOPIAN_EPOCH) + 1463) / 1461);
    const month = Math.floor((jd1 - ethiopianToJD(year, 1, 1)) / 30) + 1;
    const day = jd1 - ethiopianToJD(year, month, 1) + 1;
    return { year, month, day };
  }

  // ================================================================
  // Persian Yazdgerdi calendar (epoch 16 June 632 CE Julian)
  // 12 months × 30 days + 5 epagomenal, NO leap years
  // ================================================================

  const YAZDGERDI_EPOCH = 1952062.5; // JDN of 1 Farvardin 1 YZ

  function yazdgerdiMonthLength(year, month) {
    if (month <= 12) return 30;
    return 5; // always 5 epagomenal, no leap
  }

  function yazdgerdiYearLength() {
    return 365;
  }

  function yazdgerdiToJD(year, month, day) {
    return YAZDGERDI_EPOCH - 1 + 365 * (year - 1) + 30 * (month - 1) + day;
  }

  function jdToYazdgerdi(jd) {
    const jd1 = Math.floor(jd) + 0.5;
    const daysSinceEpoch = jd1 - YAZDGERDI_EPOCH;
    const year = Math.floor(daysSinceEpoch / 365) + 1;
    const dayOfYear = jd1 - yazdgerdiToJD(year, 1, 1);
    const month = Math.min(13, Math.floor(dayOfYear / 30) + 1);
    const day = dayOfYear - (month - 1) * 30 + 1;
    return { year, month, day };
  }

  // ================================================================
  // Qadimi calendar — Parsi variant, 30 days ahead of Shahenshahi
  // Missed one intercalation in ~8th century, so epoch is 30 days earlier
  // Same 365-day wandering structure, NO leap years
  // ================================================================

  const QADIMI_EPOCH = YAZDGERDI_EPOCH - 30; // 17 May 632 CE Julian

  function qadimiMonthLength(year, month) {
    if (month <= 12) return 30;
    return 5;
  }

  function qadimiYearLength() {
    return 365;
  }

  function qadimiToJD(year, month, day) {
    return QADIMI_EPOCH - 1 + 365 * (year - 1) + 30 * (month - 1) + day;
  }

  function jdToQadimi(jd) {
    const jd1 = Math.floor(jd) + 0.5;
    const daysSinceEpoch = jd1 - QADIMI_EPOCH;
    const year = Math.floor(daysSinceEpoch / 365) + 1;
    const dayOfYear = jd1 - qadimiToJD(year, 1, 1);
    const month = Math.min(13, Math.floor(dayOfYear / 30) + 1);
    const day = dayOfYear - (month - 1) * 30 + 1;
    return { year, month, day };
  }

  // ================================================================
  // Fasli calendar — reformed Zoroastrian calendar with leap years
  // 1 Farvardin fixed near vernal equinox (21 March)
  // Leap year every 4 years (year % 4 == 3)
  // ================================================================

  const FASLI_EPOCH = 1951975.5; // 21 March 632 CE Julian

  function isFasliLeapYear(year) {
    return year % 4 === 3;
  }

  function fasliMonthLength(year, month) {
    if (month <= 12) return 30;
    return isFasliLeapYear(year) ? 6 : 5;
  }

  function fasliYearLength(year) {
    return isFasliLeapYear(year) ? 366 : 365;
  }

  function fasliToJD(year, month, day) {
    const y = year - 1;
    return FASLI_EPOCH - 1 + 365 * y + Math.floor(year / 4) + 30 * (month - 1) + day;
  }

  function jdToFasli(jd) {
    const jd1 = Math.floor(jd) + 0.5;
    const approx = Math.floor((jd1 - FASLI_EPOCH) / 365.25) + 1;
    let year = approx;
    while (fasliToJD(year + 1, 1, 1) <= jd1) year++;
    while (fasliToJD(year, 1, 1) > jd1) year--;
    const dayOfYear = jd1 - fasliToJD(year, 1, 1);
    const month = Math.min(13, Math.floor(dayOfYear / 30) + 1);
    const day = dayOfYear - (month - 1) * 30 + 1;
    return { year, month, day };
  }

  // ================================================================
  // Egyptian civil calendar (Era of Nabonassar, epoch 26 Feb 747 BCE Julian)
  // 12 months × 30 days + 5 epagomenal, NO leap years (drifts)
  // ================================================================

  const EGYPTIAN_EPOCH = 1448637.5; // JDN of 1 Thoth 1 Nabonassar

  function egyptianMonthLength(year, month) {
    if (month <= 12) return 30;
    return 5;
  }

  function egyptianYearLength() {
    return 365;
  }

  function egyptianToJD(year, month, day) {
    return EGYPTIAN_EPOCH - 1 + 365 * (year - 1) + 30 * (month - 1) + day;
  }

  function jdToEgyptian(jd) {
    const jd1 = Math.floor(jd) + 0.5;
    const daysSinceEpoch = jd1 - EGYPTIAN_EPOCH;
    const year = Math.floor(daysSinceEpoch / 365) + 1;
    const dayOfYear = jd1 - egyptianToJD(year, 1, 1);
    const month = Math.min(13, Math.floor(dayOfYear / 30) + 1);
    const day = dayOfYear - (month - 1) * 30 + 1;
    return { year, month, day };
  }

  // ================================================================
  // Zodiac sign from JDN (tropical, approximate from Gregorian date)
  // Returns index 0–11: Aries, Taurus, ..., Pisces
  // ================================================================

  function getZodiacSign(jd) {
    const g = jdToGregorian(jd);
    const md = g.month * 100 + g.day;
    if (md >= 321 && md <= 419) return 0;  // Aries
    if (md >= 420 && md <= 520) return 1;  // Taurus
    if (md >= 521 && md <= 620) return 2;  // Gemini
    if (md >= 621 && md <= 722) return 3;  // Cancer
    if (md >= 723 && md <= 822) return 4;  // Leo
    if (md >= 823 && md <= 922) return 5;  // Virgo
    if (md >= 923 && md <= 1022) return 6; // Libra
    if (md >= 1023 && md <= 1121) return 7; // Scorpio
    if (md >= 1122 && md <= 1221) return 8; // Sagittarius
    if (md >= 1222 || md <= 119) return 9;  // Capricorn
    if (md >= 120 && md <= 218) return 10;  // Aquarius
    return 11; // Pisces
  }

  // ================================================================
  // Armenian calendar (epoch 11 July 552 CE Julian)
  // 12 months × 30 days + 5 epagomenal, NO leap years (drifts)
  // ================================================================

  const ARMENIAN_EPOCH = 1922867.5; // JDN of 1 Navasard 1

  function armenianMonthLength(year, month) {
    if (month <= 12) return 30;
    return 5;
  }

  function armenianYearLength() {
    return 365;
  }

  function armenianToJD(year, month, day) {
    return ARMENIAN_EPOCH - 1 + 365 * (year - 1) + 30 * (month - 1) + day;
  }

  function jdToArmenian(jd) {
    const jd1 = Math.floor(jd) + 0.5;
    const daysSinceEpoch = jd1 - ARMENIAN_EPOCH;
    const year = Math.floor(daysSinceEpoch / 365) + 1;
    const dayOfYear = jd1 - armenianToJD(year, 1, 1);
    const month = Math.min(13, Math.floor(dayOfYear / 30) + 1);
    const day = dayOfYear - (month - 1) * 30 + 1;
    return { year, month, day };
  }

  // ================================================================
  // Solar Hijri (modern Iranian/Afghan calendar)
  // Based on astronomical vernal equinox, approximated arithmetically
  // Months 1-6 = 31d, 7-11 = 30d, 12 = 29d (30 in leap)
  // Epoch: 1 Farvardin 1 AP = 22 March 622 CE Julian
  // ================================================================

  // Epoch: 1 Farvardin 1 AP = 19 March 622 Julian = JDN 1948320.5
  const SOLAR_HIJRI_EPOCH = 1948320.5;

  function isSolarHijriLeapYear(year) {
    const epbase = year - 474;
    const epyear = 474 + ((epbase % 2820) + 2820) % 2820;
    return ((epyear * 682) - 110) % 2816 < 682;
  }

  function solarHijriMonthLength(year, month) {
    if (month <= 6) return 31;
    if (month <= 11) return 30;
    return isSolarHijriLeapYear(year) ? 30 : 29;
  }

  function solarHijriYearLength(year) {
    return isSolarHijriLeapYear(year) ? 366 : 365;
  }

  function solarHijriToJD(year, month, day) {
    const epbase = year - 474;
    const epyear = 474 + ((epbase % 2820) + 2820) % 2820;
    return day
      + (month <= 7 ? (month - 1) * 31 : (month - 1) * 30 + 6)
      + Math.floor((epyear * 682 - 110) / 2816)
      + (epyear - 1) * 365
      + Math.floor(epbase / 2820) * 1029983
      + SOLAR_HIJRI_EPOCH - 1;
  }

  function jdToSolarHijri(jd) {
    const jd1 = Math.floor(jd) + 0.5;
    const depoch = jd1 - solarHijriToJD(475, 1, 1);
    const cycle = Math.floor(depoch / 1029983);
    const cyear = ((depoch % 1029983) + 1029983) % 1029983;
    let ycycle;
    if (cyear === 1029982) {
      ycycle = 2820;
    } else {
      const aux1 = Math.floor(cyear / 366);
      const aux2 = cyear % 366;
      ycycle = Math.floor((2134 * aux1 + 2816 * aux2 + 2815) / 1028522) + aux1 + 1;
    }
    const year = ycycle + 2820 * cycle + 474;
    const yday = jd1 - solarHijriToJD(year, 1, 1) + 1;
    const month = yday <= 186 ? Math.ceil(yday / 31) : Math.ceil((yday - 6) / 30);
    const day = jd1 - solarHijriToJD(year, month, 1) + 1;
    return { year, month, day };
  }

  // ================================================================
  // Ilkhanid (Khani) calendar
  // Solar Hijri with epoch offset: year 1 = 1 Farvardin 681 SH (13 Mar 1302 CE Julian)
  // Established by Ghazan Khan. Structurally identical to Solar Hijri.
  // ================================================================

  const ILKHANI_OFFSET = 680;

  function ilkhaniToJD(year, month, day) {
    return solarHijriToJD(year + ILKHANI_OFFSET, month, day);
  }

  function jdToIlkhani(jd) {
    const sh = jdToSolarHijri(jd);
    return { year: sh.year - ILKHANI_OFFSET, month: sh.month, day: sh.day };
  }

  function ilkhaniMonthLength(year, month) {
    return solarHijriMonthLength(year + ILKHANI_OFFSET, month);
  }

  function ilkhaniYearLength(year) {
    return solarHijriYearLength(year + ILKHANI_OFFSET);
  }

  function isIlkhaniLeapYear(year) {
    return isSolarHijriLeapYear(year + ILKHANI_OFFSET);
  }

  // 12-year Turkic-Mongol animal cycle
  const ILKHANI_ANIMALS = [
    'Sichqan', 'Ud', 'Bars', 'Tavishqan', 'Luy', 'Yilan',
    'Yund', 'Qoy', 'Bichin', 'Takigu', 'It', 'Tonguz'
  ];

  function ilkhaniAnimalYear(year) {
    return ILKHANI_ANIMALS[((year - 1) % 12 + 12) % 12];
  }

  // ================================================================
  // Byzantine calendar (Anno Mundi)
  // Julian calendar with era offset: year 1 AM = 5509 BC
  // Byzantine year starts September 1
  // ================================================================

  function byzantineToJD(year, month, day) {
    // Byzantine months match Julian, but year starts in September
    // Month 1 = September, Month 2 = October, ... Month 12 = August
    // Convert to Julian: Sep-Dec belong to julianYear = byzYear - 5509
    //                    Jan-Aug belong to julianYear = byzYear - 5508
    let julYear, julMonth;
    if (month <= 4) {
      // Sep(1), Oct(2), Nov(3), Dec(4) → Julian months 9,10,11,12
      julMonth = month + 8;
      julYear = year - 5509;
    } else {
      // Jan(5)..Aug(12) → Julian months 1..8
      julMonth = month - 4;
      julYear = year - 5508;
    }
    return julianToJD(julYear, julMonth, day);
  }

  function jdToByzantine(jd) {
    const jul = jdToJulian(jd);
    let byzYear, byzMonth;
    if (jul.month >= 9) {
      // Sep-Dec: first months of the Byzantine year
      byzMonth = jul.month - 8; // Sep=1, Oct=2, Nov=3, Dec=4
      byzYear = jul.year + 5509;
    } else {
      // Jan-Aug: later months of the Byzantine year
      byzMonth = jul.month + 4; // Jan=5, Feb=6, ... Aug=12
      byzYear = jul.year + 5508;
    }
    return { year: byzYear, month: byzMonth, day: jul.day };
  }

  function byzantineMonthLength(year, month) {
    // Convert Byzantine month to Julian month
    const julMonth = month <= 4 ? month + 8 : month - 4;
    const julYear = month <= 4 ? year - 5509 : year - 5508;
    return julianMonthLength(julYear, julMonth);
  }

  function byzantineYearLength(year) {
    // The Julian year that contains Jan-Aug of this Byzantine year
    return isJulianLeapYear(year - 5508) ? 366 : 365;
  }

  function isByzantineLeapYear(year) {
    return isJulianLeapYear(year - 5508);
  }

  // ================================================================
  // Alexandrian Era (Anno Mundi variant)
  // Julian calendar with era offset: year 1 AM = 5493 BC
  // Year starts March 25 (Annunciation)
  // ================================================================

  function alexandrianToJD(year, month, day) {
    // Month 1 = March (from 25th), but for simplicity we treat months
    // as starting from March: M1=Mar, M2=Apr, ... M10=Dec, M11=Jan, M12=Feb
    let julYear, julMonth;
    if (month <= 10) {
      // Mar(1)..Dec(10)
      julMonth = month + 2;
      julYear = year - 5493;
    } else {
      // Jan(11), Feb(12)
      julMonth = month - 10;
      julYear = year - 5492;
    }
    return julianToJD(julYear, julMonth, day);
  }

  function jdToAlexandrian(jd) {
    const jul = jdToJulian(jd);
    let alexYear, alexMonth;
    if (jul.month >= 3) {
      alexMonth = jul.month - 2; // Mar=1, Apr=2, ... Dec=10
      alexYear = jul.year + 5493;
    } else {
      alexMonth = jul.month + 10; // Jan=11, Feb=12
      alexYear = jul.year + 5492;
    }
    return { year: alexYear, month: alexMonth, day: jul.day };
  }

  function alexandrianMonthLength(year, month) {
    const julMonth = month <= 10 ? month + 2 : month - 10;
    const julYear = month <= 10 ? year - 5493 : year - 5492;
    return julianMonthLength(julYear, julMonth);
  }

  function alexandrianYearLength(year) {
    return isJulianLeapYear(year - 5493) ? 366 : 365;
  }

  function isAlexandrianLeapYear(year) {
    return isJulianLeapYear(year - 5493);
  }

  // ================================================================
  // Chronicon Paschale (Anno Mundi variant)
  // Same epoch as Constantinople (5509 BC) but year starts March 21
  // ================================================================

  function chronPaschToJD(year, month, day) {
    // M1=Mar, M2=Apr, ... M10=Dec, M11=Jan, M12=Feb
    let julYear, julMonth;
    if (month <= 10) {
      julMonth = month + 2;
      julYear = year - 5509;
    } else {
      julMonth = month - 10;
      julYear = year - 5508;
    }
    return julianToJD(julYear, julMonth, day);
  }

  function jdToChronPasch(jd) {
    const jul = jdToJulian(jd);
    let cpYear, cpMonth;
    if (jul.month >= 3) {
      cpMonth = jul.month - 2;
      cpYear = jul.year + 5509;
    } else {
      cpMonth = jul.month + 10;
      cpYear = jul.year + 5508;
    }
    return { year: cpYear, month: cpMonth, day: jul.day };
  }

  function chronPaschMonthLength(year, month) {
    const julMonth = month <= 10 ? month + 2 : month - 10;
    const julYear = month <= 10 ? year - 5509 : year - 5508;
    return julianMonthLength(julYear, julMonth);
  }

  function chronPaschYearLength(year) {
    return isJulianLeapYear(year - 5508) ? 366 : 365;
  }

  function isChronPaschLeapYear(year) {
    return isJulianLeapYear(year - 5508);
  }

  // ================================================================
  // Seleucid calendar (Anno Graecorum / Era of the Greeks)
  // Julian calendar with era offset: year 1 AG = 312 BC
  // Greek variant starts October 1, Babylonian/Syriac variant starts April 1
  // We use the Syriac variant (starts October, like Byzantine)
  // ================================================================

  function seleucidToJD(year, month, day) {
    // Month 1 = October, Month 2 = November, ... Month 3 = December
    // Month 4 = January, ... Month 12 = September
    let julYear, julMonth;
    if (month <= 3) {
      // Oct(1), Nov(2), Dec(3)
      julMonth = month + 9;
      julYear = year - 312;
    } else {
      // Jan(4)..Sep(12) → Julian 1..9
      julMonth = month - 3;
      julYear = year - 311;
    }
    return julianToJD(julYear, julMonth, day);
  }

  function jdToSeleucid(jd) {
    const jul = jdToJulian(jd);
    let selYear, selMonth;
    if (jul.month >= 10) {
      selMonth = jul.month - 9; // Oct=1, Nov=2, Dec=3
      selYear = jul.year + 312;
    } else {
      selMonth = jul.month + 3; // Jan=4, Feb=5, ... Sep=12
      selYear = jul.year + 311;
    }
    return { year: selYear, month: selMonth, day: jul.day };
  }

  function seleucidMonthLength(year, month) {
    const julMonth = month <= 3 ? month + 9 : month - 3;
    const julYear = month <= 3 ? year - 312 : year - 311;
    return julianMonthLength(julYear, julMonth);
  }

  function seleucidYearLength(year) {
    return isJulianLeapYear(year - 311) ? 366 : 365;
  }

  function isSeleucidLeapYear(year) {
    return isJulianLeapYear(year - 311);
  }

  // Seleucid Babylonian reckoning: year starts April (Nisannu)
  // Epoch: 1 Nisannu SE 1 = April 311 BCE

  function seleucidBabToJD(year, month, day) {
    // M1=Apr, M2=May, ..., M9=Dec, M10=Jan, M11=Feb, M12=Mar
    let julYear, julMonth;
    if (month <= 9) {
      julMonth = month + 3; // Apr=4, May=5, ..., Dec=12
      julYear = year - 311;
    } else {
      julMonth = month - 9; // Jan=1, Feb=2, Mar=3
      julYear = year - 310;
    }
    return julianToJD(julYear, julMonth, day);
  }

  function jdToSeleucidBab(jd) {
    const jul = jdToJulian(jd);
    let selYear, selMonth;
    if (jul.month >= 4) {
      selMonth = jul.month - 3; // Apr=1, May=2, ..., Dec=9
      selYear = jul.year + 311;
    } else {
      selMonth = jul.month + 9; // Jan=10, Feb=11, Mar=12
      selYear = jul.year + 310;
    }
    return { year: selYear, month: selMonth, day: jul.day };
  }

  function seleucidBabMonthLength(year, month) {
    const julMonth = month <= 9 ? month + 3 : month - 9;
    const julYear = month <= 9 ? year - 311 : year - 310;
    return julianMonthLength(julYear, julMonth);
  }

  function seleucidBabYearLength(year) {
    return isJulianLeapYear(year - 310) ? 366 : 365;
  }

  function isSeleucidBabLeapYear(year) {
    return isJulianLeapYear(year - 310);
  }

  // ================================================================
  // Syriac calendar
  // Julian calendar with Syriac month names, standard January-start
  // Uses Anno Graecorum (Seleucid) era but with Jan-Dec month order
  // Epoch: year 1 = 312 BC (same as Seleucid)
  // ================================================================

  function syriacToJD(year, month, day) {
    // Syriac months: Kānūn II(1=Jan), Šbāṭ(2=Feb), Āḏār(3=Mar), Nīsān(4=Apr),
    // Ayyār(5=May), Ḥzīrān(6=Jun), Tammūz(7=Jul), Āb(8=Aug),
    // Aylūl(9=Sep), Tišrīn I(10=Oct), Tišrīn II(11=Nov), Kānūn I(12=Dec)
    const julYear = year - 311;
    return julianToJD(julYear, month, day);
  }

  function jdToSyriac(jd) {
    const jul = jdToJulian(jd);
    return { year: jul.year + 311, month: jul.month, day: jul.day };
  }

  function syriacMonthLength(year, month) {
    return julianMonthLength(year - 311, month);
  }

  function syriacYearLength(year) {
    return isJulianLeapYear(year - 311) ? 366 : 365;
  }

  function isSyriacLeapYear(year) {
    return isJulianLeapYear(year - 311);
  }

  // ================================================================
  // Rūmī calendar (Ottoman fiscal calendar)
  // Julian calendar with era offset
  // Originally March-start, reformed to January-start in 1840s
  // Epoch: year 1 = 622 CE Julian (same as Hijri epoch year)
  // Post-1256 Rūmī: January-start, year = Julian year - 584
  // ================================================================

  function rumiToJD(year, month, day) {
    const julYear = year + 584;
    return julianToJD(julYear, month, day);
  }

  function jdToRumi(jd) {
    const jul = jdToJulian(jd);
    return { year: jul.year - 584, month: jul.month, day: jul.day };
  }

  function rumiMonthLength(year, month) {
    return julianMonthLength(year + 584, month);
  }

  function rumiYearLength(year) {
    return isJulianLeapYear(year + 584) ? 366 : 365;
  }

  function isRumiLeapYear(year) {
    return isJulianLeapYear(year + 584);
  }

  // ================================================================
  // Indiction (15-year cycle)
  // Not a full calendar, but a dating element used in Byzantine documents
  // Indiction = ((Julian year - 3) % 15) + 1  (September indiction)
  // Returns as pseudo-calendar: year = indiction number (1-15),
  // months/days from Julian
  // ================================================================

  // ================================================================
  // Ab Urbe Condita (AUC) — Roman era
  // Julian calendar, year 1 AUC = 753 BC (Julian year -752)
  // January-start
  // ================================================================

  function aucToJD(year, month, day) {
    return julianToJD(year - 753, month, day);
  }

  function jdToAuc(jd) {
    const jul = jdToJulian(jd);
    return { year: jul.year + 753, month: jul.month, day: jul.day };
  }

  function aucMonthLength(year, month) {
    return julianMonthLength(year - 753, month);
  }

  function aucYearLength(year) {
    return isJulianLeapYear(year - 753) ? 366 : 365;
  }

  function isAucLeapYear(year) {
    return isJulianLeapYear(year - 753);
  }

  // ================================================================
  // Roman date notation (Kalends, Nones, Ides)
  // Converts a Julian/AUC month+day into Roman notation string
  // ================================================================

  function romanDayNotation(month, day, isLeap) {
    // Nones/Ides fall later in March, May, July, October
    const long = (month === 3 || month === 5 || month === 7 || month === 10);
    const nones = long ? 7 : 5;
    const ides = long ? 15 : 13;
    const mLen = [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    // Ablative month adjectives (for Kalendis/Nonis/Idibus)
    const abl = ['Ianuariis','Februariis','Martiis','Aprilibus','Maiis','Iuniis',
                 'Iuliis','Augustis','Septembribus','Octobribus','Novembribus','Decembribus'];
    // Accusative month adjectives (for ante diem/pridie + Kalendas/Nonas/Idus)
    const acc = ['Ianuarias','Februarias','Martias','Apriles','Maias','Iunias',
                 'Iulias','Augustas','Septembres','Octobres','Novembres','Decembres'];

    if (day === 1) return 'Kalendis ' + abl[month - 1];
    if (day === nones) return 'Nonis ' + abl[month - 1];
    if (day === ides) return 'Idibus ' + abl[month - 1];

    // Roman numerals for small numbers (max ~19)
    function rom(n) {
      const vals = [10,9,5,4,1], syms = ['X','IX','V','IV','I'];
      let s = ''; for (let i = 0; i < vals.length; i++) while (n >= vals[i]) { s += syms[i]; n -= vals[i]; } return s;
    }

    let count, target, nextMonth;
    if (day < nones) {
      count = nones - day + 1;
      target = 'Nonas'; nextMonth = month;
    } else if (day < ides) {
      count = ides - day + 1;
      target = 'Idus'; nextMonth = month;
    } else {
      nextMonth = month === 12 ? 1 : month + 1;
      count = mLen[month - 1] - day + 2;
      target = 'Kalendas';
    }
    if (count === 2) return 'pridie ' + target + ' ' + acc[nextMonth - 1];
    return 'ante diem ' + rom(count) + ' ' + target + ' ' + acc[nextMonth - 1];
  }

  // ================================================================
  // Spanish Era (Era Hispanica)
  // Julian calendar, year 1 = 38 BC (Julian year -37)
  // Used in Iberian Peninsula until 14th-15th century
  // ================================================================

  function spanishToJD(year, month, day) {
    return julianToJD(year - 38, month, day);
  }

  function jdToSpanish(jd) {
    const jul = jdToJulian(jd);
    return { year: jul.year + 38, month: jul.month, day: jul.day };
  }

  function spanishMonthLength(year, month) {
    return julianMonthLength(year - 38, month);
  }

  function spanishYearLength(year) {
    return isJulianLeapYear(year - 38) ? 366 : 365;
  }

  function isSpanishLeapYear(year) {
    return isJulianLeapYear(year - 38);
  }

  // ================================================================
  // Antiochene Era (Era of Antioch / Caesarean Era)
  // Julian calendar, year 1 = 49 BC (Julius Caesar, Battle of Pharsalus)
  // Year starts in autumn (October), like the Seleucid calendar it replaced
  // ================================================================

  function antiocheneToJD(year, month, day) {
    // Month 1 = October, Month 2 = November, ... Month 3 = December
    // Month 4 = January, ... Month 12 = September
    let julYear, julMonth;
    if (month <= 3) {
      // Oct(1), Nov(2), Dec(3)
      julMonth = month + 9;
      julYear = year - 49;
    } else {
      // Jan(4)..Sep(12) → Julian 1..9
      julMonth = month - 3;
      julYear = year - 48;
    }
    return julianToJD(julYear, julMonth, day);
  }

  function jdToAntiochene(jd) {
    const jul = jdToJulian(jd);
    let antYear, antMonth;
    if (jul.month >= 10) {
      antMonth = jul.month - 9; // Oct=1, Nov=2, Dec=3
      antYear = jul.year + 49;
    } else {
      antMonth = jul.month + 3; // Jan=4, Feb=5, ... Sep=12
      antYear = jul.year + 48;
    }
    return { year: antYear, month: antMonth, day: jul.day };
  }

  function antiocheneMonthLength(year, month) {
    const julMonth = month <= 3 ? month + 9 : month - 3;
    const julYear = month <= 3 ? year - 49 : year - 48;
    return julianMonthLength(julYear, julMonth);
  }

  function antiocheneYearLength(year) {
    return isJulianLeapYear(year - 48) ? 366 : 365;
  }

  function isAntiocheneLeapYear(year) {
    return isJulianLeapYear(year - 48);
  }

  // ================================================================
  // Olympiad calendar
  // 4-year cycles from 776 BC. Year within olympiad = 1-4
  // We encode: "year" = olympiad number, "month" reused as year-in-olympiad (1-4)
  // then sub-month = Julian month (1-12), day = day
  //
  // Simpler approach: treat as a flat year count where
  // year 1 of Olympiad 1 = 776 BC = Julian -775
  // So flat year = (olympiad - 1) * 4 + yearInOlympiad
  // Julian year = flatYear - 776
  //
  // For calendar purposes: we use a linear year where
  // year 1 = 776 BC (first Olympiad, first year)
  // year 2 = 775 BC, year 5 = 772 BC (Olympiad 2, year 1), etc.
  // ================================================================

  function olympiadToJD(year, month, day) {
    // year = linear count from 776 BC
    return julianToJD(year - 776, month, day);
  }

  function jdToOlympiad(jd) {
    const jul = jdToJulian(jd);
    return { year: jul.year + 776, month: jul.month, day: jul.day };
  }

  function olympiadMonthLength(year, month) {
    return julianMonthLength(year - 776, month);
  }

  function olympiadYearLength(year) {
    return isJulianLeapYear(year - 776) ? 366 : 365;
  }

  function isOlympiadLeapYear(year) {
    return isJulianLeapYear(year - 776);
  }

  // Helper: convert linear olympiad year to "Olympiad X, Year Y" display
  function olympiadDisplay(linearYear) {
    const ol = Math.floor((linearYear - 1) / 4) + 1;
    const yr = ((linearYear - 1) % 4) + 1;
    return { olympiad: ol, yearInOlympiad: yr };
  }

  // Helper: convert "Olympiad X, Year Y" to linear year
  function olympiadFromDisplay(olympiad, yearInOlympiad) {
    return (olympiad - 1) * 4 + yearInOlympiad;
  }

  // ================================================================
  // Macedonian calendar
  // Lunisolar calendar used in the Hellenistic world
  // For practical purposes: we implement the FIXED Macedonian calendar
  // as used in the Roman-era eastern Mediterranean (= Julian calendar
  // with Macedonian month names and different year start)
  // The Syro-Macedonian variant starts in October (like Seleucid)
  // with Macedonian month names. Uses Seleucid era.
  // Dios(1=Oct), Apellaios(2=Nov), Audynaios(3=Dec), Peritios(4=Jan),
  // Dystros(5=Feb), Xanthikos(6=Mar), Artemisios(7=Apr), Daisios(8=May),
  // Panemos(9=Jun), Loos(10=Jul), Gorpiaios(11=Aug), Hyperberetaios(12=Sep)
  // ================================================================

  function macedonianToJD(year, month, day) {
    // Same structure as Seleucid (October start, AG era)
    let julYear, julMonth;
    if (month <= 3) {
      // Dios(1)=Oct, Apellaios(2)=Nov, Audynaios(3)=Dec
      julMonth = month + 9;
      julYear = year - 312;
    } else {
      // Peritios(4)=Jan, ... Hyperberetaios(12)=Sep
      julMonth = month - 3;
      julYear = year - 311;
    }
    return julianToJD(julYear, julMonth, day);
  }

  function jdToMacedonian(jd) {
    const jul = jdToJulian(jd);
    let macYear, macMonth;
    if (jul.month >= 10) {
      macMonth = jul.month - 9;
      macYear = jul.year + 312;
    } else {
      macMonth = jul.month + 3;
      macYear = jul.year + 311;
    }
    return { year: macYear, month: macMonth, day: jul.day };
  }

  function macedonianMonthLength(year, month) {
    const julMonth = month <= 3 ? month + 9 : month - 3;
    const julYear = month <= 3 ? year - 312 : year - 311;
    return julianMonthLength(julYear, julMonth);
  }

  function macedonianYearLength(year) {
    return isJulianLeapYear(year - 311) ? 366 : 365;
  }

  function isMacedonianLeapYear(year) {
    return isJulianLeapYear(year - 311);
  }

  function indictionFromJD(jd) {
    const jul = jdToJulian(jd);
    // September indiction: changes Sep 1
    let indYear = jul.year;
    if (jul.month >= 9) indYear += 1;
    const indiction = ((indYear - 3) % 15 + 15) % 15 || 15;
    return indiction;
  }

  // ── Hebrew (Jewish) calendar ──────────────────────────────────────
  // Lunisolar calendar using Tishrei-based civil month numbering:
  //   1=Tishrei, 2=Cheshvan, 3=Kislev, 4=Tevet, 5=Shevat,
  //   6=Adar (or Adar I in leap), 7=Adar II (leap only),
  //   8=Nisan, 9=Iyar, 10=Sivan, 11=Tammuz, 12=Av, 13=Elul
  // Based on Reingold & Dershowitz "Calendrical Calculations"

  const HEBREW_EPOCH = 347997.5; // JD of 1 Tishrei 1 AM (proleptic Julian: Oct 7, 3761 BCE)

  function isHebrewLeapYear(year) {
    return ((7 * year + 1) % 19) < 7;
  }

  // Days from epoch to 1 Tishrei of year (before postponement adjustment)
  function hebrewDelay1(year) {
    const months = Math.floor((235 * year - 234) / 19);
    const parts = 12084 + 13753 * months;
    const day = months * 29 + Math.floor(parts / 25920);
    if ((3 * (day + 1)) % 7 < 3) {
      return day + 1;
    }
    return day;
  }

  // Additional postponement days for year
  function hebrewDelay2(year) {
    const last = hebrewDelay1(year - 1);
    const present = hebrewDelay1(year);
    const next = hebrewDelay1(year + 1);
    if (next - present === 356) return 2;
    if (present - last === 382) return 1;
    return 0;
  }

  function hebrewNewYearJD(year) {
    return HEBREW_EPOCH + hebrewDelay1(year) + hebrewDelay2(year);
  }

  function hebrewYearLength(year) {
    return hebrewNewYearJD(year + 1) - hebrewNewYearJD(year);
  }

  // Civil month numbering: 1=Tishrei..13=Elul; month 7=Adar II only in leap years
  function hebrewMonthLength(year, month) {
    const yearLen = hebrewYearLength(year);
    switch (month) {
      case 1: return 30;                                       // Tishrei
      case 2: return yearLen % 10 === 5 ? 30 : 29;             // Cheshvan (30 in complete)
      case 3: return yearLen % 10 === 3 ? 29 : 30;             // Kislev (29 in deficient)
      case 4: return 29;                                       // Tevet
      case 5: return 30;                                       // Shevat
      case 6: return isHebrewLeapYear(year) ? 30 : 29;         // Adar I / Adar
      case 7: return isHebrewLeapYear(year) ? 29 : 0;          // Adar II (0 in common)
      case 8: return 30;                                       // Nisan
      case 9: return 29;                                       // Iyar
      case 10: return 30;                                      // Sivan
      case 11: return 29;                                      // Tammuz
      case 12: return 30;                                      // Av
      case 13: return 29;                                      // Elul
      default: return 0;
    }
  }

  function hebrewToJD(year, month, day) {
    let jd = hebrewNewYearJD(year) + day - 1;
    for (let m = 1; m < month; m++) {
      const ml = hebrewMonthLength(year, m);
      if (ml > 0) jd += ml;
    }
    return jd;
  }

  function jdToHebrew(jd) {
    // Approximate year
    let year = Math.floor((jd - HEBREW_EPOCH) / 365.25) + 1;
    while (hebrewNewYearJD(year) > jd) year--;
    while (hebrewNewYearJD(year + 1) <= jd) year++;

    // Find month
    let month = 1;
    let remaining = jd - hebrewNewYearJD(year);
    let ml = hebrewMonthLength(year, month);
    while (ml > 0 && remaining >= ml && month < 13) {
      remaining -= ml;
      month++;
      ml = hebrewMonthLength(year, month);
      // Skip 0-length months (Adar II in common years)
      if (ml === 0 && month < 13) {
        month++;
        ml = hebrewMonthLength(year, month);
      }
    }

    const day = Math.floor(remaining) + 1;
    return { year, month, day };
  }

  // ================================================================
  // Babylonian calendar
  // Lunisolar, 19-year Metonic cycle.
  // Uses Parker & Dubberstein observational tables for NE 122–792
  // (626 BCE – 45 CE), arithmetic approximation outside that range.
  //
  // Era: Nabonassar (NE), year 1 = 747 BCE
  // ================================================================

  // Parker & Dubberstein lookup table (626 BCE – 45 CE)
  // NE 122 to 792 (671 years)
  const PD_FIRST = 122;
  const PD_LAST = 792;
  const PD_BASE_JDN = 1492871;
  // Delta JDNs from base (1 Nisannu of each year)
  const PD_JDN = [0,354,738,1093,1447,1831,2186,2540,2924,3278,3632,4016,4371,4755,5109,5464,5848,6202,6586,6940,7294,7678,8033,8387,8771,9126,9509,9863,10218,10601,10956,11340,11695,12049,12433,12787,13171,13525,13879,14263,14618,14973,15327,15711,16065,16449,16803,17157,17541,17896,18280,18635,18989,19373,19727,20110,20465,20819,21203,21558,21912,22267,22621,23004,23388,23743,24097,24481,24836,25190,25574,25928,26312,26666,27050,27405,27759,28143,28498,28852,29206,29590,29944,30328,30682,31037,31421,31776,32130,32484,32867,33251,33606,33961,34345,34699,35054,35437,35791,36145,36529,36884,37268,37623,37977,38361,38715,39069,39453,39807,40191,40546,40901,41285,41639,41993,42377,42731,43115,43469,43824,44208,44562,44917,45300,45654,46009,46393,46747,47131,47486,47840,48224,48578,48962,49316,49671,50054,50409,50764,51148,51502,51856,52240,52594,52949,53333,53687,54071,54426,54780,55163,55518,55901,56256,56611,56995,57349,57703,58087,58441,58795,59179,59534,59918,60273,60627,61011,61365,61719,62103,62457,62841,63196,63551,63934,64289,64643,65026,65381,65735,66119,66474,66858,67212,67567,67950,68304,68659,69042,69397,69781,70136,70490,70874,71228,71582,71966,72320,72675,73059,73414,73798,74152,74506,74890,75244,75598,75982,76337,76721,77076,77430,77813,78167,78522,78906,79260,79615,79999,80353,80737,81091,81445,81829,82184,82538,82922,83277,83661,84015,84369,84753,85107,85462,85846,86200,86555,86939,87293,87677,88031,88415,88769,89124,89477,89862,90217,90600,90954,91308,91692,92047,92402,92786,93140,93494,93878,94232,94616,94970,95325,95709,96064,96418,96802,97156,97539,97894,98248,98632,98987,99342,99725,100080,100434,100817,101172,101556,101910,102265,102649,103003,103357,103741,104095,104479,104834,105188,105572,105927,106281,106665,107019,107373,107757,108112,108496,108851,109205,109589,109943,110297,110681,111035,111419,111774,112128,112512,112866,113220,113604,113958,114313,114697,115052,115436,115790,116144,116528,116882,117236,117620,117975,118359,118714,119068,119452,119806,120160,120544,120898,121253,121637,121992,122375,122729,123084,123467,123822,124176,124560,124915,125299,125653,126007,126391,126745,127100,127484,127838,128193,128577,128931,129315,129669,130023,130407,130762,131116,131500,131855,132239,132593,132947,133330,133685,134040,134424,134778,135133,135517,135871,136254,136608,136963,137347,137702,138056,138440,138794,139178,139532,139886,140270,140625,140980,141364,141718,142072,142456,142810,143194,143548,143903,144287,144642,144996,145380,145734,146117,146472,146826,147210,147565,147919,148303,148657,149011,149395,149750,150134,150488,150843,151227,151581,151935,152319,152673,153057,153412,153766,154150,154505,154859,155243,155597,155951,156335,156690,157074,157428,157783,158166,158520,158875,159258,159613,159997,160352,160706,161090,161444,161798,162182,162536,162891,163275,163630,164014,164368,164722,165106,165460,165814,166198,166553,166937,167291,167646,168030,168384,168738,169122,169476,169831,170215,170570,170953,171307,171661,172045,172400,172754,173138,173493,173877,174231,174585,174969,175323,175678,176062,176416,176771,177155,177509,177893,178247,178601,178985,179340,179694,180078,180433,180816,181170,181525,181908,182263,182618,183002,183356,183711,184094,184449,184832,185186,185541,185925,186280,186634,187018,187372,187756,188110,188464,188848,189203,189558,189942,190296,190650,191034,191388,191772,192126,192481,192865,193219,193574,193957,194311,194695,195050,195404,195788,196143,196497,196881,197235,197589,197973,198328,198712,199066,199421,199805,200159,200513,200897,201251,201635,201990,202344,202728,203083,203437,203821,204175,204529,204913,205268,205652,206006,206360,206744,207099,207452,207836,208191,208575,208930,209284,209668,210022,210376,210760,211114,211469,211853,212208,212591,212946,213300,213683,214038,214392,214776,215131,215515,215869,216224,216607,216961,217316,217700,218054,218409,218793,219147,219531,219885,220239,220623,220977,221332,221716,222071,222455,222809,223163,223547,223901,224256,224640,224994,225349,225733,226087,226470,226824,227179,227563,227918,228272,228656,229010,229394,229748,230102,230486,230841,231196,231580,231934,232288,232672,233026,233410,233764,234119,234503,234857,235212,235596,235950,236333,236688,237042,237426,237781,238135,238519,238874,239228,239611,239966,240349,240704,241059,241443,241797,242151,242535,242889,243273,243627,243982,244366,244721];
  // Month bitmasks: bits 0-12 = 30-day month flags, bit 13 = leap year
  const PD_MASK = [2711,10934,1642,1369,11693,3026,2916,13642,1355,725,10603,2667,13657,3417,1746,11941,1685,13643,2409,725,10925,2741,2921,14034,2898,9893,693,2411,13657,2390,12981,1461,3497,15698,1354,12981,1365,2733,11482,1370,1709,3529,13202,1385,15187,1324,685,10603,2925,13140,2905,2729,15017,2725,13657,858,1205,10925,2989,2388,2773,2469,13673,14682,1386,1369,10933,2485,3433,11594,1355,10919,619,10859,2669,1385,14037,1746,1641,1363,10925,2741,10858,2741,1370,13013,2741,2665,1369,10933,11094,854,2477,11609,3433,2770,10921,2733,2410,13142,1622,9837,1721,3433,13652,2389,693,10603,2733,13654,3434,1716,13993,2729,1369,10933,725,10925,2733,2922,13652,1369,2733,10345,2733,1370,10933,2741,10922,2733,1369,12981,1205,10925,2733,2394,13493,1366,2741,13657,2409,1369,10933,2741,2666,13657,1369,10933,2741,2729,13657,1386,13493,1366,731,13657,1365,2741,10858,2733,1370,13014,1206,14955,2732,1369,11091,853,2733,9562,2411,13014,1366,2741,10601,2475,1365,10925,2666,1369,10925,2741,11113,3493,3402,12949,1205,2667,13657,1498,11220,1748,3497,11602,1385,723,10925,2741,2490,14036,1748,13989,2725,1355,13467,2389,693,10603,2925,14036,2916,2729,10921,2733,1370,10933,725,2925,15188,3410,11558,1355,685,10603,2779,1364,10933,3509,11684,1701,1355,12981,1205,2733,13657,2393,2741,13989,2709,13645,1325,10925,1365,2997,2664,14170,2898,10917,1205,2731,13658,1386,1461,11113,3433,1354,10925,2741,10858,2715,1370,13013,1717,3689,13650,1369,11093,854,2733,9562,2923,2772,10921,2741,2409,13141,1238,10925,693,2923,15188,2388,693,10603,2733,13654,1386,693,10923,2733,1369,10933,725,2733,13146,2410,13653,1881,1705,13673,2725,1369,10933,2741,10922,2733,1369,12981,1205,2733,13658,2394,1206,10925,2741,13657,3433,1362,10933,2741,2666,13658,1370,10933,1461,1705,13651,1385,1205,10925,2667,1370,10925,2741,10857,2733,1370,13013,1206,2667,13658,3418,15188,852,2733,9562,2411,726,10925,2741,3434,13140,1365,10925,693,2411,13658,2390,693,10603,2733,13653,1385,693,10923,2734,1370,10933,725,2733,13657,2409,13653,1370,694,10667,2733,1369,10933,2741,10922,2733,1370,12982,1206,2733,13657,2393,1205,10925,2741,14682,2410,1370,15029,1748,2665,13657,1369,10933,1206,2731,13658,1386,1205,10925,2667,1370,10926,2742,10858,2733,1370,13013,1205,2667,9562,1371,10966,854,2733,9562,2411,725,10925,2733,2154,13142,1366,10925,693,2411,13657,2390,694,10603,2742,13654,1386,693,10923,2733,1434,10550,1243,2742,13738,2410,13653,1433,813,10603,2733,1370,10934,2742,10922,2733,1370,14645,1237,1197,9565,1389,874,15181,2916,14745,2410,1366,10934,2742,1396,13658,1394,10965,1205,2731,13658,1386,1206,10925,2667,1370,11469,1365,13131,813,2395,13036,1268,2667,13778,1370,11029,1366,2734,10602,2486,870,10925,2741,3474,13397,1366,9389,1243,2538,13676,2536,693,10603,2733,13654,1130,1213,12986,2778,1370,10933,725,2733,13610,693,9589,1371,694,10603,2733,1370,10933,2646,10934,694,2421,12982,1206,2733,13658,2394,1206,10934,2742,14682,2410,1370,10933,2741,1202,10587,605,9437,1389,2731,13658,1386,1205,10925,2665,1369,10925,2741,11113,2985,1362,13013,2741,2665,13658,1370,15189,1748,1705,11603,1385,723,10925,2741,2922,14036,1748,10921,2741,2409,13657,2390,693,10603,2733,13653,1385,2741,10921,2733,1370,10933,725,2989,13652,3433,11602,1363,685,10603,2733,1370,10933,2741,13993,2725,1355,12981,1205,2733,13657,2921,1716,14021,2729,14681,2410,1370,10933,2741,2793,15188,1364,10933,1205,2731,13658,1386,1461,11689,3689,1362,10925,2741,10858,2733,1370,13013,1205,2667,13657,1369,11093,854,685,9562,2923,724,10925,2741,2409,13141,1366,10869,2682,2410,13657,2389,693,10603,2733,13654,1386,694,10923,2733,1369];

  // Arithmetic fallback for dates outside P&D range
  const MEAN_SYNODIC_MONTH = 29.530594;
  const BABYLONIAN_EPOCH = 1448309.5; // calibrated against P&D

  function isBabylonianLeapYear(year) {
    if (year >= PD_FIRST && year <= PD_LAST) {
      return (PD_MASK[year - PD_FIRST] & (1 << 13)) !== 0;
    }
    return ((7 * (year + 4) + 1) % 19) < 7;
  }

  function _pdMonthCount(year) {
    return (PD_MASK[year - PD_FIRST] & (1 << 13)) ? 13 : 12;
  }

  function _pdMonthLength(year, month) {
    return (PD_MASK[year - PD_FIRST] & (1 << (month - 1))) ? 30 : 29;
  }

  function _pdNisannuJDN(year) {
    return PD_BASE_JDN + PD_JDN[year - PD_FIRST];
  }

  function _pdMonthStart(year, month) {
    let jd = _pdNisannuJDN(year);
    for (let m = 1; m < month; m++) jd += _pdMonthLength(year, m);
    return jd;
  }

  // Arithmetic fallback helpers
  function _arithMonthsInYear(year) {
    return ((7 * (year + 4) + 1) % 19) < 7 ? 13 : 12;
  }

  function _arithMonthsSinceEpoch(year) {
    let months = 0;
    if (year > 1) {
      for (let y = 1; y < year; y++) months += _arithMonthsInYear(y);
    } else if (year < 1) {
      for (let y = 0; y >= year; y--) months -= _arithMonthsInYear(y);
    }
    return months;
  }

  function _arithMonthStart(year, month) {
    const ms = _arithMonthsSinceEpoch(year) + (month - 1);
    return Math.floor(BABYLONIAN_EPOCH + ms * MEAN_SYNODIC_MONTH) + 0.5;
  }

  // Flag: is this date in P&D range?
  function _isPD(year) {
    return year >= PD_FIRST && year <= PD_LAST;
  }

  function babylonianToJD(year, month, day) {
    if (_isPD(year)) return _pdMonthStart(year, month) + day - 1;
    return _arithMonthStart(year, month) + day - 1;
  }

  function babylonianMonthLength(year, month) {
    if (_isPD(year)) {
      const mc = _pdMonthCount(year);
      if (month < 1 || month > mc) return 0;
      return _pdMonthLength(year, month);
    }
    const mc = _arithMonthsInYear(year);
    if (month < 1 || month > mc) return 0;
    if (month < mc) return _arithMonthStart(year, month + 1) - _arithMonthStart(year, month);
    return _arithMonthStart(year + 1, 1) - _arithMonthStart(year, month);
  }

  function jdToBabylonian(jd) {
    const jd1 = Math.floor(jd) + 0.5;
    // Check P&D range first
    if (jd1 >= PD_BASE_JDN && jd1 < PD_BASE_JDN + PD_JDN[PD_JDN.length - 1] + 400) {
      // Binary search for year in P&D
      let lo = 0, hi = PD_JDN.length - 1;
      while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if (PD_BASE_JDN + PD_JDN[mid] <= jd1) lo = mid; else hi = mid - 1;
      }
      const year = PD_FIRST + lo;
      if (_isPD(year)) {
        const mc = _pdMonthCount(year);
        let month = 1, acc = _pdNisannuJDN(year);
        while (month < mc && acc + _pdMonthLength(year, month) <= jd1) {
          acc += _pdMonthLength(year, month);
          month++;
        }
        return { year, month, day: Math.floor(jd1 - acc) + 1 };
      }
    }
    // Arithmetic fallback
    const approx = (jd1 - BABYLONIAN_EPOCH) / MEAN_SYNODIC_MONTH;
    let year = Math.floor(approx / 12.3685) + 1;
    while (_arithMonthStart(year + 1, 1) <= jd1) year++;
    while (_arithMonthStart(year, 1) > jd1) year--;
    let month = 1;
    const mc = _arithMonthsInYear(year);
    while (month < mc && _arithMonthStart(year, month + 1) <= jd1) month++;
    const day = jd1 - _arithMonthStart(year, month) + 1;
    return { year, month, day: Math.floor(day) };
  }

  function babylonianYearLength(year) {
    if (_isPD(year)) {
      if (_isPD(year + 1)) return _pdNisannuJDN(year + 1) - _pdNisannuJDN(year);
      // Edge: year in P&D but year+1 not
      let len = 0;
      const mc = _pdMonthCount(year);
      for (let m = 1; m <= mc; m++) len += _pdMonthLength(year, m);
      return len;
    }
    return _arithMonthStart(year + 1, 1) - _arithMonthStart(year, 1);
  }

  // Expose whether a year uses P&D data (for UI annotation)
  function isBabylonianPD(year) {
    return _isPD(year);
  }

  // ================================================================
  // Before Present (BP) — used in archaeology/geology
  // "Present" = 1950 CE (Gregorian). year BP = 1950 - Gregorian year
  // BP 0 = 1950 CE, BP 1 = 1949 CE, etc.
  // ================================================================

  function bpToJD(year, month, day) {
    return gregorianToJD(1950 - year, month, day);
  }

  function jdToBP(jd) {
    const greg = jdToGregorian(jd);
    return { year: 1950 - greg.year, month: greg.month, day: greg.day };
  }

  function bpMonthLength(year, month) {
    return gregorianMonthLength(1950 - year, month);
  }

  function bpYearLength(year) {
    return isGregorianLeapYear(1950 - year) ? 366 : 365;
  }

  function isBPLeapYear(year) {
    return isGregorianLeapYear(1950 - year);
  }

  // ================================================================
  // Human Era (HE) / Holocene Era
  // year HE = Gregorian year + 10000
  // 1 HE = 10001 BCE, 10001 HE = 1 CE, 12024 HE = 2024 CE
  // Variants:
  //   Proleptic — proleptic Gregorian throughout (default, standard HE)
  //   Civil — Julian before Oct 15, 1582 CE (11582 HE), Gregorian after
  // ================================================================

  const HUMAN_VARIANTS = ['Proleptic', 'Civil'];
  const HUMAN_DEFAULT = 'Proleptic';

  function humanToJD(year, month, day, variant) {
    const cy = year - 10000;
    if (variant === 'Civil') return civilToJD(cy, month, day);
    return gregorianToJD(cy, month, day);
  }

  function jdToHuman(jd, variant) {
    if (variant === 'Civil') {
      const c = jdToCivil(jd);
      return { year: c.year + 10000, month: c.month, day: c.day };
    }
    const greg = jdToGregorian(jd);
    return { year: greg.year + 10000, month: greg.month, day: greg.day };
  }

  function humanMonthLength(year, month, variant) {
    const cy = year - 10000;
    if (variant === 'Civil' && gregorianToJD(cy, month, 1) < GREGORIAN_CUTOVER_JD) {
      return julianMonthLength(cy, month);
    }
    return gregorianMonthLength(cy, month);
  }

  function humanYearLength(year, variant) {
    const cy = year - 10000;
    if (variant === 'Civil' && cy < 1582) {
      return isJulianLeapYear(cy) ? 366 : 365;
    }
    return isGregorianLeapYear(cy) ? 366 : 365;
  }

  function isHumanLeapYear(year, variant) {
    const cy = year - 10000;
    if (variant === 'Civil' && cy < 1582) {
      return isJulianLeapYear(cy);
    }
    return isGregorianLeapYear(cy);
  }

  return {
    isHijriLeapYear,
    hijriMonthLength,
    hijriYearLength,
    isGregorianLeapYear,
    isJulianLeapYear,
    gregorianMonthLength,
    julianMonthLength,
    gregorianToJD,
    julianToJD,
    civilToJD,
    jdToGregorian,
    jdToJulian,
    jdToCivil,
    hijriToJD,
    jdToHijri,
    gregorianToHijri,
    hijriToGregorian,
    julianToHijri,
    hijriToJulian,
    getDayOfWeek,
    gregorianMonthToHijriRange,
    julianMonthToHijriRange,
    hijriMonthToGregorianRange,
    hijriYearToGregorianRange,
    civilYearToHijriRange,
    // Coptic
    isCopticLeapYear, copticMonthLength, copticYearLength, copticToJD, jdToCoptic,
    // Ethiopian
    isEthiopianLeapYear, ethiopianMonthLength, ethiopianYearLength, ethiopianToJD, jdToEthiopian,
    // Yazdgerdi (Shahenshahi)
    yazdgerdiMonthLength, yazdgerdiYearLength, yazdgerdiToJD, jdToYazdgerdi,
    // Qadimi
    qadimiMonthLength, qadimiYearLength, qadimiToJD, jdToQadimi,
    // Fasli
    isFasliLeapYear, fasliMonthLength, fasliYearLength, fasliToJD, jdToFasli,
    // Armenian
    armenianMonthLength, armenianYearLength, armenianToJD, jdToArmenian,
    // Solar Hijri
    isSolarHijriLeapYear, solarHijriMonthLength, solarHijriYearLength, solarHijriToJD, jdToSolarHijri,
    // Ilkhanid
    ilkhaniToJD, jdToIlkhani, ilkhaniMonthLength, ilkhaniYearLength, isIlkhaniLeapYear,
    ilkhaniAnimalYear, ILKHANI_ANIMALS,
    // Byzantine
    byzantineToJD, jdToByzantine, byzantineMonthLength, byzantineYearLength, isByzantineLeapYear,
    // Alexandrian
    alexandrianToJD, jdToAlexandrian, alexandrianMonthLength, alexandrianYearLength, isAlexandrianLeapYear,
    // Chronicon Paschale
    chronPaschToJD, jdToChronPasch, chronPaschMonthLength, chronPaschYearLength, isChronPaschLeapYear,
    // Seleucid
    seleucidToJD, jdToSeleucid, seleucidMonthLength, seleucidYearLength, isSeleucidLeapYear,
    seleucidBabToJD, jdToSeleucidBab, seleucidBabMonthLength, seleucidBabYearLength, isSeleucidBabLeapYear,
    // Syriac
    syriacToJD, jdToSyriac, syriacMonthLength, syriacYearLength, isSyriacLeapYear,
    // Rumi
    rumiToJD, jdToRumi, rumiMonthLength, rumiYearLength, isRumiLeapYear,
    // Egyptian
    egyptianMonthLength, egyptianYearLength, egyptianToJD, jdToEgyptian,
    // Zodiac
    getZodiacSign,
    // AUC / Roman
    aucToJD, jdToAuc, aucMonthLength, aucYearLength, isAucLeapYear,
    romanDayNotation,
    // Spanish Era
    spanishToJD, jdToSpanish, spanishMonthLength, spanishYearLength, isSpanishLeapYear,
    // Antiochene Era
    antiocheneToJD, jdToAntiochene, antiocheneMonthLength, antiocheneYearLength, isAntiocheneLeapYear,
    // Olympiad
    olympiadToJD, jdToOlympiad, olympiadMonthLength, olympiadYearLength, isOlympiadLeapYear,
    olympiadDisplay, olympiadFromDisplay,
    // Macedonian
    macedonianToJD, jdToMacedonian, macedonianMonthLength, macedonianYearLength, isMacedonianLeapYear,
    // Indiction
    indictionFromJD,
    // Hebrew
    isHebrewLeapYear, hebrewMonthLength, hebrewYearLength, hebrewToJD, jdToHebrew,
    // Babylonian
    babylonianToJD, jdToBabylonian, babylonianMonthLength, babylonianYearLength, isBabylonianLeapYear,
    isBabylonianPD,
    // Before Present
    bpToJD, jdToBP, bpMonthLength, bpYearLength, isBPLeapYear,
    // Human Era
    humanToJD, jdToHuman, humanMonthLength, humanYearLength, isHumanLeapYear,
    HUMAN_VARIANTS, HUMAN_DEFAULT,
    HIJRI_VARIANTS, HIJRI_DEFAULT,
    GREGORIAN_CUTOVER_JD
  };
})();

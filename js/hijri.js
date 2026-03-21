// kalkal — Core calendar conversion algorithms
// Based on the Kuwaiti algorithm (tabular/arithmetic Islamic calendar)
// All conversions go through Julian Day Number (JDN) as intermediary

const Cal = (() => {
  // Hijri leap years in the 30-year cycle
  const HIJRI_LEAP_YEARS = [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29];

  // Hijri epoch in JDN (July 16, 622 CE Julian = 1 Muharram 1 AH)
  const HIJRI_EPOCH = 1948439.5;

  // Gregorian calendar adoption: October 15, 1582
  const GREGORIAN_CUTOVER_JD = 2299160.5;

  function isHijriLeapYear(year) {
    return HIJRI_LEAP_YEARS.includes(((year - 1) % 30) + 1);
  }

  function hijriMonthLength(year, month) {
    if (month < 1 || month > 12) return 0;
    // Odd months = 30, even months = 29, month 12 = 30 in leap years
    if (month % 2 === 1) return 30;
    if (month === 12 && isHijriLeapYear(year)) return 30;
    return 29;
  }

  function hijriYearLength(year) {
    return isHijriLeapYear(year) ? 355 : 354;
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

  // Hijri date to Julian Day Number
  // The -0.5 aligns with Meeus JD convention (JD starts at noon)
  function hijriToJD(year, month, day) {
    return Math.floor((11 * year + 3) / 30) +
           354 * year +
           30 * month -
           Math.floor((month - 1) / 2) +
           day + 1948440 - 385 - 0.5;
  }

  // Julian Day Number to Hijri date
  function jdToHijri(jd) {
    const jd1 = Math.floor(jd) + 0.5;
    const year = Math.floor((30 * (jd1 - 1948439.5) + 10646) / 10631);
    const month = Math.min(12,
      Math.ceil((jd1 - (29 + hijriToJD(year, 1, 1))) / 29.5) + 1);
    const day = Math.floor(jd1 - hijriToJD(year, month, 1)) + 1;
    return { year, month, day };
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

  const SOLAR_HIJRI_EPOCH = 1948320.5; // JDN of 1 Farvardin 1 AP

  function isSolarHijriLeapYear(year) {
    // Arithmetic approximation (2820-year cycle, matches Ahmad Birashk)
    const a = year > 0 ? year - 474 : year - 473;
    return ((a % 2820 + 2820) % 2820 * 682) % 2816 < 682;
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
    const y = year > 0 ? year - 474 : year - 473;
    const yy = y % 2820 + 474;
    return day + (month <= 7 ? (month - 1) * 31 : (month - 1) * 30 + 6)
           + Math.floor((yy + 38) * 682 % 2816 < 682 ? (yy + 38) * 682 / 2816 : 0)
           + (yy - 1) * 365 + Math.floor((682 * yy - 110) / 2816)
           + (Math.floor(y / 2820)) * 1029983 + SOLAR_HIJRI_EPOCH - 1;
  }

  function jdToSolarHijri(jd) {
    const jd1 = Math.floor(jd) + 0.5;
    // Use iterative approach
    let year = Math.round((jd1 - SOLAR_HIJRI_EPOCH) / 365.2422) + 1;
    // Adjust
    while (solarHijriToJD(year + 1, 1, 1) <= jd1) year++;
    while (solarHijriToJD(year, 1, 1) > jd1) year--;
    const dayOfYear = jd1 - solarHijriToJD(year, 1, 1);
    let month;
    if (dayOfYear < 186) {
      month = Math.floor(dayOfYear / 31) + 1;
    } else {
      month = Math.floor((dayOfYear - 6) / 30) + 1;
    }
    const day = jd1 - solarHijriToJD(year, month, 1) + 1;
    return { year, month, day };
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
    // Yazdgerdi
    yazdgerdiMonthLength, yazdgerdiYearLength, yazdgerdiToJD, jdToYazdgerdi,
    // Armenian
    armenianMonthLength, armenianYearLength, armenianToJD, jdToArmenian,
    // Solar Hijri
    isSolarHijriLeapYear, solarHijriMonthLength, solarHijriYearLength, solarHijriToJD, jdToSolarHijri,
    GREGORIAN_CUTOVER_JD
  };
})();

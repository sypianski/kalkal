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
    // Byzantine
    byzantineToJD, jdToByzantine, byzantineMonthLength, byzantineYearLength, isByzantineLeapYear,
    // Alexandrian
    alexandrianToJD, jdToAlexandrian, alexandrianMonthLength, alexandrianYearLength, isAlexandrianLeapYear,
    // Seleucid
    seleucidToJD, jdToSeleucid, seleucidMonthLength, seleucidYearLength, isSeleucidLeapYear,
    // Syriac
    syriacToJD, jdToSyriac, syriacMonthLength, syriacYearLength, isSyriacLeapYear,
    // Rumi
    rumiToJD, jdToRumi, rumiMonthLength, rumiYearLength, isRumiLeapYear,
    // Egyptian
    egyptianMonthLength, egyptianYearLength, egyptianToJD, jdToEgyptian,
    // Zodiac
    getZodiacSign,
    // AUC
    aucToJD, jdToAuc, aucMonthLength, aucYearLength, isAucLeapYear,
    // Spanish Era
    spanishToJD, jdToSpanish, spanishMonthLength, spanishYearLength, isSpanishLeapYear,
    // Olympiad
    olympiadToJD, jdToOlympiad, olympiadMonthLength, olympiadYearLength, isOlympiadLeapYear,
    olympiadDisplay, olympiadFromDisplay,
    // Macedonian
    macedonianToJD, jdToMacedonian, macedonianMonthLength, macedonianYearLength, isMacedonianLeapYear,
    // Indiction
    indictionFromJD,
    HIJRI_VARIANTS, HIJRI_DEFAULT,
    GREGORIAN_CUTOVER_JD
  };
})();

// kalkal — Dart port of js/hijri.js core calendar engine.
// All conversions go through Julian Day Number (JDN) as intermediary.
// JS Math.floor maps to .floor(); ceil to .ceil(). Modulo uses %.

import 'dart:math' as math;

class YMD {
  final int year;
  final int month;
  final int day;
  const YMD(this.year, this.month, this.day);
  Map<String, int> toMap() => {'year': year, 'month': month, 'day': day};
  @override
  String toString() => '$year-${month.toString().padLeft(2, '0')}-${day.toString().padLeft(2, '0')}';
}

class CivilDate extends YMD {
  final String calendar;
  const CivilDate(int year, int month, int day, this.calendar) : super(year, month, day);
}

class Cal {
  static const Map<String, List<int>> HIJRI_VARIANTS = {
    'IIc':  [2, 5, 7, 10, 13, 16, 19, 21, 24, 26, 29],
    'IIa':  [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29],
    'IIIa': [2, 5, 8, 10, 13, 16, 19, 21, 24, 27, 29],
    'IVa':  [2, 5, 8, 11, 13, 16, 19, 21, 24, 27, 30],
  };
  static const String HIJRI_DEFAULT = 'IIc';
  static const double HIJRI_EPOCH = 1948439.5;
  static const double GREGORIAN_CUTOVER_JD = 2299160.5;

  static int _floor(double x) => x.floor();

  static bool isHijriLeapYear(int year, [String? variant]) {
    final leaps = HIJRI_VARIANTS[variant ?? HIJRI_DEFAULT]!;
    return leaps.contains(((year - 1) % 30) + 1);
  }

  static int hijriMonthLength(int year, int month, [String? variant]) {
    if (month < 1 || month > 12) return 0;
    if (month % 2 == 1) return 30;
    if (month == 12 && isHijriLeapYear(year, variant)) return 30;
    return 29;
  }

  static int hijriYearLength(int year, [String? variant]) =>
      isHijriLeapYear(year, variant) ? 355 : 354;

  static bool isGregorianLeapYear(int year) =>
      (year % 4 == 0 && year % 100 != 0) || (year % 400 == 0);

  static bool isJulianLeapYear(int year) => year % 4 == 0;

  static const List<int> _MLEN = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  static int gregorianMonthLength(int year, int month) {
    if (month == 2 && isGregorianLeapYear(year)) return 29;
    return _MLEN[month - 1];
  }

  static int julianMonthLength(int year, int month) {
    if (month == 2 && isJulianLeapYear(year)) return 29;
    return _MLEN[month - 1];
  }

  static double gregorianToJD(int year, int month, int day) {
    int y = year, m = month;
    if (m <= 2) { y -= 1; m += 12; }
    final A = (y / 100).floor();
    final B = 2 - A + (A / 4).floor();
    return (365.25 * (y + 4716)).floor().toDouble()
         + (30.6001 * (m + 1)).floor()
         + day + B - 1524.5;
  }

  static double julianToJD(int year, int month, int day) {
    int y = year, m = month;
    if (m <= 2) { y -= 1; m += 12; }
    return (365.25 * (y + 4716)).floor().toDouble()
         + (30.6001 * (m + 1)).floor()
         + day - 1524.5;
  }

  static YMD jdToGregorian(double jd) {
    final z = (jd + 0.5).floor();
    final a = ((z - 1867216.25) / 36524.25).floor();
    final A = z + 1 + a - (a / 4).floor();
    final B = A + 1524;
    final C = ((B - 122.1) / 365.25).floor();
    final D = (365.25 * C).floor();
    final E = ((B - D) / 30.6001).floor();
    final day = B - D - (30.6001 * E).floor();
    final month = E < 14 ? E - 1 : E - 13;
    final year = month > 2 ? C - 4716 : C - 4715;
    return YMD(year, month, day);
  }

  static YMD jdToJulian(double jd) {
    final z = (jd + 0.5).floor();
    final A = z;
    final B = A + 1524;
    final C = ((B - 122.1) / 365.25).floor();
    final D = (365.25 * C).floor();
    final E = ((B - D) / 30.6001).floor();
    final day = B - D - (30.6001 * E).floor();
    final month = E < 14 ? E - 1 : E - 13;
    final year = month > 2 ? C - 4716 : C - 4715;
    return YMD(year, month, day);
  }

  static int hijriLeapCountUpTo(int N, [String? variant]) {
    final leaps = HIJRI_VARIANTS[variant ?? HIJRI_DEFAULT]!;
    final full = (N / 30).floor();
    final rem = N % 30;
    int partial = 0;
    for (final l in leaps) {
      if (l <= rem) partial++; else break;
    }
    return full * 11 + partial;
  }

  static double hijriToJD(int year, int month, int day, [String? variant]) {
    return HIJRI_EPOCH
        + (year - 1) * 354 + hijriLeapCountUpTo(year - 1, variant)
        + ((month - 1) * 29.5 + 0.99).floor()
        + (day - 1);
  }

  static YMD jdToHijri(double jd, [String? variant]) {
    final jd1 = jd.floor() + 0.5;
    int year = ((jd1 - HIJRI_EPOCH) / 354.36667).floor() + 1;
    while (hijriToJD(year + 1, 1, 1, variant) <= jd1) year++;
    while (hijriToJD(year, 1, 1, variant) > jd1) year--;
    int month = 1;
    while (month < 12 && hijriToJD(year, month + 1, 1, variant) <= jd1) month++;
    final day = (jd1 - hijriToJD(year, month, 1, variant) + 1).round();
    return YMD(year, month, day);
  }

  static double civilToJD(int year, int month, int day) {
    final jdGreg = gregorianToJD(year, month, day);
    if (jdGreg < GREGORIAN_CUTOVER_JD) return julianToJD(year, month, day);
    return jdGreg;
  }

  static CivilDate jdToCivil(double jd) {
    if (jd < GREGORIAN_CUTOVER_JD) {
      final r = jdToJulian(jd);
      return CivilDate(r.year, r.month, r.day, 'julian');
    }
    final r = jdToGregorian(jd);
    return CivilDate(r.year, r.month, r.day, 'gregorian');
  }

  static int getDayOfWeek(double jd) => ((jd + 1.5).floor()) % 7;

  // ---------- Coptic ----------
  static const double COPTIC_EPOCH = 1825029.5;
  static bool isCopticLeapYear(int year) => year % 4 == 3;
  static int copticMonthLength(int year, int month) {
    if (month <= 12) return 30;
    return isCopticLeapYear(year) ? 6 : 5;
  }
  static int copticYearLength(int year) => isCopticLeapYear(year) ? 366 : 365;
  static double copticToJD(int year, int month, int day) =>
      COPTIC_EPOCH - 1 + 365 * (year - 1) + (year / 4).floor() + 30 * (month - 1) + day;
  static YMD jdToCoptic(double jd) {
    final jd1 = jd.floor() + 0.5;
    final year = ((4 * (jd1 - COPTIC_EPOCH) + 1463) / 1461).floor();
    final month = ((jd1 - copticToJD(year, 1, 1)) / 30).floor() + 1;
    final day = (jd1 - copticToJD(year, month, 1) + 1).round();
    return YMD(year, month, day);
  }

  // ---------- Ethiopian ----------
  static const double ETHIOPIAN_EPOCH = 1724220.5;
  static bool isEthiopianLeapYear(int year) => year % 4 == 3;
  static int ethiopianMonthLength(int year, int month) {
    if (month <= 12) return 30;
    return isEthiopianLeapYear(year) ? 6 : 5;
  }
  static int ethiopianYearLength(int year) => isEthiopianLeapYear(year) ? 366 : 365;
  static double ethiopianToJD(int year, int month, int day) =>
      ETHIOPIAN_EPOCH - 1 + 365 * (year - 1) + (year / 4).floor() + 30 * (month - 1) + day;
  static YMD jdToEthiopian(double jd) {
    final jd1 = jd.floor() + 0.5;
    final year = ((4 * (jd1 - ETHIOPIAN_EPOCH) + 1463) / 1461).floor();
    final month = ((jd1 - ethiopianToJD(year, 1, 1)) / 30).floor() + 1;
    final day = (jd1 - ethiopianToJD(year, month, 1) + 1).round();
    return YMD(year, month, day);
  }

  // ---------- Yazdgerdi (Shahenshahi) ----------
  static const double YAZDGERDI_EPOCH = 1952062.5;
  static int yazdgerdiMonthLength(int year, int month) => month <= 12 ? 30 : 5;
  static int yazdgerdiYearLength() => 365;
  static double yazdgerdiToJD(int year, int month, int day) =>
      YAZDGERDI_EPOCH - 1 + 365 * (year - 1) + 30 * (month - 1) + day;
  static YMD jdToYazdgerdi(double jd) {
    final jd1 = jd.floor() + 0.5;
    final daysSince = jd1 - YAZDGERDI_EPOCH;
    final year = (daysSince / 365).floor() + 1;
    final doy = (jd1 - yazdgerdiToJD(year, 1, 1)).round();
    final month = math.min(13, (doy / 30).floor() + 1);
    final day = doy - (month - 1) * 30 + 1;
    return YMD(year, month, day);
  }

  // ---------- Qadimi ----------
  static const double QADIMI_EPOCH = YAZDGERDI_EPOCH - 30;
  static int qadimiMonthLength(int year, int month) => month <= 12 ? 30 : 5;
  static int qadimiYearLength() => 365;
  static double qadimiToJD(int year, int month, int day) =>
      QADIMI_EPOCH - 1 + 365 * (year - 1) + 30 * (month - 1) + day;
  static YMD jdToQadimi(double jd) {
    final jd1 = jd.floor() + 0.5;
    final daysSince = jd1 - QADIMI_EPOCH;
    final year = (daysSince / 365).floor() + 1;
    final doy = (jd1 - qadimiToJD(year, 1, 1)).round();
    final month = math.min(13, (doy / 30).floor() + 1);
    final day = doy - (month - 1) * 30 + 1;
    return YMD(year, month, day);
  }

  // ---------- Fasli ----------
  static const double FASLI_EPOCH = 1951975.5;
  static bool isFasliLeapYear(int year) => year % 4 == 3;
  static int fasliMonthLength(int year, int month) {
    if (month <= 12) return 30;
    return isFasliLeapYear(year) ? 6 : 5;
  }
  static int fasliYearLength(int year) => isFasliLeapYear(year) ? 366 : 365;
  static double fasliToJD(int year, int month, int day) {
    final y = year - 1;
    return FASLI_EPOCH - 1 + 365 * y + (year / 4).floor() + 30 * (month - 1) + day;
  }
  static YMD jdToFasli(double jd) {
    final jd1 = jd.floor() + 0.5;
    int year = ((jd1 - FASLI_EPOCH) / 365.25).floor() + 1;
    while (fasliToJD(year + 1, 1, 1) <= jd1) year++;
    while (fasliToJD(year, 1, 1) > jd1) year--;
    final doy = (jd1 - fasliToJD(year, 1, 1)).round();
    final month = math.min(13, (doy / 30).floor() + 1);
    final day = doy - (month - 1) * 30 + 1;
    return YMD(year, month, day);
  }

  // ---------- Egyptian ----------
  static const double EGYPTIAN_EPOCH = 1448637.5;
  static int egyptianMonthLength(int year, int month) => month <= 12 ? 30 : 5;
  static int egyptianYearLength() => 365;
  static double egyptianToJD(int year, int month, int day) =>
      EGYPTIAN_EPOCH - 1 + 365 * (year - 1) + 30 * (month - 1) + day;
  static YMD jdToEgyptian(double jd) {
    final jd1 = jd.floor() + 0.5;
    final daysSince = jd1 - EGYPTIAN_EPOCH;
    final year = (daysSince / 365).floor() + 1;
    final doy = (jd1 - egyptianToJD(year, 1, 1)).round();
    final month = math.min(13, (doy / 30).floor() + 1);
    final day = doy - (month - 1) * 30 + 1;
    return YMD(year, month, day);
  }

  // ---------- Armenian ----------
  static const double ARMENIAN_EPOCH = 1922867.5;
  static int armenianMonthLength(int year, int month) => month <= 12 ? 30 : 5;
  static int armenianYearLength() => 365;
  static double armenianToJD(int year, int month, int day) =>
      ARMENIAN_EPOCH - 1 + 365 * (year - 1) + 30 * (month - 1) + day;
  static YMD jdToArmenian(double jd) {
    final jd1 = jd.floor() + 0.5;
    final daysSince = jd1 - ARMENIAN_EPOCH;
    final year = (daysSince / 365).floor() + 1;
    final doy = (jd1 - armenianToJD(year, 1, 1)).round();
    final month = math.min(13, (doy / 30).floor() + 1);
    final day = doy - (month - 1) * 30 + 1;
    return YMD(year, month, day);
  }

  // ---------- Solar Hijri ----------
  static const double SOLAR_HIJRI_EPOCH = 1948320.5;
  static int _pmod(int a, int m) => ((a % m) + m) % m;

  static bool isSolarHijriLeapYear(int year) {
    final epbase = year - 474;
    final epyear = 474 + _pmod(epbase, 2820);
    return ((epyear * 682) - 110) % 2816 < 682;
  }
  static int solarHijriMonthLength(int year, int month) {
    if (month <= 6) return 31;
    if (month <= 11) return 30;
    return isSolarHijriLeapYear(year) ? 30 : 29;
  }
  static int solarHijriYearLength(int year) => isSolarHijriLeapYear(year) ? 366 : 365;
  static double solarHijriToJD(int year, int month, int day) {
    final epbase = year - 474;
    final epyear = 474 + _pmod(epbase, 2820);
    return day.toDouble()
      + (month <= 7 ? (month - 1) * 31 : (month - 1) * 30 + 6)
      + ((epyear * 682 - 110) / 2816).floor()
      + (epyear - 1) * 365
      + (epbase / 2820).floor() * 1029983
      + SOLAR_HIJRI_EPOCH - 1;
  }
  static YMD jdToSolarHijri(double jd) {
    final jd1 = jd.floor() + 0.5;
    final depoch = jd1 - solarHijriToJD(475, 1, 1);
    final cycle = (depoch / 1029983).floor();
    final cyearD = ((depoch % 1029983) + 1029983) % 1029983;
    final cyear = cyearD.toInt();
    int ycycle;
    if (cyear == 1029982) {
      ycycle = 2820;
    } else {
      final aux1 = (cyear / 366).floor();
      final aux2 = cyear % 366;
      ycycle = ((2134 * aux1 + 2816 * aux2 + 2815) / 1028522).floor() + aux1 + 1;
    }
    final year = ycycle + 2820 * cycle + 474;
    final yday = (jd1 - solarHijriToJD(year, 1, 1) + 1).round();
    final month = yday <= 186 ? (yday / 31).ceil() : ((yday - 6) / 30).ceil();
    final day = (jd1 - solarHijriToJD(year, month, 1) + 1).round();
    return YMD(year, month, day);
  }

  // ---------- Ilkhanid ----------
  static const int ILKHANI_OFFSET = 680;
  static double ilkhaniToJD(int year, int month, int day) => solarHijriToJD(year + ILKHANI_OFFSET, month, day);
  static YMD jdToIlkhani(double jd) {
    final sh = jdToSolarHijri(jd);
    return YMD(sh.year - ILKHANI_OFFSET, sh.month, sh.day);
  }
  static int ilkhaniMonthLength(int year, int month) => solarHijriMonthLength(year + ILKHANI_OFFSET, month);
  static int ilkhaniYearLength(int year) => solarHijriYearLength(year + ILKHANI_OFFSET);
  static bool isIlkhaniLeapYear(int year) => isSolarHijriLeapYear(year + ILKHANI_OFFSET);
  static const List<String> ILKHANI_ANIMALS = [
    'Sichqan','Ud','Bars','Tavishqan','Luy','Yilan','Yund','Qoy','Bichin','Takigu','It','Tonguz'
  ];
  static String ilkhaniAnimalYear(int year) => ILKHANI_ANIMALS[_pmod(year - 1, 12)];

  // ---------- Byzantine ----------
  static double byzantineToJD(int year, int month, int day) {
    int julYear, julMonth;
    if (month <= 4) { julMonth = month + 8; julYear = year - 5509; }
    else { julMonth = month - 4; julYear = year - 5508; }
    return julianToJD(julYear, julMonth, day);
  }
  static YMD jdToByzantine(double jd) {
    final jul = jdToJulian(jd);
    int byzYear, byzMonth;
    if (jul.month >= 9) { byzMonth = jul.month - 8; byzYear = jul.year + 5509; }
    else { byzMonth = jul.month + 4; byzYear = jul.year + 5508; }
    return YMD(byzYear, byzMonth, jul.day);
  }
  static int byzantineMonthLength(int year, int month) {
    final julMonth = month <= 4 ? month + 8 : month - 4;
    final julYear = month <= 4 ? year - 5509 : year - 5508;
    return julianMonthLength(julYear, julMonth);
  }
  static int byzantineYearLength(int year) => isJulianLeapYear(year - 5508) ? 366 : 365;
  static bool isByzantineLeapYear(int year) => isJulianLeapYear(year - 5508);

  // ---------- Alexandrian ----------
  static double alexandrianToJD(int year, int month, int day) {
    int julYear, julMonth;
    if (month <= 10) { julMonth = month + 2; julYear = year - 5493; }
    else { julMonth = month - 10; julYear = year - 5492; }
    return julianToJD(julYear, julMonth, day);
  }
  static YMD jdToAlexandrian(double jd) {
    final jul = jdToJulian(jd);
    int aY, aM;
    if (jul.month >= 3) { aM = jul.month - 2; aY = jul.year + 5493; }
    else { aM = jul.month + 10; aY = jul.year + 5492; }
    return YMD(aY, aM, jul.day);
  }
  static int alexandrianMonthLength(int year, int month) {
    final julMonth = month <= 10 ? month + 2 : month - 10;
    final julYear = month <= 10 ? year - 5493 : year - 5492;
    return julianMonthLength(julYear, julMonth);
  }
  static int alexandrianYearLength(int year) => isJulianLeapYear(year - 5493) ? 366 : 365;
  static bool isAlexandrianLeapYear(int year) => isJulianLeapYear(year - 5493);

  // ---------- Chronicon Paschale ----------
  static double chronPaschToJD(int year, int month, int day) {
    int julYear, julMonth;
    if (month <= 10) { julMonth = month + 2; julYear = year - 5509; }
    else { julMonth = month - 10; julYear = year - 5508; }
    return julianToJD(julYear, julMonth, day);
  }
  static YMD jdToChronPasch(double jd) {
    final jul = jdToJulian(jd);
    int cpY, cpM;
    if (jul.month >= 3) { cpM = jul.month - 2; cpY = jul.year + 5509; }
    else { cpM = jul.month + 10; cpY = jul.year + 5508; }
    return YMD(cpY, cpM, jul.day);
  }
  static int chronPaschMonthLength(int year, int month) {
    final julMonth = month <= 10 ? month + 2 : month - 10;
    final julYear = month <= 10 ? year - 5509 : year - 5508;
    return julianMonthLength(julYear, julMonth);
  }
  static int chronPaschYearLength(int year) => isJulianLeapYear(year - 5508) ? 366 : 365;
  static bool isChronPaschLeapYear(int year) => isJulianLeapYear(year - 5508);

  // ---------- Seleucid (Syrian, Oct-start) ----------
  static double seleucidToJD(int year, int month, int day) {
    int julYear, julMonth;
    if (month <= 3) { julMonth = month + 9; julYear = year - 312; }
    else { julMonth = month - 3; julYear = year - 311; }
    return julianToJD(julYear, julMonth, day);
  }
  static YMD jdToSeleucid(double jd) {
    final jul = jdToJulian(jd);
    int sY, sM;
    if (jul.month >= 10) { sM = jul.month - 9; sY = jul.year + 312; }
    else { sM = jul.month + 3; sY = jul.year + 311; }
    return YMD(sY, sM, jul.day);
  }
  static int seleucidMonthLength(int year, int month) {
    final julMonth = month <= 3 ? month + 9 : month - 3;
    final julYear = month <= 3 ? year - 312 : year - 311;
    return julianMonthLength(julYear, julMonth);
  }
  static int seleucidYearLength(int year) => isJulianLeapYear(year - 311) ? 366 : 365;
  static bool isSeleucidLeapYear(int year) => isJulianLeapYear(year - 311);

  // ---------- Seleucid Babylonian (Apr-start) ----------
  static double seleucidBabToJD(int year, int month, int day) {
    int julYear, julMonth;
    if (month <= 9) { julMonth = month + 3; julYear = year - 311; }
    else { julMonth = month - 9; julYear = year - 310; }
    return julianToJD(julYear, julMonth, day);
  }
  static YMD jdToSeleucidBab(double jd) {
    final jul = jdToJulian(jd);
    int sY, sM;
    if (jul.month >= 4) { sM = jul.month - 3; sY = jul.year + 311; }
    else { sM = jul.month + 9; sY = jul.year + 310; }
    return YMD(sY, sM, jul.day);
  }
  static int seleucidBabMonthLength(int year, int month) {
    final julMonth = month <= 9 ? month + 3 : month - 9;
    final julYear = month <= 9 ? year - 311 : year - 310;
    return julianMonthLength(julYear, julMonth);
  }
  static int seleucidBabYearLength(int year) => isJulianLeapYear(year - 310) ? 366 : 365;
  static bool isSeleucidBabLeapYear(int year) => isJulianLeapYear(year - 310);

  // ---------- Syriac ----------
  static double syriacToJD(int year, int month, int day) => julianToJD(year - 311, month, day);
  static YMD jdToSyriac(double jd) {
    final j = jdToJulian(jd);
    return YMD(j.year + 311, j.month, j.day);
  }
  static int syriacMonthLength(int year, int month) => julianMonthLength(year - 311, month);
  static int syriacYearLength(int year) => isJulianLeapYear(year - 311) ? 366 : 365;
  static bool isSyriacLeapYear(int year) => isJulianLeapYear(year - 311);

  // ---------- Rumi ----------
  static double rumiToJD(int year, int month, int day) => julianToJD(year + 584, month, day);
  static YMD jdToRumi(double jd) {
    final j = jdToJulian(jd);
    return YMD(j.year - 584, j.month, j.day);
  }
  static int rumiMonthLength(int year, int month) => julianMonthLength(year + 584, month);
  static int rumiYearLength(int year) => isJulianLeapYear(year + 584) ? 366 : 365;
  static bool isRumiLeapYear(int year) => isJulianLeapYear(year + 584);

  // ---------- AUC ----------
  static double aucToJD(int year, int month, int day) => julianToJD(year - 753, month, day);
  static YMD jdToAuc(double jd) {
    final j = jdToJulian(jd);
    return YMD(j.year + 753, j.month, j.day);
  }
  static int aucMonthLength(int year, int month) => julianMonthLength(year - 753, month);
  static int aucYearLength(int year) => isJulianLeapYear(year - 753) ? 366 : 365;
  static bool isAucLeapYear(int year) => isJulianLeapYear(year - 753);

  // ---------- Spanish ----------
  static double spanishToJD(int year, int month, int day) => julianToJD(year - 38, month, day);
  static YMD jdToSpanish(double jd) {
    final j = jdToJulian(jd);
    return YMD(j.year + 38, j.month, j.day);
  }
  static int spanishMonthLength(int year, int month) => julianMonthLength(year - 38, month);
  static int spanishYearLength(int year) => isJulianLeapYear(year - 38) ? 366 : 365;
  static bool isSpanishLeapYear(int year) => isJulianLeapYear(year - 38);

  // ---------- Antiochene ----------
  static double antiocheneToJD(int year, int month, int day) {
    int julYear, julMonth;
    if (month <= 3) { julMonth = month + 9; julYear = year - 49; }
    else { julMonth = month - 3; julYear = year - 48; }
    return julianToJD(julYear, julMonth, day);
  }
  static YMD jdToAntiochene(double jd) {
    final j = jdToJulian(jd);
    int aY, aM;
    if (j.month >= 10) { aM = j.month - 9; aY = j.year + 49; }
    else { aM = j.month + 3; aY = j.year + 48; }
    return YMD(aY, aM, j.day);
  }
  static int antiocheneMonthLength(int year, int month) {
    final julMonth = month <= 3 ? month + 9 : month - 3;
    final julYear = month <= 3 ? year - 49 : year - 48;
    return julianMonthLength(julYear, julMonth);
  }
  static int antiocheneYearLength(int year) => isJulianLeapYear(year - 48) ? 366 : 365;
  static bool isAntiocheneLeapYear(int year) => isJulianLeapYear(year - 48);

  // ---------- Olympiad ----------
  static double olympiadToJD(int year, int month, int day) => julianToJD(year - 776, month, day);
  static YMD jdToOlympiad(double jd) {
    final j = jdToJulian(jd);
    return YMD(j.year + 776, j.month, j.day);
  }
  static int olympiadMonthLength(int year, int month) => julianMonthLength(year - 776, month);
  static int olympiadYearLength(int year) => isJulianLeapYear(year - 776) ? 366 : 365;
  static bool isOlympiadLeapYear(int year) => isJulianLeapYear(year - 776);
  static Map<String, int> olympiadDisplay(int linearYear) =>
      {'olympiad': ((linearYear - 1) / 4).floor() + 1, 'yearInOlympiad': ((linearYear - 1) % 4) + 1};
  static int olympiadFromDisplay(int olympiad, int yearInOlympiad) =>
      (olympiad - 1) * 4 + yearInOlympiad;

  // ---------- Macedonian (Oct-start, Seleucid era) ----------
  static double macedonianToJD(int year, int month, int day) {
    int julYear, julMonth;
    if (month <= 3) { julMonth = month + 9; julYear = year - 312; }
    else { julMonth = month - 3; julYear = year - 311; }
    return julianToJD(julYear, julMonth, day);
  }
  static YMD jdToMacedonian(double jd) {
    final j = jdToJulian(jd);
    int mY, mM;
    if (j.month >= 10) { mM = j.month - 9; mY = j.year + 312; }
    else { mM = j.month + 3; mY = j.year + 311; }
    return YMD(mY, mM, j.day);
  }
  static int macedonianMonthLength(int year, int month) {
    final julMonth = month <= 3 ? month + 9 : month - 3;
    final julYear = month <= 3 ? year - 312 : year - 311;
    return julianMonthLength(julYear, julMonth);
  }
  static int macedonianYearLength(int year) => isJulianLeapYear(year - 311) ? 366 : 365;
  static bool isMacedonianLeapYear(int year) => isJulianLeapYear(year - 311);

  // ---------- Indiction ----------
  static int indictionFromJD(double jd) {
    final j = jdToJulian(jd);
    int y = j.year;
    if (j.month >= 9) y += 1;
    final ind = _pmod(y - 3, 15);
    return ind == 0 ? 15 : ind;
  }

  // ---------- Hebrew ----------
  static const double HEBREW_EPOCH = 347997.5;
  static bool isHebrewLeapYear(int year) => ((7 * year + 1) % 19) < 7;
  static int hebrewDelay1(int year) {
    final months = ((235 * year - 234) / 19).floor();
    final parts = 12084 + 13753 * months;
    final day = months * 29 + (parts / 25920).floor();
    if ((3 * (day + 1)) % 7 < 3) return day + 1;
    return day;
  }
  static int hebrewDelay2(int year) {
    final last = hebrewDelay1(year - 1);
    final present = hebrewDelay1(year);
    final next = hebrewDelay1(year + 1);
    if (next - present == 356) return 2;
    if (present - last == 382) return 1;
    return 0;
  }
  static double hebrewNewYearJD(int year) => HEBREW_EPOCH + hebrewDelay1(year) + hebrewDelay2(year);
  static int hebrewYearLength(int year) => (hebrewNewYearJD(year + 1) - hebrewNewYearJD(year)).round();
  static int hebrewMonthLength(int year, int month) {
    final yearLen = hebrewYearLength(year);
    switch (month) {
      case 1: return 30;
      case 2: return yearLen % 10 == 5 ? 30 : 29;
      case 3: return yearLen % 10 == 3 ? 29 : 30;
      case 4: return 29;
      case 5: return 30;
      case 6: return isHebrewLeapYear(year) ? 30 : 29;
      case 7: return isHebrewLeapYear(year) ? 29 : 0;
      case 8: return 30;
      case 9: return 29;
      case 10: return 30;
      case 11: return 29;
      case 12: return 30;
      case 13: return 29;
      default: return 0;
    }
  }
  static double hebrewToJD(int year, int month, int day) {
    double jd = hebrewNewYearJD(year) + day - 1;
    for (int m = 1; m < month; m++) {
      final ml = hebrewMonthLength(year, m);
      if (ml > 0) jd += ml;
    }
    return jd;
  }
  static YMD jdToHebrew(double jd) {
    int year = ((jd - HEBREW_EPOCH) / 365.25).floor() + 1;
    while (hebrewNewYearJD(year) > jd) year--;
    while (hebrewNewYearJD(year + 1) <= jd) year++;
    int month = 1;
    double remaining = jd - hebrewNewYearJD(year);
    int ml = hebrewMonthLength(year, month);
    while (ml > 0 && remaining >= ml && month < 13) {
      remaining -= ml;
      month++;
      ml = hebrewMonthLength(year, month);
      if (ml == 0 && month < 13) {
        month++;
        ml = hebrewMonthLength(year, month);
      }
    }
    final day = remaining.floor() + 1;
    return YMD(year, month, day);
  }

  // ---------- Before Present ----------
  static double bpToJD(int year, int month, int day) => gregorianToJD(1950 - year, month, day);
  static YMD jdToBP(double jd) {
    final g = jdToGregorian(jd);
    return YMD(1950 - g.year, g.month, g.day);
  }
  static int bpMonthLength(int year, int month) => gregorianMonthLength(1950 - year, month);
  static int bpYearLength(int year) => isGregorianLeapYear(1950 - year) ? 366 : 365;
  static bool isBPLeapYear(int year) => isGregorianLeapYear(1950 - year);

  // ---------- Human Era ----------
  static const List<String> HUMAN_VARIANTS = ['Proleptic', 'Civil'];
  static const String HUMAN_DEFAULT = 'Proleptic';
  static double humanToJD(int year, int month, int day, [String? variant]) {
    final cy = year - 10000;
    if (variant == 'Civil') return civilToJD(cy, month, day);
    return gregorianToJD(cy, month, day);
  }
  static YMD jdToHuman(double jd, [String? variant]) {
    if (variant == 'Civil') {
      final c = jdToCivil(jd);
      return YMD(c.year + 10000, c.month, c.day);
    }
    final g = jdToGregorian(jd);
    return YMD(g.year + 10000, g.month, g.day);
  }
  static int humanMonthLength(int year, int month, [String? variant]) {
    final cy = year - 10000;
    if (variant == 'Civil' && gregorianToJD(cy, month, 1) < GREGORIAN_CUTOVER_JD) {
      return julianMonthLength(cy, month);
    }
    return gregorianMonthLength(cy, month);
  }
  static int humanYearLength(int year, [String? variant]) {
    final cy = year - 10000;
    if (variant == 'Civil' && cy < 1582) return isJulianLeapYear(cy) ? 366 : 365;
    return isGregorianLeapYear(cy) ? 366 : 365;
  }
  static bool isHumanLeapYear(int year, [String? variant]) {
    final cy = year - 10000;
    if (variant == 'Civil' && cy < 1582) return isJulianLeapYear(cy);
    return isGregorianLeapYear(cy);
  }

  // ---------- Zodiac ----------
  static int getZodiacSign(double jd) {
    final g = jdToGregorian(jd);
    final md = g.month * 100 + g.day;
    if (md >= 321 && md <= 419) return 0;
    if (md >= 420 && md <= 520) return 1;
    if (md >= 521 && md <= 620) return 2;
    if (md >= 621 && md <= 722) return 3;
    if (md >= 723 && md <= 822) return 4;
    if (md >= 823 && md <= 922) return 5;
    if (md >= 923 && md <= 1022) return 6;
    if (md >= 1023 && md <= 1121) return 7;
    if (md >= 1122 && md <= 1221) return 8;
    if (md >= 1222 || md <= 119) return 9;
    if (md >= 120 && md <= 218) return 10;
    return 11;
  }
}

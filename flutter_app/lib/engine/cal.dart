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

  // ---------- Babylonian ----------
  // Lunisolar, 19-year Metonic cycle.
  // Uses Parker & Dubberstein observational tables for NE 122–792
  // (626 BCE – 45 CE), arithmetic approximation outside that range.
  // Era: Nabonassar (NE), year 1 = 747 BCE

  // Parker & Dubberstein lookup table (626 BCE – 45 CE)
  // NE 122 to 792 (671 years)
  static const int PD_FIRST = 122;
  static const int PD_LAST = 792;
  static const int PD_BASE_JDN = 1492871;
  // Delta JDNs from base (1 Nisannu of each year)
  static const List<int> PD_JDN = [0,354,738,1093,1447,1831,2186,2540,2924,3278,3632,4016,4371,4755,5109,5464,5848,6202,6586,6940,7294,7678,8033,8387,8771,9126,9509,9863,10218,10601,10956,11340,11695,12049,12433,12787,13171,13525,13879,14263,14618,14973,15327,15711,16065,16449,16803,17157,17541,17896,18280,18635,18989,19373,19727,20110,20465,20819,21203,21558,21912,22267,22621,23004,23388,23743,24097,24481,24836,25190,25574,25928,26312,26666,27050,27405,27759,28143,28498,28852,29206,29590,29944,30328,30682,31037,31421,31776,32130,32484,32867,33251,33606,33961,34345,34699,35054,35437,35791,36145,36529,36884,37268,37623,37977,38361,38715,39069,39453,39807,40191,40546,40901,41285,41639,41993,42377,42731,43115,43469,43824,44208,44562,44917,45300,45654,46009,46393,46747,47131,47486,47840,48224,48578,48962,49316,49671,50054,50409,50764,51148,51502,51856,52240,52594,52949,53333,53687,54071,54426,54780,55163,55518,55901,56256,56611,56995,57349,57703,58087,58441,58795,59179,59534,59918,60273,60627,61011,61365,61719,62103,62457,62841,63196,63551,63934,64289,64643,65026,65381,65735,66119,66474,66858,67212,67567,67950,68304,68659,69042,69397,69781,70136,70490,70874,71228,71582,71966,72320,72675,73059,73414,73798,74152,74506,74890,75244,75598,75982,76337,76721,77076,77430,77813,78167,78522,78906,79260,79615,79999,80353,80737,81091,81445,81829,82184,82538,82922,83277,83661,84015,84369,84753,85107,85462,85846,86200,86555,86939,87293,87677,88031,88415,88769,89124,89477,89862,90217,90600,90954,91308,91692,92047,92402,92786,93140,93494,93878,94232,94616,94970,95325,95709,96064,96418,96802,97156,97539,97894,98248,98632,98987,99342,99725,100080,100434,100817,101172,101556,101910,102265,102649,103003,103357,103741,104095,104479,104834,105188,105572,105927,106281,106665,107019,107373,107757,108112,108496,108851,109205,109589,109943,110297,110681,111035,111419,111774,112128,112512,112866,113220,113604,113958,114313,114697,115052,115436,115790,116144,116528,116882,117236,117620,117975,118359,118714,119068,119452,119806,120160,120544,120898,121253,121637,121992,122375,122729,123084,123467,123822,124176,124560,124915,125299,125653,126007,126391,126745,127100,127484,127838,128193,128577,128931,129315,129669,130023,130407,130762,131116,131500,131855,132239,132593,132947,133330,133685,134040,134424,134778,135133,135517,135871,136254,136608,136963,137347,137702,138056,138440,138794,139178,139532,139886,140270,140625,140980,141364,141718,142072,142456,142810,143194,143548,143903,144287,144642,144996,145380,145734,146117,146472,146826,147210,147565,147919,148303,148657,149011,149395,149750,150134,150488,150843,151227,151581,151935,152319,152673,153057,153412,153766,154150,154505,154859,155243,155597,155951,156335,156690,157074,157428,157783,158166,158520,158875,159258,159613,159997,160352,160706,161090,161444,161798,162182,162536,162891,163275,163630,164014,164368,164722,165106,165460,165814,166198,166553,166937,167291,167646,168030,168384,168738,169122,169476,169831,170215,170570,170953,171307,171661,172045,172400,172754,173138,173493,173877,174231,174585,174969,175323,175678,176062,176416,176771,177155,177509,177893,178247,178601,178985,179340,179694,180078,180433,180816,181170,181525,181908,182263,182618,183002,183356,183711,184094,184449,184832,185186,185541,185925,186280,186634,187018,187372,187756,188110,188464,188848,189203,189558,189942,190296,190650,191034,191388,191772,192126,192481,192865,193219,193574,193957,194311,194695,195050,195404,195788,196143,196497,196881,197235,197589,197973,198328,198712,199066,199421,199805,200159,200513,200897,201251,201635,201990,202344,202728,203083,203437,203821,204175,204529,204913,205268,205652,206006,206360,206744,207099,207452,207836,208191,208575,208930,209284,209668,210022,210376,210760,211114,211469,211853,212208,212591,212946,213300,213683,214038,214392,214776,215131,215515,215869,216224,216607,216961,217316,217700,218054,218409,218793,219147,219531,219885,220239,220623,220977,221332,221716,222071,222455,222809,223163,223547,223901,224256,224640,224994,225349,225733,226087,226470,226824,227179,227563,227918,228272,228656,229010,229394,229748,230102,230486,230841,231196,231580,231934,232288,232672,233026,233410,233764,234119,234503,234857,235212,235596,235950,236333,236688,237042,237426,237781,238135,238519,238874,239228,239611,239966,240349,240704,241059,241443,241797,242151,242535,242889,243273,243627,243982,244366,244721];
  // Month bitmasks: bits 0-12 = 30-day month flags, bit 13 = leap year
  static const List<int> PD_MASK = [2711,10934,1642,1369,11693,3026,2916,13642,1355,725,10603,2667,13657,3417,1746,11941,1685,13643,2409,725,10925,2741,2921,14034,2898,9893,693,2411,13657,2390,12981,1461,3497,15698,1354,12981,1365,2733,11482,1370,1709,3529,13202,1385,15187,1324,685,10603,2925,13140,2905,2729,15017,2725,13657,858,1205,10925,2989,2388,2773,2469,13673,14682,1386,1369,10933,2485,3433,11594,1355,10919,619,10859,2669,1385,14037,1746,1641,1363,10925,2741,10858,2741,1370,13013,2741,2665,1369,10933,11094,854,2477,11609,3433,2770,10921,2733,2410,13142,1622,9837,1721,3433,13652,2389,693,10603,2733,13654,3434,1716,13993,2729,1369,10933,725,10925,2733,2922,13652,1369,2733,10345,2733,1370,10933,2741,10922,2733,1369,12981,1205,10925,2733,2394,13493,1366,2741,13657,2409,1369,10933,2741,2666,13657,1369,10933,2741,2729,13657,1386,13493,1366,731,13657,1365,2741,10858,2733,1370,13014,1206,14955,2732,1369,11091,853,2733,9562,2411,13014,1366,2741,10601,2475,1365,10925,2666,1369,10925,2741,11113,3493,3402,12949,1205,2667,13657,1498,11220,1748,3497,11602,1385,723,10925,2741,2490,14036,1748,13989,2725,1355,13467,2389,693,10603,2925,14036,2916,2729,10921,2733,1370,10933,725,2925,15188,3410,11558,1355,685,10603,2779,1364,10933,3509,11684,1701,1355,12981,1205,2733,13657,2393,2741,13989,2709,13645,1325,10925,1365,2997,2664,14170,2898,10917,1205,2731,13658,1386,1461,11113,3433,1354,10925,2741,10858,2715,1370,13013,1717,3689,13650,1369,11093,854,2733,9562,2923,2772,10921,2741,2409,13141,1238,10925,693,2923,15188,2388,693,10603,2733,13654,1386,693,10923,2733,1369,10933,725,2733,13146,2410,13653,1881,1705,13673,2725,1369,10933,2741,10922,2733,1369,12981,1205,2733,13658,2394,1206,10925,2741,13657,3433,1362,10933,2741,2666,13658,1370,10933,1461,1705,13651,1385,1205,10925,2667,1370,10925,2741,10857,2733,1370,13013,1206,2667,13658,3418,15188,852,2733,9562,2411,726,10925,2741,3434,13140,1365,10925,693,2411,13658,2390,693,10603,2733,13653,1385,693,10923,2734,1370,10933,725,2733,13657,2409,13653,1370,694,10667,2733,1369,10933,2741,10922,2733,1370,12982,1206,2733,13657,2393,1205,10925,2741,14682,2410,1370,15029,1748,2665,13657,1369,10933,1206,2731,13658,1386,1205,10925,2667,1370,10926,2742,10858,2733,1370,13013,1205,2667,9562,1371,10966,854,2733,9562,2411,725,10925,2733,2154,13142,1366,10925,693,2411,13657,2390,694,10603,2742,13654,1386,693,10923,2733,1434,10550,1243,2742,13738,2410,13653,1433,813,10603,2733,1370,10934,2742,10922,2733,1370,14645,1237,1197,9565,1389,874,15181,2916,14745,2410,1366,10934,2742,1396,13658,1394,10965,1205,2731,13658,1386,1206,10925,2667,1370,11469,1365,13131,813,2395,13036,1268,2667,13778,1370,11029,1366,2734,10602,2486,870,10925,2741,3474,13397,1366,9389,1243,2538,13676,2536,693,10603,2733,13654,1130,1213,12986,2778,1370,10933,725,2733,13610,693,9589,1371,694,10603,2733,1370,10933,2646,10934,694,2421,12982,1206,2733,13658,2394,1206,10934,2742,14682,2410,1370,10933,2741,1202,10587,605,9437,1389,2731,13658,1386,1205,10925,2665,1369,10925,2741,11113,2985,1362,13013,2741,2665,13658,1370,15189,1748,1705,11603,1385,723,10925,2741,2922,14036,1748,10921,2741,2409,13657,2390,693,10603,2733,13653,1385,2741,10921,2733,1370,10933,725,2989,13652,3433,11602,1363,685,10603,2733,1370,10933,2741,13993,2725,1355,12981,1205,2733,13657,2921,1716,14021,2729,14681,2410,1370,10933,2741,2793,15188,1364,10933,1205,2731,13658,1386,1461,11689,3689,1362,10925,2741,10858,2733,1370,13013,1205,2667,13657,1369,11093,854,685,9562,2923,724,10925,2741,2409,13141,1366,10869,2682,2410,13657,2389,693,10603,2733,13654,1386,694,10923,2733,1369];

  // Arithmetic fallback for dates outside P&D range
  static const double MEAN_SYNODIC_MONTH = 29.530594;
  static const double BABYLONIAN_EPOCH = 1448309.5; // calibrated against P&D

  static bool isBabylonianLeapYear(int year) {
    if (year >= PD_FIRST && year <= PD_LAST) {
      return (PD_MASK[year - PD_FIRST] & (1 << 13)) != 0;
    }
    // JS % keeps the sign of the dividend — use remainder(), not Dart %.
    return (7 * (year + 4) + 1).remainder(19) < 7;
  }

  static int _pdMonthCount(int year) =>
      (PD_MASK[year - PD_FIRST] & (1 << 13)) != 0 ? 13 : 12;

  static int _pdMonthLength(int year, int month) =>
      (PD_MASK[year - PD_FIRST] & (1 << (month - 1))) != 0 ? 30 : 29;

  static int _pdNisannuJDN(int year) => PD_BASE_JDN + PD_JDN[year - PD_FIRST];

  static int _pdMonthStart(int year, int month) {
    var jd = _pdNisannuJDN(year);
    for (var m = 1; m < month; m++) {
      jd += _pdMonthLength(year, m);
    }
    return jd;
  }

  // Arithmetic fallback helpers
  static int _arithMonthsInYear(int year) =>
      (7 * (year + 4) + 1).remainder(19) < 7 ? 13 : 12;

  static int _arithMonthsSinceEpoch(int year) {
    var months = 0;
    if (year > 1) {
      for (var y = 1; y < year; y++) {
        months += _arithMonthsInYear(y);
      }
    } else if (year < 1) {
      for (var y = 0; y >= year; y--) {
        months -= _arithMonthsInYear(y);
      }
    }
    return months;
  }

  static double _arithMonthStart(int year, int month) {
    final ms = _arithMonthsSinceEpoch(year) + (month - 1);
    return (BABYLONIAN_EPOCH + ms * MEAN_SYNODIC_MONTH).floorToDouble() + 0.5;
  }

  // Flag: is this date in P&D range?
  static bool _isPD(int year) => year >= PD_FIRST && year <= PD_LAST;

  static double babylonianToJD(int year, int month, int day) {
    if (_isPD(year)) return (_pdMonthStart(year, month) + day - 1).toDouble();
    return _arithMonthStart(year, month) + day - 1;
  }

  static int babylonianMonthLength(int year, int month) {
    if (_isPD(year)) {
      final mc = _pdMonthCount(year);
      if (month < 1 || month > mc) return 0;
      return _pdMonthLength(year, month);
    }
    final mc = _arithMonthsInYear(year);
    if (month < 1 || month > mc) return 0;
    if (month < mc) {
      return (_arithMonthStart(year, month + 1) - _arithMonthStart(year, month)).round();
    }
    return (_arithMonthStart(year + 1, 1) - _arithMonthStart(year, month)).round();
  }

  static YMD jdToBabylonian(double jd) {
    final jd1 = jd.floorToDouble() + 0.5;
    // Check P&D range first
    if (jd1 >= PD_BASE_JDN && jd1 < PD_BASE_JDN + PD_JDN[PD_JDN.length - 1] + 400) {
      // Binary search for year in P&D
      var lo = 0, hi = PD_JDN.length - 1;
      while (lo < hi) {
        final mid = (lo + hi + 1) >> 1;
        if (PD_BASE_JDN + PD_JDN[mid] <= jd1) {
          lo = mid;
        } else {
          hi = mid - 1;
        }
      }
      final year = PD_FIRST + lo;
      if (_isPD(year)) {
        final mc = _pdMonthCount(year);
        var month = 1;
        var acc = _pdNisannuJDN(year);
        while (month < mc && acc + _pdMonthLength(year, month) <= jd1) {
          acc += _pdMonthLength(year, month);
          month++;
        }
        return YMD(year, month, (jd1 - acc).floor() + 1);
      }
    }
    // Arithmetic fallback
    final approx = (jd1 - BABYLONIAN_EPOCH) / MEAN_SYNODIC_MONTH;
    var year = (approx / 12.3685).floor() + 1;
    while (_arithMonthStart(year + 1, 1) <= jd1) {
      year++;
    }
    while (_arithMonthStart(year, 1) > jd1) {
      year--;
    }
    var month = 1;
    final mc = _arithMonthsInYear(year);
    while (month < mc && _arithMonthStart(year, month + 1) <= jd1) {
      month++;
    }
    final day = jd1 - _arithMonthStart(year, month) + 1;
    return YMD(year, month, day.floor());
  }

  static int babylonianYearLength(int year) {
    if (_isPD(year)) {
      if (_isPD(year + 1)) return _pdNisannuJDN(year + 1) - _pdNisannuJDN(year);
      // Edge: year in P&D but year+1 not
      var len = 0;
      final mc = _pdMonthCount(year);
      for (var m = 1; m <= mc; m++) {
        len += _pdMonthLength(year, m);
      }
      return len;
    }
    return (_arithMonthStart(year + 1, 1) - _arithMonthStart(year, 1)).round();
  }

  // Expose whether a year uses P&D data (for UI annotation)
  static bool isBabylonianPD(int year) => _isPD(year);

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

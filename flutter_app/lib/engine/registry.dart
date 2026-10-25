// Calendar registry mirroring the CALENDARS object of js/app.js (22 entries,
// variants folded into their parent calendar). All ids match the JS ids so
// i18n keys, history entries and settings stay interchangeable with the web
// app's localStorage data model.

import 'cal.dart';
import '../i18n/i18n.dart';

class WebCalendar {
  final String id;
  final List<String>? variants;
  String defaultVariant;
  String variant; // current (mutable, mirrors _variant in js/app.js)
  final int monthCount;
  final List<double>? historicalRange; // [lo, hi] JDN, null = always
  final bool hasGenitive; // uses gregorianMonthsGen mapping when available

  final double Function(WebCalendar, int y, int m, int d) _toJD;
  final YMD Function(WebCalendar, double jd) _fromJD;
  final int Function(WebCalendar, int y, int m) _monthLength;
  final int Function(WebCalendar, int y) _yearLength;
  final bool Function(WebCalendar, int y) _isLeap;
  final String Function(WebCalendar) _monthsKey;

  WebCalendar({
    required this.id,
    this.variants,
    String? defaultVariant,
    required this.monthCount,
    required this.historicalRange,
    this.hasGenitive = false,
    required double Function(WebCalendar, int, int, int) toJD,
    required YMD Function(WebCalendar, double) fromJD,
    required int Function(WebCalendar, int, int) monthLength,
    required int Function(WebCalendar, int) yearLength,
    required bool Function(WebCalendar, int) isLeap,
    required String Function(WebCalendar) monthsKey,
  })  : defaultVariant = defaultVariant ?? '',
        variant = defaultVariant ?? '',
        _toJD = toJD,
        _fromJD = fromJD,
        _monthLength = monthLength,
        _yearLength = yearLength,
        _isLeap = isLeap,
        _monthsKey = monthsKey;

  double toJD(int y, int m, int d) => _toJD(this, y, m, d);
  YMD fromJD(double jd) => _fromJD(this, jd);
  int monthLength(int y, int m) => _monthLength(this, y, m);
  int yearLength(int y) => _yearLength(this, y);
  bool isLeap(int y) => _isLeap(this, y);

  List<String> monthNames(String lang) =>
      I18n.monthList(lang, _monthsKey(this)) ?? const <String>[];

  // Mirrors genNames()/genitiveMonths() in js/app.js: PL genitive forms via
  // the gregorianMonths -> gregorianMonthsGen name mapping, nominative
  // fallback for languages without a genitive array.
  List<String> monthNamesGen(String lang) {
    final names = monthNames(lang);
    if (!hasGenitive) return names;
    final gen = I18n.months[lang]?['gregorianMonthsGen'];
    if (gen == null) return names;
    final nom = I18n.monthList(lang, 'gregorianMonths') ?? const <String>[];
    final lookup = <String, String>{};
    for (var i = 0; i < nom.length && i < gen.length; i++) {
      lookup[nom[i]] = gen[i];
    }
    return names.map((n) => lookup[n] ?? n).toList();
  }
}

// ---------------------------------------------------------------------------

// Gregorian civil calendar with the Oct 1582 cutover — js/app.js gregorian.
int _civilMonthLength(int y, int m) {
  const cutoverYear = 1582;
  if (y < cutoverYear || (y == cutoverYear && m < 10)) {
    return Cal.julianMonthLength(y, m);
  }
  if (y == cutoverYear && m == 10) return 21; // days 1-4 (Jul.) + 15-31 (Greg.)
  return Cal.gregorianMonthLength(y, m);
}

int _civilYearLength(int y) {
  if (y < 1582) return Cal.isJulianLeapYear(y) ? 366 : 365;
  if (y == 1582) return 355; // 10 days removed
  return Cal.isGregorianLeapYear(y) ? 366 : 365;
}

final Map<String, WebCalendar> kWebCalendars = {
  'hijri': WebCalendar(
    id: 'hijri',
    variants: const ['IIc', 'IIa', 'IIIa', 'IVa'],
    defaultVariant: 'IIc',
    monthCount: 12,
    historicalRange: const [1948440, double.infinity],
    toJD: (c, y, m, d) => Cal.hijriToJD(y, m, d, c.variant),
    fromJD: (c, jd) => Cal.jdToHijri(jd, c.variant),
    monthLength: (c, y, m) => Cal.hijriMonthLength(y, m, c.variant),
    yearLength: (c, y) => Cal.hijriYearLength(y, c.variant),
    isLeap: (c, y) => Cal.isHijriLeapYear(y, c.variant),
    monthsKey: (c) => 'hijriMonths',
  ),
  'julian': WebCalendar(
    id: 'julian',
    monthCount: 12,
    historicalRange: const [1704987, 2305448],
    hasGenitive: true,
    toJD: (c, y, m, d) => Cal.julianToJD(y, m, d),
    fromJD: (c, jd) => Cal.jdToJulian(jd),
    monthLength: (c, y, m) => Cal.julianMonthLength(y, m),
    yearLength: (c, y) => Cal.isJulianLeapYear(y) ? 366 : 365,
    isLeap: (c, y) => Cal.isJulianLeapYear(y),
    monthsKey: (c) => 'gregorianMonths',
  ),
  'gregorian': WebCalendar(
    id: 'gregorian',
    monthCount: 12,
    historicalRange: const [0, double.infinity],
    hasGenitive: true,
    toJD: (c, y, m, d) => Cal.civilToJD(y, m, d),
    fromJD: (c, jd) => Cal.jdToCivil(jd),
    monthLength: (c, y, m) => _civilMonthLength(y, m),
    yearLength: (c, y) => _civilYearLength(y),
    isLeap: (c, y) =>
        y < 1582 ? Cal.isJulianLeapYear(y) : Cal.isGregorianLeapYear(y),
    monthsKey: (c) => 'gregorianMonths',
  ),
  'coptic': WebCalendar(
    id: 'coptic',
    monthCount: 13,
    historicalRange: const [1825030, double.infinity],
    toJD: (c, y, m, d) => Cal.copticToJD(y, m, d),
    fromJD: (c, jd) => Cal.jdToCoptic(jd),
    monthLength: (c, y, m) => Cal.copticMonthLength(y, m),
    yearLength: (c, y) => Cal.copticYearLength(y),
    isLeap: (c, y) => Cal.isCopticLeapYear(y),
    monthsKey: (c) => 'copticMonths',
  ),
  'ethiopian': WebCalendar(
    id: 'ethiopian',
    monthCount: 13,
    historicalRange: const [2269509, double.infinity],
    toJD: (c, y, m, d) => Cal.ethiopianToJD(y, m, d),
    fromJD: (c, jd) => Cal.jdToEthiopian(jd),
    monthLength: (c, y, m) => Cal.ethiopianMonthLength(y, m),
    yearLength: (c, y) => Cal.ethiopianYearLength(y),
    isLeap: (c, y) => Cal.isEthiopianLeapYear(y),
    monthsKey: (c) => 'ethiopianMonths',
  ),
  'yazdgerdi': WebCalendar(
    id: 'yazdgerdi',
    variants: const ['Shahenshahi', 'Qadimi', 'Fasli'],
    defaultVariant: 'Shahenshahi',
    monthCount: 13,
    historicalRange: const [1952063, double.infinity],
    toJD: (c, y, m, d) => c.variant == 'Qadimi'
        ? Cal.qadimiToJD(y, m, d)
        : c.variant == 'Fasli'
            ? Cal.fasliToJD(y, m, d)
            : Cal.yazdgerdiToJD(y, m, d),
    fromJD: (c, jd) => c.variant == 'Qadimi'
        ? Cal.jdToQadimi(jd)
        : c.variant == 'Fasli'
            ? Cal.jdToFasli(jd)
            : Cal.jdToYazdgerdi(jd),
    monthLength: (c, y, m) => c.variant == 'Qadimi'
        ? Cal.qadimiMonthLength(y, m)
        : c.variant == 'Fasli'
            ? Cal.fasliMonthLength(y, m)
            : Cal.yazdgerdiMonthLength(y, m),
    yearLength: (c, y) =>
        c.variant == 'Fasli' ? Cal.fasliYearLength(y) : Cal.yazdgerdiYearLength(),
    isLeap: (c, y) => c.variant == 'Fasli' ? Cal.isFasliLeapYear(y) : false,
    monthsKey: (c) => 'yazdgerdiMonths',
  ),
  'armenian': WebCalendar(
    id: 'armenian',
    monthCount: 13,
    historicalRange: const [1922711, double.infinity],
    toJD: (c, y, m, d) => Cal.armenianToJD(y, m, d),
    fromJD: (c, jd) => Cal.jdToArmenian(jd),
    monthLength: (c, y, m) => Cal.armenianMonthLength(y, m),
    yearLength: (c, y) => Cal.armenianYearLength(),
    isLeap: (c, y) => false,
    monthsKey: (c) => 'armenianMonths',
  ),
  'solarHijri': WebCalendar(
    id: 'solarHijri',
    monthCount: 12,
    historicalRange: const [2115376, double.infinity],
    toJD: (c, y, m, d) => Cal.solarHijriToJD(y, m, d),
    fromJD: (c, jd) => Cal.jdToSolarHijri(jd),
    monthLength: (c, y, m) => Cal.solarHijriMonthLength(y, m),
    yearLength: (c, y) => Cal.solarHijriYearLength(y),
    isLeap: (c, y) => Cal.isSolarHijriLeapYear(y),
    monthsKey: (c) => 'persianMonths',
  ),
  'ilkhani': WebCalendar(
    id: 'ilkhani',
    monthCount: 12,
    historicalRange: const [2196585, 2208640],
    toJD: (c, y, m, d) => Cal.ilkhaniToJD(y, m, d),
    fromJD: (c, jd) => Cal.jdToIlkhani(jd),
    monthLength: (c, y, m) => Cal.ilkhaniMonthLength(y, m),
    yearLength: (c, y) => Cal.ilkhaniYearLength(y),
    isLeap: (c, y) => Cal.isIlkhaniLeapYear(y),
    monthsKey: (c) => 'persianMonths',
  ),
  'byzantine': WebCalendar(
    id: 'byzantine',
    variants: const ['Constantinople', 'Alexandrian', 'ChronPasch'],
    defaultVariant: 'Constantinople',
    monthCount: 12,
    historicalRange: const [1903683, 2251545],
    hasGenitive: true,
    toJD: (c, y, m, d) => c.variant == 'Alexandrian'
        ? Cal.alexandrianToJD(y, m, d)
        : c.variant == 'ChronPasch'
            ? Cal.chronPaschToJD(y, m, d)
            : Cal.byzantineToJD(y, m, d),
    fromJD: (c, jd) => c.variant == 'Alexandrian'
        ? Cal.jdToAlexandrian(jd)
        : c.variant == 'ChronPasch'
            ? Cal.jdToChronPasch(jd)
            : Cal.jdToByzantine(jd),
    monthLength: (c, y, m) => c.variant == 'Alexandrian'
        ? Cal.alexandrianMonthLength(y, m)
        : c.variant == 'ChronPasch'
            ? Cal.chronPaschMonthLength(y, m)
            : Cal.byzantineMonthLength(y, m),
    yearLength: (c, y) => c.variant == 'Alexandrian'
        ? Cal.alexandrianYearLength(y)
        : c.variant == 'ChronPasch'
            ? Cal.chronPaschYearLength(y)
            : Cal.byzantineYearLength(y),
    isLeap: (c, y) => c.variant == 'Alexandrian'
        ? Cal.isAlexandrianLeapYear(y)
        : c.variant == 'ChronPasch'
            ? Cal.isChronPaschLeapYear(y)
            : Cal.isByzantineLeapYear(y),
    monthsKey: (c) =>
        (c.variant == 'Alexandrian' || c.variant == 'ChronPasch')
            ? 'alexandrianMonths'
            : 'byzantineMonths',
  ),
  'seleucid': WebCalendar(
    id: 'seleucid',
    variants: const ['Macedonian', 'Babylonian'],
    defaultVariant: 'Macedonian',
    monthCount: 12,
    historicalRange: const [1574638, 2086673],
    hasGenitive: true,
    toJD: (c, y, m, d) => c.variant == 'Babylonian'
        ? Cal.seleucidBabToJD(y, m, d)
        : Cal.seleucidToJD(y, m, d),
    fromJD: (c, jd) => c.variant == 'Babylonian'
        ? Cal.jdToSeleucidBab(jd)
        : Cal.jdToSeleucid(jd),
    monthLength: (c, y, m) => c.variant == 'Babylonian'
        ? Cal.seleucidBabMonthLength(y, m)
        : Cal.seleucidMonthLength(y, m),
    yearLength: (c, y) => c.variant == 'Babylonian'
        ? Cal.seleucidBabYearLength(y)
        : Cal.seleucidYearLength(y),
    isLeap: (c, y) => c.variant == 'Babylonian'
        ? Cal.isSeleucidBabLeapYear(y)
        : Cal.isSeleucidLeapYear(y),
    monthsKey: (c) =>
        c.variant == 'Babylonian' ? 'seleucidBabMonths' : 'seleucidMonths',
  ),
  'syriac': WebCalendar(
    id: 'syriac',
    monthCount: 12,
    historicalRange: const [1574638, 2086673],
    toJD: (c, y, m, d) => Cal.syriacToJD(y, m, d),
    fromJD: (c, jd) => Cal.jdToSyriac(jd),
    monthLength: (c, y, m) => Cal.syriacMonthLength(y, m),
    yearLength: (c, y) => Cal.syriacYearLength(y),
    isLeap: (c, y) => Cal.isSyriacLeapYear(y),
    monthsKey: (c) => 'syriacMonths',
  ),
  'rumi': WebCalendar(
    id: 'rumi',
    monthCount: 12,
    historicalRange: const [2393109, 2424516],
    hasGenitive: true,
    toJD: (c, y, m, d) => Cal.rumiToJD(y, m, d),
    fromJD: (c, jd) => Cal.jdToRumi(jd),
    monthLength: (c, y, m) => Cal.rumiMonthLength(y, m),
    yearLength: (c, y) => Cal.rumiYearLength(y),
    isLeap: (c, y) => Cal.isRumiLeapYear(y),
    monthsKey: (c) => 'gregorianMonths',
  ),
  'egyptian': WebCalendar(
    id: 'egyptian',
    monthCount: 13,
    historicalRange: const [957449, 1713064],
    toJD: (c, y, m, d) => Cal.egyptianToJD(y, m, d),
    fromJD: (c, jd) => Cal.jdToEgyptian(jd),
    monthLength: (c, y, m) => Cal.egyptianMonthLength(y, m),
    yearLength: (c, y) => Cal.egyptianYearLength(),
    isLeap: (c, y) => false,
    monthsKey: (c) => 'egyptianMonths',
  ),
  'roman': WebCalendar(
    id: 'roman',
    monthCount: 12,
    historicalRange: const [1413478, 1903683],
    toJD: (c, y, m, d) => Cal.aucToJD(y, m, d),
    fromJD: (c, jd) => Cal.jdToAuc(jd),
    monthLength: (c, y, m) => Cal.aucMonthLength(y, m),
    yearLength: (c, y) => Cal.aucYearLength(y),
    isLeap: (c, y) => Cal.isAucLeapYear(y),
    monthsKey: (c) => 'romanMonths',
  ),
  'spanish': WebCalendar(
    id: 'spanish',
    monthCount: 12,
    historicalRange: const [1704610, 2232400],
    hasGenitive: true,
    toJD: (c, y, m, d) => Cal.spanishToJD(y, m, d),
    fromJD: (c, jd) => Cal.jdToSpanish(jd),
    monthLength: (c, y, m) => Cal.spanishMonthLength(y, m),
    yearLength: (c, y) => Cal.spanishYearLength(y),
    isLeap: (c, y) => Cal.isSpanishLeapYear(y),
    monthsKey: (c) => 'gregorianMonths',
  ),
  'antiochene': WebCalendar(
    id: 'antiochene',
    monthCount: 12,
    historicalRange: const [1574638, 2086673],
    hasGenitive: true,
    toJD: (c, y, m, d) => Cal.antiocheneToJD(y, m, d),
    fromJD: (c, jd) => Cal.jdToAntiochene(jd),
    monthLength: (c, y, m) => Cal.antiocheneMonthLength(y, m),
    yearLength: (c, y) => Cal.antiocheneYearLength(y),
    isLeap: (c, y) => Cal.isAntiocheneLeapYear(y),
    monthsKey: (c) => 'seleucidMonths',
  ),
  'olympiad': WebCalendar(
    id: 'olympiad',
    monthCount: 12,
    historicalRange: const [1405084, 1867157],
    hasGenitive: true,
    toJD: (c, y, m, d) => Cal.olympiadToJD(y, m, d),
    fromJD: (c, jd) => Cal.jdToOlympiad(jd),
    monthLength: (c, y, m) => Cal.olympiadMonthLength(y, m),
    yearLength: (c, y) => Cal.olympiadYearLength(y),
    isLeap: (c, y) => Cal.isOlympiadLeapYear(y),
    monthsKey: (c) => 'gregorianMonths',
  ),
  'macedonian': WebCalendar(
    id: 'macedonian',
    monthCount: 12,
    historicalRange: const [1574638, 1903683],
    toJD: (c, y, m, d) => Cal.macedonianToJD(y, m, d),
    fromJD: (c, jd) => Cal.jdToMacedonian(jd),
    monthLength: (c, y, m) => Cal.macedonianMonthLength(y, m),
    yearLength: (c, y) => Cal.macedonianYearLength(y),
    isLeap: (c, y) => Cal.isMacedonianLeapYear(y),
    monthsKey: (c) => 'macedonianMonths',
  ),
  'hebrew': WebCalendar(
    id: 'hebrew',
    monthCount: 13,
    historicalRange: const [0, double.infinity],
    toJD: (c, y, m, d) => Cal.hebrewToJD(y, m, d),
    fromJD: (c, jd) => Cal.jdToHebrew(jd),
    monthLength: (c, y, m) => Cal.hebrewMonthLength(y, m),
    yearLength: (c, y) => Cal.hebrewYearLength(y),
    isLeap: (c, y) => Cal.isHebrewLeapYear(y),
    monthsKey: (c) => 'hebrewMonths',
  ),
  'babylonian': WebCalendar(
    id: 'babylonian',
    monthCount: 13,
    historicalRange: const [1414609, 1721058],
    toJD: (c, y, m, d) => Cal.babylonianToJD(y, m, d),
    fromJD: (c, jd) => Cal.jdToBabylonian(jd),
    monthLength: (c, y, m) => Cal.babylonianMonthLength(y, m),
    yearLength: (c, y) => Cal.babylonianYearLength(y),
    isLeap: (c, y) => Cal.isBabylonianLeapYear(y),
    monthsKey: (c) => 'babylonianMonths',
  ),
  'bp': WebCalendar(
    id: 'bp',
    monthCount: 12,
    historicalRange: null,
    hasGenitive: true,
    toJD: (c, y, m, d) => Cal.bpToJD(y, m, d),
    fromJD: (c, jd) => Cal.jdToBP(jd),
    monthLength: (c, y, m) => Cal.bpMonthLength(y, m),
    yearLength: (c, y) => Cal.bpYearLength(y),
    isLeap: (c, y) => Cal.isBPLeapYear(y),
    monthsKey: (c) => 'gregorianMonths',
  ),
  'human': WebCalendar(
    id: 'human',
    variants: Cal.HUMAN_VARIANTS,
    defaultVariant: Cal.HUMAN_DEFAULT,
    monthCount: 12,
    historicalRange: null,
    hasGenitive: true,
    toJD: (c, y, m, d) => Cal.humanToJD(y, m, d, c.variant),
    fromJD: (c, jd) => Cal.jdToHuman(jd, c.variant),
    monthLength: (c, y, m) => Cal.humanMonthLength(y, m, c.variant),
    yearLength: (c, y) => Cal.humanYearLength(y, c.variant),
    isLeap: (c, y) => Cal.isHumanLeapYear(y, c.variant),
    monthsKey: (c) => 'gregorianMonths',
  ),
};

// Grouped picker structure — CALENDAR_GROUPS in js/app.js.
class CalendarGroup {
  final String group;
  final List<String> items;
  const CalendarGroup(this.group, this.items);
}

const List<CalendarGroup> kCalendarGroups = [
  CalendarGroup('universal', ['human']),
  CalendarGroup('christian', ['gregorian', 'julian', 'byzantine', 'spanish']),
  CalendarGroup('islamic', ['hijri', 'solarHijri', 'rumi']),
  CalendarGroup('iranian', ['yazdgerdi', 'ilkhani', 'armenian']),
  CalendarGroup('semitic', ['hebrew', 'syriac', 'antiochene', 'seleucid', 'babylonian']),
  CalendarGroup('african', ['coptic', 'ethiopian', 'egyptian']),
  CalendarGroup('grecoRoman', ['roman', 'olympiad', 'macedonian']),
  CalendarGroup('scientific', ['bp']),
];

// CONTEXTUAL_PRIORITY in js/app.js.
const List<String> kContextualPriority = [
  'gregorian', 'hijri', 'julian', 'hebrew', 'coptic', 'byzantine',
  'seleucid', 'syriac', 'solarHijri', 'yazdgerdi', 'armenian',
  'ethiopian', 'roman', 'babylonian', 'macedonian', 'antiochene',
  'egyptian', 'olympiad', 'spanish', 'ilkhani', 'rumi',
];

// VARIANT_LABELS in js/app.js — scholarly labels, never translated.
const Map<String, String> kVariantLabels = {
  'IIc': 'Wüstenfeld',
  'IIa': 'East civil',
  'IIIa': 'West civil',
  'IVa': 'Ḥabash',
  'Constantinople': 'Constantinople',
  'Alexandrian': 'Alexandrian',
  'ChronPasch': 'Chron. Paschale',
  'Macedonian': 'Macedonian',
  'Babylonian': 'Babylonian',
  'Shahenshahi': 'Shahenshahi',
  'Qadimi': 'Qadimi',
  'Fasli': 'Fasli',
  'Proleptic': 'Proleptic Gregorian',
  'Civil': 'Julian/Gregorian',
};

// VARIANT_PRIORITY in js/app.js — lower = shown as groups, not toggle.
const Map<String, int> kVariantPriority = {
  'byzantine': 1,
  'hijri': 2,
  'yazdgerdi': 3,
  'seleucid': 4,
  'human': 5,
};

// shortCalName() in js/app.js.
String shortCalName(String id) {
  const short = {
    'hijri': 'AH', 'julian': 'Jul.', 'gregorian': 'AD', 'coptic': 'Copt.',
    'ethiopian': 'Eth.', 'yazdgerdi': 'Zoro.', 'armenian': 'Arm.',
    'solarHijri': 'SH', 'byzantine': 'Byz.', 'alexandrian': 'Alex.',
    'seleucid': 'Sel.', 'syriac': 'Syr.', 'rumi': 'Rūmī',
    'egyptian': 'Egypt.', 'spanish': 'Span.',
    'roman': 'Rom.', 'olympiad': 'Ol.', 'macedonian': 'Mac.',
    'ilkhani': 'Ilkh.', 'antiochene': 'Ant.', 'hebrew': 'AM',
    'babylonian': 'Bab.', 'bp': 'BP', 'human': 'HE',
  };
  return short[id] ?? id;
}

// calTag() in js/app.js — tag shown next to a date in the result card.
// Roman dates already carry an "AUC" suffix, so they get no extra tag.
String calTag(String id) => id == 'roman' ? '' : shortCalName(id);

// romanDayNotation() from js/hijri.js — Kalends/Nones/Ides day naming.
String romanDayNotation(int month, int day, bool isLeap) {
  final long = month == 3 || month == 5 || month == 7 || month == 10;
  final nones = long ? 7 : 5;
  final ides = long ? 15 : 13;
  final mLen = [31, isLeap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const abl = ['Ianuariis', 'Februariis', 'Martiis', 'Aprilibus', 'Maiis',
    'Iuniis', 'Iuliis', 'Augustis', 'Septembribus', 'Octobribus',
    'Novembribus', 'Decembribus'];
  const acc = ['Ianuarias', 'Februarias', 'Martias', 'Apriles', 'Maias',
    'Iunias', 'Iulias', 'Augustas', 'Septembres', 'Octobres', 'Novembres',
    'Decembres'];

  if (day == 1) return 'Kalendis ${abl[month - 1]}';
  if (day == nones) return 'Nonis ${abl[month - 1]}';
  if (day == ides) return 'Idibus ${abl[month - 1]}';

  String rom(int n) {
    const vals = [10, 9, 5, 4, 1];
    const syms = ['X', 'IX', 'V', 'IV', 'I'];
    var s = '';
    var x = n;
    for (var i = 0; i < vals.length; i++) {
      while (x >= vals[i]) {
        s += syms[i];
        x -= vals[i];
      }
    }
    return s;
  }

  int count;
  String target;
  int nextMonth;
  if (day < nones) {
    count = nones - day + 1;
    target = 'Nonas';
    nextMonth = month;
  } else if (day < ides) {
    count = ides - day + 1;
    target = 'Idus';
    nextMonth = month;
  } else {
    nextMonth = month == 12 ? 1 : month + 1;
    count = mLen[month - 1] - day + 2;
    target = 'Kalendas';
  }
  if (count == 2) return 'pridie $target ${acc[nextMonth - 1]}';
  return 'ante diem ${rom(count)} $target ${acc[nextMonth - 1]}';
}

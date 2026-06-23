// Calendar registry: maps calendar IDs to conversion funcs + month names.
// Mirrors js/app.js CALENDARS structure.

import 'cal.dart';

typedef ToJD = double Function(int year, int month, int day);
typedef FromJD = YMD Function(double jd);
typedef MonthLen = int Function(int year, int month);

class CalendarDef {
  final String id;
  final String name;
  final ToJD toJD;
  final FromJD fromJD;
  final MonthLen monthLength;
  final List<String> monthNames;
  final int defaultYear;
  final int defaultMonth;
  final int defaultDay;
  const CalendarDef({
    required this.id,
    required this.name,
    required this.toJD,
    required this.fromJD,
    required this.monthLength,
    required this.monthNames,
    this.defaultYear = 2000,
    this.defaultMonth = 1,
    this.defaultDay = 1,
  });
}

// ---------- Month name tables ----------
const List<String> _GREGORIAN_MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const List<String> _JULIAN_MONTHS = _GREGORIAN_MONTHS;

// ISO 233 transliteration of Hijri month names
const List<String> _HIJRI_MONTHS = [
  'Muḥarram','Ṣafar','Rabīʿ al-awwal','Rabīʿ ath-thānī',
  'Jumādā al-ūlā','Jumādā ath-thāniyah','Rajab','Shaʿbān',
  'Ramaḍān','Shawwāl','Dhū al-Qaʿdah','Dhū al-Ḥijjah'
];

const List<String> _COPTIC_MONTHS = [
  'Thout','Paopi','Hathor','Koiak','Tobi','Meshir',
  'Paremhat','Parmouti','Pashons','Paoni','Epip','Mesori','Pi Kogi Enavot'
];

const List<String> _ETHIOPIAN_MONTHS = [
  'Mäskäräm','Ṭəqəmt','Ḫədar','Taḫśaś','Ṭərr','Yäkatit',
  'Mägabit','Miyazya','Gənbo','Säne','Ḥamle','Näḥase','Ṗagʷəmen'
];

const List<String> _PERSIAN_ANCIENT_MONTHS = [
  'Farvardin','Ardibehesht','Khordad','Tir','Amordad','Shahrivar',
  'Mehr','Aban','Azar','Dey','Bahman','Esfand','Andargah'
];

const List<String> _SOLAR_HIJRI_MONTHS = [
  'Farvardin','Ordibehesht','Khordad','Tir','Mordad','Shahrivar',
  'Mehr','Aban','Azar','Dey','Bahman','Esfand'
];

const List<String> _ARMENIAN_MONTHS = [
  'Nawasardi','Hoṙi','Sahmi','Trē','Kʿałocʿ','Aracʿ',
  'Mehekani','Areg','Ahekani','Mareri','Margacʿ','Hroticʿ','Aweleacʿ'
];

const List<String> _EGYPTIAN_MONTHS = [
  'Thoth','Phaophi','Athyr','Choiak','Tybi','Mechir',
  'Phamenoth','Pharmuthi','Pachon','Payni','Epiphi','Mesore','Epagomenae'
];

const List<String> _BYZANTINE_MONTHS = [
  'September','October','November','December',
  'January','February','March','April','May','June','July','August'
];

const List<String> _ALEXANDRIAN_MONTHS = [
  'March','April','May','June','July','August',
  'September','October','November','December','January','February'
];

const List<String> _MACEDONIAN_MONTHS = [
  'Dios','Apellaios','Audynaios','Peritios','Dystros','Xanthikos',
  'Artemisios','Daisios','Panemos','Loos','Gorpiaios','Hyperberetaios'
];

const List<String> _SELEUCID_BAB_MONTHS = [
  'Nisannu','Ayaru','Simanu','Duʾuzu','Abu','Ululu',
  'Tashritu','Arahsamna','Kislimu','Tebetu','Shabatu','Addaru'
];

const List<String> _SYRIAC_MONTHS = [
  'Kānūn II','Šbāṭ','Āḏār','Nīsān','Ayyār','Ḥzīrān',
  'Tammūz','Āb','Aylūl','Tišrīn I','Tišrīn II','Kānūn I'
];

const List<String> _HEBREW_MONTHS = [
  'Tishrei','Cheshvan','Kislev','Tevet','Shevat','Adar',
  'Adar II','Nisan','Iyar','Sivan','Tammuz','Av','Elul'
];

final List<CalendarDef> kCalendars = [
  CalendarDef(
    id: 'gregorian', name: 'Gregorian',
    toJD: Cal.gregorianToJD, fromJD: Cal.jdToGregorian,
    monthLength: Cal.gregorianMonthLength,
    monthNames: _GREGORIAN_MONTHS,
    defaultYear: 2026, defaultMonth: 6, defaultDay: 23,
  ),
  CalendarDef(
    id: 'julian', name: 'Julian',
    toJD: Cal.julianToJD, fromJD: Cal.jdToJulian,
    monthLength: Cal.julianMonthLength,
    monthNames: _JULIAN_MONTHS,
    defaultYear: 2026, defaultMonth: 6, defaultDay: 10,
  ),
  CalendarDef(
    id: 'hijri', name: 'Hijri (Tabular)',
    toJD: (y, m, d) => Cal.hijriToJD(y, m, d),
    fromJD: (j) => Cal.jdToHijri(j),
    monthLength: (y, m) => Cal.hijriMonthLength(y, m),
    monthNames: _HIJRI_MONTHS,
    defaultYear: 1447, defaultMonth: 12, defaultDay: 7,
  ),
  CalendarDef(
    id: 'solar_hijri', name: 'Solar Hijri (Persian)',
    toJD: Cal.solarHijriToJD, fromJD: Cal.jdToSolarHijri,
    monthLength: Cal.solarHijriMonthLength,
    monthNames: _SOLAR_HIJRI_MONTHS,
    defaultYear: 1405, defaultMonth: 4, defaultDay: 2,
  ),
  CalendarDef(
    id: 'coptic', name: 'Coptic',
    toJD: Cal.copticToJD, fromJD: Cal.jdToCoptic,
    monthLength: Cal.copticMonthLength,
    monthNames: _COPTIC_MONTHS,
    defaultYear: 1742, defaultMonth: 10, defaultDay: 16,
  ),
  CalendarDef(
    id: 'ethiopian', name: 'Ethiopian',
    toJD: Cal.ethiopianToJD, fromJD: Cal.jdToEthiopian,
    monthLength: Cal.ethiopianMonthLength,
    monthNames: _ETHIOPIAN_MONTHS,
    defaultYear: 2018, defaultMonth: 10, defaultDay: 16,
  ),
  CalendarDef(
    id: 'yazdgerdi', name: 'Yazdgerdi (Shahenshahi)',
    toJD: (y, m, d) => Cal.yazdgerdiToJD(y, m, d),
    fromJD: Cal.jdToYazdgerdi,
    monthLength: (y, m) => Cal.yazdgerdiMonthLength(y, m),
    monthNames: _PERSIAN_ANCIENT_MONTHS,
    defaultYear: 1395,
  ),
  CalendarDef(
    id: 'qadimi', name: 'Qadimi (Parsi)',
    toJD: (y, m, d) => Cal.qadimiToJD(y, m, d),
    fromJD: Cal.jdToQadimi,
    monthLength: (y, m) => Cal.qadimiMonthLength(y, m),
    monthNames: _PERSIAN_ANCIENT_MONTHS,
    defaultYear: 1395,
  ),
  CalendarDef(
    id: 'fasli', name: 'Fasli',
    toJD: Cal.fasliToJD, fromJD: Cal.jdToFasli,
    monthLength: Cal.fasliMonthLength,
    monthNames: _PERSIAN_ANCIENT_MONTHS,
    defaultYear: 1395,
  ),
  CalendarDef(
    id: 'armenian', name: 'Armenian',
    toJD: (y, m, d) => Cal.armenianToJD(y, m, d),
    fromJD: Cal.jdToArmenian,
    monthLength: (y, m) => Cal.armenianMonthLength(y, m),
    monthNames: _ARMENIAN_MONTHS,
    defaultYear: 1475,
  ),
  CalendarDef(
    id: 'egyptian', name: 'Egyptian (Nabonassar)',
    toJD: (y, m, d) => Cal.egyptianToJD(y, m, d),
    fromJD: Cal.jdToEgyptian,
    monthLength: (y, m) => Cal.egyptianMonthLength(y, m),
    monthNames: _EGYPTIAN_MONTHS,
    defaultYear: 2773,
  ),
  CalendarDef(
    id: 'byzantine', name: 'Byzantine (Anno Mundi)',
    toJD: Cal.byzantineToJD, fromJD: Cal.jdToByzantine,
    monthLength: Cal.byzantineMonthLength,
    monthNames: _BYZANTINE_MONTHS,
    defaultYear: 7534,
  ),
  CalendarDef(
    id: 'alexandrian', name: 'Alexandrian',
    toJD: Cal.alexandrianToJD, fromJD: Cal.jdToAlexandrian,
    monthLength: Cal.alexandrianMonthLength,
    monthNames: _ALEXANDRIAN_MONTHS,
    defaultYear: 7518,
  ),
  CalendarDef(
    id: 'chron_pasch', name: 'Chronicon Paschale',
    toJD: Cal.chronPaschToJD, fromJD: Cal.jdToChronPasch,
    monthLength: Cal.chronPaschMonthLength,
    monthNames: _ALEXANDRIAN_MONTHS,
    defaultYear: 7534,
  ),
  CalendarDef(
    id: 'seleucid', name: 'Seleucid (Syrian)',
    toJD: Cal.seleucidToJD, fromJD: Cal.jdToSeleucid,
    monthLength: Cal.seleucidMonthLength,
    monthNames: _MACEDONIAN_MONTHS,
    defaultYear: 2337,
  ),
  CalendarDef(
    id: 'seleucid_bab', name: 'Seleucid (Babylonian)',
    toJD: Cal.seleucidBabToJD, fromJD: Cal.jdToSeleucidBab,
    monthLength: Cal.seleucidBabMonthLength,
    monthNames: _SELEUCID_BAB_MONTHS,
    defaultYear: 2337,
  ),
  CalendarDef(
    id: 'syriac', name: 'Syriac',
    toJD: Cal.syriacToJD, fromJD: Cal.jdToSyriac,
    monthLength: Cal.syriacMonthLength,
    monthNames: _SYRIAC_MONTHS,
    defaultYear: 2337,
  ),
  CalendarDef(
    id: 'rumi', name: 'Rūmī (Ottoman)',
    toJD: Cal.rumiToJD, fromJD: Cal.jdToRumi,
    monthLength: Cal.rumiMonthLength,
    monthNames: _JULIAN_MONTHS,
    defaultYear: 1442,
  ),
  CalendarDef(
    id: 'ilkhani', name: 'Ilkhanid (Khani)',
    toJD: Cal.ilkhaniToJD, fromJD: Cal.jdToIlkhani,
    monthLength: Cal.ilkhaniMonthLength,
    monthNames: _SOLAR_HIJRI_MONTHS,
    defaultYear: 725,
  ),
  CalendarDef(
    id: 'auc', name: 'Ab Urbe Condita',
    toJD: Cal.aucToJD, fromJD: Cal.jdToAuc,
    monthLength: Cal.aucMonthLength,
    monthNames: _JULIAN_MONTHS,
    defaultYear: 2779,
  ),
  CalendarDef(
    id: 'spanish', name: 'Spanish Era',
    toJD: Cal.spanishToJD, fromJD: Cal.jdToSpanish,
    monthLength: Cal.spanishMonthLength,
    monthNames: _JULIAN_MONTHS,
    defaultYear: 2064,
  ),
  CalendarDef(
    id: 'antiochene', name: 'Antiochene Era',
    toJD: Cal.antiocheneToJD, fromJD: Cal.jdToAntiochene,
    monthLength: Cal.antiocheneMonthLength,
    monthNames: _BYZANTINE_MONTHS,
    defaultYear: 2074,
  ),
  CalendarDef(
    id: 'olympiad', name: 'Olympiad',
    toJD: Cal.olympiadToJD, fromJD: Cal.jdToOlympiad,
    monthLength: Cal.olympiadMonthLength,
    monthNames: _JULIAN_MONTHS,
    defaultYear: 2802,
  ),
  CalendarDef(
    id: 'macedonian', name: 'Macedonian',
    toJD: Cal.macedonianToJD, fromJD: Cal.jdToMacedonian,
    monthLength: Cal.macedonianMonthLength,
    monthNames: _MACEDONIAN_MONTHS,
    defaultYear: 2337,
  ),
  CalendarDef(
    id: 'hebrew', name: 'Hebrew (Jewish)',
    toJD: Cal.hebrewToJD, fromJD: Cal.jdToHebrew,
    monthLength: Cal.hebrewMonthLength,
    monthNames: _HEBREW_MONTHS,
    defaultYear: 5786,
  ),
  CalendarDef(
    id: 'bp', name: 'Before Present (BP)',
    toJD: Cal.bpToJD, fromJD: Cal.jdToBP,
    monthLength: Cal.bpMonthLength,
    monthNames: _GREGORIAN_MONTHS,
    defaultYear: -76,
  ),
  CalendarDef(
    id: 'human', name: 'Human Era (HE)',
    toJD: (y, m, d) => Cal.humanToJD(y, m, d),
    fromJD: (j) => Cal.jdToHuman(j),
    monthLength: (y, m) => Cal.humanMonthLength(y, m),
    monthNames: _GREGORIAN_MONTHS,
    defaultYear: 12026, defaultMonth: 6, defaultDay: 23,
  ),
];

CalendarDef? findCalendar(String id) {
  for (final c in kCalendars) { if (c.id == id) return c; }
  return null;
}

const List<String> kWeekdays = [
  'Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'
];

const List<String> kZodiac = [
  'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
  'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'
];

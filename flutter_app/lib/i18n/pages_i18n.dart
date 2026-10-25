// GENERATED from js/pages.js + calendars.html by tools/gen_pages_i18n_dart.js
// — do not edit strings by hand; rerun the generator instead.
//
// kalkal — subpage (Calendars / Methodology / About) content for the Flutter
// port. Languages: English, Polish, Esperanto (js/pages.js has no Arabic
// block; the web subpages are en/pl/eo only).
//
// Contents:
//   * PageI18N            -> [PagesI18n.strings] / [nav] / [about] /
//                            [calendarDescriptions] / [calendarVariantItems] /
//                            [methSections] / [methSourceItems]
//   * SEASON_LABELS       -> [PagesI18n.seasonLabels]
//   * CAL_MONTH_META      -> [PagesI18n.calMonthMeta] (month-season grid)
//   * CAL_GROUPS (IIFE)   -> [PagesI18n.calGroups] (TOC grouping, card order)
//   * methSections (IIFE) -> [PagesI18n.methSectionOrder]
//   * calendars.html      -> [PagesI18n.variantLabels] (static <strong> labels
//                            and leap-year notes of the variant lists, which
//                            the JS never localizes)
//
// ignore_for_file: lines_longer_than_80_chars

/// One entry of the month-season visualization grid (CAL_MONTH_META in
/// js/pages.js): which month-name array to use, day counts per month
/// (verbatim, e.g. '28/29'), and the season of each month
/// (0=spring, 1=summer, 2=autumn, 3=winter; null = wandering/lunar calendar
/// with no fixed season mapping).
class CalMonthMeta {
  const CalMonthMeta(this.monthsKey, this.days, this.seasons);
  final String monthsKey;
  final List<String> days;
  final List<int>? seasons;
}

/// One calendar group of the Calendars page (CAL_GROUPS in js/pages.js):
/// TOC grouping and card/section order. Group labels are localized via
/// I18n.calendarGroup(lang, id).
class PageCalGroup {
  const PageCalGroup(this.id, this.calendarIds);
  final String id;
  final List<String> calendarIds;
}

/// One static variant label of a cal-variants-list in calendars.html:
/// the variant id (data-variant-id), its bold label (e.g. 'IIc — Wüstenfeld'),
/// and the untranslated leap-year/epoch note (may be empty). The localized
/// description comes from [PagesI18n.calendarVariantItems] at the same index.
class CalVariantLabel {
  const CalVariantLabel(this.id, this.label, this.note);
  final String id;
  final String label;
  final String note;
}

class PagesI18n {
  PagesI18n._();

  /// Languages present in PageI18N, in source order.
  static const List<String> supportedLangs = ['en', 'pl', 'eo'];

  /// Flat page strings (titles, subtitles, labels): lang -> key -> value.
  static const Map<String, Map<String, String>> strings = {
    'en': {
      'calPageTitle': 'Calendar Systems',
      'dynPageTitle': 'Regnal Tables',
      'dynPageSubtitle': 'Chronological tables of rulers and dynasties',
      'calPageSubtitle': 'Descriptions of the calendar systems supported by kalkal',
      'methPageTitle': 'Methodology',
      'methPageSubtitle': 'How kalkal was built, how it calculates, and how it is verified',
      'backToConverter': 'Back to converter',
      'formulaLabel': 'Formula and code',
      'tocTitle': 'Contents',
      'settingsExample': 'Example: 1 {m} 8 AH, Julian date',
      'sourceLabel': 'Algorithm source',
      'methIntro': 'kalkal is a zero-dependency, client-side date converter built entirely with arithmetic algorithms. All conversions are deterministic, reproducible, and independently verifiable.',
    },
    'pl': {
      'calPageTitle': 'Systemy kalendarzowe',
      'dynPageTitle': 'Tablice panowań',
      'dynPageSubtitle': 'Tablice chronologiczne władców i dynastii',
      'calPageSubtitle': 'Opisy systemów kalendarzowych obsługiwanych przez kalkal',
      'methPageTitle': 'Metodologia',
      'methPageSubtitle': 'Jak zbudowano kalkal, jak oblicza i jak jest weryfikowany',
      'backToConverter': 'Powrót do konwertera',
      'formulaLabel': 'Formuła i kod',
      'tocTitle': 'Spis treści',
      'settingsExample': 'Przykład: 1 {m} 8 AH, data juliańska',
      'sourceLabel': 'Źródło algorytmu',
      'methIntro': 'kalkal to konwerter dat działający w przeglądarce, bez zależności, oparty wyłącznie na algorytmach arytmetycznych. Wszystkie konwersje są deterministyczne, powtarzalne i niezależnie weryfikowalne.',
    },
    'eo': {
      'calPageTitle': 'Kalendarsistemoj',
      'dynPageTitle': 'Regnotabeloj',
      'dynPageSubtitle': 'Kronologiaj tabeloj de regantoj kaj dinastioj',
      'calPageSubtitle': 'Priskriboj de la kalendarsistemoj subtenataj de kalkal',
      'methPageTitle': 'Metodologio',
      'methPageSubtitle': 'Kiel kalkal estas konstruita, kiel ĝi kalkulas, kaj kiel ĝi estas validata',
      'backToConverter': 'Reen al konvertilo',
      'formulaLabel': 'Formulo kaj kodo',
      'tocTitle': 'Enhavo',
      'settingsExample': 'Ekzemplo: 1-a de {m} 8 AH, julia dato',
      'sourceLabel': 'Algoritma fonto',
      'methIntro': 'kalkal estas sendependa, retumil-bazita datkonvertilo konstruita tute per aritmetikaj algoritmoj. Ĉiuj konvertoj estas determinismaj, ripeteblaj kaj sendepende kontroleblaj.',
    },
  };

  /// Subpage navigation labels: lang -> key -> label.
  static const Map<String, Map<String, String>> nav = {
    'en': {
      'converter': 'Converter',
      'calendars': 'Calendars',
      'methodology': 'Methodology',
      'dynasties': 'Regnal Tables',
      'android': 'Android',
    },
    'pl': {
      'converter': 'Konwerter',
      'calendars': 'Kalendarze',
      'methodology': 'Metodologia',
      'dynasties': 'Tablice panowań',
      'android': 'Android',
    },
    'eo': {
      'converter': 'Konvertilo',
      'calendars': 'Kalendaroj',
      'methodology': 'Metodologio',
      'dynasties': 'Regnotabeloj',
      'android': 'Android',
    },
  };

  /// About page (author card) strings: lang -> key -> value.
  static const Map<String, Map<String, String>> about = {
    'en': {
      'title': 'kalkal — Author',
      'namePrefix': 'Dr',
      'bio': 'History and Arabic studies. kalkal converts dates between more than 20 calendars.',
      'note': 'The tool is free. If you find it useful, you can buy me a coffee.',
      'kofi': 'Buy me a coffee',
      'email': 'Write to me',
      'github': 'Code on GitHub',
      'citeTitle': 'How to cite',
      'citeText': 'Sypiański, J. kalkal: multi-calendar date converter. kalkal.online, 2026.',
      'citeCopy': 'Copy',
      'citeCopied': 'Copied',
      'privacy': 'Privacy policy',
    },
    'pl': {
      'title': 'kalkal — Autor',
      'namePrefix': 'dr',
      'bio': 'Historia i arabistyka. kalkal przelicza daty między ponad 20 kalendarzami.',
      'note': 'Narzędzie jest bezpłatne. Jeśli ci się przydaje, możesz postawić mi kawę.',
      'kofi': 'Postaw mi kawę',
      'email': 'Napisz do mnie',
      'github': 'Kod na GitHubie',
      'citeTitle': 'Jak cytować',
      'citeText': 'Sypiański, J. kalkal: konwerter dat między kalendarzami. kalkal.online, 2026.',
      'citeCopy': 'Kopiuj',
      'citeCopied': 'Skopiowano',
      'privacy': 'Polityka prywatności',
    },
    'eo': {
      'title': 'kalkal — Aŭtoro',
      'namePrefix': 'd-ro',
      'bio': 'Historio kaj arabistiko. kalkal konvertas datojn inter pli ol 20 kalendaroj.',
      'note': 'La ilo estas senpaga. Se ĝi utilas al vi, vi povas regali min per kafo.',
      'kofi': 'Regalu min per kafo',
      'email': 'Skribu al mi',
      'github': 'Kodo en GitHub',
      'citeTitle': 'Kiel citi',
      'citeText': 'Sypiański, J. kalkal: datokonvertilo inter kalendaroj. kalkal.online, 2026.',
      'citeCopy': 'Kopii',
      'citeCopied': 'Kopiite',
      'privacy': 'Privateca politiko',
    },
  };

  /// Per-calendar descriptions for the Calendars page:
  /// lang -> calendar id -> field -> text.
  /// Fields (presence varies by calendar/language): name, type, epoch, intro,
  /// body, adoption, usage, tabular, arithmetic, variantsDivergence, source,
  /// warning, months.
  static const Map<String, Map<String, Map<String, String>>> calendarDescriptions = {
    'en': {
      'gregorian': {
        'name': 'AD Calendar (Julian→Gregorian)',
        'type': 'Solar',
        'epoch': 'January 1, 1 CE',
        'intro': 'The AD (Anno Domini) dating system, using the Julian calendar before 15 October 1582 and the Gregorian calendar after. This reflects how dates were actually reckoned in the Western world: no one used the Gregorian calendar before it existed.',
        'body': 'Before 1582, dates follow the Julian calendar (leap year every 4 years, no exceptions). From 15 October 1582 onward, the Gregorian reform applies: a year is a leap year if divisible by 4, unless also divisible by 100 — except when divisible by 400. The reform corrected approximately 10 days of accumulated drift since the Council of Nicaea (325 CE). The pure Julian and pure Gregorian calendars are available separately for proleptic calculations.',
        'adoption': 'Catholic countries adopted the Gregorian reform in 1582, but Protestant and Orthodox nations followed much later: the British Empire in 1752, Russia in 1918, Greece in 1923, and Turkey in 1926.',
        'source': 'Meeus, Jean. Astronomical Algorithms, 2nd ed. (1998), ch. 7. Julian: eq. 7.1 with B = 0. Gregorian: eq. 7.1 with correction A = ⌊Y/100⌋, B = 2 − A + ⌊A/4⌋. Cutover at JD 2299160.5.',
        'months': 'Twelve months of 28–31 days: January (31), February (28/29), March (31), April (30), May (31), June (30), July (31), August (31), September (30), October (31), November (30), December (31).',
      },
      'julian': {
        'name': 'Julian Calendar',
        'type': 'Solar',
        'epoch': 'January 1, 1 CE (proleptic)',
        'intro': 'The Julian calendar was introduced by Julius Caesar in 46 BCE, effective from 1 January 45 BCE, replacing the earlier Roman calendar. It was the predominant calendar in Europe and the Mediterranean world for over 1,600 years.',
        'body': 'The Julian calendar established a simple leap year rule: every year divisible by 4 is a leap year, giving a mean year of exactly 365.25 days. This is about 11 minutes longer than the tropical year, leading to an accumulated error of approximately 1 day every 128 years.',
        'adoption': 'By the 16th century, the calendar had drifted about 10 days from the astronomical equinox, prompting the Gregorian reform. The Julian calendar is still used liturgically by some Eastern Orthodox churches (the "Old Calendar"), and it remains the standard for historical dating before 15 October 1582.',
        'source': 'Meeus, Jean. Astronomical Algorithms, 2nd ed. (1998), ch. 7, eq. 7.1 with B = 0 (no century correction). The Julian calendar omits the Gregorian correction term, giving a fixed mean year of exactly 365.25 days.',
        'months': 'Twelve months identical in name and length to the Gregorian calendar, differing only in the leap year rule (every 4th year, without exception).',
      },
      'hijri': {
        'name': 'Hijri Calendar (Lunar Islamic)',
        'type': 'Lunar',
        'epoch': '1 Muharram 1 AH = 16 July 622 CE (Julian)',
        'intro': 'The Hijri calendar (at-taqwim al-hijri) is a purely lunar calendar of 12 months used throughout the Islamic world for religious observances. Its epoch is the Hijra (emigration) of the Prophet Muhammad from Mecca to Medina.',
        'body': 'Each month begins, in principle, with the sighting of the new crescent moon. The calendar alternates months of 30 and 29 days, with a leap day added to the last month (Dhu al-Hijja) in certain years. The year is approximately 354 days long (355 in leap years), making it about 11 days shorter than the solar year. The calendar therefore cycles through the seasons over a period of roughly 33 years.',
        'tabular': 'The tabular (arithmetic) version of the Hijri calendar — used in kalkal — employs a fixed 30-year cycle in which 11 years are leap years (355 days) and 19 are common (354 days). Four historical variants exist, differing only in which years of the cycle are designated as leap:',
        'variantsDivergence': 'Variants differ by exactly 1 day for dates falling in the years of the 30-year cycle where their leap assignments diverge. IIc vs IIa: 1 year per cycle (~3.3% of dates) — example: 1 Muḥarram 1429 AH = 10 January 2008 CE (IIc) vs 9 January 2008 CE (IIa). IIIa vs IIc: 2 years per cycle (~6.7%). IVa vs IIc: 4 years per cycle (~13.3%).',
        'source': 'de Blois, François. “Taʿrīkh” in Encyclopaedia of Islam, 2nd ed. Variant classification from Richards, E. G. Mapping Time (1998), table 15.4. “In a cycle of 30 years, there are 19 common years of 354 days and 11 leap years of 355 days.”',
        'months': 'Twelve months: Muḥarram (30), Ṣafar (29), Rabīʿ al-Awwal (30), Rabīʿ aṯ-Ṯānī (29), Ǧumādā al-Ūlā (30), Ǧumādā al-Āḫira (29), Raǧab (30), Šaʿbān (29), Ramaḍān (30), Šawwāl (29), Ḏū al-Qaʿda (30), Ḏū al-Ḥiǧǧa (29 or 30).',
      },
      'solarHijri': {
        'name': 'Solar Hijri Calendar (Iranian)',
        'type': 'Solar',
        'epoch': '1 Farvardin 1 AP = 22 March 622 CE (Julian)',
        'intro': 'The Solar Hijri calendar (gāhšomārī-ye heǧrī-ye ḫoršīdī) is the official calendar of Iran and Afghanistan. It is a solar calendar whose epoch coincides with the Hijra, but whose year length tracks the tropical year via the vernal equinox.',
        'body': 'The first six months have 31 days, the next five have 30 days, and the twelfth month (Esfand) has 29 days in common years and 30 in leap years. Officially, the new year (Nowruz) begins at the astronomical vernal equinox as observed from Tehran.',
        'arithmetic': 'For computational purposes, kalkal uses the arithmetic approximation based on a 2820-year cycle (containing exactly 1,029,983 days), which closely matches the astronomical calendar. Leap years are determined by a formula involving this cycle, attributed to Ahmad Birashk and refined by K. M. Borkowski.',
        'source': 'Birashk, Ahmad. A Comparative Calendar (1993). Borkowski, K. M. "ELP2000-85 and the Dynamical Time – Universal Time relation," Astronomy and Astrophysics, 205 (1988). "The 2820-year cycle contains exactly 683 leap years in 1,029,983 days."',
        'warning': 'For dates before the 20th century, this arithmetic approximation (2820-year cycle) may differ by ±1 day from the historical Jalali calendar, which was based on astronomical observation of the vernal equinox. The Jalali calendar was established by Omar Khayyam in 1079 CE; no systematic tables of historical equinox dates survive.',
        'months': 'Twelve months: Farvardin (31), Ordibehešt (31), Ḫordād (31), Tir (31), Mordād (31), Šahrivar (31), Mehr (30), Ābān (30), Āḏar (30), Dey (30), Bahman (30), Esfand (29/30).',
      },
      'ilkhani': {
        'name': 'Ilkhanid Calendar (Khānī)',
        'type': 'Solar',
        'epoch': '1 Farvardin 1 = 13 March 1302 CE (Julian)',
        'intro': 'The Ilkhanid calendar (tārīkh-i khānī / tārīkh-i ghazānī) was established by Ghazan Khan as the fiscal calendar of the Mongol Ilkhanate in Persia.',
        'body': 'Structurally identical to the Solar Hijri calendar with a different epoch. The 12-year Turkic-Mongol animal cycle (sichqan, ud, bars, ...) is overlaid on the year count.',
        'source': 'Encyclopaedia Iranica, "Calendars." Charles Melville, "The Chinese-Uighur Animal Calendar in Persian Historiography."',
        'warning': 'The Ilkhanid calendar (1302–~1335 CE) was based on astronomical observation at the Maragheh observatory, not on the 2820-year arithmetic cycle used here. For dates in the Ilkhanid period, the arithmetic approximation may differ by ±1 day from the actual historical calendar. No observational tables survive.',
        'months': 'Twelve months: Farvardin (31), Ordibehešt (31), Ḫordād (31), Tir (31), Mordād (31), Šahrivar (31), Mehr (30), Ābān (30), Āḏar (30), Dey (30), Bahman (30), Esfand (29/30).',
      },
      'coptic': {
        'name': 'Coptic Calendar',
        'type': 'Solar',
        'epoch': '1 Thout 1 AM = 29 August 284 CE (Julian)',
        'intro': 'The Coptic calendar (also called the Alexandrian calendar) descends from the ancient Egyptian civil calendar, reformed under Augustus to include a leap year. It counts years from the Era of the Martyrs (Anno Martyrum, AM), beginning with the accession of the Roman emperor Diocletian.',
        'body': 'The calendar consists of 12 months of 30 days each, followed by a short 13th month (Epagomenai) of 5 days in common years or 6 in leap years. Leap years occur every 4 years, when the year number leaves a remainder of 3 when divided by 4. The mean year is 365.25 days, identical to the Julian calendar.',
        'usage': 'The Coptic calendar is used liturgically by the Coptic Orthodox Church and for agricultural purposes in Egypt. The Ethiopian calendar shares its structure but uses a different epoch.',
        'source': 'Reingold, E. M. & Dershowitz, N. Calendrical Calculations: The Ultimate Edition (2018), §1.4. "fixed-from-coptic(y, m, d) = coptic-epoch + 365·(y−1) + ⌊y/4⌋ + 30·(m−1) + d − 1."',
        'months': 'Thirteen months: Thout, Paopi, Hathor, Koiak, Tobi, Meshir, Paremhat, Parmouti, Pashons, Paoni, Epip, Mesori (each 30 days), Epagomenai (5 or 6 days).',
      },
      'ethiopian': {
        'name': 'Ethiopian Calendar',
        'type': 'Solar',
        'epoch': '1 Mäskäräm 1 = 29 August 8 CE (Julian)',
        'intro': 'The Ethiopian calendar (yeʼItyopʼya zen meqoṅenya) is the official calendar of Ethiopia. It belongs to the same Alexandrian family as the Coptic calendar, sharing its structure of 12 × 30-day months plus a 13th epagomenal month.',
        'body': 'The epoch is approximately 7–8 years behind the Gregorian calendar, reflecting a different calculation of the Annunciation of Jesus. Leap years follow the same rule as the Coptic calendar (year % 4 === 3). The Ethiopian New Year (Enkutatash) falls on 11 September in the Gregorian calendar (12 September in Gregorian leap years).',
        'usage': 'Ethiopia is one of the few countries to use a non-Gregorian calendar as its official civil calendar. The calendar is deeply embedded in Ethiopian culture, religion, and daily life.',
        'source': 'Reingold, E. M. & Dershowitz, N. Calendrical Calculations: The Ultimate Edition (2018), §1.5. Same formula as Coptic (1.30) with ethiopic-epoch replacing coptic-epoch.',
        'months': 'Thirteen months: Mäskäräm, Ṭəqəmt, Ḥədar, Taḫśaś, Ṭər, Yäkatit, Mägabit, Miyazya, Gənbot, Säne, Ḥamle, Nähase (each 30 days), Pagumän (5 or 6 days).',
      },
      'yazdgerdi': {
        'name': 'Zoroastrian Calendar',
        'type': 'Solar (wandering / fixed)',
        'epoch': '1 Farvardin 1 YZ = 16 June 632 CE (Julian)',
        'intro': 'The Yazdgerdi calendar is the traditional Zoroastrian calendar of Iran, named after Yazdegerd III, the last Sasanian emperor. Its epoch is his coronation in 632 CE.',
        'body': 'The calendar consists of 12 months of 30 days each, followed by 5 epagomenal days (the Gatha days). Three variants exist: Shahenshahi (royal, wandering, no leap years — the default), Qadimi (Parsi variant, 30 days ahead of Shahenshahi due to a missed intercalation in the 8th century), and Fasli (reformed with leap years to keep Nawruz near the vernal equinox).',
        'usage': 'Shahenshahi was the standard reckoning in Iran and among Zoroastrians. Qadimi is used by Parsi communities in India. Fasli was reformed in the modern era to stay seasonal.',
        'variantsDivergence': 'Shahenshahi and Qadimi are both 365-day wandering calendars with no leap years. Qadimi\'s epoch is exactly 30 days earlier, so the Qadimi date is always 30 days ahead of Shahenshahi for any given Julian date — this offset arose from a missed intercalation around 770 CE. Fasli adds leap years to keep Nawruz (1 Farvardin) near 21 March; by the 21st century Shahenshahi Nawruz drifts into late July, Qadimi Nawruz into late June.',
        'source': 'Reingold, E. M. & Dershowitz, N. Calendrical Calculations: The Ultimate Edition (2018). "fixed-from-zoroastrian(y, m, d) = zoroastrian-epoch + 365·(y−1) + 30·(m−1) + d − 1." No leap year correction.',
        'months': 'Thirteen months: Farvardin, Ordibehešt, Ḫordād, Tir, Mordād, Šahrivar, Mehr, Ābān, Āḏar, Dey, Bahman, Esfand (each 30 days), plus 5 (or 6 in Fasli leap years) epagomenal days.',
      },
      'armenian': {
        'name': 'Armenian Calendar',
        'type': 'Solar (wandering)',
        'epoch': '1 Navasard 1 = 11 July 552 CE (Julian)',
        'intro': 'The traditional Armenian calendar is a fixed 365-day calendar with the same structure as the Egyptian and Yazdgerdi calendars. Its epoch is 11 July 552 CE (Julian), traditionally associated with the separation of the Armenian Church.',
        'body': 'Like the Yazdgerdi calendar, it consists of 12 months of 30 days plus 5 epagomenal days (Aweleacʼ), with no leap year correction. It is therefore a "wandering" calendar that drifts through the seasons.',
        'usage': 'The Armenian calendar was used in Armenia and by Armenian communities for historical and religious purposes. It was largely superseded by the Gregorian calendar, but remains important for historical chronology.',
        'source': 'Reingold, E. M. & Dershowitz, N. Calendrical Calculations: The Ultimate Edition (2018). Same wandering-year formula as Egyptian: "epoch + 365·(y−1) + 30·(m−1) + d − 1."',
        'months': 'Thirteen months: Navasard, Hoṙi, Sahmi, Trē, K’aloċ, Arac’, Mehekan, Areg, Ahekan, Mareri, Margac’, Hrotic’ (each 30 days), Aweleac’ (5 days).',
      },
      'egyptian': {
        'name': 'Egyptian Calendar',
        'type': 'Solar (wandering)',
        'intro': 'The ancient Egyptian civil calendar, one of the oldest known. Counts from the Era of Nabonassar (747 BCE).',
        'body': '12 × 30 days + 5 epagomenal days, no leap year. Always 365 days — a wandering calendar, prototype for all later 365-day calendars.',
        'source': 'Reingold, E. M. & Dershowitz, N. Calendrical Calculations: The Ultimate Edition (2018), §1.9. "fixed-from-egyptian(y, m, d) = egyptian-epoch + 365·(y−1) + 30·(m−1) + d − 1."',
        'months': 'Thirteen months: Thoth, Phaophi, Athyr, Choiak, Tybi, Mechir, Phamenoth, Pharmuthi, Pachons, Payni, Epiphi, Mesore (30 days each), Epagomenai (5 days).',
      },
      'byzantine': {
        'name': 'Byzantine Calendar',
        'type': 'Solar',
        'intro': 'Anno Mundi calendars counting from the creation of the world. Three variants: Constantinople (5509 BCE, Sep start), Alexandrian (5493 BCE, Mar start), and Chronicon Paschale (5509 BCE, Mar start).',
        'body': 'Julian calendar mechanics with era offset. The Constantinople variant was the official calendar of the Byzantine Empire. The Alexandrian variant was used by the Church of Alexandria. The Chronicon Paschale uses the Constantinople epoch with March year start. Indiction (15-year cycle) is displayed alongside dates.',
        'variantsDivergence': 'Constantinople and Alexandrian differ by 15 or 16 AM years for the same Julian date, depending on the month (16-year epoch difference combined with different year starts). Chronicon Paschale agrees with Constantinople in AM year for January–February and September–December; for March–August it runs 1 AM year higher.',
        'source': 'Julian conversion (Meeus, ch. 7) with era shifts from Grumel, V. La Chronologie (1958). Constantinople (Sep start): Sep–Dec → Julian year = Y − 5509; Jan–Aug → Y − 5508. Alexandrian (Mar start, epoch 5493 BCE): Mar–Dec → Julian year = Y − 5493; Jan–Feb → Y − 5492. Chronicon Paschale (Mar start, epoch 5509 BCE): Mar–Dec → Julian year = Y − 5509; Jan–Feb → Y − 5508. All apply Julian→JD (Meeus, eq. 7.1, B = 0).',
        'months': 'Constantinople: twelve months from September. Alexandrian and Chronicon Paschale: twelve months from March.',
      },
      'alexandrian': {
        'name': 'Alexandrian Calendar',
        'type': 'Solar',
        'intro': 'The Alexandrian era (Anno Mundi) is a variant of the creation era used by the Church of Alexandria. It places the creation in 5493 BCE, with the year beginning on March 25 (the Annunciation).',
        'body': 'Like the Byzantine calendar, it uses Julian calendar mechanics with an era offset and a shifted year start. Month 1 is March, month 12 is February. It was used in early Christian chronography and influenced the Ethiopian calendar tradition.',
        'source': 'Julian conversion (Meeus, ch. 7) with era offset from Grumel, V. La Chronologie (1958). Mar–Dec: Julian year = Y − 5493, Julian month = M + 2. Jan–Feb: Julian year = Y − 5492, Julian month = M − 10. Then apply Julian→JD (eq. 7.1, B = 0).',
        'months': 'Twelve months from March: March, April, May, June, July, August, September, October, November, December, January, February.',
      },
      'seleucid': {
        'name': 'Seleucid Calendar',
        'type': 'Solar',
        'intro': 'The Seleucid era (Anno Graecorum) counts from 312 BCE. The most widely used era in the eastern Mediterranean for over a millennium. Two variants: Macedonian (October start) and Babylonian (April start).',
        'body': 'Julian calendar mechanics with a Seleucid era offset. Two historical reckonings exist, differing only in which month begins the year: Macedonian (October) used in Syria and the west, and Babylonian (April) used in Mesopotamia.',
        'variantsDivergence': 'For the same Julian date, Macedonian and Babylonian SE year numbers differ by 1 in January–March and October–December, and agree in April–September. Example: 1 October 312 BCE (Julian) = 1 Dios 1 SE Macedonian; 1 April 311 BCE (Julian) = 1 Nisannu 1 SE Babylonian — both mark the start of SE year 1 but are six months apart.',
        'source': 'Julian conversion (Meeus, ch. 7). Bickerman, Chronology of the Ancient World (1980): "The Seleucid era began on 1 October 312 BCE." Macedonian reckoning: Oct–Dec use Julian year = Y − 312; Jan–Sep use Y − 311. Babylonian reckoning: Apr–Dec use Julian year = Y − 311; Jan–Mar use Y − 310. Then apply Julian→JD (eq. 7.1, B = 0).',
        'months': 'Macedonian: twelve months from October. Babylonian: twelve months from April.',
      },
      'syriac': {
        'name': 'Syriac Calendar',
        'type': 'Solar',
        'intro': 'Uses the Seleucid era (year 1 = 312 BCE) with Syriac month names and January–December year.',
        'body': 'The Julian calendar with an era offset of 311 years. Month names derive from the Babylonian calendar via Aramaic.',
        'source': 'Julian conversion (Meeus, ch. 7) with era offset: Julian year = Y − 311, same Jan–Dec year structure. Month names from the Babylonian calendar via Aramaic (de Blois, Encyclopaedia of Islam).',
        'months': 'Twelve months: Kānūn II, Šbāṭ, Āḏār, Nīsān, Ayyār, Ḥzīrān, Tammūz, Āb, Aylūl, Tišrīn I, Tišrīn II, Kānūn I.',
      },
      'macedonian': {
        'name': 'Macedonian Calendar',
        'type': 'Solar',
        'intro': 'The Syro-Macedonian calendar with Macedonian month names, Seleucid era, and October year start.',
        'body': 'In its fixed Roman-era form, each month maps to a Julian month. Same structure as Seleucid with Macedonian names.',
        'source': 'Julian conversion (Meeus, ch. 7) with Seleucid era and October year start. Each Macedonian month maps to a Julian month (Dios = Oct, ..., Hyperberetaios = Sep). Mapping after Bickerman, Chronology of the Ancient World (1980), app. IV.',
        'months': 'Twelve months from October: Dios, Apellaios, Audynaios, Peritios, Dystros, Xanthikos, Artemisios, Daisios, Panemos, Loos, Gorpiaios, Hyperberetaios.',
      },
      'rumi': {
        'name': 'Rūmī Calendar',
        'type': 'Solar',
        'intro': 'The fiscal and civil calendar of the Ottoman Empire, Julian calendar with Hijra-era offset.',
        'body': 'Post-1840s reform: January–December, year = Julian year − 584. Abolished by Turkey in 1926.',
        'source': 'Julian conversion (Meeus, ch. 7). Post-1840 reform: Julian year = Rūmī year + 584, Jan–Dec structure. Ottoman fiscal reform decree of 13 March 1840.',
        'months': 'Twelve months with Julian names and lengths, January–December.',
      },
      'roman': {
        'name': 'Roman Calendar',
        'type': 'Solar',
        'intro': 'The Julian calendar with traditional Roman date notation: Kalends, Nones, and Ides.',
        'body': 'Uses AUC (Ab Urbe Condita) year numbering with Latin month names. Days are expressed by counting inclusively backward from three fixed points: Kalendae (1st), Nonae (5th/7th), and Idus (13th/15th). In March, May, July, and October the Nones fall on the 7th and the Ides on the 15th; in all other months, on the 5th and 13th respectively.',
        'source': 'Same Julian→JDN conversion as AUC (Meeus, ch. 7, Varronian epoch 753 BCE). Roman day-counting rules from Bickerman, Chronology of the Ancient World (1980), ch. IV.',
        'months': 'Twelve months with Latin names: Ianuarius, Februarius, Martius, Aprilis, Maius, Iunius, Iulius, Augustus, September, October, November, December.',
      },
      'spanish': {
        'name': 'Spanish Era',
        'type': 'Solar',
        'intro': 'The Era Hispanica counts from 38 BCE. Standard in the Iberian Peninsula for over a thousand years.',
        'body': 'Julian calendar with era offset of 38 years. Aragon abandoned it in 1350, Castile in 1383, Portugal in 1422.',
        'source': 'Julian conversion (Meeus, ch. 7). Julian year = Spanish year − 38. Era Hispanica epoch: 1 January 38 BCE, marking the Roman conquest of Iberia.',
        'months': 'Twelve months with Julian names and lengths, January–December.',
      },
      'antiochene': {
        'name': 'Antiochene Era',
        'type': 'Solar',
        'intro': 'The Caesarean Era of Antioch counts from 49 BCE (Battle of Pharsalus). Used in Antiochene chronicles.',
        'body': 'Julian calendar with October year start and era offset of 49 years. Replaced the Seleucid era in local Antiochene usage.',
        'source': 'Julian conversion (Meeus, ch. 7) with October year start. Oct–Dec: Julian year = Y − 49; Jan–Sep: Julian year = Y − 48. Caesarean epoch: autumn 49 BCE (Battle of Pharsalus).',
        'months': 'Twelve months from October: October, November, December, January, February, March, April, May, June, July, August, September.',
      },
      'olympiad': {
        'name': 'Olympiad Calendar',
        'type': 'Solar',
        'intro': 'Counts 4-year cycles from the first Olympic Games in 776 BCE, the framework of Greek historians.',
        'body': 'Linear year count from 776 BCE. Year 1 = 776 BCE, year 5 = Olympiad 2, year 1. Display shows “Olympiad N, year K”.',
        'source': 'Julian conversion (Meeus, ch. 7). Linear year count: Julian year = Y − 776. Olympiad number = ⌊(Y−1)/4⌋ + 1, year within olympiad = ((Y−1) mod 4) + 1. Epoch: 776 BCE, the traditional date of the first Olympic Games.',
        'months': 'Twelve months with Julian names and lengths, January–December.',
      },
      'hebrew': {
        'name': 'Hebrew Calendar',
        'type': 'Lunisolar',
        'intro': 'The Hebrew (Jewish) lunisolar calendar for religious observances and official use in Israel. Epoch: 3761 BCE.',
        'body': 'A 19-year Metonic cycle with 7 leap years adding Adar II. Year lengths vary 353–385 days due to postponement rules (dechiyot).',
        'source': 'Reingold, E. M. & Dershowitz, N. Calendrical Calculations: The Ultimate Edition (2018), ch. 8, eqs. 8.1–8.25. Molad (mean conjunction): months = (235Y − 234)/19, parts = 12084 + 13753·months. Four dechiyot postpone New Year to avoid forbidden weekdays.',
        'warning': 'Before ~359 CE (the traditional date of Hillel II\'s reform), the Hebrew calendar was observational: new months were declared by the Sanhedrin based on witness testimony, and intercalary months were added by rabbinic decision. The arithmetic molad algorithm is anachronistic for earlier dates. The Babylonian calendar (Parker & Dubberstein tables) may serve as an approximation for the Persian and Hellenistic periods.',
        'months': 'Twelve or thirteen months: Tishrei (30), Cheshvan (29/30), Kislev (29/30), Tevet (29), Shevat (30), Adar/Adar I (29/30), [Adar II (29)], Nisan (30), Iyar (29), Sivan (30), Tammuz (29), Av (30), Elul (29).',
      },
      'babylonian': {
        'name': 'Babylonian Calendar',
        'type': 'Lunisolar',
        'intro': 'The ancient Mesopotamian lunisolar calendar, ancestor of the Hebrew calendar. Era of Nabonassar (747 BCE).',
        'body': 'Uses the 19-year Metonic cycle for intercalation. Month lengths are determined arithmetically via the Hebrew calendar’s molad computation (an approximation — historical Babylonian months began at observed first lunar crescent). Year starts at Nisannu (spring equinox). 12 or 13 months per year.',
        'source': 'Parker, R. A. & Dubberstein, W. H. Babylonian Chronology 626 B.C.–A.D. 75. (1956). Arithmetic approximation via Hebrew calendar molad.',
        'months': 'Twelve or thirteen months: Nisannu, Ayaru, Simanu, Duʻuzu, Abu, Ulūlu, Tashrītu, Araḫsamna, Kislimu, Ṭebetu, Shabaṭu, Addaru, [Addaru II].',
      },
      'bp': {
        'name': 'Before Present',
        'type': 'Solar',
        'intro': 'Time scale for archaeology and geology. "Present" = 1950 CE (radiocarbon dating convention).',
        'body': 'Counts backward: BP 0 = 1950 CE, BP 1 = 1949 CE. Gregorian calendar mechanics.',
        'source': 'Simple offset: gregYear = 1950 − bpYear. Convention established by Libby, W. F. Radiocarbon Dating (1955). "Present" fixed at 1 January 1950 CE.',
        'months': 'Twelve months with Gregorian names and lengths.',
      },
      'human': {
        'name': 'Human Era',
        'type': 'Solar',
        'intro': 'The Holocene Era (HE) adds 10,000 years to the Gregorian calendar, epoch at the dawn of human civilization.',
        'body': 'Proposed by Cesare Emiliani (1993). Year 12,024 HE = 2024 CE. No negative years for recorded history.',
        'source': 'Simple offset: gregYear = heYear − 10000. Emiliani, C. "Calendar Reform," Nature 366 (1993), p. 716. "I propose to simply add 10,000 years to the current era."',
        'months': 'Twelve months with Gregorian names and lengths.',
      },
    },
    'pl': {
      'gregorian': {
        'name': 'Kalendarz n.e. (juliański→gregoriański)',
        'type': 'Słoneczny',
        'epoch': '1 stycznia 1 n.e.',
        'intro': 'System datowania Anno Domini (n.e.), używający kalendarza juliańskiego przed 15 października 1582 i gregoriańskiego po tej dacie. Odzwierciedla to rzeczywistą praktykę datowania w świecie zachodnim — nikt nie używał kalendarza gregoriańskiego, zanim powstał.',
        'body': 'Przed 1582 rokiem daty odpowiadają kalendarzowi juliańskiemu (rok przestępny co 4 lata, bez wyjątków). Od 15 października 1582 obowiązuje reforma gregoriańska: rok jest przestępny, jeśli jest podzielny przez 4, chyba że jest również podzielny przez 100 — z wyjątkiem lat podzielnych przez 400. Czyste kalendarze juliański i gregoriański są dostępne osobno do obliczeń proleptycznych.',
        'adoption': 'Kraje katolickie przyjęły reformę w 1582 roku, kraje protestanckie i prawosławne znacznie później: Imperium Brytyjskie w 1752, Rosja w 1918, Grecja w 1923, Turcja w 1926.',
        'source': 'Meeus, Jean. Astronomical Algorithms, 2nd ed. (1998), ch. 7. Juliański: eq. 7.1 z B = 0. Gregoriański: eq. 7.1 z korektą A = ⌊Y/100⌋, B = 2 − A + ⌊A/4⌋. Punkt przejścia: JD 2299160.5.',
        'months': 'Dwanaście miesięcy od 28 do 31 dni: styczeń (31), luty (28/29), marzec (31), kwiecień (30), maj (31), czerwiec (30), lipiec (31), sierpień (31), wrzesień (30), październik (31), listopad (30), grudzień (31).',
      },
      'julian': {
        'name': 'Kalendarz juliański',
        'type': 'Słoneczny',
        'epoch': '1 stycznia 1 n.e. (proleptyczny)',
        'intro': 'Kalendarz juliański został wprowadzony przez Juliusza Cezara w 46 r. p.n.e., obowiązując od 1 stycznia 45 r. p.n.e. Był dominującym kalendarzem w Europie i świecie śródziemnomorskim przez ponad 1600 lat.',
        'body': 'Ustanowił prostą regułę roku przestępnego: każdy rok podzielny przez 4 jest przestępny, co daje średni rok długości 365,25 dnia. Jest to o około 11 minut dłużej niż rok zwrotnikowy, co prowadzi do błędu około 1 dnia na 128 lat.',
        'adoption': 'Do XVI wieku kalendarz przesunął się o około 10 dni od równonocy astronomicznej. Kalendarz juliański jest nadal używany liturgicznie przez niektóre kościoły prawosławne („stary styl”).',
        'source': 'Meeus, Jean. Astronomical Algorithms, 2nd ed. (1998), ch. 7, eq. 7.1 with B = 0 (no century correction). The Julian calendar omits the Gregorian correction term, giving a fixed mean year of exactly 365.25 days.',
        'months': 'Dwanaście miesięcy identycznych z gregoriańskimi, różniących się jedynie regułą roku przestępnego (co 4 lata, bez wyjątków).',
      },
      'hijri': {
        'name': 'Kalendarz hidżry (islamski księżycowy)',
        'type': 'Księżycowy',
        'epoch': '1 muharram 1 AH = 16 lipca 622 n.e. (juliański)',
        'intro': 'Kalendarz hidżry (at-taqwīm al-hiǧrī) jest czysto księżycowym kalendarzem 12 miesięcy, używanym w całym świecie islamu do celów religijnych. Jego epoka to hidżra (emigracja) Proroka Muhammada z Mekki do Medyny.',
        'body': 'Każdy miesiąc zaczyna się zasadniczo od obserwacji nowego sierpa księżyca. Miesiące naprzemiennie mają 30 i 29 dni. Rok liczy około 354 dni (355 w latach przestępnych), będąc o ok. 11 dni krótszy od roku słonecznego. Kalendarz przechodzi przez pory roku w cyklu ok. 33 lat.',
        'tabular': 'Wersja tabelaryczna (arytmetyczna) kalendarza hidżry — używana w kalkal — stosuje stały cykl 30-letni, w którym 11 lat jest przestępnych (355 dni), a 19 zwykłych (354 dni). Istnieją cztery historyczne warianty, różniące się tym, które lata cyklu są przestępne:',
        'variantsDivergence': 'Warianty różnią się dokładnie o 1 dzień dla dat przypadających w latach cyklu 30-letniego, w których przypisanie lat przestępnych się różni. IIc vs IIa: 1 rok na cykl (~3,3% dat) — przykład: 1 muharram 1429 AH = 10 stycznia 2008 n.e. (IIc) vs 9 stycznia 2008 n.e. (IIa). IIIa vs IIc: 2 lata na cykl (~6,7%). IVa vs IIc: 4 lata na cykl (~13,3%).',
        'source': 'de Blois, François. “Taʿrīkh” in Encyclopaedia of Islam, 2nd ed. Variant classification from Richards, E. G. Mapping Time (1998), table 15.4. “In a cycle of 30 years, there are 19 common years of 354 days and 11 leap years of 355 days.”',
        'months': 'Dwanaście miesięcy: muharram (30), safar (29), rabīʿ al-awwal (30), rabīʿ aṯ-ṯānī (29), dżumādā al-ūlā (30), dżumādā al-āḫira (29), radżab (30), szaʿbān (29), ramadān (30), szawwāl (29), ḏū al-qaʿda (30), ḏū al-ḥidżdża (29 lub 30).',
      },
      'solarHijri': {
        'name': 'Kalendarz słoneczny hidżry (irański)',
        'type': 'Słoneczny',
        'epoch': '1 farwardin 1 AP = 22 marca 622 n.e. (juliański)',
        'intro': 'Kalendarz słoneczny hidżry jest oficjalnym kalendarzem Iranu i Afganistanu. Jest kalendarzem słonecznym, którego epoka pokrywa się z hidżrą, ale długość roku podąża za rokiem zwrotnikowym.',
        'body': 'Sześć pierwszych miesięcy ma 31 dni, pięć następnych — 30 dni, a dwunasty miesiąc (esfand) ma 29 dni w roku zwykłym i 30 w przestępnym. Oficjalnie nowy rok (Nouruz) zaczyna się w momencie astronomicznej równonocy wiosennej obserwowanej z Teheranu.',
        'arithmetic': 'Do celów obliczeniowych kalkal używa aproksymacji arytmetycznej opartej na 2820-letnim cyklu (zawierającym dokładnie 1 029 983 dni), który ściśle odpowiada kalendarzowi astronomicznemu.',
        'source': 'Birashk, Ahmad. A Comparative Calendar (1993). Borkowski, K. M. "ELP2000-85 and the Dynamical Time – Universal Time relation," Astronomy and Astrophysics, 205 (1988). "The 2820-year cycle contains exactly 683 leap years in 1,029,983 days."',
        'warning': 'Dla dat sprzed XX wieku to przybliżenie arytmetyczne (cykl 2820-letni) może różnić się o ±1 dzień od historycznego kalendarza Dżalali, który bazował na astronomicznej obserwacji równonocy wiosennej. Kalendarz Dżalali został ustanowiony przez Omara Chajjama w 1079 r. Nie zachowały się systematyczne tablice historycznych dat równonocy.',
        'months': 'Dwanaście miesięcy: farwardin (31), ordibeheszt (31), chordad (31), tir (31), mordad (31), szahriwar (31), mehr (30), aban (30), azar (30), dej (30), bahman (30), esfand (29/30).',
      },
      'ilkhani': {
        'name': 'Kalendarz ilchanidów (Khānī)',
        'type': 'Słoneczny',
        'intro': 'Kalendarz fiskalny chanatu Ilchanidów, ustanowiony przez Ghazan-chana.',
        'body': 'Identyczna struktura jak kalendarz słoneczny hidżry z inną epoką (1302 n.e.). 12-letni turko-mongolski cykl zwierzęcy.',
        'source': 'Encyclopaedia Iranica, "Calendars." Charles Melville, "The Chinese-Uighur Animal Calendar in Persian Historiography."',
        'warning': 'Kalendarz Ilchanidów (1302–ok. 1335 n.e.) bazował na obserwacji astronomicznej w obserwatorium w Maraghi, nie na cyklu arytmetycznym 2820-letnim użytym tutaj. Dla dat z okresu ilchanidzkiego przybliżenie arytmetyczne może różnić się o ±1 dzień. Nie zachowały się tablice obserwacyjne.',
        'months': 'Dwanaście miesięcy perskich.',
      },
      'coptic': {
        'name': 'Kalendarz koptyjski',
        'type': 'Słoneczny',
        'epoch': '1 tout 1 AM = 29 sierpnia 284 n.e. (juliański)',
        'intro': 'Kalendarz koptyjski (aleksandryjski) wywodzi się ze starożytnego egipskiego kalendarza cywilnego, zreformowanego za Augusta o rok przestępny. Liczy lata od Ery Męczenników (Anno Martyrum), począwszy od wstąpienia na tron cesarza Dioklecjana.',
        'body': 'Składa się z 12 miesięcy po 30 dni i krótkiego 13. miesiąca (epagomenai) — 5 dni w roku zwykłym lub 6 w przestępnym. Rok przestępny występuje co 4 lata (rok mod 4 = 3).',
        'usage': 'Kalendarz koptyjski jest używany liturgicznie przez Koptyjski Kościół Prawosławny i do celów rolniczych w Egipcie.',
        'source': 'Reingold, E. M. & Dershowitz, N. Calendrical Calculations: The Ultimate Edition (2018), §1.4. "fixed-from-coptic(y, m, d) = coptic-epoch + 365·(y−1) + ⌊y/4⌋ + 30·(m−1) + d − 1."',
        'months': 'Trzynaście miesięcy: Tout, Paopi, Hathor, Koiak, Tobi, Meszir, Paremhat, Parmouti, Paszons, Paoni, Epip, Mesori (po 30 dni), Epagomenai (5 lub 6 dni).',
      },
      'ethiopian': {
        'name': 'Kalendarz etiopski',
        'type': 'Słoneczny',
        'epoch': '1 mäskäräm 1 = 29 sierpnia 8 n.e. (juliański)',
        'intro': 'Kalendarz etiopski jest oficjalnym kalendarzem Etiopii. Należy do tej samej rodziny aleksandryjskiej co kalendarz koptyjski, dzieląc jego strukturę 12 miesięcy po 30 dni plus 13. miesiąc epagomenalny.',
        'body': 'Epoka jest o ok. 7–8 lat późniejsza niż kalendarz gregoriański. Lata przestępne podążają za tą samą regułą co w kalendarzu koptyjskim. Nowy Rok etiopski (Enkutatash) przypada 11 września gregoriańskiego.',
        'usage': 'Etiopia jest jednym z nielicznych krajów używających kalendarza niegregoriańskiego jako oficjalnego kalendarza cywilnego.',
        'source': 'Reingold, E. M. & Dershowitz, N. Calendrical Calculations: The Ultimate Edition (2018), §1.5. Same formula as Coptic (1.30) with ethiopic-epoch replacing coptic-epoch.',
        'months': 'Trzynaście miesięcy: Mäskäräm, Təqəmt, Hədar, Tahśaś, Tər, Jäkatit, Mägabit, Mijazja, Gənbot, Säne, Hamle, Nähase (po 30 dni), Pagumän (5 lub 6 dni).',
      },
      'yazdgerdi': {
        'name': 'Kalendarz zoroastryjski',
        'type': 'Słoneczny (wędrowny / stały)',
        'epoch': '1 farwardin 1 YZ = 16 czerwca 632 n.e. (juliański)',
        'intro': 'Kalendarz Jezdegerda jest tradycyjnym zoroastryjskim kalendarzem Iranu, nazwanym od Jezdegerda III, ostatniego króla sasanidzkiego.',
        'body': 'Składa się z 12 miesięcy po 30 dni i 5 dni epagomenalnych. Trzy warianty: Szahensza (królewski, wędrowny, bez lat przestępnych — domyślny), Qadimi (wariant Parsów, 30 dni wcześniej z powodu pominiętej interkałacji w VIII w.) i Fasli (zreformowany z latami przestępnymi, Nawruz przy równonocy wiosennej).',
        'usage': 'Szahensza był standardem w Iranie i wśród zoroastrian. Qadimi używany przez społeczności parsyjskie w Indiach. Fasli zreformowany w epoce nowożytnej.',
        'variantsDivergence': 'Szahensza i Qadimi to oba kalendarze wędrówcze bez lat przestępnych (zawsze 365 dni). Epoka Qadimi jest dokładnie 30 dni wcześniejsza, więc data Qadimi jest zawsze 30 dni przed datą Szahensza dla tej samej daty juliańskiej. Różnica ta pochodzi z pominiętej interkałacji ok. 770 n.e. Fasli dodaje lata przestępne, by Nawruz (1 farwardin) przypadał blisko 21 marca; w XXI w. Nawruz Szahensza wypada w późnym lipcu, Nawruz Qadimi — w późnym czerwcu.',
        'source': 'Reingold, E. M. & Dershowitz, N. Calendrical Calculations: The Ultimate Edition (2018). "fixed-from-zoroastrian(y, m, d) = zoroastrian-epoch + 365·(y−1) + 30·(m−1) + d − 1." No leap year correction.',
        'months': 'Trzynaście miesięcy: Farwardin, Ordibeheszt, Chordad, Tir, Mordad, Szahriwar, Mehr, Aban, Azar, Dej, Bahman, Esfand (po 30 dni), plus 5 (lub 6 w Fasli) dni epagomenalnych.',
      },
      'armenian': {
        'name': 'Kalendarz ormiański',
        'type': 'Słoneczny (wędrowny)',
        'epoch': '1 navasard 1 = 11 lipca 552 n.e. (juliański)',
        'intro': 'Tradycyjny kalendarz ormiański jest stałym kalendarzem 365-dniowym o tej samej strukturze co kalendarze egipski i Jezdegerda.',
        'body': 'Podobnie jak kalendarz Jezdegerda, składa się z 12 miesięcy po 30 dni plus 5 dni epagomenalnych (Aweleacʼ), bez korekcji roku przestępnego. Jest więc kalendarzem „wędrownym”, przesuwającym się przez pory roku.',
        'usage': 'Kalendarz ormiański był używany w Armenii i przez społeczności ormiańskie. Został w dużej mierze zastąpiony kalendarzem gregoriańskim, ale pozostaje ważny dla chronologii historycznej.',
        'source': 'Reingold, E. M. & Dershowitz, N. Calendrical Calculations: The Ultimate Edition (2018). Same wandering-year formula as Egyptian: "epoch + 365·(y−1) + 30·(m−1) + d − 1."',
        'months': 'Trzynaście miesięcy: Navasard, Hori, Sahmi, Tre, K’alocʼ, Aracʼ, Mehekan, Areg, Ahekan, Mareri, Margacʼ, Hroticʼ (po 30 dni), Aweleacʼ (5 dni).',
      },
      'egyptian': {
        'name': 'Kalendarz egipski',
        'type': 'Słoneczny (wędrowny)',
        'intro': 'Starożytny egipski kalendarz cywilny, jeden z najstarszych znanych. Era Nabonassara (747 p.n.e.).',
        'body': '12 × 30 dni + 5 dodatkowych, bez roku przestępnego. Zawsze 365 dni — kalendarz wędrowny.',
        'source': 'Reingold, E. M. & Dershowitz, N. Calendrical Calculations: The Ultimate Edition (2018), §1.9. "fixed-from-egyptian(y, m, d) = egyptian-epoch + 365·(y−1) + 30·(m−1) + d − 1."',
        'months': 'Trzynaście miesięcy: Thoth, Phaophi, Athyr, Choiak, Tybi, Mechir, Phamenoth, Pharmuthi, Pachons, Payni, Epiphi, Mesore (po 30 dni), Epagomenai (5 dni).',
      },
      'byzantine': {
        'name': 'Kalendarz bizantyński',
        'type': 'Słoneczny',
        'intro': 'Kalendarze Anno Mundi liczące od stworzenia świata. Trzy warianty: Konstantynopolitanski (5509 p.n.e., od września), Aleksandryjski (5493 p.n.e., od marca) i Chronicon Paschale (5509 p.n.e., od marca).',
        'body': 'Mechanika juliańska z przesunięciem ery. Wariant konstantynopolitański był oficjalnym kalendarzem Cesarstwa Bizantyńskiego. Aleksandryjski używany przez Kościół Aleksandrii. Indykcja (cykl 15-letni) wyświetlana przy datach.',
        'source': 'Julian conversion (Meeus, ch. 7) with era shifts from Grumel, V. La Chronologie (1958). Constantinople (Sep start): Sep–Dec → Julian year = Y − 5509; Jan–Aug → Y − 5508. Alexandrian (Mar start, epoch 5493 BCE): Mar–Dec → Julian year = Y − 5493; Jan–Feb → Y − 5492. Chronicon Paschale (Mar start, epoch 5509 BCE): Mar–Dec → Julian year = Y − 5509; Jan–Feb → Y − 5508. All apply Julian→JD (Meeus, eq. 7.1, B = 0).',
        'variantsDivergence': 'Wariant konstantynopolitański i aleksandryjski różnią się o 15 lub 16 lat AM dla tej samej daty juliańskiej, w zależności od miesiąca (różnica epok o 16 lat i różne początki roku). Chronicon Paschale zgadza się z konstantynopolitańskim co do numeru roku AM w styczniu–lutym i wrześniu–grudniu; w marcu–sierpniu jest o 1 rok AM wyżej.',
        'months': 'Konstantynopolitański: od września. Aleksandryjski i Chronicon Paschale: od marca.',
      },
      'alexandrian': {
        'name': 'Kalendarz aleksandryjski',
        'type': 'Słoneczny',
        'intro': 'Aleksandryjska era Anno Mundi — wariant ery stworzenia używany przez Kościół Aleksandrii. Stworzenie świata w 5493 r. p.n.e., rok zaczyna się 25 marca (Zwiastowanie).',
        'body': 'Mechanika juliańska z przesunięciem ery i początkiem roku w marcu. Miesiąc 1 = marzec, miesiąc 12 = luty. Wpłynął na tradycję kalendarza etiopskiego.',
        'source': 'Julian conversion (Meeus, ch. 7) with era offset from Grumel, V. La Chronologie (1958). Mar–Dec: Julian year = Y − 5493, Julian month = M + 2. Jan–Feb: Julian year = Y − 5492, Julian month = M − 10. Then apply Julian→JD (eq. 7.1, B = 0).',
        'months': 'Dwanaście miesięcy od marca.',
      },
      'seleucid': {
        'name': 'Kalendarz Seleucydów',
        'type': 'Słoneczny',
        'intro': 'Era Seleucydów (Anno Graecorum) od 312 r. p.n.e. Najszerzej używana era we wschodnim śródziemnomorzu.',
        'body': 'Mechanika juliańska z przesunięciem ery seleucydzkiej. Dwa historyczne rachunki różniące się początkiem roku: Macedoński (październik) używany w Syrii i na zachodzie, Babiloński (kwiecień) używany w Mezopotamii.',
        'variantsDivergence': 'Dla tej samej daty juliańskiej numery roku SE w rachunku macedońskim i babilońskim różnią się o 1 w miesiącach styczeń–marzec i październik–grudzień, a zgadzają się w kwietniu–wrześniu. Przykład: 1 października 312 p.n.e. = 1 Dios 1 SE (macedoński); 1 kwietnia 311 p.n.e. = 1 Nisan 1 SE (babiloński).',
        'source': 'Julian conversion (Meeus, ch. 7). Bickerman, Chronology of the Ancient World (1980): "The Seleucid era began on 1 October 312 BCE." Macedonian reckoning: Oct–Dec use Julian year = Y − 312; Jan–Sep use Y − 311. Babylonian reckoning: Apr–Dec use Julian year = Y − 311; Jan–Mar use Y − 310. Then apply Julian→JD (eq. 7.1, B = 0).',
        'months': 'Macedoński: dwanaście miesięcy od października. Babiloński: dwanaście miesięcy od kwietnia.',
      },
      'syriac': {
        'name': 'Kalendarz syryjski',
        'type': 'Słoneczny',
        'intro': 'Era Seleucydów z syryjskimi nazwami miesięcy i rokiem styczeń–grudzień.',
        'body': 'Kalendarz juliański z przesunięciem ery o 311 lat. Nazwy miesięcy z kalendarza babilońskiego.',
        'source': 'Julian conversion (Meeus, ch. 7) with era offset: Julian year = Y − 311, same Jan–Dec year structure. Month names from the Babylonian calendar via Aramaic (de Blois, Encyclopaedia of Islam).',
        'months': 'Dwanaście miesięcy: Kānūn II, Šbāṭ, Āḏār, Nīsān, Ayyār, Ḥzīrān, Tammūz, Āb, Aylūl, Tišrīn I, Tišrīn II, Kānūn I.',
      },
      'macedonian': {
        'name': 'Kalendarz macedoński',
        'type': 'Słoneczny',
        'intro': 'Kalendarz syro-macedoński z macedońskimi nazwami miesięcy, era Seleucydów, początek w październiku.',
        'body': 'W formie ustalonej z epoki rzymskiej każdy miesiąc odpowiada miesiącowi juliańskiemu.',
        'source': 'Julian conversion (Meeus, ch. 7) with Seleucid era and October year start. Each Macedonian month maps to a Julian month (Dios = Oct, ..., Hyperberetaios = Sep). Mapping after Bickerman, Chronology of the Ancient World (1980), app. IV.',
        'months': 'Dwanaście miesięcy od października: Dios, Apellaios, Audynaios, Peritios, Dystros, Xanthikos, Artemisios, Daisios, Panemos, Loos, Gorpiaios, Hyperberetaios.',
      },
      'rumi': {
        'name': 'Kalendarz rūmī',
        'type': 'Słoneczny',
        'intro': 'Kalendarz fiskalny i cywilny Imperium Osmańskiego, oparty na juliańskim z przesunięciem ery hidżry.',
        'body': 'Po reformie lat 1840.: styczeń–grudzień, rok = rok juliański − 584. Zniesiony przez Turcję w 1926.',
        'source': 'Julian conversion (Meeus, ch. 7). Post-1840 reform: Julian year = Rūmī year + 584, Jan–Dec structure. Ottoman fiscal reform decree of 13 March 1840.',
        'months': 'Dwanaście miesięcy juliańskich, styczeń–grudzień.',
      },
      'roman': {
        'name': 'Kalendarz rzymski',
        'type': 'Słoneczny',
        'intro': 'Kalendarz juliański z tradycyjną rzymską notacją dat: Kalendy, Nony i Idy.',
        'body': 'Używa numeracji lat AUC z łacińskimi nazwami miesięcy. Dni wyrażane przez odliczanie wstecz od trzech stałych punktów: Kalendae (1.), Nonae (5./7.) i Idus (13./15.).',
        'source': 'Same Julian→JDN conversion as AUC (Meeus, ch. 7, Varronian epoch 753 BCE). Roman day-counting rules from Bickerman, Chronology of the Ancient World (1980), ch. IV.',
        'months': 'Dwanaście miesięcy z łacińskimi nazwami: Ianuarius, Februarius, Martius, Aprilis, Maius, Iunius, Iulius, Augustus, September, October, November, December.',
      },
      'spanish': {
        'name': 'Era hiszpańska',
        'type': 'Słoneczny',
        'intro': 'Era Hispanica od 38 r. p.n.e. Standard na Półwyspie Iberyjskim przez ponad tysiąc lat.',
        'body': 'Kalendarz juliański z przesunięciem ery o 38 lat. Aragonia porzuciła ją w 1350, Kastylia w 1383, Portugalia w 1422.',
        'source': 'Julian conversion (Meeus, ch. 7). Julian year = Spanish year − 38. Era Hispanica epoch: 1 January 38 BCE, marking the Roman conquest of Iberia.',
        'months': 'Dwanaście miesięcy juliańskich, styczeń–grudzień.',
      },
      'antiochene': {
        'name': 'Era antiocheńska',
        'type': 'Słoneczny',
        'intro': 'Era cezariańska Antiochii od 49 r. p.n.e. (bitwa pod Farsalos).',
        'body': 'Kalendarz juliański z początkiem roku w październiku i przesunięciem ery o 49 lat. Zastąpiła erę seleucydzką w lokalnym użyciu antiocheńskim.',
        'source': 'Julian conversion (Meeus, ch. 7) with October year start. Oct–Dec: Julian year = Y − 49; Jan–Sep: Julian year = Y − 48. Caesarean epoch: autumn 49 BCE (Battle of Pharsalus).',
        'months': 'Dwanaście miesięcy od października.',
      },
      'olympiad': {
        'name': 'Kalendarz olimpijski',
        'type': 'Słoneczny',
        'intro': 'Czteroletnie cykle od pierwszych igrzysk olimpijskich w 776 r. p.n.e.',
        'body': 'Liniowa numeracja lat od 776 p.n.e. Wyświetlany jako „Olimpiada N, rok K”.',
        'source': 'Julian conversion (Meeus, ch. 7). Linear year count: Julian year = Y − 776. Olympiad number = ⌊(Y−1)/4⌋ + 1, year within olympiad = ((Y−1) mod 4) + 1. Epoch: 776 BCE, the traditional date of the first Olympic Games.',
        'months': 'Dwanaście miesięcy juliańskich, styczeń–grudzień.',
      },
      'hebrew': {
        'name': 'Kalendarz hebrajski',
        'type': 'Księżycowo-słoneczny',
        'intro': 'Kalendarz żydowski (lunisolarny) do celów religijnych i użytku urzędowego w Izraelu. Epoka: 3761 p.n.e.',
        'body': 'Cykl 19-letni (metoniki) z 7 latami przestępnymi dodającymi Adar II. Długość roku 353–385 dni.',
        'source': 'Reingold, E. M. & Dershowitz, N. Calendrical Calculations: The Ultimate Edition (2018), ch. 8, eqs. 8.1–8.25. Molad (mean conjunction): months = (235Y − 234)/19, parts = 12084 + 13753·months. Four dechiyot postpone New Year to avoid forbidden weekdays.',
        'warning': 'Przed ok. 359 n.e. (tradycyjna data reformy Hillela II) kalendarz hebrajski był obserwacyjny: nowe miesiące ogłaszał Sanhedryn na podstawie zeznań świadków, a miesiące interkalarne dodawano decyzją rabinacką. Algorytm molad jest anachronizmem dla wcześniejszych dat. Kalendarz babiloński (tablice Parkera i Dubbersteina) może służyć jako przybliżenie dla okresów perskiego i hellenistycznego.',
        'months': 'Dwanaście lub trzynaście miesięcy: Tiszri (30), Cheszwan (29/30), Kislew (29/30), Tewet (29), Szwat (30), Adar/Adar I (29/30), [Adar II (29)], Nisan (30), Ijar (29), Siwan (30), Tamuz (29), Aw (30), Elul (29).',
      },
      'babylonian': {
        'name': 'Kalendarz babiloński',
        'type': 'Księżycowo-słoneczny',
        'intro': 'Starożytny kalendarz Mezopotamii, przodek kalendarza hebrajskiego. Era Nabonassara (747 p.n.e.).',
        'body': 'Cykl 19-letni (metoniki) z 13. miesiącem Addaru II. Aproksymacja arytmetyczna oparta na hebrajskim moladzie.',
        'source': 'Parker, R. A. & Dubberstein, W. H. Babylonian Chronology 626 B.C.–A.D. 75. (1956). Arithmetic approximation via Hebrew calendar molad.',
        'months': '12 lub 13 miesięcy akadyjskich.',
      },
      'bp': {
        'name': 'Przed teraźniejszością',
        'type': 'Słoneczny',
        'intro': 'Skala czasu w archeologii i geologii. „Teraźniejszość” = 1950 n.e.',
        'body': 'Liczy wstecz: BP 0 = 1950 n.e., BP 1 = 1949 n.e. Mechanika gregoriańska.',
        'source': 'Simple offset: gregYear = 1950 − bpYear. Convention established by Libby, W. F. Radiocarbon Dating (1955). "Present" fixed at 1 January 1950 CE.',
        'months': 'Dwanaście miesięcy gregoriańskich.',
      },
      'human': {
        'name': 'Era ludzka',
        'type': 'Słoneczny',
        'intro': 'Era holoceńska (HE) dodaje 10 000 lat do kalendarza gregoriańskiego.',
        'body': 'Zaproponowana przez Cesare Emilianiego (1993). Rok 12 024 HE = 2024 n.e. Bez lat ujemnych.',
        'source': 'Simple offset: gregYear = heYear − 10000. Emiliani, C. "Calendar Reform," Nature 366 (1993), p. 716. "I propose to simply add 10,000 years to the current era."',
        'months': 'Dwanaście miesięcy gregoriańskich.',
      },
    },
    'eo': {
      'gregorian': {
        'name': 'p.K. kalendaro (julia→gregoria)',
        'type': 'Suna',
        'epoch': '1-a de januaro 1 p.K.',
        'intro': 'La p.K. (post Kristo) datsistemo, uzanta la julian kalendaron antaŭ la 15-a de oktobro 1582 kaj la gregorian poste. Neniu uzis la gregorian kalendaron antaŭ ĝia kreado.',
        'body': 'Antaŭ 1582: julia kalendaro (superjaro ĉiu 4 jaroj). Ekde 15-a de oktobro 1582: gregoria reformo (superjaro se dividebla per 4, krom per 100, escepte per 400). La puraj julia kaj gregoria kalendaroj haveblas aparte por proleptikaj kalkuloj.',
        'adoption': 'Katolikaj landoj en 1582; Brita Imperio 1752; Rusio 1918; Grekio 1923; Turkio 1926.',
        'source': 'Meeus, Jean. Astronomical Algorithms, 2nd ed. (1998), ch. 7. Julia: eq. 7.1 kun B = 0. Gregoria: eq. 7.1 kun A = ⌊Y/100⌋, B = 2 − A + ⌊A/4⌋. Transiro je JD 2299160.5.',
        'months': '12 monatoj de 28–31 tagoj.',
      },
      'julian': {
        'name': 'Julia kalendaro',
        'type': 'Suna',
        'epoch': '1-a de januaro 1 p.K. (proleptika)',
        'intro': 'Enkondukita de Julio Cezaro en 46 a.K. Domina en Europo dum pli ol 1600 jaroj.',
        'body': 'Ĉiu jaro dividebla per 4 estas superjaro. Mezjaro 365,25 tagoj.',
        'adoption': 'Ankorau liturgie uzata de kelkaj ortodoksaj eklezioj.',
        'source': 'Meeus, Jean. Astronomical Algorithms, 2nd ed. (1998), ch. 7, eq. 7.1 with B = 0 (no century correction). The Julian calendar omits the Gregorian correction term, giving a fixed mean year of exactly 365.25 days.',
        'months': '12 monatoj kiel la gregoriaj.',
      },
      'hijri': {
        'name': 'Hiĝra kalendaro (luna)',
        'type': 'Luna',
        'epoch': '1-a de muḥarram 1 = 16-a de julio 622 p.K.',
        'intro': 'Pure luna kalendaro de 12 monatoj por religiaj okazoj. Epoko: Hiĝro de Profeto Muḥammad.',
        'body': 'Monatoj alternas 30/29 tagojn. Jaro ĉirkau 354 tagoj.',
        'tabular': 'Tabela versio uzas 30-jaran ciklon kun 11 superjaroj.',
        'variantsDivergence': 'Variantoj diferencas je precize 1 tago por datoj en la superjaroj de la 30-jara ciklo kie asignoj divergas. IIc vs IIa: 1 jaro per ciklo (~3,3% de datoj) — ekz. 1-a muḥarram 1429 AH = 10 januaro 2008 p.K. (IIc) vs 9 januaro 2008 p.K. (IIa). IIIa vs IIc: 2 jaroj (~6,7%). IVa vs IIc: 4 jaroj (~13,3%).',
        'source': 'de Blois, François. “Taʿrīkh” in Encyclopaedia of Islam, 2nd ed. Variant classification from Richards, E. G. Mapping Time (1998), table 15.4. “In a cycle of 30 years, there are 19 common years of 354 days and 11 leap years of 355 days.”',
        'months': '12 monatoj: muḥarram (30), ṣafar (29)...',
      },
      'solarHijri': {
        'name': 'Suna hiĝra (irana)',
        'type': 'Suna',
        'epoch': '1-a de farvardin 1 AP',
        'intro': 'Oficiala kalendaro de Irano kaj Afganio.',
        'body': 'Monatoj 1–6: 31 tagoj; 7–11: 30; 12: 29/30.',
        'arithmetic': '2820-jara ciklo kun 1.029.983 tagoj.',
        'source': 'Birashk, Ahmad. A Comparative Calendar (1993). Borkowski, K. M. "ELP2000-85 and the Dynamical Time – Universal Time relation," Astronomy and Astrophysics, 205 (1988). "The 2820-year cycle contains exactly 683 leap years in 1,029,983 days."',
        'warning': 'Por datoj antaŭ la 20-a jarcento, ĉi tiu aritmetika aproksimo (2820-jara ciklo) povas diferenci je ±1 tago de la historia Ĝalalia kalendaro, kiu baziĝis sur astronomiaj observoj de la printempa ekvinokso. Omar Kajjam establis la Ĝalalian kalendaron en 1079. Neniuj sistemaj tabeloj de historiaj ekvinoksaj datoj pluvivas.',
        'months': '12 monatoj.',
      },
      'ilkhani': {
        'name': 'Ilĥanida kalendaro (Khānī)',
        'type': 'Suna',
        'intro': 'Fiska kalendaro de la Mongola Ilĥanato, establita de Gazan-ĥano.',
        'body': 'Identa strukturo al suna hiĝra kun alia epoko (1302 p.K.). 12-jara turk-mongola bestociklo.',
        'source': 'Encyclopaedia Iranica, "Calendars." Charles Melville, "The Chinese-Uighur Animal Calendar in Persian Historiography."',
        'warning': 'La Ilĥanida kalendaro (1302–~1335) baziĝis sur astronomiaj observoj ĉe la observatorio de Maragho, ne sur la aritmetika ciklo uzita ĉi tie. La aproksimo povas diferenci je ±1 tago. Neniuj observtabeloj pluvivas.',
        'months': '12 persaj monatoj.',
      },
      'coptic': {
        'name': 'Kopta kalendaro',
        'type': 'Suna',
        'epoch': '1-a de Thout 1 AM = 29 augusto 284',
        'intro': 'De la antikva egipta kalendaro. 12×30 + 13-a monato.',
        'body': 'Superjaro ĉiu 4 jaroj (mod 4 = 3).',
        'usage': 'Kopta Ortodoksa Eklezio kaj agrikulturo en Egiptio.',
        'source': 'Reingold, E. M. & Dershowitz, N. Calendrical Calculations: The Ultimate Edition (2018), §1.4. "fixed-from-coptic(y, m, d) = coptic-epoch + 365·(y−1) + ⌊y/4⌋ + 30·(m−1) + d − 1."',
        'months': '13 monatoj.',
      },
      'ethiopian': {
        'name': 'Etiopa kalendaro',
        'type': 'Suna',
        'epoch': '1-a de Mäskäräm 1 = 29 augusto 8',
        'intro': 'Oficiala kalendaro de Etiopio, aleksandria familio.',
        'body': 'Ĉirkau 7–8 jarojn malantau gregoria. Novjaro 11 septembro.',
        'usage': 'Unu el malmultaj landoj kun ne-gregoria oficiala kalendaro.',
        'source': 'Reingold, E. M. & Dershowitz, N. Calendrical Calculations: The Ultimate Edition (2018), §1.5. Same formula as Coptic (1.30) with ethiopic-epoch replacing coptic-epoch.',
        'months': '13 monatoj kiel kopta.',
      },
      'yazdgerdi': {
        'name': 'Zoroastra kalendaro',
        'type': 'Suna (vaganta / fiksa)',
        'epoch': '1-a de farvardin 1 YZ = 16 junio 632',
        'intro': 'Zoroastra kalendaro de Irano.',
        'body': 'Tri variantoj: Ŝahenŝaha (vaganta, sen superjaroj), Kadima (30 tagojn pli frue, parsa), Fasli (kun superjaroj, sezonfiks).',
        'usage': 'Ŝahenŝaha: historia normo. Kadima: parsoj en Hindio. Fasli: moderna reformo.',
        'variantsDivergence': 'Ŝahenŝaha kaj Kadima estas ambaŭ 365-tagaj vagantaj kalendaroj sen superjaroj. La epoko de Kadima estas ekzakte 30 tagojn pli frua, do la Kadima-dato ĉiam estas 30 tagojn antaŭ la Ŝahenŝaha-dato por iu ajn julia dato. Ĉi tiu diferenco originis el preterlasita interkalo ĉirkau 770 p.K. Fasli aldonas superjarojn por teni Nawruz (1-an de Farvardin) proksime de 21 marto; en la 21-a jarcento la Ŝahenŝaha-Nawruz drsivas en malfrua julio, la Kadima-Nawruz — en malfrua junio.',
        'source': 'Reingold, E. M. & Dershowitz, N. Calendrical Calculations: The Ultimate Edition (2018). "fixed-from-zoroastrian(y, m, d) = zoroastrian-epoch + 365·(y−1) + 30·(m−1) + d − 1." No leap year correction.',
        'months': '13 monatoj.',
      },
      'armenian': {
        'name': 'Armena kalendaro',
        'type': 'Suna (vaganta)',
        'epoch': '1-a de Navasard 1 = 11 julio 552',
        'intro': 'Tradicia armena 365-taga kalendaro.',
        'body': '12×30 + 5 tagoj, sen superjaroj.',
        'usage': 'Grandparte anstataŭigita de gregoria.',
        'source': 'Reingold, E. M. & Dershowitz, N. Calendrical Calculations: The Ultimate Edition (2018). Same wandering-year formula as Egyptian: "epoch + 365·(y−1) + 30·(m−1) + d − 1."',
        'months': '13 monatoj.',
      },
      'egyptian': {
        'name': 'Egipta kalendaro',
        'type': 'Suna (vaganta)',
        'intro': 'Antikva egipta civila kalendaro. Epoko de Nabonasaro (747 a.K.).',
        'body': '12×30 + 5 tagoj, sen superjaroj. Ĉiam 365 tagoj.',
        'source': 'Reingold, E. M. & Dershowitz, N. Calendrical Calculations: The Ultimate Edition (2018), §1.9. "fixed-from-egyptian(y, m, d) = egyptian-epoch + 365·(y−1) + 30·(m−1) + d − 1."',
        'months': '13 monatoj.',
      },
      'byzantine': {
        'name': 'Bizanca kalendaro',
        'type': 'Suna',
        'intro': 'Anno Mundi kalendaroj. Tri variantoj: Konstantinopola (5509 a.K., septembre), Aleksandria (5493 a.K., marte), Chronicon Paschale (5509 a.K., marte).',
        'body': 'Julia mekaniko kun epok-ŝovo. Indiktio (15-jara ciklo) montrata kun datoj.',
        'source': 'Julian conversion (Meeus, ch. 7) with era shifts from Grumel, V. La Chronologie (1958). Constantinople (Sep start): Sep–Dec → Julian year = Y − 5509; Jan–Aug → Y − 5508. Alexandrian (Mar start, epoch 5493 BCE): Mar–Dec → Julian year = Y − 5493; Jan–Feb → Y − 5492. Chronicon Paschale (Mar start, epoch 5509 BCE): Mar–Dec → Julian year = Y − 5509; Jan–Feb → Y − 5508. All apply Julian→JD (Meeus, eq. 7.1, B = 0).',
        'variantsDivergence': 'Konstantinopola kaj Aleksandra diferencas je 15 aŭ 16 AM-jaroj por la sama julia dato, laŭ la monato (16-jara epoka diferenco kaj malsamaj jarenkondukoj). La Chronicon Paschale konsentas kun Konstantinopola en AM-jarnumero en januaro–februaro kaj septembro–decembro; en marto–aŭgusto ĝi estas 1 AM-jaron pli alta.',
        'months': 'Konstantinopola: de septembro. Aleksandria kaj Chronicon Paschale: de marto.',
      },
      'alexandrian': {
        'name': 'Aleksandria kalendaro',
        'type': 'Suna',
        'intro': 'Aleksandria Anno Mundi epoko — uzata de la Eklezio de Aleksandrio. Kreado en 5493 a.K., jaro komenciĝas 25 marto (Anunciacio).',
        'body': 'Julia mekaniko kun epok-ŝovo kaj marta jarenkonduko. Monato 1 = marto, monato 12 = februaro. Influis la etiopan kalendartradicjon.',
        'source': 'Julian conversion (Meeus, ch. 7) with era offset from Grumel, V. La Chronologie (1958). Mar–Dec: Julian year = Y − 5493, Julian month = M + 2. Jan–Feb: Julian year = Y − 5492, Julian month = M − 10. Then apply Julian→JD (eq. 7.1, B = 0).',
        'months': '12 monatoj de marto.',
      },
      'seleucid': {
        'name': 'Seleuĉida kalendaro',
        'type': 'Suna',
        'intro': 'Epoko de la Grekoj de 312 a.K.',
        'body': 'Julia mekaniko kun seleuĉida epok-ŝovo. Du historiaj rakontoformoj diferencantaj nur per la jarenkonduko: Makedona (oktobro) uzata en Sirio kaj okcidente, Babiona (aprilo) uzata en Mesopotamio.',
        'variantsDivergence': 'Por la sama julia dato, la ES-jarnumeroj de la makedona kaj babiona rakontoformoj diferencas je 1 en januaro–marto kaj oktobro–decembro, kaj konsentas en aprilo–septembro. Ekz.: 1 oktobro 312 a.K. = 1 Dios 1 ES (makedona); 1 aprilo 311 a.K. = 1 Nisanu 1 ES (babiona).',
        'source': 'Julian conversion (Meeus, ch. 7). Bickerman, Chronology of the Ancient World (1980): "The Seleucid era began on 1 October 312 BCE." Macedonian reckoning: Oct–Dec use Julian year = Y − 312; Jan–Sep use Y − 311. Babylonian reckoning: Apr–Dec use Julian year = Y − 311; Jan–Mar use Y − 310. Then apply Julian→JD (eq. 7.1, B = 0).',
        'months': 'Makedona: 12 monatoj de oktobro. Babiona: 12 monatoj de aprilo.',
      },
      'syriac': {
        'name': 'Siria kalendaro',
        'type': 'Suna',
        'intro': 'Seleuĉida epoko kun siriaj monatnomoj, januaro–decembro.',
        'body': 'Julia kun epok-ŝovo de 311 jaroj.',
        'source': 'Julian conversion (Meeus, ch. 7) with era offset: Julian year = Y − 311, same Jan–Dec year structure. Month names from the Babylonian calendar via Aramaic (de Blois, Encyclopaedia of Islam).',
        'months': '12 monatoj kun siriaj nomoj.',
      },
      'macedonian': {
        'name': 'Makedona kalendaro',
        'type': 'Suna',
        'intro': 'Sirio-makedona kalendaro kun makedonaj monatnomoj.',
        'body': 'Sama strukturo kiel seleuĉida kun makedonaj nomoj.',
        'source': 'Julian conversion (Meeus, ch. 7) with Seleucid era and October year start. Each Macedonian month maps to a Julian month (Dios = Oct, ..., Hyperberetaios = Sep). Mapping after Bickerman, Chronology of the Ancient World (1980), app. IV.',
        'months': '12 monatoj de oktobro kun makedonaj nomoj.',
      },
      'rumi': {
        'name': 'Rūmī-kalendaro',
        'type': 'Suna',
        'intro': 'Fiska kaj civila kalendaro de la Osmana Imperio.',
        'body': 'Julia kun jaro = julia jaro − 584. Forigita de Turkio en 1926.',
        'source': 'Julian conversion (Meeus, ch. 7). Post-1840 reform: Julian year = Rūmī year + 584, Jan–Dec structure. Ottoman fiscal reform decree of 13 March 1840.',
        'months': '12 juliaj monatoj.',
      },
      'roman': {
        'name': 'Romia kalendaro',
        'type': 'Suna',
        'intro': 'La julia kalendaro kun tradicia romia datnotacio: Kalendoj, Nonoj kaj Idoj.',
        'body': 'Uzas AUC-jarojn kun latinaj monatnomoj. Tagoj esprimatas per malantaŭen-kalkulo de tri fiksaj punktoj: Kalendae (1-a), Nonae (5-a/7-a) kaj Idus (13-a/15-a).',
        'source': 'Same Julian→JDN conversion as AUC (Meeus, ch. 7, Varronian epoch 753 BCE). Roman day-counting rules from Bickerman, Chronology of the Ancient World (1980), ch. IV.',
        'months': '12 monatoj kun latinaj nomoj.',
      },
      'spanish': {
        'name': 'Hispana epoko',
        'type': 'Suna',
        'intro': 'Era Hispanica de 38 a.K. Normo en Iberio dum pli ol mil jaroj.',
        'body': 'Julia kun epok-ŝovo de 38 jaroj.',
        'source': 'Julian conversion (Meeus, ch. 7). Julian year = Spanish year − 38. Era Hispanica epoch: 1 January 38 BCE, marking the Roman conquest of Iberia.',
        'months': '12 juliaj monatoj.',
      },
      'antiochene': {
        'name': 'Antioĥia epoko',
        'type': 'Suna',
        'intro': 'Cezara epoko de Antioĥio de 49 a.K. (Batalo de Farsalo).',
        'body': 'Julia kun oktobra jarenkonduko kaj epok-ŝovo de 49 jaroj. Anstataŭigis la seleuĉidan epokon en Antioĥio.',
        'source': 'Julian conversion (Meeus, ch. 7) with October year start. Oct–Dec: Julian year = Y − 49; Jan–Sep: Julian year = Y − 48. Caesarean epoch: autumn 49 BCE (Battle of Pharsalus).',
        'months': '12 monatoj de oktobro.',
      },
      'olympiad': {
        'name': 'Olimpiada kalendaro',
        'type': 'Suna',
        'intro': '4-jaraj cikloj de la unuaj Olimpikoj en 776 a.K.',
        'body': 'Linia jarkalkulo de 776 a.K.',
        'source': 'Julian conversion (Meeus, ch. 7). Linear year count: Julian year = Y − 776. Olympiad number = ⌊(Y−1)/4⌋ + 1, year within olympiad = ((Y−1) mod 4) + 1. Epoch: 776 BCE, the traditional date of the first Olympic Games.',
        'months': '12 juliaj monatoj.',
      },
      'hebrew': {
        'name': 'Hebrea kalendaro',
        'type': 'Lunsunsistemo',
        'intro': 'Hebrea lunsuna kalendaro por religiaj okazoj. Epoko: 3761 a.K.',
        'body': '19-jara ciklo kun 7 superjaroj aldonantaj Adar II. 353–385 tagoj.',
        'source': 'Reingold, E. M. & Dershowitz, N. Calendrical Calculations: The Ultimate Edition (2018), ch. 8, eqs. 8.1–8.25. Molad (mean conjunction): months = (235Y − 234)/19, parts = 12084 + 13753·months. Four dechiyot postpone New Year to avoid forbidden weekdays.',
        'warning': 'Antaŭ ~359 p.K. (la tradicia dato de la reformo de Hilel la 2-a) la hebrea kalendaro estis observa: novaj monatoj estis deklaritaj de la Sinedrio laŭ atesto de vidantoj, kaj interkalaj monatoj estis aldonitaj per rabena decido. La aritmetika molad-algoritmo estas anakronismo por pli fruaj datoj.',
        'months': '12 aŭ 13 monatoj.',
      },
      'babylonian': {
        'name': 'Babilona kalendaro',
        'type': 'Lunsunsistemo',
        'intro': 'Antikva Mezopotamia lunsuna kalendaro, prapatro de la hebrea. Epoko de Nabonasaro (747 a.K.).',
        'body': '19-jara ciklo kun Adaruo II. Aritmetika aproksimo per hebrea molado.',
        'source': 'Parker, R. A. & Dubberstein, W. H. Babylonian Chronology 626 B.C.–A.D. 75. (1956). Arithmetic approximation via Hebrew calendar molad.',
        'months': '12 aŭ 13 akadiaj monatoj.',
      },
      'bp': {
        'name': 'Antaŭ la nuno',
        'type': 'Suna',
        'intro': 'Temskalo por arkeologio. Nuno = 1950.',
        'body': 'Kalkulas malantaŭen de 1950.',
        'source': 'Simple offset: gregYear = 1950 − bpYear. Convention established by Libby, W. F. Radiocarbon Dating (1955). "Present" fixed at 1 January 1950 CE.',
        'months': '12 gregoriaj monatoj.',
      },
      'human': {
        'name': 'Homa epoko',
        'type': 'Suna',
        'intro': 'Holocena epoko: +10000 jaroj al gregoria.',
        'body': 'De Emiliani (1993). 12024 HE = 2024 p.K.',
        'source': 'Simple offset: gregYear = heYear − 10000. Emiliani, C. "Calendar Reform," Nature 366 (1993), p. 716. "I propose to simply add 10,000 years to the current era."',
        'months': '12 gregoriaj monatoj.',
      },
    },
  };

  /// Localized variant descriptions (JS `variantsItems`), aligned by index
  /// with [variantLabels]: lang -> calendar id -> descriptions.
  static const Map<String, Map<String, List<String>>> calendarVariantItems = {
    'en': {
      'hijri': [
        'Historiographic standard widely used in Western scholarship. Default in kalkal.',
        'Used in the Mashriq. Matches Intl.DateTimeFormat ‘islamic-civil’ and the Microsoft/Kuwaiti algorithm. Differs from IIc only in year 18 (instead of 19).',
        'Used historically in the Maghrib and al-Andalus. Differs from IIc in years 8 and 27 (instead of 7 and 26).',
        'Attributed to the 9th-century astronomer Ḥabash al-Ḥāsib. Differs from IIc in years 8, 11, 27, and 30 (instead of 7, 10, 26, and 29).',
      ],
      'yazdgerdi': [
        'Historical standard in Iran and among Zoroastrians. Epoch: 16 June 632 CE (Julian).',
        'Used by Parsi communities in India. Same 365-day wandering structure, but 30 days earlier due to a missed intercalation in the 8th century.',
        'Reformed modern variant with leap years (every 4th year, when year mod 4 = 3). Nawruz falls near the vernal equinox (21 March).',
      ],
      'byzantine': [
        'Official calendar of the Byzantine Empire (330–1453 CE). Year begins 1 September. Default in kalkal.',
        'Used by the Church of Alexandria and in early Christian chronography. Year begins 25 March (the Annunciation). Creation placed 16 years later than Constantinople (5493 vs 5509 BCE).',
        'The 7th-century Easter chronicle. Uses the Constantinople epoch (5509 BCE) with the Alexandrian March year start — a hybrid reckoning.',
      ],
      'seleucid': [
        'Year starts 1 October (month 1 = Dios). Used in Syria, Phoenicia, and western Asia Minor. Default in kalkal.',
        'Year starts 1 April (month 1 = Nisannu). Used in Mesopotamia. For the same Julian date the Babylonian SE year is typically 1 lower than the Macedonian.',
      ],
    },
    'pl': {
      'hijri': [
        'Standard historiograficzny szeroko przyjęty w zachodniej nauce. Domyślny w kalkal.',
        'Używany w Maszreku. Odpowiada Intl.DateTimeFormat „islamski cywilny” i algorytmowi kuwejckiemu (Microsoft). Różni się od IIc tylko rokiem 18 (zamiast 19).',
        'Używany historycznie w Maghrebie i al-Andalus. Różni się od IIc latami 8 i 27 (zamiast 7 i 26).',
        'Przypisywany IX-wiecznemu astronomowi Ḥabaszowi al-Ḥāsibowi. Różni się od IIc latami 8, 11, 27 i 30 (zamiast 7, 10, 26 i 29).',
      ],
      'yazdgerdi': [
        'Historyczny standard w Iranie i wśród zoroastrian. Epoka: 16 czerwca 632 n.e. (juliański).',
        'Używany przez społeczności parsyjskie w Indiach. Ta sama 365-dniowa struktura, lecz 30 dni wcześniej wskutek pominiętej interkałacji w VIII w.',
        'Zreformowany wariant z latami przestępnymi (co 4 lata, rok mod 4 = 3). Nawruz przypada blisko równonocy wiosennej (21 marca).',
      ],
      'byzantine': [
        'Oficjalny kalendarz Cesarstwa Bizantyńskiego (330–1453 n.e.). Rok zaczyna się 1 września. Domyślny w kalkal.',
        'Używany przez Kościół Aleksandrii i we wczesnochrzescijańskiej chronografii. Rok zaczyna się 25 marca (Zwiastowanie). Stworzenie umieszczone 16 lat później niż w wariancie konstantynopolitańskim (5493 vs 5509 p.n.e.).',
        'Kronika paschalna z VII w. Stosuje epokę konstantynopolitańską (5509 p.n.e.) z marcowym początkiem roku — wariant hybrydowy.',
      ],
      'seleucid': [
        'Rok zaczyna się 1 października (miesiąc 1 = Dios). Używany w Syrii, Fenicji i zachodniej Azji Mniejszej. Domyślny w kalkal.',
        'Rok zaczyna się 1 kwietnia (miesiąc 1 = Nisan). Używany w Mezopotamii. Dla tej samej daty juliańskiej numer roku SE jest o 1 niższy niż w rachunku macedońskim.',
      ],
    },
    'eo': {
      'hijri': [
        'Historiografia normo en okcidenta scienco. Defaŭlto en kalkal.',
        'Uzata en Mashriq. Kongruas kun Intl.DateTimeFormat “islamic-civil” (Microsoft/Kuvajta algoritmo). Diferencas de IIc nur en jaro 18 (anstataŭ 19).',
        'Uzata historie en Maghribo kaj al-Andaluso. Diferencas de IIc en jaroj 8 kaj 27 (anstataŭ 7 kaj 26).',
        'Atribuita al la 9-jarcenta astronomo Ḥabash al-Ḥāsib. Diferencas de IIc en jaroj 8, 11, 27 kaj 30.',
      ],
      'yazdgerdi': [
        'Historia normo en Irano kaj inter zoroastrianoj. Epoko: 16 junio 632 p.K. (julia).',
        'Uzata de parsaj komunumoj en Barato. Sama 365-taga vaganta strukturo, sed 30 tagojn pli frue pro preterlasita interkalo en la 8a jarcento.',
        'Reformita moderna varianto kun superjaroj (je ĉiu 4a jaro, jaro mod 4 = 3). Nawruz proksimas vernoksinokson (21 marto).',
      ],
      'byzantine': [
        'Oficiala kalendaro de la Bizanca Imperio (330–1453 p.K.). Jaro komenciĝas 1 septembro. Defaŭlta en kalkal.',
        'Uzata de la Eklezio de Aleksandrio kaj en fruaj kristanaj kronografioj. Jaro komenciĝas 25 marto (Anunciacio). Kreado lokita 16 jarojn poste ol Konstantinopola (5493 kontraŭ 5509 a.K.).',
        'La 7-jarcenta paska kroniko. Uzas la konstantinopolan epokon (5509 a.K.) kun la marta jarenkonduko de la Aleksandra varianto — hibrida rakonto.',
      ],
      'seleucid': [
        'Jaro komenciĝas 1 oktobro (monato 1 = Dios). Uzata en Sirio, Fenico kaj okcidenta Azio. Defaŭlta en kalkal.',
        'Jaro komenciĝas 1 aprilo (monato 1 = Nisanu). Uzata en Mesopotamio. Por la sama julia dato la babiona ES-jarnumero estas tipe 1 malpli ol la makedona.',
      ],
    },
  };

  /// Methodology page sections: lang -> section id -> field -> text.
  /// Fields: title, body, body2, warning, note (presence varies).
  /// methSources additionally has [methSourceItems]; methLinks has title only.
  static const Map<String, Map<String, Map<String, String>>> methSections = {
    'en': {
      'methJDN': {
        'title': 'Julian Day Number as Universal Pivot',
        'body': 'All date conversions in kalkal pass through the Julian Day Number (JDN) — a continuous count of days since the beginning of the Julian Period on 1 January 4713 BCE (Julian proleptic calendar). Each calendar system implements two functions: one to convert a date into a JDN, and one to convert a JDN back into a date in that calendar. To convert from calendar A to calendar B, we compute A → JDN → B. This approach avoids the combinatorial explosion of writing direct conversion functions between every pair of calendars.',
        'note': 'The Julian Day Number is a tool of astronomical chronology unrelated to the Julian calendar, despite the shared name. It was introduced by Joseph Justus Scaliger in 1583.',
      },
      'methArchitecture': {
        'title': 'Architecture and Construction',
        'body': 'kalkal runs entirely in the browser with zero external dependencies and no build step. The computational engine is a single JavaScript module (Cal) exposing toJD() and fromJD() functions for each of the 20+ supported calendar systems. A separate registry maps each calendar to its Cal functions, handling UI concerns like variant selection (e.g. the 4 tabular Hijri variants) independently from the algorithms. Internationalization covers 4 languages (EN, PL, AR, EO) with full RTL support for Arabic.',
        'body2': 'Nearly all algorithms are purely arithmetic — no astronomical calculations, no external API calls, no lookup tables of observed data. The one exception is the Babylonian calendar, which uses the Parker & Dubberstein observational tables for 626 BCE–45 CE (with an arithmetic fallback outside that range). For all other calendars, every conversion is reproducible: the same input always produces the same output regardless of platform, locale, or network state.',
      },
      'methAlgorithms': {
        'title': 'Algorithm Sources',
        'body': 'Gregorian and Julian conversions follow the algorithms in Meeus (1998). The tabular Hijri calendar uses a 30-year cycle with 4 historical leap-year variants (IIc/Wüstenfeld as default). The Solar Hijri uses the 2820-year arithmetic cycle from Birashk, refined by Borkowski. Coptic, Ethiopian, Egyptian, Yazdgerdi, and Armenian calendars use epoch-offset arithmetic from Reingold & Dershowitz (2018). The Hebrew calendar implements the full molad-based rules from the same source. Byzantine, Seleucid, Syriac, Rumi, AUC, Spanish Era, Olympiad, and Macedonian calendars are Julian-based with epoch offsets.',
        'warning': 'The tabular Hijri calendar may differ by ±1–2 days from calendars based on lunar observation (used officially in Saudi Arabia and other countries). It is intended for historical research and approximate conversion, not for determining religious observance dates. No systematic tables of observed Hijri dates survive from the medieval period; the Saudi Umm al-Qura calendar, based on astronomical computation, begins only in 1356 AH (1937 CE).',
      },
      'methValidation': {
        'title': 'Validation and Verification',
        'body': 'Every calendar conversion is validated through three independent methods. First, round-trip testing: for each calendar, a date is converted to JDN and back, confirming that fromJD(toJD(date)) === date across hundreds of test cases spanning epochs, boundaries, and modern dates. Second, cross-verification against independent implementations: the Fourmilab algorithm (public domain), the browser’s Intl.DateTimeFormat API, and Python’s hijri-converter library. Third, spot-checking known historical dates (e.g. Battle of Badr = 17 Ramadan 2 AH = 13 March 624 CE Julian, Fall of Baghdad = 10 February 1258 CE) against published scholarly sources.',
        'body2': 'Tests run in Node.js by loading the browser-targeted Cal module. No test framework is used — the verification scripts output pass/fail counts directly, making the test suite itself auditable with zero dependencies.',
      },
      'methSources': {
        'title': 'Sources and References',
      },
      'methLinks': {
        'title': 'Coverage and Similar Tools',
      },
    },
    'pl': {
      'methJDN': {
        'title': 'Juliański Dzień Numer jako uniwersalny pivot',
        'body': 'Wszystkie konwersje dat w kalkal przechodzą przez Juliański Dzień Numer (JDN) — ciągłe liczenie dni od początku Okresu Juliańskiego, 1 stycznia 4713 r. p.n.e. Każdy system kalendarzowy implementuje dwie funkcje: konwersję daty na JDN i konwersję JDN na datę. Aby przeliczyć z kalendarza A na B, obliczamy A → JDN → B.',
        'note': 'Juliański Dzień Numer jest narzędziem chronologii astronomicznej, niezwiązanym z kalendarzem juliańskim mimo wspólnej nazwy. Został wprowadzony przez Josepha Justusa Scaligera w 1583 roku.',
      },
      'methArchitecture': {
        'title': 'Architektura i budowa',
        'body': 'kalkal działa całkowicie w przeglądarce, bez zależności zewnętrznych i bez kroku budowania. Silnik obliczeniowy to pojedynczy moduł JavaScript (Cal) udostępniający funkcje toJD() i fromJD() dla każdego z ponad 20 obsługiwanych systemów kalendarzowych. Osobny rejestr mapuje każdy kalendarz na jego funkcje Cal. Internacjonalizacja obejmuje 4 języki (EN, PL, AR, EO) z pełną obsługą RTL dla arabskiego.',
        'body2': 'Niemal wszystkie algorytmy są czysto arytmetyczne — bez obliczeń astronomicznych, bez wywołań API, bez tabel obserwacyjnych. Wyjątkiem jest kalendarz babiloński, który korzysta z tabel obserwacyjnych Parkera i Dubbersteina dla lat 626 p.n.e.–45 n.e. (poza tym zakresem stosowane jest przybliżenie arytmetyczne). Dla wszystkich pozostałych kalendarzy każda konwersja jest reprodukowalna: to samo wejście zawsze daje to samo wyjście.',
      },
      'methAlgorithms': {
        'title': 'Źródła algorytmów',
        'body': 'Konwersje gregoriańskie i juliańskie oparte na algorytmach Meeusa (1998). Tabelaryczny kalendarz hidżry używa cyklu 30-letniego z 4 wariantami lat przestępnych (domyślny IIc/Wüstenfeld). Słoneczny hidżry używa 2820-letniego cyklu arytmetycznego Birashka, udoskonalonego przez Borkowskiego. Kalendarze koptyjski, etiopski, egipski, jezdegerda i ormeński używają arytmetyki z przesunięciem epoki wg Reingolda i Dershowitza (2018). Kalendarz hebrajski implementuje pełne reguły molad z tego samego źródła. Kalendarze bizantyjski, seleucki, syryjski, rumi, AUC, era hiszpańska, olimpiady i macedoński są oparte na juliańskim z przesunięciem epoki.',
        'warning': 'Kalendarz tabelaryczny może różnić się o ±1–2 dni od kalendarzy opartych na obserwacji księżyca. Jest przeznaczony do badań historycznych, nie do wyznaczania dat obrzędów religijnych. Nie zachowały się systematyczne tablice obserwowanych dat hidżry ze średniowiecza; saudyjski kalendarz Umm al-Qura, oparty na obliczeniach astronomicznych, zaczyna się dopiero od 1356 AH (1937 n.e.).',
      },
      'methValidation': {
        'title': 'Walidacja i weryfikacja',
        'body': 'Każda konwersja jest walidowana trzema niezależnymi metodami. Po pierwsze, testy obustronności (round-trip): data jest konwertowana na JDN i z powrotem, potwierdzając że fromJD(toJD(data)) === data dla setek przypadków testowych. Po drugie, weryfikacja krzyżowa z niezależnymi implementacjami: algorytmem Fourmilab (domena publiczna), API Intl.DateTimeFormat przeglądarki oraz biblioteką Python hijri-converter. Po trzecie, sprawdzanie znanych dat historycznych (np. bitwa pod Badr = 17 ramadan 2 AH = 13 marca 624 n.e.) ze źródłami naukowymi.',
        'body2': 'Testy uruchamiane są w Node.js, ładując moduł Cal przeznaczony dla przeglądarki. Nie używa się żadnego frameworka testowego — skrypty weryfikacyjne wypisują wyniki bezpośrednio, co czyni sam zestaw testów audytowalnym bez zależności.',
      },
      'methSources': {
        'title': 'Źródła i bibliografia',
      },
      'methLinks': {
        'title': 'Pokrycie i podobne narzędzia',
      },
    },
    'eo': {
      'methJDN': {
        'title': 'Julia Tagnombro kiel pivoto',
        'body': 'Ĉiuj konvertoj pasas tra JDN — kontinua kalkulo de tagoj ekde la komenco de la julia periodo. Ĉiu kalendaro havas du funkciojn: dato→JDN kaj JDN→dato. Por konverti de A al B: A→JDN→B.',
        'note': 'Astronomihistoria ilo, ne rilata al julia kalendaro. Scaliger, 1583.',
      },
      'methArchitecture': {
        'title': 'Arkitekturo kaj konstruo',
        'body': 'kalkal funkcias tute en la retumilo sen eksteraj dependecoj aŭ konstrupaŝo. La komputila motoro estas ununura JavaScript-modulo (Cal) kun toJD() kaj fromJD() por ĉiu el pli ol 20 kalendarsistemoj. Internaciigo en 4 lingvoj (EN, PL, AR, EO) kun plena RTL-subteno.',
        'body2': 'Preskaŭ ĉiuj algoritmoj estas pure aritmetikaj — sen astronomiaj kalkuloj, sen API-vokoj, sen observdatumtabeloj. La sola escepto estas la babilona kalendaro, kiu uzas la observtabelojn de Parker & Dubberstein por 626 a.K.–45 p.K. (kun aritmetika proksimumo ekster tiu intervalo). Por ĉiuj aliaj kalendaroj, ĉiu konverto estas reproduktebla: sama enigo ĉiam donas saman eligon.',
      },
      'methAlgorithms': {
        'title': 'Algoritmaj fontoj',
        'body': 'Gregoriaj kaj juliaj konvertoj laŭ Meeus (1998). Tabela hiĝra uzas 30-jaran ciklon kun 4 variantoj (IIc defaŭlta). Suna hiĝra uzas la 2820-jaran ciklon de Birashk/Borkowski. Kopta, etiopa, egipta, jazdgerda kaj armena laŭ Reingold & Dershowitz (2018). Hebrea implementas plenajn molad-regulojn. Bizanca, seleuĉida, siria, rumi, AUC, hispana, olimpiada kaj makedona estas juliaj kun epok-ŝovo.',
        'warning': 'La tabela hiĝra kalendaro povas diferenci ±1–2 tagojn de observ-bazitaj kalendaroj. Ĝi estas por historia esploro, ne por religiaj datoj. Ne ekzistas sistematikaj tabeloj de observitaj hiĝraj datoj el la mezepoko; la saŭda kalendaro Umm al-Qura, bazita sur astronomia kalkulo, komenciĝas nur de 1356 AH (1937 p.K.).',
      },
      'methValidation': {
        'title': 'Validado kaj kontrolo',
        'body': 'Ĉiu konverto estas validata per tri sendependaj metodoj. Unue, rondira testo: dato konvertita al JDN kaj reen, konfirmante ke fromJD(toJD(dato)) === dato por centoj da testkazoj. Due, kruckontrolo kun sendependaj implementoj: Fourmilab-algoritmo, Intl.DateTimeFormat de la retumilo, kaj Python hijri-converter. Trie, komparo de konataj historiaj datoj (ekz. Batalo de Badr = 17 ramadan 2 AH = 13 marto 624) kun akademiaj fontoj.',
        'body2': 'Testoj rulas en Node.js ŝarĝante la retumilon-celitan Cal-modulon. Neniu testokadro uzata — la skriptoj eligas rezultojn rekte, farante la testaron mem aŭditeblaj sen dependecoj.',
      },
      'methSources': {
        'title': 'Fontoj',
      },
      'methLinks': {
        'title': 'Kovrado kaj similaj iloj',
      },
    },
  };

  /// Bibliography entries of the methSources section, each a
  /// [before, italicized title, after] triple: lang -> entries.
  static const Map<String, List<List<String>>> methSourceItems = {
    'en': [
      [
        'Richards, E. G. ',
        'Mapping Time: The Calendar and its History',
        '. Oxford University Press, 1998.',
      ],
      [
        'Reingold, Edward M. & Dershowitz, Nachum. ',
        'Calendrical Calculations: The Ultimate Edition',
        '. Cambridge University Press, 2018.',
      ],
      [
        'Meeus, Jean. ',
        'Astronomical Algorithms',
        '. 2nd ed. Willmann-Bell, 1998.',
      ],
      [
        'Borkowski, K. M. "ELP2000-85 and the Dynamical Time – Universal Time relation." ',
        'Astronomy and Astrophysics',
        ', 205 (1988), L8–L10.',
      ],
      [
        'de Blois, François. "Taʿrīkh" (chronology section) in ',
        'Encyclopaedia of Islam',
        ', 2nd ed.',
      ],
      [
        'Birashk, Ahmad. ',
        'A Comparative Calendar of the Iranian, Muslim Lunar, and Christian Eras for Three Thousand Years',
        '. Mazda Publishers, 1993.',
      ],
    ],
    'pl': [
      [
        'Richards, E. G. ',
        'Mapping Time: The Calendar and its History',
        '. Oxford University Press, 1998.',
      ],
      [
        'Reingold, Edward M. & Dershowitz, Nachum. ',
        'Calendrical Calculations: The Ultimate Edition',
        '. Cambridge University Press, 2018.',
      ],
      [
        'Meeus, Jean. ',
        'Astronomical Algorithms',
        '. 2nd ed. Willmann-Bell, 1998.',
      ],
      [
        'Borkowski, K. M. „ELP2000-85 and the Dynamical Time – Universal Time relation.” ',
        'Astronomy and Astrophysics',
        ', 205 (1988), L8–L10.',
      ],
      [
        'de Blois, François. „Taʿrīkh” (sekcja chronologii) w ',
        'Encyclopaedia of Islam',
        ', 2nd ed.',
      ],
      [
        'Birashk, Ahmad. ',
        'A Comparative Calendar of the Iranian, Muslim Lunar, and Christian Eras for Three Thousand Years',
        '. Mazda Publishers, 1993.',
      ],
    ],
    'eo': [
      [
        'Richards, E. G. ',
        'Mapping Time',
        '. Oxford, 1998.',
      ],
      [
        'Reingold & Dershowitz. ',
        'Calendrical Calculations',
        '. Cambridge, 2018.',
      ],
      [
        'Meeus, Jean. ',
        'Astronomical Algorithms',
        '. Willmann-Bell, 1998.',
      ],
      [
        'Borkowski, K. M. ',
        'Astronomy and Astrophysics',
        ', 205 (1988).',
      ],
      [
        'de Blois. "Taʿrīkh" en ',
        'Encyclopaedia of Islam',
        '.',
      ],
      [
        'Birashk, Ahmad. ',
        'A Comparative Calendar...',
        ' Mazda, 1993.',
      ],
    ],
  };

  /// Season names (spring, summer, autumn, winter): lang -> 4 labels.
  static const Map<String, List<String>> seasonLabels = {
    'en': [
      'Spring',
      'Summer',
      'Autumn',
      'Winter',
    ],
    'pl': [
      'Wiosna',
      'Lato',
      'Jesień',
      'Zima',
    ],
    'eo': [
      'Printempo',
      'Somero',
      'Aŭtuno',
      'Vintro',
    ],
  };

  /// Methodology section ids in display order.
  static const List<String> methSectionOrder = [
    'methJDN',
    'methArchitecture',
    'methAlgorithms',
    'methValidation',
    'methSources',
    'methLinks',
  ];

  /// Calendar groups in display order (TOC grouping and card order of the
  /// Calendars page).
  static const List<PageCalGroup> calGroups = [
    PageCalGroup('universal', ['human', 'bp']),
    PageCalGroup('christian', ['gregorian', 'julian', 'byzantine', 'spanish']),
    PageCalGroup('islamic', ['hijri', 'solarHijri', 'rumi']),
    PageCalGroup('iranian', ['yazdgerdi', 'ilkhani']),
    PageCalGroup('semitic', ['hebrew', 'syriac', 'antiochene', 'seleucid', 'babylonian']),
    PageCalGroup('african', ['coptic', 'ethiopian', 'egyptian']),
    PageCalGroup('grecoRoman', ['roman', 'olympiad', 'macedonian', 'alexandrian', 'armenian']),
  ];

  /// Month-season visualization data per calendar id.
  static const Map<String, CalMonthMeta> calMonthMeta = {
    'gregorian': CalMonthMeta('gregorianMonths', ['31', '28/29', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31'], [3, 3, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3]),
    'julian': CalMonthMeta('gregorianMonths', ['31', '28/29', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31'], [3, 3, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3]),
    'hijri': CalMonthMeta('hijriMonths', ['30', '29', '30', '29', '30', '29', '30', '29', '30', '29', '30', '29/30'], null),
    'solarHijri': CalMonthMeta('persianMonths', ['31', '31', '31', '31', '31', '31', '30', '30', '30', '30', '30', '29/30'], [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3]),
    'ilkhani': CalMonthMeta('persianMonths', ['31', '31', '31', '31', '31', '31', '30', '30', '30', '30', '30', '29/30'], [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3]),
    'coptic': CalMonthMeta('copticMonths', ['30', '30', '30', '30', '30', '30', '30', '30', '30', '30', '30', '30', '5/6'], [2, 2, 2, 3, 3, 3, 0, 0, 0, 1, 1, 1, 1]),
    'ethiopian': CalMonthMeta('ethiopianMonths', ['30', '30', '30', '30', '30', '30', '30', '30', '30', '30', '30', '30', '5/6'], [2, 2, 2, 3, 3, 3, 0, 0, 0, 1, 1, 1, 1]),
    'yazdgerdi': CalMonthMeta('yazdgerdiMonths', ['30', '30', '30', '30', '30', '30', '30', '30', '30', '30', '30', '30', '5'], null),
    'armenian': CalMonthMeta('armenianMonths', ['30', '30', '30', '30', '30', '30', '30', '30', '30', '30', '30', '30', '5'], null),
    'egyptian': CalMonthMeta('egyptianMonths', ['30', '30', '30', '30', '30', '30', '30', '30', '30', '30', '30', '30', '5'], null),
    'byzantine': CalMonthMeta('byzantineMonths', ['30', '31', '30', '31', '31', '28/29', '31', '30', '31', '30', '31', '31'], [2, 2, 2, 3, 3, 3, 0, 0, 0, 1, 1, 1]),
    'alexandrian': CalMonthMeta('alexandrianMonths', ['31', '30', '31', '30', '31', '31', '30', '31', '30', '31', '31', '28/29'], [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3]),
    'seleucid': CalMonthMeta('seleucidMonths', ['31', '30', '31', '31', '28/29', '31', '30', '31', '30', '31', '31', '30'], [2, 2, 3, 3, 3, 0, 0, 0, 1, 1, 1, 2]),
    'syriac': CalMonthMeta('syriacMonths', ['31', '28/29', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31'], [3, 3, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3]),
    'macedonian': CalMonthMeta('macedonianMonths', ['31', '30', '31', '31', '28/29', '31', '30', '31', '30', '31', '31', '30'], [2, 2, 3, 3, 3, 0, 0, 0, 1, 1, 1, 2]),
    'rumi': CalMonthMeta('gregorianMonths', ['31', '28/29', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31'], [3, 3, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3]),
    'roman': CalMonthMeta('romanMonths', ['31', '28/29', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31'], [3, 3, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3]),
    'spanish': CalMonthMeta('gregorianMonths', ['31', '28/29', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31'], [3, 3, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3]),
    'antiochene': CalMonthMeta('seleucidMonths', ['31', '30', '31', '31', '28/29', '31', '30', '31', '30', '31', '31', '30'], [2, 2, 3, 3, 3, 0, 0, 0, 1, 1, 1, 2]),
    'olympiad': CalMonthMeta('gregorianMonths', ['31', '28/29', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31'], [3, 3, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3]),
    'hebrew': CalMonthMeta('hebrewMonths', ['30', '29/30', '29/30', '29', '30', '29/30', '29', '30', '29', '30', '29', '30', '29'], [2, 2, 2, 3, 3, 3, 0, 0, 0, 0, 1, 1, 1]),
    'babylonian': CalMonthMeta('babylonianMonths', ['30', '29', '30', '29', '30', '29', '30', '30', '29/30', '29', '30', '29/30', '29'], [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3]),
    'bp': CalMonthMeta('gregorianMonths', ['31', '28/29', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31'], [3, 3, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3]),
    'human': CalMonthMeta('gregorianMonths', ['31', '28/29', '31', '30', '31', '30', '31', '31', '30', '31', '30', '31'], [3, 3, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3]),
  };

  /// Static variant labels per calendar id (from calendars.html), aligned by
  /// index with [calendarVariantItems].
  static const Map<String, List<CalVariantLabel>> variantLabels = {
    'hijri': [
      CalVariantLabel('IIc', 'IIc — Wüstenfeld', '(leap years of cycle: 2, 5, 7, 10, 13, 16, 19, 21, 24, 26, 29)'),
      CalVariantLabel('IIa', 'IIa — East Islamic civil', '(leap years: 2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29)'),
      CalVariantLabel('IIIa', 'IIIa — West Islamic civil', '(leap years: 2, 5, 8, 10, 13, 16, 19, 21, 24, 27, 29)'),
      CalVariantLabel('IVa', 'IVa — Ḥabash al-Ḥāsib', '(leap years: 2, 5, 8, 11, 13, 16, 19, 21, 24, 27, 30)'),
    ],
    'yazdgerdi': [
      CalVariantLabel('Shahenshahi', 'Shahenshahi', '(wandering, 365 days, no leap years, epoch: 16 June 632 CE Julian)'),
      CalVariantLabel('Qadimi', 'Qadimi', '(wandering, epoch: 17 May 632 CE Julian, 30 days before Shahenshahi)'),
      CalVariantLabel('Fasli', 'Fasli', '(reformed, leap years every 4th year, Nawruz near 21 March, epoch: 28 March 632 CE Julian)'),
    ],
    'byzantine': [
      CalVariantLabel('Constantinople', 'Constantinople', ''),
      CalVariantLabel('Alexandrian', 'Alexandrian', ''),
      CalVariantLabel('ChronPasch', 'Chronicon Paschale', ''),
    ],
    'seleucid': [
      CalVariantLabel('Macedonian', 'Macedonian', ''),
      CalVariantLabel('Babylonian', 'Babylonian', ''),
    ],
  };

  // ---------------------------------------------------------------------
  // Accessors (mirror how js/pages.js consumes PageI18N: `const t =
  // PageI18N[lang];` then per-key application — setT() only overwrites the
  // static English HTML when the localized string exists, so the effective
  // fallback is per-field to English).
  // ---------------------------------------------------------------------

  /// Flat page string for [key]; falls back to English, then the key itself.
  static String t(String lang, String key) =>
      strings[lang]?[key] ?? strings['en']![key] ?? key;

  /// Navigation label; falls back to English, then the key itself.
  static String navT(String lang, String key) =>
      nav[lang]?[key] ?? nav['en']![key] ?? key;

  /// About page string; falls back to English, then the key itself.
  static String aboutT(String lang, String key) =>
      about[lang]?[key] ?? about['en']![key] ?? key;

  /// One field of a calendar description (e.g. calT('pl', 'hijri', 'intro'));
  /// falls back to English; null when the field exists in neither language.
  static String? calT(String lang, String calendarId, String field) =>
      calendarDescriptions[lang]?[calendarId]?[field] ??
      calendarDescriptions['en']![calendarId]?[field];

  /// Full description map for [calendarId]: English fields overlaid with the
  /// localized ones (per-field fallback, as on the web page where
  /// untranslated fields keep the static English HTML text).
  static Map<String, String> calendarDescription(String lang, String calendarId) => {
        ...?calendarDescriptions['en']![calendarId],
        ...?calendarDescriptions[lang]?[calendarId],
      };

  /// Localized variant descriptions for [calendarId] (empty list when the
  /// calendar has no variants); falls back to English.
  static List<String> variantItems(String lang, String calendarId) =>
      calendarVariantItems[lang]?[calendarId] ??
      calendarVariantItems['en']![calendarId] ??
      const <String>[];

  /// One field of a methodology section (e.g. methT('eo', 'methJDN', 'body'));
  /// falls back to English; null when absent in both.
  static String? methT(String lang, String sectionId, String field) =>
      methSections[lang]?[sectionId]?[field] ??
      methSections['en']![sectionId]?[field];

  /// Bibliography triples of the methSources section; falls back to English.
  static List<List<String>> methSources(String lang) =>
      methSourceItems[lang] ?? methSourceItems['en']!;

  /// Season labels for [lang]; falls back to English.
  static List<String> seasonLabelsFor(String lang) =>
      seasonLabels[lang] ?? seasonLabels['en']!;
}

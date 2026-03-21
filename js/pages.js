// kalkal — Subpage i18n and shared logic
// Reuses lang preference from main app (localStorage 'kalkal-lang')

const PageI18N = {
  en: {
    nav: { converter: 'Converter', calendars: 'Calendars', methodology: 'Methodology', dynasties: 'Dynasties' },
    calPageTitle: 'Calendar Systems',
    dynPageTitle: 'Dynasties',
    dynPageSubtitle: 'Chronological tables of Islamic and Near Eastern rulers',
    calPageSubtitle: 'Descriptions of the calendar systems supported by kalkal',
    methPageTitle: 'Methodology',
    methPageSubtitle: 'How kalkal was built, how it calculates, and how it is verified',
    backToConverter: 'Back to converter',
    formulaLabel: 'Formula',

    gregorian: {
      name: 'Gregorian Calendar',
      type: 'Solar',
      epoch: 'January 1, 1 CE',
      intro: 'The Gregorian calendar is the internationally accepted civil calendar, introduced by Pope Gregory XIII on 15 October 1582 as a reform of the Julian calendar.',
      body: 'The reform corrected the accumulated drift of approximately 10 days that had built up since the Council of Nicaea (325 CE), and refined the leap year rule to prevent future drift. A year is a leap year if divisible by 4, unless it is also divisible by 100 \u2014 except when divisible by 400. This gives a mean year length of 365.2425 days, very close to the tropical year of ~365.2422 days.',
      adoption: 'Catholic countries adopted the reform in 1582, but Protestant and Orthodox nations followed much later: the British Empire in 1752, Russia in 1918, Greece in 1923, and Turkey in 1926. Dates before a country\'s adoption are often given in the Julian calendar ("Old Style").',
      months: 'Twelve months of 28\u201331 days: January (31), February (28/29), March (31), April (30), May (31), June (30), July (31), August (31), September (30), October (31), November (30), December (31).'
    },
    julian: {
      name: 'Julian Calendar',
      type: 'Solar',
      epoch: 'January 1, 1 CE (proleptic)',
      intro: 'The Julian calendar was introduced by Julius Caesar in 46 BCE, effective from 1 January 45 BCE, replacing the earlier Roman calendar. It was the predominant calendar in Europe and the Mediterranean world for over 1,600 years.',
      body: 'The Julian calendar established a simple leap year rule: every year divisible by 4 is a leap year, giving a mean year of exactly 365.25 days. This is about 11 minutes longer than the tropical year, leading to an accumulated error of approximately 1 day every 128 years.',
      adoption: 'By the 16th century, the calendar had drifted about 10 days from the astronomical equinox, prompting the Gregorian reform. The Julian calendar is still used liturgically by some Eastern Orthodox churches (the "Old Calendar"), and it remains the standard for historical dating before 15 October 1582.',
      months: 'Twelve months identical in name and length to the Gregorian calendar, differing only in the leap year rule (every 4th year, without exception).'
    },
    hijri: {
      name: 'Hijri Calendar (Lunar Islamic)',
      type: 'Lunar',
      epoch: '1 Muharram 1 AH = 16 July 622 CE (Julian)',
      intro: 'The Hijri calendar (at-taqwim al-hijri) is a purely lunar calendar of 12 months used throughout the Islamic world for religious observances. Its epoch is the Hijra (emigration) of the Prophet Muhammad from Mecca to Medina.',
      body: 'Each month begins, in principle, with the sighting of the new crescent moon. The calendar alternates months of 30 and 29 days, with a leap day added to the last month (Dhu al-Hijja) in certain years. The year is approximately 354 days long (355 in leap years), making it about 11 days shorter than the solar year. The calendar therefore cycles through the seasons over a period of roughly 33 years.',
      tabular: 'The tabular (arithmetic) version of the Hijri calendar \u2014 used in kalkal \u2014 employs a fixed 30-year cycle in which 11 years are leap years. Four main variants exist, differing only in which years of the cycle are designated as leap.',
      variantsText: 'The default variant is W\u00fcstenfeld (IIc), the historiographic standard widely adopted in Western scholarship. The East Islamic civil variant (IIa), used in the Mashriq and by the "Kuwaiti algorithm," differs from it in a single leap year (year 18 instead of 19). The West Islamic civil variant (IIIa), used historically in the Maghrib and al-Andalus, shifts three leap years. The fourth variant is attributed to the 9th-century astronomer \u1e24abash al-\u1e24\u0101sib (IVa).',
      months: 'Twelve months: Mu\u1e25arram (30), \u1e62afar (29), Rab\u012b\u02bf al-Awwal (30), Rab\u012b\u02bf a\u1e6f-\u1e6e\u0101n\u012b (29), \u01e6um\u0101d\u0101 al-\u016al\u0101 (30), \u01e6um\u0101d\u0101 al-\u0100\u1e2bira (29), Ra\u01e7ab (30), \u0160a\u02bfb\u0101n (29), Rama\u1e0d\u0101n (30), \u0160aww\u0101l (29), \u1e0e\u016b al-Qa\u02bfda (30), \u1e0e\u016b al-\u1e24i\u01e7\u01e7a (29 or 30).'
    },
    solarHijri: {
      name: 'Solar Hijri Calendar (Iranian)',
      type: 'Solar',
      epoch: '1 Farvardin 1 AP = 22 March 622 CE (Julian)',
      intro: 'The Solar Hijri calendar (g\u0101h\u0161om\u0101r\u012b-ye he\u01e7r\u012b-ye \u1e2bor\u0161\u012bd\u012b) is the official calendar of Iran and Afghanistan. It is a solar calendar whose epoch coincides with the Hijra, but whose year length tracks the tropical year via the vernal equinox.',
      body: 'The first six months have 31 days, the next five have 30 days, and the twelfth month (Esfand) has 29 days in common years and 30 in leap years. Officially, the new year (Nowruz) begins at the astronomical vernal equinox as observed from Tehran.',
      arithmetic: 'For computational purposes, kalkal uses the arithmetic approximation based on a 2820-year cycle (containing exactly 1,029,983 days), which closely matches the astronomical calendar. Leap years are determined by a formula involving this cycle, attributed to Ahmad Birashk and refined by K. M. Borkowski.',
      months: 'Twelve months: Farvardin (31), Ordibehe\u0161t (31), \u1e2aord\u0101d (31), Tir (31), Mord\u0101d (31), \u0160ahrivar (31), Mehr (30), \u0100b\u0101n (30), \u0100\u1e0far (30), Dey (30), Bahman (30), Esfand (29/30).'
    },
    coptic: {
      name: 'Coptic Calendar',
      type: 'Solar',
      epoch: '1 Thout 1 AM = 29 August 284 CE (Julian)',
      intro: 'The Coptic calendar (also called the Alexandrian calendar) descends from the ancient Egyptian civil calendar, reformed under Augustus to include a leap year. It counts years from the Era of the Martyrs (Anno Martyrum, AM), beginning with the accession of the Roman emperor Diocletian.',
      body: 'The calendar consists of 12 months of 30 days each, followed by a short 13th month (Epagomenai) of 5 days in common years or 6 in leap years. Leap years occur every 4 years, when the year number leaves a remainder of 3 when divided by 4. The mean year is 365.25 days, identical to the Julian calendar.',
      usage: 'The Coptic calendar is used liturgically by the Coptic Orthodox Church and for agricultural purposes in Egypt. The Ethiopian calendar shares its structure but uses a different epoch.',
      months: 'Thirteen months: Thout, Paopi, Hathor, Koiak, Tobi, Meshir, Paremhat, Parmouti, Pashons, Paoni, Epip, Mesori (each 30 days), Epagomenai (5 or 6 days).'
    },
    ethiopian: {
      name: 'Ethiopian Calendar',
      type: 'Solar',
      epoch: '1 M\u00e4sk\u00e4r\u00e4m 1 = 29 August 8 CE (Julian)',
      intro: 'The Ethiopian calendar (ye\u02bcItyop\u02bcya zen meqo\u1e45enya) is the official calendar of Ethiopia. It belongs to the same Alexandrian family as the Coptic calendar, sharing its structure of 12 \u00d7 30-day months plus a 13th epagomenal month.',
      body: 'The epoch is approximately 7\u20138 years behind the Gregorian calendar, reflecting a different calculation of the Annunciation of Jesus. Leap years follow the same rule as the Coptic calendar (year % 4 === 3). The Ethiopian New Year (Enkutatash) falls on 11 September in the Gregorian calendar (12 September in Gregorian leap years).',
      usage: 'Ethiopia is one of the few countries to use a non-Gregorian calendar as its official civil calendar. The calendar is deeply embedded in Ethiopian culture, religion, and daily life.',
      months: 'Thirteen months: M\u00e4sk\u00e4r\u00e4m, \u1e6c\u0259q\u0259mt, \u1e24\u0259dar, Ta\u1e2b\u015ba\u015b, \u1e6c\u0259r, Y\u00e4katit, M\u00e4gabit, Miyazya, G\u0259nbot, S\u00e4ne, \u1e24amle, N\u00e4hase (each 30 days), Pagum\u00e4n (5 or 6 days).'
    },
    yazdgerdi: {
      name: 'Yazdgerdi Calendar',
      type: 'Solar (wandering)',
      epoch: '1 Farvardin 1 YZ = 16 June 632 CE (Julian)',
      intro: 'The Yazdgerdi calendar is the traditional Zoroastrian calendar of Iran, named after Yazdegerd III, the last Sasanian emperor. Its epoch is his coronation in 632 CE.',
      body: 'The calendar consists of 12 months of 30 days each, followed by 5 epagomenal days (the Gatha days). Crucially, it has no leap year mechanism \u2014 the year is always exactly 365 days. This makes it a "wandering" or "vague" calendar: it drifts backward through the seasons at a rate of approximately 1 day every 4 years (about 6 hours per year).',
      usage: 'The Yazdgerdi calendar was used in Iran alongside the Hijri calendar during the early Islamic period. It remains of interest to historians studying Sasanian and early Islamic chronology.',
      months: 'Thirteen months: Farvardin, Ordibehe\u0161t, \u1e2aord\u0101d, Tir, Mord\u0101d, \u0160ahrivar, Mehr, \u0100b\u0101n, \u0100\u1e0far, Dey, Bahman, Esfand (each 30 days), plus 5 epagomenal days.'
    },
    armenian: {
      name: 'Armenian Calendar',
      type: 'Solar (wandering)',
      epoch: '1 Navasard 1 = 11 July 552 CE (Julian)',
      intro: 'The traditional Armenian calendar is a fixed 365-day calendar with the same structure as the Egyptian and Yazdgerdi calendars. Its epoch is 11 July 552 CE (Julian), traditionally associated with the separation of the Armenian Church.',
      body: 'Like the Yazdgerdi calendar, it consists of 12 months of 30 days plus 5 epagomenal days (Aweleac\u02bc), with no leap year correction. It is therefore a "wandering" calendar that drifts through the seasons.',
      usage: 'The Armenian calendar was used in Armenia and by Armenian communities for historical and religious purposes. It was largely superseded by the Gregorian calendar, but remains important for historical chronology.',
      months: 'Thirteen months: Navasard, Ho\u1e59i, Sahmi, Tr\u0113, K\u2019alo\u010b, Arac\u2019, Mehekan, Areg, Ahekan, Mareri, Margac\u2019, Hrotic\u2019 (each 30 days), Aweleac\u2019 (5 days).'
    },
    egyptian: { name: 'Egyptian Calendar', type: 'Solar (wandering)', intro: 'The ancient Egyptian civil calendar, one of the oldest known. Counts from the Era of Nabonassar (747 BCE).', body: '12 \u00d7 30 days + 5 epagomenal days, no leap year. Always 365 days \u2014 a wandering calendar, prototype for all later 365-day calendars.', months: 'Thirteen months: Thoth, Phaophi, Athyr, Choiak, Tybi, Mechir, Phamenoth, Pharmuthi, Pachons, Payni, Epiphi, Mesore (30 days each), Epagomenai (5 days).' },
    byzantine: { name: 'Byzantine Calendar', type: 'Solar', intro: 'Anno Mundi calendars counting from the creation of the world. Three variants: Constantinople (5509 BCE, Sep start), Alexandrian (5493 BCE, Mar start), and Chronicon Paschale (5509 BCE, Mar start).', body: 'Julian calendar mechanics with era offset. The Constantinople variant was the official calendar of the Byzantine Empire. The Alexandrian variant was used by the Church of Alexandria. The Chronicon Paschale uses the Constantinople epoch with March year start. Indiction (15-year cycle) is displayed alongside dates.', months: 'Constantinople: twelve months from September. Alexandrian and Chronicon Paschale: twelve months from March.' },
    seleucid: { name: 'Seleucid Calendar', type: 'Solar', intro: 'The Seleucid era (Anno Graecorum) counts from 312 BCE. The most widely used era in the eastern Mediterranean for over a millennium. Two variants: Macedonian (October start) and Babylonian (April start).', body: 'Julian calendar mechanics with era offset. The Macedonian reckoning starts in October (Dios) and was used in Syria and the western regions. The Babylonian reckoning starts in April (Nisannu) and was used in Mesopotamia.', months: 'Macedonian: twelve months from October. Babylonian: twelve months from April.' },
    syriac: { name: 'Syriac Calendar', type: 'Solar', intro: 'Uses the Seleucid era (year 1 = 312 BCE) with Syriac month names and January\u2013December year.', body: 'The Julian calendar with an era offset of 311 years. Month names derive from the Babylonian calendar via Aramaic.', months: 'Twelve months: K\u0101n\u016bn II, \u0160b\u0101\u1e6d, \u0100\u1e0f\u0101r, N\u012bs\u0101n, Ayy\u0101r, \u1e24z\u012br\u0101n, Tamm\u016bz, \u0100b, Ayl\u016bl, Ti\u0161r\u012bn I, Ti\u0161r\u012bn II, K\u0101n\u016bn I.' },
    macedonian: { name: 'Macedonian Calendar', type: 'Solar', intro: 'The Syro-Macedonian calendar with Macedonian month names, Seleucid era, and October year start.', body: 'In its fixed Roman-era form, each month maps to a Julian month. Same structure as Seleucid with Macedonian names.', months: 'Twelve months from October: Dios, Apellaios, Audynaios, Peritios, Dystros, Xanthikos, Artemisios, Daisios, Panemos, Loos, Gorpiaios, Hyperberetaios.' },
    rumi: { name: 'R\u016bm\u012b Calendar', type: 'Solar', intro: 'The fiscal and civil calendar of the Ottoman Empire, Julian calendar with Hijra-era offset.', body: 'Post-1840s reform: January\u2013December, year = Julian year \u2212 584. Abolished by Turkey in 1926.', months: 'Twelve months with Julian names and lengths, January\u2013December.' },
    auc: { name: 'Ab Urbe Condita', type: 'Solar', intro: 'Counts from the founding of Rome in 753 BCE (Varronian reckoning).', body: 'Julian calendar with era offset: year 1 AUC = 753 BCE. Used in Roman historiography.', months: 'Twelve months with Julian names and lengths, January\u2013December.' },
    spanish: { name: 'Spanish Era', type: 'Solar', intro: 'The Era Hispanica counts from 38 BCE. Standard in the Iberian Peninsula for over a thousand years.', body: 'Julian calendar with era offset of 38 years. Aragon abandoned it in 1350, Castile in 1383, Portugal in 1422.', months: 'Twelve months with Julian names and lengths, January\u2013December.' },
    antiochene: { name: 'Antiochene Era', type: 'Solar', intro: 'The Caesarean Era of Antioch counts from 49 BCE (Battle of Pharsalus). Used in Antiochene chronicles.', body: 'Julian calendar with October year start and era offset of 49 years. Replaced the Seleucid era in local Antiochene usage.', months: 'Twelve months from October: October, November, December, January, February, March, April, May, June, July, August, September.' },
    olympiad: { name: 'Olympiad Calendar', type: 'Solar', intro: 'Counts 4-year cycles from the first Olympic Games in 776 BCE, the framework of Greek historians.', body: 'Linear year count from 776 BCE. Year 1 = 776 BCE, year 5 = Olympiad 2, year 1. Display shows \u201cOlympiad N, year K\u201d.', months: 'Twelve months with Julian names and lengths, January\u2013December.' },
    hebrew: { name: 'Hebrew Calendar', type: 'Lunisolar', intro: 'The Hebrew (Jewish) lunisolar calendar for religious observances and official use in Israel. Epoch: 3761 BCE.', body: 'A 19-year Metonic cycle with 7 leap years adding Adar II. Year lengths vary 353\u2013385 days due to postponement rules (dechiyot).', months: 'Twelve or thirteen months: Tishrei (30), Cheshvan (29/30), Kislev (29/30), Tevet (29), Shevat (30), Adar/Adar I (29/30), [Adar II (29)], Nisan (30), Iyar (29), Sivan (30), Tammuz (29), Av (30), Elul (29).' },
    bp: { name: 'Before Present', type: 'Solar', intro: 'Time scale for archaeology and geology. "Present" = 1950 CE (radiocarbon dating convention).', body: 'Counts backward: BP 0 = 1950 CE, BP 1 = 1949 CE. Gregorian calendar mechanics.', months: 'Twelve months with Gregorian names and lengths.' },
    human: { name: 'Human Era', type: 'Solar', intro: 'The Holocene Era (HE) adds 10,000 years to the Gregorian calendar, epoch at the dawn of human civilization.', body: 'Proposed by Cesare Emiliani (1993). Year 12,024 HE = 2024 CE. No negative years for recorded history.', months: 'Twelve months with Gregorian names and lengths.' },

    methIntro: 'kalkal is a zero-dependency, client-side date converter built entirely with arithmetic algorithms. All conversions are deterministic, reproducible, and independently verifiable.',
    methJDN: {
      title: 'Julian Day Number as Universal Pivot',
      body: 'All date conversions in kalkal pass through the Julian Day Number (JDN) \u2014 a continuous count of days since the beginning of the Julian Period on 1 January 4713 BCE (Julian proleptic calendar). Each calendar system implements two functions: one to convert a date into a JDN, and one to convert a JDN back into a date in that calendar. To convert from calendar A to calendar B, we compute A \u2192 JDN \u2192 B. This approach avoids the combinatorial explosion of writing direct conversion functions between every pair of calendars.',
      note: 'The Julian Day Number is a tool of astronomical chronology unrelated to the Julian calendar, despite the shared name. It was introduced by Joseph Justus Scaliger in 1583.'
    },
    methArchitecture: {
      title: 'Architecture and Construction',
      body: 'kalkal runs entirely in the browser with zero external dependencies and no build step. The computational engine is a single JavaScript module (Cal) exposing toJD() and fromJD() functions for each of the 20+ supported calendar systems. A separate registry maps each calendar to its Cal functions, handling UI concerns like variant selection (e.g. the 4 tabular Hijri variants) independently from the algorithms. Internationalization covers 4 languages (EN, PL, AR, EO) with full RTL support for Arabic.',
      body2: 'All algorithms are purely arithmetic \u2014 no astronomical calculations, no external API calls, no lookup tables of observed data. This makes every conversion reproducible: the same input always produces the same output regardless of platform, locale, or network state.'
    },
    methAlgorithms: {
      title: 'Algorithm Sources',
      body: 'Gregorian and Julian conversions follow the algorithms in Meeus (1998). The tabular Hijri calendar uses a 30-year cycle with 4 historical leap-year variants (IIc/W\u00fcstenfeld as default). The Solar Hijri uses the 2820-year arithmetic cycle from Birashk, refined by Borkowski. Coptic, Ethiopian, Egyptian, Yazdgerdi, and Armenian calendars use epoch-offset arithmetic from Reingold & Dershowitz (2018). The Hebrew calendar implements the full molad-based rules from the same source. Byzantine, Seleucid, Syriac, Rumi, AUC, Spanish Era, Olympiad, and Macedonian calendars are Julian-based with epoch offsets.',
      warning: 'The tabular Hijri calendar may differ by \u00b11\u20132 days from calendars based on lunar observation (used officially in Saudi Arabia and other countries). It is intended for historical research and approximate conversion, not for determining religious observance dates.'
    },
    methValidation: {
      title: 'Validation and Verification',
      body: 'Every calendar conversion is validated through three independent methods. First, round-trip testing: for each calendar, a date is converted to JDN and back, confirming that fromJD(toJD(date)) === date across hundreds of test cases spanning epochs, boundaries, and modern dates. Second, cross-verification against independent implementations: the Fourmilab algorithm (public domain), the browser\u2019s Intl.DateTimeFormat API, and Python\u2019s hijri-converter library. Third, spot-checking known historical dates (e.g. Battle of Badr = 17 Ramadan 2 AH = 13 March 624 CE Julian, Fall of Baghdad = 10 February 1258 CE) against published scholarly sources.',
      body2: 'Tests run in Node.js by loading the browser-targeted Cal module. No test framework is used \u2014 the verification scripts output pass/fail counts directly, making the test suite itself auditable with zero dependencies.'
    },
    methSources: {
      title: 'Sources and References',
      items: [
        ['Richards, E. G. ', 'Mapping Time: The Calendar and its History', '. Oxford University Press, 1998.'],
        ['Reingold, Edward M. & Dershowitz, Nachum. ', 'Calendrical Calculations: The Ultimate Edition', '. Cambridge University Press, 2018.'],
        ['Meeus, Jean. ', 'Astronomical Algorithms', '. 2nd ed. Willmann-Bell, 1998.'],
        ['Borkowski, K. M. "ELP2000-85 and the Dynamical Time \u2013 Universal Time relation." ', 'Astronomy and Astrophysics', ', 205 (1988), L8\u2013L10.'],
        ['de Blois, Fran\u00e7ois. "Ta\u02bfr\u012bkh" (chronology section) in ', 'Encyclopaedia of Islam', ', 2nd ed.'],
        ['Birashk, Ahmad. ', 'A Comparative Calendar of the Iranian, Muslim Lunar, and Christian Eras for Three Thousand Years', '. Mazda Publishers, 1993.']
      ]
    },
    methLinks: { title: 'Coverage and Similar Tools' }
  },

  pl: {
    nav: { converter: 'Konwerter', calendars: 'Kalendarze', methodology: 'Metodologia', dynasties: 'Dynastie' },
    calPageTitle: 'Systemy kalendarzowe',
    dynPageTitle: 'Dynastie',
    dynPageSubtitle: 'Tablice chronologiczne w\u0142adc\u00f3w islamskich i bliskowschodnich',
    calPageSubtitle: 'Opisy system\u00f3w kalendarzowych obs\u0142ugiwanych przez kalkal',
    methPageTitle: 'Metodologia',
    methPageSubtitle: 'Jak zbudowano kalkal, jak oblicza i jak jest weryfikowany',
    backToConverter: 'Powr\u00f3t do konwertera',
    formulaLabel: 'Formu\u0142a',

    gregorian: {
      name: 'Kalendarz gregoria\u0144ski',
      type: 'S\u0142oneczny',
      epoch: '1 stycznia 1 n.e.',
      intro: 'Kalendarz gregoria\u0144ski jest mi\u0119dzynarodowo przyj\u0119tym kalendarzem cywilnym, wprowadzonym przez papie\u017ca Grzegorza XIII 15 pa\u017adziernika 1582 roku jako reforma kalendarza julia\u0144skiego.',
      body: 'Reforma skorygowa\u0142a naros\u0142e przesuni\u0119cie oko\u0142o 10 dni od czasu Soboru Nicejskiego (325 n.e.) i udoskonali\u0142a regu\u0142\u0119 roku przest\u0119pnego. Rok jest przest\u0119pny, je\u015bli jest podzielny przez 4, chyba \u017ce jest r\u00f3wnie\u017c podzielny przez 100 \u2014 z wyj\u0105tkiem lat podzielnych przez 400. Daje to \u015bredni\u0105 d\u0142ugo\u015b\u0107 roku 365,2425 dnia.',
      adoption: 'Kraje katolickie przyj\u0119\u0142y reform\u0119 w 1582 roku, kraje protestanckie i prawos\u0142awne znacznie p\u00f3\u017aniej: Imperium Brytyjskie w 1752, Rosja w 1918, Grecja w 1923, Turcja w 1926.',
      months: 'Dwana\u015bcie miesi\u0119cy od 28 do 31 dni: stycze\u0144 (31), luty (28/29), marzec (31), kwiecie\u0144 (30), maj (31), czerwiec (30), lipiec (31), sierpie\u0144 (31), wrzesie\u0144 (30), pa\u017adziernik (31), listopad (30), grudzie\u0144 (31).'
    },
    julian: {
      name: 'Kalendarz julia\u0144ski',
      type: 'S\u0142oneczny',
      epoch: '1 stycznia 1 n.e. (proleptyczny)',
      intro: 'Kalendarz julia\u0144ski zosta\u0142 wprowadzony przez Juliusza Cezara w 46 r. p.n.e., obowi\u0105zuj\u0105c od 1 stycznia 45 r. p.n.e. By\u0142 dominuj\u0105cym kalendarzem w Europie i \u015bwiecie \u015br\u00f3dziemnomorskim przez ponad 1600 lat.',
      body: 'Ustanowi\u0142 prost\u0105 regu\u0142\u0119 roku przest\u0119pnego: ka\u017cdy rok podzielny przez 4 jest przest\u0119pny, co daje \u015bredni rok d\u0142ugo\u015bci 365,25 dnia. Jest to o oko\u0142o 11 minut d\u0142u\u017cej ni\u017c rok zwrotnikowy, co prowadzi do b\u0142\u0119du oko\u0142o 1 dnia na 128 lat.',
      adoption: 'Do XVI wieku kalendarz przesun\u0105\u0142 si\u0119 o oko\u0142o 10 dni od r\u00f3wnonocy astronomicznej. Kalendarz julia\u0144ski jest nadal u\u017cywany liturgicznie przez niekt\u00f3re ko\u015bcio\u0142y prawos\u0142awne (\u201estary styl\u201d).',
      months: 'Dwana\u015bcie miesi\u0119cy identycznych z gregoria\u0144skimi, r\u00f3\u017cni\u0105cych si\u0119 jedynie regu\u0142\u0105 roku przest\u0119pnego (co 4 lata, bez wyj\u0105tk\u00f3w).'
    },
    hijri: {
      name: 'Kalendarz hid\u017cry (islamski ksi\u0119\u017cycowy)',
      type: 'Ksi\u0119\u017cycowy',
      epoch: '1 muharram 1 AH = 16 lipca 622 n.e. (julia\u0144ski)',
      intro: 'Kalendarz hid\u017cry (at-taqw\u012bm al-hi\u01e7r\u012b) jest czysto ksi\u0119\u017cycowym kalendarzem 12 miesi\u0119cy, u\u017cywanym w ca\u0142ym \u015bwiecie islamu do cel\u00f3w religijnych. Jego epoka to hid\u017cra (emigracja) Proroka Muhammada z Mekki do Medyny.',
      body: 'Ka\u017cdy miesi\u0105c zaczyna si\u0119 zasadniczo od obserwacji nowego sierpa ksi\u0119\u017cyca. Miesi\u0105ce naprzemiennie maj\u0105 30 i 29 dni. Rok liczy oko\u0142o 354 dni (355 w latach przest\u0119pnych), b\u0119d\u0105c o ok. 11 dni kr\u00f3tszy od roku s\u0142onecznego. Kalendarz przechodzi przez pory roku w cyklu ok. 33 lat.',
      tabular: 'Wersja tabelaryczna (arytmetyczna) kalendarza hid\u017cry \u2014 u\u017cywana w kalkal \u2014 stosuje sta\u0142y cykl 30-letni, w kt\u00f3rym 11 lat jest przest\u0119pnych. Istniej\u0105 cztery g\u0142\u00f3wne warianty, r\u00f3\u017cni\u0105ce si\u0119 tym, kt\u00f3re lata cyklu s\u0105 przest\u0119pne.',
      variantsText: 'Domy\u015blnym wariantem jest W\u00fcstenfeld (IIc), standard historiograficzny szeroko przyj\u0119ty w zachodniej nauce. Wariant wschodni cywilny (IIa), u\u017cywany w Mashriku i w \u201ealgorytmie kuwejckim\u201d, r\u00f3\u017cni si\u0119 od niego jedn\u0105 pozycj\u0105 przest\u0119pn\u0105 (rok 18 zamiast 19). Wariant zachodni cywilny (IIIa), u\u017cywany historycznie w Maghrebie i al-Andalus, przesuwa trzy lata przest\u0119pne. Czwarty wariant przypisywany jest IX-wiecznemu astronomowi \u1e24abaszowi al-\u1e24\u0101sibowi (IVa).',
      months: 'Dwana\u015bcie miesi\u0119cy: muharram (30), safar (29), rab\u012b\u02bf al-awwal (30), rab\u012b\u02bf a\u1e6f-\u1e6f\u0101n\u012b (29), d\u017cum\u0101d\u0101 al-\u016bl\u0101 (30), d\u017cum\u0101d\u0101 al-\u0101\u1e2bira (29), rad\u017cab (30), sza\u02bfb\u0101n (29), ramad\u0101n (30), szaww\u0101l (29), \u1e0f\u016b al-qa\u02bfda (30), \u1e0f\u016b al-\u1e25id\u017cd\u017ca (29 lub 30).'
    },
    solarHijri: {
      name: 'Kalendarz s\u0142oneczny hid\u017cry (ira\u0144ski)',
      type: 'S\u0142oneczny',
      epoch: '1 farwardin 1 AP = 22 marca 622 n.e. (julia\u0144ski)',
      intro: 'Kalendarz s\u0142oneczny hid\u017cry jest oficjalnym kalendarzem Iranu i Afganistanu. Jest kalendarzem s\u0142onecznym, kt\u00f3rego epoka pokrywa si\u0119 z hid\u017cr\u0105, ale d\u0142ugo\u015b\u0107 roku pod\u0105\u017ca za rokiem zwrotnikowym.',
      body: 'Sze\u015b\u0107 pierwszych miesi\u0119cy ma 31 dni, pi\u0119\u0107 nast\u0119pnych \u2014 30 dni, a dwunasty miesi\u0105c (esfand) ma 29 dni w roku zwyk\u0142ym i 30 w przest\u0119pnym. Oficjalnie nowy rok (Nouruz) zaczyna si\u0119 w momencie astronomicznej r\u00f3wnonocy wiosennej obserwowanej z Teheranu.',
      arithmetic: 'Do cel\u00f3w obliczeniowych kalkal u\u017cywa aproksymacji arytmetycznej opartej na 2820-letnim cyklu (zawieraj\u0105cym dok\u0142adnie 1 029 983 dni), kt\u00f3ry \u015bci\u015ble odpowiada kalendarzowi astronomicznemu.',
      months: 'Dwana\u015bcie miesi\u0119cy: farwardin (31), ordibeheszt (31), chordad (31), tir (31), mordad (31), szahriwar (31), mehr (30), aban (30), azar (30), dej (30), bahman (30), esfand (29/30).'
    },
    coptic: {
      name: 'Kalendarz koptyjski',
      type: 'S\u0142oneczny',
      epoch: '1 tout 1 AM = 29 sierpnia 284 n.e. (julia\u0144ski)',
      intro: 'Kalendarz koptyjski (aleksandryjski) wywodzi si\u0119 ze staro\u017cytnego egipskiego kalendarza cywilnego, zreformowanego za Augusta o rok przest\u0119pny. Liczy lata od Ery M\u0119czennik\u00f3w (Anno Martyrum), pocz\u0105wszy od wst\u0105pienia na tron cesarza Dioklecjana.',
      body: 'Sk\u0142ada si\u0119 z 12 miesi\u0119cy po 30 dni i kr\u00f3tkiego 13. miesi\u0105ca (epagomenai) \u2014 5 dni w roku zwyk\u0142ym lub 6 w przest\u0119pnym. Rok przest\u0119pny wyst\u0119puje co 4 lata (rok mod 4 = 3).',
      usage: 'Kalendarz koptyjski jest u\u017cywany liturgicznie przez Koptyjski Ko\u015bci\u00f3\u0142 Prawos\u0142awny i do cel\u00f3w rolniczych w Egipcie.',
      months: 'Trzyna\u015bcie miesi\u0119cy: Tout, Paopi, Hathor, Koiak, Tobi, Meszir, Paremhat, Parmouti, Paszons, Paoni, Epip, Mesori (po 30 dni), Epagomenai (5 lub 6 dni).'
    },
    ethiopian: {
      name: 'Kalendarz etiopski',
      type: 'S\u0142oneczny',
      epoch: '1 m\u00e4sk\u00e4r\u00e4m 1 = 29 sierpnia 8 n.e. (julia\u0144ski)',
      intro: 'Kalendarz etiopski jest oficjalnym kalendarzem Etiopii. Nale\u017cy do tej samej rodziny aleksandryjskiej co kalendarz koptyjski, dziel\u0105c jego struktur\u0119 12 miesi\u0119cy po 30 dni plus 13. miesi\u0105c epagomenalny.',
      body: 'Epoka jest o ok. 7\u20138 lat p\u00f3\u017aniejsza ni\u017c kalendarz gregoria\u0144ski. Lata przest\u0119pne pod\u0105\u017caj\u0105 za t\u0105 sam\u0105 regu\u0142\u0105 co w kalendarzu koptyjskim. Nowy Rok etiopski (Enkutatash) przypada 11 wrze\u015bnia gregoria\u0144skiego.',
      usage: 'Etiopia jest jednym z nielicznych kraj\u00f3w u\u017cywaj\u0105cych kalendarza niegregoria\u0144skiego jako oficjalnego kalendarza cywilnego.',
      months: 'Trzyna\u015bcie miesi\u0119cy: M\u00e4sk\u00e4r\u00e4m, T\u0259q\u0259mt, H\u0259dar, Tah\u015ba\u015b, T\u0259r, J\u00e4katit, M\u00e4gabit, Mijazja, G\u0259nbot, S\u00e4ne, Hamle, N\u00e4hase (po 30 dni), Pagum\u00e4n (5 lub 6 dni).'
    },
    yazdgerdi: {
      name: 'Kalendarz Jezdegerda',
      type: 'S\u0142oneczny (w\u0119drowny)',
      epoch: '1 farwardin 1 YZ = 16 czerwca 632 n.e. (julia\u0144ski)',
      intro: 'Kalendarz Jezdegerda jest tradycyjnym zoroastryjskim kalendarzem Iranu, nazwanym od Jezdegerda III, ostatniego kr\u00f3la sasanidzkiego.',
      body: 'Sk\u0142ada si\u0119 z 12 miesi\u0119cy po 30 dni i 5 dni epagomenalnych (dni Gatha). Nie posiada mechanizmu roku przest\u0119pnego \u2014 rok ma zawsze dok\u0142adnie 365 dni. Jest to kalendarz \u201ew\u0119drowny\u201d: przesuwa si\u0119 wzgl\u0119dem p\u00f3r roku o oko\u0142o 1 dzie\u0144 na 4 lata.',
      usage: 'Kalendarz Jezdegerda by\u0142 u\u017cywany w Iranie obok kalendarza hid\u017cry we wczesnym okresie islamskim. Pozostaje istotny dla historyk\u00f3w badaj\u0105cych chronologi\u0119 sasanizk\u0105 i wczesnoislamsk\u0105.',
      months: 'Trzyna\u015bcie miesi\u0119cy: Farwardin, Ordibeheszt, Chordad, Tir, Mordad, Szahriwar, Mehr, Aban, Azar, Dej, Bahman, Esfand (po 30 dni), plus 5 dni epagomenalnych.'
    },
    armenian: {
      name: 'Kalendarz ormia\u0144ski',
      type: 'S\u0142oneczny (w\u0119drowny)',
      epoch: '1 navasard 1 = 11 lipca 552 n.e. (julia\u0144ski)',
      intro: 'Tradycyjny kalendarz ormia\u0144ski jest sta\u0142ym kalendarzem 365-dniowym o tej samej strukturze co kalendarze egipski i Jezdegerda.',
      body: 'Podobnie jak kalendarz Jezdegerda, sk\u0142ada si\u0119 z 12 miesi\u0119cy po 30 dni plus 5 dni epagomenalnych (Aweleac\u02bc), bez korekcji roku przest\u0119pnego. Jest wi\u0119c kalendarzem \u201ew\u0119drownym\u201d, przesuwaj\u0105cym si\u0119 przez pory roku.',
      usage: 'Kalendarz ormia\u0144ski by\u0142 u\u017cywany w Armenii i przez spo\u0142eczno\u015bci ormia\u0144skie. Zosta\u0142 w du\u017cej mierze zast\u0105piony kalendarzem gregoria\u0144skim, ale pozostaje wa\u017cny dla chronologii historycznej.',
      months: 'Trzyna\u015bcie miesi\u0119cy: Navasard, Hori, Sahmi, Tre, K\u2019aloc\u02bc, Arac\u02bc, Mehekan, Areg, Ahekan, Mareri, Margac\u02bc, Hrotic\u02bc (po 30 dni), Aweleac\u02bc (5 dni).'
    },
    egyptian: { name: 'Kalendarz egipski', type: 'S\u0142oneczny (w\u0119drowny)', intro: 'Staro\u017cytny egipski kalendarz cywilny, jeden z najstarszych znanych. Era Nabonassara (747 p.n.e.).', body: '12 \u00d7 30 dni + 5 dodatkowych, bez roku przest\u0119pnego. Zawsze 365 dni \u2014 kalendarz w\u0119drowny.', months: 'Trzyna\u015bcie miesi\u0119cy: Thoth, Phaophi, Athyr, Choiak, Tybi, Mechir, Phamenoth, Pharmuthi, Pachons, Payni, Epiphi, Mesore (po 30 dni), Epagomenai (5 dni).' },
    byzantine: { name: 'Kalendarz bizanty\u0144ski', type: 'S\u0142oneczny', intro: 'Kalendarze Anno Mundi licz\u0105ce od stworzenia \u015bwiata. Trzy warianty: Konstantynopolitanski (5509 p.n.e., od wrze\u015bnia), Aleksandryjski (5493 p.n.e., od marca) i Chronicon Paschale (5509 p.n.e., od marca).', body: 'Mechanika julia\u0144ska z przesuni\u0119ciem ery. Wariant konstantynopolita\u0144ski by\u0142 oficjalnym kalendarzem Cesarstwa Bizanty\u0144skiego. Aleksandryjski u\u017cywany przez Ko\u015bci\u00f3\u0142 Aleksandrii. Indykcja (cykl 15-letni) wy\u015bwietlana przy datach.', months: 'Konstantynopolita\u0144ski: od wrze\u015bnia. Aleksandryjski i Chronicon Paschale: od marca.' },
    seleucid: { name: 'Kalendarz Seleucyd\u00f3w', type: 'S\u0142oneczny', intro: 'Era Seleucyd\u00f3w (Anno Graecorum) od 312 r. p.n.e. Najszerzej u\u017cywana era we wschodnim \u015br\u00f3dziemnomorzu.', body: 'Mechanika julia\u0144ska z pocz\u0105tkiem roku 1 pa\u017adziernika.', months: 'Dwana\u015bcie miesi\u0119cy od pa\u017adziernika.' },
    syriac: { name: 'Kalendarz syryjski', type: 'S\u0142oneczny', intro: 'Era Seleucyd\u00f3w z syryjskimi nazwami miesi\u0119cy i rokiem stycze\u0144\u2013grudzie\u0144.', body: 'Kalendarz julia\u0144ski z przesuni\u0119ciem ery o 311 lat. Nazwy miesi\u0119cy z kalendarza babilo\u0144skiego.', months: 'Dwana\u015bcie miesi\u0119cy: K\u0101n\u016bn II, \u0160b\u0101\u1e6d, \u0100\u1e0f\u0101r, N\u012bs\u0101n, Ayy\u0101r, \u1e24z\u012br\u0101n, Tamm\u016bz, \u0100b, Ayl\u016bl, Ti\u0161r\u012bn I, Ti\u0161r\u012bn II, K\u0101n\u016bn I.' },
    macedonian: { name: 'Kalendarz macedo\u0144ski', type: 'S\u0142oneczny', intro: 'Kalendarz syro-macedo\u0144ski z macedo\u0144skimi nazwami miesi\u0119cy, era Seleucyd\u00f3w, pocz\u0105tek w pa\u017adzierniku.', body: 'W formie ustalonej z epoki rzymskiej ka\u017cdy miesi\u0105c odpowiada miesi\u0105cowi julia\u0144skiemu.', months: 'Dwana\u015bcie miesi\u0119cy od pa\u017adziernika: Dios, Apellaios, Audynaios, Peritios, Dystros, Xanthikos, Artemisios, Daisios, Panemos, Loos, Gorpiaios, Hyperberetaios.' },
    rumi: { name: 'Kalendarz r\u016bm\u012b', type: 'S\u0142oneczny', intro: 'Kalendarz fiskalny i cywilny Imperium Osma\u0144skiego, oparty na julia\u0144skim z przesuni\u0119ciem ery hid\u017cry.', body: 'Po reformie lat 1840.: stycze\u0144\u2013grudzie\u0144, rok = rok julia\u0144ski \u2212 584. Zniesiony przez Turcj\u0119 w 1926.', months: 'Dwana\u015bcie miesi\u0119cy julia\u0144skich, stycze\u0144\u2013grudzie\u0144.' },
    auc: { name: 'Ab Urbe Condita', type: 'S\u0142oneczny', intro: 'Liczy od za\u0142o\u017cenia Rzymu w 753 r. p.n.e. (rachuba Warrona).', body: 'Kalendarz julia\u0144ski z przesuni\u0119ciem ery: rok 1 AUC = 753 p.n.e.', months: 'Dwana\u015bcie miesi\u0119cy julia\u0144skich, stycze\u0144\u2013grudzie\u0144.' },
    spanish: { name: 'Era hiszpa\u0144ska', type: 'S\u0142oneczny', intro: 'Era Hispanica od 38 r. p.n.e. Standard na P\u00f3\u0142wyspie Iberyjskim przez ponad tysi\u0105c lat.', body: 'Kalendarz julia\u0144ski z przesuni\u0119ciem ery o 38 lat. Aragonia porzuci\u0142a j\u0105 w 1350, Kastylia w 1383, Portugalia w 1422.', months: 'Dwana\u015bcie miesi\u0119cy julia\u0144skich, stycze\u0144\u2013grudzie\u0144.' },
    antiochene: { name: 'Era antioche\u0144ska', type: 'S\u0142oneczny', intro: 'Era cezaria\u0144ska Antiochii od 49 r. p.n.e. (bitwa pod Farsalos).', body: 'Kalendarz julia\u0144ski z pocz\u0105tkiem roku w pa\u017adzierniku i przesuni\u0119ciem ery o 49 lat. Zast\u0105pi\u0142a er\u0119 seleucydzk\u0105 w lokalnym u\u017cyciu antioche\u0144skim.', months: 'Dwana\u015bcie miesi\u0119cy od pa\u017adziernika.' },
    olympiad: { name: 'Kalendarz olimpijski', type: 'S\u0142oneczny', intro: 'Czteroletnie cykle od pierwszych igrzysk olimpijskich w 776 r. p.n.e.', body: 'Liniowa numeracja lat od 776 p.n.e. Wy\u015bwietlany jako \u201eOlimpiada N, rok K\u201d.', months: 'Dwana\u015bcie miesi\u0119cy julia\u0144skich, stycze\u0144\u2013grudzie\u0144.' },
    hebrew: { name: 'Kalendarz hebrajski', type: 'Ksi\u0119\u017cycowo-s\u0142oneczny', intro: 'Kalendarz \u017cydowski (lunisolarny) do cel\u00f3w religijnych i u\u017cytku urz\u0119dowego w Izraelu. Epoka: 3761 p.n.e.', body: 'Cykl 19-letni (metoniki) z 7 latami przest\u0119pnymi dodaj\u0105cymi Adar II. D\u0142ugo\u015b\u0107 roku 353\u2013385 dni.', months: 'Dwana\u015bcie lub trzyna\u015bcie miesi\u0119cy: Tiszri (30), Cheszwan (29/30), Kislew (29/30), Tewet (29), Szwat (30), Adar/Adar I (29/30), [Adar II (29)], Nisan (30), Ijar (29), Siwan (30), Tamuz (29), Aw (30), Elul (29).' },
    bp: { name: 'Przed tera\u017aniejszo\u015bci\u0105', type: 'S\u0142oneczny', intro: 'Skala czasu w archeologii i geologii. \u201eTera\u017aniejszo\u015b\u0107\u201d = 1950 n.e.', body: 'Liczy wstecz: BP 0 = 1950 n.e., BP 1 = 1949 n.e. Mechanika gregoria\u0144ska.', months: 'Dwana\u015bcie miesi\u0119cy gregoria\u0144skich.' },
    human: { name: 'Era ludzka', type: 'S\u0142oneczny', intro: 'Era holoce\u0144ska (HE) dodaje 10 000 lat do kalendarza gregoria\u0144skiego.', body: 'Zaproponowana przez Cesare Emilianiego (1993). Rok 12 024 HE = 2024 n.e. Bez lat ujemnych.', months: 'Dwana\u015bcie miesi\u0119cy gregoria\u0144skich.' },

    methIntro: 'kalkal to konwerter dat dzia\u0142aj\u0105cy w przegl\u0105darce, bez zale\u017cno\u015bci, oparty wy\u0142\u0105cznie na algorytmach arytmetycznych. Wszystkie konwersje s\u0105 deterministyczne, powtarzalne i niezale\u017cnie weryfikowalne.',
    methJDN: {
      title: 'Julia\u0144ski Dzie\u0144 Numer jako uniwersalny pivot',
      body: 'Wszystkie konwersje dat w kalkal przechodz\u0105 przez Julia\u0144ski Dzie\u0144 Numer (JDN) \u2014 ci\u0105g\u0142e liczenie dni od pocz\u0105tku Okresu Julia\u0144skiego, 1 stycznia 4713 r. p.n.e. Ka\u017cdy system kalendarzowy implementuje dwie funkcje: konwersj\u0119 daty na JDN i konwersj\u0119 JDN na dat\u0119. Aby przeliczy\u0107 z kalendarza A na B, obliczamy A \u2192 JDN \u2192 B.',
      note: 'Julia\u0144ski Dzie\u0144 Numer jest narz\u0119dziem chronologii astronomicznej, niezwi\u0105zanym z kalendarzem julia\u0144skim mimo wsp\u00f3lnej nazwy. Zosta\u0142 wprowadzony przez Josepha Justusa Scaligera w 1583 roku.'
    },
    methArchitecture: {
      title: 'Architektura i budowa',
      body: 'kalkal dzia\u0142a ca\u0142kowicie w przegl\u0105darce, bez zale\u017cno\u015bci zewn\u0119trznych i bez kroku budowania. Silnik obliczeniowy to pojedynczy modu\u0142 JavaScript (Cal) udost\u0119pniaj\u0105cy funkcje toJD() i fromJD() dla ka\u017cdego z ponad 20 obs\u0142ugiwanych system\u00f3w kalendarzowych. Osobny rejestr mapuje ka\u017cdy kalendarz na jego funkcje Cal. Internacjonalizacja obejmuje 4 j\u0119zyki (EN, PL, AR, EO) z pe\u0142n\u0105 obs\u0142ug\u0105 RTL dla arabskiego.',
      body2: 'Wszystkie algorytmy s\u0105 czysto arytmetyczne \u2014 bez oblicze\u0144 astronomicznych, bez wywo\u0142a\u0144 API, bez tabel obserwacyjnych. Ka\u017cda konwersja jest reprodukowalna: to samo wej\u015bcie zawsze daje to samo wyj\u015bcie, niezale\u017cnie od platformy, lokalizacji czy stanu sieci.'
    },
    methAlgorithms: {
      title: '\u0179r\u00f3d\u0142a algorytm\u00f3w',
      body: 'Konwersje gregoria\u0144skie i julia\u0144skie oparte na algorytmach Meeusa (1998). Tabelaryczny kalendarz hid\u017cry u\u017cywa cyklu 30-letniego z 4 wariantami lat przest\u0119pnych (domy\u015blny IIc/W\u00fcstenfeld). S\u0142oneczny hid\u017cry u\u017cywa 2820-letniego cyklu arytmetycznego Birashka, udoskonalonego przez Borkowskiego. Kalendarze koptyjski, etiopski, egipski, jezdegerda i orme\u0144ski u\u017cywaj\u0105 arytmetyki z przesuni\u0119ciem epoki wg Reingolda i Dershowitza (2018). Kalendarz hebrajski implementuje pe\u0142ne regu\u0142y molad z tego samego \u017ar\u00f3d\u0142a. Kalendarze bizantyjski, seleucki, syryjski, rumi, AUC, era hiszpa\u0144ska, olimpiady i macedo\u0144ski s\u0105 oparte na julia\u0144skim z przesuni\u0119ciem epoki.',
      warning: 'Kalendarz tabelaryczny mo\u017ce r\u00f3\u017cni\u0107 si\u0119 o \u00b11\u20132 dni od kalendarzy opartych na obserwacji ksi\u0119\u017cyca. Jest przeznaczony do bada\u0144 historycznych, nie do wyznaczania dat obrz\u0119d\u00f3w religijnych.'
    },
    methValidation: {
      title: 'Walidacja i weryfikacja',
      body: 'Ka\u017cda konwersja jest walidowana trzema niezale\u017cnymi metodami. Po pierwsze, testy obustronno\u015bci (round-trip): data jest konwertowana na JDN i z powrotem, potwierdzaj\u0105c \u017ce fromJD(toJD(data)) === data dla setek przypadk\u00f3w testowych. Po drugie, weryfikacja krzy\u017cowa z niezale\u017cnymi implementacjami: algorytmem Fourmilab (domena publiczna), API Intl.DateTimeFormat przegl\u0105darki oraz bibliotek\u0105 Python hijri-converter. Po trzecie, sprawdzanie znanych dat historycznych (np. bitwa pod Badr = 17 ramadan 2 AH = 13 marca 624 n.e.) ze \u017ar\u00f3d\u0142ami naukowymi.',
      body2: 'Testy uruchamiane s\u0105 w Node.js, \u0142aduj\u0105c modu\u0142 Cal przeznaczony dla przegl\u0105darki. Nie u\u017cywa si\u0119 \u017cadnego frameworka testowego \u2014 skrypty weryfikacyjne wypisuj\u0105 wyniki bezpo\u015brednio, co czyni sam zestaw test\u00f3w audytowalnym bez zale\u017cno\u015bci.'
    },
    methSources: {
      title: '\u0179r\u00f3d\u0142a i bibliografia',
      items: [
        ['Richards, E. G. ', 'Mapping Time: The Calendar and its History', '. Oxford University Press, 1998.'],
        ['Reingold, Edward M. & Dershowitz, Nachum. ', 'Calendrical Calculations: The Ultimate Edition', '. Cambridge University Press, 2018.'],
        ['Meeus, Jean. ', 'Astronomical Algorithms', '. 2nd ed. Willmann-Bell, 1998.'],
        ['Borkowski, K. M. \u201eELP2000-85 and the Dynamical Time \u2013 Universal Time relation.\u201d ', 'Astronomy and Astrophysics', ', 205 (1988), L8\u2013L10.'],
        ['de Blois, Fran\u00e7ois. \u201eTa\u02bfr\u012bkh\u201d (sekcja chronologii) w ', 'Encyclopaedia of Islam', ', 2nd ed.'],
        ['Birashk, Ahmad. ', 'A Comparative Calendar of the Iranian, Muslim Lunar, and Christian Eras for Three Thousand Years', '. Mazda Publishers, 1993.']
      ]
    },
    methLinks: { title: 'Pokrycie i podobne narz\u0119dzia' }
  },

  ar: {
    nav: { converter: '\u0627\u0644\u0645\u062d\u0648\u0651\u0644', calendars: '\u0627\u0644\u062a\u0642\u0627\u0648\u064a\u0645', methodology: '\u0627\u0644\u0645\u0646\u0647\u062c\u064a\u0629', dynasties: '\u0627\u0644\u0623\u0633\u0631 \u0627\u0644\u062d\u0627\u0643\u0645\u0629' },
    calPageTitle: '\u0623\u0646\u0638\u0645\u0629 \u0627\u0644\u062a\u0642\u0627\u0648\u064a\u0645',
    dynPageTitle: '\u0627\u0644\u0623\u0633\u0631 \u0627\u0644\u062d\u0627\u0643\u0645\u0629',
    dynPageSubtitle: '\u062c\u062f\u0627\u0648\u0644 \u0632\u0645\u0646\u064a\u0629 \u0644\u0644\u062d\u0643\u0651\u0627\u0645 \u0627\u0644\u0625\u0633\u0644\u0627\u0645\u064a\u064a\u0646 \u0648\u0627\u0644\u0634\u0631\u0642 \u0623\u0648\u0633\u0637\u064a\u064a\u0646',
    calPageSubtitle: '\u0648\u0635\u0641 \u0623\u0646\u0638\u0645\u0629 \u0627\u0644\u062a\u0642\u0627\u0648\u064a\u0645 \u0627\u0644\u0645\u062f\u0639\u0648\u0645\u0629 \u0641\u064a kalkal',
    methPageTitle: '\u0627\u0644\u0645\u0646\u0647\u062c\u064a\u0629',
    methPageSubtitle: '\u0643\u064a\u0641 \u0628\u064f\u0646\u064a kalkal\u060c \u0643\u064a\u0641 \u064a\u062d\u0633\u0628\u060c \u0648\u0643\u064a\u0641 \u064a\u064f\u062a\u062d\u0642\u0642 \u0645\u0646\u0647',
    backToConverter: '\u0627\u0644\u0639\u0648\u062f\u0629 \u0625\u0644\u0649 \u0627\u0644\u0645\u062d\u0648\u0651\u0644',
    formulaLabel: '\u0627\u0644\u0635\u064a\u063a\u0629',
    gregorian: { name: '\u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u063a\u0631\u064a\u063a\u0648\u0631\u064a', type: '\u0634\u0645\u0633\u064a', epoch: '\u0661 \u064a\u0646\u0627\u064a\u0631 \u0661 \u0645', intro: '\u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u0645\u062f\u0646\u064a \u0627\u0644\u0645\u0642\u0628\u0648\u0644 \u062f\u0648\u0644\u064a\u064b\u0627\u060c \u0623\u062f\u062e\u0644\u0647 \u0627\u0644\u0628\u0627\u0628\u0627 \u063a\u0631\u064a\u063a\u0648\u0631\u064a\u0648\u0633 \u0627\u0644\u062b\u0627\u0644\u062b \u0639\u0634\u0631 \u0639\u0627\u0645 \u0661\u0665\u0668\u0662.', body: '\u0635\u062d\u0651\u062d \u0627\u0646\u062d\u0631\u0627\u0641 \u0661\u0660 \u0623\u064a\u0627\u0645. \u0633\u0646\u0629 \u0643\u0628\u064a\u0633\u0629 \u0625\u0630\u0627 \u0642\u064f\u0633\u0645\u062a \u0639\u0644\u0649 \u0664\u060c \u0625\u0644\u0627 \u0627\u0644\u0645\u0626\u0627\u062a \u0645\u0627 \u0644\u0645 \u062a\u064f\u0642\u0633\u0645 \u0639\u0644\u0649 \u0664\u0660\u0660. \u0645\u062a\u0648\u0633\u0637 \u0663\u0666\u0665\u066b\u0662\u0664\u0662\u0665 \u064a\u0648\u0645.', adoption: '\u0627\u0639\u062a\u0645\u062f\u062a\u0647 \u0627\u0644\u062f\u0648\u0644 \u0627\u0644\u0643\u0627\u062b\u0648\u0644\u064a\u0643\u064a\u0629 \u0639\u0627\u0645 \u0661\u0665\u0668\u0662 \u0648\u062a\u0628\u0639\u062a\u0647\u0627 \u0627\u0644\u062f\u0648\u0644 \u0627\u0644\u0623\u062e\u0631\u0649 \u062a\u062f\u0631\u064a\u062c\u064a\u064b\u0627.', months: '\u0661\u0662 \u0634\u0647\u0631\u064b\u0627 \u0645\u0646 \u0662\u0668\u2013\u0663\u0661 \u064a\u0648\u0645\u064b\u0627.' },
    julian: { name: '\u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u064a\u0648\u0644\u064a\u0627\u0646\u064a', type: '\u0634\u0645\u0633\u064a', epoch: '\u0661 \u064a\u0646\u0627\u064a\u0631 \u0661 \u0645 (\u0627\u0633\u062a\u0628\u0627\u0642\u064a)', intro: '\u0623\u062f\u062e\u0644\u0647 \u064a\u0648\u0644\u064a\u0648\u0633 \u0642\u064a\u0635\u0631 \u0639\u0627\u0645 \u0664\u0666 \u0642.\u0645.\u060c \u0633\u0627\u0626\u062f \u0641\u064a \u0623\u0648\u0631\u0648\u0628\u0627 \u0644\u0623\u0643\u062b\u0631 \u0645\u0646 \u0661\u0666\u0660\u0660 \u0639\u0627\u0645.', body: '\u0643\u0644 \u0633\u0646\u0629 \u062a\u064f\u0642\u0633\u0645 \u0639\u0644\u0649 \u0664 \u0643\u0628\u064a\u0633\u0629. \u0645\u062a\u0648\u0633\u0637 \u0663\u0666\u0665\u066b\u0662\u0665 \u064a\u0648\u0645.', adoption: '\u0644\u0627 \u064a\u0632\u0627\u0644 \u0645\u0633\u062a\u062e\u062f\u0645\u064b\u0627 \u0644\u064a\u062a\u0648\u0631\u062c\u064a\u064b\u0627 \u0641\u064a \u0628\u0639\u0636 \u0627\u0644\u0643\u0646\u0627\u0626\u0633 \u0627\u0644\u0623\u0631\u062b\u0648\u0630\u0643\u0633\u064a\u0629.', months: '\u0661\u0662 \u0634\u0647\u0631\u064b\u0627 \u0643\u0627\u0644\u063a\u0631\u064a\u063a\u0648\u0631\u064a \u0628\u0642\u0627\u0639\u062f\u0629 \u0643\u0628\u064a\u0633\u0629 \u0623\u0628\u0633\u0637.' },
    hijri: { name: '\u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u0647\u062c\u0631\u064a (\u0627\u0644\u0642\u0645\u0631\u064a)', type: '\u0642\u0645\u0631\u064a', epoch: '\u0661 \u0645\u062d\u0631\u0645 \u0661 \u0647\u0640 = \u0661\u0666 \u064a\u0648\u0644\u064a\u0648 \u0666\u0662\u0662 \u0645', intro: '\u062a\u0642\u0648\u064a\u0645 \u0642\u0645\u0631\u064a \u0628\u062d\u062a \u0645\u0646 \u0661\u0662 \u0634\u0647\u0631\u064b\u0627 \u0644\u0644\u0634\u0639\u0627\u0626\u0631 \u0627\u0644\u062f\u064a\u0646\u064a\u0629. \u062d\u0642\u0628\u062a\u0647 \u0647\u062c\u0631\u0629 \u0627\u0644\u0646\u0628\u064a \ufdf2.', body: '\u064a\u0628\u062f\u0623 \u0643\u0644 \u0634\u0647\u0631 \u0628\u0631\u0624\u064a\u0629 \u0627\u0644\u0647\u0644\u0627\u0644. \u062a\u062a\u0646\u0627\u0648\u0628 \u0627\u0644\u0634\u0647\u0648\u0631 \u0628\u064a\u0646 \u0663\u0660 \u0648\u0662\u0669 \u064a\u0648\u0645\u064b\u0627. \u0627\u0644\u0633\u0646\u0629 \u0663\u0665\u0664 \u064a\u0648\u0645\u064b\u0627 \u062a\u0642\u0631\u064a\u0628\u064b\u0627.', tabular: '\u064a\u0633\u062a\u062e\u062f\u0645 kalkal \u0627\u0644\u0646\u0633\u062e\u0629 \u0627\u0644\u062c\u062f\u0648\u0644\u064a\u0629 \u0628\u062f\u0648\u0631\u0629 \u0663\u0660 \u0633\u0646\u0629 \u0641\u064a\u0647\u0627 \u0661\u0661 \u0643\u0628\u064a\u0633\u0629. \u0623\u0631\u0628\u0639\u0629 \u0645\u062a\u063a\u064a\u0631\u0627\u062a.',
      variantsText: '\u0627\u0644\u0627\u0641\u062a\u0631\u0627\u0636\u064a \u0641\u0648\u0633\u062a\u0646\u0641\u0644\u062f (IIc)\u060c \u0627\u0644\u0645\u0639\u064a\u0627\u0631 \u0627\u0644\u062a\u0627\u0631\u064a\u062e\u064a. \u0627\u0644\u0634\u0631\u0642\u064a \u0627\u0644\u0645\u062f\u0646\u064a (IIa) \u064a\u062e\u062a\u0644\u0641 \u0628\u0633\u0646\u0629 \u0643\u0628\u064a\u0633\u0629 \u0648\u0627\u062d\u062f\u0629 (\u0661\u0668 \u0628\u062f\u0644 \u0661\u0669). \u0627\u0644\u063a\u0631\u0628\u064a \u0627\u0644\u0645\u062f\u0646\u064a (IIIa) \u064a\u0646\u0642\u0644 \u062b\u0644\u0627\u062b \u0633\u0646\u0648\u0627\u062a. \u0627\u0644\u0631\u0627\u0628\u0639 \u0645\u0646\u0633\u0648\u0628 \u0625\u0644\u0649 \u062d\u0628\u0634 \u0627\u0644\u062d\u0627\u0633\u0628 (IVa).', months: '\u0661\u0662 \u0634\u0647\u0631\u064b\u0627: \u0627\u0644\u0645\u062d\u0631\u0645\u060c \u0635\u0641\u0631\u060c \u0631\u0628\u064a\u0639 \u0627\u0644\u0623\u0648\u0644\u060c \u0631\u0628\u064a\u0639 \u0627\u0644\u062b\u0627\u0646\u064a\u060c \u062c\u0645\u0627\u062f\u0649 \u0627\u0644\u0623\u0648\u0644\u0649\u060c \u062c\u0645\u0627\u062f\u0649 \u0627\u0644\u0622\u062e\u0631\u0629\u060c \u0631\u062c\u0628\u060c \u0634\u0639\u0628\u0627\u0646\u060c \u0631\u0645\u0636\u0627\u0646\u060c \u0634\u0648\u0627\u0644\u060c \u0630\u0648 \u0627\u0644\u0642\u0639\u062f\u0629\u060c \u0630\u0648 \u0627\u0644\u062d\u062c\u0629.' },
    solarHijri: { name: '\u0627\u0644\u0647\u062c\u0631\u064a \u0627\u0644\u0634\u0645\u0633\u064a (\u0627\u0644\u0625\u064a\u0631\u0627\u0646\u064a)', type: '\u0634\u0645\u0633\u064a', epoch: '\u0661 \u0641\u0631\u0648\u0631\u062f\u064a\u0646 \u0661 \u0647\u0640.\u0634', intro: '\u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u0631\u0633\u0645\u064a \u0644\u0625\u064a\u0631\u0627\u0646 \u0648\u0623\u0641\u063a\u0627\u0646\u0633\u062a\u0627\u0646. \u064a\u0628\u062f\u0623 \u0639\u0646\u062f \u0627\u0644\u0627\u0639\u062a\u062f\u0627\u0644 \u0627\u0644\u0631\u0628\u064a\u0639\u064a (\u0646\u0648\u0631\u0648\u0632).', body: '\u0627\u0644\u0634\u0647\u0648\u0631 \u0661\u2013\u0666: \u0663\u0661 \u064a\u0648\u0645\u064b\u0627\u060c \u0667\u2013\u0661\u0661: \u0663\u0660 \u064a\u0648\u0645\u064b\u0627\u060c \u0661\u0662: \u0662\u0669/\u0663\u0660 \u064a\u0648\u0645\u064b\u0627.', arithmetic: '\u064a\u0633\u062a\u062e\u062f\u0645 \u062f\u0648\u0631\u0629 \u0662\u0668\u0662\u0660 \u0633\u0646\u0629 \u062d\u0633\u0627\u0628\u064a\u064b\u0627.', months: '\u0661\u0662 \u0634\u0647\u0631\u064b\u0627: \u0641\u0631\u0648\u0631\u062f\u064a\u0646\u060c \u0623\u0631\u062f\u064a\u0628\u0647\u0634\u062a\u060c \u062e\u0631\u062f\u0627\u062f\u060c \u062a\u064a\u0631\u060c \u0645\u0631\u062f\u0627\u062f\u060c \u0634\u0647\u0631\u064a\u0648\u0631\u060c \u0645\u0647\u0631\u060c \u0622\u0628\u0627\u0646\u060c \u0622\u0630\u0631\u060c \u062f\u064a\u060c \u0628\u0647\u0645\u0646\u060c \u0627\u0633\u0641\u0646\u062f.' },
    coptic: { name: '\u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u0642\u0628\u0637\u064a', type: '\u0634\u0645\u0633\u064a', epoch: '\u0661 \u062a\u0648\u062a \u0661 = \u0662\u0669 \u0623\u063a\u0633\u0637\u0633 \u0662\u0668\u0664 \u0645', intro: '\u0645\u0646 \u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u0645\u0635\u0631\u064a \u0627\u0644\u0642\u062f\u064a\u0645. \u0661\u0662\u00d7\u0663\u0660 + \u0634\u0647\u0631 \u0661\u0663 \u0642\u0635\u064a\u0631.', body: '\u0643\u0628\u064a\u0633\u0629 \u0643\u0644 \u0664 \u0633\u0646\u0648\u0627\u062a (\u0633\u0646\u0629 mod \u0664 = \u0663).', usage: '\u064a\u0633\u062a\u062e\u062f\u0645\u0647 \u0627\u0644\u0643\u0646\u064a\u0633\u0629 \u0627\u0644\u0642\u0628\u0637\u064a\u0629 \u0648\u0644\u0644\u0632\u0631\u0627\u0639\u0629 \u0641\u064a \u0645\u0635\u0631.', months: '\u0661\u0663 \u0634\u0647\u0631\u064b\u0627: \u062a\u0648\u062a\u060c \u0628\u0627\u0628\u0647\u060c \u0647\u0627\u062a\u0648\u0631\u060c \u0643\u064a\u0647\u0643\u060c \u0637\u0648\u0628\u0629\u060c \u0623\u0645\u0634\u064a\u0631\u060c \u0628\u0631\u0645\u0647\u0627\u062a\u060c \u0628\u0631\u0645\u0648\u062f\u0629\u060c \u0628\u0634\u0646\u0633\u060c \u0628\u0624\u0646\u0629\u060c \u0623\u0628\u064a\u0628\u060c \u0645\u0633\u0631\u0649 (\u0663\u0660)\u060c \u0627\u0644\u0646\u0633\u064a\u0621 (\u0665/\u0666).' },
    ethiopian: { name: '\u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u0625\u062b\u064a\u0648\u0628\u064a', type: '\u0634\u0645\u0633\u064a', epoch: '\u0661 \u0645\u0633\u0643\u0631\u0645 \u0661 = \u0662\u0669 \u0623\u063a\u0633\u0637\u0633 \u0668 \u0645', intro: '\u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u0631\u0633\u0645\u064a \u0644\u0625\u062b\u064a\u0648\u0628\u064a\u0627\u060c \u0645\u0646 \u0627\u0644\u0639\u0627\u0626\u0644\u0629 \u0627\u0644\u0625\u0633\u0643\u0646\u062f\u0631\u064a\u0629.', body: '\u0645\u062a\u0623\u062e\u0631 \u0628\u0646\u062d\u0648 \u0667\u2013\u0668 \u0633\u0646\u0648\u0627\u062a. \u0631\u0623\u0633 \u0627\u0644\u0633\u0646\u0629 \u0661\u0661 \u0633\u0628\u062a\u0645\u0628\u0631.', usage: '\u0645\u0646 \u0627\u0644\u062f\u0648\u0644 \u0627\u0644\u0642\u0644\u064a\u0644\u0629 \u0628\u062a\u0642\u0648\u064a\u0645 \u0631\u0633\u0645\u064a \u063a\u064a\u0631 \u063a\u0631\u064a\u063a\u0648\u0631\u064a.', months: '\u0661\u0663 \u0634\u0647\u0631\u064b\u0627 \u0643\u0627\u0644\u0642\u0628\u0637\u064a \u0628\u0623\u0633\u0645\u0627\u0621 \u0645\u062e\u062a\u0644\u0641\u0629.' },
    yazdgerdi: { name: '\u062a\u0642\u0648\u064a\u0645 \u064a\u0632\u062f\u062c\u0631\u062f', type: '\u0634\u0645\u0633\u064a (\u0645\u062a\u062c\u0648\u0651\u0644)', epoch: '\u0661 \u0641\u0631\u0648\u0631\u062f\u064a\u0646 \u0661 = \u0661\u0666 \u064a\u0648\u0646\u064a\u0648 \u0666\u0663\u0662 \u0645', intro: '\u062a\u0642\u0648\u064a\u0645 \u0632\u0631\u0627\u062f\u0634\u062a\u064a\u060c \u0645\u0633\u0645\u0649 \u0628\u0627\u0633\u0645 \u064a\u0632\u062f\u062c\u0631\u062f \u0627\u0644\u062b\u0627\u0644\u062b.', body: '\u0661\u0662\u00d7\u0663\u0660 + \u0665 \u0623\u064a\u0627\u0645\u060c \u0628\u062f\u0648\u0646 \u0643\u0628\u064a\u0633\u0629. \u0645\u062a\u062c\u0648\u0651\u0644.', usage: '\u0645\u0647\u0645 \u0644\u0644\u062a\u0623\u0631\u064a\u062e \u0627\u0644\u0633\u0627\u0633\u0627\u0646\u064a.', months: '\u0643\u0627\u0644\u0625\u064a\u0631\u0627\u0646\u064a + \u0665 \u0623\u064a\u0627\u0645.' },
    armenian: { name: '\u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u0623\u0631\u0645\u0646\u064a', type: '\u0634\u0645\u0633\u064a (\u0645\u062a\u062c\u0648\u0651\u0644)', epoch: '\u0661 \u0646\u0627\u0641\u0627\u0633\u0627\u0631\u062f \u0661 = \u0661\u0661 \u064a\u0648\u0644\u064a\u0648 \u0665\u0665\u0662 \u0645', intro: '\u062a\u0642\u0648\u064a\u0645 \u0623\u0631\u0645\u0646\u064a \u062a\u0642\u0644\u064a\u062f\u064a \u0628\u0646\u0641\u0633 \u0628\u0646\u064a\u0629 \u0627\u0644\u0645\u0635\u0631\u064a.', body: '\u0661\u0662\u00d7\u0663\u0660 + \u0665 \u0623\u064a\u0627\u0645\u060c \u0628\u062f\u0648\u0646 \u0643\u0628\u064a\u0633\u0629.', usage: '\u0627\u0633\u062a\u064f\u0628\u062f\u0644 \u0628\u0627\u0644\u063a\u0631\u064a\u063a\u0648\u0631\u064a \u0644\u0643\u0646\u0647 \u0645\u0647\u0645 \u062a\u0627\u0631\u064a\u062e\u064a\u064b\u0627.', months: '\u0661\u0663 \u0634\u0647\u0631\u064b\u0627 \u0643\u0627\u0644\u064a\u0632\u062f\u062c\u0631\u062f\u064a.' },
    egyptian: { name: '\u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u0645\u0635\u0631\u064a', type: '\u0634\u0645\u0633\u064a (\u0645\u062a\u062c\u0648\u0651\u0644)', intro: '\u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u0645\u062f\u0646\u064a \u0627\u0644\u0645\u0635\u0631\u064a \u0627\u0644\u0642\u062f\u064a\u0645. \u062d\u0642\u0628\u0629 \u0646\u0628\u0648\u0646\u0627\u0635\u0631 (\u0667\u0664\u0667 \u0642.\u0645.).', body: '\u0661\u0662\u00d7\u0663\u0660 + \u0665 \u0623\u064a\u0627\u0645\u060c \u0628\u062f\u0648\u0646 \u0643\u0628\u064a\u0633\u0629. \u0645\u062a\u062c\u0648\u0651\u0644.', months: '\u0661\u0663 \u0634\u0647\u0631\u064b\u0627.' },
    byzantine: { name: '\u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u0628\u064a\u0632\u0646\u0637\u064a', type: '\u0634\u0645\u0633\u064a', intro: '\u062a\u0642\u0627\u0648\u064a\u0645 \u0635\u0646\u0639 \u0627\u0644\u0639\u0627\u0644\u0645. \u062b\u0644\u0627\u062b\u0629 \u0645\u062a\u063a\u064a\u0631\u0627\u062a: \u0627\u0644\u0642\u0633\u0637\u0646\u0637\u064a\u0646\u064a (\u0665\u0665\u0660\u0669 \u0642.\u0645.\u060c \u0633\u0628\u062a\u0645\u0628\u0631)\u060c \u0627\u0644\u0625\u0633\u0643\u0646\u062f\u0631\u064a (\u0665\u0664\u0669\u0663 \u0642.\u0645.\u060c \u0645\u0627\u0631\u0633)\u060c \u0648\u0643\u0631\u0648\u0646\u064a\u0643\u0648\u0646 \u0628\u0627\u0633\u0643\u0627\u0644\u064a (\u0665\u0665\u0660\u0669 \u0642.\u0645.\u060c \u0645\u0627\u0631\u0633).', body: '\u064a\u0648\u0644\u064a\u0627\u0646\u064a \u0628\u0625\u0632\u0627\u062d\u0629 \u062d\u0642\u0628\u0629. \u0627\u0644\u0625\u0646\u062f\u0643\u062a\u064a\u0648\u0646 (\u062f\u0648\u0631\u0629 \u0661\u0665 \u0633\u0646\u0629) \u064a\u0639\u0631\u0636 \u0645\u0639 \u0627\u0644\u062a\u0648\u0627\u0631\u064a\u062e.', months: '\u0627\u0644\u0642\u0633\u0637\u0646\u0637\u064a\u0646\u064a: \u0645\u0646 \u0633\u0628\u062a\u0645\u0628\u0631. \u0627\u0644\u0625\u0633\u0643\u0646\u062f\u0631\u064a \u0648\u0643\u0631\u0648\u0646\u064a\u0643\u0648\u0646: \u0645\u0646 \u0645\u0627\u0631\u0633.' },
    seleucid: { name: '\u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u0633\u0644\u0648\u0642\u064a', type: '\u0634\u0645\u0633\u064a', intro: '\u062d\u0642\u0628\u0629 \u0627\u0644\u064a\u0648\u0646\u0627\u0646 \u0645\u0646 \u0663\u0661\u0662 \u0642.\u0645. \u0627\u0644\u0623\u0643\u062b\u0631 \u0627\u0633\u062a\u062e\u062f\u0627\u0645\u064b\u0627 \u0641\u064a \u0627\u0644\u0634\u0631\u0642 \u0627\u0644\u0645\u062a\u0648\u0633\u0637.', body: '\u064a\u0648\u0644\u064a\u0627\u0646\u064a \u0628\u0628\u062f\u0627\u064a\u0629 \u0623\u0643\u062a\u0648\u0628\u0631.', months: '\u0661\u0662 \u0634\u0647\u0631\u064b\u0627 \u0645\u0646 \u0623\u0643\u062a\u0648\u0628\u0631.' },
    syriac: { name: '\u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u0633\u0631\u064a\u0627\u0646\u064a', type: '\u0634\u0645\u0633\u064a', intro: '\u062d\u0642\u0628\u0629 \u0627\u0644\u0633\u0644\u0648\u0642\u064a\u064a\u0646 \u0628\u0623\u0633\u0645\u0627\u0621 \u0633\u0631\u064a\u0627\u0646\u064a\u0629 \u0648\u0633\u0646\u0629 \u064a\u0646\u0627\u064a\u0631\u2013\u062f\u064a\u0633\u0645\u0628\u0631.', body: '\u064a\u0648\u0644\u064a\u0627\u0646\u064a \u0628\u0625\u0632\u0627\u062d\u0629 \u0663\u0661\u0661 \u0633\u0646\u0629. \u0623\u0633\u0645\u0627\u0621 \u0645\u0646 \u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u0628\u0627\u0628\u0644\u064a.', months: '\u0661\u0662 \u0634\u0647\u0631\u064b\u0627: \u0643\u0627\u0646\u0648\u0646 \u0627\u0644\u062b\u0627\u0646\u064a\u060c \u0634\u0628\u0627\u0637\u060c \u0622\u0630\u0627\u0631\u060c \u0646\u064a\u0633\u0627\u0646\u060c \u0623\u064a\u0627\u0631\u060c \u062d\u0632\u064a\u0631\u0627\u0646\u060c \u062a\u0645\u0648\u0632\u060c \u0622\u0628\u060c \u0623\u064a\u0644\u0648\u0644\u060c \u062a\u0634\u0631\u064a\u0646 \u0627\u0644\u0623\u0648\u0644\u060c \u062a\u0634\u0631\u064a\u0646 \u0627\u0644\u062b\u0627\u0646\u064a\u060c \u0643\u0627\u0646\u0648\u0646 \u0627\u0644\u0623\u0648\u0644.' },
    macedonian: { name: '\u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u0645\u0642\u062f\u0648\u0646\u064a', type: '\u0634\u0645\u0633\u064a', intro: '\u062a\u0642\u0648\u064a\u0645 \u0633\u0648\u0631\u064a-\u0645\u0642\u062f\u0648\u0646\u064a \u0628\u0623\u0633\u0645\u0627\u0621 \u0645\u0642\u062f\u0648\u0646\u064a\u0629 \u0648\u062d\u0642\u0628\u0629 \u0633\u0644\u0648\u0642\u064a\u0629.', body: '\u0646\u0641\u0633 \u0628\u0646\u064a\u0629 \u0627\u0644\u0633\u0644\u0648\u0642\u064a \u0628\u0623\u0633\u0645\u0627\u0621 \u0645\u0642\u062f\u0648\u0646\u064a\u0629.', months: '\u0661\u0662 \u0634\u0647\u0631\u064b\u0627 \u0645\u0646 \u0623\u0643\u062a\u0648\u0628\u0631.' },
    rumi: { name: '\u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u0631\u0648\u0645\u064a', type: '\u0634\u0645\u0633\u064a', intro: '\u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u0645\u0627\u0644\u064a \u0648\u0627\u0644\u0645\u062f\u0646\u064a \u0644\u0644\u062f\u0648\u0644\u0629 \u0627\u0644\u0639\u062b\u0645\u0627\u0646\u064a\u0629.', body: '\u064a\u0648\u0644\u064a\u0627\u0646\u064a \u0628\u0633\u0646\u0629 = \u0633\u0646\u0629 \u064a\u0648\u0644\u064a\u0627\u0646\u064a\u0629 \u2212 \u0665\u0668\u0664. \u0623\u0644\u063a\u062a\u0647 \u062a\u0631\u0643\u064a\u0627 \u0661\u0669\u0662\u0666.', months: '\u0661\u0662 \u0634\u0647\u0631\u064b\u0627 \u064a\u0648\u0644\u064a\u0627\u0646\u064a\u064b\u0627.' },
    auc: { name: '\u0645\u0646\u0630 \u062a\u0623\u0633\u064a\u0633 \u0631\u0648\u0645\u0627', type: '\u0634\u0645\u0633\u064a', intro: '\u064a\u0644\u064a \u0645\u0646 \u062a\u0623\u0633\u064a\u0633 \u0631\u0648\u0645\u0627 \u0667\u0665\u0663 \u0642.\u0645.', body: '\u064a\u0648\u0644\u064a\u0627\u0646\u064a \u0628\u0625\u0632\u0627\u062d\u0629 \u062d\u0642\u0628\u0629.', months: '\u0661\u0662 \u0634\u0647\u0631\u064b\u0627 \u064a\u0648\u0644\u064a\u0627\u0646\u064a\u064b\u0627.' },
    spanish: { name: '\u0627\u0644\u062d\u0642\u0628\u0629 \u0627\u0644\u0625\u0633\u0628\u0627\u0646\u064a\u0629', type: '\u0634\u0645\u0633\u064a', intro: '\u0645\u0646 \u0663\u0668 \u0642.\u0645. \u0645\u0639\u064a\u0627\u0631 \u0634\u0628\u0647 \u0627\u0644\u062c\u0632\u064a\u0631\u0629 \u0627\u0644\u0623\u064a\u0628\u064a\u0631\u064a\u0629.', body: '\u064a\u0648\u0644\u064a\u0627\u0646\u064a \u0628\u0625\u0632\u0627\u062d\u0629 \u0663\u0668 \u0633\u0646\u0629.', months: '\u0661\u0662 \u0634\u0647\u0631\u064b\u0627 \u064a\u0648\u0644\u064a\u0627\u0646\u064a\u064b\u0627.' },
    antiochene: { name: '\u0627\u0644\u062d\u0642\u0628\u0629 \u0627\u0644\u0623\u0646\u0637\u0627\u0643\u064a\u0629', type: '\u0634\u0645\u0633\u064a', intro: '\u062d\u0642\u0628\u0629 \u0642\u064a\u0635\u0631\u064a\u0629 \u0645\u0646 \u0664\u0669 \u0642.\u0645. (\u0645\u0639\u0631\u0643\u0629 \u0641\u0631\u0633\u0627\u0644\u0648\u0633).', body: '\u064a\u0648\u0644\u064a\u0627\u0646\u064a \u0628\u0628\u062f\u0627\u064a\u0629 \u0633\u0646\u0629 \u0641\u064a \u0623\u0643\u062a\u0648\u0628\u0631 \u0648\u0625\u0632\u0627\u062d\u0629 \u0664\u0669 \u0633\u0646\u0629. \u062d\u0644\u0651\u062a \u0645\u062d\u0644 \u0627\u0644\u062d\u0642\u0628\u0629 \u0627\u0644\u0633\u0644\u0648\u0642\u064a\u0629 \u0641\u064a \u0623\u0646\u0637\u0627\u0643\u064a\u0629.', months: '\u0661\u0662 \u0634\u0647\u0631\u064b\u0627 \u0645\u0646 \u0623\u0643\u062a\u0648\u0628\u0631.' },
    olympiad: { name: '\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u0623\u0648\u0644\u0645\u0628\u064a\u0627\u062f', type: '\u0634\u0645\u0633\u064a', intro: '\u062f\u0648\u0631\u0627\u062a \u0645\u0646 \u0664 \u0633\u0646\u0648\u0627\u062a \u0645\u0646 \u0623\u0648\u0644 \u0623\u0648\u0644\u0645\u0628\u064a\u0627\u062f \u0667\u0667\u0666 \u0642.\u0645.', body: '\u0639\u062f\u0651 \u062e\u0637\u064a \u0645\u0646 \u0667\u0667\u0666 \u0642.\u0645.', months: '\u0661\u0662 \u0634\u0647\u0631\u064b\u0627 \u064a\u0648\u0644\u064a\u0627\u0646\u064a\u064b\u0627.' },
    hebrew: { name: '\u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u0639\u0628\u0631\u064a', type: '\u0642\u0645\u0631\u064a-\u0634\u0645\u0633\u064a', intro: '\u062a\u0642\u0648\u064a\u0645 \u0642\u0645\u0631\u064a-\u0634\u0645\u0633\u064a \u0644\u0644\u0634\u0639\u0627\u0626\u0631 \u0627\u0644\u064a\u0647\u0648\u062f\u064a\u0629. \u062d\u0642\u0628\u0629: \u0663\u0667\u0666\u0661 \u0642.\u0645.', body: '\u062f\u0648\u0631\u0629 \u0661\u0669 \u0633\u0646\u0629 \u0645\u0639 \u0667 \u0643\u0628\u064a\u0633\u0629 \u062a\u0636\u064a\u0641 \u0623\u062f\u0627\u0631 \u0627\u0644\u062b\u0627\u0646\u064a. \u0663\u0665\u0663\u2013\u0663\u0668\u0665 \u064a\u0648\u0645\u064b\u0627.', months: '\u0661\u0662 \u0623\u0648 \u0661\u0663 \u0634\u0647\u0631\u064b\u0627.' },
    bp: { name: '\u0642\u0628\u0644 \u0627\u0644\u062d\u0627\u0636\u0631', type: '\u0634\u0645\u0633\u064a', intro: '\u0645\u0642\u064a\u0627\u0633 \u0632\u0645\u0646\u064a \u0644\u0644\u0622\u062b\u0627\u0631 \u0648\u0627\u0644\u062c\u064a\u0648\u0644\u0648\u062c\u064a\u0627. \u0627\u0644\u062d\u0627\u0636\u0631 = \u0661\u0669\u0665\u0660.', body: '\u064a\u0639\u062f\u0651 \u0639\u0643\u0633\u064a\u064b\u0627 \u0645\u0646 \u0661\u0669\u0665\u0660 \u0645.', months: '\u0661\u0662 \u0634\u0647\u0631\u064b\u0627 \u063a\u0631\u064a\u063a\u0648\u0631\u064a\u064b\u0627.' },
    human: { name: '\u0627\u0644\u062d\u0642\u0628\u0629 \u0627\u0644\u0628\u0634\u0631\u064a\u0629', type: '\u0634\u0645\u0633\u064a', intro: '\u062a\u0636\u064a\u0641 \u0661\u0660\u0660\u0660\u0660 \u0633\u0646\u0629 \u0644\u0644\u063a\u0631\u064a\u063a\u0648\u0631\u064a. \u062d\u0642\u0628\u0629 \u0628\u062f\u0627\u064a\u0629 \u0627\u0644\u062d\u0636\u0627\u0631\u0629.', body: '\u0627\u0642\u062a\u0631\u062d\u0647\u0627 Emiliani (\u0661\u0669\u0669\u0663). \u0661\u0662\u0660\u0662\u0664 = \u0662\u0660\u0662\u0664 \u0645.', months: '\u0661\u0662 \u0634\u0647\u0631\u064b\u0627 \u063a\u0631\u064a\u063a\u0648\u0631\u064a\u064b\u0627.' },
    methIntro: 'kalkal \u0645\u062d\u0648\u0651\u0644 \u062a\u0648\u0627\u0631\u064a\u062e \u064a\u0639\u0645\u0644 \u0641\u064a \u0627\u0644\u0645\u062a\u0635\u0641\u062d \u0628\u062f\u0648\u0646 \u0627\u0639\u062a\u0645\u0627\u062f\u064a\u0627\u062a\u060c \u0645\u0628\u0646\u064a \u0628\u0627\u0644\u0643\u0627\u0645\u0644 \u0639\u0644\u0649 \u062e\u0648\u0627\u0631\u0632\u0645\u064a\u0627\u062a \u062d\u0633\u0627\u0628\u064a\u0629. \u062c\u0645\u064a\u0639 \u0627\u0644\u062a\u062d\u0648\u064a\u0644\u0627\u062a \u062d\u062a\u0645\u064a\u0629 \u0648\u0642\u0627\u0628\u0644\u0629 \u0644\u0644\u062a\u0643\u0631\u0627\u0631 \u0648\u0627\u0644\u062a\u062d\u0642\u0642 \u0627\u0644\u0645\u0633\u062a\u0642\u0644.',
    methJDN: { title: '\u0627\u0644\u064a\u0648\u0645 \u0627\u0644\u064a\u0648\u0644\u064a\u0627\u0646\u064a \u0643\u0645\u062d\u0648\u0631', body: '\u062c\u0645\u064a\u0639 \u0627\u0644\u062a\u062d\u0648\u064a\u0644\u0627\u062a \u062a\u0645\u0631 \u0639\u0628\u0631 JDN \u2014 \u0639\u062f\u0651 \u0645\u062a\u0648\u0627\u0635\u0644 \u0644\u0644\u0623\u064a\u0627\u0645. \u0644\u0643\u0644 \u062a\u0642\u0648\u064a\u0645 \u062f\u0627\u0644\u062a\u0627\u0646: \u062a\u0627\u0631\u064a\u062e\u2192JDN \u0648JDN\u2192\u062a\u0627\u0631\u064a\u062e.', note: '\u0623\u062f\u0627\u0629 \u0641\u0644\u0643\u064a\u0629 \u0644\u0627 \u0639\u0644\u0627\u0642\u0629 \u0644\u0647\u0627 \u0628\u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u064a\u0648\u0644\u064a\u0627\u0646\u064a. \u0623\u062f\u062e\u0644\u0647 \u0633\u0643\u0627\u0644\u064a\u062c\u0631 \u0661\u0665\u0668\u0663.' },
    methArchitecture: { title: '\u0627\u0644\u0628\u0646\u064a\u0629 \u0648\u0627\u0644\u062a\u0635\u0645\u064a\u0645', body: '\u064a\u0639\u0645\u0644 kalkal \u0628\u0627\u0644\u0643\u0627\u0645\u0644 \u0641\u064a \u0627\u0644\u0645\u062a\u0635\u0641\u062d \u0628\u062f\u0648\u0646 \u0627\u0639\u062a\u0645\u0627\u062f\u064a\u0627\u062a \u062e\u0627\u0631\u062c\u064a\u0629. \u0627\u0644\u0645\u062d\u0631\u0643 \u0627\u0644\u062d\u0633\u0627\u0628\u064a \u0648\u062d\u062f\u0629 JavaScript \u0648\u0627\u062d\u062f\u0629 (Cal) \u062a\u0648\u0641\u0631 \u062f\u0648\u0627\u0644 toJD() \u0648fromJD() \u0644\u0643\u0644 \u0645\u0646 \u0623\u0643\u062b\u0631 \u0645\u0646 \u0662\u0660 \u0646\u0638\u0627\u0645 \u062a\u0642\u0648\u064a\u0645\u064a. \u062a\u062f\u0648\u064a\u0644 \u0628\u0664 \u0644\u063a\u0627\u062a (EN\u060c PL\u060c AR\u060c EO) \u0645\u0639 \u062f\u0639\u0645 \u0643\u0627\u0645\u0644 \u0644\u0640RTL.', body2: '\u062c\u0645\u064a\u0639 \u0627\u0644\u062e\u0648\u0627\u0631\u0632\u0645\u064a\u0627\u062a \u062d\u0633\u0627\u0628\u064a\u0629 \u0628\u062d\u062a\u0629 \u2014 \u0628\u062f\u0648\u0646 \u062d\u0633\u0627\u0628\u0627\u062a \u0641\u0644\u0643\u064a\u0629 \u0623\u0648 \u0627\u0633\u062a\u062f\u0639\u0627\u0621\u0627\u062a API \u0623\u0648 \u062c\u062f\u0627\u0648\u0644 \u0631\u0635\u062f\u064a\u0629. \u0643\u0644 \u062a\u062d\u0648\u064a\u0644 \u0642\u0627\u0628\u0644 \u0644\u0644\u062a\u0643\u0631\u0627\u0631: \u0627\u0644\u0645\u062f\u062e\u0644 \u0646\u0641\u0633\u0647 \u064a\u0639\u0637\u064a \u0627\u0644\u0646\u062a\u064a\u062c\u0629 \u0646\u0641\u0633\u0647\u0627 \u062f\u0627\u0626\u0645\u064b\u0627.' },
    methAlgorithms: { title: '\u0645\u0635\u0627\u062f\u0631 \u0627\u0644\u062e\u0648\u0627\u0631\u0632\u0645\u064a\u0627\u062a', body: '\u0627\u0644\u062a\u062d\u0648\u064a\u0644\u0627\u062a \u0627\u0644\u063a\u0631\u064a\u063a\u0648\u0631\u064a\u0629 \u0648\u0627\u0644\u064a\u0648\u0644\u064a\u0627\u0646\u064a\u0629 \u0645\u0646 Meeus (\u0661\u0669\u0669\u0668). \u0627\u0644\u0647\u062c\u0631\u064a \u0627\u0644\u062c\u062f\u0648\u0644\u064a \u0628\u062f\u0648\u0631\u0629 \u0663\u0660 \u0633\u0646\u0629 \u0645\u0639 \u0664 \u0645\u062a\u063a\u064a\u0631\u0627\u062a (IIc \u0627\u0641\u062a\u0631\u0627\u0636\u064a). \u0627\u0644\u0634\u0645\u0633\u064a \u0628\u062f\u0648\u0631\u0629 \u0662\u0668\u0662\u0660 \u0633\u0646\u0629 \u0645\u0646 Birashk \u0648Borkowski. \u0627\u0644\u0642\u0628\u0637\u064a \u0648\u0627\u0644\u0625\u062b\u064a\u0648\u0628\u064a \u0648\u0627\u0644\u0645\u0635\u0631\u064a \u0648\u0627\u0644\u064a\u0632\u062f\u062c\u0631\u062f\u064a \u0648\u0627\u0644\u0623\u0631\u0645\u0646\u064a \u0645\u0646 Reingold & Dershowitz (\u0662\u0660\u0661\u0668). \u0627\u0644\u0639\u0628\u0631\u064a \u0628\u0642\u0648\u0627\u0639\u062f \u0627\u0644\u0645\u0648\u0644\u062f \u0627\u0644\u0643\u0627\u0645\u0644\u0629. \u0627\u0644\u0628\u064a\u0632\u0646\u0637\u064a \u0648\u0627\u0644\u0633\u0644\u0648\u0642\u064a \u0648\u0627\u0644\u0633\u0631\u064a\u0627\u0646\u064a \u0648\u063a\u064a\u0631\u0647\u0627 \u064a\u0648\u0644\u064a\u0627\u0646\u064a\u0629 \u0628\u0625\u0632\u0627\u062d\u0629 \u062d\u0642\u0628\u0629.', warning: '\u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u062c\u062f\u0648\u0644\u064a \u0642\u062f \u064a\u062e\u062a\u0644\u0641 \u0628\u0640\u00b1\u0661\u2013\u0662 \u064a\u0648\u0645 \u0639\u0646 \u0627\u0644\u0631\u0635\u062f. \u0645\u062e\u0635\u0635 \u0644\u0644\u0628\u062d\u062b \u0627\u0644\u062a\u0627\u0631\u064a\u062e\u064a \u0644\u0627 \u0644\u062a\u062d\u062f\u064a\u062f \u0645\u0648\u0627\u0639\u064a\u062f \u0627\u0644\u0639\u0628\u0627\u062f\u0627\u062a.' },
    methValidation: { title: '\u0627\u0644\u062a\u062d\u0642\u0642 \u0648\u0627\u0644\u062a\u0648\u062b\u064a\u0642', body: '\u0643\u0644 \u062a\u062d\u0648\u064a\u0644 \u064a\u064f\u062a\u062d\u0642\u0642 \u0645\u0646\u0647 \u0628\u062b\u0644\u0627\u062b \u0637\u0631\u0642 \u0645\u0633\u062a\u0642\u0644\u0629. \u0623\u0648\u0644\u064b\u0627\u060c \u0627\u062e\u062a\u0628\u0627\u0631 \u0627\u0644\u0631\u062d\u0644\u0629 \u0630\u0647\u0627\u0628\u064b\u0627 \u0648\u0625\u064a\u0627\u0628\u064b\u0627: \u062a\u062d\u0648\u064a\u0644 \u0627\u0644\u062a\u0627\u0631\u064a\u062e \u0625\u0644\u0649 JDN \u0648\u0627\u0644\u0639\u0648\u062f\u0629 \u0644\u0644\u062a\u0623\u0643\u062f \u0645\u0646 \u062a\u0637\u0627\u0628\u0642 \u0627\u0644\u0646\u062a\u064a\u062c\u0629. \u062b\u0627\u0646\u064a\u064b\u0627\u060c \u0645\u0642\u0627\u0631\u0646\u0629 \u0645\u0639 \u062a\u0637\u0628\u064a\u0642\u0627\u062a \u0645\u0633\u062a\u0642\u0644\u0629: \u062e\u0648\u0627\u0631\u0632\u0645\u064a\u0629 Fourmilab \u0648API Intl.DateTimeFormat \u0648\u0645\u0643\u062a\u0628\u0629 Python hijri-converter. \u062b\u0627\u0644\u062b\u064b\u0627\u060c \u0645\u0631\u0627\u062c\u0639\u0629 \u062a\u0648\u0627\u0631\u064a\u062e \u062a\u0627\u0631\u064a\u062e\u064a\u0629 \u0645\u0639\u0631\u0648\u0641\u0629 (\u0645\u062b\u0644 \u063a\u0632\u0648\u0629 \u0628\u062f\u0631 = \u0661\u0667 \u0631\u0645\u0636\u0627\u0646 \u0662 \u0647\u0640 = \u0661\u0663 \u0622\u0630\u0627\u0631 \u0666\u0662\u0664 \u0645).', body2: '\u062a\u064f\u0646\u0641\u0630 \u0627\u0644\u0627\u062e\u062a\u0628\u0627\u0631\u0627\u062a \u0641\u064a Node.js \u0628\u062a\u062d\u0645\u064a\u0644 \u0648\u062d\u062f\u0629 Cal. \u0644\u0627 \u064a\u064f\u0633\u062a\u062e\u062f\u0645 \u0623\u064a \u0625\u0637\u0627\u0631 \u0627\u062e\u062a\u0628\u0627\u0631 \u2014 \u0627\u0644\u0646\u0635\u0648\u0635 \u062a\u0639\u0637\u064a \u0646\u062a\u0627\u0626\u062c \u0645\u0628\u0627\u0634\u0631\u0629 \u0628\u062f\u0648\u0646 \u0627\u0639\u062a\u0645\u0627\u062f\u064a\u0627\u062a.' },
    methSources: { title: '\u0627\u0644\u0645\u0635\u0627\u062f\u0631', items: [
      ['Richards, E. G. ', 'Mapping Time', '. Oxford, 1998.'],
      ['Reingold & Dershowitz. ', 'Calendrical Calculations', '. Cambridge, 2018.'],
      ['Meeus, Jean. ', 'Astronomical Algorithms', '. Willmann-Bell, 1998.'],
      ['Borkowski, K. M. ', 'Astronomy and Astrophysics', ', 205 (1988).'],
      ['de Blois, F. "Ta\u02bfr\u012bkh" in ', 'Encyclopaedia of Islam', '.'],
      ['Birashk, Ahmad. ', 'A Comparative Calendar...', ' Mazda, 1993.']
    ] },
    methLinks: { title: '\u0627\u0644\u062a\u063a\u0637\u064a\u0629 \u0648\u0623\u062f\u0648\u0627\u062a \u0645\u0634\u0627\u0628\u0647\u0629' }
  },

  eo: {
    nav: { converter: 'Konvertilo', calendars: 'Kalendaroj', methodology: 'Metodologio', dynasties: 'Dinastioj' },
    calPageTitle: 'Kalendarsistemoj',
    dynPageTitle: 'Dinastioj',
    dynPageSubtitle: 'Kronologiaj tabeloj de islamaj kaj proksim-orientaj regantoj',
    calPageSubtitle: 'Priskriboj de la kalendarsistemoj subtenataj de kalkal',
    methPageTitle: 'Metodologio',
    methPageSubtitle: 'Kiel kalkal estas konstruita, kiel \u011di kalkulas, kaj kiel \u011di estas validata',
    backToConverter: 'Reen al konvertilo',
    formulaLabel: 'Formulo',
    gregorian: { name: 'Gregoria kalendaro', type: 'Suna', epoch: '1-a de januaro 1 p.K.', intro: 'La gregoria kalendaro estas la internaci\u0109 akceptita civila kalendaro, enkondukita de papo Gregorio la 13-a je la 15-a de oktobro 1582.', body: 'Korektis derivo\u0135on de \u0109irkau 10 tagoj. Superjaro se dividebla per 4, krom se ankau per 100, escepte per 400. Mezjarlongo 365,2425 tagoj.', adoption: 'Katolikaj landoj en 1582; Brita Imperio 1752; Rusio 1918; Grekio 1923; Turkio 1926.', months: '12 monatoj de 28\u201331 tagoj.' },
    julian: { name: 'Julia kalendaro', type: 'Suna', epoch: '1-a de januaro 1 p.K. (proleptika)', intro: 'Enkondukita de Julio Cezaro en 46 a.K. Domina en Europo dum pli ol 1600 jaroj.', body: '\u0108iu jaro dividebla per 4 estas superjaro. Mezjaro 365,25 tagoj.', adoption: 'Ankorau liturgie uzata de kelkaj ortodoksaj eklezioj.', months: '12 monatoj kiel la gregoriaj.' },
    hijri: { name: 'Hi\u011dra kalendaro (luna)', type: 'Luna', epoch: '1-a de mu\u1e25arram 1 = 16-a de julio 622 p.K.', intro: 'Pure luna kalendaro de 12 monatoj por religiaj okazoj. Epoko: Hi\u011dro de Profeto Mu\u1e25ammad.', body: 'Monatoj alternas 30/29 tagojn. Jaro \u0109irkau 354 tagoj.', tabular: 'Tabela versio uzas 30-jaran ciklon kun 11 superjaroj.',
      variantsText: 'Defa\u016dlta varianto estas W\u00fcstenfeld (IIc), historiografia normo. Orienta civila (IIa) malsamas per unu superjaro (18 anstata\u016d 19). Okcidenta civila (IIIa) \u015dan\u011das tri superjarojn. Kvara varianto atribuita al \u1e24aba\u015d al-\u1e24\u0101sib (IVa).', months: '12 monatoj: mu\u1e25arram (30), \u1e63afar (29)...' },
    solarHijri: { name: 'Suna hi\u011dra (irana)', type: 'Suna', epoch: '1-a de farvardin 1 AP', intro: 'Oficiala kalendaro de Irano kaj Afganio.', body: 'Monatoj 1\u20136: 31 tagoj; 7\u201311: 30; 12: 29/30.', arithmetic: '2820-jara ciklo kun 1.029.983 tagoj.', months: '12 monatoj.' },
    coptic: { name: 'Kopta kalendaro', type: 'Suna', epoch: '1-a de Thout 1 AM = 29 augusto 284', intro: 'De la antikva egipta kalendaro. 12\u00d730 + 13-a monato.', body: 'Superjaro \u0109iu 4 jaroj (mod 4 = 3).', usage: 'Kopta Ortodoksa Eklezio kaj agrikulturo en Egiptio.', months: '13 monatoj.' },
    ethiopian: { name: 'Etiopa kalendaro', type: 'Suna', epoch: '1-a de M\u00e4sk\u00e4r\u00e4m 1 = 29 augusto 8', intro: 'Oficiala kalendaro de Etiopio, aleksandria familio.', body: '\u0108irkau 7\u20138 jarojn malantau gregoria. Novjaro 11 septembro.', usage: 'Unu el malmultaj landoj kun ne-gregoria oficiala kalendaro.', months: '13 monatoj kiel kopta.' },
    yazdgerdi: { name: 'Jazdgerda kalendaro', type: 'Suna (vaganta)', epoch: '1-a de farvardin 1 YZ = 16 junio 632', intro: 'Zoroastra kalendaro de Irano.', body: '12\u00d730 + 5 tagoj, sen superjaroj. Vaganta.', usage: 'Grava por sasanida kaj fru-islama kronologio.', months: '13 monatoj.' },
    armenian: { name: 'Armena kalendaro', type: 'Suna (vaganta)', epoch: '1-a de Navasard 1 = 11 julio 552', intro: 'Tradicia armena 365-taga kalendaro.', body: '12\u00d730 + 5 tagoj, sen superjaroj.', usage: 'Grandparte anstata\u016digita de gregoria.', months: '13 monatoj.' },
    egyptian: { name: 'Egipta kalendaro', type: 'Suna (vaganta)', intro: 'Antikva egipta civila kalendaro. Epoko de Nabonasaro (747 a.K.).', body: '12\u00d730 + 5 tagoj, sen superjaroj. \u0108iam 365 tagoj.', months: '13 monatoj.' },
    byzantine: { name: 'Bizanca kalendaro', type: 'Suna', intro: 'Anno Mundi kalendaroj. Tri variantoj: Konstantinopola (5509 a.K., septembre), Aleksandria (5493 a.K., marte), Chronicon Paschale (5509 a.K., marte).', body: 'Julia mekaniko kun epok-\u015dovo. Indiktio (15-jara ciklo) montrata kun datoj.', months: 'Konstantinopola: de septembro. Aleksandria kaj Chronicon Paschale: de marto.' },
    seleucid: { name: 'Seleu\u0109ida kalendaro', type: 'Suna', intro: 'Epoko de la Grekoj de 312 a.K.', body: 'Julia mekaniko kun oktobra jarenkonduko.', months: '12 monatoj de oktobro.' },
    syriac: { name: 'Siria kalendaro', type: 'Suna', intro: 'Seleu\u0109ida epoko kun siriaj monatnomoj, januaro\u2013decembro.', body: 'Julia kun epok-\u015dovo de 311 jaroj.', months: '12 monatoj kun siriaj nomoj.' },
    macedonian: { name: 'Makedona kalendaro', type: 'Suna', intro: 'Sirio-makedona kalendaro kun makedonaj monatnomoj.', body: 'Sama strukturo kiel seleu\u0109ida kun makedonaj nomoj.', months: '12 monatoj de oktobro kun makedonaj nomoj.' },
    rumi: { name: 'R\u016bm\u012b-kalendaro', type: 'Suna', intro: 'Fiska kaj civila kalendaro de la Osmana Imperio.', body: 'Julia kun jaro = julia jaro \u2212 584. Forigita de Turkio en 1926.', months: '12 juliaj monatoj.' },
    auc: { name: 'Ab Urbe Condita', type: 'Suna', intro: 'De la fondo de Romo en 753 a.K.', body: 'Julia kun epok-\u015dovo.', months: '12 juliaj monatoj.' },
    spanish: { name: 'Hispana epoko', type: 'Suna', intro: 'Era Hispanica de 38 a.K. Normo en Iberio dum pli ol mil jaroj.', body: 'Julia kun epok-\u015dovo de 38 jaroj.', months: '12 juliaj monatoj.' },
    antiochene: { name: 'Antio\u0125ia epoko', type: 'Suna', intro: 'Cezara epoko de Antio\u0125io de 49 a.K. (Batalo de Farsalo).', body: 'Julia kun oktobra jarenkonduko kaj epok-\u015dovo de 49 jaroj. Anstata\u016digis la seleu\u0109idan epokon en Antio\u0125io.', months: '12 monatoj de oktobro.' },
    olympiad: { name: 'Olimpiada kalendaro', type: 'Suna', intro: '4-jaraj cikloj de la unuaj Olimpikoj en 776 a.K.', body: 'Linia jarkalkulo de 776 a.K.', months: '12 juliaj monatoj.' },
    hebrew: { name: 'Hebrea kalendaro', type: 'Lunsunsistemo', intro: 'Hebrea lunsuna kalendaro por religiaj okazoj. Epoko: 3761 a.K.', body: '19-jara ciklo kun 7 superjaroj aldonantaj Adar II. 353\u2013385 tagoj.', months: '12 a\u016d 13 monatoj.' },
    bp: { name: 'Anta\u016d la nuno', type: 'Suna', intro: 'Temskalo por arkeologio. Nuno = 1950.', body: 'Kalkulas malanta\u016den de 1950.', months: '12 gregoriaj monatoj.' },
    human: { name: 'Homa epoko', type: 'Suna', intro: 'Holocena epoko: +10000 jaroj al gregoria.', body: 'De Emiliani (1993). 12024 HE = 2024 p.K.', months: '12 gregoriaj monatoj.' },
    methIntro: 'kalkal estas sendependa, retumil-bazita datkonvertilo konstruita tute per aritmetikaj algoritmoj. \u0108iuj konvertoj estas determinismaj, ripeteblaj kaj sendepende kontroleblaj.',
    methJDN: { title: 'Julia Tagnombro kiel pivoto', body: '\u0108iuj konvertoj pasas tra JDN \u2014 kontinua kalkulo de tagoj ekde la komenco de la julia periodo. \u0108iu kalendaro havas du funkciojn: dato\u2192JDN kaj JDN\u2192dato. Por konverti de A al B: A\u2192JDN\u2192B.', note: 'Astronomihistoria ilo, ne rilata al julia kalendaro. Scaliger, 1583.' },
    methArchitecture: { title: 'Arkitekturo kaj konstruo', body: 'kalkal funkcias tute en la retumilo sen eksteraj dependecoj a\u016d konstrupa\u015do. La komputila motoro estas ununura JavaScript-modulo (Cal) kun toJD() kaj fromJD() por \u0109iu el pli ol 20 kalendarsistemoj. Internaciigo en 4 lingvoj (EN, PL, AR, EO) kun plena RTL-subteno.', body2: '\u0108iuj algoritmoj estas pure aritmetikaj \u2014 sen astronomiaj kalkuloj, sen API-vokoj, sen observdatumtabeloj. \u0108iu konverto estas reproduktebla: sama enigo \u0109iam donas saman eligon.' },
    methAlgorithms: { title: 'Algoritmaj fontoj', body: 'Gregoriaj kaj juliaj konvertoj la\u016d Meeus (1998). Tabela hi\u011dra uzas 30-jaran ciklon kun 4 variantoj (IIc defa\u016dlta). Suna hi\u011dra uzas la 2820-jaran ciklon de Birashk/Borkowski. Kopta, etiopa, egipta, jazdgerda kaj armena la\u016d Reingold & Dershowitz (2018). Hebrea implementas plenajn molad-regulojn. Bizanca, seleu\u0109ida, siria, rumi, AUC, hispana, olimpiada kaj makedona estas juliaj kun epok-\u015dovo.', warning: 'La tabela hi\u011dra kalendaro povas diferenci \u00b11\u20132 tagojn de observ-bazitaj kalendaroj. \u011ci estas por historia esploro, ne por religiaj datoj.' },
    methValidation: { title: 'Validado kaj kontrolo', body: '\u0108iu konverto estas validata per tri sendependaj metodoj. Unue, rondira testo: dato konvertita al JDN kaj reen, konfirmante ke fromJD(toJD(dato)) === dato por centoj da testkazoj. Due, kruckontrolo kun sendependaj implementoj: Fourmilab-algoritmo, Intl.DateTimeFormat de la retumilo, kaj Python hijri-converter. Trie, komparo de konataj historiaj datoj (ekz. Batalo de Badr = 17 ramadan 2 AH = 13 marto 624) kun akademiaj fontoj.', body2: 'Testoj rulas en Node.js \u015dar\u011dante la retumilon-celitan Cal-modulon. Neniu testokadro uzata \u2014 la skriptoj eligas rezultojn rekte, farante la testaron mem a\u016dditeblaj sen dependecoj.' },
    methSources: { title: 'Fontoj', items: [
      ['Richards, E. G. ', 'Mapping Time', '. Oxford, 1998.'],
      ['Reingold & Dershowitz. ', 'Calendrical Calculations', '. Cambridge, 2018.'],
      ['Meeus, Jean. ', 'Astronomical Algorithms', '. Willmann-Bell, 1998.'],
      ['Borkowski, K. M. ', 'Astronomy and Astrophysics', ', 205 (1988).'],
      ['de Blois. "Ta\u02bfr\u012bkh" en ', 'Encyclopaedia of Islam', '.'],
      ['Birashk, Ahmad. ', 'A Comparative Calendar...', ' Mazda, 1993.']
    ] },
    methLinks: { title: 'Kovrado kaj similaj iloj' }
  }
};

// Season data for the seasonal months grid
// season: 0=spring, 1=summer, 2=autumn, 3=winter
// For each calendar: [monthNamesKey, daysArray, seasonsArray|null]
// null seasons = wandering/lunar calendar (no fixed season mapping)
const CAL_MONTH_META = {
  gregorian:   ['gregorianMonths',   '31,28/29,31,30,31,30,31,31,30,31,30,31',     '3,3,0,0,0,1,1,1,2,2,2,3'],
  julian:      ['gregorianMonths',   '31,28/29,31,30,31,30,31,31,30,31,30,31',     '3,3,0,0,0,1,1,1,2,2,2,3'],
  hijri:       ['hijriMonths',       '30,29,30,29,30,29,30,29,30,29,30,29/30',     null],
  solarHijri:  ['persianMonths',     '31,31,31,31,31,31,30,30,30,30,30,29/30',     '0,0,0,1,1,1,2,2,2,3,3,3'],
  coptic:      ['copticMonths',      '30,30,30,30,30,30,30,30,30,30,30,30,5/6',    '2,2,2,3,3,3,0,0,0,1,1,1,1'],
  ethiopian:   ['ethiopianMonths',   '30,30,30,30,30,30,30,30,30,30,30,30,5/6',    '2,2,2,3,3,3,0,0,0,1,1,1,1'],
  yazdgerdi:   ['persianMonths',     '30,30,30,30,30,30,30,30,30,30,30,30,5',      null],
  armenian:    ['armenianMonths',    '30,30,30,30,30,30,30,30,30,30,30,30,5',       null],
  egyptian:    ['egyptianMonths',    '30,30,30,30,30,30,30,30,30,30,30,30,5',       null],
  byzantine:   ['byzantineMonths',   '30,31,30,31,31,28/29,31,30,31,30,31,31',     '2,2,2,3,3,3,0,0,0,1,1,1'],
  alexandrian: ['alexandrianMonths', '31,30,31,30,31,31,30,31,30,31,31,28/29',     '0,0,0,1,1,1,2,2,2,3,3,3'],
  seleucid:    ['seleucidMonths',    '31,30,31,31,28/29,31,30,31,30,31,31,30',     '2,2,3,3,3,0,0,0,1,1,1,2'],
  syriac:      ['syriacMonths',      '31,28/29,31,30,31,30,31,31,30,31,30,31',     '3,3,0,0,0,1,1,1,2,2,2,3'],
  macedonian:  ['macedonianMonths',  '31,30,31,31,28/29,31,30,31,30,31,31,30',     '2,2,3,3,3,0,0,0,1,1,1,2'],
  rumi:        ['gregorianMonths',   '31,28/29,31,30,31,30,31,31,30,31,30,31',     '3,3,0,0,0,1,1,1,2,2,2,3'],
  auc:         ['gregorianMonths',   '31,28/29,31,30,31,30,31,31,30,31,30,31',     '3,3,0,0,0,1,1,1,2,2,2,3'],
  spanish:     ['gregorianMonths',   '31,28/29,31,30,31,30,31,31,30,31,30,31',     '3,3,0,0,0,1,1,1,2,2,2,3'],
  antiochene:  ['seleucidMonths',   '31,30,31,31,28/29,31,30,31,30,31,31,30',     '2,2,3,3,3,0,0,0,1,1,1,2'],
  olympiad:    ['gregorianMonths',   '31,28/29,31,30,31,30,31,31,30,31,30,31',     '3,3,0,0,0,1,1,1,2,2,2,3'],
  hebrew:      ['hebrewMonths',      '30,29/30,29/30,29,30,29/30,29,30,29,30,29,30,29', '2,2,2,3,3,3,0,0,0,0,1,1,1'],
  bp:          ['gregorianMonths',   '31,28/29,31,30,31,30,31,31,30,31,30,31',     '3,3,0,0,0,1,1,1,2,2,2,3'],
  human:       ['gregorianMonths',   '31,28/29,31,30,31,30,31,31,30,31,30,31',     '3,3,0,0,0,1,1,1,2,2,2,3']
};

// Season labels per language
const SEASON_LABELS = {
  en: ['Spring', 'Summer', 'Autumn', 'Winter'],
  pl: ['Wiosna', 'Lato', 'Jesie\u0144', 'Zima'],
  ar: ['\u0631\u0628\u064a\u0639', '\u0635\u064a\u0641', '\u062e\u0631\u064a\u0641', '\u0634\u062a\u0627\u0621'],
  eo: ['Printempo', 'Somero', 'A\u016dtuno', 'Vintro']
};

(() => {
  'use strict';

  const currentLang = localStorage.getItem('kalkal-lang') || 'en';

  function setPageLang(lang) {
    localStorage.setItem('kalkal-lang', lang);
    const t = PageI18N[lang];
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-nav]').forEach(a => {
      const key = a.dataset.nav;
      if (t.nav[key]) a.textContent = t.nav[key];
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    const titleEl = document.getElementById('page-title');
    const subtitleEl = document.getElementById('page-subtitle');
    if (titleEl) {
      const page = document.body.dataset.page;
      if (page === 'calendars') {
        titleEl.textContent = t.calPageTitle;
        subtitleEl.textContent = t.calPageSubtitle;
        document.title = 'kalkal \u2014 ' + t.calPageTitle;
      } else if (page === 'methodology') {
        titleEl.textContent = t.methPageTitle;
        subtitleEl.textContent = t.methPageSubtitle;
        document.title = 'kalkal \u2014 ' + t.methPageTitle;
      } else if (page === 'dynasties') {
        titleEl.textContent = t.dynPageTitle;
        subtitleEl.textContent = t.dynPageSubtitle;
        document.title = 'kalkal \u2014 ' + t.dynPageTitle;
      }
    }

    const calOrder = ['gregorian', 'julian', 'hijri', 'solarHijri', 'coptic', 'ethiopian', 'yazdgerdi', 'armenian', 'egyptian', 'byzantine', 'alexandrian', 'seleucid', 'syriac', 'macedonian', 'rumi', 'auc', 'spanish', 'olympiad', 'hebrew', 'bp', 'human'];
    calOrder.forEach(id => {
      const section = document.querySelector('[data-cal="' + id + '"]');
      if (!section || !t[id]) return;
      const c = t[id];
      const setT = function(sel, text) { var el = section.querySelector(sel); if (el && text) el.textContent = text; };
      setT('.cal-name', c.name);
      setT('.cal-type', c.type);
      setT('.cal-intro', c.intro);

      // Update TOC link text
      var tocLink = document.querySelector('[data-toc="' + id + '"]');
      if (tocLink) tocLink.textContent = c.name;
      setT('.cal-body', c.body);
      setT('.cal-adoption', c.adoption);
      setT('.cal-usage', c.usage);
      // Render seasonal months grid
      var monthsEl = section.querySelector('.cal-months');
      var oldSeasons = section.querySelector('.cal-seasons');
      if (oldSeasons) oldSeasons.remove();
      var meta = CAL_MONTH_META[id];
      var i18nData = (typeof I18N !== 'undefined' && I18N[lang]) ? I18N[lang] : null;
      var i18nMonths = i18nData ? i18nData[meta[0]] : null;

      if (monthsEl && meta && i18nMonths) {
        monthsEl.style.display = 'none';
        var daysArr = meta[1].split(',');
        var seasonsArr = meta[2] ? meta[2].split(',').map(Number) : null;
        var sLabels = SEASON_LABELS[lang] || SEASON_LABELS.en;
        var container = document.createElement('div');
        container.className = 'cal-seasons';

        function mkItem(num, name, d) {
          var el = document.createElement('div');
          el.className = 'cal-month-item';
          var n1 = document.createElement('span');
          n1.className = 'cal-month-num'; n1.textContent = num;
          var n2 = document.createElement('span');
          n2.className = 'cal-month-name'; n2.textContent = name;
          var n3 = document.createElement('span');
          n3.className = 'cal-month-days'; n3.textContent = d;
          el.appendChild(n1); el.appendChild(n2); el.appendChild(n3);
          return el;
        }

        if (seasonsArr) {
          for (var s = 0; s < 4; s++) {
            var inSeason = [];
            for (var mi = 0; mi < i18nMonths.length; mi++) {
              if (seasonsArr[mi] === s) inSeason.push({ num: mi + 1, name: i18nMonths[mi], days: daysArr[mi] || '' });
            }
            if (!inSeason.length) continue;
            var band = document.createElement('div');
            band.className = 'cal-season-band';
            band.dataset.season = String(s);
            var lbl = document.createElement('span');
            lbl.className = 'cal-season-label'; lbl.textContent = sLabels[s];
            band.appendChild(lbl);
            var row = document.createElement('div');
            row.className = 'cal-season-row';
            inSeason.forEach(function(m) { row.appendChild(mkItem(m.num, m.name, m.days)); });
            band.appendChild(row);
            container.appendChild(band);
          }
        } else {
          container.classList.add('cal-seasons--flat');
          var flatRow = document.createElement('div');
          flatRow.className = 'cal-season-row cal-season-row--flat';
          for (var mi = 0; mi < i18nMonths.length; mi++) {
            flatRow.appendChild(mkItem(mi + 1, i18nMonths[mi], daysArr[mi] || ''));
          }
          container.appendChild(flatRow);
        }
        monthsEl.after(container);
      } else if (monthsEl) {
        monthsEl.style.display = '';
      }
      setT('.cal-tabular', c.tabular);
      setT('.cal-arithmetic', c.arithmetic);
      setT('.cal-variants-text', c.variantsText);
    });

    // Update formula labels
    if (t.formulaLabel) {
      document.querySelectorAll('[data-formula-label]').forEach(function(el) {
        el.textContent = t.formulaLabel;
      });
    }

    var methSections = ['methJDN', 'methArchitecture', 'methAlgorithms', 'methValidation', 'methSources', 'methLinks'];
    methSections.forEach(function(id) {
      var section = document.querySelector('[data-meth="' + id + '"]');
      if (!section || !t[id]) return;
      var m = t[id];
      var setT = function(sel, text) { var el = section.querySelector(sel); if (el && text) el.textContent = text; };
      setT('.meth-title', m.title);
      setT('.meth-body', m.body);
      setT('.meth-body2', m.body2);
      setT('.meth-warning', m.warning);
      setT('.meth-note', m.note);

      if (m.items) {
        var ol = section.querySelector('.meth-sources');
        if (ol) {
          while (ol.firstChild) ol.removeChild(ol.firstChild);
          m.items.forEach(function(item) {
            var li = document.createElement('li');
            // items are [before, emTitle, after] arrays
            li.appendChild(document.createTextNode(item[0]));
            var em = document.createElement('em');
            em.textContent = item[1];
            li.appendChild(em);
            li.appendChild(document.createTextNode(item[2]));
            ol.appendChild(li);
          });
        }
      }
    });

    var introEl = document.querySelector('.meth-intro');
    if (introEl && t.methIntro) introEl.textContent = t.methIntro;
  }

  var switcher = document.getElementById('lang-switcher');
  if (switcher) {
    switcher.addEventListener('click', function(e) {
      var btn = e.target.closest('.lang-btn');
      if (!btn) return;
      setPageLang(btn.dataset.lang);
    });
  }

  setPageLang(currentLang);
})();

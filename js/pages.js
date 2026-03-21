// kalkal — Subpage i18n and shared logic
// Reuses lang preference from main app (localStorage 'kalkal-lang')

const PageI18N = {
  en: {
    nav: { converter: 'Converter', calendars: 'Calendars', methodology: 'Methodology' },
    calPageTitle: 'Calendar Systems',
    calPageSubtitle: 'Descriptions of the calendar systems supported by kalkal',
    methPageTitle: 'Methodology',
    methPageSubtitle: 'Algorithms, conventions, and sources used in kalkal',
    backToConverter: 'Back to converter',

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
      tabular: 'The tabular (arithmetic) version of the Hijri calendar \u2014 used in kalkal \u2014 employs a fixed 30-year cycle in which 11 years are leap years. Four main variants exist, differing only in which years of the cycle are designated as leap:',
      variants: [
        ['W\u00fcstenfeld (IIc)', '2, 5, 7, 10, 13, 16, 19, 21, 24, 26, 29', 'The historiographic standard, used by F. W\u00fcstenfeld and widely adopted in Western scholarship. This is the default variant in kalkal.'],
        ['East Islamic civil (IIa)', '2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29', 'Used in the eastern Islamic world (Mashriq) and adopted by Microsoft and the "Kuwaiti algorithm."'],
        ['West Islamic civil (IIIa)', '2, 5, 8, 10, 13, 16, 19, 21, 24, 27, 29', 'Used historically in the western Islamic world (Maghrib and al-Andalus).'],
        ['\u1e24abash al-\u1e24\u0101sib (IVa)', '2, 5, 8, 11, 13, 16, 19, 21, 24, 27, 30', 'Attributed to the 9th-century astronomer \u1e24abash al-\u1e24\u0101sib.']
      ],
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

    methIntro: 'kalkal converts dates between eight historical and liturgical calendar systems using a unified algorithmic approach. All conversions are deterministic and reproducible.',
    methJDN: {
      title: 'Julian Day Number as Universal Pivot',
      body: 'All date conversions in kalkal pass through the Julian Day Number (JDN) \u2014 a continuous count of days since the beginning of the Julian Period on 1 January 4713 BCE (Julian proleptic calendar). Each calendar system implements two functions: one to convert a date into a JDN, and one to convert a JDN back into a date in that calendar. To convert from calendar A to calendar B, we compute A \u2192 JDN \u2192 B. This approach avoids the combinatorial explosion of writing direct conversion functions between every pair of calendars.',
      note: 'The Julian Day Number is a tool of astronomical chronology unrelated to the Julian calendar, despite the shared name. It was introduced by Joseph Justus Scaliger in 1583.'
    },
    methTabular: {
      title: 'Tabular Islamic Calendar',
      body: 'The Hijri (lunar) calendar in kalkal uses the tabular/arithmetic method rather than astronomical observation or calculation of lunar phases. The tabular method employs a fixed 30-year cycle in which 11 years are leap years (355 days) and 19 are common years (354 days). This gives a mean lunation of 29.53\u0305 days, very close to the astronomical mean synodic month of 29.53059 days.',
      body2: 'Four historical variants of the tabular calendar are supported, differing only in which years of the 30-year cycle are designated as leap. The default variant is W\u00fcstenfeld (type IIc), the standard in Western historiography.',
      warning: 'The tabular calendar may differ by \u00b11\u20132 days from calendars based on lunar observation (used officially in Saudi Arabia and other countries). It is intended for historical research and approximate conversion, not for determining religious observance dates.'
    },
    methSolar: {
      title: 'Solar Hijri: 2820-Year Cycle',
      body: 'The Solar Hijri (Iranian) calendar is approximated arithmetically using a 2820-year grand cycle containing exactly 683 leap years and 1,029,983 days. This gives a mean year of 365.24220 days, extremely close to the current vernal equinox year. The algorithm, based on work by Ahmad Birashk and refined by K. M. Borkowski, determines leap years through a formula involving the cycle position.'
    },
    methAlexandrian: {
      title: 'Coptic and Ethiopian: Alexandrian Calendars',
      body: 'Both the Coptic and Ethiopian calendars follow the Alexandrian calendar structure: 12 months of 30 days plus a short 13th month. They share the same leap year rule (year mod 4 = 3) and differ only in their epoch. Conversion to and from JDN uses straightforward arithmetic based on the fixed year length of 365.25 mean days.'
    },
    methWandering: {
      title: 'Yazdgerdi and Armenian: Wandering Calendars',
      body: 'The Yazdgerdi and Armenian calendars are "wandering" or "vague" calendars with a fixed year of exactly 365 days and no intercalation. Conversion is simple arithmetic: the JDN offset from the epoch divided by 365 gives the year, and the remainder gives the day of the year. These calendars drift through the seasons at ~1 day every 4 years.'
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
    }
  },

  pl: {
    nav: { converter: 'Konwerter', calendars: 'Kalendarze', methodology: 'Metodologia' },
    calPageTitle: 'Systemy kalendarzowe',
    calPageSubtitle: 'Opisy system\u00f3w kalendarzowych obs\u0142ugiwanych przez kalkal',
    methPageTitle: 'Metodologia',
    methPageSubtitle: 'Algorytmy, konwencje i \u017ar\u00f3d\u0142a u\u017cyte w kalkal',
    backToConverter: 'Powr\u00f3t do konwertera',

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
      tabular: 'Wersja tabelaryczna (arytmetyczna) kalendarza hid\u017cry \u2014 u\u017cywana w kalkal \u2014 stosuje sta\u0142y cykl 30-letni, w kt\u00f3rym 11 lat jest przest\u0119pnych. Istniej\u0105 cztery g\u0142\u00f3wne warianty, r\u00f3\u017cni\u0105ce si\u0119 tym, kt\u00f3re lata cyklu s\u0105 przest\u0119pne:',
      variants: [
        ['W\u00fcstenfeld (IIc)', '2, 5, 7, 10, 13, 16, 19, 21, 24, 26, 29', 'Standard historiograficzny, u\u017cywany przez F. W\u00fcstenfelda. Domy\u015blny wariant w kalkal.'],
        ['Wschodni cywilny (IIa)', '2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29', 'U\u017cywany na wschodzie \u015bwiata islamu (Maszrik) oraz w algorytmie kuwejckim Microsoftu.'],
        ['Zachodni cywilny (IIIa)', '2, 5, 8, 10, 13, 16, 19, 21, 24, 27, 29', 'U\u017cywany historycznie na zachodzie \u015bwiata islamu (Maghreb i al-Andalus).'],
        ['\u1e24abasz al-\u1e24\u0101sib (IVa)', '2, 5, 8, 11, 13, 16, 19, 21, 24, 27, 30', 'Przypisywany IX-wiecznemu astronomowi \u1e24abaszowi al-\u1e24\u0101sibowi.']
      ],
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
      name: 'Kalendarz orme\u0144ski',
      type: 'S\u0142oneczny (w\u0119drowny)',
      epoch: '1 navasard 1 = 11 lipca 552 n.e. (julia\u0144ski)',
      intro: 'Tradycyjny kalendarz orme\u0144ski jest sta\u0142ym kalendarzem 365-dniowym o tej samej strukturze co kalendarze egipski i Jezdegerda.',
      body: 'Podobnie jak kalendarz Jezdegerda, sk\u0142ada si\u0119 z 12 miesi\u0119cy po 30 dni plus 5 dni epagomenalnych (Aweleac\u02bc), bez korekcji roku przest\u0119pnego. Jest wi\u0119c kalendarzem \u201ew\u0119drownym\u201d, przesuwaj\u0105cym si\u0119 przez pory roku.',
      usage: 'Kalendarz orme\u0144ski by\u0142 u\u017cywany w Armenii i przez spo\u0142eczno\u015bci orme\u0144skie. Zosta\u0142 w du\u017cej mierze zast\u0105piony kalendarzem gregoria\u0144skim, ale pozostaje wa\u017cny dla chronologii historycznej.',
      months: 'Trzyna\u015bcie miesi\u0119cy: Navasard, Hori, Sahmi, Tre, K\u2019aloc\u02bc, Arac\u02bc, Mehekan, Areg, Ahekan, Mareri, Margac\u02bc, Hrotic\u02bc (po 30 dni), Aweleac\u02bc (5 dni).'
    },

    methIntro: 'kalkal konwertuje daty pomi\u0119dzy o\u015bmioma historycznymi i liturgicznymi systemami kalendarzowymi, stosuj\u0105c jednolite podej\u015bcie algorytmiczne. Wszystkie konwersje s\u0105 deterministyczne i powtarzalne.',
    methJDN: {
      title: 'Julia\u0144ski Dzie\u0144 Numer jako uniwersalny pivot',
      body: 'Wszystkie konwersje dat w kalkal przechodz\u0105 przez Julia\u0144ski Dzie\u0144 Numer (JDN) \u2014 ci\u0105g\u0142e liczenie dni od pocz\u0105tku Okresu Julia\u0144skiego, 1 stycznia 4713 r. p.n.e. Ka\u017cdy system kalendarzowy implementuje dwie funkcje: konwersj\u0119 daty na JDN i konwersj\u0119 JDN na dat\u0119. Aby przeliczy\u0107 z kalendarza A na B, obliczamy A \u2192 JDN \u2192 B.',
      note: 'Julia\u0144ski Dzie\u0144 Numer jest narz\u0119dziem chronologii astronomicznej, niezwi\u0105zanym z kalendarzem julia\u0144skim mimo wsp\u00f3lnej nazwy. Zosta\u0142 wprowadzony przez Josepha Justusa Scaligera w 1583 roku.'
    },
    methTabular: {
      title: 'Tabelaryczny kalendarz islamski',
      body: 'Kalendarz hid\u017cry (ksi\u0119\u017cycowy) w kalkal u\u017cywa metody tabelarycznej/arytmetycznej, a nie obserwacji astronomicznej. Metoda ta stosuje sta\u0142y cykl 30-letni, w kt\u00f3rym 11 lat jest przest\u0119pnych (355 dni), a 19 zwyk\u0142ych (354 dni). Daje to \u015bredni\u0105 lunacj\u0119 29,53\u0305 dnia.',
      body2: 'Obs\u0142ugiwane s\u0105 cztery historyczne warianty kalendarza tabelarycznego, r\u00f3\u017cni\u0105ce si\u0119 jedynie tym, kt\u00f3re lata 30-letniego cyklu s\u0105 przest\u0119pne. Domy\u015blny wariant to W\u00fcstenfeld (typ IIc), standard w zachodniej historiografii.',
      warning: 'Kalendarz tabelaryczny mo\u017ce r\u00f3\u017cni\u0107 si\u0119 o \u00b11\u20132 dni od kalendarzy opartych na obserwacji ksi\u0119\u017cyca. Jest przeznaczony do bada\u0144 historycznych i przybli\u017conej konwersji, nie do wyznaczania dat obrz\u0119d\u00f3w religijnych.'
    },
    methSolar: {
      title: 'S\u0142oneczny hid\u017cry: cykl 2820-letni',
      body: 'Kalendarz s\u0142oneczny hid\u017cry (ira\u0144ski) jest aproksymowany arytmetycznie za pomoc\u0105 2820-letniego cyklu zawieraj\u0105cego dok\u0142adnie 683 lata przest\u0119pne i 1 029 983 dni. Daje to \u015bredni rok 365,24220 dnia, niezwykle bliski aktualnemu rokowi r\u00f3wnonocy wiosennej.'
    },
    methAlexandrian: {
      title: 'Koptyjski i etiopski: kalendarze aleksandryjskie',
      body: 'Oba kalendarze pod\u0105\u017caj\u0105 za struktur\u0105 aleksandryjsk\u0105: 12 miesi\u0119cy po 30 dni plus kr\u00f3tki 13. miesi\u0105c. Dziel\u0105 t\u0119 sam\u0105 regu\u0142\u0119 roku przest\u0119pnego (rok mod 4 = 3) i r\u00f3\u017cni\u0105 si\u0119 jedynie epok\u0105.'
    },
    methWandering: {
      title: 'Jezdegerda i orme\u0144ski: kalendarze w\u0119drowne',
      body: 'Kalendarze Jezdegerda i orme\u0144ski s\u0105 kalendarzami \u201ew\u0119drownymi\u201d ze sta\u0142ym rokiem 365 dni i bez interkalacji. Konwersja jest prost\u0105 arytmetyk\u0105: przesuni\u0119cie JDN od epoki podzielone przez 365 daje rok, a reszta \u2014 dzie\u0144 roku.'
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
    }
  },

  ar: {
    nav: { converter: '\u0627\u0644\u0645\u062d\u0648\u0651\u0644', calendars: '\u0627\u0644\u062a\u0642\u0627\u0648\u064a\u0645', methodology: '\u0627\u0644\u0645\u0646\u0647\u062c\u064a\u0629' },
    calPageTitle: '\u0623\u0646\u0638\u0645\u0629 \u0627\u0644\u062a\u0642\u0627\u0648\u064a\u0645',
    calPageSubtitle: '\u0648\u0635\u0641 \u0623\u0646\u0638\u0645\u0629 \u0627\u0644\u062a\u0642\u0627\u0648\u064a\u0645 \u0627\u0644\u0645\u062f\u0639\u0648\u0645\u0629 \u0641\u064a kalkal',
    methPageTitle: '\u0627\u0644\u0645\u0646\u0647\u062c\u064a\u0629',
    methPageSubtitle: '\u0627\u0644\u062e\u0648\u0627\u0631\u0632\u0645\u064a\u0627\u062a \u0648\u0627\u0644\u0627\u0635\u0637\u0644\u0627\u062d\u0627\u062a \u0648\u0627\u0644\u0645\u0635\u0627\u062f\u0631',
    backToConverter: '\u0627\u0644\u0639\u0648\u062f\u0629 \u0625\u0644\u0649 \u0627\u0644\u0645\u062d\u0648\u0651\u0644',
    gregorian: { name: '\u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u063a\u0631\u064a\u063a\u0648\u0631\u064a', type: '\u0634\u0645\u0633\u064a', epoch: '\u0661 \u064a\u0646\u0627\u064a\u0631 \u0661 \u0645', intro: '\u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u0645\u062f\u0646\u064a \u0627\u0644\u0645\u0642\u0628\u0648\u0644 \u062f\u0648\u0644\u064a\u064b\u0627\u060c \u0623\u062f\u062e\u0644\u0647 \u0627\u0644\u0628\u0627\u0628\u0627 \u063a\u0631\u064a\u063a\u0648\u0631\u064a\u0648\u0633 \u0627\u0644\u062b\u0627\u0644\u062b \u0639\u0634\u0631 \u0639\u0627\u0645 \u0661\u0665\u0668\u0662.', body: '\u0635\u062d\u0651\u062d \u0627\u0646\u062d\u0631\u0627\u0641 \u0661\u0660 \u0623\u064a\u0627\u0645. \u0633\u0646\u0629 \u0643\u0628\u064a\u0633\u0629 \u0625\u0630\u0627 \u0642\u064f\u0633\u0645\u062a \u0639\u0644\u0649 \u0664\u060c \u0625\u0644\u0627 \u0627\u0644\u0645\u0626\u0627\u062a \u0645\u0627 \u0644\u0645 \u062a\u064f\u0642\u0633\u0645 \u0639\u0644\u0649 \u0664\u0660\u0660. \u0645\u062a\u0648\u0633\u0637 \u0663\u0666\u0665\u066b\u0662\u0664\u0662\u0665 \u064a\u0648\u0645.', adoption: '\u0627\u0639\u062a\u0645\u062f\u062a\u0647 \u0627\u0644\u062f\u0648\u0644 \u0627\u0644\u0643\u0627\u062b\u0648\u0644\u064a\u0643\u064a\u0629 \u0639\u0627\u0645 \u0661\u0665\u0668\u0662 \u0648\u062a\u0628\u0639\u062a\u0647\u0627 \u0627\u0644\u062f\u0648\u0644 \u0627\u0644\u0623\u062e\u0631\u0649 \u062a\u062f\u0631\u064a\u062c\u064a\u064b\u0627.', months: '\u0661\u0662 \u0634\u0647\u0631\u064b\u0627 \u0645\u0646 \u0662\u0668\u2013\u0663\u0661 \u064a\u0648\u0645\u064b\u0627.' },
    julian: { name: '\u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u064a\u0648\u0644\u064a\u0627\u0646\u064a', type: '\u0634\u0645\u0633\u064a', epoch: '\u0661 \u064a\u0646\u0627\u064a\u0631 \u0661 \u0645 (\u0627\u0633\u062a\u0628\u0627\u0642\u064a)', intro: '\u0623\u062f\u062e\u0644\u0647 \u064a\u0648\u0644\u064a\u0648\u0633 \u0642\u064a\u0635\u0631 \u0639\u0627\u0645 \u0664\u0666 \u0642.\u0645.\u060c \u0633\u0627\u0626\u062f \u0641\u064a \u0623\u0648\u0631\u0648\u0628\u0627 \u0644\u0623\u0643\u062b\u0631 \u0645\u0646 \u0661\u0666\u0660\u0660 \u0639\u0627\u0645.', body: '\u0643\u0644 \u0633\u0646\u0629 \u062a\u064f\u0642\u0633\u0645 \u0639\u0644\u0649 \u0664 \u0643\u0628\u064a\u0633\u0629. \u0645\u062a\u0648\u0633\u0637 \u0663\u0666\u0665\u066b\u0662\u0665 \u064a\u0648\u0645.', adoption: '\u0644\u0627 \u064a\u0632\u0627\u0644 \u0645\u0633\u062a\u062e\u062f\u0645\u064b\u0627 \u0644\u064a\u062a\u0648\u0631\u062c\u064a\u064b\u0627 \u0641\u064a \u0628\u0639\u0636 \u0627\u0644\u0643\u0646\u0627\u0626\u0633 \u0627\u0644\u0623\u0631\u062b\u0648\u0630\u0643\u0633\u064a\u0629.', months: '\u0661\u0662 \u0634\u0647\u0631\u064b\u0627 \u0643\u0627\u0644\u063a\u0631\u064a\u063a\u0648\u0631\u064a \u0628\u0642\u0627\u0639\u062f\u0629 \u0643\u0628\u064a\u0633\u0629 \u0623\u0628\u0633\u0637.' },
    hijri: { name: '\u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u0647\u062c\u0631\u064a (\u0627\u0644\u0642\u0645\u0631\u064a)', type: '\u0642\u0645\u0631\u064a', epoch: '\u0661 \u0645\u062d\u0631\u0645 \u0661 \u0647\u0640 = \u0661\u0666 \u064a\u0648\u0644\u064a\u0648 \u0666\u0662\u0662 \u0645', intro: '\u062a\u0642\u0648\u064a\u0645 \u0642\u0645\u0631\u064a \u0628\u062d\u062a \u0645\u0646 \u0661\u0662 \u0634\u0647\u0631\u064b\u0627 \u0644\u0644\u0634\u0639\u0627\u0626\u0631 \u0627\u0644\u062f\u064a\u0646\u064a\u0629. \u062d\u0642\u0628\u062a\u0647 \u0647\u062c\u0631\u0629 \u0627\u0644\u0646\u0628\u064a \ufdf2.', body: '\u064a\u0628\u062f\u0623 \u0643\u0644 \u0634\u0647\u0631 \u0628\u0631\u0624\u064a\u0629 \u0627\u0644\u0647\u0644\u0627\u0644. \u062a\u062a\u0646\u0627\u0648\u0628 \u0627\u0644\u0634\u0647\u0648\u0631 \u0628\u064a\u0646 \u0663\u0660 \u0648\u0662\u0669 \u064a\u0648\u0645\u064b\u0627. \u0627\u0644\u0633\u0646\u0629 \u0663\u0665\u0664 \u064a\u0648\u0645\u064b\u0627 \u062a\u0642\u0631\u064a\u0628\u064b\u0627.', tabular: '\u064a\u0633\u062a\u062e\u062f\u0645 kalkal \u0627\u0644\u0646\u0633\u062e\u0629 \u0627\u0644\u062c\u062f\u0648\u0644\u064a\u0629 \u0628\u062f\u0648\u0631\u0629 \u0663\u0660 \u0633\u0646\u0629 \u0641\u064a\u0647\u0627 \u0661\u0661 \u0643\u0628\u064a\u0633\u0629. \u0623\u0631\u0628\u0639\u0629 \u0645\u062a\u063a\u064a\u0631\u0627\u062a:', variants: [
      ['\u0641\u0648\u0633\u062a\u0646\u0641\u0644\u062f (IIc)', '2, 5, 7, 10, 13, 16, 19, 21, 24, 26, 29', '\u0627\u0644\u0645\u0639\u064a\u0627\u0631 \u0627\u0644\u062a\u0627\u0631\u064a\u062e\u064a\u060c \u0627\u0644\u0627\u0641\u062a\u0631\u0627\u0636\u064a.'],
      ['\u0627\u0644\u0634\u0631\u0642\u064a \u0627\u0644\u0645\u062f\u0646\u064a (IIa)', '2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29', '\u0627\u0644\u0645\u0634\u0631\u0642 \u0648\u062e\u0648\u0627\u0631\u0632\u0645\u064a\u0629 \u0627\u0644\u0643\u0648\u064a\u062a.'],
      ['\u0627\u0644\u063a\u0631\u0628\u064a \u0627\u0644\u0645\u062f\u0646\u064a (IIIa)', '2, 5, 8, 10, 13, 16, 19, 21, 24, 27, 29', '\u0627\u0644\u0645\u063a\u0631\u0628 \u0648\u0627\u0644\u0623\u0646\u062f\u0644\u0633.'],
      ['\u062d\u0628\u0634 \u0627\u0644\u062d\u0627\u0633\u0628 (IVa)', '2, 5, 8, 11, 13, 16, 19, 21, 24, 27, 30', '\u0627\u0644\u0642\u0631\u0646 \u0627\u0644\u062a\u0627\u0633\u0639.']
    ], months: '\u0661\u0662 \u0634\u0647\u0631\u064b\u0627: \u0627\u0644\u0645\u062d\u0631\u0645\u060c \u0635\u0641\u0631\u060c \u0631\u0628\u064a\u0639 \u0627\u0644\u0623\u0648\u0644\u060c \u0631\u0628\u064a\u0639 \u0627\u0644\u062b\u0627\u0646\u064a\u060c \u062c\u0645\u0627\u062f\u0649 \u0627\u0644\u0623\u0648\u0644\u0649\u060c \u062c\u0645\u0627\u062f\u0649 \u0627\u0644\u0622\u062e\u0631\u0629\u060c \u0631\u062c\u0628\u060c \u0634\u0639\u0628\u0627\u0646\u060c \u0631\u0645\u0636\u0627\u0646\u060c \u0634\u0648\u0627\u0644\u060c \u0630\u0648 \u0627\u0644\u0642\u0639\u062f\u0629\u060c \u0630\u0648 \u0627\u0644\u062d\u062c\u0629.' },
    solarHijri: { name: '\u0627\u0644\u0647\u062c\u0631\u064a \u0627\u0644\u0634\u0645\u0633\u064a (\u0627\u0644\u0625\u064a\u0631\u0627\u0646\u064a)', type: '\u0634\u0645\u0633\u064a', epoch: '\u0661 \u0641\u0631\u0648\u0631\u062f\u064a\u0646 \u0661 \u0647\u0640.\u0634', intro: '\u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u0631\u0633\u0645\u064a \u0644\u0625\u064a\u0631\u0627\u0646 \u0648\u0623\u0641\u063a\u0627\u0646\u0633\u062a\u0627\u0646. \u064a\u0628\u062f\u0623 \u0639\u0646\u062f \u0627\u0644\u0627\u0639\u062a\u062f\u0627\u0644 \u0627\u0644\u0631\u0628\u064a\u0639\u064a (\u0646\u0648\u0631\u0648\u0632).', body: '\u0627\u0644\u0634\u0647\u0648\u0631 \u0661\u2013\u0666: \u0663\u0661 \u064a\u0648\u0645\u064b\u0627\u060c \u0667\u2013\u0661\u0661: \u0663\u0660 \u064a\u0648\u0645\u064b\u0627\u060c \u0661\u0662: \u0662\u0669/\u0663\u0660 \u064a\u0648\u0645\u064b\u0627.', arithmetic: '\u064a\u0633\u062a\u062e\u062f\u0645 \u062f\u0648\u0631\u0629 \u0662\u0668\u0662\u0660 \u0633\u0646\u0629 \u062d\u0633\u0627\u0628\u064a\u064b\u0627.', months: '\u0661\u0662 \u0634\u0647\u0631\u064b\u0627: \u0641\u0631\u0648\u0631\u062f\u064a\u0646\u060c \u0623\u0631\u062f\u064a\u0628\u0647\u0634\u062a\u060c \u062e\u0631\u062f\u0627\u062f\u060c \u062a\u064a\u0631\u060c \u0645\u0631\u062f\u0627\u062f\u060c \u0634\u0647\u0631\u064a\u0648\u0631\u060c \u0645\u0647\u0631\u060c \u0622\u0628\u0627\u0646\u060c \u0622\u0630\u0631\u060c \u062f\u064a\u060c \u0628\u0647\u0645\u0646\u060c \u0627\u0633\u0641\u0646\u062f.' },
    coptic: { name: '\u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u0642\u0628\u0637\u064a', type: '\u0634\u0645\u0633\u064a', epoch: '\u0661 \u062a\u0648\u062a \u0661 = \u0662\u0669 \u0623\u063a\u0633\u0637\u0633 \u0662\u0668\u0664 \u0645', intro: '\u0645\u0646 \u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u0645\u0635\u0631\u064a \u0627\u0644\u0642\u062f\u064a\u0645. \u0661\u0662\u00d7\u0663\u0660 + \u0634\u0647\u0631 \u0661\u0663 \u0642\u0635\u064a\u0631.', body: '\u0643\u0628\u064a\u0633\u0629 \u0643\u0644 \u0664 \u0633\u0646\u0648\u0627\u062a (\u0633\u0646\u0629 mod \u0664 = \u0663).', usage: '\u064a\u0633\u062a\u062e\u062f\u0645\u0647 \u0627\u0644\u0643\u0646\u064a\u0633\u0629 \u0627\u0644\u0642\u0628\u0637\u064a\u0629 \u0648\u0644\u0644\u0632\u0631\u0627\u0639\u0629 \u0641\u064a \u0645\u0635\u0631.', months: '\u0661\u0663 \u0634\u0647\u0631\u064b\u0627: \u062a\u0648\u062a\u060c \u0628\u0627\u0628\u0647\u060c \u0647\u0627\u062a\u0648\u0631\u060c \u0643\u064a\u0647\u0643\u060c \u0637\u0648\u0628\u0629\u060c \u0623\u0645\u0634\u064a\u0631\u060c \u0628\u0631\u0645\u0647\u0627\u062a\u060c \u0628\u0631\u0645\u0648\u062f\u0629\u060c \u0628\u0634\u0646\u0633\u060c \u0628\u0624\u0646\u0629\u060c \u0623\u0628\u064a\u0628\u060c \u0645\u0633\u0631\u0649 (\u0663\u0660)\u060c \u0627\u0644\u0646\u0633\u064a\u0621 (\u0665/\u0666).' },
    ethiopian: { name: '\u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u0625\u062b\u064a\u0648\u0628\u064a', type: '\u0634\u0645\u0633\u064a', epoch: '\u0661 \u0645\u0633\u0643\u0631\u0645 \u0661 = \u0662\u0669 \u0623\u063a\u0633\u0637\u0633 \u0668 \u0645', intro: '\u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u0631\u0633\u0645\u064a \u0644\u0625\u062b\u064a\u0648\u0628\u064a\u0627\u060c \u0645\u0646 \u0627\u0644\u0639\u0627\u0626\u0644\u0629 \u0627\u0644\u0625\u0633\u0643\u0646\u062f\u0631\u064a\u0629.', body: '\u0645\u062a\u0623\u062e\u0631 \u0628\u0646\u062d\u0648 \u0667\u2013\u0668 \u0633\u0646\u0648\u0627\u062a. \u0631\u0623\u0633 \u0627\u0644\u0633\u0646\u0629 \u0661\u0661 \u0633\u0628\u062a\u0645\u0628\u0631.', usage: '\u0645\u0646 \u0627\u0644\u062f\u0648\u0644 \u0627\u0644\u0642\u0644\u064a\u0644\u0629 \u0628\u062a\u0642\u0648\u064a\u0645 \u0631\u0633\u0645\u064a \u063a\u064a\u0631 \u063a\u0631\u064a\u063a\u0648\u0631\u064a.', months: '\u0661\u0663 \u0634\u0647\u0631\u064b\u0627 \u0643\u0627\u0644\u0642\u0628\u0637\u064a \u0628\u0623\u0633\u0645\u0627\u0621 \u0645\u062e\u062a\u0644\u0641\u0629.' },
    yazdgerdi: { name: '\u062a\u0642\u0648\u064a\u0645 \u064a\u0632\u062f\u062c\u0631\u062f', type: '\u0634\u0645\u0633\u064a (\u0645\u062a\u062c\u0648\u0651\u0644)', epoch: '\u0661 \u0641\u0631\u0648\u0631\u062f\u064a\u0646 \u0661 = \u0661\u0666 \u064a\u0648\u0646\u064a\u0648 \u0666\u0663\u0662 \u0645', intro: '\u062a\u0642\u0648\u064a\u0645 \u0632\u0631\u0627\u062f\u0634\u062a\u064a\u060c \u0645\u0633\u0645\u0649 \u0628\u0627\u0633\u0645 \u064a\u0632\u062f\u062c\u0631\u062f \u0627\u0644\u062b\u0627\u0644\u062b.', body: '\u0661\u0662\u00d7\u0663\u0660 + \u0665 \u0623\u064a\u0627\u0645\u060c \u0628\u062f\u0648\u0646 \u0643\u0628\u064a\u0633\u0629. \u0645\u062a\u062c\u0648\u0651\u0644.', usage: '\u0645\u0647\u0645 \u0644\u0644\u062a\u0623\u0631\u064a\u062e \u0627\u0644\u0633\u0627\u0633\u0627\u0646\u064a.', months: '\u0643\u0627\u0644\u0625\u064a\u0631\u0627\u0646\u064a + \u0665 \u0623\u064a\u0627\u0645.' },
    armenian: { name: '\u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u0623\u0631\u0645\u0646\u064a', type: '\u0634\u0645\u0633\u064a (\u0645\u062a\u062c\u0648\u0651\u0644)', epoch: '\u0661 \u0646\u0627\u0641\u0627\u0633\u0627\u0631\u062f \u0661 = \u0661\u0661 \u064a\u0648\u0644\u064a\u0648 \u0665\u0665\u0662 \u0645', intro: '\u062a\u0642\u0648\u064a\u0645 \u0623\u0631\u0645\u0646\u064a \u062a\u0642\u0644\u064a\u062f\u064a \u0628\u0646\u0641\u0633 \u0628\u0646\u064a\u0629 \u0627\u0644\u0645\u0635\u0631\u064a.', body: '\u0661\u0662\u00d7\u0663\u0660 + \u0665 \u0623\u064a\u0627\u0645\u060c \u0628\u062f\u0648\u0646 \u0643\u0628\u064a\u0633\u0629.', usage: '\u0627\u0633\u062a\u064f\u0628\u062f\u0644 \u0628\u0627\u0644\u063a\u0631\u064a\u063a\u0648\u0631\u064a \u0644\u0643\u0646\u0647 \u0645\u0647\u0645 \u062a\u0627\u0631\u064a\u062e\u064a\u064b\u0627.', months: '\u0661\u0663 \u0634\u0647\u0631\u064b\u0627 \u0643\u0627\u0644\u064a\u0632\u062f\u062c\u0631\u062f\u064a.' },
    methIntro: '\u064a\u062d\u0648\u0651\u0644 kalkal \u0627\u0644\u062a\u0648\u0627\u0631\u064a\u062e \u0628\u064a\u0646 \u062b\u0645\u0627\u0646\u064a\u0629 \u0623\u0646\u0638\u0645\u0629 \u0628\u0645\u0646\u0647\u062c \u062e\u0648\u0627\u0631\u0632\u0645\u064a \u0645\u0648\u062d\u062f.',
    methJDN: { title: '\u0627\u0644\u064a\u0648\u0645 \u0627\u0644\u064a\u0648\u0644\u064a\u0627\u0646\u064a \u0643\u0645\u062d\u0648\u0631', body: '\u062c\u0645\u064a\u0639 \u0627\u0644\u062a\u062d\u0648\u064a\u0644\u0627\u062a \u062a\u0645\u0631 \u0639\u0628\u0631 JDN \u2014 \u0639\u062f\u0651 \u0645\u062a\u0648\u0627\u0635\u0644 \u0644\u0644\u0623\u064a\u0627\u0645. \u0644\u0643\u0644 \u062a\u0642\u0648\u064a\u0645 \u062f\u0627\u0644\u062a\u0627\u0646: \u062a\u0627\u0631\u064a\u062e\u2192JDN \u0648JDN\u2192\u062a\u0627\u0631\u064a\u062e.', note: '\u0623\u062f\u0627\u0629 \u0641\u0644\u0643\u064a\u0629 \u0644\u0627 \u0639\u0644\u0627\u0642\u0629 \u0644\u0647\u0627 \u0628\u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u064a\u0648\u0644\u064a\u0627\u0646\u064a. \u0623\u062f\u062e\u0644\u0647 \u0633\u0643\u0627\u0644\u064a\u062c\u0631 \u0661\u0665\u0668\u0663.' },
    methTabular: { title: '\u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u062c\u062f\u0648\u0644\u064a', body: '\u062f\u0648\u0631\u0629 \u0663\u0660 \u0633\u0646\u0629 \u0641\u064a\u0647\u0627 \u0661\u0661 \u0643\u0628\u064a\u0633\u0629 (\u0663\u0665\u0665) \u0648\u0661\u0669 \u0639\u0627\u062f\u064a\u0629 (\u0663\u0665\u0664).', body2: '\u0623\u0631\u0628\u0639\u0629 \u0645\u062a\u063a\u064a\u0631\u0627\u062a. \u0627\u0644\u0627\u0641\u062a\u0631\u0627\u0636\u064a \u0641\u0648\u0633\u062a\u0646\u0641\u0644\u062f (IIc).', warning: '\u0642\u062f \u064a\u062e\u062a\u0644\u0641 \u0628\u0640\u00b1\u0661\u2013\u0662 \u064a\u0648\u0645 \u0639\u0646 \u0627\u0644\u0631\u0635\u062f.' },
    methSolar: { title: '\u062f\u0648\u0631\u0629 \u0662\u0668\u0662\u0660 \u0633\u0646\u0629', body: '\u062f\u0648\u0631\u0629 \u062a\u062d\u062a\u0648\u064a \u0661\u060c\u0660\u0662\u0669\u060c\u0669\u0668\u0663 \u064a\u0648\u0645\u064b\u0627 \u0628\u0645\u062a\u0648\u0633\u0637 \u0663\u0666\u0665\u066b\u0662\u0664\u0662\u0662\u0660.' },
    methAlexandrian: { title: '\u0627\u0644\u0625\u0633\u0643\u0646\u062f\u0631\u064a\u0629', body: '\u0661\u0662\u00d7\u0663\u0660 + \u0634\u0647\u0631 \u0661\u0663\u060c \u0646\u0641\u0633 \u0627\u0644\u0642\u0627\u0639\u062f\u0629\u060c \u062d\u0642\u0628 \u0645\u062e\u062a\u0644\u0641\u0629.' },
    methWandering: { title: '\u0627\u0644\u0645\u062a\u062c\u0648\u0651\u0644\u0629', body: '\u0663\u0665\u0655 \u064a\u0648\u0645\u064b\u0627 \u062b\u0627\u0628\u062a\u0629 \u062f\u0648\u0646 \u0625\u0642\u062d\u0627\u0645.' },
    methSources: { title: '\u0627\u0644\u0645\u0635\u0627\u062f\u0631', items: [
      ['Richards, E. G. ', 'Mapping Time', '. Oxford, 1998.'],
      ['Reingold & Dershowitz. ', 'Calendrical Calculations', '. Cambridge, 2018.'],
      ['Meeus, Jean. ', 'Astronomical Algorithms', '. Willmann-Bell, 1998.'],
      ['Borkowski, K. M. ', 'Astronomy and Astrophysics', ', 205 (1988).'],
      ['de Blois, F. "Ta\u02bfr\u012bkh" in ', 'Encyclopaedia of Islam', '.'],
      ['Birashk, Ahmad. ', 'A Comparative Calendar...', ' Mazda, 1993.']
    ] }
  },

  eo: {
    nav: { converter: 'Konvertilo', calendars: 'Kalendaroj', methodology: 'Metodologio' },
    calPageTitle: 'Kalendarsistemoj',
    calPageSubtitle: 'Priskriboj de la kalendarsistemoj subtenataj de kalkal',
    methPageTitle: 'Metodologio',
    methPageSubtitle: 'Algoritmoj, konvencioj kaj fontoj uzataj en kalkal',
    backToConverter: 'Reen al konvertilo',
    gregorian: { name: 'Gregoria kalendaro', type: 'Suna', epoch: '1-a de januaro 1 p.K.', intro: 'La gregoria kalendaro estas la internaci\u0109 akceptita civila kalendaro, enkondukita de papo Gregorio la 13-a je la 15-a de oktobro 1582.', body: 'Korektis derivo\u0135on de \u0109irkau 10 tagoj. Superjaro se dividebla per 4, krom se ankau per 100, escepte per 400. Mezjarlongo 365,2425 tagoj.', adoption: 'Katolikaj landoj en 1582; Brita Imperio 1752; Rusio 1918; Grekio 1923; Turkio 1926.', months: '12 monatoj de 28\u201331 tagoj.' },
    julian: { name: 'Julia kalendaro', type: 'Suna', epoch: '1-a de januaro 1 p.K. (proleptika)', intro: 'Enkondukita de Julio Cezaro en 46 a.K. Domina en Europo dum pli ol 1600 jaroj.', body: '\u0108iu jaro dividebla per 4 estas superjaro. Mezjaro 365,25 tagoj.', adoption: 'Ankorau liturgie uzata de kelkaj ortodoksaj eklezioj.', months: '12 monatoj kiel la gregoriaj.' },
    hijri: { name: 'Hi\u011dra kalendaro (luna)', type: 'Luna', epoch: '1-a de mu\u1e25arram 1 = 16-a de julio 622 p.K.', intro: 'Pure luna kalendaro de 12 monatoj por religiaj okazoj. Epoko: Hi\u011dro de Profeto Mu\u1e25ammad.', body: 'Monatoj alternas 30/29 tagojn. Jaro \u0109irkau 354 tagoj.', tabular: 'Tabela versio uzas 30-jaran ciklon kun 11 superjaroj:', variants: [
      ['W\u00fcstenfeld (IIc)', '2, 5, 7, 10, 13, 16, 19, 21, 24, 26, 29', 'Historiografia normo, defa\u016dlta.'],
      ['Orienta (IIa)', '2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29', 'Ma\u015drika kaj Kuvajta algoritmo.'],
      ['Okcidenta (IIIa)', '2, 5, 8, 10, 13, 16, 19, 21, 24, 27, 29', 'Magrebo kaj al-Andaluso.'],
      ['\u1e24aba\u015d (IVa)', '2, 5, 8, 11, 13, 16, 19, 21, 24, 27, 30', '9-jarcenta astronomo.']
    ], months: '12 monatoj: mu\u1e25arram (30), \u1e63afar (29)...' },
    solarHijri: { name: 'Suna hi\u011dra (irana)', type: 'Suna', epoch: '1-a de farvardin 1 AP', intro: 'Oficiala kalendaro de Irano kaj Afganio.', body: 'Monatoj 1\u20136: 31 tagoj; 7\u201311: 30; 12: 29/30.', arithmetic: '2820-jara ciklo kun 1.029.983 tagoj.', months: '12 monatoj.' },
    coptic: { name: 'Kopta kalendaro', type: 'Suna', epoch: '1-a de Thout 1 AM = 29 augusto 284', intro: 'De la antikva egipta kalendaro. 12\u00d730 + 13-a monato.', body: 'Superjaro \u0109iu 4 jaroj (mod 4 = 3).', usage: 'Kopta Ortodoksa Eklezio kaj agrikulturo en Egiptio.', months: '13 monatoj.' },
    ethiopian: { name: 'Etiopa kalendaro', type: 'Suna', epoch: '1-a de M\u00e4sk\u00e4r\u00e4m 1 = 29 augusto 8', intro: 'Oficiala kalendaro de Etiopio, aleksandria familio.', body: '\u0108irkau 7\u20138 jarojn malantau gregoria. Novjaro 11 septembro.', usage: 'Unu el malmultaj landoj kun ne-gregoria oficiala kalendaro.', months: '13 monatoj kiel kopta.' },
    yazdgerdi: { name: 'Jazdgerda kalendaro', type: 'Suna (vaganta)', epoch: '1-a de farvardin 1 YZ = 16 junio 632', intro: 'Zoroastra kalendaro de Irano.', body: '12\u00d730 + 5 tagoj, sen superjaroj. Vaganta.', usage: 'Grava por sasanida kaj fru-islama kronologio.', months: '13 monatoj.' },
    armenian: { name: 'Armena kalendaro', type: 'Suna (vaganta)', epoch: '1-a de Navasard 1 = 11 julio 552', intro: 'Tradicia armena 365-taga kalendaro.', body: '12\u00d730 + 5 tagoj, sen superjaroj.', usage: 'Grandparte anstata\u016digita de gregoria.', months: '13 monatoj.' },
    methIntro: 'kalkal konvertas datojn inter 8 sistemoj per unuigita algoritma aliro.',
    methJDN: { title: 'Julia Tagnombro kiel pivoto', body: '\u0108iuj konvertoj pasas tra JDN. \u0108iu kalendaro havas dato\u2192JDN kaj JDN\u2192dato.', note: 'Astronomihistoria ilo, ne rilata al julia kalendaro. Scaliger, 1583.' },
    methTabular: { title: 'Tabela islama kalendaro', body: '30-jara ciklo kun 11 superjaroj.', body2: 'Kvar variantoj. Defa\u016dlta: W\u00fcstenfeld (IIc).', warning: 'Povas diferenci \u00b11\u20132 tagojn de observ-bazitaj kalendaroj.' },
    methSolar: { title: '2820-jara ciklo', body: '683 superjaroj, 1.029.983 tagoj. Mezjaro 365,24220.' },
    methAlexandrian: { title: 'Aleksandriaj kalendaroj', body: '12\u00d730 + 13-a monato. Sama regulo, malsamaj epokoj.' },
    methWandering: { title: 'Vagantaj kalendaroj', body: 'Fiksa 365 tagoj sen interkalado.' },
    methSources: { title: 'Fontoj', items: [
      ['Richards, E. G. ', 'Mapping Time', '. Oxford, 1998.'],
      ['Reingold & Dershowitz. ', 'Calendrical Calculations', '. Cambridge, 2018.'],
      ['Meeus, Jean. ', 'Astronomical Algorithms', '. Willmann-Bell, 1998.'],
      ['Borkowski, K. M. ', 'Astronomy and Astrophysics', ', 205 (1988).'],
      ['de Blois. "Ta\u02bfr\u012bkh" en ', 'Encyclopaedia of Islam', '.'],
      ['Birashk, Ahmad. ', 'A Comparative Calendar...', ' Mazda, 1993.']
    ] }
  }
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
      }
    }

    const calOrder = ['gregorian', 'julian', 'hijri', 'solarHijri', 'coptic', 'ethiopian', 'yazdgerdi', 'armenian'];
    calOrder.forEach(id => {
      const section = document.querySelector('[data-cal="' + id + '"]');
      if (!section || !t[id]) return;
      const c = t[id];
      const setT = function(sel, text) { var el = section.querySelector(sel); if (el && text) el.textContent = text; };
      setT('.cal-name', c.name);
      setT('.cal-type', c.type);
      setT('.cal-epoch', c.epoch);
      setT('.cal-intro', c.intro);
      setT('.cal-body', c.body);
      setT('.cal-adoption', c.adoption);
      setT('.cal-usage', c.usage);
      setT('.cal-months', c.months);
      setT('.cal-tabular', c.tabular);
      setT('.cal-arithmetic', c.arithmetic);

      var vtable = section.querySelector('.cal-variants');
      if (vtable && c.variants) {
        var tbody = vtable.querySelector('tbody');
        if (tbody) {
          while (tbody.firstChild) tbody.removeChild(tbody.firstChild);
          c.variants.forEach(function(v) {
            var tr = document.createElement('tr');
            var td1 = document.createElement('td');
            td1.className = 'variant-name';
            td1.textContent = v[0];
            var td2 = document.createElement('td');
            td2.className = 'variant-years';
            td2.textContent = v[1];
            var td3 = document.createElement('td');
            td3.textContent = v[2];
            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tbody.appendChild(tr);
          });
        }
      }
    });

    var methSections = ['methJDN', 'methTabular', 'methSolar', 'methAlexandrian', 'methWandering', 'methSources'];
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

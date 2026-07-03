// kalkal — Subpage i18n and shared logic
// Reuses lang preference from main app (localStorage 'kalkal-lang')

const PageI18N = {
  en: {
    nav: { converter: 'Converter', calendars: 'Calendars', methodology: 'Methodology', dynasties: 'Regnal Tables' },
    calPageTitle: 'Calendar Systems',
    dynPageTitle: 'Regnal Tables',
    dynPageSubtitle: 'Chronological tables of rulers and dynasties',
    calPageSubtitle: 'Descriptions of the calendar systems supported by kalkal',
    methPageTitle: 'Methodology',
    methPageSubtitle: 'How kalkal was built, how it calculates, and how it is verified',
    backToConverter: 'Back to converter',
    formulaLabel: 'Formula',
    sourceLabel: 'Algorithm source',

    gregorian: {
      name: 'AD Calendar (Julian\u2192Gregorian)',
      type: 'Solar',
      epoch: 'January 1, 1 CE',
      intro: 'The AD (Anno Domini) dating system, using the Julian calendar before 15 October 1582 and the Gregorian calendar after. This reflects how dates were actually reckoned in the Western world: no one used the Gregorian calendar before it existed.',
      body: 'Before 1582, dates follow the Julian calendar (leap year every 4 years, no exceptions). From 15 October 1582 onward, the Gregorian reform applies: a year is a leap year if divisible by 4, unless also divisible by 100 \u2014 except when divisible by 400. The reform corrected approximately 10 days of accumulated drift since the Council of Nicaea (325 CE). The pure Julian and pure Gregorian calendars are available separately for proleptic calculations.',
      adoption: 'Catholic countries adopted the Gregorian reform in 1582, but Protestant and Orthodox nations followed much later: the British Empire in 1752, Russia in 1918, Greece in 1923, and Turkey in 1926.',
      source: 'Meeus, Jean. Astronomical Algorithms, 2nd ed. (1998), ch. 7. Julian: eq. 7.1 with B = 0. Gregorian: eq. 7.1 with correction A = \u230aY/100\u230b, B = 2 \u2212 A + \u230aA/4\u230b. Cutover at JD 2299160.5.',
      months: 'Twelve months of 28\u201331 days: January (31), February (28/29), March (31), April (30), May (31), June (30), July (31), August (31), September (30), October (31), November (30), December (31).'
    },
    julian: {
      name: 'Julian Calendar',
      type: 'Solar',
      epoch: 'January 1, 1 CE (proleptic)',
      intro: 'The Julian calendar was introduced by Julius Caesar in 46 BCE, effective from 1 January 45 BCE, replacing the earlier Roman calendar. It was the predominant calendar in Europe and the Mediterranean world for over 1,600 years.',
      body: 'The Julian calendar established a simple leap year rule: every year divisible by 4 is a leap year, giving a mean year of exactly 365.25 days. This is about 11 minutes longer than the tropical year, leading to an accumulated error of approximately 1 day every 128 years.',
      adoption: 'By the 16th century, the calendar had drifted about 10 days from the astronomical equinox, prompting the Gregorian reform. The Julian calendar is still used liturgically by some Eastern Orthodox churches (the "Old Calendar"), and it remains the standard for historical dating before 15 October 1582.',
      source: 'Meeus, Jean. Astronomical Algorithms, 2nd ed. (1998), ch. 7, eq. 7.1 with B = 0 (no century correction). The Julian calendar omits the Gregorian correction term, giving a fixed mean year of exactly 365.25 days.',
      months: 'Twelve months identical in name and length to the Gregorian calendar, differing only in the leap year rule (every 4th year, without exception).'
    },
    hijri: {
      name: 'Hijri Calendar (Lunar Islamic)',
      type: 'Lunar',
      epoch: '1 Muharram 1 AH = 16 July 622 CE (Julian)',
      intro: 'The Hijri calendar (at-taqwim al-hijri) is a purely lunar calendar of 12 months used throughout the Islamic world for religious observances. Its epoch is the Hijra (emigration) of the Prophet Muhammad from Mecca to Medina.',
      body: 'Each month begins, in principle, with the sighting of the new crescent moon. The calendar alternates months of 30 and 29 days, with a leap day added to the last month (Dhu al-Hijja) in certain years. The year is approximately 354 days long (355 in leap years), making it about 11 days shorter than the solar year. The calendar therefore cycles through the seasons over a period of roughly 33 years.',
      tabular: 'The tabular (arithmetic) version of the Hijri calendar \u2014 used in kalkal \u2014 employs a fixed 30-year cycle in which 11 years are leap years (355 days) and 19 are common (354 days). Four historical variants exist, differing only in which years of the cycle are designated as leap:',
      variantsItems: [
        'Historiographic standard widely used in Western scholarship. Default in kalkal.',
        'Used in the Mashriq. Matches Intl.DateTimeFormat \u2018islamic-civil\u2019 and the Microsoft/Kuwaiti algorithm. Differs from IIc only in year\u00a018 (instead of\u00a019).',
        'Used historically in the Maghrib and al-Andalus. Differs from IIc in years\u00a08 and\u00a027 (instead of 7 and 26).',
        'Attributed to the 9th-century astronomer \u1e24abash al-\u1e24\u0101sib. Differs from IIc in years\u00a08, 11, 27, and 30 (instead of 7, 10, 26, and 29).'
      ],
      variantsDivergence: 'Variants differ by exactly 1 day for dates falling in the years of the 30-year cycle where their leap assignments diverge. IIc vs IIa: 1 year per cycle (~3.3% of dates) \u2014 example: 1 Mu\u1e25arram 1429\u00a0AH\u00a0=\u00a010\u00a0January\u00a02008\u00a0CE (IIc) vs 9\u00a0January\u00a02008\u00a0CE (IIa). IIIa vs IIc: 2 years per cycle (~6.7%). IVa vs IIc: 4 years per cycle (~13.3%).',
      source: 'de Blois, François. “Taʿrīkh” in Encyclopaedia of Islam, 2nd ed. Variant classification from Richards, E. G. Mapping Time (1998), table 15.4. “In a cycle of 30 years, there are 19 common years of 354 days and 11 leap years of 355 days.”',
      months: 'Twelve months: Mu\u1e25arram (30), \u1e62afar (29), Rab\u012b\u02bf al-Awwal (30), Rab\u012b\u02bf a\u1e6f-\u1e6e\u0101n\u012b (29), \u01e6um\u0101d\u0101 al-\u016al\u0101 (30), \u01e6um\u0101d\u0101 al-\u0100\u1e2bira (29), Ra\u01e7ab (30), \u0160a\u02bfb\u0101n (29), Rama\u1e0d\u0101n (30), \u0160aww\u0101l (29), \u1e0e\u016b al-Qa\u02bfda (30), \u1e0e\u016b al-\u1e24i\u01e7\u01e7a (29 or 30).'
    },
    solarHijri: {
      name: 'Solar Hijri Calendar (Iranian)',
      type: 'Solar',
      epoch: '1 Farvardin 1 AP = 22 March 622 CE (Julian)',
      intro: 'The Solar Hijri calendar (g\u0101h\u0161om\u0101r\u012b-ye he\u01e7r\u012b-ye \u1e2bor\u0161\u012bd\u012b) is the official calendar of Iran and Afghanistan. It is a solar calendar whose epoch coincides with the Hijra, but whose year length tracks the tropical year via the vernal equinox.',
      body: 'The first six months have 31 days, the next five have 30 days, and the twelfth month (Esfand) has 29 days in common years and 30 in leap years. Officially, the new year (Nowruz) begins at the astronomical vernal equinox as observed from Tehran.',
      arithmetic: 'For computational purposes, kalkal uses the arithmetic approximation based on a 2820-year cycle (containing exactly 1,029,983 days), which closely matches the astronomical calendar. Leap years are determined by a formula involving this cycle, attributed to Ahmad Birashk and refined by K. M. Borkowski.',
      source: 'Birashk, Ahmad. A Comparative Calendar (1993). Borkowski, K. M. "ELP2000-85 and the Dynamical Time – Universal Time relation," Astronomy and Astrophysics, 205 (1988). "The 2820-year cycle contains exactly 683 leap years in 1,029,983 days."',
      warning: 'For dates before the 20th century, this arithmetic approximation (2820-year cycle) may differ by ±1 day from the historical Jalali calendar, which was based on astronomical observation of the vernal equinox. The Jalali calendar was established by Omar Khayyam in 1079 CE; no systematic tables of historical equinox dates survive.',
      months: 'Twelve months: Farvardin (31), Ordibehe\u0161t (31), \u1e2aord\u0101d (31), Tir (31), Mord\u0101d (31), \u0160ahrivar (31), Mehr (30), \u0100b\u0101n (30), \u0100\u1e0far (30), Dey (30), Bahman (30), Esfand (29/30).'
    },
    ilkhani: {
      name: 'Ilkhanid Calendar (Kh\u0101n\u012b)',
      type: 'Solar',
      epoch: '1 Farvardin 1 = 13 March 1302 CE (Julian)',
      intro: 'The Ilkhanid calendar (t\u0101r\u012bkh-i kh\u0101n\u012b / t\u0101r\u012bkh-i ghaz\u0101n\u012b) was established by Ghazan Khan as the fiscal calendar of the Mongol Ilkhanate in Persia.',
      body: 'Structurally identical to the Solar Hijri calendar with a different epoch. The 12-year Turkic-Mongol animal cycle (sichqan, ud, bars, ...) is overlaid on the year count.',
      source: 'Encyclopaedia Iranica, "Calendars." Charles Melville, "The Chinese-Uighur Animal Calendar in Persian Historiography."',
      warning: 'The Ilkhanid calendar (1302–~1335 CE) was based on astronomical observation at the Maragheh observatory, not on the 2820-year arithmetic cycle used here. For dates in the Ilkhanid period, the arithmetic approximation may differ by ±1 day from the actual historical calendar. No observational tables survive.',
      months: 'Twelve months: Farvardin (31), Ordibehe\u0161t (31), \u1e2aord\u0101d (31), Tir (31), Mord\u0101d (31), \u0160ahrivar (31), Mehr (30), \u0100b\u0101n (30), \u0100\u1e0far (30), Dey (30), Bahman (30), Esfand (29/30).'
    },
    coptic: {
      name: 'Coptic Calendar',
      type: 'Solar',
      epoch: '1 Thout 1 AM = 29 August 284 CE (Julian)',
      intro: 'The Coptic calendar (also called the Alexandrian calendar) descends from the ancient Egyptian civil calendar, reformed under Augustus to include a leap year. It counts years from the Era of the Martyrs (Anno Martyrum, AM), beginning with the accession of the Roman emperor Diocletian.',
      body: 'The calendar consists of 12 months of 30 days each, followed by a short 13th month (Epagomenai) of 5 days in common years or 6 in leap years. Leap years occur every 4 years, when the year number leaves a remainder of 3 when divided by 4. The mean year is 365.25 days, identical to the Julian calendar.',
      usage: 'The Coptic calendar is used liturgically by the Coptic Orthodox Church and for agricultural purposes in Egypt. The Ethiopian calendar shares its structure but uses a different epoch.',
      source: 'Reingold, E. M. & Dershowitz, N. Calendrical Calculations: The Ultimate Edition (2018), §1.4. "fixed-from-coptic(y, m, d) = coptic-epoch + 365·(y−1) + ⌊y/4⌋ + 30·(m−1) + d − 1."',
      months: 'Thirteen months: Thout, Paopi, Hathor, Koiak, Tobi, Meshir, Paremhat, Parmouti, Pashons, Paoni, Epip, Mesori (each 30 days), Epagomenai (5 or 6 days).'
    },
    ethiopian: {
      name: 'Ethiopian Calendar',
      type: 'Solar',
      epoch: '1 M\u00e4sk\u00e4r\u00e4m 1 = 29 August 8 CE (Julian)',
      intro: 'The Ethiopian calendar (ye\u02bcItyop\u02bcya zen meqo\u1e45enya) is the official calendar of Ethiopia. It belongs to the same Alexandrian family as the Coptic calendar, sharing its structure of 12 \u00d7 30-day months plus a 13th epagomenal month.',
      body: 'The epoch is approximately 7\u20138 years behind the Gregorian calendar, reflecting a different calculation of the Annunciation of Jesus. Leap years follow the same rule as the Coptic calendar (year % 4 === 3). The Ethiopian New Year (Enkutatash) falls on 11 September in the Gregorian calendar (12 September in Gregorian leap years).',
      usage: 'Ethiopia is one of the few countries to use a non-Gregorian calendar as its official civil calendar. The calendar is deeply embedded in Ethiopian culture, religion, and daily life.',
      source: 'Reingold, E. M. & Dershowitz, N. Calendrical Calculations: The Ultimate Edition (2018), §1.5. Same formula as Coptic (1.30) with ethiopic-epoch replacing coptic-epoch.',
      months: 'Thirteen months: M\u00e4sk\u00e4r\u00e4m, \u1e6c\u0259q\u0259mt, \u1e24\u0259dar, Ta\u1e2b\u015ba\u015b, \u1e6c\u0259r, Y\u00e4katit, M\u00e4gabit, Miyazya, G\u0259nbot, S\u00e4ne, \u1e24amle, N\u00e4hase (each 30 days), Pagum\u00e4n (5 or 6 days).'
    },
    yazdgerdi: {
      name: 'Zoroastrian Calendar',
      type: 'Solar (wandering / fixed)',
      epoch: '1 Farvardin 1 YZ = 16 June 632 CE (Julian)',
      intro: 'The Yazdgerdi calendar is the traditional Zoroastrian calendar of Iran, named after Yazdegerd III, the last Sasanian emperor. Its epoch is his coronation in 632 CE.',
      body: 'The calendar consists of 12 months of 30 days each, followed by 5 epagomenal days (the Gatha days). Three variants exist: Shahenshahi (royal, wandering, no leap years \u2014 the default), Qadimi (Parsi variant, 30 days ahead of Shahenshahi due to a missed intercalation in the 8th century), and Fasli (reformed with leap years to keep Nawruz near the vernal equinox).',
      usage: 'Shahenshahi was the standard reckoning in Iran and among Zoroastrians. Qadimi is used by Parsi communities in India. Fasli was reformed in the modern era to stay seasonal.',
      variantsItems: [
        'Historical standard in Iran and among Zoroastrians. Epoch: 16 June 632 CE (Julian).',
        'Used by Parsi communities in India. Same 365-day wandering structure, but 30 days earlier due to a missed intercalation in the 8th century.',
        'Reformed modern variant with leap years (every 4th year, when year mod 4 = 3). Nawruz falls near the vernal equinox (21 March).'
      ],
      variantsDivergence: 'Shahenshahi and Qadimi are both 365-day wandering calendars with no leap years. Qadimi\'s epoch is exactly 30 days earlier, so the Qadimi date is always 30 days ahead of Shahenshahi for any given Julian date — this offset arose from a missed intercalation around 770 CE. Fasli adds leap years to keep Nawruz (1 Farvardin) near 21 March; by the 21st century Shahenshahi Nawruz drifts into late July, Qadimi Nawruz into late June.',
      source: 'Reingold, E. M. & Dershowitz, N. Calendrical Calculations: The Ultimate Edition (2018). "fixed-from-zoroastrian(y, m, d) = zoroastrian-epoch + 365·(y−1) + 30·(m−1) + d − 1." No leap year correction.',
      months: 'Thirteen months: Farvardin, Ordibehe\u0161t, \u1e2aord\u0101d, Tir, Mord\u0101d, \u0160ahrivar, Mehr, \u0100b\u0101n, \u0100\u1e0far, Dey, Bahman, Esfand (each 30 days), plus 5 (or 6 in Fasli leap years) epagomenal days.'
    },
    armenian: {
      name: 'Armenian Calendar',
      type: 'Solar (wandering)',
      epoch: '1 Navasard 1 = 11 July 552 CE (Julian)',
      intro: 'The traditional Armenian calendar is a fixed 365-day calendar with the same structure as the Egyptian and Yazdgerdi calendars. Its epoch is 11 July 552 CE (Julian), traditionally associated with the separation of the Armenian Church.',
      body: 'Like the Yazdgerdi calendar, it consists of 12 months of 30 days plus 5 epagomenal days (Aweleac\u02bc), with no leap year correction. It is therefore a "wandering" calendar that drifts through the seasons.',
      usage: 'The Armenian calendar was used in Armenia and by Armenian communities for historical and religious purposes. It was largely superseded by the Gregorian calendar, but remains important for historical chronology.',
      source: 'Reingold, E. M. & Dershowitz, N. Calendrical Calculations: The Ultimate Edition (2018). Same wandering-year formula as Egyptian: "epoch + 365·(y−1) + 30·(m−1) + d − 1."',
      months: 'Thirteen months: Navasard, Ho\u1e59i, Sahmi, Tr\u0113, K\u2019alo\u010b, Arac\u2019, Mehekan, Areg, Ahekan, Mareri, Margac\u2019, Hrotic\u2019 (each 30 days), Aweleac\u2019 (5 days).'
    },
    egyptian: { name: 'Egyptian Calendar', type: 'Solar (wandering)', intro: 'The ancient Egyptian civil calendar, one of the oldest known. Counts from the Era of Nabonassar (747 BCE).', body: '12 \u00d7 30 days + 5 epagomenal days, no leap year. Always 365 days \u2014 a wandering calendar, prototype for all later 365-day calendars.', source: 'Reingold, E. M. & Dershowitz, N. Calendrical Calculations: The Ultimate Edition (2018), §1.9. "fixed-from-egyptian(y, m, d) = egyptian-epoch + 365·(y−1) + 30·(m−1) + d − 1."', months: 'Thirteen months: Thoth, Phaophi, Athyr, Choiak, Tybi, Mechir, Phamenoth, Pharmuthi, Pachons, Payni, Epiphi, Mesore (30 days each), Epagomenai (5 days).' },
    byzantine: { name: 'Byzantine Calendar', type: 'Solar', intro: 'Anno Mundi calendars counting from the creation of the world. Three variants: Constantinople (5509 BCE, Sep start), Alexandrian (5493 BCE, Mar start), and Chronicon Paschale (5509 BCE, Mar start).', body: 'Julian calendar mechanics with era offset. The Constantinople variant was the official calendar of the Byzantine Empire. The Alexandrian variant was used by the Church of Alexandria. The Chronicon Paschale uses the Constantinople epoch with March year start. Indiction (15-year cycle) is displayed alongside dates.',
      variantsItems: [
        'Official calendar of the Byzantine Empire (330–1453 CE). Year begins 1 September. Default in kalkal.',
        'Used by the Church of Alexandria and in early Christian chronography. Year begins 25 March (the Annunciation). Creation placed 16 years later than Constantinople (5493 vs 5509 BCE).',
        'The 7th-century Easter chronicle. Uses the Constantinople epoch (5509 BCE) with the Alexandrian March year start — a hybrid reckoning.'
      ],
      variantsDivergence: 'Constantinople and Alexandrian differ by 15 or 16 AM years for the same Julian date, depending on the month (16-year epoch difference combined with different year starts). Chronicon Paschale agrees with Constantinople in AM year for January–February and September–December; for March–August it runs 1 AM year higher.',
      source: 'Julian conversion (Meeus, ch. 7) with era shifts from Grumel, V. La Chronologie (1958). Constantinople (Sep start): Sep–Dec → Julian year = Y − 5509; Jan–Aug → Y − 5508. Alexandrian (Mar start, epoch 5493 BCE): Mar–Dec → Julian year = Y − 5493; Jan–Feb → Y − 5492. Chronicon Paschale (Mar start, epoch 5509 BCE): Mar–Dec → Julian year = Y − 5509; Jan–Feb → Y − 5508. All apply Julian→JD (Meeus, eq. 7.1, B = 0).', months: 'Constantinople: twelve months from September. Alexandrian and Chronicon Paschale: twelve months from March.' },
    alexandrian: { name: 'Alexandrian Calendar', type: 'Solar', intro: 'The Alexandrian era (Anno Mundi) is a variant of the creation era used by the Church of Alexandria. It places the creation in 5493 BCE, with the year beginning on March 25 (the Annunciation).', body: 'Like the Byzantine calendar, it uses Julian calendar mechanics with an era offset and a shifted year start. Month 1 is March, month 12 is February. It was used in early Christian chronography and influenced the Ethiopian calendar tradition.', source: 'Julian conversion (Meeus, ch. 7) with era offset from Grumel, V. La Chronologie (1958). Mar–Dec: Julian year = Y − 5493, Julian month = M + 2. Jan–Feb: Julian year = Y − 5492, Julian month = M − 10. Then apply Julian→JD (eq. 7.1, B = 0).', months: 'Twelve months from March: March, April, May, June, July, August, September, October, November, December, January, February.' },
    seleucid: { name: 'Seleucid Calendar', type: 'Solar', intro: 'The Seleucid era (Anno Graecorum) counts from 312 BCE. The most widely used era in the eastern Mediterranean for over a millennium. Two variants: Macedonian (October start) and Babylonian (April start).', body: 'Julian calendar mechanics with a Seleucid era offset. Two historical reckonings exist, differing only in which month begins the year: Macedonian (October) used in Syria and the west, and Babylonian (April) used in Mesopotamia.',
      variantsItems: [
        'Year starts 1 October (month 1 = Dios). Used in Syria, Phoenicia, and western Asia Minor. Default in kalkal.',
        'Year starts 1 April (month 1 = Nisannu). Used in Mesopotamia. For the same Julian date the Babylonian SE year is typically 1 lower than the Macedonian.'
      ],
      variantsDivergence: 'For the same Julian date, Macedonian and Babylonian SE year numbers differ by 1 in January–March and October–December, and agree in April–September. Example: 1 October 312 BCE (Julian) = 1 Dios 1 SE Macedonian; 1 April 311 BCE (Julian) = 1 Nisannu 1 SE Babylonian — both mark the start of SE year 1 but are six months apart.',
      source: 'Julian conversion (Meeus, ch. 7). Bickerman, Chronology of the Ancient World (1980): "The Seleucid era began on 1 October 312 BCE." Macedonian reckoning: Oct–Dec use Julian year = Y − 312; Jan–Sep use Y − 311. Babylonian reckoning: Apr–Dec use Julian year = Y − 311; Jan–Mar use Y − 310. Then apply Julian→JD (eq. 7.1, B = 0).', months: 'Macedonian: twelve months from October. Babylonian: twelve months from April.' },
    syriac: { name: 'Syriac Calendar', type: 'Solar', intro: 'Uses the Seleucid era (year 1 = 312 BCE) with Syriac month names and January\u2013December year.', body: 'The Julian calendar with an era offset of 311 years. Month names derive from the Babylonian calendar via Aramaic.', source: 'Julian conversion (Meeus, ch. 7) with era offset: Julian year = Y − 311, same Jan–Dec year structure. Month names from the Babylonian calendar via Aramaic (de Blois, Encyclopaedia of Islam).', months: 'Twelve months: K\u0101n\u016bn II, \u0160b\u0101\u1e6d, \u0100\u1e0f\u0101r, N\u012bs\u0101n, Ayy\u0101r, \u1e24z\u012br\u0101n, Tamm\u016bz, \u0100b, Ayl\u016bl, Ti\u0161r\u012bn I, Ti\u0161r\u012bn II, K\u0101n\u016bn I.' },
    macedonian: { name: 'Macedonian Calendar', type: 'Solar', intro: 'The Syro-Macedonian calendar with Macedonian month names, Seleucid era, and October year start.', body: 'In its fixed Roman-era form, each month maps to a Julian month. Same structure as Seleucid with Macedonian names.', source: 'Julian conversion (Meeus, ch. 7) with Seleucid era and October year start. Each Macedonian month maps to a Julian month (Dios = Oct, ..., Hyperberetaios = Sep). Mapping after Bickerman, Chronology of the Ancient World (1980), app. IV.', months: 'Twelve months from October: Dios, Apellaios, Audynaios, Peritios, Dystros, Xanthikos, Artemisios, Daisios, Panemos, Loos, Gorpiaios, Hyperberetaios.' },
    rumi: { name: 'R\u016bm\u012b Calendar', type: 'Solar', intro: 'The fiscal and civil calendar of the Ottoman Empire, Julian calendar with Hijra-era offset.', body: 'Post-1840s reform: January\u2013December, year = Julian year \u2212 584. Abolished by Turkey in 1926.', source: 'Julian conversion (Meeus, ch. 7). Post-1840 reform: Julian year = Rūmī year + 584, Jan–Dec structure. Ottoman fiscal reform decree of 13 March 1840.', months: 'Twelve months with Julian names and lengths, January\u2013December.' },
    roman: { name: 'Roman Calendar', type: 'Solar', intro: 'The Julian calendar with traditional Roman date notation: Kalends, Nones, and Ides.', body: 'Uses AUC (Ab Urbe Condita) year numbering with Latin month names. Days are expressed by counting inclusively backward from three fixed points: Kalendae (1st), Nonae (5th/7th), and Idus (13th/15th). In March, May, July, and October the Nones fall on the 7th and the Ides on the 15th; in all other months, on the 5th and 13th respectively.', source: 'Same Julian\u2192JDN conversion as AUC (Meeus, ch. 7, Varronian epoch 753 BCE). Roman day-counting rules from Bickerman, Chronology of the Ancient World (1980), ch. IV.', months: 'Twelve months with Latin names: Ianuarius, Februarius, Martius, Aprilis, Maius, Iunius, Iulius, Augustus, September, October, November, December.' },
    spanish: { name: 'Spanish Era', type: 'Solar', intro: 'The Era Hispanica counts from 38 BCE. Standard in the Iberian Peninsula for over a thousand years.', body: 'Julian calendar with era offset of 38 years. Aragon abandoned it in 1350, Castile in 1383, Portugal in 1422.', source: 'Julian conversion (Meeus, ch. 7). Julian year = Spanish year − 38. Era Hispanica epoch: 1 January 38 BCE, marking the Roman conquest of Iberia.', months: 'Twelve months with Julian names and lengths, January\u2013December.' },
    antiochene: { name: 'Antiochene Era', type: 'Solar', intro: 'The Caesarean Era of Antioch counts from 49 BCE (Battle of Pharsalus). Used in Antiochene chronicles.', body: 'Julian calendar with October year start and era offset of 49 years. Replaced the Seleucid era in local Antiochene usage.', source: 'Julian conversion (Meeus, ch. 7) with October year start. Oct–Dec: Julian year = Y − 49; Jan–Sep: Julian year = Y − 48. Caesarean epoch: autumn 49 BCE (Battle of Pharsalus).', months: 'Twelve months from October: October, November, December, January, February, March, April, May, June, July, August, September.' },
    olympiad: { name: 'Olympiad Calendar', type: 'Solar', intro: 'Counts 4-year cycles from the first Olympic Games in 776 BCE, the framework of Greek historians.', body: 'Linear year count from 776 BCE. Year 1 = 776 BCE, year 5 = Olympiad 2, year 1. Display shows \u201cOlympiad N, year K\u201d.', source: 'Julian conversion (Meeus, ch. 7). Linear year count: Julian year = Y − 776. Olympiad number = ⌊(Y−1)/4⌋ + 1, year within olympiad = ((Y−1) mod 4) + 1. Epoch: 776 BCE, the traditional date of the first Olympic Games.', months: 'Twelve months with Julian names and lengths, January\u2013December.' },
    hebrew: { name: 'Hebrew Calendar', type: 'Lunisolar', intro: 'The Hebrew (Jewish) lunisolar calendar for religious observances and official use in Israel. Epoch: 3761 BCE.', body: 'A 19-year Metonic cycle with 7 leap years adding Adar II. Year lengths vary 353\u2013385 days due to postponement rules (dechiyot).', source: 'Reingold, E. M. & Dershowitz, N. Calendrical Calculations: The Ultimate Edition (2018), ch. 8, eqs. 8.1–8.25. Molad (mean conjunction): months = (235Y − 234)/19, parts = 12084 + 13753·months. Four dechiyot postpone New Year to avoid forbidden weekdays.', warning: 'Before ~359 CE (the traditional date of Hillel II\'s reform), the Hebrew calendar was observational: new months were declared by the Sanhedrin based on witness testimony, and intercalary months were added by rabbinic decision. The arithmetic molad algorithm is anachronistic for earlier dates. The Babylonian calendar (Parker & Dubberstein tables) may serve as an approximation for the Persian and Hellenistic periods.', months: 'Twelve or thirteen months: Tishrei (30), Cheshvan (29/30), Kislev (29/30), Tevet (29), Shevat (30), Adar/Adar I (29/30), [Adar II (29)], Nisan (30), Iyar (29), Sivan (30), Tammuz (29), Av (30), Elul (29).' },
    babylonian: { name: 'Babylonian Calendar', type: 'Lunisolar', intro: 'The ancient Mesopotamian lunisolar calendar, ancestor of the Hebrew calendar. Era of Nabonassar (747 BCE).', body: 'Uses the 19-year Metonic cycle for intercalation. Month lengths are determined arithmetically via the Hebrew calendar\u2019s molad computation (an approximation \u2014 historical Babylonian months began at observed first lunar crescent). Year starts at Nisannu (spring equinox). 12 or 13 months per year.', source: 'Parker, R. A. & Dubberstein, W. H. Babylonian Chronology 626 B.C.\u2013A.D. 75. (1956). Arithmetic approximation via Hebrew calendar molad.', months: 'Twelve or thirteen months: Nisannu, Ayaru, Simanu, Du\u02bbuzu, Abu, Ul\u016blu, Tashr\u012btu, Ara\u1e2bsamna, Kislimu, T\u0323ebetu, Shaba\u1e6du, Addaru, [Addaru II].' },
    bp: { name: 'Before Present', type: 'Solar', intro: 'Time scale for archaeology and geology. "Present" = 1950 CE (radiocarbon dating convention).', body: 'Counts backward: BP 0 = 1950 CE, BP 1 = 1949 CE. Gregorian calendar mechanics.', source: 'Simple offset: gregYear = 1950 − bpYear. Convention established by Libby, W. F. Radiocarbon Dating (1955). "Present" fixed at 1 January 1950 CE.', months: 'Twelve months with Gregorian names and lengths.' },
    human: { name: 'Human Era', type: 'Solar', intro: 'The Holocene Era (HE) adds 10,000 years to the Gregorian calendar, epoch at the dawn of human civilization.', body: 'Proposed by Cesare Emiliani (1993). Year 12,024 HE = 2024 CE. No negative years for recorded history.', source: 'Simple offset: gregYear = heYear − 10000. Emiliani, C. "Calendar Reform," Nature 366 (1993), p. 716. "I propose to simply add 10,000 years to the current era."', months: 'Twelve months with Gregorian names and lengths.' },

    methIntro: 'kalkal is a zero-dependency, client-side date converter built entirely with arithmetic algorithms. All conversions are deterministic, reproducible, and independently verifiable.',
    methJDN: {
      title: 'Julian Day Number as Universal Pivot',
      body: 'All date conversions in kalkal pass through the Julian Day Number (JDN) \u2014 a continuous count of days since the beginning of the Julian Period on 1 January 4713 BCE (Julian proleptic calendar). Each calendar system implements two functions: one to convert a date into a JDN, and one to convert a JDN back into a date in that calendar. To convert from calendar A to calendar B, we compute A \u2192 JDN \u2192 B. This approach avoids the combinatorial explosion of writing direct conversion functions between every pair of calendars.',
      note: 'The Julian Day Number is a tool of astronomical chronology unrelated to the Julian calendar, despite the shared name. It was introduced by Joseph Justus Scaliger in 1583.'
    },
    methArchitecture: {
      title: 'Architecture and Construction',
      body: 'kalkal runs entirely in the browser with zero external dependencies and no build step. The computational engine is a single JavaScript module (Cal) exposing toJD() and fromJD() functions for each of the 20+ supported calendar systems. A separate registry maps each calendar to its Cal functions, handling UI concerns like variant selection (e.g. the 4 tabular Hijri variants) independently from the algorithms. Internationalization covers 4 languages (EN, PL, AR, EO) with full RTL support for Arabic.',
      body2: 'Nearly all algorithms are purely arithmetic \u2014 no astronomical calculations, no external API calls, no lookup tables of observed data. The one exception is the Babylonian calendar, which uses the Parker & Dubberstein observational tables for 626 BCE\u201345 CE (with an arithmetic fallback outside that range). For all other calendars, every conversion is reproducible: the same input always produces the same output regardless of platform, locale, or network state.'
    },
    methAlgorithms: {
      title: 'Algorithm Sources',
      body: 'Gregorian and Julian conversions follow the algorithms in Meeus (1998). The tabular Hijri calendar uses a 30-year cycle with 4 historical leap-year variants (IIc/W\u00fcstenfeld as default). The Solar Hijri uses the 2820-year arithmetic cycle from Birashk, refined by Borkowski. Coptic, Ethiopian, Egyptian, Yazdgerdi, and Armenian calendars use epoch-offset arithmetic from Reingold & Dershowitz (2018). The Hebrew calendar implements the full molad-based rules from the same source. Byzantine, Seleucid, Syriac, Rumi, AUC, Spanish Era, Olympiad, and Macedonian calendars are Julian-based with epoch offsets.',
      warning: 'The tabular Hijri calendar may differ by \u00b11\u20132 days from calendars based on lunar observation (used officially in Saudi Arabia and other countries). It is intended for historical research and approximate conversion, not for determining religious observance dates. No systematic tables of observed Hijri dates survive from the medieval period; the Saudi Umm al-Qura calendar, based on astronomical computation, begins only in 1356 AH (1937 CE).'
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
    methLinks: { title: 'Coverage and Similar Tools' },
    about: {
      title: 'kalkal — Author',
      bandCode: '// CARD',
      namePrefix: 'Dr',
      fieldLabel: 'field',
      fieldValue: 'history · Arabic studies',
      projectLabel: 'project',
      projectValue: 'kalkal — date converter',
      licenseLabel: 'source',
      licenseValue: 'source code public',
      note: 'The tool is free. If you find it useful, you can buy me a coffee.',
      kofi: 'Buy me a coffee'
    }
  },

  pl: {
    nav: { converter: 'Konwerter', calendars: 'Kalendarze', methodology: 'Metodologia', dynasties: 'Tablice panowa\u0144' },
    calPageTitle: 'Systemy kalendarzowe',
    dynPageTitle: 'Tablice panowa\u0144',
    dynPageSubtitle: 'Tablice chronologiczne w\u0142adc\u00f3w i dynastii',
    calPageSubtitle: 'Opisy system\u00f3w kalendarzowych obs\u0142ugiwanych przez kalkal',
    methPageTitle: 'Metodologia',
    methPageSubtitle: 'Jak zbudowano kalkal, jak oblicza i jak jest weryfikowany',
    backToConverter: 'Powr\u00f3t do konwertera',
    formulaLabel: 'Formu\u0142a',
    sourceLabel: '\u0179r\u00f3d\u0142o algorytmu',

    gregorian: {
      name: 'Kalendarz n.e. (julia\u0144ski\u2192gregoria\u0144ski)',
      type: 'S\u0142oneczny',
      epoch: '1 stycznia 1 n.e.',
      intro: 'System datowania Anno Domini (n.e.), u\u017cywaj\u0105cy kalendarza julia\u0144skiego przed 15 pa\u017adziernika 1582 i gregoria\u0144skiego po tej dacie. Odzwierciedla to rzeczywist\u0105 praktyk\u0119 datowania w \u015bwiecie zachodnim \u2014 nikt nie u\u017cywa\u0142 kalendarza gregoria\u0144skiego, zanim powsta\u0142.',
      body: 'Przed 1582 rokiem daty odpowiadaj\u0105 kalendarzowi julia\u0144skiemu (rok przest\u0119pny co 4 lata, bez wyj\u0105tk\u00f3w). Od 15 pa\u017adziernika 1582 obowi\u0105zuje reforma gregoria\u0144ska: rok jest przest\u0119pny, je\u015bli jest podzielny przez 4, chyba \u017ce jest r\u00f3wnie\u017c podzielny przez 100 \u2014 z wyj\u0105tkiem lat podzielnych przez 400. Czyste kalendarze julia\u0144ski i gregoria\u0144ski s\u0105 dost\u0119pne osobno do oblicze\u0144 proleptycznych.',
      adoption: 'Kraje katolickie przyj\u0119\u0142y reform\u0119 w 1582 roku, kraje protestanckie i prawos\u0142awne znacznie p\u00f3\u017aniej: Imperium Brytyjskie w 1752, Rosja w 1918, Grecja w 1923, Turcja w 1926.',
      source: 'Meeus, Jean. Astronomical Algorithms, 2nd ed. (1998), ch. 7. Julia\u0144ski: eq. 7.1 z B = 0. Gregoria\u0144ski: eq. 7.1 z korekt\u0105 A = \u230aY/100\u230b, B = 2 \u2212 A + \u230aA/4\u230b. Punkt przej\u015bcia: JD 2299160.5.', months: 'Dwana\u015bcie miesi\u0119cy od 28 do 31 dni: stycze\u0144 (31), luty (28/29), marzec (31), kwiecie\u0144 (30), maj (31), czerwiec (30), lipiec (31), sierpie\u0144 (31), wrzesie\u0144 (30), pa\u017adziernik (31), listopad (30), grudzie\u0144 (31).'
    },
    julian: {
      name: 'Kalendarz julia\u0144ski',
      type: 'S\u0142oneczny',
      epoch: '1 stycznia 1 n.e. (proleptyczny)',
      intro: 'Kalendarz julia\u0144ski zosta\u0142 wprowadzony przez Juliusza Cezara w 46 r. p.n.e., obowi\u0105zuj\u0105c od 1 stycznia 45 r. p.n.e. By\u0142 dominuj\u0105cym kalendarzem w Europie i \u015bwiecie \u015br\u00f3dziemnomorskim przez ponad 1600 lat.',
      body: 'Ustanowi\u0142 prost\u0105 regu\u0142\u0119 roku przest\u0119pnego: ka\u017cdy rok podzielny przez 4 jest przest\u0119pny, co daje \u015bredni rok d\u0142ugo\u015bci 365,25 dnia. Jest to o oko\u0142o 11 minut d\u0142u\u017cej ni\u017c rok zwrotnikowy, co prowadzi do b\u0142\u0119du oko\u0142o 1 dnia na 128 lat.',
      adoption: 'Do XVI wieku kalendarz przesun\u0105\u0142 si\u0119 o oko\u0142o 10 dni od r\u00f3wnonocy astronomicznej. Kalendarz julia\u0144ski jest nadal u\u017cywany liturgicznie przez niekt\u00f3re ko\u015bcio\u0142y prawos\u0142awne (\u201estary styl\u201d).',
      source: 'Meeus, Jean. Astronomical Algorithms, 2nd ed. (1998), ch. 7, eq. 7.1 with B = 0 (no century correction). The Julian calendar omits the Gregorian correction term, giving a fixed mean year of exactly 365.25 days.', months: 'Dwana\u015bcie miesi\u0119cy identycznych z gregoria\u0144skimi, r\u00f3\u017cni\u0105cych si\u0119 jedynie regu\u0142\u0105 roku przest\u0119pnego (co 4 lata, bez wyj\u0105tk\u00f3w).'
    },
    hijri: {
      name: 'Kalendarz hid\u017cry (islamski ksi\u0119\u017cycowy)',
      type: 'Ksi\u0119\u017cycowy',
      epoch: '1 muharram 1 AH = 16 lipca 622 n.e. (julia\u0144ski)',
      intro: 'Kalendarz hid\u017cry (at-taqw\u012bm al-hi\u01e7r\u012b) jest czysto ksi\u0119\u017cycowym kalendarzem 12 miesi\u0119cy, u\u017cywanym w ca\u0142ym \u015bwiecie islamu do cel\u00f3w religijnych. Jego epoka to hid\u017cra (emigracja) Proroka Muhammada z Mekki do Medyny.',
      body: 'Ka\u017cdy miesi\u0105c zaczyna si\u0119 zasadniczo od obserwacji nowego sierpa ksi\u0119\u017cyca. Miesi\u0105ce naprzemiennie maj\u0105 30 i 29 dni. Rok liczy oko\u0142o 354 dni (355 w latach przest\u0119pnych), b\u0119d\u0105c o ok. 11 dni kr\u00f3tszy od roku s\u0142onecznego. Kalendarz przechodzi przez pory roku w cyklu ok. 33 lat.',
      tabular: 'Wersja tabelaryczna (arytmetyczna) kalendarza hid\u017cry \u2014 u\u017cywana w kalkal \u2014 stosuje sta\u0142y cykl 30-letni, w kt\u00f3rym 11 lat jest przest\u0119pnych (355 dni), a 19 zwyk\u0142ych (354 dni). Istniej\u0105 cztery historyczne warianty, r\u00f3\u017cni\u0105ce si\u0119 tym, kt\u00f3re lata cyklu s\u0105 przest\u0119pne:',
      variantsItems: [
        'Standard historiograficzny szeroko przyj\u0119ty w zachodniej nauce. Domy\u015blny w kalkal.',
        'U\u017cywany w Maszreku. Odpowiada Intl.DateTimeFormat \u201eislamski cywilny\u201d i algorytmowi kuwejckiemu (Microsoft). R\u00f3\u017cni si\u0119 od IIc tylko rokiem 18 (zamiast 19).',
        'U\u017cywany historycznie w Maghrebie i al-Andalus. R\u00f3\u017cni si\u0119 od IIc latami 8 i 27 (zamiast 7 i 26).',
        'Przypisywany IX-wiecznemu astronomowi \u1e24abaszowi al-\u1e24\u0101sibowi. R\u00f3\u017cni si\u0119 od IIc latami 8, 11, 27 i 30 (zamiast 7, 10, 26 i 29).'
      ],
      variantsDivergence: 'Warianty r\u00f3\u017cni\u0105 si\u0119 dok\u0142adnie o 1 dzie\u0144 dla dat przypadaj\u0105cych w latach cyklu 30-letniego, w kt\u00f3rych przypisanie lat przest\u0119pnych si\u0119 r\u00f3\u017cni. IIc vs IIa: 1 rok na cykl (~3,3% dat) \u2014 przyk\u0142ad: 1 muharram 1429 AH = 10 stycznia 2008 n.e. (IIc) vs 9 stycznia 2008 n.e. (IIa). IIIa vs IIc: 2 lata na cykl (~6,7%). IVa vs IIc: 4 lata na cykl (~13,3%).',
      source: 'de Blois, François. “Taʿrīkh” in Encyclopaedia of Islam, 2nd ed. Variant classification from Richards, E. G. Mapping Time (1998), table 15.4. “In a cycle of 30 years, there are 19 common years of 354 days and 11 leap years of 355 days.”', months: 'Dwana\u015bcie miesi\u0119cy: muharram (30), safar (29), rab\u012b\u02bf al-awwal (30), rab\u012b\u02bf a\u1e6f-\u1e6f\u0101n\u012b (29), d\u017cum\u0101d\u0101 al-\u016bl\u0101 (30), d\u017cum\u0101d\u0101 al-\u0101\u1e2bira (29), rad\u017cab (30), sza\u02bfb\u0101n (29), ramad\u0101n (30), szaww\u0101l (29), \u1e0f\u016b al-qa\u02bfda (30), \u1e0f\u016b al-\u1e25id\u017cd\u017ca (29 lub 30).'
    },
    solarHijri: {
      name: 'Kalendarz s\u0142oneczny hid\u017cry (ira\u0144ski)',
      type: 'S\u0142oneczny',
      epoch: '1 farwardin 1 AP = 22 marca 622 n.e. (julia\u0144ski)',
      intro: 'Kalendarz s\u0142oneczny hid\u017cry jest oficjalnym kalendarzem Iranu i Afganistanu. Jest kalendarzem s\u0142onecznym, kt\u00f3rego epoka pokrywa si\u0119 z hid\u017cr\u0105, ale d\u0142ugo\u015b\u0107 roku pod\u0105\u017ca za rokiem zwrotnikowym.',
      body: 'Sze\u015b\u0107 pierwszych miesi\u0119cy ma 31 dni, pi\u0119\u0107 nast\u0119pnych \u2014 30 dni, a dwunasty miesi\u0105c (esfand) ma 29 dni w roku zwyk\u0142ym i 30 w przest\u0119pnym. Oficjalnie nowy rok (Nouruz) zaczyna si\u0119 w momencie astronomicznej r\u00f3wnonocy wiosennej obserwowanej z Teheranu.',
      arithmetic: 'Do cel\u00f3w obliczeniowych kalkal u\u017cywa aproksymacji arytmetycznej opartej na 2820-letnim cyklu (zawieraj\u0105cym dok\u0142adnie 1 029 983 dni), kt\u00f3ry \u015bci\u015ble odpowiada kalendarzowi astronomicznemu.',
      source: 'Birashk, Ahmad. A Comparative Calendar (1993). Borkowski, K. M. "ELP2000-85 and the Dynamical Time – Universal Time relation," Astronomy and Astrophysics, 205 (1988). "The 2820-year cycle contains exactly 683 leap years in 1,029,983 days."', warning: 'Dla dat sprzed XX wieku to przybliżenie arytmetyczne (cykl 2820-letni) może różnić się o ±1 dzień od historycznego kalendarza Dżalali, który bazował na astronomicznej obserwacji równonocy wiosennej. Kalendarz Dżalali został ustanowiony przez Omara Chajjama w 1079 r. Nie zachowały się systematyczne tablice historycznych dat równonocy.', months: 'Dwana\u015bcie miesi\u0119cy: farwardin (31), ordibeheszt (31), chordad (31), tir (31), mordad (31), szahriwar (31), mehr (30), aban (30), azar (30), dej (30), bahman (30), esfand (29/30).'
    },
    ilkhani: { name: 'Kalendarz ilchanid\u00f3w (Kh\u0101n\u012b)', type: 'S\u0142oneczny', intro: 'Kalendarz fiskalny chanatu Ilchanid\u00f3w, ustanowiony przez Ghazan-chana.', body: 'Identyczna struktura jak kalendarz s\u0142oneczny hid\u017cry z inn\u0105 epok\u0105 (1302 n.e.). 12-letni turko-mongolski cykl zwierz\u0119cy.', source: 'Encyclopaedia Iranica, "Calendars." Charles Melville, "The Chinese-Uighur Animal Calendar in Persian Historiography."', warning: 'Kalendarz Ilchanidów (1302–ok. 1335 n.e.) bazował na obserwacji astronomicznej w obserwatorium w Maraghi, nie na cyklu arytmetycznym 2820-letnim użytym tutaj. Dla dat z okresu ilchanidzkiego przybliżenie arytmetyczne może różnić się o ±1 dzień. Nie zachowały się tablice obserwacyjne.', months: 'Dwana\u015bcie miesi\u0119cy perskich.' },
    coptic: {
      name: 'Kalendarz koptyjski',
      type: 'S\u0142oneczny',
      epoch: '1 tout 1 AM = 29 sierpnia 284 n.e. (julia\u0144ski)',
      intro: 'Kalendarz koptyjski (aleksandryjski) wywodzi si\u0119 ze staro\u017cytnego egipskiego kalendarza cywilnego, zreformowanego za Augusta o rok przest\u0119pny. Liczy lata od Ery M\u0119czennik\u00f3w (Anno Martyrum), pocz\u0105wszy od wst\u0105pienia na tron cesarza Dioklecjana.',
      body: 'Sk\u0142ada si\u0119 z 12 miesi\u0119cy po 30 dni i kr\u00f3tkiego 13. miesi\u0105ca (epagomenai) \u2014 5 dni w roku zwyk\u0142ym lub 6 w przest\u0119pnym. Rok przest\u0119pny wyst\u0119puje co 4 lata (rok mod 4 = 3).',
      usage: 'Kalendarz koptyjski jest u\u017cywany liturgicznie przez Koptyjski Ko\u015bci\u00f3\u0142 Prawos\u0142awny i do cel\u00f3w rolniczych w Egipcie.',
      source: 'Reingold, E. M. & Dershowitz, N. Calendrical Calculations: The Ultimate Edition (2018), §1.4. "fixed-from-coptic(y, m, d) = coptic-epoch + 365·(y−1) + ⌊y/4⌋ + 30·(m−1) + d − 1."', months: 'Trzyna\u015bcie miesi\u0119cy: Tout, Paopi, Hathor, Koiak, Tobi, Meszir, Paremhat, Parmouti, Paszons, Paoni, Epip, Mesori (po 30 dni), Epagomenai (5 lub 6 dni).'
    },
    ethiopian: {
      name: 'Kalendarz etiopski',
      type: 'S\u0142oneczny',
      epoch: '1 m\u00e4sk\u00e4r\u00e4m 1 = 29 sierpnia 8 n.e. (julia\u0144ski)',
      intro: 'Kalendarz etiopski jest oficjalnym kalendarzem Etiopii. Nale\u017cy do tej samej rodziny aleksandryjskiej co kalendarz koptyjski, dziel\u0105c jego struktur\u0119 12 miesi\u0119cy po 30 dni plus 13. miesi\u0105c epagomenalny.',
      body: 'Epoka jest o ok. 7\u20138 lat p\u00f3\u017aniejsza ni\u017c kalendarz gregoria\u0144ski. Lata przest\u0119pne pod\u0105\u017caj\u0105 za t\u0105 sam\u0105 regu\u0142\u0105 co w kalendarzu koptyjskim. Nowy Rok etiopski (Enkutatash) przypada 11 wrze\u015bnia gregoria\u0144skiego.',
      usage: 'Etiopia jest jednym z nielicznych kraj\u00f3w u\u017cywaj\u0105cych kalendarza niegregoria\u0144skiego jako oficjalnego kalendarza cywilnego.',
      source: 'Reingold, E. M. & Dershowitz, N. Calendrical Calculations: The Ultimate Edition (2018), §1.5. Same formula as Coptic (1.30) with ethiopic-epoch replacing coptic-epoch.', months: 'Trzyna\u015bcie miesi\u0119cy: M\u00e4sk\u00e4r\u00e4m, T\u0259q\u0259mt, H\u0259dar, Tah\u015ba\u015b, T\u0259r, J\u00e4katit, M\u00e4gabit, Mijazja, G\u0259nbot, S\u00e4ne, Hamle, N\u00e4hase (po 30 dni), Pagum\u00e4n (5 lub 6 dni).'
    },
    yazdgerdi: {
      name: 'Kalendarz zoroastryjski',
      type: 'S\u0142oneczny (w\u0119drowny / sta\u0142y)',
      epoch: '1 farwardin 1 YZ = 16 czerwca 632 n.e. (julia\u0144ski)',
      intro: 'Kalendarz Jezdegerda jest tradycyjnym zoroastryjskim kalendarzem Iranu, nazwanym od Jezdegerda III, ostatniego kr\u00f3la sasanidzkiego.',
      body: 'Sk\u0142ada si\u0119 z 12 miesi\u0119cy po 30 dni i 5 dni epagomenalnych. Trzy warianty: Szahensza (kr\u00f3lewski, w\u0119drowny, bez lat przest\u0119pnych \u2014 domy\u015blny), Qadimi (wariant Pars\u00f3w, 30 dni wcze\u015bniej z powodu pomini\u0119tej interkałacji w VIII w.) i Fasli (zreformowany z latami przest\u0119pnymi, Nawruz przy r\u00f3wnonocy wiosennej).',
      usage: 'Szahensza by\u0142 standardem w Iranie i w\u015br\u00f3d zoroastrian. Qadimi u\u017cywany przez spo\u0142eczno\u015bci parsyjskie w Indiach. Fasli zreformowany w epoce nowo\u017cytnej.',
      variantsItems: [
        'Historyczny standard w Iranie i wśród zoroastrian. Epoka: 16 czerwca 632 n.e. (juliański).',
        'Używany przez społeczności parsyjskie w Indiach. Ta sama 365-dniowa struktura, lecz 30 dni wcześniej wskutek pominiętej interkałacji w VIII w.',
        'Zreformowany wariant z latami przestępnymi (co 4 lata, rok mod 4 = 3). Nawruz przypada blisko równonocy wiosennej (21 marca).'
      ],
      variantsDivergence: 'Szahensza i Qadimi to oba kalendarze w\u0119dr\u00f3wcze bez lat przest\u0119pnych (zawsze 365 dni). Epoka Qadimi jest dok\u0142adnie 30 dni wcze\u015bniejsza, wi\u0119c data Qadimi jest zawsze 30 dni przed dat\u0105 Szahensza dla tej samej daty julia\u0144skiej. R\u00f3\u017cnica ta pochodzi z pomini\u0119tej interka\u0142acji ok. 770 n.e. Fasli dodaje lata przest\u0119pne, by Nawruz (1 farwardin) przypada\u0142 blisko 21 marca; w XXI w. Nawruz Szahensza wypada w p\u00f3\u017anym lipcu, Nawruz Qadimi — w p\u00f3\u017anym czerwcu.',
      source: 'Reingold, E. M. & Dershowitz, N. Calendrical Calculations: The Ultimate Edition (2018). "fixed-from-zoroastrian(y, m, d) = zoroastrian-epoch + 365·(y−1) + 30·(m−1) + d − 1." No leap year correction.', months: 'Trzyna\u015bcie miesi\u0119cy: Farwardin, Ordibeheszt, Chordad, Tir, Mordad, Szahriwar, Mehr, Aban, Azar, Dej, Bahman, Esfand (po 30 dni), plus 5 (lub 6 w Fasli) dni epagomenalnych.'
    },
    armenian: {
      name: 'Kalendarz ormia\u0144ski',
      type: 'S\u0142oneczny (w\u0119drowny)',
      epoch: '1 navasard 1 = 11 lipca 552 n.e. (julia\u0144ski)',
      intro: 'Tradycyjny kalendarz ormia\u0144ski jest sta\u0142ym kalendarzem 365-dniowym o tej samej strukturze co kalendarze egipski i Jezdegerda.',
      body: 'Podobnie jak kalendarz Jezdegerda, sk\u0142ada si\u0119 z 12 miesi\u0119cy po 30 dni plus 5 dni epagomenalnych (Aweleac\u02bc), bez korekcji roku przest\u0119pnego. Jest wi\u0119c kalendarzem \u201ew\u0119drownym\u201d, przesuwaj\u0105cym si\u0119 przez pory roku.',
      usage: 'Kalendarz ormia\u0144ski by\u0142 u\u017cywany w Armenii i przez spo\u0142eczno\u015bci ormia\u0144skie. Zosta\u0142 w du\u017cej mierze zast\u0105piony kalendarzem gregoria\u0144skim, ale pozostaje wa\u017cny dla chronologii historycznej.',
      source: 'Reingold, E. M. & Dershowitz, N. Calendrical Calculations: The Ultimate Edition (2018). Same wandering-year formula as Egyptian: "epoch + 365·(y−1) + 30·(m−1) + d − 1."', months: 'Trzyna\u015bcie miesi\u0119cy: Navasard, Hori, Sahmi, Tre, K\u2019aloc\u02bc, Arac\u02bc, Mehekan, Areg, Ahekan, Mareri, Margac\u02bc, Hrotic\u02bc (po 30 dni), Aweleac\u02bc (5 dni).'
    },
    egyptian: { name: 'Kalendarz egipski', type: 'S\u0142oneczny (w\u0119drowny)', intro: 'Staro\u017cytny egipski kalendarz cywilny, jeden z najstarszych znanych. Era Nabonassara (747 p.n.e.).', body: '12 \u00d7 30 dni + 5 dodatkowych, bez roku przest\u0119pnego. Zawsze 365 dni \u2014 kalendarz w\u0119drowny.', source: 'Reingold, E. M. & Dershowitz, N. Calendrical Calculations: The Ultimate Edition (2018), §1.9. "fixed-from-egyptian(y, m, d) = egyptian-epoch + 365·(y−1) + 30·(m−1) + d − 1."', months: 'Trzyna\u015bcie miesi\u0119cy: Thoth, Phaophi, Athyr, Choiak, Tybi, Mechir, Phamenoth, Pharmuthi, Pachons, Payni, Epiphi, Mesore (po 30 dni), Epagomenai (5 dni).' },
    byzantine: { name: 'Kalendarz bizanty\u0144ski', type: 'S\u0142oneczny', intro: 'Kalendarze Anno Mundi licz\u0105ce od stworzenia \u015bwiata. Trzy warianty: Konstantynopolitanski (5509 p.n.e., od wrze\u015bnia), Aleksandryjski (5493 p.n.e., od marca) i Chronicon Paschale (5509 p.n.e., od marca).', body: 'Mechanika julia\u0144ska z przesuni\u0119ciem ery. Wariant konstantynopolita\u0144ski by\u0142 oficjalnym kalendarzem Cesarstwa Bizanty\u0144skiego. Aleksandryjski u\u017cywany przez Ko\u015bci\u00f3\u0142 Aleksandrii. Indykcja (cykl 15-letni) wy\u015bwietlana przy datach.', source: 'Julian conversion (Meeus, ch. 7) with era shifts from Grumel, V. La Chronologie (1958). Constantinople (Sep start): Sep–Dec → Julian year = Y − 5509; Jan–Aug → Y − 5508. Alexandrian (Mar start, epoch 5493 BCE): Mar–Dec → Julian year = Y − 5493; Jan–Feb → Y − 5492. Chronicon Paschale (Mar start, epoch 5509 BCE): Mar–Dec → Julian year = Y − 5509; Jan–Feb → Y − 5508. All apply Julian→JD (Meeus, eq. 7.1, B = 0).',
      variantsItems: [
        'Oficjalny kalendarz Cesarstwa Bizanty\u0144skiego (330\u20131453 n.e.). Rok zaczyna si\u0119 1 wrze\u015bnia. Domy\u015blny w kalkal.',
        'U\u017cywany przez Ko\u015bci\u00f3\u0142 Aleksandrii i we wczesnochrzescija\u0144skiej chronografii. Rok zaczyna si\u0119 25 marca (Zwiastowanie). Stworzenie umieszczone 16 lat p\u00f3\u017aniej ni\u017c w wariancie konstantynopolita\u0144skim (5493 vs 5509 p.n.e.).',
        'Kronika paschalna z VII w. Stosuje epok\u0119 konstantynopolita\u0144sk\u0105 (5509 p.n.e.) z marcowym pocz\u0105tkiem roku \u2014 wariant hybrydowy.'
      ],
      variantsDivergence: 'Wariant konstantynopolita\u0144ski i aleksandryjski r\u00f3\u017cni\u0105 si\u0119 o 15 lub 16 lat AM dla tej samej daty julia\u0144skiej, w zale\u017cno\u015bci od miesi\u0105ca (r\u00f3\u017cnica epok o 16 lat i r\u00f3\u017cne pocz\u0105tki roku). Chronicon Paschale zgadza si\u0119 z konstantynopolita\u0144skim co do numeru roku AM w styczniu\u2013lutym i wrze\u015bniu\u2013grudniu; w marcu\u2013sierpniu jest o 1 rok AM wy\u017cej.',
      months: 'Konstantynopolita\u0144ski: od wrze\u015bnia. Aleksandryjski i Chronicon Paschale: od marca.' },
    alexandrian: { name: 'Kalendarz aleksandryjski', type: 'S\u0142oneczny', intro: 'Aleksandryjska era Anno Mundi \u2014 wariant ery stworzenia u\u017cywany przez Ko\u015bci\u00f3\u0142 Aleksandrii. Stworzenie \u015bwiata w 5493 r. p.n.e., rok zaczyna si\u0119 25 marca (Zwiastowanie).', body: 'Mechanika julia\u0144ska z przesuni\u0119ciem ery i pocz\u0105tkiem roku w marcu. Miesi\u0105c 1 = marzec, miesi\u0105c 12 = luty. Wp\u0142yn\u0105\u0142 na tradycj\u0119 kalendarza etiopskiego.', source: 'Julian conversion (Meeus, ch. 7) with era offset from Grumel, V. La Chronologie (1958). Mar\u2013Dec: Julian year = Y \u2212 5493, Julian month = M + 2. Jan\u2013Feb: Julian year = Y \u2212 5492, Julian month = M \u2212 10. Then apply Julian\u2192JD (eq. 7.1, B = 0).', months: 'Dwana\u015bcie miesi\u0119cy od marca.' },
    seleucid: { name: 'Kalendarz Seleucyd\u00f3w', type: 'S\u0142oneczny', intro: 'Era Seleucyd\u00f3w (Anno Graecorum) od 312 r. p.n.e. Najszerzej u\u017cywana era we wschodnim \u015br\u00f3dziemnomorzu.', body: 'Mechanika julia\u0144ska z przesuni\u0119ciem ery seleucydzkiej. Dwa historyczne rachunki r\u00f3\u017cni\u0105ce si\u0119 pocz\u0105tkiem roku: Macedo\u0144ski (pa\u017adziernik) u\u017cywany w Syrii i na zachodzie, Babilo\u0144ski (kwiecie\u0144) u\u017cywany w Mezopotamii.',
      variantsItems: [
        'Rok zaczyna si\u0119 1 pa\u017adziernika (miesi\u0105c 1 = Dios). U\u017cywany w Syrii, Fenicji i zachodniej Azji Mniejszej. Domy\u015blny w kalkal.',
        'Rok zaczyna si\u0119 1 kwietnia (miesi\u0105c 1 = Nisan). U\u017cywany w Mezopotamii. Dla tej samej daty julia\u0144skiej numer roku SE jest o 1 ni\u017cszy ni\u017c w rachunku macedo\u0144skim.'
      ],
      variantsDivergence: 'Dla tej samej daty julia\u0144skiej numery roku SE w rachunku macedo\u0144skim i babilo\u0144skim r\u00f3\u017cni\u0105 si\u0119 o 1 w miesi\u0105cach stycze\u0144–marzec i pa\u017adziernik–grudzie\u0144, a zgadzaj\u0105 si\u0119 w kwietniu–wrze\u015bniu. Przyk\u0142ad: 1 pa\u017adziernika 312 p.n.e. = 1 Dios 1 SE (macedo\u0144ski); 1 kwietnia 311 p.n.e. = 1 Nisan 1 SE (babilo\u0144ski).',
      source: 'Julian conversion (Meeus, ch. 7). Bickerman, Chronology of the Ancient World (1980): "The Seleucid era began on 1 October 312 BCE." Macedonian reckoning: Oct–Dec use Julian year = Y − 312; Jan–Sep use Y − 311. Babylonian reckoning: Apr–Dec use Julian year = Y − 311; Jan–Mar use Y − 310. Then apply Julian→JD (eq. 7.1, B = 0).', months: 'Macedo\u0144ski: dwana\u015bcie miesi\u0119cy od pa\u017adziernika. Babilo\u0144ski: dwana\u015bcie miesi\u0119cy od kwietnia.' },
    syriac: { name: 'Kalendarz syryjski', type: 'S\u0142oneczny', intro: 'Era Seleucyd\u00f3w z syryjskimi nazwami miesi\u0119cy i rokiem stycze\u0144\u2013grudzie\u0144.', body: 'Kalendarz julia\u0144ski z przesuni\u0119ciem ery o 311 lat. Nazwy miesi\u0119cy z kalendarza babilo\u0144skiego.', source: 'Julian conversion (Meeus, ch. 7) with era offset: Julian year = Y − 311, same Jan–Dec year structure. Month names from the Babylonian calendar via Aramaic (de Blois, Encyclopaedia of Islam).', months: 'Dwana\u015bcie miesi\u0119cy: K\u0101n\u016bn II, \u0160b\u0101\u1e6d, \u0100\u1e0f\u0101r, N\u012bs\u0101n, Ayy\u0101r, \u1e24z\u012br\u0101n, Tamm\u016bz, \u0100b, Ayl\u016bl, Ti\u0161r\u012bn I, Ti\u0161r\u012bn II, K\u0101n\u016bn I.' },
    macedonian: { name: 'Kalendarz macedo\u0144ski', type: 'S\u0142oneczny', intro: 'Kalendarz syro-macedo\u0144ski z macedo\u0144skimi nazwami miesi\u0119cy, era Seleucyd\u00f3w, pocz\u0105tek w pa\u017adzierniku.', body: 'W formie ustalonej z epoki rzymskiej ka\u017cdy miesi\u0105c odpowiada miesi\u0105cowi julia\u0144skiemu.', source: 'Julian conversion (Meeus, ch. 7) with Seleucid era and October year start. Each Macedonian month maps to a Julian month (Dios = Oct, ..., Hyperberetaios = Sep). Mapping after Bickerman, Chronology of the Ancient World (1980), app. IV.', months: 'Dwana\u015bcie miesi\u0119cy od pa\u017adziernika: Dios, Apellaios, Audynaios, Peritios, Dystros, Xanthikos, Artemisios, Daisios, Panemos, Loos, Gorpiaios, Hyperberetaios.' },
    rumi: { name: 'Kalendarz r\u016bm\u012b', type: 'S\u0142oneczny', intro: 'Kalendarz fiskalny i cywilny Imperium Osma\u0144skiego, oparty na julia\u0144skim z przesuni\u0119ciem ery hid\u017cry.', body: 'Po reformie lat 1840.: stycze\u0144\u2013grudzie\u0144, rok = rok julia\u0144ski \u2212 584. Zniesiony przez Turcj\u0119 w 1926.', source: 'Julian conversion (Meeus, ch. 7). Post-1840 reform: Julian year = Rūmī year + 584, Jan–Dec structure. Ottoman fiscal reform decree of 13 March 1840.', months: 'Dwana\u015bcie miesi\u0119cy julia\u0144skich, stycze\u0144\u2013grudzie\u0144.' },
    roman: { name: 'Kalendarz rzymski', type: 'S\u0142oneczny', intro: 'Kalendarz julia\u0144ski z tradycyjn\u0105 rzymsk\u0105 notacj\u0105 dat: Kalendy, Nony i Idy.', body: 'U\u017cywa numeracji lat AUC z \u0142aci\u0144skimi nazwami miesi\u0119cy. Dni wyra\u017cane przez odliczanie wstecz od trzech sta\u0142ych punkt\u00f3w: Kalendae (1.), Nonae (5./7.) i Idus (13./15.).', source: 'Same Julian\u2192JDN conversion as AUC (Meeus, ch. 7, Varronian epoch 753 BCE). Roman day-counting rules from Bickerman, Chronology of the Ancient World (1980), ch. IV.', months: 'Dwana\u015bcie miesi\u0119cy z \u0142aci\u0144skimi nazwami: Ianuarius, Februarius, Martius, Aprilis, Maius, Iunius, Iulius, Augustus, September, October, November, December.' },
    spanish: { name: 'Era hiszpa\u0144ska', type: 'S\u0142oneczny', intro: 'Era Hispanica od 38 r. p.n.e. Standard na P\u00f3\u0142wyspie Iberyjskim przez ponad tysi\u0105c lat.', body: 'Kalendarz julia\u0144ski z przesuni\u0119ciem ery o 38 lat. Aragonia porzuci\u0142a j\u0105 w 1350, Kastylia w 1383, Portugalia w 1422.', source: 'Julian conversion (Meeus, ch. 7). Julian year = Spanish year − 38. Era Hispanica epoch: 1 January 38 BCE, marking the Roman conquest of Iberia.', months: 'Dwana\u015bcie miesi\u0119cy julia\u0144skich, stycze\u0144\u2013grudzie\u0144.' },
    antiochene: { name: 'Era antioche\u0144ska', type: 'S\u0142oneczny', intro: 'Era cezaria\u0144ska Antiochii od 49 r. p.n.e. (bitwa pod Farsalos).', body: 'Kalendarz julia\u0144ski z pocz\u0105tkiem roku w pa\u017adzierniku i przesuni\u0119ciem ery o 49 lat. Zast\u0105pi\u0142a er\u0119 seleucydzk\u0105 w lokalnym u\u017cyciu antioche\u0144skim.', source: 'Julian conversion (Meeus, ch. 7) with October year start. Oct–Dec: Julian year = Y − 49; Jan–Sep: Julian year = Y − 48. Caesarean epoch: autumn 49 BCE (Battle of Pharsalus).', months: 'Dwana\u015bcie miesi\u0119cy od pa\u017adziernika.' },
    olympiad: { name: 'Kalendarz olimpijski', type: 'S\u0142oneczny', intro: 'Czteroletnie cykle od pierwszych igrzysk olimpijskich w 776 r. p.n.e.', body: 'Liniowa numeracja lat od 776 p.n.e. Wy\u015bwietlany jako \u201eOlimpiada N, rok K\u201d.', source: 'Julian conversion (Meeus, ch. 7). Linear year count: Julian year = Y − 776. Olympiad number = ⌊(Y−1)/4⌋ + 1, year within olympiad = ((Y−1) mod 4) + 1. Epoch: 776 BCE, the traditional date of the first Olympic Games.', months: 'Dwana\u015bcie miesi\u0119cy julia\u0144skich, stycze\u0144\u2013grudzie\u0144.' },
    hebrew: { name: 'Kalendarz hebrajski', type: 'Ksi\u0119\u017cycowo-s\u0142oneczny', intro: 'Kalendarz \u017cydowski (lunisolarny) do cel\u00f3w religijnych i u\u017cytku urz\u0119dowego w Izraelu. Epoka: 3761 p.n.e.', body: 'Cykl 19-letni (metoniki) z 7 latami przest\u0119pnymi dodaj\u0105cymi Adar II. D\u0142ugo\u015b\u0107 roku 353\u2013385 dni.', source: 'Reingold, E. M. & Dershowitz, N. Calendrical Calculations: The Ultimate Edition (2018), ch. 8, eqs. 8.1–8.25. Molad (mean conjunction): months = (235Y − 234)/19, parts = 12084 + 13753·months. Four dechiyot postpone New Year to avoid forbidden weekdays.', warning: 'Przed ok. 359 n.e. (tradycyjna data reformy Hillela II) kalendarz hebrajski był obserwacyjny: nowe miesiące ogłaszał Sanhedryn na podstawie zeznań świadków, a miesiące interkalarne dodawano decyzją rabinacką. Algorytm molad jest anachronizmem dla wcześniejszych dat. Kalendarz babiloński (tablice Parkera i Dubbersteina) może służyć jako przybliżenie dla okresów perskiego i hellenistycznego.', months: 'Dwana\u015bcie lub trzyna\u015bcie miesi\u0119cy: Tiszri (30), Cheszwan (29/30), Kislew (29/30), Tewet (29), Szwat (30), Adar/Adar I (29/30), [Adar II (29)], Nisan (30), Ijar (29), Siwan (30), Tamuz (29), Aw (30), Elul (29).' },
    babylonian: { name: 'Kalendarz babilo\u0144ski', type: 'Ksi\u0119\u017cycowo-s\u0142oneczny', intro: 'Staro\u017cytny kalendarz Mezopotamii, przodek kalendarza hebrajskiego. Era Nabonassara (747 p.n.e.).', body: 'Cykl 19-letni (metoniki) z 13. miesi\u0105cem Addaru II. Aproksymacja arytmetyczna oparta na hebrajskim moladzie.', source: 'Parker, R. A. & Dubberstein, W. H. Babylonian Chronology 626 B.C.\u2013A.D. 75. (1956). Arithmetic approximation via Hebrew calendar molad.', months: '12 lub 13 miesi\u0119cy akadyjskich.' },
    bp: { name: 'Przed tera\u017aniejszo\u015bci\u0105', type: 'S\u0142oneczny', intro: 'Skala czasu w archeologii i geologii. \u201eTera\u017aniejszo\u015b\u0107\u201d = 1950 n.e.', body: 'Liczy wstecz: BP 0 = 1950 n.e., BP 1 = 1949 n.e. Mechanika gregoria\u0144ska.', source: 'Simple offset: gregYear = 1950 − bpYear. Convention established by Libby, W. F. Radiocarbon Dating (1955). "Present" fixed at 1 January 1950 CE.', months: 'Dwana\u015bcie miesi\u0119cy gregoria\u0144skich.' },
    human: { name: 'Era ludzka', type: 'S\u0142oneczny', intro: 'Era holoce\u0144ska (HE) dodaje 10 000 lat do kalendarza gregoria\u0144skiego.', body: 'Zaproponowana przez Cesare Emilianiego (1993). Rok 12 024 HE = 2024 n.e. Bez lat ujemnych.', source: 'Simple offset: gregYear = heYear − 10000. Emiliani, C. "Calendar Reform," Nature 366 (1993), p. 716. "I propose to simply add 10,000 years to the current era."', months: 'Dwana\u015bcie miesi\u0119cy gregoria\u0144skich.' },

    methIntro: 'kalkal to konwerter dat dzia\u0142aj\u0105cy w przegl\u0105darce, bez zale\u017cno\u015bci, oparty wy\u0142\u0105cznie na algorytmach arytmetycznych. Wszystkie konwersje s\u0105 deterministyczne, powtarzalne i niezale\u017cnie weryfikowalne.',
    methJDN: {
      title: 'Julia\u0144ski Dzie\u0144 Numer jako uniwersalny pivot',
      body: 'Wszystkie konwersje dat w kalkal przechodz\u0105 przez Julia\u0144ski Dzie\u0144 Numer (JDN) \u2014 ci\u0105g\u0142e liczenie dni od pocz\u0105tku Okresu Julia\u0144skiego, 1 stycznia 4713 r. p.n.e. Ka\u017cdy system kalendarzowy implementuje dwie funkcje: konwersj\u0119 daty na JDN i konwersj\u0119 JDN na dat\u0119. Aby przeliczy\u0107 z kalendarza A na B, obliczamy A \u2192 JDN \u2192 B.',
      note: 'Julia\u0144ski Dzie\u0144 Numer jest narz\u0119dziem chronologii astronomicznej, niezwi\u0105zanym z kalendarzem julia\u0144skim mimo wsp\u00f3lnej nazwy. Zosta\u0142 wprowadzony przez Josepha Justusa Scaligera w 1583 roku.'
    },
    methArchitecture: {
      title: 'Architektura i budowa',
      body: 'kalkal dzia\u0142a ca\u0142kowicie w przegl\u0105darce, bez zale\u017cno\u015bci zewn\u0119trznych i bez kroku budowania. Silnik obliczeniowy to pojedynczy modu\u0142 JavaScript (Cal) udost\u0119pniaj\u0105cy funkcje toJD() i fromJD() dla ka\u017cdego z ponad 20 obs\u0142ugiwanych system\u00f3w kalendarzowych. Osobny rejestr mapuje ka\u017cdy kalendarz na jego funkcje Cal. Internacjonalizacja obejmuje 4 j\u0119zyki (EN, PL, AR, EO) z pe\u0142n\u0105 obs\u0142ug\u0105 RTL dla arabskiego.',
      body2: 'Niemal wszystkie algorytmy s\u0105 czysto arytmetyczne \u2014 bez oblicze\u0144 astronomicznych, bez wywo\u0142a\u0144 API, bez tabel obserwacyjnych. Wyj\u0105tkiem jest kalendarz babilo\u0144ski, kt\u00f3ry korzysta z tabel obserwacyjnych Parkera i Dubbersteina dla lat 626 p.n.e.\u201345 n.e. (poza tym zakresem stosowane jest przybli\u017cenie arytmetyczne). Dla wszystkich pozosta\u0142ych kalendarzy ka\u017cda konwersja jest reprodukowalna: to samo wej\u015bcie zawsze daje to samo wyj\u015bcie.'
    },
    methAlgorithms: {
      title: '\u0179r\u00f3d\u0142a algorytm\u00f3w',
      body: 'Konwersje gregoria\u0144skie i julia\u0144skie oparte na algorytmach Meeusa (1998). Tabelaryczny kalendarz hid\u017cry u\u017cywa cyklu 30-letniego z 4 wariantami lat przest\u0119pnych (domy\u015blny IIc/W\u00fcstenfeld). S\u0142oneczny hid\u017cry u\u017cywa 2820-letniego cyklu arytmetycznego Birashka, udoskonalonego przez Borkowskiego. Kalendarze koptyjski, etiopski, egipski, jezdegerda i orme\u0144ski u\u017cywaj\u0105 arytmetyki z przesuni\u0119ciem epoki wg Reingolda i Dershowitza (2018). Kalendarz hebrajski implementuje pe\u0142ne regu\u0142y molad z tego samego \u017ar\u00f3d\u0142a. Kalendarze bizantyjski, seleucki, syryjski, rumi, AUC, era hiszpa\u0144ska, olimpiady i macedo\u0144ski s\u0105 oparte na julia\u0144skim z przesuni\u0119ciem epoki.',
      warning: 'Kalendarz tabelaryczny mo\u017ce r\u00f3\u017cni\u0107 si\u0119 o \u00b11\u20132 dni od kalendarzy opartych na obserwacji ksi\u0119\u017cyca. Jest przeznaczony do bada\u0144 historycznych, nie do wyznaczania dat obrz\u0119d\u00f3w religijnych. Nie zachowa\u0142y si\u0119 systematyczne tablice obserwowanych dat hid\u017cry ze \u015bredniowiecza; saudyjski kalendarz Umm al-Qura, oparty na obliczeniach astronomicznych, zaczyna si\u0119 dopiero od 1356 AH (1937 n.e.).'
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
    methLinks: { title: 'Pokrycie i podobne narz\u0119dzia' },
    about: {
      title: 'kalkal \u2014 Autor',
      bandCode: '// KARTO',
      namePrefix: 'dr',
      fieldLabel: 'dziedzina',
      fieldValue: 'historia \u00b7 arabistyka',
      projectLabel: 'projekt',
      projectValue: 'kalkal \u2014 konwerter dat',
      licenseLabel: 'kod \u017ar\u00f3d\u0142owy',
      licenseValue: 'publicznie dost\u0119pny',
      note: 'Narz\u0119dzie jest bezp\u0142atne. Je\u015bli ci si\u0119 przydaje, mo\u017cesz postawi\u0107 mi kaw\u0119.',
      kofi: 'Postaw mi kaw\u0119'
    }
  },

  eo: {
    nav: { converter: 'Konvertilo', calendars: 'Kalendaroj', methodology: 'Metodologio', dynasties: 'Regnotabeloj' },
    calPageTitle: 'Kalendarsistemoj',
    dynPageTitle: 'Regnotabeloj',
    dynPageSubtitle: 'Kronologiaj tabeloj de regantoj kaj dinastioj',
    calPageSubtitle: 'Priskriboj de la kalendarsistemoj subtenataj de kalkal',
    methPageTitle: 'Metodologio',
    methPageSubtitle: 'Kiel kalkal estas konstruita, kiel \u011di kalkulas, kaj kiel \u011di estas validata',
    backToConverter: 'Reen al konvertilo',
    formulaLabel: 'Formulo',
    sourceLabel: 'Algoritma fonto',
    gregorian: { name: 'p.K. kalendaro (julia\u2192gregoria)', type: 'Suna', epoch: '1-a de januaro 1 p.K.', intro: 'La p.K. (post Kristo) datsistemo, uzanta la julian kalendaron anta\u016d la 15-a de oktobro 1582 kaj la gregorian poste. Neniu uzis la gregorian kalendaron anta\u016d \u011dia kreado.', body: 'Anta\u016d 1582: julia kalendaro (superjaro \u0109iu 4 jaroj). Ekde 15-a de oktobro 1582: gregoria reformo (superjaro se dividebla per 4, krom per 100, escepte per 400). La puraj julia kaj gregoria kalendaroj haveblas aparte por proleptikaj kalkuloj.', adoption: 'Katolikaj landoj en 1582; Brita Imperio 1752; Rusio 1918; Grekio 1923; Turkio 1926.', source: 'Meeus, Jean. Astronomical Algorithms, 2nd ed. (1998), ch. 7. Julia: eq. 7.1 kun B = 0. Gregoria: eq. 7.1 kun A = \u230aY/100\u230b, B = 2 \u2212 A + \u230aA/4\u230b. Transiro je JD 2299160.5.', months: '12 monatoj de 28\u201331 tagoj.' },
    julian: { name: 'Julia kalendaro', type: 'Suna', epoch: '1-a de januaro 1 p.K. (proleptika)', intro: 'Enkondukita de Julio Cezaro en 46 a.K. Domina en Europo dum pli ol 1600 jaroj.', body: '\u0108iu jaro dividebla per 4 estas superjaro. Mezjaro 365,25 tagoj.', adoption: 'Ankorau liturgie uzata de kelkaj ortodoksaj eklezioj.', source: 'Meeus, Jean. Astronomical Algorithms, 2nd ed. (1998), ch. 7, eq. 7.1 with B = 0 (no century correction). The Julian calendar omits the Gregorian correction term, giving a fixed mean year of exactly 365.25 days.', months: '12 monatoj kiel la gregoriaj.' },
    hijri: { name: 'Hi\u011dra kalendaro (luna)', type: 'Luna', epoch: '1-a de mu\u1e25arram 1 = 16-a de julio 622 p.K.', intro: 'Pure luna kalendaro de 12 monatoj por religiaj okazoj. Epoko: Hi\u011dro de Profeto Mu\u1e25ammad.', body: 'Monatoj alternas 30/29 tagojn. Jaro \u0109irkau 354 tagoj.', tabular: 'Tabela versio uzas 30-jaran ciklon kun 11 superjaroj.',
      variantsItems: [
        'Historiografia normo en okcidenta scienco. Defaŭlto en kalkal.',
        'Uzata en Mashriq. Kongruas kun Intl.DateTimeFormat “islamic-civil” (Microsoft/Kuvajta algoritmo). Diferencas de IIc nur en jaro 18 (anstataŭ 19).',
        'Uzata historie en Maghribo kaj al-Andaluso. Diferencas de IIc en jaroj 8 kaj 27 (anstataŭ 7 kaj 26).',
        'Atribuita al la 9-jarcenta astronomo Ḥabash al-Ḥāsib. Diferencas de IIc en jaroj 8, 11, 27 kaj 30.'
      ],
      variantsDivergence: 'Variantoj diferencas je precize 1 tago por datoj en la superjaroj de la 30-jara ciklo kie asignoj divergas. IIc vs IIa: 1 jaro per ciklo (~3,3% de datoj) — ekz. 1-a muḥarram 1429 AH = 10 januaro 2008 p.K. (IIc) vs 9 januaro 2008 p.K. (IIa). IIIa vs IIc: 2 jaroj (~6,7%). IVa vs IIc: 4 jaroj (~13,3%).', source: 'de Blois, François. “Taʿrīkh” in Encyclopaedia of Islam, 2nd ed. Variant classification from Richards, E. G. Mapping Time (1998), table 15.4. “In a cycle of 30 years, there are 19 common years of 354 days and 11 leap years of 355 days.”', months: '12 monatoj: mu\u1e25arram (30), \u1e63afar (29)...' },
    solarHijri: { name: 'Suna hi\u011dra (irana)', type: 'Suna', epoch: '1-a de farvardin 1 AP', intro: 'Oficiala kalendaro de Irano kaj Afganio.', body: 'Monatoj 1\u20136: 31 tagoj; 7\u201311: 30; 12: 29/30.', arithmetic: '2820-jara ciklo kun 1.029.983 tagoj.', source: 'Birashk, Ahmad. A Comparative Calendar (1993). Borkowski, K. M. "ELP2000-85 and the Dynamical Time – Universal Time relation," Astronomy and Astrophysics, 205 (1988). "The 2820-year cycle contains exactly 683 leap years in 1,029,983 days."', warning: 'Por datoj antaŭ la 20-a jarcento, ĉi tiu aritmetika aproksimo (2820-jara ciklo) povas diferenci je ±1 tago de la historia Ĝalalia kalendaro, kiu baziĝis sur astronomiaj observoj de la printempa ekvinokso. Omar Kajjam establis la Ĝalalian kalendaron en 1079. Neniuj sistemaj tabeloj de historiaj ekvinoksaj datoj pluvivas.', months: '12 monatoj.' },
    ilkhani: { name: 'Il\u0125anida kalendaro (Kh\u0101n\u012b)', type: 'Suna', intro: 'Fiska kalendaro de la Mongola Il\u0125anato, establita de Gazan-\u0125ano.', body: 'Identa strukturo al suna hi\u011dra kun alia epoko (1302 p.K.). 12-jara turk-mongola bestociklo.', source: 'Encyclopaedia Iranica, "Calendars." Charles Melville, "The Chinese-Uighur Animal Calendar in Persian Historiography."', warning: 'La Ilĥanida kalendaro (1302–~1335) baziĝis sur astronomiaj observoj ĉe la observatorio de Maragho, ne sur la aritmetika ciklo uzita ĉi tie. La aproksimo povas diferenci je ±1 tago. Neniuj observtabeloj pluvivas.', months: '12 persaj monatoj.' },
    coptic: { name: 'Kopta kalendaro', type: 'Suna', epoch: '1-a de Thout 1 AM = 29 augusto 284', intro: 'De la antikva egipta kalendaro. 12\u00d730 + 13-a monato.', body: 'Superjaro \u0109iu 4 jaroj (mod 4 = 3).', usage: 'Kopta Ortodoksa Eklezio kaj agrikulturo en Egiptio.', source: 'Reingold, E. M. & Dershowitz, N. Calendrical Calculations: The Ultimate Edition (2018), §1.4. "fixed-from-coptic(y, m, d) = coptic-epoch + 365·(y−1) + ⌊y/4⌋ + 30·(m−1) + d − 1."', months: '13 monatoj.' },
    ethiopian: { name: 'Etiopa kalendaro', type: 'Suna', epoch: '1-a de M\u00e4sk\u00e4r\u00e4m 1 = 29 augusto 8', intro: 'Oficiala kalendaro de Etiopio, aleksandria familio.', body: '\u0108irkau 7\u20138 jarojn malantau gregoria. Novjaro 11 septembro.', usage: 'Unu el malmultaj landoj kun ne-gregoria oficiala kalendaro.', source: 'Reingold, E. M. & Dershowitz, N. Calendrical Calculations: The Ultimate Edition (2018), §1.5. Same formula as Coptic (1.30) with ethiopic-epoch replacing coptic-epoch.', months: '13 monatoj kiel kopta.' },
    yazdgerdi: { name: 'Zoroastra kalendaro', type: 'Suna (vaganta / fiksa)', epoch: '1-a de farvardin 1 YZ = 16 junio 632', intro: 'Zoroastra kalendaro de Irano.', body: 'Tri variantoj: \u015Cahen\u015Daha (vaganta, sen superjaroj), Kadima (30 tagojn pli frue, parsa), Fasli (kun superjaroj, sezonfiks).', usage: '\u015Cahen\u015Daha: historia normo. Kadima: parsoj en Hindio. Fasli: moderna reformo.', variantsItems: [
        'Historia normo en Irano kaj inter zoroastrianoj. Epoko: 16 junio 632 p.K. (julia).',
        'Uzata de parsaj komunumoj en Barato. Sama 365-taga vaganta strukturo, sed 30 tagojn pli frue pro preterlasita interkalo en la 8a jarcento.',
        'Reformita moderna varianto kun superjaroj (je ĉiu 4a jaro, jaro mod 4 = 3). Nawruz proksimas vernoksinokson (21 marto).'
      ],
      variantsDivergence: '\u015cahen\u015daha kaj Kadima estas amba\u016d 365-tagaj vagantaj kalendaroj sen superjaroj. La epoko de Kadima estas ekzakte 30 tagojn pli frua, do la Kadima-dato \u0109iam estas 30 tagojn anta\u016d la \u015cahen\u015daha-dato por iu ajn julia dato. \u0108i tiu diferenco originis el preterlasita interkalo \u0109irkau 770 p.K. Fasli aldonas superjarojn por teni Nawruz (1-an de Farvardin) proksime de 21 marto; en la 21-a jarcento la \u015cahen\u015daha-Nawruz drsivas en malfrua julio, la Kadima-Nawruz \u2014 en malfrua junio.',
      source: 'Reingold, E. M. & Dershowitz, N. Calendrical Calculations: The Ultimate Edition (2018). "fixed-from-zoroastrian(y, m, d) = zoroastrian-epoch + 365·(y−1) + 30·(m−1) + d − 1." No leap year correction.', months: '13 monatoj.' },
    armenian: { name: 'Armena kalendaro', type: 'Suna (vaganta)', epoch: '1-a de Navasard 1 = 11 julio 552', intro: 'Tradicia armena 365-taga kalendaro.', body: '12\u00d730 + 5 tagoj, sen superjaroj.', usage: 'Grandparte anstata\u016digita de gregoria.', source: 'Reingold, E. M. & Dershowitz, N. Calendrical Calculations: The Ultimate Edition (2018). Same wandering-year formula as Egyptian: "epoch + 365·(y−1) + 30·(m−1) + d − 1."', months: '13 monatoj.' },
    egyptian: { name: 'Egipta kalendaro', type: 'Suna (vaganta)', intro: 'Antikva egipta civila kalendaro. Epoko de Nabonasaro (747 a.K.).', body: '12\u00d730 + 5 tagoj, sen superjaroj. \u0108iam 365 tagoj.', source: 'Reingold, E. M. & Dershowitz, N. Calendrical Calculations: The Ultimate Edition (2018), §1.9. "fixed-from-egyptian(y, m, d) = egyptian-epoch + 365·(y−1) + 30·(m−1) + d − 1."', months: '13 monatoj.' },
    byzantine: { name: 'Bizanca kalendaro', type: 'Suna', intro: 'Anno Mundi kalendaroj. Tri variantoj: Konstantinopola (5509 a.K., septembre), Aleksandria (5493 a.K., marte), Chronicon Paschale (5509 a.K., marte).', body: 'Julia mekaniko kun epok-\u015dovo. Indiktio (15-jara ciklo) montrata kun datoj.', source: 'Julian conversion (Meeus, ch. 7) with era shifts from Grumel, V. La Chronologie (1958). Constantinople (Sep start): Sep–Dec → Julian year = Y − 5509; Jan–Aug → Y − 5508. Alexandrian (Mar start, epoch 5493 BCE): Mar–Dec → Julian year = Y − 5493; Jan–Feb → Y − 5492. Chronicon Paschale (Mar start, epoch 5509 BCE): Mar–Dec → Julian year = Y − 5509; Jan–Feb → Y − 5508. All apply Julian→JD (Meeus, eq. 7.1, B = 0).',
      variantsItems: [
        'Oficiala kalendaro de la Bizanca Imperio (330–1453 p.K.). Jaro komenciĝas 1 septembro. Defaŭlta en kalkal.',
        'Uzata de la Eklezio de Aleksandrio kaj en fruaj kristanaj kronografioj. Jaro komenciĝas 25 marto (Anunciacio). Kreado lokita 16 jarojn poste ol Konstantinopola (5493 kontraŭ 5509 a.K.).',
        'La 7-jarcenta paska kroniko. Uzas la konstantinopolan epokon (5509 a.K.) kun la marta jarenkonduko de la Aleksandra varianto — hibrida rakonto.'
      ],
      variantsDivergence: 'Konstantinopola kaj Aleksandra diferencas je 15 aŭ 16 AM-jaroj por la sama julia dato, laŭ la monato (16-jara epoka diferenco kaj malsamaj jarenkondukoj). La Chronicon Paschale konsentas kun Konstantinopola en AM-jarnumero en januaro–februaro kaj septembro–decembro; en marto–aŭgusto ĝi estas 1 AM-jaron pli alta.',
      months: 'Konstantinopola: de septembro. Aleksandria kaj Chronicon Paschale: de marto.' },
    alexandrian: { name: 'Aleksandria kalendaro', type: 'Suna', intro: 'Aleksandria Anno Mundi epoko \u2014 uzata de la Eklezio de Aleksandrio. Kreado en 5493 a.K., jaro komenci\u011das 25 marto (Anunciacio).', body: 'Julia mekaniko kun epok-\u015dovo kaj marta jarenkonduko. Monato 1 = marto, monato 12 = februaro. Influis la etiopan kalendartradicjon.', source: 'Julian conversion (Meeus, ch. 7) with era offset from Grumel, V. La Chronologie (1958). Mar\u2013Dec: Julian year = Y \u2212 5493, Julian month = M + 2. Jan\u2013Feb: Julian year = Y \u2212 5492, Julian month = M \u2212 10. Then apply Julian\u2192JD (eq. 7.1, B = 0).', months: '12 monatoj de marto.' },
    seleucid: { name: 'Seleu\u0109ida kalendaro', type: 'Suna', intro: 'Epoko de la Grekoj de 312 a.K.', body: 'Julia mekaniko kun seleu\u0109ida epok-\u015dovo. Du historiaj rakontoformoj diferencantaj nur per la jarenkonduko: Makedona (oktobro) uzata en Sirio kaj okcidente, Babiona (aprilo) uzata en Mesopotamio.',
      variantsItems: [
        'Jaro komenci\u011das 1 oktobro (monato 1 = Dios). Uzata en Sirio, Fenico kaj okcidenta Azio. Defa\u016dlta en kalkal.',
        'Jaro komenci\u011das 1 aprilo (monato 1 = Nisanu). Uzata en Mesopotamio. Por la sama julia dato la babiona ES-jarnumero estas tipe 1 malpli ol la makedona.'
      ],
      variantsDivergence: 'Por la sama julia dato, la ES-jarnumeroj de la makedona kaj babiona rakontoformoj diferencas je 1 en januaro\u2013marto kaj oktobro\u2013decembro, kaj konsentas en aprilo\u2013septembro. Ekz.: 1 oktobro 312 a.K. = 1 Dios 1 ES (makedona); 1 aprilo 311 a.K. = 1 Nisanu 1 ES (babiona).',
      source: 'Julian conversion (Meeus, ch. 7). Bickerman, Chronology of the Ancient World (1980): "The Seleucid era began on 1 October 312 BCE." Macedonian reckoning: Oct–Dec use Julian year = Y − 312; Jan–Sep use Y − 311. Babylonian reckoning: Apr–Dec use Julian year = Y − 311; Jan–Mar use Y − 310. Then apply Julian→JD (eq. 7.1, B = 0).', months: 'Makedona: 12 monatoj de oktobro. Babiona: 12 monatoj de aprilo.' },
    syriac: { name: 'Siria kalendaro', type: 'Suna', intro: 'Seleu\u0109ida epoko kun siriaj monatnomoj, januaro\u2013decembro.', body: 'Julia kun epok-\u015dovo de 311 jaroj.', source: 'Julian conversion (Meeus, ch. 7) with era offset: Julian year = Y − 311, same Jan–Dec year structure. Month names from the Babylonian calendar via Aramaic (de Blois, Encyclopaedia of Islam).', months: '12 monatoj kun siriaj nomoj.' },
    macedonian: { name: 'Makedona kalendaro', type: 'Suna', intro: 'Sirio-makedona kalendaro kun makedonaj monatnomoj.', body: 'Sama strukturo kiel seleu\u0109ida kun makedonaj nomoj.', source: 'Julian conversion (Meeus, ch. 7) with Seleucid era and October year start. Each Macedonian month maps to a Julian month (Dios = Oct, ..., Hyperberetaios = Sep). Mapping after Bickerman, Chronology of the Ancient World (1980), app. IV.', months: '12 monatoj de oktobro kun makedonaj nomoj.' },
    rumi: { name: 'R\u016bm\u012b-kalendaro', type: 'Suna', intro: 'Fiska kaj civila kalendaro de la Osmana Imperio.', body: 'Julia kun jaro = julia jaro \u2212 584. Forigita de Turkio en 1926.', source: 'Julian conversion (Meeus, ch. 7). Post-1840 reform: Julian year = Rūmī year + 584, Jan–Dec structure. Ottoman fiscal reform decree of 13 March 1840.', months: '12 juliaj monatoj.' },
    roman: { name: 'Romia kalendaro', type: 'Suna', intro: 'La julia kalendaro kun tradicia romia datnotacio: Kalendoj, Nonoj kaj Idoj.', body: 'Uzas AUC-jarojn kun latinaj monatnomoj. Tagoj esprimatas per malanta\u016den-kalkulo de tri fiksaj punktoj: Kalendae (1-a), Nonae (5-a/7-a) kaj Idus (13-a/15-a).', source: 'Same Julian\u2192JDN conversion as AUC (Meeus, ch. 7, Varronian epoch 753 BCE). Roman day-counting rules from Bickerman, Chronology of the Ancient World (1980), ch. IV.', months: '12 monatoj kun latinaj nomoj.' },
    spanish: { name: 'Hispana epoko', type: 'Suna', intro: 'Era Hispanica de 38 a.K. Normo en Iberio dum pli ol mil jaroj.', body: 'Julia kun epok-\u015dovo de 38 jaroj.', source: 'Julian conversion (Meeus, ch. 7). Julian year = Spanish year − 38. Era Hispanica epoch: 1 January 38 BCE, marking the Roman conquest of Iberia.', months: '12 juliaj monatoj.' },
    antiochene: { name: 'Antio\u0125ia epoko', type: 'Suna', intro: 'Cezara epoko de Antio\u0125io de 49 a.K. (Batalo de Farsalo).', body: 'Julia kun oktobra jarenkonduko kaj epok-\u015dovo de 49 jaroj. Anstata\u016digis la seleu\u0109idan epokon en Antio\u0125io.', source: 'Julian conversion (Meeus, ch. 7) with October year start. Oct–Dec: Julian year = Y − 49; Jan–Sep: Julian year = Y − 48. Caesarean epoch: autumn 49 BCE (Battle of Pharsalus).', months: '12 monatoj de oktobro.' },
    olympiad: { name: 'Olimpiada kalendaro', type: 'Suna', intro: '4-jaraj cikloj de la unuaj Olimpikoj en 776 a.K.', body: 'Linia jarkalkulo de 776 a.K.', source: 'Julian conversion (Meeus, ch. 7). Linear year count: Julian year = Y − 776. Olympiad number = ⌊(Y−1)/4⌋ + 1, year within olympiad = ((Y−1) mod 4) + 1. Epoch: 776 BCE, the traditional date of the first Olympic Games.', months: '12 juliaj monatoj.' },
    hebrew: { name: 'Hebrea kalendaro', type: 'Lunsunsistemo', intro: 'Hebrea lunsuna kalendaro por religiaj okazoj. Epoko: 3761 a.K.', body: '19-jara ciklo kun 7 superjaroj aldonantaj Adar II. 353\u2013385 tagoj.', source: 'Reingold, E. M. & Dershowitz, N. Calendrical Calculations: The Ultimate Edition (2018), ch. 8, eqs. 8.1–8.25. Molad (mean conjunction): months = (235Y − 234)/19, parts = 12084 + 13753·months. Four dechiyot postpone New Year to avoid forbidden weekdays.', warning: 'Antaŭ ~359 p.K. (la tradicia dato de la reformo de Hilel la 2-a) la hebrea kalendaro estis observa: novaj monatoj estis deklaritaj de la Sinedrio laŭ atesto de vidantoj, kaj interkalaj monatoj estis aldonitaj per rabena decido. La aritmetika molad-algoritmo estas anakronismo por pli fruaj datoj.', months: '12 a\u016d 13 monatoj.' },
    babylonian: { name: 'Babilona kalendaro', type: 'Lunsunsistemo', intro: 'Antikva Mezopotamia lunsuna kalendaro, prapatro de la hebrea. Epoko de Nabonasaro (747 a.K.).', body: '19-jara ciklo kun Adaruo II. Aritmetika aproksimo per hebrea molado.', source: 'Parker, R. A. & Dubberstein, W. H. Babylonian Chronology 626 B.C.\u2013A.D. 75. (1956). Arithmetic approximation via Hebrew calendar molad.', months: '12 a\u016d 13 akadiaj monatoj.' },
    bp: { name: 'Anta\u016d la nuno', type: 'Suna', intro: 'Temskalo por arkeologio. Nuno = 1950.', body: 'Kalkulas malanta\u016den de 1950.', source: 'Simple offset: gregYear = 1950 − bpYear. Convention established by Libby, W. F. Radiocarbon Dating (1955). "Present" fixed at 1 January 1950 CE.', months: '12 gregoriaj monatoj.' },
    human: { name: 'Homa epoko', type: 'Suna', intro: 'Holocena epoko: +10000 jaroj al gregoria.', body: 'De Emiliani (1993). 12024 HE = 2024 p.K.', source: 'Simple offset: gregYear = heYear − 10000. Emiliani, C. "Calendar Reform," Nature 366 (1993), p. 716. "I propose to simply add 10,000 years to the current era."', months: '12 gregoriaj monatoj.' },
    methIntro: 'kalkal estas sendependa, retumil-bazita datkonvertilo konstruita tute per aritmetikaj algoritmoj. \u0108iuj konvertoj estas determinismaj, ripeteblaj kaj sendepende kontroleblaj.',
    methJDN: { title: 'Julia Tagnombro kiel pivoto', body: '\u0108iuj konvertoj pasas tra JDN \u2014 kontinua kalkulo de tagoj ekde la komenco de la julia periodo. \u0108iu kalendaro havas du funkciojn: dato\u2192JDN kaj JDN\u2192dato. Por konverti de A al B: A\u2192JDN\u2192B.', note: 'Astronomihistoria ilo, ne rilata al julia kalendaro. Scaliger, 1583.' },
    methArchitecture: { title: 'Arkitekturo kaj konstruo', body: 'kalkal funkcias tute en la retumilo sen eksteraj dependecoj a\u016d konstrupa\u015do. La komputila motoro estas ununura JavaScript-modulo (Cal) kun toJD() kaj fromJD() por \u0109iu el pli ol 20 kalendarsistemoj. Internaciigo en 4 lingvoj (EN, PL, AR, EO) kun plena RTL-subteno.', body2: 'Preskaŭ ĉiuj algoritmoj estas pure aritmetikaj \u2014 sen astronomiaj kalkuloj, sen API-vokoj, sen observdatumtabeloj. La sola escepto estas la babilona kalendaro, kiu uzas la observtabelojn de Parker & Dubberstein por 626 a.K.\u201345 p.K. (kun aritmetika proksimumo ekster tiu intervalo). Por ĉiuj aliaj kalendaroj, ĉiu konverto estas reproduktebla: sama enigo ĉiam donas saman eligon.' },
    methAlgorithms: { title: 'Algoritmaj fontoj', body: 'Gregoriaj kaj juliaj konvertoj la\u016d Meeus (1998). Tabela hi\u011dra uzas 30-jaran ciklon kun 4 variantoj (IIc defa\u016dlta). Suna hi\u011dra uzas la 2820-jaran ciklon de Birashk/Borkowski. Kopta, etiopa, egipta, jazdgerda kaj armena la\u016d Reingold & Dershowitz (2018). Hebrea implementas plenajn molad-regulojn. Bizanca, seleu\u0109ida, siria, rumi, AUC, hispana, olimpiada kaj makedona estas juliaj kun epok-\u015dovo.', warning: 'La tabela hiĝra kalendaro povas diferenci \u00b11\u20132 tagojn de observ-bazitaj kalendaroj. Ĝi estas por historia esploro, ne por religiaj datoj. Ne ekzistas sistematikaj tabeloj de observitaj hiĝraj datoj el la mezepoko; la saŭda kalendaro Umm al-Qura, bazita sur astronomia kalkulo, komenciĝas nur de 1356 AH (1937 p.K.).' },
    methValidation: { title: 'Validado kaj kontrolo', body: '\u0108iu konverto estas validata per tri sendependaj metodoj. Unue, rondira testo: dato konvertita al JDN kaj reen, konfirmante ke fromJD(toJD(dato)) === dato por centoj da testkazoj. Due, kruckontrolo kun sendependaj implementoj: Fourmilab-algoritmo, Intl.DateTimeFormat de la retumilo, kaj Python hijri-converter. Trie, komparo de konataj historiaj datoj (ekz. Batalo de Badr = 17 ramadan 2 AH = 13 marto 624) kun akademiaj fontoj.', body2: 'Testoj rulas en Node.js \u015dar\u011dante la retumilon-celitan Cal-modulon. Neniu testokadro uzata \u2014 la skriptoj eligas rezultojn rekte, farante la testaron mem a\u016dditeblaj sen dependecoj.' },
    methSources: { title: 'Fontoj', items: [
      ['Richards, E. G. ', 'Mapping Time', '. Oxford, 1998.'],
      ['Reingold & Dershowitz. ', 'Calendrical Calculations', '. Cambridge, 2018.'],
      ['Meeus, Jean. ', 'Astronomical Algorithms', '. Willmann-Bell, 1998.'],
      ['Borkowski, K. M. ', 'Astronomy and Astrophysics', ', 205 (1988).'],
      ['de Blois. "Ta\u02bfr\u012bkh" en ', 'Encyclopaedia of Islam', '.'],
      ['Birashk, Ahmad. ', 'A Comparative Calendar...', ' Mazda, 1993.']
    ] },
    methLinks: { title: 'Kovrado kaj similaj iloj' },
    about: {
      title: 'kalkal — Aŭtoro',
      bandCode: '// KARTO',
      namePrefix: 'd-ro',
      fieldLabel: 'fako',
      fieldValue: 'historio · arabistiko',
      projectLabel: 'projekto',
      projectValue: 'kalkal — datokonvertilo',
      licenseLabel: 'fontkodo',
      licenseValue: 'publike disponebla',
      note: 'La ilo estas senpaga. Se ĝi utilas al vi, vi povas regali min per kafo.',
      kofi: 'Regalu min per kafo'
    }
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
  ilkhani:     ['persianMonths',     '31,31,31,31,31,31,30,30,30,30,30,29/30',     '0,0,0,1,1,1,2,2,2,3,3,3'],
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
  roman:       ['romanMonths',      '31,28/29,31,30,31,30,31,31,30,31,30,31',     '3,3,0,0,0,1,1,1,2,2,2,3'],
  spanish:     ['gregorianMonths',   '31,28/29,31,30,31,30,31,31,30,31,30,31',     '3,3,0,0,0,1,1,1,2,2,2,3'],
  antiochene:  ['seleucidMonths',   '31,30,31,31,28/29,31,30,31,30,31,31,30',     '2,2,3,3,3,0,0,0,1,1,1,2'],
  olympiad:    ['gregorianMonths',   '31,28/29,31,30,31,30,31,31,30,31,30,31',     '3,3,0,0,0,1,1,1,2,2,2,3'],
  hebrew:      ['hebrewMonths',      '30,29/30,29/30,29,30,29/30,29,30,29,30,29,30,29', '2,2,2,3,3,3,0,0,0,0,1,1,1'],
  babylonian:  ['babylonianMonths',  '30,29,30,29,30,29,30,30,29/30,29,30,29/30,29',   '0,0,0,1,1,1,2,2,2,3,3,3,3'],
  bp:          ['gregorianMonths',   '31,28/29,31,30,31,30,31,31,30,31,30,31',     '3,3,0,0,0,1,1,1,2,2,2,3'],
  human:       ['gregorianMonths',   '31,28/29,31,30,31,30,31,31,30,31,30,31',     '3,3,0,0,0,1,1,1,2,2,2,3']
};

// Season labels per language
const SEASON_LABELS = {
  en: ['Spring', 'Summer', 'Autumn', 'Winter'],
  pl: ['Wiosna', 'Lato', 'Jesie\u0144', 'Zima'],
  eo: ['Printempo', 'Somero', 'A\u016dtuno', 'Vintro']
};

(() => {
  'use strict';

  function detectLang() {
    const supported = ['en', 'pl', 'eo'];
    for (const tag of navigator.languages || [navigator.language]) {
      const code = tag.toLowerCase().split('-')[0];
      if (supported.includes(code)) return code;
    }
    return 'en';
  }

  const currentLang = localStorage.getItem('kalkal-lang') || detectLang();

  function setPageLang(lang) {
    localStorage.setItem('kalkal-lang', lang);
    const t = PageI18N[lang];
    document.documentElement.lang = lang;
    document.documentElement.dir = 'ltr';

    document.querySelectorAll('[data-nav]').forEach(a => {
      const key = a.dataset.nav;
      if (t.nav[key]) a.textContent = t.nav[key];
    });

    const i18n = (typeof I18N !== 'undefined' && I18N[lang]) ? I18N[lang] : {};
    document.querySelectorAll('[data-i18n]').forEach(node => {
      const key = node.dataset.i18n;
      if (i18n[key]) node.textContent = i18n[key];
    });

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    const titleEl = document.getElementById('page-title');
    const subtitleEl = document.getElementById('page-subtitle');
    if (titleEl) {
      const appTitle = (i18n && i18n.appTitle) || 'Kalendar Kalkulator';
      const appSubtitle = (i18n && i18n.appSubtitle) || 'Multi-calendar date converter';
      titleEl.textContent = appTitle;
      if (subtitleEl) subtitleEl.textContent = appSubtitle;
      const page = document.body.dataset.page;
      const perPage = { calendars: t.calPageTitle, methodology: t.methPageTitle, dynasties: t.dynPageTitle };
      document.title = 'kalkal \u2014 ' + (perPage[page] || appTitle);
    }

    if (document.body.dataset.page === 'about' && t.about) {
      var a = t.about;
      document.title = a.title;
      document.querySelectorAll('[data-about]').forEach(function(el) {
        var key = el.dataset.about;
        if (a[key]) el.textContent = a[key];
      });
    }

    const CAL_GROUPS = [
      { group: 'universal', ids: ['human', 'bp'] },
      { group: 'christian', ids: ['gregorian', 'julian', 'byzantine', 'spanish'] },
      { group: 'islamic', ids: ['hijri', 'solarHijri', 'rumi'] },
      { group: 'iranian', ids: ['yazdgerdi', 'ilkhani'] },
      { group: 'semitic', ids: ['hebrew', 'syriac', 'antiochene', 'seleucid', 'babylonian'] },
      { group: 'african', ids: ['coptic', 'ethiopian', 'egyptian'] },
      { group: 'grecoRoman', ids: ['roman', 'olympiad', 'macedonian', 'alexandrian', 'armenian'] }
    ];
    const calOrder = CAL_GROUPS.flatMap(g => g.ids);
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
            // If season spans year boundary (has both high and low month numbers),
            // put the high months (e.g. 12) before low months (e.g. 1, 2)
            var nums = inSeason.map(function(m) { return m.num; });
            var maxN = Math.max.apply(null, nums), minN = Math.min.apply(null, nums);
            if (maxN - minN > 6) {
              inSeason.sort(function(a, b) {
                var aa = a.num <= 6 ? a.num + 12 : a.num;
                var bb = b.num <= 6 ? b.num + 12 : b.num;
                return aa - bb;
              });
            }
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
      // Render variant list items
      if (c.variantsItems) {
        var variantLis = section.querySelectorAll('[data-variant-id] .cal-variant-desc');
        variantLis.forEach(function(desc, i) {
          if (c.variantsItems[i]) desc.textContent = c.variantsItems[i];
        });
      }
      setT('.cal-variants-divergence', c.variantsDivergence);
      setT('.cal-source-text', c.source);
      if (c.source && t.sourceLabel) {
        var srcLabel = section.querySelector('.cal-source-label');
        if (srcLabel) srcLabel.textContent = t.sourceLabel;
      }
      setT('.cal-warning', c.warning);
    });

    // Group and reorder calendar cards and TOC
    var calContainer = document.querySelector('.main-content--prose');
    var tocList = document.querySelector('.cal-toc-list');
    if (calContainer && tocList) {
      var groupLabels = (i18n && i18n.calendarGroups) || {};
      // Remove old group headers
      calContainer.querySelectorAll('.cal-group-heading').forEach(function(el) { el.remove(); });
      // Reorder cards and insert group headers
      CAL_GROUPS.forEach(function(g) {
        var label = groupLabels[g.group] || g.group;
        var heading = document.createElement('h2');
        heading.className = 'cal-group-heading';
        heading.textContent = label;
        heading.id = 'group-' + g.group;
        calContainer.appendChild(heading);
        g.ids.forEach(function(id) {
          var card = calContainer.querySelector('[data-cal="' + id + '"]');
          if (card) calContainer.appendChild(card);
        });
      });
      // Rebuild TOC with groups
      while (tocList.firstChild) tocList.removeChild(tocList.firstChild);
      CAL_GROUPS.forEach(function(g) {
        var label = groupLabels[g.group] || g.group;
        var groupLi = document.createElement('li');
        groupLi.className = 'cal-toc-group';
        groupLi.textContent = label;
        tocList.appendChild(groupLi);
        g.ids.forEach(function(id) {
          var calName = (t[id] && t[id].name) || id;
          var li = document.createElement('li');
          var a = document.createElement('a');
          a.href = '#' + id;
          a.className = 'cal-toc-link';
          a.setAttribute('data-toc', id);
          a.textContent = calName;
          li.appendChild(a);
          tocList.appendChild(li);
        });
      });
    }

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

  // On desktop, expand all calendar formulas by default
  if (window.matchMedia('(min-width: 601px)').matches) {
    document.querySelectorAll('details.cal-formula').forEach(d => { d.open = true; });
  }

  // ---- Settings panel (mobile) ----
  (function() {
    var btn = document.getElementById('nav-settings-btn');
    var panel = document.getElementById('settings-panel');
    var backdrop = document.getElementById('settings-backdrop');
    if (!btn || !panel) return;

    var storedVariant = localStorage.getItem('kalkal-hijri-variant') || 'IIc';

    function openSettings() {
      panel.classList.add('open');
      backdrop.classList.add('open');
      panel.querySelectorAll('.settings-lang-btn').forEach(function(b) {
        b.classList.toggle('active', b.dataset.lang === currentLang);
      });
      panel.querySelectorAll('.settings-variant-btn').forEach(function(b) {
        b.classList.toggle('active', b.dataset.variant === storedVariant);
      });
    }

    function closeSettings() {
      panel.classList.remove('open');
      backdrop.classList.remove('open');
    }

    btn.addEventListener('click', openSettings);
    backdrop.addEventListener('click', closeSettings);
    var closeBtn = panel.querySelector('.settings-close');
    if (closeBtn) closeBtn.addEventListener('click', closeSettings);

    panel.querySelectorAll('.settings-lang-btn').forEach(function(b) {
      b.addEventListener('click', function() {
        setPageLang(b.dataset.lang);
        panel.querySelectorAll('.settings-lang-btn').forEach(function(x) {
          x.classList.toggle('active', x.dataset.lang === b.dataset.lang);
        });
      });
    });

    panel.querySelectorAll('.settings-variant-btn').forEach(function(b) {
      b.addEventListener('click', function() {
        storedVariant = b.dataset.variant;
        localStorage.setItem('kalkal-hijri-variant', storedVariant);
        panel.querySelectorAll('.settings-variant-btn').forEach(function(x) {
          x.classList.toggle('active', x.dataset.variant === storedVariant);
        });
      });
    });
  })();
})();

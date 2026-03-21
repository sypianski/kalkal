// kalkal — Internationalization strings
// Languages: English, Polish, Arabic, Esperanto

const I18N = {
  en: {
    appTitle: 'Kalendar Kalkulator',
    appSubtitle: 'Multi-calendar date converter',
    navConverter: 'Converter',
    navCalendars: 'Calendars',
    navMethodology: 'Methodology',
    navDynasties: 'Regnal Tables',
    navEclipses: 'Eclipses',
    fromCalendar: 'From',
    toDate: 'To (optional)',
    targetCalendar: 'Convert to',
    calendarPlaceholder: 'Calendar...',
    calendars: {
      hijri: 'Hijri', julian: 'Julian', gregorian: 'Gregorian',
      coptic: 'Coptic', ethiopian: 'Ethiopian', yazdgerdi: 'Zoroastrian',
      armenian: 'Armenian', solarHijri: 'Solar Hijri (Iranian)', ilkhani: 'Ilkhanid (Kh\u0101n\u012b)',
      byzantine: 'Byzantine',
      seleucid: 'Seleucid', syriac: 'Syriac', rumi: 'R\u016bm\u012b',
      egyptian: 'Egyptian',
      auc: 'Ab Urbe Condita', spanish: 'Spanish Era', antiochene: 'Antiochene Era',
      olympiad: 'Olympiad', macedonian: 'Macedonian',
      hebrew: 'Hebrew', babylonian: 'Babylonian',
      bp: 'Before Present', human: 'Human Era'
    },
    year: 'Year',
    month: 'Month',
    day: 'Day',
    convert: 'Convert',
    result: 'Result',
    jdn: 'Julian Day Number',
    dayOfWeek: 'Day of week',
    rangeSpans: 'spans from',
    to: 'to',
    overlappingMonths: 'Overlapping Hijri months',
    overlappingGregorian: 'Gregorian/Julian period',
    leapYear: 'Leap year',
    totalDays: 'days',
    monthBreakdown: 'Month breakdown',
    calendarNote: 'Dates before Oct 15, 1582 use the Julian calendar.',
    julianDateNote: 'This date precedes the Gregorian reform (1582). The Gregorian date shown is calculated proleptically — the Julian calendar is used here.',
    indictionLabel: 'Indiction',
    animalYearLabel: 'Animal year',
    ilkhaniAnimals: { Sichqan: 'Mouse', Ud: 'Ox', Bars: 'Leopard', Tavishqan: 'Hare', Luy: 'Crocodile', Yilan: 'Snake', Yund: 'Horse', Qoy: 'Sheep', Bichin: 'Monkey', Takigu: 'Hen', It: 'Dog', Tonguz: 'Pig' },
    babylonianPDNote: 'Observational date from Parker & Dubberstein tables (626 BCE \u2013 45 CE).',
    babylonianArithNote: 'Arithmetic approximation (outside Parker & Dubberstein range). May differ \u00b11\u20132 days from historical observation.',
    tabularNote: 'Tabular Islamic calendar (arithmetic). May differ \u00b11\u20132 days from observation-based calendars.',
    gregorianLabel: 'Gregorian',
    julianLabel: 'Julian',
    hijriLabel: 'Hijri (AH)',
    gregorianMonths: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    hijriMonths: [
      'Mu\u1e25arram', '\u1e62afar', 'Rab\u012b\u02bf al-Awwal', 'Rab\u012b\u02bf a\u1e6f-\u1e6e\u0101n\u012b',
      '\u01e6um\u0101d\u0101 al-\u016al\u0101', '\u01e6um\u0101d\u0101 al-\u0100\u1e2bira', 'Ra\u01e7ab', '\u0160a\u02bfb\u0101n',
      'Rama\u1e0d\u0101n', '\u0160aww\u0101l', '\u1e0e\u016b al-Qa\u02bfda', '\u1e0e\u016b al-\u1e24i\u01e7\u01e7a'
    ],
    copticMonths: [
      'Thout', 'Paopi', 'Hathor', 'Koiak', 'Tobi', 'Meshir',
      'Paremhat', 'Parmouti', 'Pashons', 'Paoni', 'Epip', 'Mesori', 'Epagomenai'
    ],
    ethiopianMonths: [
      'M\u00e4sk\u00e4r\u00e4m', '\u1e6c\u0259q\u0259mt', '\u1e24\u0259dar', 'Ta\u1e2b\u015ba\u015b', '\u1e6c\u0259r', 'Y\u00e4katit',
      'M\u00e4gabit', 'Miyazya', 'G\u0259nbot', 'S\u00e4ne', '\u1e24amle', 'N\u00e4hase', 'Pagum\u00e4n'
    ],
    persianMonths: [
      'Farvardin', 'Ordibehe\u0161t', '\u1e2aord\u0101d', 'Tir', 'Mord\u0101d', '\u0160ahrivar',
      'Mehr', '\u0100b\u0101n', '\u0100\u1e0far', 'Dey', 'Bahman', 'Esfand'
    ],
    armenianMonths: [
      'Navasard', 'Ho\u1e59i', 'Sahmi', 'Tr\u0113', 'K\u2019alo\u010b', 'Arac\u2019',
      'Mehekan', 'Areg', 'Ahekan', 'Mareri', 'Margac\u2019', 'Hrotic\u2019', 'Aweleac\u2019'
    ],
    byzantineMonths: [
      'September', 'October', 'November', 'December', 'January', 'February',
      'March', 'April', 'May', 'June', 'July', 'August'
    ],
    alexandrianMonths: [
      'March', 'April', 'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December', 'January', 'February'
    ],
    seleucidMonths: [
      'October', 'November', 'December', 'January', 'February', 'March',
      'April', 'May', 'June', 'July', 'August', 'September'
    ],
    seleucidBabMonths: [
      'April', 'May', 'June', 'July', 'August', 'September',
      'October', 'November', 'December', 'January', 'February', 'March'
    ],
    syriacMonths: [
      'K\u0101n\u016bn ath-Th\u0101n\u012b', 'Shb\u0101\u1e6d', '\u0100dh\u0101r', 'N\u012bs\u0101n', 'Ayy\u0101r', '\u1e24z\u012br\u0101n',
      'Tamm\u016bz', '\u0100b', 'Ayl\u016bl', 'Tishr\u012bn al-Awwal', 'Tishr\u012bn ath-Th\u0101n\u012b', 'K\u0101n\u016bn al-Awwal'
    ],
    egyptianMonths: [
      'Thoth', 'Phaophi', 'Athyr', 'Choiak', 'Tybi', 'Mechir',
      'Phamenoth', 'Pharmuthi', 'Pachons', 'Payni', 'Epiphi', 'Mesore', 'Epagomenai'
    ],
    macedonianMonths: [
      'Dios', 'Apellaios', 'Audynaios', 'Peritios', 'Dystros', 'Xanthikos',
      'Artemisios', 'Daisios', 'Panemos', 'Loos', 'Gorpiaios', 'Hyperberetaios'
    ],
    hebrewMonths: [
      'Tishrei', 'Cheshvan', 'Kislev', 'Tevet', 'Shevat',
      'Adar', 'Adar II', 'Nisan', 'Iyar', 'Sivan', 'Tammuz', 'Av', 'Elul'
    ],
    babylonianMonths: [
      'Nisannu', 'Ayaru', 'Simanu', 'Du\u02bbuzu', 'Abu', 'Ul\u016blu',
      'Tashr\u012btu', 'Ara\u1e2bsamna', 'Kislimu', 'T\u0323ebetu', 'Shaba\u1e6du', 'Addaru', 'Addaru II'
    ],
    zodiacSigns: [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ],
    zodiacLabel: 'Zodiac sign',
    eclipseLabel: 'Solar eclipse',
    eclipseViewMap: 'View eclipse map',
    eclipseViewCatalogue: 'Eclipse catalogue',
    eclipseTypes: { T: 'Total', A: 'Annular', H: 'Hybrid' },
    eclipseNotes: {
      crucifixion29: 'Total eclipse over the Near East \u2014 discussed in dating the Crucifixion',
      pliny59: 'Documented by Pliny the Elder in Natural History',
      jerusalem71: 'Eclipse near Jerusalem during the era of the Roman siege',
      elagabalus219: 'Total eclipse over Persia \u2014 reign of Elagabalus',
      julian364: 'Documented during Julian the Apostate\u2019s Persian campaign',
      theon393: 'First eclipse observation recorded by Theon of Alexandria',
      theon418: 'Observed by Theon of Alexandria, used to calibrate astronomical tables',
      proclus484: 'Documented by Marinus of Neapolis in the biography of Proclus',
      arabia590: 'Annular eclipse over Arabia \u2014 pre-Islamic period',
      ibrahim632: 'Eclipse at the death of Ibrahim, son of Prophet Muhammad',
      constantinople718: 'During the Arab siege of Constantinople',
      harun809: 'During the reign of Harun al-Rashid',
      louis840: 'Eclipse of Emperor Louis the Pious, seen as an omen of his death',
      biruni968: 'Observed and recorded by al-Biruni in Baghdad',
      crucifixion1033: 'Millennium of the Crucifixion \u2014 widely documented across Christendom',
      crusade1098: 'During the First Crusade, siege of Antioch',
      henry1133: 'King Henry\u2019s Eclipse \u2014 observed across Europe and the Levant',
      hattin1187: 'Year of the Battle of Hattin and Saladin\u2019s conquest of Jerusalem',
      mongols1241: 'During the Mongol invasion of the Middle East',
      constantinople1453: 'Months before the fall of Constantinople to Mehmed II'
    },
    moonPhaseLabel: 'Moon phase',
    moonPhases: {
      new: 'New Moon', waxingCrescent: 'Waxing Crescent', firstQuarter: 'First Quarter',
      waxingGibbous: 'Waxing Gibbous', full: 'Full Moon', waningGibbous: 'Waning Gibbous',
      lastQuarter: 'Last Quarter', waningCrescent: 'Waning Crescent'
    },
    moonAge: 'day',
    moonIllumination: 'illuminated',
    cometLabel: 'Comet',
    cometNames: { halley: "Halley's Comet", caesars: "Caesar's Comet", great: 'Great Comet' },
    cometNotes: {
      halley_m239: 'Earliest confirmed return \u2014 recorded by Chinese astronomers',
      halley_m86: 'Recorded in Babylonian tablets',
      halley_m11: 'Possible Star of Bethlehem candidate',
      halley_66: 'Recorded during the Jewish\u2013Roman wars',
      halley_141: 'Documented in Chinese and Roman sources',
      halley_451: 'Appeared during the campaigns of Attila the Hun',
      halley_530: 'Recorded by Procopius during the reign of Justinian',
      halley_607: 'Observed shortly before the rise of Islam',
      halley_684: 'Recorded in the Nuremberg Chronicle',
      halley_837: 'Closest approach to Earth in recorded history \u2014 observed by Louis the Pious',
      halley_1066: 'Depicted in the Bayeux Tapestry before the Battle of Hastings',
      halley_1301: 'Seen by Giotto di Bondone, inspiring the Star of Bethlehem in his Adoration of the Magi',
      halley_1456: 'Appeared during the Ottoman advance into Europe \u2014 Pope Callixtus III reportedly ordered prayers against it',
      caesars_44: 'Appeared after the assassination of Julius Caesar \u2014 interpreted as his deification',
      great_1106: 'Exceptionally bright, recorded across Europe and East Asia',
      great_1264: 'Visible for months \u2014 recorded by European and Chinese chroniclers',
      great_1472: 'One of the brightest comets of the 15th century'
    },
    supernovaLabel: 'Supernova',
    supernovaNotes: {
      sn185: 'Earliest recorded supernova \u2014 Chinese astronomers noted a "guest star" for 8 months',
      sn386: 'Recorded by Chinese astronomers in Sagittarius',
      sn393: 'Chinese "guest star" in Scorpius, visible for 8 months',
      sn1006: 'Brightest stellar event in recorded history \u2014 documented by Ibn al-Haytham, Ali ibn Ridwan, and Chinese, Japanese, and European observers',
      sn1054: 'Created the Crab Nebula \u2014 recorded by Chinese and Arab astronomers, possibly by Anasazi',
      sn1181: 'Recorded by Chinese and Japanese astronomers in Cassiopeia',
      sn1572: "Tycho's Star \u2014 shattered the Aristotelian doctrine of celestial immutability",
      sn1604: "Kepler's Star \u2014 the last supernova observed in the Milky Way with the naked eye"
    },
    conjunctionLabel: 'Conjunction',
    conjunctionNotes: {
      bethlehem_m7: 'Triple conjunction of Jupiter and Saturn in Pisces \u2014 a leading candidate for the Star of Bethlehem',
      bethlehem_m2: 'Jupiter\u2013Venus conjunction \u2014 another Star of Bethlehem candidate'
    },
    planetNames: {
      jupiter: 'Jupiter', saturn: 'Saturn', venus: 'Venus', mars: 'Mars', mercury: 'Mercury'
    },
    weekdays: [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday',
      'Thursday', 'Friday', 'Saturday'
    ],
    errNoFromCal: 'Enter a source calendar (e.g. Hijri, Julian, Gregorian)',
    errNoToCal: 'Enter a target calendar',
    errSameCal: 'Source and target calendars must be different',
    errNoYear: 'Enter a year',
    errUnknownCal: 'Unknown calendar: ',
    errInvalidMonth: 'Month must be 1\u201312',
    errInvalidDay: 'Invalid day for this month',
    history: 'History',
    copyResult: 'Copy',
    copied: 'Copied!',
    clearHistory: 'Clear',
    noHistory: 'No conversions yet',
    langName: 'English',
    aiPlaceholder: 'Ask AI: e.g. "Battle of Hattin", "15 Ramadan 1445", "death of Harun al-Rashid"...',
    aiLimit: 'Daily limit reached (10/10). Resets at midnight.',
    aiError: 'AI query failed. Try again.',
    aiLoading: 'Thinking...',
    aiSetKey: 'Set API key',
    aiKeyPrompt: 'Enter your Gemini API key:',
    aiRemaining: 'remaining today'
  },

  pl: {
    appTitle: 'Kalkulator kalendarzy',
    appSubtitle: 'Wielokalendarzowy konwerter dat',
    navConverter: 'Konwerter',
    navCalendars: 'Kalendarze',
    navMethodology: 'Metodologia',
    navDynasties: 'Tablice panowa\u0144',
    navEclipses: 'Za\u0107mienia',
    fromCalendar: 'Z',
    toDate: 'Do (opcjonalnie)',
    targetCalendar: 'Przelicz na',
    calendarPlaceholder: 'Kalendarz...',
    calendars: {
      hijri: 'Hid\u017cry', julian: 'Julia\u0144ski', gregorian: 'Gregoria\u0144ski',
      coptic: 'Koptyjski', ethiopian: 'Etiopski', yazdgerdi: 'Zoroastryjski',
      armenian: 'Ormia\u0144ski', solarHijri: 'Ira\u0144ski', ilkhani: 'Ilchanid\u00f3w (Kh\u0101n\u012b)',
      byzantine: 'Bizanty\u0144ski',
      seleucid: 'Seleucydzki', syriac: 'Syryjski', rumi: 'R\u016bm\u012b (osma\u0144ski)',
      egyptian: 'Egipski',
      auc: 'Ab Urbe Condita', spanish: 'Era hiszpa\u0144ska', antiochene: 'Era antioche\u0144ska',
      olympiad: 'Olimpiady', macedonian: 'Macedo\u0144ski',
      hebrew: 'Hebrajski', babylonian: 'Babilo\u0144ski',
      bp: 'Przed tera\u017aniejszo\u015bci\u0105', human: 'Era ludzka'
    },
    year: 'Rok',
    month: 'Miesi\u0105c',
    day: 'Dzie\u0144',
    convert: 'Przelicz',
    result: 'Wynik',
    jdn: 'Julia\u0144ski Dzie\u0144 Numer',
    dayOfWeek: 'Dzie\u0144 tygodnia',
    rangeSpans: 'obejmuje okres od',
    to: 'do',
    overlappingMonths: 'Pokrywaj\u0105ce si\u0119 miesi\u0105ce hid\u017cry',
    overlappingGregorian: 'Okres gregoria\u0144ski/julia\u0144ski',
    leapYear: 'Rok przest\u0119pny',
    totalDays: 'dni',
    monthBreakdown: 'Rozk\u0142ad miesi\u0119cy',
    calendarNote: 'Daty przed 15.10.1582 u\u017cywaj\u0105 kalendarza julia\u0144skiego.',
    julianDateNote: 'Data sprzed reformy gregoria\u0144skiej (1582). Podana data gregoria\u0144ska jest obliczona proleptycznie \u2014 w rzeczywisto\u015bci u\u017cyty jest tu kalendarz julia\u0144ski.',
    indictionLabel: 'Indykcja',
    animalYearLabel: 'Rok zwierz\u0119cy',
    ilkhaniAnimals: { Sichqan: 'Mysz', Ud: 'W\u00f3\u0142', Bars: 'Lampart', Tavishqan: 'Zaj\u0105c', Luy: 'Krokodyl', Yilan: 'W\u0105\u017c', Yund: 'Ko\u0144', Qoy: 'Owca', Bichin: 'Ma\u0142pa', Takigu: 'Kura', It: 'Pies', Tonguz: '\u015awinia' },
    babylonianPDNote: 'Data obserwacyjna z tablic Parkera i Dubbersteina (626 p.n.e. \u2013 45 n.e.).',
    babylonianArithNote: 'Aproksymacja arytmetyczna (poza zakresem tablic Parkera i Dubbersteina). Mo\u017ce r\u00f3\u017cni\u0107 si\u0119 o \u00b11\u20132 dni od historycznej obserwacji.',
    tabularNote: 'Tabularyczny kalendarz islamski (arytmetyczny). Mo\u017ce si\u0119 r\u00f3\u017cni\u0107 o \u00b11\u20132 dni od kalendarzy obserwacyjnych.',
    gregorianLabel: 'Gregoria\u0144ski',
    julianLabel: 'Julia\u0144ski',
    hijriLabel: 'Hid\u017cry (AH)',
    gregorianMonths: [
      'Stycze\u0144', 'Luty', 'Marzec', 'Kwiecie\u0144', 'Maj', 'Czerwiec',
      'Lipiec', 'Sierpie\u0144', 'Wrzesie\u0144', 'Pa\u017adziernik', 'Listopad', 'Grudzie\u0144'
    ],
    hijriMonths: [
      'Muharram', 'Safar', 'Rabi al-awwal', 'Rabi as-sani',
      'D\u017cumada al-ula', 'D\u017cumada al-ahira', 'Rad\u017cab', 'Szaban',
      'Ramadan', 'Szawwal', 'Zu al-kada', 'Zu al-hid\u017cd\u017ca'
    ],
    copticMonths: [
      'Tout', 'Babah', 'Hator', 'Kiahk', 'Toba', 'Amszir',
      'Baramhat', 'Baramouda', 'Baszans', 'Baona', 'Abib', 'Misra', 'Epagomenai'
    ],
    ethiopianMonths: [
      'M\u00e4sk\u00e4r\u00e4m', 'T\u0259k\u0259mt', 'H\u0259dar', 'Tahsas', 'T\u0259r', 'J\u00e4katit',
      'M\u00e4gabit', 'Mijazja', 'G\u0259nbot', 'S\u00e4ne', 'Hamle', 'N\u00e4hase', 'Pagumen'
    ],
    persianMonths: [
      'Farwardin', 'Ordibeheszt', 'Chord\u0101d', 'Tir', 'Mord\u0101d', 'Szahriwar',
      'Mehr', '\u0100b\u0101n', '\u0100sar', 'D\u00e9i', 'Bahman', 'Esfand'
    ],
    armenianMonths: [
      'Nawasard', 'Hori', 'Sahmi', 'Tre', 'Kaloc\u2019', 'Arac\u2019',
      'Mehekan', 'Areg', 'Ahekan', 'Mareri', 'Margac\u2019', 'Hrotic\u2019', 'Aweleac\u2019'
    ],
    byzantineMonths: [
      'Wrzesie\u0144', 'Pa\u017adziernik', 'Listopad', 'Grudzie\u0144', 'Stycze\u0144', 'Luty',
      'Marzec', 'Kwiecie\u0144', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpie\u0144'
    ],
    alexandrianMonths: [
      'Marzec', 'Kwiecie\u0144', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpie\u0144',
      'Wrzesie\u0144', 'Pa\u017adziernik', 'Listopad', 'Grudzie\u0144', 'Stycze\u0144', 'Luty'
    ],
    seleucidMonths: [
      'Pa\u017adziernik', 'Listopad', 'Grudzie\u0144', 'Stycze\u0144', 'Luty', 'Marzec',
      'Kwiecie\u0144', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpie\u0144', 'Wrzesie\u0144'
    ],
    seleucidBabMonths: [
      'Kwiecie\u0144', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpie\u0144', 'Wrzesie\u0144',
      'Pa\u017adziernik', 'Listopad', 'Grudzie\u0144', 'Stycze\u0144', 'Luty', 'Marzec'
    ],
    syriacMonths: [
      'Kanun as-Sani', 'Szubat', 'Azar', 'Nisan', 'Ajjar', 'Haziran',
      'Tammuz', 'Ab', 'Ajlul', 'Tiszrin al-Awwal', 'Tiszrin as-Sani', 'Kanun al-Awwal'
    ],
    egyptianMonths: [
      'Thot', 'Faofi', 'Atyr', 'Choiak', 'Tybi', 'Mechir',
      'Famenot', 'Farmuti', 'Pachons', 'Pajni', 'Epifi', 'Mesore', 'Epagomenai'
    ],
    macedonianMonths: [
      'Dios', 'Apellajos', 'Audynajos', 'Peritios', 'Dystros', 'Ksantikos',
      'Artemisios', 'Dajsios', 'Panemos', 'Loos', 'Gorpiajos', 'Hyperberetajos'
    ],
    hebrewMonths: [
      'Tiszri', 'Cheszwan', 'Kislew', 'Tewet', 'Szwat',
      'Adar', 'Adar II', 'Nisan', 'Ijar', 'Siwan', 'Tamuz', 'Aw', 'Elul'
    ],
    babylonianMonths: [
      'Nisannu', 'Ajaru', 'Simanu', 'Du\u02bbuzu', 'Abu', 'Ul\u016blu',
      'Tashritu', 'Arachsamna', 'Kislimu', 'Tebetu', 'Szabatu', 'Addaru', 'Addaru II'
    ],
    zodiacSigns: [
      'Baran', 'Byk', 'Bli\u017ani\u0119ta', 'Rak', 'Lew', 'Panna',
      'Waga', 'Skorpion', 'Strzelec', 'Kozioro\u017cec', 'Wodnik', 'Ryby'
    ],
    zodiacLabel: 'Znak zodiaku',
    eclipseLabel: 'Za\u0107mienie S\u0142o\u0144ca',
    eclipseViewMap: 'Zobacz map\u0119 za\u0107mienia',
    eclipseViewCatalogue: 'Katalog za\u0107mie\u0144',
    eclipseTypes: { T: 'Ca\u0142kowite', A: 'Obr\u0105czkowe', H: 'Hybrydowe' },
    eclipseNotes: {
      crucifixion29: 'Ca\u0142kowite nad Bliskim Wschodem \u2014 omawiane przy datowaniu Ukrzy\u017cowania',
      pliny59: 'Udokumentowane przez Pliniusza Starszego w Historia Naturalis',
      jerusalem71: 'W pobli\u017cu Jerozolimy w epoce obl\u0119\u017cenia rzymskiego',
      elagabalus219: 'Ca\u0142kowite nad Persj\u0105 \u2014 panowanie Heliogabala',
      julian364: 'Udokumentowane podczas wyprawy perskiej Juliana Apostaty',
      theon393: 'Pierwsza obserwacja odnotowana przez Teona z Aleksandrii',
      theon418: 'Obserwowane przez Teona z Aleksandrii, u\u017cyte do kalibracji tablic astronomicznych',
      proclus484: 'Udokumentowane przez Marinusa z Neapolis w biografii Proklosa',
      arabia590: 'Obr\u0105czkowe nad Arabi\u0105 \u2014 okres przedislamski',
      ibrahim632: 'Za\u0107mienie w dniu \u015bmierci Ibrahima, syna Proroka Mahometa',
      constantinople718: 'Podczas arabskiego obl\u0119\u017cenia Konstantynopola',
      harun809: 'Za rz\u0105d\u00f3w Haruna ar-Raszida',
      louis840: 'Za\u0107mienie cesarza Ludwika Pobo\u017cnego, uznane za omen jego \u015bmierci',
      biruni968: 'Obserwowane i opisane przez al-Biruniego w Bagdadzie',
      crucifixion1033: 'Milenium Ukrzy\u017cowania \u2014 szeroko udokumentowane w \u015bwiecie chrze\u015bcija\u0144skim',
      crusade1098: 'Podczas pierwszej krucjaty, obl\u0119\u017cenie Antiochii',
      henry1133: 'Za\u0107mienie kr\u00f3la Henryka \u2014 obserwowane w Europie i Lewancie',
      hattin1187: 'Rok bitwy pod Hattin i podboju Jerozolimy przez Saladyna',
      mongols1241: 'Podczas inwazji mongo\u0142\u00f3w na Bliski Wsch\u00f3d',
      constantinople1453: 'Na miesi\u0105ce przed upadkiem Konstantynopola'
    },
    moonPhaseLabel: 'Faza Ksi\u0119\u017cyca',
    moonPhases: {
      new: 'N\u00f3w', waxingCrescent: 'M\u0142ody Ksi\u0119\u017cyc', firstQuarter: 'Pierwsza kwadra',
      waxingGibbous: 'Ksi\u0119\u017cyc rosn\u0105cy', full: 'Pe\u0142nia', waningGibbous: 'Ksi\u0119\u017cyc malej\u0105cy',
      lastQuarter: 'Ostatnia kwadra', waningCrescent: 'Stary Ksi\u0119\u017cyc'
    },
    moonAge: 'dzie\u0144',
    moonIllumination: 'o\u015bwietlenia',
    cometLabel: 'Kometa',
    cometNames: { halley: 'Kometa Halleya', caesars: 'Kometa Cezara', great: 'Wielka Kometa' },
    cometNotes: {
      halley_m239: 'Najwcze\u015bniejszy potwierdzony powrot \u2014 odnotowany przez chi\u0144skich astronom\u00f3w',
      halley_m86: 'Odnotowany na babilo\u0144skich tabliczkach',
      halley_m11: 'Mo\u017cliwy kandydat na Gwiazd\u0119 Betlejemsk\u0105',
      halley_66: 'Odnotowana podczas wojen \u017cydowsko-rzymskich',
      halley_141: 'Udokumentowana w \u017ar\u00f3d\u0142ach chi\u0144skich i rzymskich',
      halley_451: 'Pojawi\u0142a si\u0119 podczas kampanii Attyli',
      halley_530: 'Odnotowana przez Prokopiusza za panowania Justyniana',
      halley_607: 'Obserwowana kr\u00f3tko przed narodzinami islamu',
      halley_684: 'Odnotowana w Kronice Norymberskiej',
      halley_837: 'Najbli\u017csze podej\u015bcie do Ziemi w historii \u2014 obserwowana przez Ludwika Pobo\u017cnego',
      halley_1066: 'Przedstawiona na Tkaninie z Bayeux przed bitw\u0105 pod Hastings',
      halley_1301: 'Widziana przez Giotta di Bondone, inspiracja do Gwiazdy Betlejemskiej w jego Pok\u0142onie Trzech Kr\u00f3li',
      halley_1456: 'Pojawi\u0142a si\u0119 podczas post\u0119p\u00f3w osmańskich w Europie \u2014 papie\u017c Kalikst III podobno zarz\u0105dzi\u0142 modlitwy przeciw niej',
      caesars_44: 'Pojawi\u0142a si\u0119 po zab\u00f3jstwie Juliusza Cezara \u2014 interpretowana jako jego apoteoza',
      great_1106: 'Wyj\u0105tkowo jasna, odnotowana w Europie i Azji Wschodniej',
      great_1264: 'Widoczna przez miesi\u0105ce \u2014 odnotowana przez europejskich i chi\u0144skich kronikarz\u00f3w',
      great_1472: 'Jedna z najja\u015bniejszych komet XV wieku'
    },
    supernovaLabel: 'Supernowa',
    supernovaNotes: {
      sn185: 'Najwcze\u015bniejsza odnotowana supernowa \u2014 chi\u0144scy astronomowie obserwowali "go\u015bcinn\u0105 gwiazd\u0119" przez 8 miesi\u0119cy',
      sn386: 'Odnotowana przez chi\u0144skich astronom\u00f3w w Strzelcu',
      sn393: 'Chi\u0144ska "go\u015bcinna gwiazda" w Skorpionie, widoczna przez 8 miesi\u0119cy',
      sn1006: 'Najja\u015bniejsze zdarzenie gwiazdowe w historii \u2014 udokumentowane przez Ibn al-Hajsama, Alego ibn Ridwana, chi\u0144skich, japo\u0144skich i europejskich obserwator\u00f3w',
      sn1054: 'Stworzy\u0142a Mgławic\u0119 Kraba \u2014 odnotowana przez chi\u0144skich i arabskich astronom\u00f3w',
      sn1181: 'Odnotowana przez chi\u0144skich i japo\u0144skich astronom\u00f3w w Kasjopei',
      sn1572: 'Gwiazda Tychona \u2014 obali\u0142a arystotelesowsk\u0105 doktryn\u0119 niezmienno\u015bci niebios',
      sn1604: 'Gwiazda Keplera \u2014 ostatnia supernowa w Drodze Mlecznej widziana go\u0142ym okiem'
    },
    conjunctionLabel: 'Koniunkcja',
    conjunctionNotes: {
      bethlehem_m7: 'Potrojna koniunkcja Jowisza i Saturna w Rybach \u2014 czo\u0142owy kandydat na Gwiazd\u0119 Betlejemsk\u0105',
      bethlehem_m2: 'Koniunkcja Jowisz\u2013Wenus \u2014 kolejny kandydat na Gwiazd\u0119 Betlejemsk\u0105'
    },
    planetNames: {
      jupiter: 'Jowisz', saturn: 'Saturn', venus: 'Wenus', mars: 'Mars', mercury: 'Merkury'
    },
    weekdays: [
      'Niedziela', 'Poniedzia\u0142ek', 'Wtorek', '\u015aroda',
      'Czwartek', 'Pi\u0105tek', 'Sobota'
    ],
    errNoFromCal: 'Wpisz kalendarz \u017ar\u00f3d\u0142owy (np. Hid\u017cry, Julia\u0144ski, Gregoria\u0144ski)',
    errNoToCal: 'Wpisz kalendarz docelowy',
    errSameCal: 'Kalendarze \u017ar\u00f3d\u0142owy i docelowy musz\u0105 si\u0119 r\u00f3\u017cni\u0107',
    errNoYear: 'Wpisz rok',
    errUnknownCal: 'Nieznany kalendarz: ',
    errInvalidMonth: 'Miesi\u0105c musi by\u0107 1\u201312',
    errInvalidDay: 'Nieprawid\u0142owy dzie\u0144 dla tego miesi\u0105ca',
    history: 'Historia',
    copyResult: 'Kopiuj',
    copied: 'Skopiowano!',
    clearHistory: 'Wyczyść',
    noHistory: 'Brak przeliczeń',
    langName: 'Polski',
    aiPlaceholder: 'Zapytaj AI: np. "bitwa pod Hattin", "15 Ramadan 1445", "zgon Haruna ar-Raszida"...',
    aiLimit: 'Dzienny limit wyczerpany (10/10). Reset o p\u00f3\u0142nocy.',
    aiError: 'Zapytanie AI nie powiod\u0142o si\u0119. Spr\u00f3buj ponownie.',
    aiLoading: 'My\u015bl\u0119...',
    aiSetKey: 'Ustaw klucz API',
    aiKeyPrompt: 'Podaj klucz API Gemini:',
    aiRemaining: 'pozosta\u0142o dzi\u015b'
  },

  ar: {
    appTitle: '\u062d\u0627\u0633\u0628\u0629 \u0627\u0644\u062a\u0642\u0627\u0648\u064a\u0645',
    appSubtitle: '\u0645\u062d\u0648\u0651\u0644 \u062a\u0648\u0627\u0631\u064a\u062e \u0645\u062a\u0639\u062f\u062f \u0627\u0644\u062a\u0642\u0627\u0648\u064a\u0645',
    navConverter: '\u0627\u0644\u0645\u062d\u0648\u0651\u0644',
    navCalendars: '\u0627\u0644\u062a\u0642\u0627\u0648\u064a\u0645',
    navMethodology: '\u0627\u0644\u0645\u0646\u0647\u062c\u064a\u0629',
    navDynasties: '\u062c\u062f\u0627\u0648\u0644 \u0627\u0644\u062d\u0643\u0645',
    navEclipses: '\u0643\u0633\u0648\u0641\u0627\u062a',
    fromCalendar: '\u0645\u0646',
    toDate: '\u0625\u0644\u0649 (\u0627\u062e\u062a\u064a\u0627\u0631\u064a)',
    targetCalendar: '\u062a\u062d\u0648\u064a\u0644 \u0625\u0644\u0649',
    calendarPlaceholder: '\u0627\u0644\u062a\u0642\u0648\u064a\u0645...',
    calendars: {
      hijri: '\u0647\u062c\u0631\u064a', julian: '\u064a\u0648\u0644\u064a\u0627\u0646\u064a', gregorian: '\u0645\u064a\u0644\u0627\u062f\u064a',
      coptic: '\u0642\u0628\u0637\u064a', ethiopian: '\u0625\u062b\u064a\u0648\u0628\u064a', yazdgerdi: '\u0632\u0631\u0627\u062f\u0634\u062a\u064a',
      armenian: '\u0623\u0631\u0645\u0646\u064a', solarHijri: '\u0647\u062c\u0631\u064a \u0634\u0645\u0633\u064a', ilkhani: '\u0625\u064a\u0644\u062e\u0627\u0646\u064a (\u062e\u0627\u0646\u064a)',
      byzantine: '\u0628\u064a\u0632\u0646\u0637\u064a',
      seleucid: '\u0633\u0644\u0648\u0642\u064a', syriac: '\u0633\u0631\u064a\u0627\u0646\u064a', rumi: '\u0631\u0648\u0645\u064a',
      egyptian: '\u0645\u0635\u0631\u064a',
      auc: '\u0645\u0646\u0630 \u062a\u0623\u0633\u064a\u0633 \u0631\u0648\u0645\u0627', spanish: '\u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u0625\u0633\u0628\u0627\u0646\u064a', antiochene: '\u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u0623\u0646\u0637\u0627\u0643\u064a',
      olympiad: '\u0627\u0644\u0623\u0648\u0644\u0645\u0628\u064a\u0627\u062f', macedonian: '\u0645\u0642\u062f\u0648\u0646\u064a',
      hebrew: '\u0639\u0628\u0631\u064a', babylonian: '\u0628\u0627\u0628\u0644\u064a',
      bp: '\u0642\u0628\u0644 \u0627\u0644\u062d\u0627\u0636\u0631', human: '\u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u0628\u0634\u0631\u064a'
    },
    year: '\u0627\u0644\u0633\u0646\u0629',
    month: '\u0627\u0644\u0634\u0647\u0631',
    day: '\u0627\u0644\u064a\u0648\u0645',
    convert: '\u062a\u062d\u0648\u064a\u0644',
    result: '\u0627\u0644\u0646\u062a\u064a\u062c\u0629',
    jdn: '\u0631\u0642\u0645 \u0627\u0644\u064a\u0648\u0645 \u0627\u0644\u064a\u0648\u0644\u064a\u0627\u0646\u064a',
    dayOfWeek: '\u064a\u0648\u0645 \u0627\u0644\u0623\u0633\u0628\u0648\u0639',
    rangeSpans: '\u064a\u0645\u062a\u062f \u0645\u0646',
    to: '\u0625\u0644\u0649',
    overlappingMonths: '\u0627\u0644\u0623\u0634\u0647\u0631 \u0627\u0644\u0647\u062c\u0631\u064a\u0629 \u0627\u0644\u0645\u062a\u062f\u0627\u062e\u0644\u0629',
    overlappingGregorian: '\u0627\u0644\u0641\u062a\u0631\u0629 \u0627\u0644\u0645\u064a\u0644\u0627\u062f\u064a\u0629/\u0627\u0644\u064a\u0648\u0644\u064a\u0627\u0646\u064a\u0629',
    leapYear: '\u0633\u0646\u0629 \u0643\u0628\u064a\u0633\u0629',
    totalDays: '\u064a\u0648\u0645',
    monthBreakdown: '\u062a\u0641\u0635\u064a\u0644 \u0627\u0644\u0623\u0634\u0647\u0631',
    calendarNote: '\u0627\u0644\u062a\u0648\u0627\u0631\u064a\u062e \u0642\u0628\u0644 15 \u0623\u0643\u062a\u0648\u0628\u0631 1582 \u062a\u0633\u062a\u062e\u062f\u0645 \u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u064a\u0648\u0644\u064a\u0627\u0646\u064a.',
    julianDateNote: '\u0647\u0630\u0627 \u0627\u0644\u062a\u0627\u0631\u064a\u062e \u0633\u0627\u0628\u0642 \u0644\u0644\u0625\u0635\u0644\u0627\u062d \u0627\u0644\u063a\u0631\u064a\u063a\u0648\u0631\u064a (1582). \u0627\u0644\u062a\u0627\u0631\u064a\u062e \u0627\u0644\u063a\u0631\u064a\u063a\u0648\u0631\u064a \u0627\u0644\u0645\u0639\u0631\u0648\u0636 \u0645\u062d\u0633\u0648\u0628 \u0627\u0633\u062a\u0628\u0627\u0642\u064a\u064b\u0627 \u2014 \u0627\u0644\u0645\u0633\u062a\u062e\u062f\u0645 \u0647\u0646\u0627 \u0647\u0648 \u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u064a\u0648\u0644\u064a\u0627\u0646\u064a.',
    indictionLabel: '\u0627\u0644\u0625\u0646\u062f\u0643\u062a\u064a\u0648\u0646',
    animalYearLabel: '\u0633\u0646\u0629 \u0627\u0644\u062d\u064a\u0648\u0627\u0646',
    ilkhaniAnimals: { Sichqan: '\u0641\u0623\u0631', Ud: '\u062b\u0648\u0631', Bars: '\u0646\u0645\u0631', Tavishqan: '\u0623\u0631\u0646\u0628', Luy: '\u062a\u0645\u0633\u0627\u062d', Yilan: '\u0623\u0641\u0639\u0649', Yund: '\u062d\u0635\u0627\u0646', Qoy: '\u062e\u0631\u0648\u0641', Bichin: '\u0642\u0631\u062f', Takigu: '\u062f\u062c\u0627\u062c\u0629', It: '\u0643\u0644\u0628', Tonguz: '\u062e\u0646\u0632\u064a\u0631' },
    babylonianPDNote: '\u062a\u0627\u0631\u064a\u062e \u0631\u0635\u062f\u064a \u0645\u0646 \u062c\u062f\u0627\u0648\u0644 \u0628\u0627\u0631\u0643\u0631 \u0648\u062f\u0648\u0628\u0631\u0634\u062a\u0627\u064a\u0646 (\u0666\u0662\u0666 \u0642.\u0645. \u2013 \u0664\u0665 \u0645.).',
    babylonianArithNote: '\u062a\u0642\u0631\u064a\u0628 \u062d\u0633\u0627\u0628\u064a (\u062e\u0627\u0631\u062c \u0646\u0637\u0627\u0642 \u062c\u062f\u0627\u0648\u0644 \u0628\u0627\u0631\u0643\u0631 \u0648\u062f\u0648\u0628\u0631\u0634\u062a\u0627\u064a\u0646). \u0642\u062f \u064a\u062e\u062a\u0644\u0641 \u0628\u0640\u00b1\u0661\u2013\u0662 \u064a\u0648\u0645.',
    tabularNote: '\u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u0625\u0633\u0644\u0627\u0645\u064a \u0627\u0644\u062c\u062f\u0648\u0644\u064a (\u062d\u0633\u0627\u0628\u064a). \u0642\u062f \u064a\u062e\u062a\u0644\u0641 \u0628\u0640\u00b11\u20132 \u064a\u0648\u0645 \u0639\u0646 \u0627\u0644\u062a\u0642\u0627\u0648\u064a\u0645 \u0627\u0644\u0642\u0627\u0626\u0645\u0629 \u0639\u0644\u0649 \u0627\u0644\u0631\u0624\u064a\u0629.',
    gregorianLabel: '\u0645\u064a\u0644\u0627\u062f\u064a',
    julianLabel: '\u064a\u0648\u0644\u064a\u0627\u0646\u064a',
    hijriLabel: '\u0647\u062c\u0631\u064a',
    gregorianMonths: [
      '\u064a\u0646\u0627\u064a\u0631', '\u0641\u0628\u0631\u0627\u064a\u0631', '\u0645\u0627\u0631\u0633', '\u0623\u0628\u0631\u064a\u0644', '\u0645\u0627\u064a\u0648', '\u064a\u0648\u0646\u064a\u0648',
      '\u064a\u0648\u0644\u064a\u0648', '\u0623\u063a\u0633\u0637\u0633', '\u0633\u0628\u062a\u0645\u0628\u0631', '\u0623\u0643\u062a\u0648\u0628\u0631', '\u0646\u0648\u0641\u0645\u0628\u0631', '\u062f\u064a\u0633\u0645\u0628\u0631'
    ],
    hijriMonths: [
      '\u0645\u062d\u0631\u0645', '\u0635\u0641\u0631', '\u0631\u0628\u064a\u0639 \u0627\u0644\u0623\u0648\u0644', '\u0631\u0628\u064a\u0639 \u0627\u0644\u062b\u0627\u0646\u064a',
      '\u062c\u0645\u0627\u062f\u0649 \u0627\u0644\u0623\u0648\u0644\u0649', '\u062c\u0645\u0627\u062f\u0649 \u0627\u0644\u0622\u062e\u0631\u0629', '\u0631\u062c\u0628', '\u0634\u0639\u0628\u0627\u0646',
      '\u0631\u0645\u0636\u0627\u0646', '\u0634\u0648\u0627\u0644', '\u0630\u0648 \u0627\u0644\u0642\u0639\u062f\u0629', '\u0630\u0648 \u0627\u0644\u062d\u062c\u0629'
    ],
    copticMonths: [
      '\u062a\u0648\u062a', '\u0628\u0627\u0628\u0647', '\u0647\u0627\u062a\u0648\u0631', '\u0643\u064a\u0647\u0643', '\u0637\u0648\u0628\u0629', '\u0623\u0645\u0634\u064a\u0631',
      '\u0628\u0631\u0645\u0647\u0627\u062a', '\u0628\u0631\u0645\u0648\u062f\u0629', '\u0628\u0634\u0646\u0633', '\u0628\u0624\u0648\u0646\u0629', '\u0623\u0628\u064a\u0628', '\u0645\u0633\u0631\u0649', '\u0627\u0644\u0646\u0633\u064a\u0621'
    ],
    ethiopianMonths: [
      '\u0645\u0633\u0643\u0631\u0645', '\u0637\u0642\u0645\u062a', '\u062e\u062f\u0627\u0631', '\u0637\u062e\u0633\u0627\u0633', '\u0637\u0631', '\u064a\u0643\u0627\u062a\u064a\u062a',
      '\u0645\u063a\u0627\u0628\u064a\u062a', '\u0645\u064a\u0627\u0632\u064a\u0627', '\u063a\u0646\u0628\u0648\u062a', '\u0633\u0627\u0646\u064a', '\u062d\u0645\u0644\u064a', '\u0646\u0647\u0627\u0633\u064a', '\u0628\u0627\u063a\u0648\u0645\u064a\u0646'
    ],
    persianMonths: [
      '\u0641\u0631\u0648\u0631\u062f\u064a\u0646', '\u0623\u0631\u062f\u064a\u0628\u0647\u0634\u062a', '\u062e\u0631\u062f\u0627\u062f', '\u062a\u064a\u0631', '\u0645\u0631\u062f\u0627\u062f', '\u0634\u0647\u0631\u064a\u0648\u0631',
      '\u0645\u0647\u0631', '\u0622\u0628\u0627\u0646', '\u0622\u0630\u0631', '\u062f\u064a', '\u0628\u0647\u0645\u0646', '\u0627\u0633\u0641\u0646\u062f'
    ],
    armenianMonths: [
      '\u0646\u0627\u0641\u0627\u0633\u0627\u0631\u062f', '\u0647\u0648\u0631\u064a', '\u0633\u0627\u0647\u0645\u064a', '\u062a\u0631\u064a', '\u0643\u0627\u0644\u0648\u062a\u0634', '\u0623\u0631\u0627\u062a\u0634',
      '\u0645\u0647\u064a\u0643\u0627\u0646', '\u0623\u0631\u064a\u063a', '\u0623\u0647\u064a\u0643\u0627\u0646', '\u0645\u0627\u0631\u064a\u0631\u064a', '\u0645\u0627\u0631\u063a\u0627\u062a\u0634', '\u0647\u0631\u0648\u062a\u064a\u062a\u0634', '\u0623\u0648\u064a\u0644\u064a\u0627\u062a\u0634'
    ],
    byzantineMonths: [
      '\u0623\u064a\u0644\u0648\u0644', '\u062a\u0634\u0631\u064a\u0646 \u0627\u0644\u0623\u0648\u0644', '\u062a\u0634\u0631\u064a\u0646 \u0627\u0644\u062b\u0627\u0646\u064a', '\u0643\u0627\u0646\u0648\u0646 \u0627\u0644\u0623\u0648\u0644', '\u0643\u0627\u0646\u0648\u0646 \u0627\u0644\u062b\u0627\u0646\u064a', '\u0634\u0628\u0627\u0637',
      '\u0622\u0630\u0627\u0631', '\u0646\u064a\u0633\u0627\u0646', '\u0623\u064a\u0627\u0631', '\u062d\u0632\u064a\u0631\u0627\u0646', '\u062a\u0645\u0648\u0632', '\u0622\u0628'
    ],
    alexandrianMonths: [
      '\u0622\u0630\u0627\u0631', '\u0646\u064a\u0633\u0627\u0646', '\u0623\u064a\u0627\u0631', '\u062d\u0632\u064a\u0631\u0627\u0646', '\u062a\u0645\u0648\u0632', '\u0622\u0628',
      '\u0623\u064a\u0644\u0648\u0644', '\u062a\u0634\u0631\u064a\u0646 \u0627\u0644\u0623\u0648\u0644', '\u062a\u0634\u0631\u064a\u0646 \u0627\u0644\u062b\u0627\u0646\u064a', '\u0643\u0627\u0646\u0648\u0646 \u0627\u0644\u0623\u0648\u0644', '\u0643\u0627\u0646\u0648\u0646 \u0627\u0644\u062b\u0627\u0646\u064a', '\u0634\u0628\u0627\u0637'
    ],
    seleucidMonths: [
      '\u062a\u0634\u0631\u064a\u0646 \u0627\u0644\u0623\u0648\u0644', '\u062a\u0634\u0631\u064a\u0646 \u0627\u0644\u062b\u0627\u0646\u064a', '\u0643\u0627\u0646\u0648\u0646 \u0627\u0644\u0623\u0648\u0644', '\u0643\u0627\u0646\u0648\u0646 \u0627\u0644\u062b\u0627\u0646\u064a', '\u0634\u0628\u0627\u0637', '\u0622\u0630\u0627\u0631',
      '\u0646\u064a\u0633\u0627\u0646', '\u0623\u064a\u0627\u0631', '\u062d\u0632\u064a\u0631\u0627\u0646', '\u062a\u0645\u0648\u0632', '\u0622\u0628', '\u0623\u064a\u0644\u0648\u0644'
    ],
    seleucidBabMonths: [
      '\u0646\u064a\u0633\u0627\u0646', '\u0623\u064a\u0627\u0631', '\u062d\u0632\u064a\u0631\u0627\u0646', '\u062a\u0645\u0648\u0632', '\u0622\u0628', '\u0623\u064a\u0644\u0648\u0644',
      '\u062a\u0634\u0631\u064a\u0646 \u0627\u0644\u0623\u0648\u0644', '\u062a\u0634\u0631\u064a\u0646 \u0627\u0644\u062b\u0627\u0646\u064a', '\u0643\u0627\u0646\u0648\u0646 \u0627\u0644\u0623\u0648\u0644', '\u0643\u0627\u0646\u0648\u0646 \u0627\u0644\u062b\u0627\u0646\u064a', '\u0634\u0628\u0627\u0637', '\u0622\u0630\u0627\u0631'
    ],
    syriacMonths: [
      '\u0643\u0627\u0646\u0648\u0646 \u0627\u0644\u062b\u0627\u0646\u064a', '\u0634\u0628\u0627\u0637', '\u0622\u0630\u0627\u0631', '\u0646\u064a\u0633\u0627\u0646', '\u0623\u064a\u0627\u0631', '\u062d\u0632\u064a\u0631\u0627\u0646',
      '\u062a\u0645\u0648\u0632', '\u0622\u0628', '\u0623\u064a\u0644\u0648\u0644', '\u062a\u0634\u0631\u064a\u0646 \u0627\u0644\u0623\u0648\u0644', '\u062a\u0634\u0631\u064a\u0646 \u0627\u0644\u062b\u0627\u0646\u064a', '\u0643\u0627\u0646\u0648\u0646 \u0627\u0644\u0623\u0648\u0644'
    ],
    egyptianMonths: [
      '\u062a\u0648\u062a', '\u0641\u0627\u0648\u0641\u064a', '\u0623\u062b\u064a\u0631', '\u0643\u0648\u064a\u0627\u0643', '\u0637\u0648\u0628\u064a', '\u0645\u0634\u064a\u0631',
      '\u0641\u0627\u0645\u064a\u0646\u0648\u062b', '\u0641\u0627\u0631\u0645\u0648\u062a\u064a', '\u0628\u0627\u062e\u0648\u0646\u0633', '\u0628\u0627\u064a\u0646\u064a', '\u0623\u0628\u064a\u0641\u064a', '\u0645\u0633\u0648\u0631\u064a', '\u0627\u0644\u0646\u0633\u064a\u0621'
    ],
    macedonianMonths: [
      '\u062f\u064a\u0648\u0633', '\u0623\u0628\u064a\u0644\u0627\u064a\u0648\u0633', '\u0623\u0648\u062f\u064a\u0646\u0627\u064a\u0648\u0633', '\u0628\u064a\u0631\u064a\u062a\u064a\u0648\u0633', '\u062f\u064a\u0633\u062a\u0631\u0648\u0633', '\u0643\u0633\u0627\u0646\u062b\u064a\u0643\u0648\u0633',
      '\u0623\u0631\u062a\u064a\u0645\u064a\u0633\u064a\u0648\u0633', '\u062f\u0627\u064a\u0633\u064a\u0648\u0633', '\u0628\u0627\u0646\u064a\u0645\u0648\u0633', '\u0644\u0648\u0648\u0633', '\u063a\u0648\u0631\u0628\u064a\u0627\u064a\u0648\u0633', '\u0647\u064a\u0628\u064a\u0631\u0628\u064a\u0631\u064a\u062a\u0627\u064a\u0648\u0633'
    ],
    hebrewMonths: [
      '\u062a\u0634\u0631\u064a\u0646', '\u062d\u0634\u0648\u0627\u0646', '\u0643\u0633\u0644\u0648', '\u0637\u064a\u0628\u064a\u062a', '\u0634\u0628\u0627\u0637',
      '\u0623\u0630\u0627\u0631 \u0627\u0644\u0623\u0648\u0644', '\u0623\u0630\u0627\u0631 \u0627\u0644\u062b\u0627\u0646\u064a', '\u0646\u064a\u0633\u0627\u0646', '\u0625\u064a\u0627\u0631', '\u0633\u064a\u0648\u0627\u0646', '\u062a\u0645\u0648\u0632', '\u0622\u0628', '\u0623\u064a\u0644\u0648\u0644'
    ],
    babylonianMonths: [
      '\u0646\u064a\u0633\u0627\u0646\u0648', '\u0623\u064a\u0627\u0631\u0648', '\u0633\u064a\u0645\u0627\u0646\u0648', '\u062f\u0648\u0639\u0648\u0632\u0648', '\u0622\u0628\u0648', '\u0623\u0648\u0644\u0648\u0644\u0648',
      '\u062a\u0634\u0631\u064a\u062a\u0648', '\u0623\u0631\u062e\u0633\u0645\u0646\u0627', '\u0643\u0633\u0644\u064a\u0645\u0648', '\u0637\u064a\u0628\u064a\u062a\u0648', '\u0634\u0628\u0627\u0637\u0648', '\u0623\u062f\u0627\u0631\u0648', '\u0623\u062f\u0627\u0631\u0648 \u0627\u0644\u062b\u0627\u0646\u064a'
    ],
    zodiacSigns: [
      '\u0627\u0644\u062d\u0645\u0644', '\u0627\u0644\u062b\u0648\u0631', '\u0627\u0644\u062c\u0648\u0632\u0627\u0621', '\u0627\u0644\u0633\u0631\u0637\u0627\u0646', '\u0627\u0644\u0623\u0633\u062f', '\u0627\u0644\u0639\u0630\u0631\u0627\u0621',
      '\u0627\u0644\u0645\u064a\u0632\u0627\u0646', '\u0627\u0644\u0639\u0642\u0631\u0628', '\u0627\u0644\u0642\u0648\u0633', '\u0627\u0644\u062c\u062f\u064a', '\u0627\u0644\u062f\u0644\u0648', '\u0627\u0644\u062d\u0648\u062a'
    ],
    zodiacLabel: '\u0628\u0631\u062c \u0627\u0644\u0641\u0644\u0643',
    eclipseLabel: '\u0643\u0633\u0648\u0641 \u0627\u0644\u0634\u0645\u0633',
    eclipseViewMap: '\u0639\u0631\u0636 \u062e\u0631\u064a\u0637\u0629 \u0627\u0644\u0643\u0633\u0648\u0641',
    eclipseViewCatalogue: '\u0641\u0647\u0631\u0633 \u0627\u0644\u0643\u0633\u0648\u0641\u0627\u062a',
    eclipseTypes: { T: '\u0643\u0644\u064a', A: '\u062d\u0644\u0642\u064a', H: '\u0647\u062c\u064a\u0646' },
    eclipseNotes: {
      crucifixion29: '\u0643\u0633\u0648\u0641 \u0643\u0644\u064a \u0641\u0648\u0642 \u0627\u0644\u0634\u0631\u0642 \u0627\u0644\u0623\u062f\u0646\u0649 \u2014 \u064a\u064f\u0646\u0627\u0642\u0634 \u0641\u064a \u062a\u0623\u0631\u064a\u062e \u0627\u0644\u0635\u0644\u0628',
      pliny59: '\u0648\u062b\u0642\u0647 \u0628\u0644\u064a\u0646\u064a\u0648\u0633 \u0627\u0644\u0623\u0643\u0628\u0631 \u0641\u064a \u0627\u0644\u062a\u0627\u0631\u064a\u062e \u0627\u0644\u0637\u0628\u064a\u0639\u064a',
      jerusalem71: '\u0643\u0633\u0648\u0641 \u0642\u0631\u0628 \u0627\u0644\u0642\u062f\u0633 \u0641\u064a \u0639\u0635\u0631 \u0627\u0644\u062d\u0635\u0627\u0631 \u0627\u0644\u0631\u0648\u0645\u0627\u0646\u064a',
      elagabalus219: '\u0643\u0633\u0648\u0641 \u0643\u0644\u064a \u0641\u0648\u0642 \u0641\u0627\u0631\u0633 \u2014 \u0639\u0647\u062f \u0625\u064a\u0644\u0627\u063a\u0627\u0628\u0627\u0644\u0648\u0633',
      julian364: '\u0648\u062b\u0642 \u0623\u062b\u0646\u0627\u0621 \u062d\u0645\u0644\u0629 \u064a\u0648\u0644\u064a\u0627\u0646\u0648\u0633 \u0627\u0644\u0645\u0631\u062a\u062f \u0639\u0644\u0649 \u0641\u0627\u0631\u0633',
      theon393: '\u0623\u0648\u0644 \u0631\u0635\u062f \u0644\u0643\u0633\u0648\u0641 \u0633\u062c\u0644\u0647 \u062b\u064a\u0648\u0646 \u0627\u0644\u0625\u0633\u0643\u0646\u062f\u0631\u064a',
      theon418: '\u0631\u0635\u062f\u0647 \u062b\u064a\u0648\u0646 \u0627\u0644\u0625\u0633\u0643\u0646\u062f\u0631\u064a\u060c \u0627\u0633\u062a\u064f\u062e\u062f\u0645 \u0644\u0645\u0639\u0627\u064a\u0631\u0629 \u0627\u0644\u062c\u062f\u0627\u0648\u0644 \u0627\u0644\u0641\u0644\u0643\u064a\u0629',
      proclus484: '\u0648\u062b\u0642\u0647 \u0645\u0627\u0631\u064a\u0646\u0648\u0633 \u0627\u0644\u0646\u064a\u0627\u0628\u0648\u0644\u064a\u0633\u064a \u0641\u064a \u0633\u064a\u0631\u0629 \u0628\u0631\u0648\u0642\u0644\u0633',
      arabia590: '\u0643\u0633\u0648\u0641 \u062d\u0644\u0642\u064a \u0641\u0648\u0642 \u0627\u0644\u062c\u0632\u064a\u0631\u0629 \u0627\u0644\u0639\u0631\u0628\u064a\u0629 \u2014 \u0627\u0644\u0639\u0635\u0631 \u0627\u0644\u062c\u0627\u0647\u0644\u064a',
      ibrahim632: '\u0643\u0633\u0648\u0641 \u064a\u0648\u0645 \u0648\u0641\u0627\u0629 \u0625\u0628\u0631\u0627\u0647\u064a\u0645 \u0628\u0646 \u0627\u0644\u0646\u0628\u064a \u0645\u062d\u0645\u062f \uFDFA',
      constantinople718: '\u0623\u062b\u0646\u0627\u0621 \u062d\u0635\u0627\u0631 \u0627\u0644\u0639\u0631\u0628 \u0644\u0644\u0642\u0633\u0637\u0646\u0637\u064a\u0646\u064a\u0629',
      harun809: '\u0641\u064a \u0639\u0647\u062f \u0647\u0627\u0631\u0648\u0646 \u0627\u0644\u0631\u0634\u064a\u062f',
      louis840: '\u0643\u0633\u0648\u0641 \u0627\u0644\u0625\u0645\u0628\u0631\u0627\u0637\u0648\u0631 \u0644\u0648\u064a\u0633 \u0627\u0644\u062a\u0642\u064a\u060c \u0627\u0639\u062a\u064f\u0628\u0631 \u0646\u0630\u064a\u0631 \u0634\u0624\u0645 \u0628\u0648\u0641\u0627\u062a\u0647',
      biruni968: '\u0631\u0635\u062f\u0647 \u0648\u0633\u062c\u0644\u0647 \u0627\u0644\u0628\u064a\u0631\u0648\u0646\u064a \u0641\u064a \u0628\u063a\u062f\u0627\u062f',
      crucifixion1033: '\u0623\u0644\u0641\u064a\u0629 \u0627\u0644\u0635\u0644\u0628 \u2014 \u0645\u0648\u062b\u0642 \u0639\u0644\u0649 \u0646\u0637\u0627\u0642 \u0648\u0627\u0633\u0639 \u0641\u064a \u0627\u0644\u0639\u0627\u0644\u0645 \u0627\u0644\u0645\u0633\u064a\u062d\u064a',
      crusade1098: '\u0623\u062b\u0646\u0627\u0621 \u0627\u0644\u062d\u0645\u0644\u0629 \u0627\u0644\u0635\u0644\u064a\u0628\u064a\u0629 \u0627\u0644\u0623\u0648\u0644\u0649\u060c \u062d\u0635\u0627\u0631 \u0623\u0646\u0637\u0627\u0643\u064a\u0629',
      henry1133: '\u0643\u0633\u0648\u0641 \u0627\u0644\u0645\u0644\u0643 \u0647\u0646\u0631\u064a \u2014 \u0631\u064f\u0635\u062f \u0641\u064a \u0623\u0648\u0631\u0648\u0628\u0627 \u0648\u0627\u0644\u0645\u0634\u0631\u0642',
      hattin1187: '\u0639\u0627\u0645 \u0645\u0639\u0631\u0643\u0629 \u062d\u0637\u064a\u0646 \u0648\u0641\u062a\u062d \u0635\u0644\u0627\u062d \u0627\u0644\u062f\u064a\u0646 \u0644\u0644\u0642\u062f\u0633',
      mongols1241: '\u0623\u062b\u0646\u0627\u0621 \u0627\u0644\u063a\u0632\u0648 \u0627\u0644\u0645\u063a\u0648\u0644\u064a \u0644\u0644\u0634\u0631\u0642 \u0627\u0644\u0623\u0648\u0633\u0637',
      constantinople1453: '\u0642\u0628\u0644 \u0623\u0634\u0647\u0631 \u0645\u0646 \u0633\u0642\u0648\u0637 \u0627\u0644\u0642\u0633\u0637\u0646\u0637\u064a\u0646\u064a\u0629 \u0639\u0644\u0649 \u064a\u062f \u0645\u062d\u0645\u062f \u0627\u0644\u0641\u0627\u062a\u062d'
    },
    moonPhaseLabel: '\u0637\u0648\u0631 \u0627\u0644\u0642\u0645\u0631',
    moonPhases: {
      new: '\u0645\u062d\u0627\u0642', waxingCrescent: '\u0647\u0644\u0627\u0644 \u0645\u062a\u0632\u0627\u064a\u062f', firstQuarter: '\u062a\u0631\u0628\u064a\u0639 \u0623\u0648\u0644',
      waxingGibbous: '\u0623\u062d\u062f\u0628 \u0645\u062a\u0632\u0627\u064a\u062f', full: '\u0628\u062f\u0631', waningGibbous: '\u0623\u062d\u062f\u0628 \u0645\u062a\u0646\u0627\u0642\u0635',
      lastQuarter: '\u062a\u0631\u0628\u064a\u0639 \u0623\u062e\u064a\u0631', waningCrescent: '\u0647\u0644\u0627\u0644 \u0645\u062a\u0646\u0627\u0642\u0635'
    },
    moonAge: '\u064a\u0648\u0645',
    moonIllumination: '\u0625\u0636\u0627\u0621\u0629',
    cometLabel: '\u0645\u0630\u0646\u0651\u0628',
    cometNames: { halley: '\u0645\u0630\u0646\u0651\u0628 \u0647\u0627\u0644\u064a', caesars: '\u0645\u0630\u0646\u0651\u0628 \u0642\u064a\u0635\u0631', great: '\u0627\u0644\u0645\u0630\u0646\u0651\u0628 \u0627\u0644\u0639\u0638\u064a\u0645' },
    cometNotes: {
      halley_m239: '\u0623\u0642\u062f\u0645 \u0639\u0648\u062f\u0629 \u0645\u0624\u0643\u062f\u0629 \u2014 \u0633\u062c\u0644\u0647\u0627 \u0641\u0644\u0643\u064a\u0648\u0646 \u0635\u064a\u0646\u064a\u0648\u0646',
      halley_m86: '\u0645\u0633\u062c\u0644 \u0639\u0644\u0649 \u0623\u0644\u0648\u0627\u062d \u0628\u0627\u0628\u0644\u064a\u0629',
      halley_m11: '\u0645\u0631\u0634\u062d \u0645\u062d\u062a\u0645\u0644 \u0644\u0646\u062c\u0645\u0629 \u0628\u064a\u062a \u0644\u062d\u0645',
      halley_66: '\u0633\u064f\u062c\u0644 \u0623\u062b\u0646\u0627\u0621 \u0627\u0644\u062d\u0631\u0648\u0628 \u0627\u0644\u064a\u0647\u0648\u062f\u064a\u0629-\u0627\u0644\u0631\u0648\u0645\u0627\u0646\u064a\u0629',
      halley_141: '\u0645\u0648\u062b\u0642 \u0641\u064a \u0645\u0635\u0627\u062f\u0631 \u0635\u064a\u0646\u064a\u0629 \u0648\u0631\u0648\u0645\u0627\u0646\u064a\u0629',
      halley_451: '\u0638\u0647\u0631 \u0623\u062b\u0646\u0627\u0621 \u062d\u0645\u0644\u0627\u062a \u0623\u062a\u064a\u0644\u0627',
      halley_530: '\u0633\u062c\u0644\u0647 \u0628\u0631\u0648\u0643\u0648\u0628\u064a\u0648\u0633 \u0641\u064a \u0639\u0647\u062f \u062c\u0633\u062a\u0646\u064a\u0627\u0646',
      halley_607: '\u0631\u064f\u0635\u062f \u0642\u0628\u064a\u0644 \u0638\u0647\u0648\u0631 \u0627\u0644\u0625\u0633\u0644\u0627\u0645',
      halley_684: '\u0645\u0633\u062c\u0644 \u0641\u064a \u0648\u0642\u0627\u0626\u0639 \u0646\u0648\u0631\u0646\u0628\u0631\u063a',
      halley_837: '\u0623\u0642\u0631\u0628 \u0627\u0642\u062a\u0631\u0627\u0628 \u0645\u0646 \u0627\u0644\u0623\u0631\u0636 \u0641\u064a \u0627\u0644\u062a\u0627\u0631\u064a\u062e \u2014 \u0631\u0635\u062f\u0647 \u0644\u0648\u064a\u0633 \u0627\u0644\u062a\u0642\u064a',
      halley_1066: '\u0635\u064f\u0648\u0651\u0631 \u0641\u064a \u0646\u0633\u064a\u062c \u0628\u0627\u064a\u0648 \u0642\u0628\u0644 \u0645\u0639\u0631\u0643\u0629 \u0647\u064a\u0633\u062a\u0646\u063a\u0632',
      halley_1301: '\u0634\u0627\u0647\u062f\u0647 \u062c\u0648\u062a\u0648 \u062f\u064a \u0628\u0648\u0646\u062f\u0648\u0646\u064a\u060c \u0645\u0644\u0647\u0645\u064b\u0627 \u0646\u062c\u0645\u0629 \u0628\u064a\u062a \u0644\u062d\u0645 \u0641\u064a \u0644\u0648\u062d\u062a\u0647',
      halley_1456: '\u0638\u0647\u0631 \u0623\u062b\u0646\u0627\u0621 \u0627\u0644\u062a\u0642\u062f\u0645 \u0627\u0644\u0639\u062b\u0645\u0627\u0646\u064a \u0641\u064a \u0623\u0648\u0631\u0648\u0628\u0627',
      caesars_44: '\u0638\u0647\u0631 \u0628\u0639\u062f \u0627\u063a\u062a\u064a\u0627\u0644 \u064a\u0648\u0644\u064a\u0648\u0633 \u0642\u064a\u0635\u0631 \u2014 \u0641\u064f\u0633\u0651\u0631 \u0639\u0644\u0649 \u0623\u0646\u0647 \u062a\u0623\u0644\u064a\u0647',
      great_1106: '\u0644\u0627\u0645\u0639 \u0628\u0634\u0643\u0644 \u0627\u0633\u062a\u062b\u0646\u0627\u0626\u064a\u060c \u0633\u064f\u062c\u0644 \u0641\u064a \u0623\u0648\u0631\u0648\u0628\u0627 \u0648\u0634\u0631\u0642 \u0622\u0633\u064a\u0627',
      great_1264: '\u0645\u0631\u0626\u064a \u0644\u0623\u0634\u0647\u0631 \u2014 \u0633\u062c\u0644\u0647 \u0645\u0624\u0631\u062e\u0648\u0646 \u0623\u0648\u0631\u0648\u0628\u064a\u0648\u0646 \u0648\u0635\u064a\u0646\u064a\u0648\u0646',
      great_1472: '\u0645\u0646 \u0623\u0644\u0645\u0639 \u0645\u0630\u0646\u0628\u0627\u062a \u0627\u0644\u0642\u0631\u0646 \u0627\u0644\u062e\u0627\u0645\u0633 \u0639\u0634\u0631'
    },
    supernovaLabel: '\u0645\u0633\u062a\u0639\u0631 \u0623\u0639\u0638\u0645',
    supernovaNotes: {
      sn185: '\u0623\u0642\u062f\u0645 \u0645\u0633\u062a\u0639\u0631 \u0623\u0639\u0638\u0645 \u0645\u0633\u062c\u0644 \u2014 \u0631\u0635\u062f\u0647 \u0641\u0644\u0643\u064a\u0648\u0646 \u0635\u064a\u0646\u064a\u0648\u0646 \u0643\u0640"\u0646\u062c\u0645 \u0636\u064a\u0641" \u0644\u0645\u062f\u0629 8 \u0623\u0634\u0647\u0631',
      sn386: '\u0633\u062c\u0644\u0647 \u0641\u0644\u0643\u064a\u0648\u0646 \u0635\u064a\u0646\u064a\u0648\u0646 \u0641\u064a \u0628\u0631\u062c \u0627\u0644\u0642\u0648\u0633',
      sn393: '"\u0646\u062c\u0645 \u0636\u064a\u0641" \u0635\u064a\u0646\u064a \u0641\u064a \u0628\u0631\u062c \u0627\u0644\u0639\u0642\u0631\u0628\u060c \u0645\u0631\u0626\u064a \u0644\u0645\u062f\u0629 8 \u0623\u0634\u0647\u0631',
      sn1006: '\u0623\u0644\u0645\u0639 \u062d\u062f\u062b \u0646\u062c\u0645\u064a \u0641\u064a \u0627\u0644\u062a\u0627\u0631\u064a\u062e \u2014 \u0648\u062b\u0642\u0647 \u0627\u0628\u0646 \u0627\u0644\u0647\u064a\u062b\u0645 \u0648\u0639\u0644\u064a \u0628\u0646 \u0631\u0636\u0648\u0627\u0646',
      sn1054: '\u0623\u0646\u0634\u0623 \u0633\u062f\u064a\u0645 \u0627\u0644\u0633\u0631\u0637\u0627\u0646 \u2014 \u0633\u062c\u0644\u0647 \u0641\u0644\u0643\u064a\u0648\u0646 \u0635\u064a\u0646\u064a\u0648\u0646 \u0648\u0639\u0631\u0628',
      sn1181: '\u0633\u062c\u0644\u0647 \u0641\u0644\u0643\u064a\u0648\u0646 \u0635\u064a\u0646\u064a\u0648\u0646 \u0648\u064a\u0627\u0628\u0627\u0646\u064a\u0648\u0646 \u0641\u064a \u0630\u0627\u062a \u0627\u0644\u0643\u0631\u0633\u064a',
      sn1572: '\u0646\u062c\u0645 \u062a\u064a\u062e\u0648 \u2014 \u0623\u0633\u0642\u0637 \u0639\u0642\u064a\u062f\u0629 \u0623\u0631\u0633\u0637\u0648 \u0641\u064a \u062b\u0628\u0627\u062a \u0627\u0644\u0633\u0645\u0627\u0648\u0627\u062a',
      sn1604: '\u0646\u062c\u0645 \u0643\u0628\u0644\u0631 \u2014 \u0622\u062e\u0631 \u0645\u0633\u062a\u0639\u0631 \u0623\u0639\u0638\u0645 \u0641\u064a \u062f\u0631\u0628 \u0627\u0644\u062a\u0628\u0627\u0646\u0629 \u0631\u064f\u0635\u062f \u0628\u0627\u0644\u0639\u064a\u0646 \u0627\u0644\u0645\u062c\u0631\u062f\u0629'
    },
    conjunctionLabel: '\u0627\u0642\u062a\u0631\u0627\u0646',
    conjunctionNotes: {
      bethlehem_m7: '\u0627\u0642\u062a\u0631\u0627\u0646 \u062b\u0644\u0627\u062b\u064a \u0644\u0644\u0645\u0634\u062a\u0631\u064a \u0648\u0632\u062d\u0644 \u0641\u064a \u0628\u0631\u062c \u0627\u0644\u062d\u0648\u062a \u2014 \u0645\u0631\u0634\u062d \u0631\u0626\u064a\u0633\u064a \u0644\u0646\u062c\u0645\u0629 \u0628\u064a\u062a \u0644\u062d\u0645',
      bethlehem_m2: '\u0627\u0642\u062a\u0631\u0627\u0646 \u0627\u0644\u0645\u0634\u062a\u0631\u064a\u2013\u0627\u0644\u0632\u0647\u0631\u0629 \u2014 \u0645\u0631\u0634\u062d \u0622\u062e\u0631 \u0644\u0646\u062c\u0645\u0629 \u0628\u064a\u062a \u0644\u062d\u0645'
    },
    planetNames: {
      jupiter: '\u0627\u0644\u0645\u0634\u062a\u0631\u064a', saturn: '\u0632\u062d\u0644', venus: '\u0627\u0644\u0632\u0647\u0631\u0629', mars: '\u0627\u0644\u0645\u0631\u064a\u062e', mercury: '\u0639\u0637\u0627\u0631\u062f'
    },
    weekdays: [
      '\u0627\u0644\u0623\u062d\u062f', '\u0627\u0644\u0627\u062b\u0646\u064a\u0646', '\u0627\u0644\u062b\u0644\u0627\u062b\u0627\u0621', '\u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621',
      '\u0627\u0644\u062e\u0645\u064a\u0633', '\u0627\u0644\u062c\u0645\u0639\u0629', '\u0627\u0644\u0633\u0628\u062a'
    ],
    errNoFromCal: '\u0623\u062f\u062e\u0644 \u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u0645\u0635\u062f\u0631 (\u0645\u062b\u0644\u0627\u064b \u0647\u062c\u0631\u064a\u060c \u064a\u0648\u0644\u064a\u0627\u0646\u064a\u060c \u0645\u064a\u0644\u0627\u062f\u064a)',
    errNoToCal: '\u0623\u062f\u062e\u0644 \u0627\u0644\u062a\u0642\u0648\u064a\u0645 \u0627\u0644\u0647\u062f\u0641',
    errSameCal: '\u064a\u062c\u0628 \u0623\u0646 \u064a\u062e\u062a\u0644\u0641 \u0627\u0644\u062a\u0642\u0648\u064a\u0645\u0627\u0646',
    errNoYear: '\u0623\u062f\u062e\u0644 \u0627\u0644\u0633\u0646\u0629',
    errUnknownCal: '\u062a\u0642\u0648\u064a\u0645 \u063a\u064a\u0631 \u0645\u0639\u0631\u0648\u0641: ',
    errInvalidMonth: '\u0627\u0644\u0634\u0647\u0631 \u064a\u062c\u0628 \u0623\u0646 \u064a\u0643\u0648\u0646 1\u201312',
    errInvalidDay: '\u064a\u0648\u0645 \u063a\u064a\u0631 \u0635\u0627\u0644\u062d \u0644\u0647\u0630\u0627 \u0627\u0644\u0634\u0647\u0631',
    history: 'السجل',
    copyResult: 'نسخ',
    copied: 'تم النسخ!',
    clearHistory: 'مسح',
    noHistory: 'لا توجد تحويلات بعد',
    langName: '\u0627\u0644\u0639\u0631\u0628\u064a\u0629',
    aiPlaceholder: '\u0627\u0633\u0623\u0644 \u0627\u0644\u0630\u0643\u0627\u0621 \u0627\u0644\u0627\u0635\u0637\u0646\u0627\u0639\u064a: \u0645\u062b\u0644\u0627\u064b "\u0645\u0639\u0631\u0643\u0629 \u062d\u0637\u064a\u0646"\u060c "15 \u0631\u0645\u0636\u0627\u0646 1445"\u060c "\u0648\u0641\u0627\u0629 \u0647\u0627\u0631\u0648\u0646 \u0627\u0644\u0631\u0634\u064a\u062f"...',
    aiLimit: '\u062a\u0645 \u0627\u0633\u062a\u0646\u0641\u0627\u062f \u0627\u0644\u062d\u062f \u0627\u0644\u064a\u0648\u0645\u064a (10/10). \u064a\u062a\u062c\u062f\u062f \u0639\u0646\u062f \u0645\u0646\u062a\u0635\u0641 \u0627\u0644\u0644\u064a\u0644.',
    aiError: '\u0641\u0634\u0644 \u0627\u0644\u0627\u0633\u062a\u0639\u0644\u0627\u0645. \u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649.',
    aiLoading: '\u062c\u0627\u0631\u064d \u0627\u0644\u062a\u0641\u0643\u064a\u0631...',
    aiSetKey: '\u0623\u062f\u062e\u0644 \u0645\u0641\u062a\u0627\u062d API',
    aiKeyPrompt: '\u0623\u062f\u062e\u0644 \u0645\u0641\u062a\u0627\u062d Gemini API:',
    aiRemaining: '\u0645\u062a\u0628\u0642\u064a \u0627\u0644\u064a\u0648\u0645'
  },

  eo: {
    appTitle: 'Kalendara Kalkulilo',
    appSubtitle: 'Plurkalendara datkonvertilo',
    navConverter: 'Konvertilo',
    navCalendars: 'Kalendaroj',
    navMethodology: 'Metodologio',
    navDynasties: 'Regnotabeloj',
    navEclipses: 'Eklipsoj',
    fromCalendar: 'De',
    toDate: '\u011cis (nedevige)',
    targetCalendar: 'Konverti al',
    calendarPlaceholder: 'Kalendaro...',
    calendars: {
      hijri: 'Hi\u011dra', julian: 'Julia', gregorian: 'Gregoria',
      coptic: 'Kopta', ethiopian: 'Etiopa', yazdgerdi: 'Zoroastra',
      armenian: 'Armena', solarHijri: 'Persa', ilkhani: 'Il\u0125anida (Kh\u0101n\u012b)',
      byzantine: 'Bizanca',
      seleucid: 'Selekida', syriac: 'Siria', rumi: 'Rumia',
      egyptian: 'Egipta',
      auc: 'Ab Urbe Condita', spanish: 'Hispana Erao', antiochene: 'Antio\u0125ia Erao',
      olympiad: 'Olimpiado', macedonian: 'Makedona',
      hebrew: 'Hebrea', babylonian: 'Babilona',
      bp: 'Anta\u016d la nuno', human: 'Homara Erao'
    },
    year: 'Jaro',
    month: 'Monato',
    day: 'Tago',
    convert: 'Konverti',
    result: 'Rezulto',
    jdn: 'Julia tagnumero',
    dayOfWeek: 'Semajntago',
    rangeSpans: 'ampleksas de',
    to: '\u011dis',
    overlappingMonths: 'Interkovraj hi\u011draj monatoj',
    overlappingGregorian: 'Gregoria/julia periodo',
    leapYear: 'Superjaro',
    totalDays: 'tagoj',
    monthBreakdown: 'Monata detalo',
    calendarNote: 'Datoj anta\u016d la 15-a de oktobro 1582 uzas la julian kalendaron.',
    julianDateNote: '\u0108i tiu dato anta\u016das la gregorian reformon (1582). La montrita gregoria dato estas kalkulita proleptike \u2014 \u0109i tie estas uzata la julia kalendaro.',
    indictionLabel: 'Indiktio',
    animalYearLabel: 'Besta jaro',
    ilkhaniAnimals: { Sichqan: 'Muso', Ud: 'Bovo', Bars: 'Leopardo', Tavishqan: 'Leporo', Luy: 'Krokodilo', Yilan: 'Serpento', Yund: '\u0108evalo', Qoy: '\u015Cafo', Bichin: 'Simio', Takigu: 'Kokino', It: 'Hundo', Tonguz: 'Porko' },
    babylonianPDNote: 'Observa dato el tabeloj de Parker & Dubberstein (626 a.K. \u2013 45 p.K.).',
    babylonianArithNote: 'Aritmetika aproksimo (ekster Parker & Dubberstein-intervalo). Povas diferenci je \u00b11\u20132 tagoj.',
    tabularNote: 'Tabela islama kalendaro (aritmetika). Povas diferenci je \u00b11\u20132 tagoj de observaj kalendaroj.',
    gregorianLabel: 'Gregoria',
    julianLabel: 'Julia',
    hijriLabel: 'Hi\u011dra (p.H.)',
    gregorianMonths: [
      'januaro', 'februaro', 'marto', 'aprilo', 'majo', 'junio',
      'julio', 'a\u016dgusto', 'septembro', 'oktobro', 'novembro', 'decembro'
    ],
    hijriMonths: [
      'mu\u1e25arram', '\u1e63afar', 'rab\u012b\u02bf al-awwal', 'rab\u012b\u02bf a\u1e6f-\u1e6f\u0101n\u012b',
      '\u011fum\u0101d\u0101 al-\u016bl\u0101', '\u011fum\u0101d\u0101 al-a\u1e2bira', 'ra\u011fab', '\u015da\u02bfb\u0101n',
      'rama\u1e0d\u0101n', '\u015daww\u0101l', '\u1e0f\u016b al-qa\u02bfda', '\u1e0f\u016b al-\u1e25i\u011f\u011fa'
    ],
    copticMonths: [
      'tout', 'baba', 'hator', 'kiahk', 'toba', 'am\u015dir',
      'baramhat', 'baramuda', 'ba\u015dans', 'baona', 'abib', 'mesra', 'epagomenaj'
    ],
    ethiopianMonths: [
      'm\u00e4sk\u00e4r\u00e4m', 't\u0259k\u0259mt', 'h\u0259dar', 'tahsas', 't\u0259r', 'j\u00e4katit',
      'm\u00e4gabit', 'mijazja', 'g\u0259nbot', 's\u00e4ne', 'hamle', 'n\u00e4hase', 'pagumen'
    ],
    persianMonths: [
      'farvardino', 'ordibehi\u015dto', '\u0125ordado', 'tiro', 'mordado', '\u015dahrivaro',
      'mehro', 'abano', 'azaro', 'dejo', 'bahmano', 'esfando'
    ],
    armenianMonths: [
      'navasardo', 'horio', 'sahmo', 'treo', 'kalo\u0109o', 'ara\u0109o',
      'mehekano', 'arego', 'ahekano', 'marerio', 'marga\u0109o', 'hroti\u0109o', 'avelea\u0109o'
    ],
    byzantineMonths: [
      'septembro', 'oktobro', 'novembro', 'decembro', 'januaro', 'februaro',
      'marto', 'aprilo', 'majo', 'junio', 'julio', 'a\u016dgusto'
    ],
    alexandrianMonths: [
      'marto', 'aprilo', 'majo', 'junio', 'julio', 'a\u016dgusto',
      'septembro', 'oktobro', 'novembro', 'decembro', 'januaro', 'februaro'
    ],
    seleucidMonths: [
      'oktobro', 'novembro', 'decembro', 'januaro', 'februaro', 'marto',
      'aprilo', 'majo', 'junio', 'julio', 'a\u016dgusto', 'septembro'
    ],
    seleucidBabMonths: [
      'aprilo', 'majo', 'junio', 'julio', 'a\u016dgusto', 'septembro',
      'oktobro', 'novembro', 'decembro', 'januaro', 'februaro', 'marto'
    ],
    syriacMonths: [
      'kanun a\u1e6f-\u1e6f\u0101n\u012b', '\u015db\u0101\u1e6d', '\u0101dh\u0101r', 'n\u012bs\u0101n', 'ayy\u0101r', '\u1e25z\u012br\u0101n',
      'tamm\u016bz', '\u0101b', 'ayl\u016bl', 'ti\u0161r\u012bn al-awwal', 'ti\u0161r\u012bn a\u1e6f-\u1e6f\u0101n\u012b', 'k\u0101n\u016bn al-awwal'
    ],
    egyptianMonths: [
      'toto', 'faofi', 'atiro', 'koiako', 'tibio', 'me\u0125iro',
      'famenoto', 'farmutio', 'pa\u0125onso', 'pajnio', 'epifio', 'mesore', 'epagomenaj'
    ],
    macedonianMonths: [
      'dioo', 'apelajoo', 'a\u016ddinajoo', 'peritioo', 'distroo', 'ksantikoo',
      'artemisioo', 'dajsioo', 'panemoo', 'looo', 'gorpiajoo', 'hiperberetajoo'
    ],
    hebrewMonths: [
      'ti\u015drio', '\u0125e\u015dvano', 'kislevo', 'teveto', '\u015devato',
      'adaro', 'adaro II', 'nisano', 'ijaro', 'sivano', 'tamuzo', 'abo', 'elulo'
    ],
    babylonianMonths: [
      'nisanuo', 'ajaruo', 'simanuo', 'du\u02bbuzuo', 'abuo', 'ululuo',
      'ta\u015drituo', 'ara\u0125samnao', 'kislimuo', 'tebituo', '\u015dabatuo', 'adaruo', 'adaruo II'
    ],
    zodiacSigns: [
      '\u015cafisto', 'Ta\u016dro', '\u011cemeloj', 'Kankro', 'Leono', 'Virgulino',
      'Pesilo', 'Skorpio', 'Sagitario', 'Kaprikorno', 'Akvario', 'Fi\u015doj'
    ],
    zodiacLabel: 'Zodiaka signo',
    eclipseLabel: 'Suna eklipso',
    eclipseViewMap: 'Vidi eklipso-mapon',
    eclipseViewCatalogue: 'Eklipso-katalogo',
    eclipseTypes: { T: 'Totala', A: 'Anula', H: 'Hibrida' },
    eclipseNotes: {
      crucifixion29: 'Totala eklipso super Proksima Oriento \u2014 diskutata pri datado de la Krucumo',
      pliny59: 'Dokumentita de Plinio la Maljuna en Natura Historio',
      jerusalem71: 'Eklipso apud Jerusalemo dum la romia sie\u011do-epoko',
      elagabalus219: 'Totala super Persio \u2014 regado de Elagabalo',
      julian364: 'Dokumentita dum la persa kampanjo de Juliano la Apostato',
      theon393: 'Unua eklipsa observo registrita de Teono el Aleksandrio',
      theon418: 'Observita de Teono el Aleksandrio, uzita por kalibri astronomiajn tabelojn',
      proclus484: 'Dokumentita de Marino el Neapolo en la biografio de Proklo',
      arabia590: 'Anula eklipso super Arabio \u2014 antaislama periodo',
      ibrahim632: 'Eklipso je la morto de Ibrahim, filo de Profeto Mahometo',
      constantinople718: 'Dum la araba sie\u011do de Konstantinopolo',
      harun809: 'Dum la regado de Harun al-Ra\u015did',
      louis840: 'Eklipso de imperiestro Ludoviko la Pia, vidata kiel a\u016dguro de lia morto',
      biruni968: 'Observita kaj registrita de al-Biruni en Bagdado',
      crucifixion1033: 'Jarmilo de la Krucumo \u2014 vaste dokumentita tra la kristana mondo',
      crusade1098: 'Dum la Unua Krucmilito, sie\u011do de Antio\u0125io',
      henry1133: 'Eklipso de Re\u011do Henriko \u2014 observita tra E\u016dropo kaj Levanto',
      hattin1187: 'Jaro de la Batalo de Hattin kaj la konkero de Jerusalemo fare de Saladino',
      mongols1241: 'Dum la mongola invado de Proksima Oriento',
      constantinople1453: 'Monatojn anta\u016d la falo de Konstantinopolo al Mehmedo la 2-a'
    },
    moonPhaseLabel: 'Luna fazo',
    moonPhases: {
      new: 'Novluno', waxingCrescent: 'Kreskanta falcheto', firstQuarter: 'Unua kvarono',
      waxingGibbous: 'Kreskanta luno', full: 'Plenluno', waningGibbous: 'Malkreskanta luno',
      lastQuarter: 'Lasta kvarono', waningCrescent: 'Malkreskanta fal\u0109eto'
    },
    moonAge: 'tago',
    moonIllumination: 'lumigita',
    cometLabel: 'Kometo',
    cometNames: { halley: 'Kometo de Halley', caesars: 'Kometo de Cezaro', great: 'Granda Kometo' },
    cometNotes: {
      halley_m239: 'Plej frua konfirmita reveno \u2014 registrita de \u0109inaj astronomoj',
      halley_m86: 'Registrita sur babilonaj tabuletoj',
      halley_m11: 'Ebla kandidato por la Stelo de Betlehemo',
      halley_66: 'Registrita dum la juda\u2013romaj militoj',
      halley_141: 'Dokumentita en \u0109inaj kaj romaj fontoj',
      halley_451: 'Aperis dum la kampanjoj de Atilo',
      halley_530: 'Registrita de Prokopio dum la re\u011dado de Justiniano',
      halley_607: 'Observita mallonge anta\u016d la apero de Islamo',
      halley_684: 'Registrita en la Kroniko de Nurenbergo',
      halley_837: 'Plej proksima al\u0131ro al Tero en la historio \u2014 observita de Ludoviko la Pia',
      halley_1066: 'Prezentita en la Tapeto de Bayeux anta\u016d la Batalo de Hastings',
      halley_1301: 'Vidita de Giotto di Bondone, inspirinta la Stelon de Betlehemo en lia Adora\u011do de la Ma\u011doj',
      halley_1456: 'Aperis dum la osmana avanco en E\u016dropon',
      caesars_44: 'Aperis post la murdo de Julio Cezaro \u2014 interpretita kiel lia dei\u011do',
      great_1106: 'Escepte brila, registrita tra E\u016dropo kaj Orienta Azio',
      great_1264: 'Videbla dum monatoj \u2014 registrita de e\u016dropaj kaj \u0109inaj kronikoj',
      great_1472: 'Unu el la plej brilaj kometoj de la 15-a jarcento'
    },
    supernovaLabel: 'Supernovo',
    supernovaNotes: {
      sn185: 'Plej frua registrita supernovo \u2014 \u0109inaj astronomoj notis "gastan stelon" dum 8 monatoj',
      sn386: 'Registrita de \u0109inaj astronomoj en Sagitario',
      sn393: '\u0108ina "gasta stelo" en Skorpio, videbla dum 8 monatoj',
      sn1006: 'Plej brila stela evento en registrita historio \u2014 dokumentita de Ibn al-Hajtam, Ali ibn Ridvan, kaj \u0109inaj, japanaj kaj e\u016dropaj observantoj',
      sn1054: 'Kreis la Krabon Nebulozon \u2014 registrita de \u0109inaj kaj arabaj astronomoj',
      sn1181: 'Registrita de \u0109inaj kaj japanaj astronomoj en Kasiopeo',
      sn1572: 'Stelo de Ti\u0125o \u2014 rompis la aristotelan doktrinon pri \u0109iela ne\u015dan\u011debleco',
      sn1604: 'Stelo de Keplero \u2014 la lasta supernovo en la Lakta Vojo observita per nuda okulo'
    },
    conjunctionLabel: 'Konjunkcio',
    conjunctionNotes: {
      bethlehem_m7: 'Triobla konjunkcio de Jupitero kaj Saturno en Pi\u015doj \u2014 \u0109efa kandidato por la Stelo de Betlehemo',
      bethlehem_m2: 'Jupitero\u2013Venuso konjunkcio \u2014 alia kandidato por la Stelo de Betlehemo'
    },
    planetNames: {
      jupiter: 'Jupitero', saturn: 'Saturno', venus: 'Venuso', mars: 'Marso', mercury: 'Merkuro'
    },
    weekdays: [
      'Diman\u0109o', 'Lundo', 'Mardo', 'Merkredo',
      '\u0134a\u016ddo', 'Vendredo', 'Sabato'
    ],
    errNoFromCal: 'Enigu fontan kalendaron (ekz. Hi\u011dra, Julia, Gregoria)',
    errNoToCal: 'Enigu celan kalendaron',
    errSameCal: 'Fonta kaj cela kalendaroj devas diferenci',
    errNoYear: 'Enigu jaron',
    errUnknownCal: 'Nekonata kalendaro: ',
    errInvalidMonth: 'Monato devas esti 1\u201312',
    errInvalidDay: 'Nevalida tago por \u0109i tiu monato',
    history: 'Historio',
    copyResult: 'Kopii',
    copied: 'Kopiita!',
    clearHistory: 'Forviŝi',
    noHistory: 'Ankoraŭ neniuj konvertoj',
    langName: 'Esperanto',
    aiPlaceholder: 'Demandu AI: ekz. "Batalo de Hattin", "15 Ramadano 1445", "morto de Harun al-Ra\u015did"...',
    aiLimit: '\u0108iutaga limo atingita (10/10). Renovigas je noktomezo.',
    aiError: 'AI-demando malsukcesis. Reprovu.',
    aiLoading: 'Pensas...',
    aiSetKey: 'Agordi API-\u015dlosilon',
    aiKeyPrompt: 'Enigu vian Gemini API-\u015dlosilon:',
    aiRemaining: 'restas hodia\u016d'
  }
};

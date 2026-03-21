// kalkal — Internationalization strings
// Languages: English, Polish, Arabic, Esperanto

const I18N = {
  en: {
    appTitle: 'Calendar Converter',
    appSubtitle: 'Gregorian / Julian / Hijri',
    fromCalendar: 'From',
    toDate: 'To (optional)',
    targetCalendar: 'Convert to',
    calendarPlaceholder: 'Calendar...',
    calendars: {
      hijri: 'Hijri', julian: 'Julian', gregorian: 'Gregorian',
      coptic: 'Coptic', ethiopian: 'Ethiopian', yazdgerdi: 'Yazdgerdi',
      armenian: 'Armenian', solarHijri: 'Solar Hijri'
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
    appTitle: 'Konwerter kalendarzy',
    appSubtitle: 'Gregoria\u0144ski / Julia\u0144ski / Hid\u017cri',
    fromCalendar: 'Z',
    toDate: 'Do (opcjonalnie)',
    targetCalendar: 'Przelicz na',
    calendarPlaceholder: 'Kalendarz...',
    calendars: {
      hijri: 'Hid\u017cry', julian: 'Julia\u0144ski', gregorian: 'Gregoria\u0144ski',
      coptic: 'Koptyjski', ethiopian: 'Etiopski', yazdgerdi: 'Yazdgerdi',
      armenian: 'Orme\u0144ski', solarHijri: 'Solar Hid\u017cry'
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
    tabularNote: 'Tabularyczny kalendarz islamski (arytmetyczny). Mo\u017ce si\u0119 r\u00f3\u017cni\u0107 o \u00b11\u20132 dni od kalendarzy obserwacyjnych.',
    gregorianLabel: 'Gregoria\u0144ski',
    julianLabel: 'Julia\u0144ski',
    hijriLabel: 'Hid\u017cry (AH)',
    gregorianMonths: [
      'Stycze\u0144', 'Luty', 'Marzec', 'Kwiecie\u0144', 'Maj', 'Czerwiec',
      'Lipiec', 'Sierpie\u0144', 'Wrzesie\u0144', 'Pa\u017adziernik', 'Listopad', 'Grudzie\u0144'
    ],
    hijriMonths: [
      'Mu\u1e25arram', '\u1e62afar', 'Rab\u012b\u02bf al-Awwal', 'Rab\u012b\u02bf a\u1e6f-\u1e6e\u0101n\u012b',
      '\u01e6um\u0101d\u0101 al-\u016al\u0101', '\u01e6um\u0101d\u0101 al-\u0100\u1e2bira', 'Ra\u01e7ab', '\u0160a\u02bfb\u0101n',
      'Rama\u1e0d\u0101n', '\u0160aww\u0101l', '\u1e0e\u016b al-Qa\u02bfda', '\u1e0e\u016b al-\u1e24i\u01e7\u01e7a'
    ],
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
    appTitle: '\u0645\u062d\u0648\u0644 \u0627\u0644\u062a\u0642\u0648\u064a\u0645',
    appSubtitle: '\u0645\u064a\u0644\u0627\u062f\u064a / \u064a\u0648\u0644\u064a\u0627\u0646\u064a / \u0647\u062c\u0631\u064a',
    fromCalendar: '\u0645\u0646',
    toDate: '\u0625\u0644\u0649 (\u0627\u062e\u062a\u064a\u0627\u0631\u064a)',
    targetCalendar: '\u062a\u062d\u0648\u064a\u0644 \u0625\u0644\u0649',
    calendarPlaceholder: '\u0627\u0644\u062a\u0642\u0648\u064a\u0645...',
    calendars: {
      hijri: '\u0647\u062c\u0631\u064a', julian: '\u064a\u0648\u0644\u064a\u0627\u0646\u064a', gregorian: '\u0645\u064a\u0644\u0627\u062f\u064a',
      coptic: '\u0642\u0628\u0637\u064a', ethiopian: '\u0625\u062b\u064a\u0648\u0628\u064a', yazdgerdi: '\u064a\u0632\u062f\u062c\u0631\u062f\u064a',
      armenian: '\u0623\u0631\u0645\u0646\u064a', solarHijri: '\u0647\u062c\u0631\u064a \u0634\u0645\u0633\u064a'
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
    appTitle: 'Kalendara konvertilo',
    appSubtitle: 'Gregoria / Julia / Hi\u011dra',
    fromCalendar: 'De',
    toDate: '\u011cis (nedevige)',
    targetCalendar: 'Konverti al',
    calendarPlaceholder: 'Kalendaro...',
    calendars: {
      hijri: 'Hi\u011dra', julian: 'Julia', gregorian: 'Gregoria',
      coptic: 'Kopta', ethiopian: 'Etiopa', yazdgerdi: 'Jazdgerda',
      armenian: 'Armena', solarHijri: 'Suna Hi\u011dra'
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
    tabularNote: 'Tabela islama kalendaro (aritmetika). Povas diferenci je \u00b11\u20132 tagoj de observaj kalendaroj.',
    gregorianLabel: 'Gregoria',
    julianLabel: 'Julia',
    hijriLabel: 'Hi\u011dra (p.H.)',
    gregorianMonths: [
      'Januaro', 'Februaro', 'Marto', 'Aprilo', 'Majo', 'Junio',
      'Julio', 'A\u016dgusto', 'Septembro', 'Oktobro', 'Novembro', 'Decembro'
    ],
    hijriMonths: [
      'Mu\u1e25arram', '\u1e62afar', 'Rab\u012b\u02bf al-Awwal', 'Rab\u012b\u02bf a\u1e6f-\u1e6e\u0101n\u012b',
      '\u01e6um\u0101d\u0101 al-\u016al\u0101', '\u01e6um\u0101d\u0101 al-\u0100\u1e2bira', 'Ra\u01e7ab', '\u0160a\u02bfb\u0101n',
      'Rama\u1e0d\u0101n', '\u0160aww\u0101l', '\u1e0e\u016b al-Qa\u02bfda', '\u1e0e\u016b al-\u1e24i\u01e7\u01e7a'
    ],
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

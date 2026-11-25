// kalkal — UI logic (unified form)
// Depends on: Cal (hijri.js), I18N (i18n.js)

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

  let currentLang = kkStore.get('kalkal-lang') || detectLang();

  // Preferred Hijri variant (persisted across sessions)
  const storedHijriVariant = kkStore.get('kalkal-hijri-variant');

  // Calendar registry
  const CALENDARS = {
    hijri: {
      id: 'hijri',
      variants: ['IIc', 'IIa', 'IIIa', 'IVa'],
      defaultVariant: 'IIc',
      _variant: 'IIc',
      toJD(y, m, d) { return Cal.hijriToJD(y, m, d, this._variant); },
      fromJD(jd) { return Cal.jdToHijri(jd, this._variant); },
      monthLength(y, m) { return Cal.hijriMonthLength(y, m, this._variant); },
      yearLength(y) { return Cal.hijriYearLength(y, this._variant); },
      isLeap(y) { return Cal.isHijriLeapYear(y, this._variant); },
      monthCount: 12,
      monthNames: (t) => t.hijriMonths,
      historicalRange: [1948440, Infinity]
    },
    julian: {
      id: 'julian',
      toJD: (y, m, d) => Cal.julianToJD(y, m, d),
      fromJD: (jd) => Cal.jdToJulian(jd),
      monthLength: (y, m) => Cal.julianMonthLength(y, m),
      yearLength: (y) => Cal.isJulianLeapYear(y) ? 366 : 365,
      isLeap: (y) => Cal.isJulianLeapYear(y),
      monthCount: 12,
      monthNames: (t) => t.gregorianMonths,
      monthNamesGen: (t) => t.gregorianMonthsGen || t.gregorianMonths,
      historicalRange: [1704987, 2305448]
    },
    gregorian: {
      id: 'gregorian',
      toJD: (y, m, d) => Cal.civilToJD(y, m, d),
      fromJD: (jd) => Cal.jdToCivil(jd),
      monthLength: (y, m) => {
        const cutoverYear = 1582;
        if (y < cutoverYear || (y === cutoverYear && m < 10)) return Cal.julianMonthLength(y, m);
        if (y === cutoverYear && m === 10) return 21; // Oct 1582: days 1-4 (Julian) + 15-31 (Gregorian)
        return Cal.gregorianMonthLength(y, m);
      },
      yearLength: (y) => {
        if (y < 1582) return Cal.isJulianLeapYear(y) ? 366 : 365;
        if (y === 1582) return 355; // 10 days removed
        return Cal.isGregorianLeapYear(y) ? 366 : 365;
      },
      isLeap: (y) => y < 1582 ? Cal.isJulianLeapYear(y) : Cal.isGregorianLeapYear(y),
      monthCount: 12,
      monthNames: (t) => t.gregorianMonths,
      monthNamesGen: (t) => t.gregorianMonthsGen || t.gregorianMonths,
      historicalRange: [0, Infinity]
    },
    coptic: {
      id: 'coptic',
      toJD: (y, m, d) => Cal.copticToJD(y, m, d),
      fromJD: (jd) => Cal.jdToCoptic(jd),
      monthLength: (y, m) => Cal.copticMonthLength(y, m),
      yearLength: (y) => Cal.copticYearLength(y),
      isLeap: (y) => Cal.isCopticLeapYear(y),
      monthCount: 13,
      monthNames: (t) => t.copticMonths,
      historicalRange: [1825030, Infinity]
    },
    ethiopian: {
      id: 'ethiopian',
      toJD: (y, m, d) => Cal.ethiopianToJD(y, m, d),
      fromJD: (jd) => Cal.jdToEthiopian(jd),
      monthLength: (y, m) => Cal.ethiopianMonthLength(y, m),
      yearLength: (y) => Cal.ethiopianYearLength(y),
      isLeap: (y) => Cal.isEthiopianLeapYear(y),
      monthCount: 13,
      monthNames: (t) => t.ethiopianMonths,
      historicalRange: [2269509, Infinity]
    },
    yazdgerdi: {
      id: 'yazdgerdi',
      variants: ['Shahenshahi', 'Qadimi', 'Fasli'],
      defaultVariant: 'Shahenshahi',
      _variant: 'Shahenshahi',
      toJD(y, m, d) {
        if (this._variant === 'Qadimi') return Cal.qadimiToJD(y, m, d);
        if (this._variant === 'Fasli') return Cal.fasliToJD(y, m, d);
        return Cal.yazdgerdiToJD(y, m, d);
      },
      fromJD(jd) {
        if (this._variant === 'Qadimi') return Cal.jdToQadimi(jd);
        if (this._variant === 'Fasli') return Cal.jdToFasli(jd);
        return Cal.jdToYazdgerdi(jd);
      },
      monthLength(y, m) {
        if (this._variant === 'Qadimi') return Cal.qadimiMonthLength(y, m);
        if (this._variant === 'Fasli') return Cal.fasliMonthLength(y, m);
        return Cal.yazdgerdiMonthLength(y, m);
      },
      yearLength(y) {
        if (this._variant === 'Fasli') return Cal.fasliYearLength(y);
        return Cal.yazdgerdiYearLength();
      },
      isLeap(y) {
        if (this._variant === 'Fasli') return Cal.isFasliLeapYear(y);
        return false;
      },
      monthCount: 13,
      monthNames: (t) => t.yazdgerdiMonths,
      historicalRange: [1952063, Infinity]
    },
    armenian: {
      id: 'armenian',
      toJD: (y, m, d) => Cal.armenianToJD(y, m, d),
      fromJD: (jd) => Cal.jdToArmenian(jd),
      monthLength: (y, m) => Cal.armenianMonthLength(y, m),
      yearLength: () => Cal.armenianYearLength(),
      isLeap: () => false,
      monthCount: 13,
      monthNames: (t) => t.armenianMonths,
      historicalRange: [1922711, Infinity]
    },
    solarHijri: {
      id: 'solarHijri',
      toJD: (y, m, d) => Cal.solarHijriToJD(y, m, d),
      fromJD: (jd) => Cal.jdToSolarHijri(jd),
      monthLength: (y, m) => Cal.solarHijriMonthLength(y, m),
      yearLength: (y) => Cal.solarHijriYearLength(y),
      isLeap: (y) => Cal.isSolarHijriLeapYear(y),
      monthCount: 12,
      monthNames: (t) => t.persianMonths,
      historicalRange: [2115376, Infinity]
    },
    ilkhani: {
      id: 'ilkhani',
      toJD: (y, m, d) => Cal.ilkhaniToJD(y, m, d),
      fromJD: (jd) => Cal.jdToIlkhani(jd),
      monthLength: (y, m) => Cal.ilkhaniMonthLength(y, m),
      yearLength: (y) => Cal.ilkhaniYearLength(y),
      isLeap: (y) => Cal.isIlkhaniLeapYear(y),
      monthCount: 12,
      monthNames: (t) => t.persianMonths,
      historicalRange: [2196585, 2208640]
    },
    byzantine: {
      id: 'byzantine',
      variants: ['Constantinople', 'Alexandrian', 'ChronPasch'],
      defaultVariant: 'Constantinople',
      _variant: 'Constantinople',
      toJD(y, m, d) {
        if (this._variant === 'Alexandrian') return Cal.alexandrianToJD(y, m, d);
        if (this._variant === 'ChronPasch') return Cal.chronPaschToJD(y, m, d);
        return Cal.byzantineToJD(y, m, d);
      },
      fromJD(jd) {
        if (this._variant === 'Alexandrian') return Cal.jdToAlexandrian(jd);
        if (this._variant === 'ChronPasch') return Cal.jdToChronPasch(jd);
        return Cal.jdToByzantine(jd);
      },
      monthLength(y, m) {
        if (this._variant === 'Alexandrian') return Cal.alexandrianMonthLength(y, m);
        if (this._variant === 'ChronPasch') return Cal.chronPaschMonthLength(y, m);
        return Cal.byzantineMonthLength(y, m);
      },
      yearLength(y) {
        if (this._variant === 'Alexandrian') return Cal.alexandrianYearLength(y);
        if (this._variant === 'ChronPasch') return Cal.chronPaschYearLength(y);
        return Cal.byzantineYearLength(y);
      },
      isLeap(y) {
        if (this._variant === 'Alexandrian') return Cal.isAlexandrianLeapYear(y);
        if (this._variant === 'ChronPasch') return Cal.isChronPaschLeapYear(y);
        return Cal.isByzantineLeapYear(y);
      },
      monthCount: 12,
      monthNames(t) {
        if (this._variant === 'Alexandrian') return t.alexandrianMonths;
        if (this._variant === 'ChronPasch') return t.alexandrianMonths;
        return t.byzantineMonths;
      },
      monthNamesGen(t) {
        if (this._variant === 'Alexandrian' || this._variant === 'ChronPasch') return genitiveMonths(t, t.alexandrianMonths);
        return genitiveMonths(t, t.byzantineMonths);
      },
      historicalRange: [1903683, 2251545]
    },
    seleucid: {
      id: 'seleucid',
      variants: ['Macedonian', 'Babylonian'],
      defaultVariant: 'Macedonian',
      _variant: 'Macedonian',
      toJD(y, m, d) {
        return this._variant === 'Babylonian' ? Cal.seleucidBabToJD(y, m, d) : Cal.seleucidToJD(y, m, d);
      },
      fromJD(jd) {
        return this._variant === 'Babylonian' ? Cal.jdToSeleucidBab(jd) : Cal.jdToSeleucid(jd);
      },
      monthLength(y, m) {
        return this._variant === 'Babylonian' ? Cal.seleucidBabMonthLength(y, m) : Cal.seleucidMonthLength(y, m);
      },
      yearLength(y) {
        return this._variant === 'Babylonian' ? Cal.seleucidBabYearLength(y) : Cal.seleucidYearLength(y);
      },
      isLeap(y) {
        return this._variant === 'Babylonian' ? Cal.isSeleucidBabLeapYear(y) : Cal.isSeleucidLeapYear(y);
      },
      monthCount: 12,
      monthNames(t) {
        return this._variant === 'Babylonian' ? t.seleucidBabMonths : t.seleucidMonths;
      },
      monthNamesGen(t) {
        return genitiveMonths(t, this._variant === 'Babylonian' ? t.seleucidBabMonths : t.seleucidMonths);
      },
      historicalRange: [1574638, 2086673]
    },
    syriac: {
      id: 'syriac',
      toJD: (y, m, d) => Cal.syriacToJD(y, m, d),
      fromJD: (jd) => Cal.jdToSyriac(jd),
      monthLength: (y, m) => Cal.syriacMonthLength(y, m),
      yearLength: (y) => Cal.syriacYearLength(y),
      isLeap: (y) => Cal.isSyriacLeapYear(y),
      monthCount: 12,
      monthNames: (t) => t.syriacMonths,
      historicalRange: [1574638, 2086673]
    },
    rumi: {
      id: 'rumi',
      toJD: (y, m, d) => Cal.rumiToJD(y, m, d),
      fromJD: (jd) => Cal.jdToRumi(jd),
      monthLength: (y, m) => Cal.rumiMonthLength(y, m),
      yearLength: (y) => Cal.rumiYearLength(y),
      isLeap: (y) => Cal.isRumiLeapYear(y),
      monthCount: 12,
      monthNames: (t) => t.gregorianMonths,
      monthNamesGen: (t) => t.gregorianMonthsGen || t.gregorianMonths,
      historicalRange: [2393109, 2424516]
    },
    egyptian: {
      id: 'egyptian',
      toJD: (y, m, d) => Cal.egyptianToJD(y, m, d),
      fromJD: (jd) => Cal.jdToEgyptian(jd),
      monthLength: (y, m) => Cal.egyptianMonthLength(y, m),
      yearLength: () => Cal.egyptianYearLength(),
      isLeap: () => false,
      monthCount: 13,
      monthNames: (t) => t.egyptianMonths,
      historicalRange: [957449, 1713064]
    },
    roman: {
      id: 'roman',
      toJD: (y, m, d) => Cal.aucToJD(y, m, d),
      fromJD: (jd) => Cal.jdToAuc(jd),
      monthLength: (y, m) => Cal.aucMonthLength(y, m),
      yearLength: (y) => Cal.aucYearLength(y),
      isLeap: (y) => Cal.isAucLeapYear(y),
      monthCount: 12,
      monthNames: (t) => t.romanMonths,
      historicalRange: [1413478, 1903683]
    },
    spanish: {
      id: 'spanish',
      toJD: (y, m, d) => Cal.spanishToJD(y, m, d),
      fromJD: (jd) => Cal.jdToSpanish(jd),
      monthLength: (y, m) => Cal.spanishMonthLength(y, m),
      yearLength: (y) => Cal.spanishYearLength(y),
      isLeap: (y) => Cal.isSpanishLeapYear(y),
      monthCount: 12,
      monthNames: (t) => t.gregorianMonths,
      monthNamesGen: (t) => t.gregorianMonthsGen || t.gregorianMonths,
      historicalRange: [1704610, 2232400]
    },
    antiochene: {
      id: 'antiochene',
      toJD: (y, m, d) => Cal.antiocheneToJD(y, m, d),
      fromJD: (jd) => Cal.jdToAntiochene(jd),
      monthLength: (y, m) => Cal.antiocheneMonthLength(y, m),
      yearLength: (y) => Cal.antiocheneYearLength(y),
      isLeap: (y) => Cal.isAntiocheneLeapYear(y),
      monthCount: 12,
      monthNames: (t) => t.seleucidMonths,
      monthNamesGen: (t) => genitiveMonths(t, t.seleucidMonths),
      historicalRange: [1574638, 2086673]
    },
    olympiad: {
      id: 'olympiad',
      toJD: (y, m, d) => Cal.olympiadToJD(y, m, d),
      fromJD: (jd) => Cal.jdToOlympiad(jd),
      monthLength: (y, m) => Cal.olympiadMonthLength(y, m),
      yearLength: (y) => Cal.olympiadYearLength(y),
      isLeap: (y) => Cal.isOlympiadLeapYear(y),
      monthCount: 12,
      monthNames: (t) => t.gregorianMonths,
      monthNamesGen: (t) => t.gregorianMonthsGen || t.gregorianMonths,
      historicalRange: [1405084, 1867157]
    },
    macedonian: {
      id: 'macedonian',
      toJD: (y, m, d) => Cal.macedonianToJD(y, m, d),
      fromJD: (jd) => Cal.jdToMacedonian(jd),
      monthLength: (y, m) => Cal.macedonianMonthLength(y, m),
      yearLength: (y) => Cal.macedonianYearLength(y),
      isLeap: (y) => Cal.isMacedonianLeapYear(y),
      monthCount: 12,
      monthNames: (t) => t.macedonianMonths,
      historicalRange: [1574638, 1903683]
    },
    hebrew: {
      id: 'hebrew',
      toJD: (y, m, d) => Cal.hebrewToJD(y, m, d),
      fromJD: (jd) => Cal.jdToHebrew(jd),
      monthLength: (y, m) => Cal.hebrewMonthLength(y, m),
      yearLength: (y) => Cal.hebrewYearLength(y),
      isLeap: (y) => Cal.isHebrewLeapYear(y),
      monthCount: 13,
      monthNames: (t) => t.hebrewMonths,
      historicalRange: [0, Infinity]
    },
    babylonian: {
      id: 'babylonian',
      toJD: (y, m, d) => Cal.babylonianToJD(y, m, d),
      fromJD: (jd) => Cal.jdToBabylonian(jd),
      monthLength: (y, m) => Cal.babylonianMonthLength(y, m),
      yearLength: (y) => Cal.babylonianYearLength(y),
      isLeap: (y) => Cal.isBabylonianLeapYear(y),
      monthCount: 13,
      monthNames: (t) => t.babylonianMonths,
      historicalRange: [1414609, 1721058]
    },
    bp: {
      id: 'bp',
      toJD: (y, m, d) => Cal.bpToJD(y, m, d),
      fromJD: (jd) => Cal.jdToBP(jd),
      monthLength: (y, m) => Cal.bpMonthLength(y, m),
      yearLength: (y) => Cal.bpYearLength(y),
      isLeap: (y) => Cal.isBPLeapYear(y),
      monthCount: 12,
      monthNames: (t) => t.gregorianMonths,
      monthNamesGen: (t) => t.gregorianMonthsGen || t.gregorianMonths,
      historicalRange: null
    },
    human: {
      id: 'human',
      variants: Cal.HUMAN_VARIANTS,
      defaultVariant: Cal.HUMAN_DEFAULT,
      _variant: Cal.HUMAN_DEFAULT,
      toJD(y, m, d) { return Cal.humanToJD(y, m, d, this._variant); },
      fromJD(jd) { return Cal.jdToHuman(jd, this._variant); },
      monthLength(y, m) { return Cal.humanMonthLength(y, m, this._variant); },
      yearLength(y) { return Cal.humanYearLength(y, this._variant); },
      isLeap(y) { return Cal.isHumanLeapYear(y, this._variant); },
      monthCount: 12,
      monthNames: (t) => t.gregorianMonths,
      monthNamesGen: (t) => t.gregorianMonthsGen || t.gregorianMonths,
      historicalRange: null
    }
  };

  // Apply persisted variant preferences
  if (storedHijriVariant && CALENDARS.hijri.variants.includes(storedHijriVariant)) {
    CALENDARS.hijri._variant = storedHijriVariant;
    CALENDARS.hijri.defaultVariant = storedHijriVariant;
  }
  ['byzantine', 'seleucid', 'yazdgerdi'].forEach(calId => {
    const stored = kkStore.get(`kalkal-${calId}-variant`);
    const cal = CALENDARS[calId];
    if (stored && cal && cal.variants && cal.variants.includes(stored)) {
      cal._variant = stored;
      cal.defaultVariant = stored;
    }
  });

  // Contextual calendars: priority order and max count for "also in use" panel
  const CONTEXTUAL_PRIORITY = [
    'gregorian', 'hijri', 'julian', 'hebrew', 'coptic', 'byzantine',
    'seleucid', 'syriac', 'solarHijri', 'yazdgerdi', 'armenian',
    'ethiopian', 'roman', 'babylonian', 'macedonian', 'antiochene',
    'egyptian', 'olympiad', 'spanish', 'ilkhani', 'rumi'
  ];
  const CONTEXTUAL_MAX = 6;

  // Variant display names (not translated — scholarly labels)
  const VARIANT_LABELS = {
    IIc: 'W\u00fcstenfeld',
    IIa: 'East civil',
    IIIa: 'West civil',
    IVa: '\u1e24abash',
    Constantinople: 'Constantinople',
    Alexandrian: 'Alexandrian',
    ChronPasch: 'Chron. Paschale',
    Macedonian: 'Macedonian',
    Babylonian: 'Babylonian',
    Shahenshahi: 'Shahenshahi',
    Qadimi: 'Qadimi',
    Fasli: 'Fasli',
    Proleptic: 'Proleptic Gregorian',
    Civil: 'Julian/Gregorian'
  };

  // Variant priority: lower number = more important (shown as groups, not toggle)
  // Kalendarze, których wariant wybiera się w Ustawieniach (kotwice #set-<id> w settings.html)
  const SETTINGS_VARIANT_CALS = ['hijri', 'byzantine', 'seleucid', 'yazdgerdi'];

  // Największy rok, który kalkulator przyjmuje (powyżej niektóre silniki liczą bardzo długo)
  const MAX_YEAR = 999999;

  const VARIANT_PRIORITY = {
    byzantine: 1,
    hijri: 2,
    yazdgerdi: 3,
    seleucid: 4,
    human: 5
  };

  // ---- Genitive month helpers ----
  // Returns genitive forms of `months` using the nom→gen mapping from t.gregorianMonthsGen.
  // Falls back to nominative when the language has no genitive array (EN, EO).
  function genitiveMonths(t, months) {
    if (!t.gregorianMonthsGen) return months;
    const lookup = {};
    t.gregorianMonths.forEach(function(n, i) { lookup[n] = t.gregorianMonthsGen[i]; });
    return months.map(function(n) { return lookup[n] || n; });
  }
  // Returns genitive month names for a calendar, falling back to nominative.
  function genNames(cal, t) {
    return cal.monthNamesGen ? cal.monthNamesGen(t) : cal.monthNames(t);
  }

  // ---- DOM helpers ----
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  function el(tag, attrs, ...children) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (k === 'class') node.className = v;
        else if (k === 'text') node.textContent = v;
        else node.setAttribute(k, v);
      }
    }
    for (const child of children) {
      if (typeof child === 'string') node.appendChild(document.createTextNode(child));
      else if (child) node.appendChild(child);
    }
    return node;
  }

  // ---- DOM refs ----
  const langSwitcher = $('#lang-switcher');
  const form = $('#converter-form');
  const resultPanel = $('#result-panel');
  const resultBody = $('#result-body');
  const breakdownPanel = $('#breakdown-panel');
  const astroCard = $('#astro-card');
  const contextualCard = $('#contextual-card');
  const errorPanel = $('#form-error');
  const appTitle = $('#app-title');
  const appSubtitle = $('#app-subtitle');
  const fromCalInput = $('#from-calendar');
  const toCalInput = $('#to-calendar');
  const fromMonthSelect = $('#from-month');
  const fromVariantsBar = $('#from-variants');
  const toVariantsBar = $('#to-variants');

  // ---- Variant bar (disabled — variants now shown in results) ----

  function updateVariantBar() {}

  // ---- Calendar change handler ----

  function updateCalDescLink(input, anchorId) {
    var a = document.getElementById(anchorId);
    if (!a) return;
    var cal = resolveCalendar(input.value);
    var t = I18N[currentLang] || I18N.en;
    if (cal) {
      var calName = (t.calendars && t.calendars[cal.id]) || cal.id;
      var tpl = t.aboutCalendarTpl || 'about {name} calendar →';
      a.href = 'calendars.html#' + cal.id;
      a.textContent = tpl.replace('{name}', calName);
      a.hidden = false;
    } else {
      a.hidden = true;
    }
  }

  // Id ostatnio wybranego kalendarza źródłowego: miesiąc i dzień mają sens tylko w jego obrębie.
  var lastFromCalId = null;

  function onCalendarChange(calInput) {
    if (calInput === fromCalInput) {
      const srcCal = resolveCalendar(fromCalInput.value);
      // Zmiana kalendarza źródłowego unieważnia miesiąc i dzień (numer 7 to Raǧab w hidżri,
      // lipiec w gregoriańskim). Przy zwykłym pisaniu nazwy (to samo id) nic nie czyścimy.
      if (srcCal && lastFromCalId && srcCal.id !== lastFromCalId) {
        fromMonthSelect.dataset.monthValue = '';
        fromMonthSelect.value = '';
        $('#from-day').value = '';
      }
      if (srcCal) lastFromCalId = srcCal.id;
      updateVariantBar(fromVariantsBar, fromCalInput);
      updateMonthSelects();
      updateCalDescLink(fromCalInput, 'from-cal-desc');
      if (srcCal) kkStore.set('kalkal-from-cal', srcCal.id);
    } else {
      updateVariantBar(toVariantsBar, toCalInput);
      updateCalDescLink(toCalInput, 'to-cal-desc');
      if (resultPanel.classList.contains('has-result')) convert();
    }
  }

  // ---- Shared fixed-dropdown placement ----
  // Anchors a body-appended dropdown to its input. Flips above the input
  // when there's more room there, and caps height to the available space
  // (minus the fixed bottom nav) so long lists scroll instead of clipping.
  function placeFixedDropdown(dropdown, input) {
    const rect = input.getBoundingClientRect();
    const vh = window.innerHeight;
    const navH = window.matchMedia('(max-width: 600px)').matches ? 72 : 0;
    const gap = 8;
    const spaceBelow = vh - rect.bottom - navH - gap;
    const spaceAbove = rect.top - gap;
    const openUp = spaceBelow < 220 && spaceAbove > spaceBelow;
    const maxH = Math.max(140, Math.floor(openUp ? spaceAbove : spaceBelow));

    dropdown.style.position = 'fixed';
    dropdown.style.left = rect.left + 'px';
    dropdown.style.width = rect.width + 'px';
    dropdown.style.minWidth = rect.width + 'px';
    dropdown.style.maxHeight = maxH + 'px';
    dropdown.style.overflowY = 'auto';
    dropdown.style.zIndex = '2147483647';
    dropdown.style.isolation = 'isolate';
    if (openUp) {
      dropdown.style.top = 'auto';
      dropdown.style.bottom = (vh - rect.top + gap) + 'px';
    } else {
      dropdown.style.bottom = 'auto';
      dropdown.style.top = (rect.bottom + gap) + 'px';
    }
  }

  // Binds selection to a dropdown item. Uses the native `click` event, which
  // the browser fires only for a real tap — a scroll-drag never synthesizes a
  // click — so vertical scrolling of the list works untouched. (Desktop also
  // gets click.) The dropdown stays open during scroll because hiding is
  // driven by an outside-pointerdown handler, not input blur.
  function bindItemActivate(item, onSelect) {
    item.addEventListener('click', e => {
      e.preventDefault();
      onSelect();
    });
  }

  // ---- Month dropdown ----

  var monthData = [];

  function populateMonths(calId) {
    const t = I18N[currentLang];
    const cal = calId ? CALENDARS[calId] : null;
    const savedNum = fromMonthSelect.dataset.monthValue;
    monthData = [];
    fromMonthSelect.value = '';
    fromMonthSelect.dataset.monthValue = '';

    if (cal) {
      const names = cal.monthNames(t);
      for (var i = 0; i < cal.monthCount; i++) {
        monthData.push({ num: i + 1, name: names[i] });
      }
    }

    if (savedNum) setMonthByNumber(parseInt(savedNum, 10));
  }

  function setMonthByNumber(num) {
    if (!num) {
      fromMonthSelect.value = '';
      fromMonthSelect.dataset.monthValue = '';
      return;
    }
    var m = monthData.find(function(d) { return d.num === num; });
    if (m) {
      fromMonthSelect.value = m.name;
      fromMonthSelect.dataset.monthValue = String(m.num);
    } else {
      fromMonthSelect.value = '';
      fromMonthSelect.dataset.monthValue = '';
    }
  }

  function getMonthValue() {
    return parseInt(fromMonthSelect.dataset.monthValue, 10) || null;
  }

  // ---- ARIA dla list podpowiedzi (wzorzec combobox + listbox) ----
  // Pole zachowuje fokus, a „aktywną" opcję czytnik ekranu dostaje przez aria-activedescendant.

  var ariaListSeq = 0;

  function ariaInitCombobox(input) {
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-haspopup', 'listbox');
    input.setAttribute('aria-expanded', 'false');
  }

  function ariaOpenList(input, dropdown) {
    var listId = 'cal-list-' + (++ariaListSeq);
    dropdown.id = listId;
    dropdown.setAttribute('role', 'listbox');
    var n = 0;
    Array.prototype.forEach.call(dropdown.querySelectorAll('.cal-item'), function(item) {
      if (item.classList.contains('cal-item--empty')) { item.setAttribute('role', 'presentation'); return; }
      item.setAttribute('role', 'option');
      item.id = listId + '-o' + (n++);
      item.setAttribute('aria-selected', 'false');
    });
    // Grupy kalendarzy: etykieta grupy jest nazwą grupy dla czytnika, wizualny nagłówek się nie powtarza.
    Array.prototype.forEach.call(dropdown.querySelectorAll('.cal-group'), function(g) {
      var lab = g.querySelector('.cal-group-label');
      g.setAttribute('role', 'group');
      if (lab) { g.setAttribute('aria-label', lab.textContent); lab.setAttribute('aria-hidden', 'true'); }
      var wrap = g.querySelector('.cal-group-items');
      if (wrap) wrap.setAttribute('role', 'presentation');
    });
    input.setAttribute('aria-controls', listId);
    input.setAttribute('aria-expanded', 'true');
  }

  function ariaCloseList(input) {
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-controls');
    input.removeAttribute('aria-activedescendant');
  }

  function ariaSetActive(input, items, index) {
    items.forEach(function(li, i) { li.setAttribute('aria-selected', i === index ? 'true' : 'false'); });
    if (index >= 0 && index < items.length) input.setAttribute('aria-activedescendant', items[index].id);
    else input.removeAttribute('aria-activedescendant');
  }

  function setupMonthDropdown(input) {
    var dropdown = null;
    ariaInitCombobox(input);
    var activeIndex = -1;
    var outsideHandler = null;
    var isMobileDevice = 'ontouchstart' in window;

    if (isMobileDevice) {
      input.setAttribute('readonly', 'readonly');
    }

    function reposition() { if (dropdown) placeFixedDropdown(dropdown, input); }

    // Filtr ignoruje transliterację: „raj" znajdzie „Raǧab", „dhu" znajdzie „Ḏū al-Ḥiǧǧa".
    // Zamiany liter z ISO 233 na zwyczajowy zapis najpierw, potem zdjęcie znaków diakrytycznych.
    function fold(s) {
      return s.toLowerCase()
        .replace(/ǧ/g, 'j').replace(/š/g, 'sh').replace(/ḫ/g, 'kh')
        .replace(/ḏ/g, 'dh').replace(/ṯ/g, 'th').replace(/ġ/g, 'gh')
        .normalize('NFD').replace(/[̀-ͯʻʾʿʼ]/g, '');
    }

    function getFiltered(query) {
      if (!query || isMobileDevice) return monthData;
      var lower = fold(query);
      return monthData.filter(function(m) {
        return fold(m.name).indexOf(lower) !== -1;
      });
    }

    function show(query) {
      hide();
      if (monthData.length === 0) return;
      var filtered = getFiltered(isMobileDevice ? '' : query);
      dropdown = el('div', { class: 'cal-suggestions' });

      if (!query) {
        var clearItem = el('div', { class: 'cal-item', text: '\u2014' });
        bindItemActivate(clearItem, function() {
          input.value = '';
          input.dataset.monthValue = '';
          // Bez miesiąca dzień nie ma sensu: zerujemy go razem z miesiącem (wynik wraca do „cały rok")
          $('#from-day').value = '';
          hide();
          input.classList.remove('has-error');
          if (resultPanel.classList.contains('has-result')) convert();
        });
        dropdown.appendChild(clearItem);
      }

      if (filtered.length === 0) {
        dropdown.appendChild(el('div', { class: 'cal-item cal-item--empty', text: '\u2014' }));
      } else {
        filtered.forEach(function(m) {
          var item = el('div', { class: 'cal-item', text: m.name });
          bindItemActivate(item, function() {
            input.value = m.name;
            input.dataset.monthValue = String(m.num);
            hide();
            input.classList.remove('has-error');
            if (resultPanel.classList.contains('has-result')) convert();
          });
          dropdown.appendChild(item);
        });
      }

      document.body.appendChild(dropdown);
      placeFixedDropdown(dropdown, input);
      activeIndex = -1;
      ariaOpenList(input, dropdown);

      outsideHandler = function(ev) {
        if (dropdown && !dropdown.contains(ev.target) && ev.target !== input) hide();
      };
      var handlerToInstall = outsideHandler;
      requestAnimationFrame(function() {
        if (outsideHandler === handlerToInstall && dropdown) {
          document.addEventListener('pointerdown', outsideHandler, true);
        }
      });
      window.addEventListener('resize', reposition);
      window.addEventListener('scroll', reposition, true);
    }

    function hide() {
      if (dropdown) { dropdown.remove(); dropdown = null; activeIndex = -1; }
      ariaCloseList(input);
      if (outsideHandler) {
        document.removeEventListener('pointerdown', outsideHandler, true);
        window.removeEventListener('resize', reposition);
        window.removeEventListener('scroll', reposition, true);
        outsideHandler = null;
      }
    }

    function getItems() {
      return dropdown ? Array.from(dropdown.querySelectorAll('.cal-item:not(.cal-item--empty)')) : [];
    }

    function setActive(index) {
      if (!dropdown) return;
      var items = getItems();
      items.forEach(function(li) { li.classList.remove('active'); });
      activeIndex = index;
      if (activeIndex >= 0 && activeIndex < items.length) {
        items[activeIndex].classList.add('active');
        items[activeIndex].scrollIntoView({ block: 'nearest' });
      }
      ariaSetActive(input, items, activeIndex);
    }

    // Gdy miesiąc jest już wybrany (pole pokazuje jego pełną nazwę), lista ma pokazać wszystkie
    // miesiące, nie tylko ten jeden; filtr działa dopiero, gdy użytkownik coś wpisuje.
    function openQuery() { return (isMobileDevice || input.dataset.monthValue) ? '' : input.value; }
    input.addEventListener('focus', function() {
      if (!isMobileDevice && input.dataset.monthValue) input.select();
      show(openQuery());
    });
    input.addEventListener('click', function() { show(openQuery()); });

    if (!isMobileDevice) {
      input.addEventListener('input', function() {
        input.dataset.monthValue = '';
        show(input.value);
      });
    }

    input.addEventListener('blur', function() {
      if (input.dataset.monthValue || !input.value.trim()) { if (!input.dataset.monthValue) input.value = ''; return; }
      // Wpisany tekst bez wybranej pozycji: jedno dopasowanie przyjmujemy, inaczej zostawiamy tekst,
      // żeby Convert mógł powiedzieć, co jest nie tak (dawniej pole czyściło się po cichu).
      var matches = getFiltered(input.value);
      if (matches.length === 1) {
        input.value = matches[0].name;
        input.dataset.monthValue = String(matches[0].num);
      }
    });

    input.addEventListener('keydown', function(e) {
      if (!dropdown) return;
      var items = getItems();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive(Math.min(activeIndex + 1, items.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive(Math.max(activeIndex - 1, 0));
      } else if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault();
        items[activeIndex].click();
      } else if (e.key === 'Enter' && input.value.trim() && items.length > 0) {
        // Wpisane „raj" + Enter: przyjmij pierwszą podpowiedź, zamiast po cichu
        // zignorować wpis (blur czyści pole bez wybranego miesiąca) i przeliczyć cały rok.
        e.preventDefault();
        items[0].click();
        if (!resultPanel.classList.contains('has-result')) convert();
      } else if (e.key === 'Enter' && input.value.trim() && items.length === 0) {
        // Wpis bez dopasowania: nie przeliczaj po cichu całego roku, tylko powiedz, co jest nie tak.
        e.preventDefault();
        var monthCal = resolveCalendar(fromCalInput.value);
        showError(fmt(I18N[currentLang].errUnknownMonth, {
          cal: monthCal ? (I18N[currentLang].calendars[monthCal.id] || monthCal.id) : '',
          text: input.value.trim()
        }), input);
      } else if (e.key === 'Escape') {
        hide();
      }
    });
  }

  function updateMonthSelects() {
    const srcCal = resolveCalendar(fromCalInput.value);
    populateMonths(srcCal ? srcCal.id : null);
  }

  // ---- Language ----

  function setLang(lang) {
    // Resolve current calendar selections before switching language
    const prevSrcCal = resolveCalendar(fromCalInput.value);
    const prevTgtCal = resolveCalendar(toCalInput.value);

    currentLang = lang;
    kkStore.set('kalkal-lang', lang);

    const t = I18N[lang];
    document.documentElement.lang = lang;
    document.documentElement.dir = 'ltr';

    appTitle.textContent = t.appTitle;
    appSubtitle.textContent = t.appSubtitle;

    $$('[data-i18n]').forEach(node => {
      const key = node.dataset.i18n;
      if (t[key]) node.textContent = t[key];
    });

    $$('[data-i18n-placeholder]').forEach(node => {
      const key = node.dataset.i18nPlaceholder;
      if (t[key]) node.placeholder = t[key];
    });

    $$('[data-i18n-aria-label]').forEach(node => {
      const key = node.dataset.i18nAriaLabel;
      if (t[key]) node.setAttribute('aria-label', t[key]);
    });
    $$('[data-i18n-title]').forEach(node => {
      const key = node.dataset.i18nTitle;
      if (t[key]) node.title = t[key];
    });

    $$('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Update calendar input values to the new language's names
    if (prevSrcCal) fromCalInput.value = t.calendars[prevSrcCal.id] || fromCalInput.value;
    if (prevTgtCal) toCalInput.value = t.calendars[prevTgtCal.id] || toCalInput.value;

    updateMonthSelects();
    updateVariantBar(fromVariantsBar, fromCalInput);
    updateVariantBar(toVariantsBar, toCalInput);
    updateCalDescLink(fromCalInput, 'from-cal-desc');
    updateCalDescLink(toCalInput, 'to-cal-desc');
    renderIntroExample();
    document.title = 'kalkal \u2014 ' + t.appTitle;
    // Re-run conversion so result panel + copy box rebuild in new language
    if (resultPanel.classList.contains('has-result')) convert();
  }

  // ---- Calendar autocomplete ----

  function setupAutocomplete(input) {
    let dropdown = null;
    let activeIndex = -1;
    let outsideHandler = null;

    ariaInitCombobox(input);

    if ('ontouchstart' in window) {
      input.setAttribute('readonly', 'readonly');
    }
    input.addEventListener('contextmenu', e => e.preventDefault());

    const CALENDAR_GROUPS = [
      { group: 'universal', ids: ['human'] },
      { group: 'christian', ids: ['gregorian', 'julian', 'byzantine', 'spanish'] },
      { group: 'islamic', ids: ['hijri', 'solarHijri', 'rumi'] },
      { group: 'iranian', ids: ['yazdgerdi', 'ilkhani', 'armenian'] },
      { group: 'semitic', ids: ['hebrew', 'syriac', 'antiochene', 'seleucid', 'babylonian'] },
      { group: 'african', ids: ['coptic', 'ethiopian', 'egyptian'] },
      { group: 'grecoRoman', ids: ['roman', 'olympiad', 'macedonian'] },
      { group: 'scientific', ids: ['bp'] }
    ];

    function getMatches(query) {
      const t = I18N[currentLang];
      const lower = query.trim().toLowerCase();
      const results = [];
      CALENDAR_GROUPS.forEach(g => {
        const items = g.ids
          .filter(id => t.calendars[id])
          .filter(id => !lower || t.calendars[id].toLowerCase().startsWith(lower) || id.startsWith(lower))
          .map(id => ({ id, name: t.calendars[id] }));
        if (items.length > 0) results.push({ group: g.group, items });
      });
      return results;
    }

    function show(groups) {
      hide();
      if (groups.length === 0) return;
      const t = I18N[currentLang];
      dropdown = el('div', { class: 'cal-suggestions' });
      groups.forEach(g => {
        const groupLabel = (t.calendarGroups && t.calendarGroups[g.group]) || g.group;
        const itemsWrap = el('div', { class: 'cal-group-items' });
        g.items.forEach(m => {
          const item = el('div', { class: 'cal-item', text: m.name });
          bindItemActivate(item, () => {
            input.value = m.name;
            hide();
            input.classList.remove('has-error');
            onCalendarChange(input);
          });
          itemsWrap.appendChild(item);
        });
        const group = el('div', { class: 'cal-group' },
          el('div', { class: 'cal-group-label', text: groupLabel }),
          itemsWrap
        );
        dropdown.appendChild(group);
      });
      document.body.appendChild(dropdown);
      positionDropdown();
      activeIndex = -1;
      ariaOpenList(input, dropdown);

      outsideHandler = ev => {
        if (dropdown && !dropdown.contains(ev.target) && ev.target !== input) hide();
      };
      // Defer registration to the next frame so the SAME pointerdown that
      // opened the dropdown (via focus/click) can't reach outsideHandler and
      // instantly close it — a race we've observed on both desktop + mobile.
      const handlerToInstall = outsideHandler;
      requestAnimationFrame(() => {
        if (outsideHandler === handlerToInstall && dropdown) {
          document.addEventListener('pointerdown', outsideHandler, true);
        }
      });
      window.addEventListener('resize', positionDropdown);
      window.addEventListener('scroll', positionDropdown, true);
    }

    function positionDropdown() {
      if (!dropdown) return;
      placeFixedDropdown(dropdown, input);
    }

    function hide() {
      if (dropdown) {
        dropdown.remove();
        dropdown = null;
        activeIndex = -1;
      }
      ariaCloseList(input);
      if (outsideHandler) {
        document.removeEventListener('pointerdown', outsideHandler, true);
        window.removeEventListener('resize', positionDropdown);
        window.removeEventListener('scroll', positionDropdown, true);
        outsideHandler = null;
      }
    }

    function getSelectableItems() {
      if (!dropdown) return [];
      return Array.from(dropdown.querySelectorAll('.cal-item'));
    }

    function setActive(index) {
      if (!dropdown) return;
      const items = getSelectableItems();
      items.forEach(li => li.classList.remove('active'));
      activeIndex = index;
      if (activeIndex >= 0 && activeIndex < items.length) {
        items[activeIndex].classList.add('active');
        items[activeIndex].scrollIntoView({ block: 'nearest' });
      }
      ariaSetActive(input, items, activeIndex);
    }

    input.addEventListener('focus', () => {
      if (!('ontouchstart' in window)) input.select();
      show(getMatches(''));
    });

    input.addEventListener('click', () => {
      show(getMatches(''));
    });

    input.addEventListener('input', () => {
      show(getMatches(input.value));
      input.classList.remove('has-error');
      clearError();
      onCalendarChange(input);
    });

    input.addEventListener('keydown', e => {
      if (!dropdown) return;
      const items = getSelectableItems();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive(Math.min(activeIndex + 1, items.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive(Math.max(activeIndex - 1, 0));
      } else if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault();
        items[activeIndex].click();
      } else if (e.key === 'Escape') {
        hide();
      }
    });
  }

  // ---- Calendar resolution ----

  function resolveCalendar(inputValue) {
    const t = I18N[currentLang];
    const lower = inputValue.trim().toLowerCase();
    if (!lower) return null;
    for (const [id, name] of Object.entries(t.calendars)) {
      if (name.toLowerCase() === lower) return CALENDARS[id];
    }
    if (CALENDARS[lower]) return CALENDARS[lower];
    for (const [id, name] of Object.entries(t.calendars)) {
      if (name.toLowerCase().startsWith(lower) || id.startsWith(lower)) return CALENDARS[id];
    }
    return null;
  }

  // ---- Error handling ----

  function showError(msg, inputEl) {
    errorPanel.textContent = msg;
    if (inputEl) {
      inputEl.classList.add('has-error');
      // Czytnik ekranu: pole jest błędne, a powód jest w panelu błędu (role="alert")
      inputEl.setAttribute('aria-invalid', 'true');
      inputEl.setAttribute('aria-describedby', 'form-error');
    }
  }

  function clearError() {
    errorPanel.textContent = '';
    document.querySelectorAll('.has-error').forEach(el => {
      el.classList.remove('has-error');
      el.removeAttribute('aria-invalid');
      el.removeAttribute('aria-describedby');
    });
  }

  // ---- Komunikaty błędów: szablony z podpowiedzią, co poprawić ----

  // Zdanie zaczyna się od nazwy miesiąca, a w PL nazwy miesięcy są pisane małą literą
  function upperFirst(str) { return str ? str.charAt(0).toLocaleUpperCase(currentLang) + str.slice(1) : str; }

  function fmt(tpl, vars) {
    return tpl.replace(/\{(\w+)\}/g, function(m, k) { return k in vars ? vars[k] : m; });
  }

  function editDistance(a, b) {
    var prev = [], cur = [], i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      cur = [i];
      for (j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      prev = cur;
    }
    return prev[b.length];
  }

  // Do trzech kalendarzy, o które mogło chodzić: najpierw nazwa zawierająca wpisany fragment,
  // potem literówka. Literówka = odległość edycyjna od pierwszego słowa nazwy (całego albo
  // obciętego do długości wpisu, żeby „julan" pasowało do „juliański") nie większa niż 1 na 4 znaki.
  function suggestCalendars(text) {
    var t = I18N[currentLang];
    var q = text.trim().toLowerCase();
    if (!q) return [];
    var ids = Object.keys(t.calendars);
    var hits = ids.filter(function(id) {
      return t.calendars[id].toLowerCase().indexOf(q) !== -1 || id.toLowerCase().indexOf(q) !== -1;
    });
    if (!hits.length) {
      var limit = Math.max(1, Math.floor(q.length / 4));
      var plain = function(x) { return x.toLowerCase().replace(/\u0142/g, 'l').normalize('NFD').replace(/[\u0300-\u036f]/g, ''); };
      var pq = plain(q);
      hits = ids.map(function(id) {
        var word = plain(t.calendars[id]).split(/[\s(]/)[0];
        var d = Math.min(editDistance(pq, word), editDistance(pq, word.slice(0, pq.length)), editDistance(pq, word.slice(0, pq.length + 1)));
        return { id: id, d: d };
      }).filter(function(x) { return x.d <= limit; })
        .sort(function(a, b) { return a.d - b.d; })
        .map(function(x) { return x.id; });
    }
    return hits.slice(0, 3).map(function(id) { return t.calendars[id]; });
  }

  function unknownCalendarMessage(text) {
    var t = I18N[currentLang];
    var s = suggestCalendars(text);
    if (s.length) return fmt(t.errUnknownCalHint, { text: text, list: s.join(', ') });
    return fmt(t.errUnknownCalNone, { text: text });
  }

  // ---- Validation & Conversion ----

  function convert() {
    clearError();
    const t = I18N[currentLang];

    // Validate source calendar (default: gregorian)
    const fromCalVal = fromCalInput.value.trim();
    const srcCal = fromCalVal ? resolveCalendar(fromCalVal) : CALENDARS.gregorian;
    if (!srcCal) { showError(unknownCalendarMessage(fromCalVal), fromCalInput); return; }

    // Validate target calendar (default: gregorian / Christian Era)
    const toCalVal = toCalInput.value.trim();
    const tgtCal = toCalVal ? resolveCalendar(toCalVal) : CALENDARS.gregorian;
    if (!tgtCal) { showError(unknownCalendarMessage(toCalVal), toCalInput); return; }

    if (srcCal.id === tgtCal.id) {
      showError(fmt(t.errSameCalNamed, { cal: t.calendars[srcCal.id] || srcCal.id }), toCalInput);
      return;
    }

    // Ensure default variants for validation & range conversions
    if (srcCal.variants) srcCal._variant = srcCal.defaultVariant;
    if (tgtCal.variants) tgtCal._variant = tgtCal.defaultVariant;

    // Validate year: liczba całkowita w zakresie, który silnik liczy szybko i bez zawieszeń
    // (powyżej ~10^7 niektóre kalendarze, np. babiloński, wpadają w bardzo długie pętle).
    // Number() zamiast parseInt(): „1e3" ma być 1000, a „1445.5" błędem, nie cichym 1445.
    const yearRaw = $('#from-year').value.trim();
    const fromYear = Number(yearRaw);
    if (!yearRaw || !Number.isInteger(fromYear) || fromYear < 1) {
      showError(t.errNoYearHint, $('#from-year')); return;
    }
    if (fromYear > MAX_YEAR) {
      showError(fmt(t.errYearTooBig, { max: MAX_YEAR.toLocaleString(currentLang) }), $('#from-year')); return;
    }

    // Miesiąc wpisany tekstem, ale niedopasowany do żadnego: błąd, nie ciche przeliczenie całego roku
    const monthText = fromMonthSelect.value.trim();
    if (monthText && !getMonthValue()) {
      showError(fmt(t.errUnknownMonth, { cal: t.calendars[srcCal.id] || srcCal.id, text: monthText }), fromMonthSelect);
      return;
    }

    const fromMonth = getMonthValue();
    // Dzień: puste pole = brak; 0, ułamek albo tekst = błąd (dawniej 0 było traktowane jak puste)
    const dayRaw = $('#from-day').value.trim();
    const dayNum = dayRaw === '' ? null : Number(dayRaw);
    const fromDay = dayNum;

    // Validate month
    if (fromMonth && (fromMonth < 1 || fromMonth > srcCal.monthCount)) {
      showError(fmt(t.errMonthRange, { cal: t.calendars[srcCal.id] || srcCal.id, n: srcCal.monthCount }), $('#from-month'));
      return;
    }

    // Dzień bez miesiąca nie ma sensu: nie ignorujemy go po cichu
    if (fromDay !== null && !fromMonth) {
      showError(t.errDayNeedsMonth, fromMonthSelect); return;
    }

    // Validate day: komunikat podaje nazwę miesiąca i liczbę jego dni (różna zależnie od roku i wariantu)
    if (fromDay !== null) {
      const maxDay = srcCal.monthLength(fromYear, fromMonth);
      if (!Number.isInteger(fromDay) || fromDay < 1 || fromDay > maxDay) {
        showError(fmt(t.errDayRange, {
          month: upperFirst(genNames(srcCal, t)[fromMonth - 1] || String(fromMonth)),
          year: fromYear,
          n: maxDay
        }), $('#from-day'));
        return;
      }
    }

    if (fromDay && fromMonth) {
      convertDate(srcCal, tgtCal, fromYear, fromMonth, fromDay, t);
    } else if (fromMonth) {
      const startD = 1;
      const endD = srcCal.monthLength(fromYear, fromMonth);
      convertRange(srcCal, tgtCal, fromYear, fromMonth, startD, fromYear, fromMonth, endD, t);
    } else {
      convertYearRange(srcCal, tgtCal, fromYear, t);
    }

    syncUrl(srcCal, tgtCal, fromYear, fromMonth, fromDay);
    recordConversion();
  }

  // Adres strony odzwierciedla bieżące zapytanie (?cal=&y=&m=&d=&to=), żeby dało się je
  // zacytować, zapisać w zakładkach i wrócić do niego. Czytane przy starcie (niżej, „Handle URL parameters").
  function syncUrl(src, tgt, y, m, d) {
    try {
      var q = new URLSearchParams();
      q.set('cal', src.id);
      q.set('y', String(y));
      if (m) q.set('m', String(m));
      if (m && d) q.set('d', String(d));
      q.set('to', tgt.id);
      history.replaceState(null, '', location.pathname + '?' + q.toString());
    } catch (e) { /* file:// albo osadzenie bez History API: adres po prostu się nie zmienia */ }
  }

  // Pierwszy (domyślny) wynik ostatniej konwersji: zamiana kalendarzy ⇄ przenosi go do pola źródłowego
  var lastResult = null;

  function convertDate(src, tgt, y, m, d, t) {
    var hasSrcVars = !!src.variants;
    var hasTgtVars = !!tgt.variants;

    // When both sides have variants, the higher-priority one gets groups,
    // the lower-priority one gets a toggle switcher in results
    var secondaryCal = null;
    var srcVars, tgtVars;
    if (hasSrcVars && hasTgtVars) {
      var srcPrio = VARIANT_PRIORITY[src.id] || 99;
      var tgtPrio = VARIANT_PRIORITY[tgt.id] || 99;
      if (srcPrio <= tgtPrio) {
        secondaryCal = tgt;
        srcVars = src.variants.slice();
        tgtVars = [tgt._variant];
      } else {
        secondaryCal = src;
        srcVars = [src._variant];
        tgtVars = tgt.variants.slice();
      }
    } else {
      srcVars = hasSrcVars ? src.variants.slice() : [null];
      tgtVars = hasTgtVars ? tgt.variants.slice() : [null];
    }

    // Compute all variant combinations, grouped by identical target date
    var groups = new Map();
    for (var si = 0; si < srcVars.length; si++) {
      var sv = srcVars[si];
      if (hasSrcVars) src._variant = sv;
      var maxDay = src.monthLength(y, m);
      if (d > maxDay) continue;
      var jd = src.toJD(y, m, d);
      for (var ti = 0; ti < tgtVars.length; ti++) {
        var tv = tgtVars[ti];
        if (hasTgtVars) tgt._variant = tv;
        var result = tgt.fromJD(jd);
        var key = result.year + '-' + result.month + '-' + result.day;
        if (!groups.has(key)) {
          var dow = Cal.getDayOfWeek(jd);
          var tgtNames = genNames(tgt, t);
          groups.set(key, { result: result, jd: jd, dow: dow, tgtNames: tgtNames, labels: [] });
        }
        var vlabel = '';
        if (hasSrcVars && !secondaryCal) vlabel = VARIANT_LABELS[sv] || sv;
        else if (hasTgtVars && !secondaryCal) vlabel = VARIANT_LABELS[tv] || tv;
        else if (secondaryCal === tgt) vlabel = VARIANT_LABELS[sv] || sv;
        else if (secondaryCal === src) vlabel = VARIANT_LABELS[tv] || tv;
        if (vlabel) {
          var existing = groups.get(key).labels;
          if (existing.indexOf(vlabel) < 0) existing.push(vlabel);
        }
      }
    }

    var groupList = [];
    groups.forEach(function(v) { groupList.push(v); });
    var showVarLabels = groupList.length > 1;
    var primaryJd = groupList[0].jd;

    if (hasSrcVars) src._variant = src.defaultVariant;
    var srcNames = genNames(src, t);

    var elements = [];

    // Toggle for secondary source calendar
    if (secondaryCal === src) {
      var srcBar = el('div', { class: 'result-variant-bar' });
      src.variants.forEach(function(v) {
        var btn = el('button', {
          type: 'button',
          class: 'variant-btn' + (v === src._variant ? ' active' : ''),
          text: VARIANT_LABELS[v] || v
        });
        btn.addEventListener('click', function() {
          src._variant = v;
          convertDate(src, tgt, y, m, d, t);
        });
        srcBar.appendChild(btn);
      });
      elements.push(srcBar);
    }

    // Toggle for secondary target calendar
    if (secondaryCal === tgt) {
      var tgtBar = el('div', { class: 'result-variant-bar' });
      tgt.variants.forEach(function(v) {
        var btn = el('button', {
          type: 'button',
          class: 'variant-btn' + (v === tgt._variant ? ' active' : ''),
          text: VARIANT_LABELS[v] || v
        });
        btn.addEventListener('click', function() {
          tgt._variant = v;
          convertDate(src, tgt, y, m, d, t);
        });
        tgtBar.appendChild(btn);
      });
      elements.push(tgtBar);
    }

    // Build result bridge — prominent year-comparison layout
    var g0 = groupList[0];
    var srcCalName = t.calendars[src.id] || src.id;
    var tgtCalName = t.calendars[tgt.id] || tgt.id;
    var srcMonthName = srcNames[m - 1] || '';
    var srcDetail = srcMonthName ? (d + '\u00a0' + srcMonthName) : String(d);
    var tgtMonth0 = g0.tgtNames[g0.result.month - 1] || '';
    var tgtYearStr = tgt.id === 'roman' ? (g0.result.year + '\u00a0AUC') : String(g0.result.year);
    var tgtDetail;
    if (tgt.id === 'roman' && g0.result.day) {
      tgtDetail = Cal.romanDayNotation(g0.result.month, g0.result.day, tgt.isLeap(g0.result.year));
    } else {
      tgtDetail = tgtMonth0 ? (g0.result.day + '\u00a0' + tgtMonth0) : '';
    }

    // Single-day bridge \u2014 one line per side (full date inline)
    var srcDetailSp = srcDetail.replace(/\u00a0/g, ' ');
    var tgtDetailSp = tgtDetail.replace(/\u00a0/g, ' ');
    var srcFullText = srcDetailSp ? (srcDetailSp + ' ' + y) : String(y);
    var tgtFullText = tgtDetailSp ? (tgtDetailSp + ' ' + tgtYearStr.replace(/\u00a0/g, ' ')) : tgtYearStr.replace(/\u00a0/g, ' ');

    var bridge = el('div', { class: 'result-bridge bridge-single-line' });
    var tgtFullEl = el('span', { class: 'bridge-tgt-full' }, tgtFullText);
    var tgtTag = calTag(tgt.id);
    if (tgtTag) tgtFullEl.appendChild(el('small', { class: 'bridge-cal', text: tgtTag }));
    bridge.appendChild(tgtFullEl);
    var srcTag = calTag(src.id);
    bridge.appendChild(el('span', { class: 'bridge-src-caption', text: srcFullText + (srcTag ? ' ' + srcTag : '') }));
    elements.push(bridge);

    // Proweniencja wyniku: dzień tygodnia (najszybszy test poprawności daty historycznej)
    // oraz informacja, czy sprawdzone warianty kalendarza dają ten sam wynik.
    var provenance = el('p', { class: 'result-provenance' });
    // Gdy warianty dają różne daty, dzień tygodnia jest różny dla każdej z nich:
    // wtedy pokazujemy go przy wierszach wariantów, nie raz nad wszystkimi.
    var dowName = !showVarLabels && t.weekdays && t.weekdays[g0.dow];
    if (dowName) provenance.appendChild(el('strong', { class: 'result-provenance-dow', text: dowName }));
    var varCal = srcVars.length > 1 ? src : (tgtVars.length > 1 ? tgt : null);
    if (varCal) {
      var varCalName = t.calendars[varCal.id] || varCal.id;
      var varTpl = (showVarLabels ? t.variantsDiffer : t.variantsAgree) || '{cal}';
      var varText = varTpl.replace('{cal}', varCalName);
      if (dowName) provenance.appendChild(document.createTextNode(' · '));
      // Wybór wariantu mieszka w Ustawieniach: link prowadzi do właściwej sekcji
      if (SETTINGS_VARIANT_CALS.indexOf(varCal.id) >= 0) {
        provenance.appendChild(el('a', { class: 'result-provenance-link', href: 'settings.html#set-' + varCal.id, text: varText }));
      } else {
        provenance.appendChild(document.createTextNode(varText));
      }
    }
    if (provenance.firstChild) elements.push(provenance);

    // Hidden element for legacy copy-button (full target date string)
    var copyEl = el('span', { class: 'result-main' });
    copyEl.textContent = tgtFullText;
    copyEl.style.display = 'none';
    elements.push(copyEl);

    // Copy data for accordion copy box
    var tgtYearOnlyText = String(g0.result.year) + (tgt.id === 'roman' ? ' AUC' : '');
    var srcYearOnlyText = String(y) + (src.id === 'roman' ? ' AUC' : '');
    var tgtShort = shortCalName(tgt.id);
    var srcShort = shortCalName(src.id);
    var singleCopyData = {
      kind: 'single',
      defaultText: tgtFullText,
      yearOnlyText: tgtYearOnlyText,
      fullBlockText: tgtFullText + ' ' + tgtShort,
      yearPairText: null,
      tgtCalLabel: tgtCalName,
      srcCalLabel: srcCalName,
    };
    if (tgt.id === 'gregorian' && src.id !== 'gregorian') {
      // tgt is AD — other (src) on left, AD on right: "<src>/<tgt>"
      singleCopyData.yearPairText = srcYearOnlyText + '/' + tgtYearOnlyText;
    } else if (src.id === 'gregorian' && tgt.id !== 'gregorian') {
      // src is AD — other (tgt) on left, AD on right
      singleCopyData.yearPairText = tgtYearOnlyText + '/' + srcYearOnlyText;
    }

    // Alternate variant results below bridge (when multiple variant groups differ)
    if (showVarLabels) {
      for (var gi = 0; gi < groupList.length; gi++) {
        var g = groupList[gi];
        if (g.labels.length === 0) continue;
        var altText;
        if (tgt.id === 'roman' && g.result.day) {
          altText = Cal.romanDayNotation(g.result.month, g.result.day, tgt.isLeap(g.result.year)) + ' ' + g.result.year + ' AUC';
        } else {
          altText = g.result.day + ' ' + g.tgtNames[g.result.month - 1] + ' ' + g.result.year;
        }
        if (t.weekdays && t.weekdays[g.dow]) altText += ', ' + t.weekdays[g.dow];
        // Nazwa wariantu (etykieta) i jego data (dane) jako osobne elementy,
        // żeby data mogła być czytelna, a nazwa — cicha (patrz style.css, blok „TYPE SCALE").
        var variantRow = el('p', { class: 'result-variant-label' },
          el('span', { class: 'result-variant-name', text: g.labels.join(', ') }),
          el('span', { class: 'result-variant-date', text: altText }));
        // Wariant domyślny (z Ustawień) oznaczony, żeby było wiadomo, który z wyników cytować
        var defLabel = varCal && VARIANT_LABELS[varCal.defaultVariant];
        if (defLabel && g.labels.indexOf(defLabel) >= 0) {
          variantRow.appendChild(el('span', { class: 'result-variant-tag', text: t.variantDefaultTag || 'default' }));
        }
        elements.push(variantRow);
      }
    }
    if (tgt.id === 'byzantine') {
      var ind = Cal.indictionFromJD(g0.jd);
      elements.push(el('p', { class: 'result-secondary result-indiction', text: (t.indictionLabel || 'Indiction') + ' ' + ind }));
    }

    var primaryResult = groupList[0].result;
    lastResult = { tgtId: tgt.id, year: primaryResult.year, month: primaryResult.month, day: primaryResult.day };
    if (tgt.id === 'ilkhani') {
      var animal = Cal.ilkhaniAnimalYear(primaryResult.year);
      var animalName = (t.ilkhaniAnimals && t.ilkhaniAnimals[animal]) || animal;
      elements.push(el('p', { class: 'result-secondary result-animal', text: (t.animalYearLabel || 'Animal year') + ': ' + animalName }));
    }
    if (tgt.id === 'babylonian') {
      var isPD = Cal.isBabylonianPD(primaryResult.year);
      var note = isPD ? (t.babylonianPDNote || 'Observational date from Parker & Dubberstein tables (626 BCE \u2013 45 CE).') : (t.babylonianArithNote || 'Arithmetic approximation (outside Parker & Dubberstein range). May differ \u00b11\u20132 days from historical observation.');
      elements.push(el('p', { class: 'result-note', text: note }));
    }
    // Build astro content for separate card
    var astroElements = [];
    var zi = Cal.getZodiacSign(primaryJd);
    var zodiacSymbol = '\u2648\u2649\u264A\u264B\u264C\u264D\u264E\u264F\u2650\u2651\u2652\u2653'[zi];
    astroElements.push(el('p', { class: 'result-zodiac', text: zodiacSymbol + ' ' + t.zodiacSigns[zi] }));

    // Eclipse check
    if (typeof Eclipses !== 'undefined') {
      var ecl = Eclipses.lookup(primaryJd);
      if (ecl) {
        var typeStr = Eclipses.typeLabel(ecl.type, t);
        var magStr = ecl.mag ? ' (' + ecl.mag.toFixed(3) + ')' : '';
        var eclEl = el('div', { class: 'result-eclipse' },
          el('span', { class: 'eclipse-icon' }),
          el('span', { class: 'eclipse-type', text: (t.eclipseLabel || 'Solar eclipse') + ': ' + typeStr + magStr })
        );
        if (ecl.notable && ecl.noteKey && t.eclipseNotes && t.eclipseNotes[ecl.noteKey]) {
          eclEl.appendChild(el('p', { class: 'eclipse-note', text: t.eclipseNotes[ecl.noteKey] }));
        }
        if (ecl.notable) {
          var mapLink = document.createElement('a');
          mapLink.className = 'eclipse-map-link';
          if (ecl.noteKey === 'ibrahim632') {
            mapLink.href = 'eklipso.html';
          } else if (ecl.noteKey) {
            var he = (ecl.year + 10000) + '' + (ecl.month < 10 ? '0' : '') + ecl.month + (ecl.day < 10 ? '0' : '') + ecl.day;
            mapLink.href = 'maps/' + he + '.html';
          } else {
            mapLink.href = 'eclipses.html';
          }
          mapLink.textContent = ecl.noteKey ? (t.eclipseViewMap || 'View eclipse map') : (t.eclipseViewCatalogue || 'Eclipse catalogue');
          eclEl.appendChild(mapLink);
        }
        astroElements.push(eclEl);
      }
    }
    // Astronomy: moon phase, comets, supernovae, conjunctions
    if (typeof Astronomy !== 'undefined') {
      var moon = Astronomy.moonPhase(primaryJd);
      var phaseName = (t.moonPhases && t.moonPhases[moon.name]) || moon.name;
      var moonEl = el('div', { class: 'result-astro result-moon' },
        el('span', { class: 'astro-icon', text: moon.icon }),
        el('span', { class: 'astro-text', text: (t.moonPhaseLabel || 'Moon phase') + ': ' + phaseName }),
        el('span', { class: 'astro-detail', text: moon.age + ' ' + (t.moonAge || 'day') + ' \u2022 ' + moon.illumination + '% ' + (t.moonIllumination || 'illuminated') })
      );
      astroElements.push(moonEl);
      var comet = Astronomy.lookupComet(primaryJd);
      if (comet) {
        var cName = (t.cometNames && t.cometNames[comet.id]) || comet.id;
        var cEl = el('div', { class: 'result-astro result-comet' },
          el('span', { class: 'astro-icon', text: '\u2604\uFE0F' }),
          el('span', { class: 'astro-text', text: (t.cometLabel || 'Comet') + ': ' + cName + ' (' + comet.year + ')' })
        );
        if (comet.noteKey && t.cometNotes && t.cometNotes[comet.noteKey]) {
          cEl.appendChild(el('p', { class: 'astro-note', text: t.cometNotes[comet.noteKey] }));
        }
        astroElements.push(cEl);
      }
      var sn = Astronomy.lookupSupernova(primaryJd);
      if (sn) {
        var snMag = sn.peakMag > 0 ? '+' + sn.peakMag : String(sn.peakMag);
        var snEl = el('div', { class: 'result-astro result-supernova' },
          el('span', { class: 'astro-icon', text: '\uD83D\uDCA5' }),
          el('span', { class: 'astro-text', text: (t.supernovaLabel || 'Supernova') + ': ' + sn.id + ' (' + sn.constellation + ', mag ' + snMag + ')' })
        );
        if (sn.noteKey && t.supernovaNotes && t.supernovaNotes[sn.noteKey]) {
          snEl.appendChild(el('p', { class: 'astro-note', text: t.supernovaNotes[sn.noteKey] }));
        }
        astroElements.push(snEl);
      }
      var conj = Astronomy.lookupConjunction(primaryJd);
      if (conj) {
        var p1 = Astronomy.planetName(conj.planet1, t);
        var p2 = Astronomy.planetName(conj.planet2, t);
        var sepStr = conj.separation < 60 ? conj.separation + '\u2032' : (conj.separation / 60).toFixed(1) + '\u00b0';
        var conjEl = el('div', { class: 'result-astro result-conjunction' },
          el('span', { class: 'astro-icon', text: '\u2728' }),
          el('span', { class: 'astro-text', text: (t.conjunctionLabel || 'Conjunction') + ': ' + p1 + '\u2013' + p2 + ' (' + sepStr + ')' })
        );
        if (conj.noteKey && t.conjunctionNotes && t.conjunctionNotes[conj.noteKey]) {
          conjEl.appendChild(el('p', { class: 'astro-note', text: t.conjunctionNotes[conj.noteKey] }));
        }
        astroElements.push(conjEl);
      }
    }
    astroElements.push(buildMeta([[t.jdn, String(primaryJd)]]));

    showResult(elements, null, null, astroElements, { jd: primaryJd, srcId: src.id, tgtId: tgt.id, copyData: singleCopyData });
  }

  function convertRange(src, tgt, y1, m1, d1, y2, m2, d2, t) {
    const jdStart = src.toJD(y1, m1, d1);
    const jdEnd = src.toJD(y2, m2, d2);
    const startResult = tgt.fromJD(jdStart);
    const endResult = tgt.fromJD(jdEnd);
    const srcNames = src.monthNames(t);
    const tgtNames = genNames(tgt, t);
    const srcLabel = t.calendars[src.id];
    const tgtLabel = t.calendars[tgt.id];

    const tgtRange = fmtDateRange(tgtNames, startResult, endResult);
    const tgtStartStr = tgtRange.startStr;
    const tgtEndStr = tgtRange.endStr;

    // Build source month breakdown with target equivalents
    const monthRows = [];
    let cy = y1, cm = m1;
    while (cy < y2 || (cy === y2 && cm <= m2)) {
      const mFirstDay = (cy === y1 && cm === m1) ? d1 : 1;
      const mLastDay = (cy === y2 && cm === m2) ? d2 : src.monthLength(cy, cm);
      const mDays = mLastDay - mFirstDay + 1;
      const mStartTgt = tgt.fromJD(src.toJD(cy, cm, mFirstDay));
      const mEndTgt = tgt.fromJD(src.toJD(cy, cm, mLastDay));
      const rowRange = fmtDateRange(tgtNames, mStartTgt, mEndTgt);
      monthRows.push({
        srcName: srcNames[cm - 1] + ' ' + cy,
        days: mDays,
        startStr: rowRange.startStr,
        endStr: rowRange.endStr
      });
      cm++;
      if (cm > src.monthCount) { cm = 1; cy++; }
    }

    const table = el('table', { class: 'year-table' });
    table.appendChild(el('thead', null, el('tr', null,
      el('th', { text: shortCalName(src.id) }),
      el('th', { text: shortCalName(tgt.id) + ' (' + (t.rangeStart || 'Start') + ')' }),
      el('th', { text: shortCalName(tgt.id) + ' (' + (t.rangeEnd || 'End') + ')' }),
      el('th', { text: t.totalDays })
    )));
    const tbody = el('tbody');
    monthRows.forEach(row => {
      var srcTd = el('td', { class: 'month-name' });
      appendBoldYear(srcTd, row.srcName);
      var startTd = el('td', { class: 'date-cell' });
      appendBoldYear(startTd, row.startStr);
      var endTd = el('td', { class: 'date-cell' });
      appendBoldYear(endTd, row.endStr);
      tbody.appendChild(el('tr', null, srcTd, startTd, endTd, el('td', { text: String(row.days) })));
    });
    table.appendChild(tbody);

    const srcRange = fmtDateRange(genNames(src, t), { day: d1, month: m1, year: y1 }, { day: d2, month: m2, year: y2 });
    const srcStartStr = srcRange.startStr;
    const srcEndStr = srcRange.endStr;

    const astroResult = buildRangeAstroPanel(jdStart, jdEnd, tgt, tgtNames, t);
    const breakdown = monthRows.length > 1 ? [table] : null;

    // Build range bridge — two-column layout with year big, day+month small
    var rangeBridge = buildRangeBridge(startResult, endResult, tgtNames, tgt, t);
    var rangeYearSuf = tgt.id === 'roman' ? ' AUC' : '';
    var srcYearSuf = src.id === 'roman' ? ' AUC' : '';
    var smartTgtRange = smartDateRange(startResult, endResult, tgtNames, rangeYearSuf);
    var smartTgtYears = smartYearRange(startResult.year, endResult.year, rangeYearSuf);
    var rangeCopyEl = el('span', { class: 'result-main' });
    rangeCopyEl.textContent = smartTgtRange;
    rangeCopyEl.style.display = 'none';

    var tgtShort2 = shortCalName(tgt.id);
    var smartSrcYears = smartYearRange(y1, y2, srcYearSuf);
    var rangeCopyData = {
      kind: 'range',
      defaultText: smartTgtRange,
      yearOnlyText: smartTgtYears,
      fullBlockText: smartTgtRange + ' ' + tgtShort2,
      yearPairText: null,
      tgtCalLabel: t.calendars[tgt.id],
      srcCalLabel: t.calendars[src.id],
    };
    if (tgt.id === 'gregorian' && src.id !== 'gregorian') {
      rangeCopyData.yearPairText = smartSrcYears + '/' + smartTgtYears;
    } else if (src.id === 'gregorian' && tgt.id !== 'gregorian') {
      rangeCopyData.yearPairText = smartTgtYears + '/' + smartSrcYears;
    }

    const rangeElements = [
      rangeBridge,
      buildBridgeEq(srcNames[m1 - 1] + ' ' + smartSrcYears, src.id, smartTgtYears, tgt.id),
      el('p', { class: 'result-scope', text: t.wholeMonth || 'Whole month' }),
      el('p', { class: 'result-span' },
        el('span', { class: 'date-val', text: tgtStartStr }),
        ' \u2013 ',
        el('span', { class: 'date-val', text: tgtEndStr })
      ),
      rangeCopyEl,
    ];
    var rangeAstroElements = null;
    if (astroResult) {
      rangeAstroElements = [];
      astroResult.panel.classList.remove('hidden');
      rangeAstroElements.push(astroResult.panel);
    }
    showResult(rangeElements, breakdown, astroResult ? astroResult.highlights : null, rangeAstroElements, { jd: jdStart, jdEnd: jdEnd, srcId: src.id, tgtId: tgt.id, copyData: rangeCopyData });
  }

  function convertYearRange(src, tgt, year, t) {
    const jdStart = src.toJD(year, 1, 1);
    const jdEnd = src.toJD(year, src.monthCount, src.monthLength(year, src.monthCount));
    const startResult = tgt.fromJD(jdStart);
    const endResult = tgt.fromJD(jdEnd);
    const tgtNames = genNames(tgt, t);
    const srcNames = src.monthNames(t);
    const srcLabel = t.calendars[src.id];
    const tgtLabel = t.calendars[tgt.id];

    const tgtRange = fmtDateRange(tgtNames, startResult, endResult);
    const tgtStartStr = tgtRange.startStr;
    const tgtEndStr = tgtRange.endStr;

    const monthRows = [];
    for (let m = 1; m <= src.monthCount; m++) {
      const mLen = src.monthLength(year, m);
      const mStartTgt = tgt.fromJD(src.toJD(year, m, 1));
      const mEndTgt = tgt.fromJD(src.toJD(year, m, mLen));
      const rowRange = fmtDateRange(tgtNames, mStartTgt, mEndTgt);
      monthRows.push({
        srcName: srcNames[m - 1], days: mLen,
        startStr: rowRange.startStr,
        endStr: rowRange.endStr
      });
    }

    const table = el('table', { class: 'year-table' });
    table.appendChild(el('thead', null, el('tr', null,
      el('th', { text: shortCalName(src.id) }),
      el('th', { text: shortCalName(tgt.id) + ' (' + (t.rangeStart || 'Start') + ')' }),
      el('th', { text: shortCalName(tgt.id) + ' (' + (t.rangeEnd || 'End') + ')' }),
      el('th', { text: t.totalDays })
    )));
    const tbody = el('tbody');
    monthRows.forEach(row => {
      var srcTd = el('td', { class: 'month-name' });
      appendBoldYear(srcTd, row.srcName);
      var startTd = el('td', { class: 'date-cell' });
      appendBoldYear(startTd, row.startStr);
      var endTd = el('td', { class: 'date-cell' });
      appendBoldYear(endTd, row.endStr);
      tbody.appendChild(el('tr', null, srcTd, startTd, endTd, el('td', { text: String(row.days) })));
    });
    table.appendChild(tbody);

        const astroResult = buildRangeAstroPanel(jdStart, jdEnd, tgt, tgtNames, t);

    // Build range bridge — two-column layout with year big, day+month small
    var rangeBridge = buildRangeBridge(startResult, endResult, tgtNames, tgt, t);
    var yearYearSuf = tgt.id === 'roman' ? ' AUC' : '';
    var ySrcSuf = src.id === 'roman' ? ' AUC' : '';
    var smartYrTgtRange = smartDateRange(startResult, endResult, tgtNames, yearYearSuf);
    var smartYrTgtYears = smartYearRange(startResult.year, endResult.year, yearYearSuf);
    var yearCopyEl = el('span', { class: 'result-main' });
    yearCopyEl.textContent = smartYrTgtYears;
    yearCopyEl.style.display = 'none';

    var tgtShort3 = shortCalName(tgt.id);
    var smartYrSrcYears = String(year) + ySrcSuf;
    var yearCopyData = {
      kind: 'year-range',
      defaultText: smartYrTgtRange,
      yearOnlyText: smartYrTgtYears,
      fullBlockText: smartYrTgtRange + ' ' + tgtShort3,
      yearPairText: null,
      tgtCalLabel: t.calendars[tgt.id],
      srcCalLabel: t.calendars[src.id],
    };
    if (tgt.id === 'gregorian' && src.id !== 'gregorian') {
      yearCopyData.yearPairText = smartYrSrcYears + '/' + smartYrTgtYears;
    } else if (src.id === 'gregorian' && tgt.id !== 'gregorian') {
      yearCopyData.yearPairText = smartYrTgtYears + '/' + smartYrSrcYears;
    }

    const yearElements = [
      rangeBridge,
      buildBridgeEq(String(year) + ySrcSuf, src.id, smartYrTgtYears, tgt.id),
      el('p', { class: 'result-scope', text: t.wholeYear || 'Whole year' }),
      el('p', { class: 'result-span' },
        el('span', { class: 'date-val', text: tgtStartStr }), ' – ',
        el('span', { class: 'date-val', text: tgtEndStr })
      ),
      yearCopyEl,
    ];
    var yearAstroElements = null;
    if (astroResult) {
      yearAstroElements = [];
      astroResult.panel.classList.remove('hidden');
      yearAstroElements.push(astroResult.panel);
    }
    showResult(yearElements, [table], astroResult ? astroResult.highlights : null, yearAstroElements, { jd: jdStart, jdEnd: jdEnd, srcId: src.id, tgtId: tgt.id, copyData: yearCopyData });
  }

  // Build astro panel for a JDN range (year/month conversions).
  // Returns { panel, highlights } or null if no events found.
  function buildRangeAstroPanel(jdStart, jdEnd, tgt, tgtNames, t) {
    const panel = el('div', { class: 'astro-panel hidden' });
    const highlights = [];
    // Eclipses in range
    if (typeof Eclipses !== 'undefined') {
      for (let d = jdStart; d <= jdEnd; d++) {
        const ecl = Eclipses.lookup(d);
        if (ecl) {
          const typeStr = Eclipses.typeLabel(ecl.type, t);
          const magStr = ecl.mag ? ' (' + ecl.mag.toFixed(3) + ')' : '';
          const eclDate = tgt.fromJD(d);
          const eclDateStr = eclDate.day + ' ' + tgtNames[eclDate.month - 1] + ' ' + eclDate.year;
          const eclEl = el('div', { class: 'result-eclipse' },
            el('span', { class: 'eclipse-icon' }),
            el('span', { class: 'eclipse-type', text: (t.eclipseLabel || 'Solar eclipse') + ': ' + typeStr + magStr + ' \u2014 ' + eclDateStr })
          );
          if (ecl.notable && ecl.noteKey && t.eclipseNotes && t.eclipseNotes[ecl.noteKey]) {
            eclEl.appendChild(el('p', { class: 'eclipse-note', text: t.eclipseNotes[ecl.noteKey] }));
          }
          if (ecl.notable) {
            const mapLink = document.createElement('a');
            mapLink.className = 'eclipse-map-link';
            if (ecl.noteKey === 'ibrahim632') {
              mapLink.href = 'eklipso.html';
            } else if (ecl.noteKey) {
              const he = (ecl.year + 10000) + '' + (ecl.month < 10 ? '0' : '') + ecl.month + (ecl.day < 10 ? '0' : '') + ecl.day;
              mapLink.href = 'maps/' + he + '.html';
            } else {
              mapLink.href = 'eclipses.html';
            }
            mapLink.textContent = ecl.noteKey ? (t.eclipseViewMap || 'View eclipse map') : (t.eclipseViewCatalogue || 'Eclipse catalogue');
            eclEl.appendChild(mapLink);
          }
          panel.appendChild(eclEl);
          highlights.push('\u25D0 ' + typeStr);
        }
      }
    }
    // Comets, supernovae, conjunctions (deduplicate by origin JDN)
    if (typeof Astronomy !== 'undefined') {
      const seenComets = new Set();
      for (let d = jdStart; d <= jdEnd; d++) {
        const comet = Astronomy.lookupComet(d);
        if (comet && !seenComets.has(comet.perihelionJD)) {
          seenComets.add(comet.perihelionJD);
          const cName = (t.cometNames && t.cometNames[comet.id]) || comet.id;
          const cEl = el('div', { class: 'result-astro result-comet' },
            el('span', { class: 'astro-icon', text: '\u2604\uFE0F' }),
            el('span', { class: 'astro-text', text: (t.cometLabel || 'Comet') + ': ' + cName + ' (' + comet.year + ')' })
          );
          if (comet.noteKey && t.cometNotes && t.cometNotes[comet.noteKey]) {
            cEl.appendChild(el('p', { class: 'astro-note', text: t.cometNotes[comet.noteKey] }));
          }
          panel.appendChild(cEl);
          highlights.push('\u2604 ' + cName);
        }
      }
      const seenSN = new Set();
      for (let d = jdStart; d <= jdEnd; d++) {
        const sn = Astronomy.lookupSupernova(d);
        if (sn && !seenSN.has(sn.id)) {
          seenSN.add(sn.id);
          const magStr = sn.peakMag !== undefined ? String(sn.peakMag) : '?';
          const snEl = el('div', { class: 'result-astro result-supernova' },
            el('span', { class: 'astro-icon', text: '\u{1F4A5}' }),
            el('span', { class: 'astro-text', text: (t.supernovaLabel || 'Supernova') + ': ' + sn.id + ' (' + sn.constellation + ', mag ' + magStr + ')' })
          );
          if (sn.noteKey && t.supernovaNotes && t.supernovaNotes[sn.noteKey]) {
            snEl.appendChild(el('p', { class: 'astro-note', text: t.supernovaNotes[sn.noteKey] }));
          }
          panel.appendChild(snEl);
          highlights.push('\u2726 ' + sn.id);
        }
      }
      const seenConj = new Set();
      for (let d = jdStart; d <= jdEnd; d++) {
        const conj = Astronomy.lookupConjunction(d);
        if (conj && !seenConj.has(conj.closestJD)) {
          seenConj.add(conj.closestJD);
          const p1 = Astronomy.planetName(conj.planet1, t);
          const p2 = Astronomy.planetName(conj.planet2, t);
          const sepStr = conj.separation < 60 ? conj.separation + '\u2032' : (conj.separation / 60).toFixed(1) + '\u00b0';
          const conjEl = el('div', { class: 'result-astro result-conjunction' },
            el('span', { class: 'astro-icon', text: '\u2728' }),
            el('span', { class: 'astro-text', text: (t.conjunctionLabel || 'Conjunction') + ': ' + p1 + '\u2013' + p2 + ' (' + sepStr + ')' })
          );
          if (conj.noteKey && t.conjunctionNotes && t.conjunctionNotes[conj.noteKey]) {
            conjEl.appendChild(el('p', { class: 'astro-note', text: t.conjunctionNotes[conj.noteKey] }));
          }
          panel.appendChild(conjEl);
          highlights.push('\u2728 ' + p1 + '\u2013' + p2);
        }
      }
    }
    panel.appendChild(buildMeta([[t.jdn, jdStart + ' \u2013 ' + jdEnd]]));
    return { panel: panel, highlights: highlights };
  }

  // ---- Helpers ----

  // Format "day month [year]" — omit year from start when both years match
  function buildRangeBridge(startResult, endResult, tgtNames, tgt, t) {
    var tgtCalName = t.calendars[tgt.id] || tgt.id;

    var startYear = tgt.id === 'roman' ? (startResult.year + '\u00a0AUC') : String(startResult.year);
    var endYear = tgt.id === 'roman' ? (endResult.year + '\u00a0AUC') : String(endResult.year);
    var startDetail = startResult.day + '\u00a0' + (tgtNames[startResult.month - 1] || '');
    var endDetail = endResult.day + '\u00a0' + (tgtNames[endResult.month - 1] || '');

    var bridge = el('div', { class: 'range-bridge' });

    // Start column
    var startCol = el('div', { class: 'range-col range-col-start' });
    startCol.appendChild(el('span', { class: 'range-year', text: startYear }));
    startCol.appendChild(el('span', { class: 'range-detail', text: startDetail }));
    bridge.appendChild(startCol);

    // Arrow
    bridge.appendChild(el('span', { class: 'range-arrow', text: '\u2192' }));

    // End column
    var endCol = el('div', { class: 'range-col range-col-end' });
    endCol.appendChild(el('span', { class: 'range-year', text: endYear }));
    endCol.appendChild(el('span', { class: 'range-detail', text: endDetail }));
    bridge.appendChild(endCol);

    return bridge;
  }

  // "1445 AH = 2023–2024 AD" line under a range bridge
  function buildBridgeEq(srcPart, srcId, tgtPart, tgtId) {
    var st = calTag(srcId), tt = calTag(tgtId);
    return el('p', { class: 'bridge-eq', text:
      srcPart + (st ? ' ' + st : '') + ' = ' + tgtPart + (tt ? ' ' + tt : '') });
  }

  function fmtDateRange(names, s, e) {
    const startStr = s.day + ' ' + names[s.month - 1] + (s.year === e.year ? '' : ' ' + s.year);
    const endStr = e.day + ' ' + names[e.month - 1] + ' ' + e.year;
    return { startStr, endStr };
  }

  function buildMeta(pairs) {
    const dl = el('dl', { class: 'result-meta' });
    pairs.forEach(([label, value]) => {
      dl.appendChild(el('div', null, el('dt', { text: label }), el('dd', { text: value })));
    });
    return dl;
  }

  // Build a <dd> that allows line-break before ' – ' via <wbr>, invisible when copied
  function appendBoldYear(parent, part) {
    var m = part.match(/^(.*?)(\d+)(\s*AUC)?$/);
    if (!m) { parent.appendChild(document.createTextNode(part)); return; }
    if (m[1]) parent.appendChild(document.createTextNode(m[1]));
    var strong = document.createElement('strong');
    strong.textContent = m[2];
    parent.appendChild(strong);
    if (m[3]) parent.appendChild(document.createTextNode(m[3]));
  }

  function dateDd(dateStr) {
    var dd = document.createElement('dd');
    var dashIdx = dateStr.indexOf(' \u2013 ');
    if (dashIdx >= 0) {
      appendBoldYear(dd, dateStr.slice(0, dashIdx));
      dd.appendChild(document.createElement('wbr'));
      dd.appendChild(document.createTextNode(' \u2013 '));
      appendBoldYear(dd, dateStr.slice(dashIdx + 3));
    } else {
      appendBoldYear(dd, dateStr);
    }
    return dd;
  }

  function buildContextualPanel(jd, srcId, tgtId, t, jdEnd) {
    const isRange = jdEnd !== undefined;
    const matches = [];
    for (const id of CONTEXTUAL_PRIORITY) {
      if (id === srcId || id === tgtId) continue;
      const cal = CALENDARS[id];
      if (!cal || !cal.historicalRange) continue;
      const [lo, hi] = cal.historicalRange;
      if (jd < lo || jd > hi) continue;
      const result = cal.fromJD(jd);
      const names = genNames(cal, t);
      // Skip calendars whose month has no name (Yazdgerdi's 13th month, TASK-14)
      if (result.month > names.length || (isRange && cal.fromJD(jdEnd).month > names.length)) continue;
      let yearStr, datesStr;
      if (isRange) {
        const endResult = cal.fromJD(jdEnd);
        yearStr = (result.year === endResult.year)
          ? String(result.year)
          : result.year + '\u2013' + endResult.year;
        datesStr = result.day + ' ' + names[result.month - 1]
          + ' \u2013 ' + endResult.day + ' ' + names[endResult.month - 1];
      } else if (id === 'roman' && result.day) {
        yearStr = result.year + ' AUC';
        datesStr = Cal.romanDayNotation(result.month, result.day, cal.isLeap(result.year));
      } else {
        yearStr = String(result.year);
        datesStr = result.day + ' ' + names[result.month - 1];
      }
      matches.push([id, t.calendars[id], yearStr, datesStr]);
    }
    if (matches.length === 0) return null;
    const dl = el('dl', { class: 'contextual-list' });
    matches.forEach(([calId, label, yearStr, datesStr]) => {
      var row = el('div');
      var dt = el('dt');
      var link = document.createElement('a');
      link.className = 'contextual-cal-link';
      link.href = 'calendars.html#' + calId;
      link.textContent = label;
      dt.appendChild(link);
      row.appendChild(dt);
      var yearDd = el('dd', { class: 'contextual-year' });
      var strong = document.createElement('strong');
      strong.textContent = yearStr;
      yearDd.appendChild(strong);
      row.appendChild(yearDd);
      row.appendChild(el('dd', { class: 'contextual-dates', text: datesStr }));
      dl.appendChild(row);
    });
    return dl;
  }

  // Build panel for calendars NOT in use for the given era
  function buildOutOfEraPanel(jd, srcId, tgtId, t, jdEnd) {
    const isRange = jdEnd !== undefined;
    const matches = [];
    for (const id of CONTEXTUAL_PRIORITY) {
      if (id === srcId || id === tgtId) continue;
      const cal = CALENDARS[id];
      if (!cal || !cal.historicalRange) continue;
      const [lo, hi] = cal.historicalRange;
      // Only include if OUT of range
      if (jd >= lo && jd <= hi) continue;
      const result = cal.fromJD(jd);
      const names = genNames(cal, t);
      // Skip calendars whose month has no name (Yazdgerdi's 13th month, TASK-14)
      if (result.month > names.length || (isRange && cal.fromJD(jdEnd).month > names.length)) continue;
      let yearStr, datesStr;
      if (isRange) {
        const endResult = cal.fromJD(jdEnd);
        yearStr = (result.year === endResult.year)
          ? String(result.year)
          : result.year + '\u2013' + endResult.year;
        datesStr = result.day + ' ' + names[result.month - 1]
          + ' \u2013 ' + endResult.day + ' ' + names[endResult.month - 1];
      } else if (id === 'roman' && result.day) {
        yearStr = result.year + ' AUC';
        datesStr = Cal.romanDayNotation(result.month, result.day, cal.isLeap(result.year));
      } else {
        yearStr = String(result.year);
        datesStr = result.day + ' ' + names[result.month - 1];
      }
      matches.push([id, t.calendars[id], yearStr, datesStr]);
    }
    if (matches.length === 0) return null;
    const dl = el('dl', { class: 'contextual-list' });
    matches.forEach(([calId, label, yearStr, datesStr]) => {
      var row = el('div');
      var dt = el('dt');
      var link = document.createElement('a');
      link.className = 'contextual-cal-link';
      link.href = 'calendars.html#' + calId;
      link.textContent = label;
      dt.appendChild(link);
      row.appendChild(dt);
      var yearDd = el('dd', { class: 'contextual-year' });
      var strong = document.createElement('strong');
      strong.textContent = yearStr;
      yearDd.appendChild(strong);
      row.appendChild(yearDd);
      row.appendChild(el('dd', { class: 'contextual-dates', text: datesStr }));
      dl.appendChild(row);
    });
    return dl;
  }

  // Smart date-range formatter: collapses common parts, manages hyphen spacing.
  // s, e: { day, month, year }; names: month-name array (1-indexed via i-1); yearSuf: '' or ' AUC'
  function smartDateRange(s, e, names, yearSuf) {
    yearSuf = yearSuf || '';
    var sMonthName = names && names[s.month - 1] ? names[s.month - 1] : '';
    var eMonthName = names && names[e.month - 1] ? names[e.month - 1] : '';
    var sYr = s.year + yearSuf;
    var eYr = e.year + yearSuf;
    // Single day
    if (s.year === e.year && s.month === e.month && s.day === e.day) {
      return s.day + ' ' + sMonthName + ' ' + sYr;
    }
    // Same month + year — numeric day range, no spaces around hyphen
    if (s.year === e.year && s.month === e.month) {
      return s.day + '–' + e.day + ' ' + sMonthName + ' ' + sYr;
    }
    // Same year, different month — spaces around en-dash
    if (s.year === e.year) {
      return s.day + ' ' + sMonthName + ' – ' + e.day + ' ' + eMonthName + ' ' + sYr;
    }
    // Different year — full both sides, spaces around en-dash
    return s.day + ' ' + sMonthName + ' ' + sYr + ' – ' + e.day + ' ' + eMonthName + ' ' + eYr;
  }

  // Year-only range, no spaces (e.g. "888-890" or "888")
  function smartYearRange(yStart, yEnd, yearSuf) {
    yearSuf = yearSuf || '';
    if (yStart === yEnd) return yStart + yearSuf;
    return yStart + '–' + yEnd + yearSuf;
  }

  // Row of copy buttons under the result, one per format. data shape:
  //   { defaultText, yearOnlyText, yearPairText (or null), ... }
  // Formats that would repeat an earlier one are skipped.
  // Kopiowanie do schowka z zapasową metodą: Clipboard API wymaga HTTPS i zgody przeglądarki,
  // a bez obsługi błędu przycisk po cichu nie działa. Zwraca Promise (odrzucony, gdy się nie uda).
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function() { return legacyCopy(text); });
    }
    return legacyCopy(text);
  }

  function legacyCopy(text) {
    return new Promise(function(resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      ta.remove();
      if (ok) resolve(); else reject(new Error('copy failed'));
    });
  }

  function buildCopyTrio(data, t) {
    var row = el('div', { class: 'copy-trio' });
    var seen = {};
    [data.defaultText, data.yearOnlyText, data.yearPairText].forEach(function(text) {
      if (!text || seen[text]) return;
      seen[text] = true;
      var btn = el('button', { type: 'button', class: 'copy-trio-btn' });
      btn.appendChild(el('span', { class: 'copy-trio-icon', text: '\u29C9' }));
      var label = el('span', { class: 'copy-trio-text', text: text });
      btn.appendChild(label);
      btn.addEventListener('click', function() {
        copyText(text).then(function() {
          label.textContent = t.copied || 'Copied!';
          btn.classList.add('copied');
          setTimeout(function() {
            label.textContent = text;
            btn.classList.remove('copied');
          }, 1200);
        }, function() { window.prompt('', text); });
      });
      row.appendChild(btn);
    });

    // Link do tego zapytania (adres strony jest aktualizowany po każdej konwersji, patrz syncUrl)
    var linkLabel = t.copyLink || 'Link';
    var linkBtn = el('button', { type: 'button', class: 'copy-trio-btn copy-trio-link' });
    linkBtn.appendChild(el('span', { class: 'copy-trio-icon', text: '↗' }));
    var linkText = el('span', { class: 'copy-trio-text', text: linkLabel });
    linkBtn.appendChild(linkText);
    linkBtn.addEventListener('click', function() {
      var done = function() {
        linkText.textContent = t.copied || 'Copied!';
        linkBtn.classList.add('copied');
        setTimeout(function() {
          linkText.textContent = linkLabel;
          linkBtn.classList.remove('copied');
        }, 1200);
      };
      // Gdy nie da się skopiować (ani API, ani zapasowo): pokaż adres do skopiowania ręcznie
      copyText(location.href).then(done, function() { window.prompt('', location.href); });
    });
    row.appendChild(linkBtn);
    return row;
  }

  function showResult(elements, breakdownElements, rangeHighlights, astroElements, contextInfo) {
    while (resultBody.firstChild) resultBody.removeChild(resultBody.firstChild);
    elements.forEach(node => { if (node) resultBody.appendChild(node); });
    const t = I18N[currentLang] || I18N.en;
    if (contextInfo && contextInfo.copyData) {
      resultBody.appendChild(buildCopyTrio(contextInfo.copyData, t));
    } else {
      const copyBtn = el('button', { class: 'copy-btn', text: t.copyResult });
      copyBtn.type = 'button';
      copyBtn.addEventListener('click', function () {
        const mainEl = resultBody.querySelector('.result-main');
        const text = mainEl ? mainEl.textContent.trim() : resultBody.innerText.trim();
        copyText(text).then(function () {
          copyBtn.textContent = t.copied;
          setTimeout(function () { copyBtn.textContent = t.copyResult; }, 1500);
        }, function() { window.prompt('', text); });
      });
      resultBody.appendChild(copyBtn);
    }

    // Legacy: handle inline astro-panel for range conversions
    const astroPanelEl = resultBody.querySelector('.astro-panel');
    if (astroPanelEl) {
      const astroBtnIcon = el('span', { class: 'astro-btn-icon', text: '\u263D' });
      const astroBtnText = document.createTextNode(' ' + (t.astroLabel || 'Astro'));
      const astroBtn = el('button', { class: 'astro-btn' });
      astroBtn.type = 'button';
      astroBtn.appendChild(astroBtnIcon);
      astroBtn.appendChild(astroBtnText);
      astroBtn.addEventListener('click', function () {
        astroPanelEl.classList.toggle('hidden');
        astroBtn.classList.toggle('active');
      });
      if (rangeHighlights && rangeHighlights.length > 0) {
        const pillWrap = el('div', { class: 'astro-pill' });
        pillWrap.appendChild(astroBtn);
        const summaryEl = el('span', { class: 'astro-pill-summary', text: rangeHighlights.join(' \u00b7 ') });
        summaryEl.addEventListener('click', function () {
          astroPanelEl.classList.toggle('hidden');
          astroBtn.classList.toggle('active');
        });
        pillWrap.appendChild(summaryEl);
        astroPanelEl.parentNode.insertBefore(pillWrap, astroPanelEl);
      } else {
        astroPanelEl.parentNode.insertBefore(astroBtn, astroPanelEl);
      }
    }

    resultPanel.hidden = false;
    resultPanel.classList.add('has-result');

    // Pola „To" oraz Miesiąc/Dzień są widoczne od początku (index.html); tu tylko
    // dopilnuj, by „To" nie było puste (pusta wartość oznacza domyślne AD).
    if (!toCalInput.value.trim()) {
      var tgtCal = resolveCalendar(toCalInput.value) || CALENDARS.gregorian;
      toCalInput.value = t.calendars[tgtCal.id] || '';
    }
    updateCalDescLink(toCalInput, 'to-cal-desc');
    updateCalDescLink(fromCalInput, 'from-cal-desc');

    // Contextual calendars tile (expanded, with tile toggle header)
    while (contextualCard.firstChild) contextualCard.removeChild(contextualCard.firstChild);
    if (contextInfo) {
      var ctxPanel = buildContextualPanel(contextInfo.jd, contextInfo.srcId, contextInfo.tgtId, t, contextInfo.jdEnd);
      if (ctxPanel) {
        var ctxToggle = el('button', { type: 'button', class: 'tile-toggle', text: t.contextualLabel || 'Other contemporaneous calendars' });
        var ctxContent = el('div', { class: 'tile-content hidden' });
        ctxContent.appendChild(ctxPanel);
        ctxToggle.addEventListener('click', function() {
          ctxContent.classList.toggle('hidden');
          ctxToggle.classList.toggle('active');
        });
        contextualCard.appendChild(ctxToggle);
        contextualCard.appendChild(ctxContent);
        contextualCard.hidden = false;
      } else {
        contextualCard.hidden = true;
      }

    } else {
      contextualCard.hidden = true;
    }

    // Astro card (collapsible tile — auto-expand if meaningful content beyond JDN)
    while (astroCard.firstChild) astroCard.removeChild(astroCard.firstChild);
    if (astroElements && astroElements.length > 0) {
      // Check if there's meaningful content (eclipses, comets, supernovae, conjunctions)
      var hasMeaningful = astroElements.some(function(node) {
        if (!node || !node.classList) return false;
        return node.classList.contains('result-eclipse') ||
               node.classList.contains('result-comet') ||
               node.classList.contains('result-supernova') ||
               node.classList.contains('result-conjunction') ||
               node.classList.contains('result-astro');
      });
      // Build summary hints for the header
      var astroHints = [];
      astroElements.forEach(function(node) {
        if (!node || !node.classList) return;
        if (node.classList.contains('result-eclipse')) astroHints.push('\u25D0');
        if (node.classList.contains('result-comet')) astroHints.push('\u2604');
        if (node.classList.contains('result-supernova')) astroHints.push('\u2726');
        if (node.classList.contains('result-conjunction')) astroHints.push('\u2728');
      });
      var astroTitle = t.astroLabel || 'Astro';
      var startExpanded = false;
      var astroHeader = el('button', { type: 'button', class: 'tile-toggle astro-toggle' + (startExpanded ? ' active' : '') });
      astroHeader.appendChild(el('span', { class: 'astro-title-text', text: astroTitle }));
      if (astroHints.length > 0) {
        astroHeader.appendChild(el('span', { class: 'astro-hints', text: astroHints.join(' ') }));
      }
      var astroContent = el('div', { class: 'tile-content astro-content' + (startExpanded ? '' : ' hidden') });
      astroElements.forEach(node => { if (node) astroContent.appendChild(node); });
      astroHeader.addEventListener('click', function() {
        astroContent.classList.toggle('hidden');
        astroHeader.classList.toggle('active');
      });
      astroCard.appendChild(astroHeader);
      astroCard.appendChild(astroContent);
      astroCard.hidden = false;
    } else {
      astroCard.hidden = true;
    }

    // Breakdown panel (collapsible)
    while (breakdownPanel.firstChild) breakdownPanel.removeChild(breakdownPanel.firstChild);
    if (breakdownElements && breakdownElements.length > 0) {
      var bdHeader = el('button', { type: 'button', class: 'tile-toggle', text: t.monthBreakdown || 'Month breakdown' });
      var bdContent = el('div', { class: 'tile-content hidden' });
      breakdownElements.forEach(node => { if (node) bdContent.appendChild(node); });
      bdHeader.addEventListener('click', function () {
        bdContent.classList.toggle('hidden');
        bdHeader.classList.toggle('active');
      });
      breakdownPanel.appendChild(bdHeader);
      breakdownPanel.appendChild(bdContent);
      breakdownPanel.hidden = false;
    } else {
      breakdownPanel.hidden = true;
    }
    refreshTabs();
  }

  // ---- Tabs (desktop) ----
  // Contextual calendars, astro, month breakdown and history share one tabbed
  // box from 601px up. The tiles stay separate nodes; CSS shows only the one
  // marked .tab-active and hides its own toggle. Below 601px the tab bar is
  // hidden and the tiles behave as collapsible cards, as before.

  const tileTabs = $('#tile-tabs');
  const tabActionRow = $('#action-row');
  let activeTab = null;

  function refreshTabs() {
    if (!tileTabs) return;
    const t = I18N[currentLang] || I18N.en;
    const defs = [
      { key: 'ctx',   node: contextualCard, label: t.contextualLabel || 'Other contemporaneous calendars' },
      { key: 'astro', node: astroCard,      label: t.astroLabel || 'Astro' },
      { key: 'bd',    node: breakdownPanel, label: t.monthBreakdown || 'Month breakdown' },
      { key: 'hist',  node: historyPanel,   label: t.history || 'History' },
    ].filter(function(d) { return d.node && !d.node.hidden; });

    if (!defs.some(function(d) { return d.key === activeTab; })) {
      activeTab = defs.length ? defs[0].key : null;
    }

    // Fokus w pasku zakładek przeżywa przebudowę: po strzałce odtwarzamy go na nowej aktywnej zakładce.
    const hadFocus = tileTabs.contains(document.activeElement);
    while (tileTabs.firstChild) tileTabs.removeChild(tileTabs.firstChild);
    tileTabs.hidden = defs.length === 0;
    tileTabs.setAttribute('aria-label', t.resultTabsLabel || 'Result details');
    defs.forEach(function(d, i) {
      const isActive = d.key === activeTab;
      const btn = el('button', {
        type: 'button',
        id: 'tab-' + d.key,
        class: 'tile-tab' + (isActive ? ' active' : ''),
        role: 'tab',
        'aria-selected': isActive ? 'true' : 'false',
        'aria-controls': d.node.id || '',
        // Roving tabindex: Tab wchodzi do paska raz (na aktywną zakładkę), strzałki zmieniają zakładkę
        tabindex: isActive ? '0' : '-1',
        text: d.label
      });
      btn.addEventListener('click', function() {
        activeTab = d.key;
        refreshTabs();
      });
      btn.addEventListener('keydown', function(e) {
        let to = -1;
        if (e.key === 'ArrowRight') to = (i + 1) % defs.length;
        else if (e.key === 'ArrowLeft') to = (i - 1 + defs.length) % defs.length;
        else if (e.key === 'Home') to = 0;
        else if (e.key === 'End') to = defs.length - 1;
        if (to < 0) return;
        e.preventDefault();
        activeTab = defs[to].key;
        refreshTabs();
        const next = document.getElementById('tab-' + activeTab);
        if (next) next.focus();
      });
      tileTabs.appendChild(btn);
      d.node.setAttribute('role', 'tabpanel');
      d.node.setAttribute('aria-labelledby', 'tab-' + d.key);
    });
    if (hadFocus) {
      const cur = document.getElementById('tab-' + activeTab);
      if (cur) cur.focus();
    }

    [contextualCard, astroCard, breakdownPanel, historyPanel].forEach(function(node) {
      if (node) node.classList.remove('tab-active');
    });
    const active = defs.filter(function(d) { return d.key === activeTab; })[0];
    if (active) active.node.classList.add('tab-active');
    if (tabActionRow) {
      tabActionRow.classList.toggle('tab-off', !(active && tabActionRow.contains(active.node)));
    }
  }

  // ---- History ----

  const HISTORY_KEY = 'kalkal-history';
  const HISTORY_MAX = 20;
  const historyList = $('#history-list');
  const historyPanel = $('#history-panel');
  const historyEmptyInstruction = $('#history-empty-instruction');
  const mobileTitleBox = $('#mobile-title-box');
  const historyToggle = $('#history-toggle');
  const historyContent = $('#history-content');
  const historyClearBtn = $('#history-clear-btn');

  if (historyToggle) {
    historyToggle.addEventListener('click', function() {
      historyContent.classList.toggle('hidden');
      historyToggle.classList.toggle('active');
    });
  }

  if (historyClearBtn) {
    historyClearBtn.addEventListener('click', function() {
      const t = I18N[currentLang];
      const msg = t.clearHistoryConfirm || 'Clear conversion history?';
      if (!confirm(msg)) return;
      kkStore.remove(HISTORY_KEY);
      renderHistory();
    });
  }

  function getHistory() {
    try { return JSON.parse(kkStore.get(HISTORY_KEY)) || []; }
    catch { return []; }
  }

  function saveHistory(entry) {
    const hist = getHistory();
    // Deduplicate: remove if same params already exist
    const dominated = hist.findIndex(h =>
      h.fromCal === entry.fromCal && h.toCal === entry.toCal &&
      h.year === entry.year && h.month === entry.month && h.day === entry.day
    );
    if (dominated >= 0) hist.splice(dominated, 1);
    hist.unshift(entry);
    if (hist.length > HISTORY_MAX) hist.length = HISTORY_MAX;
    kkStore.set(HISTORY_KEY, JSON.stringify(hist));
    renderHistory();
  }

  function shortCalName(id) {
    const SHORT = {
      hijri: 'AH', julian: 'Jul.', gregorian: 'AD', coptic: 'Copt.',
      ethiopian: 'Eth.', yazdgerdi: 'Zoro.', armenian: 'Arm.',
      solarHijri: 'SH', byzantine: 'Byz.', alexandrian: 'Alex.',
      seleucid: 'Sel.', syriac: 'Syr.', rumi: 'R\u016bm\u012b',
      egyptian: 'Egypt.', spanish: 'Span.',
      roman: 'Rom.', olympiad: 'Ol.', macedonian: 'Mac.',
      ilkhani: 'Ilkh.', antiochene: 'Ant.', hebrew: 'AM', babylonian: 'Bab.',
      bp: 'BP', human: 'HE'
    };
    return SHORT[id] || id;
  }

  // Tag shown next to a date in the result card. Roman dates already carry
  // an "AUC" suffix, so they get no extra tag.
  function calTag(id) {
    return id === 'roman' ? '' : shortCalName(id);
  }

  function fmtDate(cal, t, y, m, d, omitYear) {
    if (!m) return String(y);
    const names = genNames(cal, t);
    const mName = names[m - 1] || String(m);
    // Abbreviate month to 3 chars if > 5 chars
    const shortM = mName.length > 5 ? mName.slice(0, 3) + '.' : mName;
    if (omitYear) return d ? (d + ' ' + shortM) : shortM;
    return d ? (d + ' ' + shortM + ' ' + y) : (shortM + ' ' + y);
  }

  function buildHistorySummary(entry) {
    const t = I18N[currentLang];
    const src = CALENDARS[entry.fromCal];
    const tgt = CALENDARS[entry.toCal];
    if (!src || !tgt) return entry.fromCal + ' \u2192 ' + entry.toCal;

    const srcShort = shortCalName(entry.fromCal);
    const tgtShort = shortCalName(entry.toCal);

    // Source date string
    let srcStr = fmtDate(src, t, entry.year, entry.month, entry.day);

    // Compute result
    let resStr;
    if (entry.day && entry.month) {
      const r = tgt.fromJD(src.toJD(entry.year, entry.month, entry.day));
      resStr = fmtDate(tgt, t, r.year, r.month, r.day);
    } else if (entry.month) {
      const r1 = tgt.fromJD(src.toJD(entry.year, entry.month, 1));
      const last = src.monthLength(entry.year, entry.month);
      const r2 = tgt.fromJD(src.toJD(entry.year, entry.month, last));
      resStr = fmtDate(tgt, t, r1.year, r1.month, r1.day, r1.year === r2.year) + ' \u2013 ' + fmtDate(tgt, t, r2.year, r2.month, r2.day);
    } else {
      const r1 = tgt.fromJD(src.toJD(entry.year, 1, 1));
      const lastM = src.monthCount;
      const r2 = tgt.fromJD(src.toJD(entry.year, lastM, src.monthLength(entry.year, lastM)));
      resStr = r1.year === r2.year ? String(r1.year) : r1.year + '\u2013' + r2.year;
    }

    return { src: srcStr + ' ' + srcShort, res: resStr + ' ' + tgtShort };
  }

  function renderHistory() {
    const hist = getHistory();
    const t = I18N[currentLang];
    while (historyList.firstChild) historyList.removeChild(historyList.firstChild);

    if (hist.length === 0) {
      historyPanel.classList.remove('has-items');
      historyPanel.hidden = true;
      if (historyEmptyInstruction) historyEmptyInstruction.hidden = false;
      if (mobileTitleBox) mobileTitleBox.hidden = false;
      if (historyClearBtn) historyClearBtn.hidden = true;
      refreshTabs();
      return;
    }

    historyPanel.hidden = false;
    if (historyEmptyInstruction) historyEmptyInstruction.hidden = true;
    if (mobileTitleBox) mobileTitleBox.hidden = true;
    historyPanel.classList.add('has-items', 'expanded');
    const conversionVisible = resultPanel && resultPanel.classList.contains('has-result');
    if (conversionVisible) {
      historyContent.classList.add('hidden');
      historyToggle.classList.remove('active');
    } else {
      historyContent.classList.remove('hidden');
      historyToggle.classList.add('active');
    }
    if (historyClearBtn) {
      historyClearBtn.hidden = false;
      historyClearBtn.textContent = t.clearHistory || 'Clear';
    }
    hist.forEach((entry, i) => {
      const summary = buildHistorySummary(entry);
      const li = el('li', { class: 'history-item' });
      const btn = el('button', { class: 'history-entry' },
        el('span', { class: 'history-src', text: typeof summary === 'string' ? summary : summary.src }),
        typeof summary === 'object' ? el('span', { class: 'history-res', text: summary.res }) : null
      );
      btn.addEventListener('click', () => loadHistoryEntry(entry));
      li.appendChild(btn);
      historyList.appendChild(li);
    });
    refreshTabs();
  }

  // ⇄ : kalendarz docelowy staje się źródłowym i odwrotnie. Przy świeżym wyniku jego data trafia do pól
  // Rok/Miesiąc/Dzień i konwersja liczy się od razu (przeliczenie „w tył"); bez wyniku zamieniają się tylko
  // kalendarze, a data zostaje do uzupełnienia.
  function swapCalendars() {
    const srcCal = resolveCalendar(fromCalInput.value);
    const tgtCal = resolveCalendar(toCalInput.value);
    if (!srcCal || !tgtCal) return;
    const t = I18N[currentLang];
    const panel = $('#result-panel');
    const carry = !!lastResult && lastResult.tgtId === tgtCal.id && !!panel && !panel.hidden;
    fromCalInput.value = t.calendars[tgtCal.id] || fromCalInput.value;
    toCalInput.value = t.calendars[srcCal.id] || toCalInput.value;
    onCalendarChange(fromCalInput);
    updateVariantBar(toVariantsBar, toCalInput);
    updateCalDescLink(toCalInput, 'to-cal-desc');
    if (carry) {
      $('#from-year').value = lastResult.year;
      setMonthByNumber(lastResult.month || null);
      $('#from-day').value = lastResult.day || '';
      convert();
    } else {
      $('#from-year').value = '';
      setMonthByNumber(null);
      $('#from-day').value = '';
      $('#from-year').focus();
    }
  }

  $('#swap-cal').addEventListener('click', swapCalendars);

  function loadHistoryEntry(entry) {
    const t = I18N[currentLang];
    // Set calendar inputs
    fromCalInput.value = t.calendars[entry.fromCal] || entry.fromCal;
    toCalInput.value = entry.toCal !== 'human' ? (t.calendars[entry.toCal] || entry.toCal) : '';
    onCalendarChange(fromCalInput);

    // Set date fields
    $('#from-year').value = entry.year;
    setMonthByNumber(entry.month || null);
    $('#from-day').value = entry.day || '';

    convert();
  }

  function recordConversion() {
    const srcCal = resolveCalendar(fromCalInput.value);
    const tgtCal = resolveCalendar(toCalInput.value);
    if (!srcCal || !tgtCal) return;

    const entry = {
      fromCal: srcCal.id,
      toCal: tgtCal.id,
      year: parseInt($('#from-year').value, 10) || null,
      month: getMonthValue(),
      day: parseInt($('#from-day').value, 10) || null,
      ts: Date.now()
    };
    if (entry.year) {
      saveHistory(entry);
    }
  }

  // ---- Events ----

  if (langSwitcher) {
    langSwitcher.addEventListener('click', e => {
      const btn = e.target.closest('.lang-btn');
      if (!btn) return;
      setLang(btn.dataset.lang);
      renderHistory();
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    convert();
  });

  // Select all on focus for numeric inputs
  $('#from-year').addEventListener('focus', function() { this.select(); });
  $('#from-day').addEventListener('focus', function() { this.select(); });

  // Zmiana roku NIE czyści już miesiąca i dnia: pola są widoczne od początku, więc
  // poprawienie roku nie może po cichu kasować reszty daty. Dzień nieważny w nowym
  // roku (np. 30 w miesiącu 29-dniowym) zgłasza walidacja w convert().
  $('#from-year').addEventListener('input', clearError);

  // Setup custom month dropdown
  setupMonthDropdown(fromMonthSelect);
  $('#from-day').addEventListener('change', () => {
    if (resultPanel.classList.contains('has-result')) convert();
  });

  // Clear errors on any input change
  form.addEventListener('input', () => clearError());

  // ---- Klikalny przykład w intro ----
  // „1 Muḥarram 1445 AH → AD": wypełnia wszystkie pola i przelicza, żeby nowy
  // użytkownik zobaczył wynik jednym kliknięciem (zamiast czytać kroki).
  function renderIntroExample() {
    const btn = $('#intro-example');
    if (!btn || !CALENDARS.hijri) return;
    const t = I18N[currentLang];
    btn.textContent = '1 ' + CALENDARS.hijri.monthNames(t)[0] + ' 1445 ' +
      shortCalName('hijri') + ' → ' + shortCalName('gregorian');
  }

  const introExampleBtn = $('#intro-example');
  if (introExampleBtn) {
    introExampleBtn.addEventListener('click', () => {
      const t = I18N[currentLang];
      fromCalInput.value = t.calendars.hijri;
      toCalInput.value = t.calendars.gregorian;
      onCalendarChange(fromCalInput);
      updateVariantBar(toVariantsBar, toCalInput);
      $('#from-year').value = '1445';
      setMonthByNumber(1);
      $('#from-day').value = '1';
      convert();
    });
  }

  // ---- Settings panel (mobile) ----
  (function() {
    const btn = $('#nav-settings-btn');
    const panel = $('#settings-panel');
    const backdrop = $('#settings-backdrop');
    if (!btn || !panel) return;

    // Calendars with variants in settings
    const SETTINGS_CALENDARS = ['hijri', 'byzantine', 'seleucid', 'yazdgerdi'];

    function openSettings() {
      panel.classList.add('open');
      backdrop.classList.add('open');
      // Sync active language
      panel.querySelectorAll('.settings-lang-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.lang === currentLang);
      });
      // Sync active variant for each calendar group
      SETTINGS_CALENDARS.forEach(calId => {
        const cal = CALENDARS[calId];
        if (!cal) return;
        panel.querySelectorAll(`.settings-variant-btn[data-cal="${calId}"]`).forEach(b => {
          b.classList.toggle('active', b.dataset.variant === cal._variant);
        });
      });
    }

    function closeSettings() {
      panel.classList.remove('open');
      backdrop.classList.remove('open');
    }

    btn.addEventListener('click', openSettings);
    backdrop.addEventListener('click', closeSettings);
    panel.querySelector('.settings-close')?.addEventListener('click', closeSettings);

    panel.querySelectorAll('.settings-lang-btn').forEach(b => {
      b.addEventListener('click', () => {
        setLang(b.dataset.lang);
        panel.querySelectorAll('.settings-lang-btn').forEach(x => x.classList.toggle('active', x.dataset.lang === b.dataset.lang));
      });
    });

    panel.querySelectorAll('.settings-variant-btn').forEach(b => {
      b.addEventListener('click', () => {
        const v = b.dataset.variant;
        const calId = b.dataset.cal;
        const cal = CALENDARS[calId];
        if (!cal) return;
        cal._variant = v;
        cal.defaultVariant = v;
        kkStore.set(`kalkal-${calId}-variant`, v);
        panel.querySelectorAll(`.settings-variant-btn[data-cal="${calId}"]`).forEach(x => x.classList.toggle('active', x.dataset.variant === v));
        if (resultPanel.classList.contains('has-result')) convert();
      });
    });
  })();

  // ---- Init ----

  setupAutocomplete(fromCalInput);
  setupAutocomplete(toCalInput);

  [fromCalInput, toCalInput].forEach(input => {
    input.addEventListener('contextmenu', e => e.preventDefault());
    input.addEventListener('selectstart', e => e.preventDefault());
  });

  setLang(currentLang);
  renderHistory();

  // Handle URL parameters (e.g. ?cal=julian&y=632&m=1&d=27)
  var params = new URLSearchParams(window.location.search);
  if (params.get('y')) {
    var calId = params.get('cal') || 'julian';
    var t = I18N[currentLang] || I18N.en;
    fromCalInput.value = t.calendars[calId] || calId;
    var toId = params.get('to');
    toCalInput.value = (toId && t.calendars[toId]) || t.calendars.gregorian || '';
    updateVariantBar(toVariantsBar, toCalInput);
    updateVariantBar(fromVariantsBar, fromCalInput);
    updateMonthSelects();
    $('#from-year').value = params.get('y');
    if (params.get('m')) setMonthByNumber(parseInt(params.get('m'), 10));
    if (params.get('d')) $('#from-day').value = params.get('d');
    convert();
  } else {
    // Default: last-selected source (or Hijri), Christian Era / Gregorian target (implicit)
    var t = I18N[currentLang] || I18N.en;
    var storedFrom = kkStore.get('kalkal-from-cal');
    var defaultFromId = (storedFrom && CALENDARS[storedFrom]) ? storedFrom : 'hijri';
    fromCalInput.value = t.calendars[defaultFromId] || t.calendars.hijri || 'Hijri';
    // „Do" od początku widoczne i wypełnione (dawniej puste = domyślne AD)
    toCalInput.value = t.calendars.gregorian || '';
    onCalendarChange(fromCalInput);
    updateVariantBar(toVariantsBar, toCalInput);
    updateCalDescLink(toCalInput, 'to-cal-desc');
    updateMonthSelects();
  }

  // Auto-focus year input
  $('#from-year').focus();
})();

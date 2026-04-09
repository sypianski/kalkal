// kalkal — UI logic (unified form)
// Depends on: Cal (hijri.js), I18N (i18n.js)

(() => {
  'use strict';

  function detectLang() {
    const supported = ['en', 'pl', 'ar', 'eo'];
    for (const tag of navigator.languages || [navigator.language]) {
      const code = tag.toLowerCase().split('-')[0];
      if (supported.includes(code)) return code;
    }
    return 'en';
  }

  let currentLang = localStorage.getItem('kalkal-lang') || detectLang();

  // Preferred Hijri variant (persisted across sessions)
  const storedHijriVariant = localStorage.getItem('kalkal-hijri-variant');

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
      monthNames: (t) => t.persianMonths,
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
      historicalRange: null
    }
  };

  // Apply persisted Hijri variant preference
  if (storedHijriVariant && CALENDARS.hijri.variants.includes(storedHijriVariant)) {
    CALENDARS.hijri._variant = storedHijriVariant;
    CALENDARS.hijri.defaultVariant = storedHijriVariant;
  }

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
  const VARIANT_PRIORITY = {
    byzantine: 1,
    hijri: 2,
    yazdgerdi: 3,
    seleucid: 4,
    human: 5
  };

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
  const outOfEraCard = $('#outofera-card');
  const errorPanel = $('#form-error');
  const appTitle = $('#app-title');
  const appSubtitle = $('#app-subtitle');
  const fromCalInput = $('#from-calendar');
  const toCalInput = $('#to-calendar');
  const fromMonthSelect = $('#from-month');
  const fromVariantsBar = $('#from-variants');
  const toVariantsBar = $('#to-variants');
  const refineCard = $('#refine-card');

  // ---- Variant bar (disabled — variants now shown in results) ----

  function updateVariantBar() {}

  // ---- Calendar change handler ----

  function onCalendarChange(calInput) {
    if (calInput === fromCalInput) {
      updateVariantBar(fromVariantsBar, fromCalInput);
      updateMonthSelects();
    } else {
      updateVariantBar(toVariantsBar, toCalInput);
      if (resultPanel.classList.contains('has-result')) convert();
    }
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

  function setupMonthDropdown(input) {
    var dropdown = null;
    var activeIndex = -1;

    function show() {
      hide();
      if (monthData.length === 0) return;
      dropdown = el('div', { class: 'cal-suggestions' });

      // Clear option
      var clearItem = el('div', { class: 'cal-item', text: '\u2014' });
      clearItem.addEventListener('mousedown', function(e) {
        e.preventDefault();
        input.value = '';
        input.dataset.monthValue = '';
        hide();
        input.classList.remove('has-error');
        if (resultPanel.classList.contains('has-result')) convert();
      });
      dropdown.appendChild(clearItem);

      monthData.forEach(function(m) {
        var item = el('div', { class: 'cal-item', text: m.name });
        item.addEventListener('mousedown', function(e) {
          e.preventDefault();
          input.value = m.name;
          input.dataset.monthValue = String(m.num);
          hide();
          input.classList.remove('has-error');
          if (resultPanel.classList.contains('has-result')) convert();
        });
        dropdown.appendChild(item);
      });
      input.parentNode.appendChild(dropdown);
      activeIndex = -1;
    }

    function hide() {
      if (dropdown) { dropdown.remove(); dropdown = null; activeIndex = -1; }
    }

    function getItems() {
      return dropdown ? Array.from(dropdown.querySelectorAll('.cal-item')) : [];
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
    }

    input.addEventListener('focus', show);
    input.addEventListener('click', show);
    input.addEventListener('blur', function() { setTimeout(hide, 150); });

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
        items[activeIndex].dispatchEvent(new Event('mousedown'));
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
    localStorage.setItem('kalkal-lang', lang);

    const t = I18N[lang];
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    appTitle.textContent = t.appTitle;
    appSubtitle.innerHTML = t.appSubtitle + ' <span style="color: red; font-weight: bold;">BETA</span>';

    $$('[data-i18n]').forEach(node => {
      const key = node.dataset.i18n;
      if (t[key]) node.textContent = t[key];
    });

    $$('[data-i18n-placeholder]').forEach(node => {
      const key = node.dataset.i18nPlaceholder;
      if (t[key]) node.placeholder = t[key];
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
    document.title = 'kalkal \u2014 ' + t.appTitle;
  }

  // ---- Calendar autocomplete ----

  function setupAutocomplete(input) {
    let dropdown = null;
    let activeIndex = -1;

    const CALENDAR_GROUPS = [
      { group: 'universal', ids: ['human'] },
      { group: 'christian', ids: ['gregorian', 'julian', 'byzantine', 'spanish'] },
      { group: 'islamic', ids: ['hijri', 'solarHijri', 'rumi'] },
      { group: 'iranian', ids: ['yazdgerdi', 'ilkhani'] },
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
          item.addEventListener('mousedown', e => {
            e.preventDefault();
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
      input.parentNode.appendChild(dropdown);
      activeIndex = -1;
    }

    function hide() {
      if (dropdown) {
        dropdown.remove();
        dropdown = null;
        activeIndex = -1;
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
    }

    input.addEventListener('focus', () => {
      input.select();
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

    input.addEventListener('blur', () => {
      setTimeout(hide, 150);
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
        items[activeIndex].dispatchEvent(new Event('mousedown'));
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
    if (inputEl) inputEl.classList.add('has-error');
  }

  function clearError() {
    errorPanel.textContent = '';
    $$('.has-error', form).forEach(el => el.classList.remove('has-error'));
  }

  // ---- Validation & Conversion ----

  function convert() {
    clearError();
    const t = I18N[currentLang];

    // Validate source calendar (default: gregorian)
    const fromCalVal = fromCalInput.value.trim();
    const srcCal = fromCalVal ? resolveCalendar(fromCalVal) : CALENDARS.gregorian;
    if (!srcCal) { showError(t.errUnknownCal + fromCalVal, fromCalInput); return; }

    // Validate target calendar (default: human era)
    const toCalVal = toCalInput.value.trim();
    const tgtCal = toCalVal ? resolveCalendar(toCalVal) : CALENDARS.human;
    if (!tgtCal) { showError(t.errUnknownCal + toCalVal, toCalInput); return; }

    if (srcCal.id === tgtCal.id) { showError(t.errSameCal); return; }

    // Ensure default variants for validation & range conversions
    if (srcCal.variants) srcCal._variant = srcCal.defaultVariant;
    if (tgtCal.variants) tgtCal._variant = tgtCal.defaultVariant;

    // Validate year
    const fromYear = parseInt($('#from-year').value, 10);
    if (!fromYear || fromYear < 1) { showError(t.errNoYear, $('#from-year')); return; }

    const fromMonth = getMonthValue();
    const fromDay = parseInt($('#from-day').value, 10) || null;

    // Validate month
    if (fromMonth && (fromMonth < 1 || fromMonth > srcCal.monthCount)) {
      showError(t.errInvalidMonth, $('#from-month')); return;
    }

    // Validate day
    if (fromDay && fromMonth) {
      const maxDay = srcCal.monthLength(fromYear, fromMonth);
      if (fromDay < 1 || fromDay > maxDay) {
        showError(t.errInvalidDay, $('#from-day')); return;
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

    recordConversion();
  }

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
          var tgtNames = tgt.monthNames(t);
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
    var srcNames = src.monthNames(t);

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

    var bridge = el('div', { class: 'result-bridge' });
    bridge.appendChild(el('span', { class: 'bridge-label bridge-src-cal', text: srcCalName }));
    bridge.appendChild(el('span', { class: 'bridge-mid-top' }));
    bridge.appendChild(el('span', { class: 'bridge-label bridge-tgt-cal', text: tgtCalName }));
    bridge.appendChild(el('span', { class: 'bridge-src-year', text: String(y) }));
    bridge.appendChild(el('span', { class: 'bridge-arrow' }, '\u2192'));
    bridge.appendChild(el('span', { class: 'bridge-tgt-year', text: tgtYearStr }));
    bridge.appendChild(el('span', { class: 'bridge-label bridge-src-detail', text: srcDetail }));
    bridge.appendChild(el('span', { class: 'bridge-mid-bot' }));
    bridge.appendChild(el('span', { class: 'bridge-label bridge-tgt-detail', text: tgtDetail }));
    elements.push(bridge);

    // Hidden element for copy-button (full target date string)
    var copyText = tgtDetail ? (tgtDetail + ' ' + tgtYearStr) : tgtYearStr;
    var copyEl = el('span', { class: 'result-main' });
    copyEl.textContent = copyText;
    copyEl.style.display = 'none';
    elements.push(copyEl);

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
        elements.push(el('p', { class: 'result-variant-label', text: g.labels.join(', ') + ': ' + altText }));
      }
    }
    if (tgt.id === 'byzantine') {
      var ind = Cal.indictionFromJD(g0.jd);
      elements.push(el('p', { class: 'result-secondary result-indiction', text: (t.indictionLabel || 'Indiction') + ' ' + ind }));
    }

    var primaryResult = groupList[0].result;
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
    if (tgt.id === 'gregorian' && primaryJd < 2299160.5) {
      elements.push(el('p', { class: 'result-note', text: t.julianDateNote }));
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

    showResult(elements, null, null, astroElements, { jd: primaryJd, srcId: src.id, tgtId: tgt.id });
  }

  function convertRange(src, tgt, y1, m1, d1, y2, m2, d2, t) {
    const jdStart = src.toJD(y1, m1, d1);
    const jdEnd = src.toJD(y2, m2, d2);
    const startResult = tgt.fromJD(jdStart);
    const endResult = tgt.fromJD(jdEnd);
    const srcNames = src.monthNames(t);
    const tgtNames = tgt.monthNames(t);
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
      el('th', { text: srcLabel }),
      el('th', { text: tgtLabel + ' (' + (t.rangeStart || 'Start') + ')' }),
      el('th', { text: tgtLabel + ' (' + (t.rangeEnd || 'End') + ')' }),
      el('th', { text: t.totalDays })
    )));
    const tbody = el('tbody');
    monthRows.forEach(row => {
      tbody.appendChild(el('tr', null,
        el('td', { class: 'month-name', text: row.srcName }),
        el('td', { class: 'date-cell', text: row.startStr }),
        el('td', { class: 'date-cell', text: row.endStr }),
        el('td', { text: String(row.days) })
      ));
    });
    table.appendChild(tbody);

    const srcRange = fmtDateRange(srcNames, { day: d1, month: m1, year: y1 }, { day: d2, month: m2, year: y2 });
    const srcStartStr = srcRange.startStr;
    const srcEndStr = srcRange.endStr;

    const isProlepticGregorian = tgt.id === 'gregorian' && jdEnd < 2299160.5;
    const astroResult = buildRangeAstroPanel(jdStart, jdEnd, tgt, tgtNames, t);
    const breakdown = monthRows.length > 1 ? [table] : null;
    const rangeElements = [
      el('p', { class: 'result-span' },
        el('span', { class: 'date-val', text: tgtStartStr }),
        ' \u2013 ',
        el('span', { class: 'date-val', text: tgtEndStr })
      ),
      isProlepticGregorian ? el('p', { class: 'result-note', text: t.julianDateNote }) : null,
    ];
    var rangeAstroElements = null;
    if (astroResult) {
      rangeAstroElements = [];
      astroResult.panel.classList.remove('hidden');
      rangeAstroElements.push(astroResult.panel);
    }
    showResult(rangeElements, breakdown, astroResult ? astroResult.highlights : null, rangeAstroElements, { jd: jdStart, jdEnd: jdEnd, srcId: src.id, tgtId: tgt.id });
  }

  function convertYearRange(src, tgt, year, t) {
    const jdStart = src.toJD(year, 1, 1);
    const jdEnd = src.toJD(year, src.monthCount, src.monthLength(year, src.monthCount));
    const startResult = tgt.fromJD(jdStart);
    const endResult = tgt.fromJD(jdEnd);
    const tgtNames = tgt.monthNames(t);
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
      el('th', { text: srcLabel }),
      el('th', { text: tgtLabel + ' (' + (t.rangeStart || 'Start') + ')' }),
      el('th', { text: tgtLabel + ' (' + (t.rangeEnd || 'End') + ')' }),
      el('th', { text: t.totalDays })
    )));
    const tbody = el('tbody');
    monthRows.forEach(row => {
      tbody.appendChild(el('tr', null,
        el('td', { class: 'month-name', text: row.srcName }),
        el('td', { class: 'date-cell', text: row.startStr }),
        el('td', { class: 'date-cell', text: row.endStr }),
        el('td', { text: String(row.days) })
      ));
    });
    table.appendChild(tbody);

    const isProlepticGregorian = tgt.id === 'gregorian' && jdEnd < 2299160.5;
    const astroResult = buildRangeAstroPanel(jdStart, jdEnd, tgt, tgtNames, t);
    const yearElements = [
      el('p', { class: 'result-span' },
        el('span', { class: 'date-val', text: tgtStartStr }), ' \u2013 ',
        el('span', { class: 'date-val', text: tgtEndStr })
      ),
      isProlepticGregorian ? el('p', { class: 'result-note', text: t.julianDateNote }) : null,
    ];
    var yearAstroElements = null;
    if (astroResult) {
      yearAstroElements = [];
      astroResult.panel.classList.remove('hidden');
      yearAstroElements.push(astroResult.panel);
    }
    showResult(yearElements, [table], astroResult ? astroResult.highlights : null, yearAstroElements, { jd: jdStart, jdEnd: jdEnd, srcId: src.id, tgtId: tgt.id });
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
    if (highlights.length === 0) return null;
    panel.appendChild(buildMeta([[t.jdn, jdStart + ' \u2013 ' + jdEnd]]));
    return { panel: panel, highlights: highlights };
  }

  // ---- Helpers ----

  // Format "day month [year]" — omit year from start when both years match
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
  function dateDd(dateStr) {
    var dd = document.createElement('dd');
    var dashIdx = dateStr.indexOf(' \u2013 ');
    if (dashIdx >= 0) {
      dd.appendChild(document.createTextNode(dateStr.slice(0, dashIdx)));
      dd.appendChild(document.createElement('wbr'));
      dd.appendChild(document.createTextNode(dateStr.slice(dashIdx)));
    } else {
      dd.textContent = dateStr;
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
      const names = cal.monthNames(t);
      let dateStr;
      if (isRange) {
        const endResult = cal.fromJD(jdEnd);
        const range = fmtDateRange(names, result, endResult);
        dateStr = range.startStr + ' \u2013 ' + range.endStr;
      } else if (id === 'roman' && result.day) {
        dateStr = Cal.romanDayNotation(result.month, result.day, cal.isLeap(result.year)) + ' ' + result.year + ' AUC';
      } else {
        dateStr = result.day + ' ' + names[result.month - 1] + ' ' + result.year;
      }
      matches.push([t.calendars[id], dateStr]);
    }
    if (matches.length === 0) return null;
    const dl = el('dl', { class: 'contextual-list' });
    matches.forEach(([label, value]) => {
      dl.appendChild(el('div', null, el('dt', { text: label }), dateDd(value)));
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
      const names = cal.monthNames(t);
      let dateStr;
      if (isRange) {
        const endResult = cal.fromJD(jdEnd);
        const range = fmtDateRange(names, result, endResult);
        dateStr = range.startStr + ' \u2013 ' + range.endStr;
      } else if (id === 'roman' && result.day) {
        dateStr = Cal.romanDayNotation(result.month, result.day, cal.isLeap(result.year)) + ' ' + result.year + ' AUC';
      } else {
        dateStr = result.day + ' ' + names[result.month - 1] + ' ' + result.year;
      }
      matches.push([t.calendars[id], dateStr]);
    }
    if (matches.length === 0) return null;
    const dl = el('dl', { class: 'contextual-list' });
    matches.forEach(([label, value]) => {
      dl.appendChild(el('div', null, el('dt', { text: label }), dateDd(value)));
    });
    return dl;
  }

  function showResult(elements, breakdownElements, rangeHighlights, astroElements, contextInfo) {
    while (resultBody.firstChild) resultBody.removeChild(resultBody.firstChild);
    elements.forEach(node => { if (node) resultBody.appendChild(node); });
    const t = I18N[currentLang] || I18N.en;
    const copyBtn = el('button', { class: 'copy-btn', text: t.copyResult });
    copyBtn.type = 'button';
    copyBtn.addEventListener('click', function () {
      const mainEl = resultBody.querySelector('.result-main');
      const text = mainEl ? mainEl.textContent.trim() : resultBody.innerText.trim();
      navigator.clipboard.writeText(text).then(function () {
        copyBtn.textContent = t.copied;
        setTimeout(function () { copyBtn.textContent = t.copyResult; }, 1500);
      });
    });
    resultBody.appendChild(copyBtn);

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

    // Show target calendar dropdown (pre-filled) and refine card (month/day)
    var toCalField = document.getElementById('to-calendar-field');
    if (toCalField) {
      toCalField.hidden = false;
      // Pre-fill with current target calendar name
      var tgtCal = resolveCalendar(toCalInput.value) || CALENDARS.human;
      if (!toCalInput.value.trim()) {
        toCalInput.value = t.calendars[tgtCal.id] || '';
      }
    }
    if (refineCard) refineCard.hidden = false;

    // Contextual calendars tile (expanded, with tile toggle header)
    while (contextualCard.firstChild) contextualCard.removeChild(contextualCard.firstChild);
    if (contextInfo) {
      var ctxPanel = buildContextualPanel(contextInfo.jd, contextInfo.srcId, contextInfo.tgtId, t, contextInfo.jdEnd);
      if (ctxPanel) {
        var ctxToggle = el('button', { type: 'button', class: 'tile-toggle active', text: t.contextualLabel || 'Contemporaneous calendars' });
        var ctxContent = el('div', { class: 'tile-content' });
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

      // Out-of-era calendars tile (collapsed)
      while (outOfEraCard.firstChild) outOfEraCard.removeChild(outOfEraCard.firstChild);
      var ooePanel = buildOutOfEraPanel(contextInfo.jd, contextInfo.srcId, contextInfo.tgtId, t, contextInfo.jdEnd);
      if (ooePanel) {
        var ooeToggle = el('button', { type: 'button', class: 'tile-toggle', text: t.otherCalendarsLabel || 'Proleptic conversions' });
        var ooeContent = el('div', { class: 'tile-content hidden' });
        ooeContent.appendChild(ooePanel);
        ooeToggle.addEventListener('click', function() {
          ooeContent.classList.toggle('hidden');
          ooeToggle.classList.toggle('active');
        });
        outOfEraCard.appendChild(ooeToggle);
        outOfEraCard.appendChild(ooeContent);
        outOfEraCard.hidden = false;
      } else {
        outOfEraCard.hidden = true;
      }
    } else {
      contextualCard.hidden = true;
      outOfEraCard.hidden = true;
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
      if (astroHints.length > 0) {
        astroTitle += ' \u00b7 ' + astroHints.join(' ');
      }
      var startExpanded = hasMeaningful;
      var astroToggle = el('button', { type: 'button', class: 'tile-toggle' + (startExpanded ? ' active' : ''), text: astroTitle });
      var astroContent = el('div', { class: 'tile-content' + (startExpanded ? '' : ' hidden') });
      astroElements.forEach(node => { if (node) astroContent.appendChild(node); });
      astroToggle.addEventListener('click', function() {
        astroContent.classList.toggle('hidden');
        astroToggle.classList.toggle('active');
      });
      astroCard.appendChild(astroToggle);
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
  }

  // ---- History ----

  const HISTORY_KEY = 'kalkal-history';
  const HISTORY_MAX = 20;
  const historyList = $('#history-list');
  const historyPanel = $('#history-panel');
  const historyClearBtn = $('#history-clear');
  const historyToggle = $('#history-toggle');
  const historyContent = $('#history-content');

  historyToggle.addEventListener('click', function(e) {
    if (e.target === historyClearBtn) return;
    historyContent.classList.toggle('hidden');
    historyToggle.classList.toggle('active');
  });

  function getHistory() {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; }
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
    localStorage.setItem(HISTORY_KEY, JSON.stringify(hist));
    renderHistory();
  }

  function shortCalName(id) {
    const SHORT = {
      hijri: 'AH', julian: 'Jul.', gregorian: 'AD', coptic: 'Copt.',
      ethiopian: 'Eth.', yazdgerdi: 'Zoro.', armenian: 'Arm.',
      solarHijri: 'SH', byzantine: 'Byz.', alexandrian: 'Alex.',
      seleucid: 'Sel.', syriac: 'Syr.', rumi: 'R\u016bm\u012b',
      egyptian: 'Egypt.', spanish: 'Span.',
      roman: 'Rom.', olympiad: 'Ol.', macedonian: 'Mac.'
    };
    return SHORT[id] || id;
  }

  function fmtDate(cal, t, y, m, d, omitYear) {
    if (!m) return String(y);
    const names = cal.monthNames(t);
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
      historyList.appendChild(el('li', { class: 'history-empty', text: t.noHistory }));
      return;
    }

    historyPanel.classList.add('has-items');
    hist.forEach((entry, i) => {
      const summary = buildHistorySummary(entry);
      const li = el('li', { class: 'history-item' });
      const btn = el('button', { class: 'history-entry' },
        el('span', { class: 'history-src', text: typeof summary === 'string' ? summary : summary.src }),
        typeof summary === 'object' ? el('span', { class: 'history-res', text: summary.res }) : null
      );
      const removeBtn = el('button', { class: 'history-remove', 'aria-label': 'Remove', text: '\u00d7' });

      btn.addEventListener('click', () => loadHistoryEntry(entry));
      removeBtn.addEventListener('click', e => {
        e.stopPropagation();
        const h = getHistory();
        h.splice(i, 1);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(h));
        renderHistory();
      });

      li.appendChild(btn);
      li.appendChild(removeBtn);
      historyList.appendChild(li);
    });
  }

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
    if (entry.year) saveHistory(entry);
  }

  historyClearBtn.addEventListener('click', () => {
    localStorage.removeItem(HISTORY_KEY);
    renderHistory();
  });

  // ---- Events ----

  langSwitcher.addEventListener('click', e => {
    const btn = e.target.closest('.lang-btn');
    if (!btn) return;
    setLang(btn.dataset.lang);
    renderHistory();
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    convert();
  });

  // Select all on focus for numeric inputs
  $('#from-year').addEventListener('focus', function() { this.select(); });
  $('#from-day').addEventListener('focus', function() { this.select(); });

  // Setup custom month dropdown
  setupMonthDropdown(fromMonthSelect);
  $('#from-day').addEventListener('change', () => {
    if (resultPanel.classList.contains('has-result')) convert();
  });

  // Clear errors on any input change
  form.addEventListener('input', () => clearError());

  // ---- Settings panel (mobile) ----
  (function() {
    const btn = $('#nav-settings-btn');
    const panel = $('#settings-panel');
    const backdrop = $('#settings-backdrop');
    if (!btn || !panel) return;

    function openSettings() {
      panel.classList.add('open');
      backdrop.classList.add('open');
      // Sync active states
      panel.querySelectorAll('.settings-lang-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.lang === currentLang);
      });
      const activeVariant = CALENDARS.hijri._variant;
      panel.querySelectorAll('.settings-variant-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.variant === activeVariant);
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
        CALENDARS.hijri._variant = v;
        CALENDARS.hijri.defaultVariant = v;
        localStorage.setItem('kalkal-hijri-variant', v);
        panel.querySelectorAll('.settings-variant-btn').forEach(x => x.classList.toggle('active', x.dataset.variant === v));
        if (resultPanel.classList.contains('has-result')) convert();
      });
    });
  })();

  // ---- Init ----

  setupAutocomplete(fromCalInput);
  setupAutocomplete(toCalInput);

  setLang(currentLang);
  renderHistory();

  // Handle URL parameters (e.g. ?cal=julian&y=632&m=1&d=27)
  var params = new URLSearchParams(window.location.search);
  if (params.get('y')) {
    var calId = params.get('cal') || 'julian';
    var t = I18N[currentLang] || I18N.en;
    fromCalInput.value = t.calendars[calId] || calId;
    updateVariantBar(fromVariantsBar, fromCalInput);
    updateMonthSelects();
    $('#from-year').value = params.get('y');
    if (params.get('m')) setMonthByNumber(parseInt(params.get('m'), 10));
    if (params.get('d')) $('#from-day').value = params.get('d');
    convert();
  } else {
    // Default: Hijri source, Human Era target (implicit)
    var t = I18N[currentLang] || I18N.en;
    fromCalInput.value = t.calendars.hijri || 'Hijri';
    toCalInput.value = '';
    onCalendarChange(fromCalInput);
    updateMonthSelects();
  }

  // Auto-focus year input
  $('#from-year').focus();
})();

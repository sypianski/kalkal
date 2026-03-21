// kalkal — UI logic (unified form)
// Depends on: Cal (hijri.js), I18N (i18n.js)

(() => {
  'use strict';

  let currentLang = localStorage.getItem('kalkal-lang') || 'en';

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
      monthNames: (t) => t.hijriMonths
    },
    julian: {
      id: 'julian',
      toJD: (y, m, d) => Cal.julianToJD(y, m, d),
      fromJD: (jd) => Cal.jdToJulian(jd),
      monthLength: (y, m) => Cal.julianMonthLength(y, m),
      yearLength: (y) => Cal.isJulianLeapYear(y) ? 366 : 365,
      isLeap: (y) => Cal.isJulianLeapYear(y),
      monthCount: 12,
      monthNames: (t) => t.gregorianMonths
    },
    gregorian: {
      id: 'gregorian',
      toJD: (y, m, d) => Cal.gregorianToJD(y, m, d),
      fromJD: (jd) => Cal.jdToGregorian(jd),
      monthLength: (y, m) => Cal.gregorianMonthLength(y, m),
      yearLength: (y) => Cal.isGregorianLeapYear(y) ? 366 : 365,
      isLeap: (y) => Cal.isGregorianLeapYear(y),
      monthCount: 12,
      monthNames: (t) => t.gregorianMonths
    },
    coptic: {
      id: 'coptic',
      toJD: (y, m, d) => Cal.copticToJD(y, m, d),
      fromJD: (jd) => Cal.jdToCoptic(jd),
      monthLength: (y, m) => Cal.copticMonthLength(y, m),
      yearLength: (y) => Cal.copticYearLength(y),
      isLeap: (y) => Cal.isCopticLeapYear(y),
      monthCount: 13,
      monthNames: (t) => t.copticMonths
    },
    ethiopian: {
      id: 'ethiopian',
      toJD: (y, m, d) => Cal.ethiopianToJD(y, m, d),
      fromJD: (jd) => Cal.jdToEthiopian(jd),
      monthLength: (y, m) => Cal.ethiopianMonthLength(y, m),
      yearLength: (y) => Cal.ethiopianYearLength(y),
      isLeap: (y) => Cal.isEthiopianLeapYear(y),
      monthCount: 13,
      monthNames: (t) => t.ethiopianMonths
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
      monthNames: (t) => t.persianMonths
    },
    armenian: {
      id: 'armenian',
      toJD: (y, m, d) => Cal.armenianToJD(y, m, d),
      fromJD: (jd) => Cal.jdToArmenian(jd),
      monthLength: (y, m) => Cal.armenianMonthLength(y, m),
      yearLength: () => Cal.armenianYearLength(),
      isLeap: () => false,
      monthCount: 13,
      monthNames: (t) => t.armenianMonths
    },
    solarHijri: {
      id: 'solarHijri',
      toJD: (y, m, d) => Cal.solarHijriToJD(y, m, d),
      fromJD: (jd) => Cal.jdToSolarHijri(jd),
      monthLength: (y, m) => Cal.solarHijriMonthLength(y, m),
      yearLength: (y) => Cal.solarHijriYearLength(y),
      isLeap: (y) => Cal.isSolarHijriLeapYear(y),
      monthCount: 12,
      monthNames: (t) => t.persianMonths
    },
    ilkhani: {
      id: 'ilkhani',
      toJD: (y, m, d) => Cal.ilkhaniToJD(y, m, d),
      fromJD: (jd) => Cal.jdToIlkhani(jd),
      monthLength: (y, m) => Cal.ilkhaniMonthLength(y, m),
      yearLength: (y) => Cal.ilkhaniYearLength(y),
      isLeap: (y) => Cal.isIlkhaniLeapYear(y),
      monthCount: 12,
      monthNames: (t) => t.persianMonths
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
      }
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
      }
    },
    syriac: {
      id: 'syriac',
      toJD: (y, m, d) => Cal.syriacToJD(y, m, d),
      fromJD: (jd) => Cal.jdToSyriac(jd),
      monthLength: (y, m) => Cal.syriacMonthLength(y, m),
      yearLength: (y) => Cal.syriacYearLength(y),
      isLeap: (y) => Cal.isSyriacLeapYear(y),
      monthCount: 12,
      monthNames: (t) => t.syriacMonths
    },
    rumi: {
      id: 'rumi',
      toJD: (y, m, d) => Cal.rumiToJD(y, m, d),
      fromJD: (jd) => Cal.jdToRumi(jd),
      monthLength: (y, m) => Cal.rumiMonthLength(y, m),
      yearLength: (y) => Cal.rumiYearLength(y),
      isLeap: (y) => Cal.isRumiLeapYear(y),
      monthCount: 12,
      monthNames: (t) => t.gregorianMonths
    },
    egyptian: {
      id: 'egyptian',
      toJD: (y, m, d) => Cal.egyptianToJD(y, m, d),
      fromJD: (jd) => Cal.jdToEgyptian(jd),
      monthLength: (y, m) => Cal.egyptianMonthLength(y, m),
      yearLength: () => Cal.egyptianYearLength(),
      isLeap: () => false,
      monthCount: 13,
      monthNames: (t) => t.egyptianMonths
    },
    auc: {
      id: 'auc',
      toJD: (y, m, d) => Cal.aucToJD(y, m, d),
      fromJD: (jd) => Cal.jdToAuc(jd),
      monthLength: (y, m) => Cal.aucMonthLength(y, m),
      yearLength: (y) => Cal.aucYearLength(y),
      isLeap: (y) => Cal.isAucLeapYear(y),
      monthCount: 12,
      monthNames: (t) => t.gregorianMonths
    },
    spanish: {
      id: 'spanish',
      toJD: (y, m, d) => Cal.spanishToJD(y, m, d),
      fromJD: (jd) => Cal.jdToSpanish(jd),
      monthLength: (y, m) => Cal.spanishMonthLength(y, m),
      yearLength: (y) => Cal.spanishYearLength(y),
      isLeap: (y) => Cal.isSpanishLeapYear(y),
      monthCount: 12,
      monthNames: (t) => t.gregorianMonths
    },
    antiochene: {
      id: 'antiochene',
      toJD: (y, m, d) => Cal.antiocheneToJD(y, m, d),
      fromJD: (jd) => Cal.jdToAntiochene(jd),
      monthLength: (y, m) => Cal.antiocheneMonthLength(y, m),
      yearLength: (y) => Cal.antiocheneYearLength(y),
      isLeap: (y) => Cal.isAntiocheneLeapYear(y),
      monthCount: 12,
      monthNames: (t) => t.seleucidMonths
    },
    olympiad: {
      id: 'olympiad',
      toJD: (y, m, d) => Cal.olympiadToJD(y, m, d),
      fromJD: (jd) => Cal.jdToOlympiad(jd),
      monthLength: (y, m) => Cal.olympiadMonthLength(y, m),
      yearLength: (y) => Cal.olympiadYearLength(y),
      isLeap: (y) => Cal.isOlympiadLeapYear(y),
      monthCount: 12,
      monthNames: (t) => t.gregorianMonths
    },
    macedonian: {
      id: 'macedonian',
      toJD: (y, m, d) => Cal.macedonianToJD(y, m, d),
      fromJD: (jd) => Cal.jdToMacedonian(jd),
      monthLength: (y, m) => Cal.macedonianMonthLength(y, m),
      yearLength: (y) => Cal.macedonianYearLength(y),
      isLeap: (y) => Cal.isMacedonianLeapYear(y),
      monthCount: 12,
      monthNames: (t) => t.macedonianMonths
    },
    hebrew: {
      id: 'hebrew',
      toJD: (y, m, d) => Cal.hebrewToJD(y, m, d),
      fromJD: (jd) => Cal.jdToHebrew(jd),
      monthLength: (y, m) => Cal.hebrewMonthLength(y, m),
      yearLength: (y) => Cal.hebrewYearLength(y),
      isLeap: (y) => Cal.isHebrewLeapYear(y),
      monthCount: 13,
      monthNames: (t) => t.hebrewMonths
    },
    babylonian: {
      id: 'babylonian',
      toJD: (y, m, d) => Cal.babylonianToJD(y, m, d),
      fromJD: (jd) => Cal.jdToBabylonian(jd),
      monthLength: (y, m) => Cal.babylonianMonthLength(y, m),
      yearLength: (y) => Cal.babylonianYearLength(y),
      isLeap: (y) => Cal.isBabylonianLeapYear(y),
      monthCount: 13,
      monthNames: (t) => t.babylonianMonths
    },
    bp: {
      id: 'bp',
      toJD: (y, m, d) => Cal.bpToJD(y, m, d),
      fromJD: (jd) => Cal.jdToBP(jd),
      monthLength: (y, m) => Cal.bpMonthLength(y, m),
      yearLength: (y) => Cal.bpYearLength(y),
      isLeap: (y) => Cal.isBPLeapYear(y),
      monthCount: 12,
      monthNames: (t) => t.gregorianMonths
    },
    human: {
      id: 'human',
      toJD: (y, m, d) => Cal.humanToJD(y, m, d),
      fromJD: (jd) => Cal.jdToHuman(jd),
      monthLength: (y, m) => Cal.humanMonthLength(y, m),
      yearLength: (y) => Cal.humanYearLength(y),
      isLeap: (y) => Cal.isHumanLeapYear(y),
      monthCount: 12,
      monthNames: (t) => t.gregorianMonths
    }
  };

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
    Fasli: 'Fasli'
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
  const errorPanel = $('#form-error');
  const appTitle = $('#app-title');
  const appSubtitle = $('#app-subtitle');
  const fromCalInput = $('#from-calendar');
  const toCalInput = $('#to-calendar');
  const fromMonthSelect = $('#from-month');
  const fromVariantsBar = $('#from-variants');
  const toVariantsBar = $('#to-variants');

  // ---- Variant bar ----

  function updateVariantBar(bar, calInput) {
    while (bar.firstChild) bar.removeChild(bar.firstChild);
    bar.classList.remove('visible');

    const cal = resolveCalendar(calInput.value);
    if (!cal || !cal.variants) return;

    // Reset to default variant if not already set to a valid one
    if (!cal.variants.includes(cal._variant)) {
      cal._variant = cal.defaultVariant;
    }

    bar.classList.add('visible');
    cal.variants.forEach(v => {
      const btn = el('button', {
        type: 'button',
        class: 'variant-btn' + (v === cal._variant ? ' active' : ''),
        text: VARIANT_LABELS[v] || v
      });
      btn.addEventListener('click', () => {
        cal._variant = v;
        $$('.variant-btn', bar).forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (calInput === fromCalInput) updateMonthSelects();
      });
      bar.appendChild(btn);
    });
  }

  // ---- Calendar change handler ----

  function onCalendarChange(calInput) {
    if (calInput === fromCalInput) {
      updateVariantBar(fromVariantsBar, fromCalInput);
      updateMonthSelects();
    } else {
      updateVariantBar(toVariantsBar, toCalInput);
    }
  }

  // ---- Month select population ----

  function populateMonthSelect(selectEl, calId) {
    const t = I18N[currentLang];
    const cal = calId ? CALENDARS[calId] : null;
    const savedVal = selectEl.value;

    while (selectEl.firstChild) selectEl.removeChild(selectEl.firstChild);
    selectEl.appendChild(el('option', { value: '', text: '' }));

    if (cal) {
      const names = cal.monthNames(t);
      for (let i = 0; i < cal.monthCount; i++) {
        selectEl.appendChild(el('option', { value: String(i + 1), text: names[i] }));
      }
    }

    // Restore value if still valid
    if (savedVal && selectEl.querySelector('option[value="' + savedVal + '"]')) {
      selectEl.value = savedVal;
    }
  }

  function updateMonthSelects() {
    const srcCal = resolveCalendar(fromCalInput.value);
    populateMonthSelect(fromMonthSelect, srcCal ? srcCal.id : null);
  }

  // ---- Language ----

  function setLang(lang) {
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

    $$('.lang-btn', langSwitcher).forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    updateMonthSelects();
    updateVariantBar(fromVariantsBar, fromCalInput);
    updateVariantBar(toVariantsBar, toCalInput);
    document.title = 'kalkal \u2014 ' + t.appTitle;
  }

  // ---- Calendar autocomplete ----

  function setupAutocomplete(input) {
    let dropdown = null;
    let activeIndex = -1;

    function getMatches(query) {
      const t = I18N[currentLang];
      const lower = query.trim().toLowerCase();
      if (!lower) return Object.entries(t.calendars).map(([id, name]) => ({ id, name }));
      return Object.entries(t.calendars)
        .filter(([id, name]) => name.toLowerCase().startsWith(lower) || id.startsWith(lower))
        .map(([id, name]) => ({ id, name }));
    }

    function show(matches) {
      hide();
      if (matches.length === 0) return;
      dropdown = el('ul', { class: 'cal-suggestions' });
      matches.forEach((m, i) => {
        const li = el('li', null,
          m.name,
          el('span', { class: 'cal-hint', text: m.id })
        );
        li.addEventListener('mousedown', e => {
          e.preventDefault();
          input.value = m.name;
          hide();
          input.classList.remove('has-error');
          onCalendarChange(input);
        });
        dropdown.appendChild(li);
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

    function setActive(index) {
      if (!dropdown) return;
      const items = dropdown.querySelectorAll('li');
      items.forEach(li => li.classList.remove('active'));
      activeIndex = index;
      if (activeIndex >= 0 && activeIndex < items.length) {
        items[activeIndex].classList.add('active');
      }
    }

    input.addEventListener('focus', () => {
      show(getMatches(input.value));
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
      const items = dropdown.querySelectorAll('li');
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

    // Validate year
    const fromYear = parseInt($('#from-year').value, 10);
    if (!fromYear || fromYear < 1) { showError(t.errNoYear, $('#from-year')); return; }

    const fromMonth = parseInt($('#from-month').value, 10) || null;
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
    const jd = src.toJD(y, m, d);
    const result = tgt.fromJD(jd);
    const dow = Cal.getDayOfWeek(jd);
    const srcNames = src.monthNames(t);
    const tgtNames = tgt.monthNames(t);

    const isProlepticGregorian = tgt.id === 'gregorian' && jd < 2299160.5;
    const elements = [
      el('p', { class: 'result-label', text: t.calendars[src.id] }),
      el('p', { class: 'result-secondary', text: d + ' ' + srcNames[m - 1] + ' ' + y }),
      el('p', { class: 'result-label', text: t.calendars[tgt.id] }),
      el('p', { class: 'result-main', text: result.day + ' ' + tgtNames[result.month - 1] + ' ' + result.year }),
      el('p', { class: 'result-secondary', text: t.weekdays[dow] }),
    ];
    // Indiction for Byzantine calendars
    if (tgt.id === 'byzantine') {
      const ind = Cal.indictionFromJD(jd);
      elements.push(el('p', { class: 'result-secondary result-indiction', text: (t.indictionLabel || 'Indiction') + ' ' + ind }));
    }
    // Animal year for Ilkhanid
    if (tgt.id === 'ilkhani') {
      const animal = Cal.ilkhaniAnimalYear(result.year);
      const animalName = (t.ilkhaniAnimals && t.ilkhaniAnimals[animal]) || animal;
      elements.push(el('p', { class: 'result-secondary result-animal', text: (t.animalYearLabel || 'Animal year') + ': ' + animalName }));
    }
    // Babylonian source note
    if (tgt.id === 'babylonian') {
      const isPD = Cal.isBabylonianPD(result.year);
      const note = isPD ? (t.babylonianPDNote || 'Observational date from Parker & Dubberstein tables (626 BCE \u2013 45 CE).') : (t.babylonianArithNote || 'Arithmetic approximation (outside Parker & Dubberstein range). May differ \u00b11\u20132 days from historical observation.');
      elements.push(el('p', { class: 'result-note', text: note }));
    }
    if (isProlepticGregorian) {
      elements.push(el('p', { class: 'result-note', text: t.julianDateNote }));
    }
    // Zodiac (hidden by default, toggled after results)
    const zi = Cal.getZodiacSign(jd);
    const zodiacSymbol = '\u2648\u2649\u264A\u264B\u264C\u264D\u264E\u264F\u2650\u2651\u2652\u2653'[zi];
    const zodiacEl = el('p', { class: 'result-zodiac hidden', text: zodiacSymbol + ' ' + t.zodiacSigns[zi] });
    elements.push(zodiacEl);
    // Eclipse check
    if (typeof Eclipses !== 'undefined') {
      const ecl = Eclipses.lookup(jd);
      if (ecl) {
        const typeStr = Eclipses.typeLabel(ecl.type, t);
        const magStr = ecl.mag ? ' (' + ecl.mag.toFixed(3) + ')' : '';
        const eclEl = el('div', { class: 'result-eclipse' },
          el('span', { class: 'eclipse-icon', text: '\u{1F311}' }),
          el('span', { class: 'eclipse-type', text: (t.eclipseLabel || 'Solar eclipse') + ': ' + typeStr + magStr })
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
            mapLink.href = 'maps/' + ecl.noteKey + '.html';
          } else {
            mapLink.href = 'eclipses.html';
          }
          mapLink.textContent = ecl.noteKey ? (t.eclipseViewMap || 'View eclipse map') : (t.eclipseViewCatalogue || 'Eclipse catalogue');
          eclEl.appendChild(mapLink);
        }
        elements.push(eclEl);
      }
    }
    // Astronomy: moon phase, comets, supernovae, conjunctions
    if (typeof Astronomy !== 'undefined') {
      // Moon phase
      const moon = Astronomy.moonPhase(jd);
      const phaseName = (t.moonPhases && t.moonPhases[moon.name]) || moon.name;
      const moonEl = el('div', { class: 'result-astro result-moon' },
        el('span', { class: 'astro-icon', text: moon.icon }),
        el('span', { class: 'astro-text', text: (t.moonPhaseLabel || 'Moon phase') + ': ' + phaseName }),
        el('span', { class: 'astro-detail', text: moon.age + ' ' + (t.moonAge || 'day') + ' \u2022 ' + moon.illumination + '% ' + (t.moonIllumination || 'illuminated') })
      );
      elements.push(moonEl);

      // Comet check
      const comet = Astronomy.lookupComet(jd);
      if (comet) {
        const cName = (t.cometNames && t.cometNames[comet.id]) || comet.id;
        const cEl = el('div', { class: 'result-astro result-comet' },
          el('span', { class: 'astro-icon', text: '\u2604\uFE0F' }),
          el('span', { class: 'astro-text', text: (t.cometLabel || 'Comet') + ': ' + cName + ' (' + comet.year + ')' })
        );
        if (comet.noteKey && t.cometNotes && t.cometNotes[comet.noteKey]) {
          cEl.appendChild(el('p', { class: 'astro-note', text: t.cometNotes[comet.noteKey] }));
        }
        elements.push(cEl);
      }

      // Supernova check
      const sn = Astronomy.lookupSupernova(jd);
      if (sn) {
        const magStr = sn.peakMag > 0 ? '+' + sn.peakMag : String(sn.peakMag);
        const snEl = el('div', { class: 'result-astro result-supernova' },
          el('span', { class: 'astro-icon', text: '\u{1F4A5}' }),
          el('span', { class: 'astro-text', text: (t.supernovaLabel || 'Supernova') + ': ' + sn.id + ' (' + sn.constellation + ', mag ' + magStr + ')' })
        );
        if (sn.noteKey && t.supernovaNotes && t.supernovaNotes[sn.noteKey]) {
          snEl.appendChild(el('p', { class: 'astro-note', text: t.supernovaNotes[sn.noteKey] }));
        }
        elements.push(snEl);
      }

      // Conjunction check
      const conj = Astronomy.lookupConjunction(jd);
      if (conj) {
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
        elements.push(conjEl);
      }
    }
    elements.push(buildMeta([[t.jdn, String(jd)]]));
    showResult(elements);
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

    const tgtStartStr = startResult.day + ' ' + tgtNames[startResult.month - 1] + ' ' + startResult.year;
    const tgtEndStr = endResult.day + ' ' + tgtNames[endResult.month - 1] + ' ' + endResult.year;

    // Build source month breakdown with target equivalents
    const monthRows = [];
    let cy = y1, cm = m1;
    while (cy < y2 || (cy === y2 && cm <= m2)) {
      const mFirstDay = (cy === y1 && cm === m1) ? d1 : 1;
      const mLastDay = (cy === y2 && cm === m2) ? d2 : src.monthLength(cy, cm);
      const mDays = mLastDay - mFirstDay + 1;
      const mStartTgt = tgt.fromJD(src.toJD(cy, cm, mFirstDay));
      const mEndTgt = tgt.fromJD(src.toJD(cy, cm, mLastDay));
      monthRows.push({
        srcName: srcNames[cm - 1] + ' ' + cy,
        days: mDays,
        startStr: mStartTgt.day + ' ' + tgtNames[mStartTgt.month - 1] + ' ' + mStartTgt.year,
        endStr: mEndTgt.day + ' ' + tgtNames[mEndTgt.month - 1] + ' ' + mEndTgt.year
      });
      cm++;
      if (cm > src.monthCount) { cm = 1; cy++; }
    }

    const table = el('table', { class: 'year-table' });
    table.appendChild(el('thead', null, el('tr', null,
      el('th', { text: srcLabel }), el('th', { text: t.totalDays }), el('th', { text: tgtLabel })
    )));
    const tbody = el('tbody');
    monthRows.forEach(row => {
      tbody.appendChild(el('tr', null,
        el('td', { class: 'month-name', text: row.srcName }),
        el('td', { text: String(row.days) }),
        el('td', { class: 'date-cell' }, row.startStr + ' \u2013 ' + row.endStr)
      ));
    });
    table.appendChild(tbody);

    const srcStartStr = d1 + ' ' + srcNames[m1 - 1] + ' ' + y1;
    const srcEndStr = d2 + ' ' + srcNames[m2 - 1] + ' ' + y2;

    const isProlepticGregorian = tgt.id === 'gregorian' && jdEnd < 2299160.5;
    showResult([
      el('p', { class: 'result-label', text: srcLabel }),
      el('p', { class: 'result-secondary', text: srcStartStr + ' \u2013 ' + srcEndStr }),
      el('p', { class: 'result-label', text: tgtLabel }),
      el('p', { class: 'result-span' },
        el('span', { class: 'date-val', text: tgtStartStr }),
        ' \u2013 ',
        el('span', { class: 'date-val', text: tgtEndStr })
      ),
      isProlepticGregorian ? el('p', { class: 'result-note', text: t.julianDateNote }) : null,
      monthRows.length > 1 ? el('p', { class: 'result-label', text: t.monthBreakdown }) : null,
      monthRows.length > 1 ? table : null,
      buildMeta([[t.jdn, jdStart + ' \u2013 ' + jdEnd]])
    ]);
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

    const tgtStartStr = startResult.day + ' ' + tgtNames[startResult.month - 1] + ' ' + startResult.year;
    const tgtEndStr = endResult.day + ' ' + tgtNames[endResult.month - 1] + ' ' + endResult.year;

    const monthRows = [];
    for (let m = 1; m <= src.monthCount; m++) {
      const mLen = src.monthLength(year, m);
      const mStartTgt = tgt.fromJD(src.toJD(year, m, 1));
      const mEndTgt = tgt.fromJD(src.toJD(year, m, mLen));
      monthRows.push({
        srcName: srcNames[m - 1], days: mLen,
        startStr: mStartTgt.day + ' ' + tgtNames[mStartTgt.month - 1] + ' ' + mStartTgt.year,
        endStr: mEndTgt.day + ' ' + tgtNames[mEndTgt.month - 1] + ' ' + mEndTgt.year
      });
    }

    const table = el('table', { class: 'year-table' });
    table.appendChild(el('thead', null, el('tr', null,
      el('th', { text: srcLabel }), el('th', { text: t.totalDays }), el('th', { text: tgtLabel })
    )));
    const tbody = el('tbody');
    monthRows.forEach(row => {
      tbody.appendChild(el('tr', null,
        el('td', { class: 'month-name', text: row.srcName }),
        el('td', { text: String(row.days) }),
        el('td', { class: 'date-cell' }, row.startStr + ' \u2013 ' + row.endStr)
      ));
    });
    table.appendChild(tbody);

    const yearInfo = el('div', { class: 'year-info' },
      el('span', { class: 'year-info-item' },
        el('span', { class: 'year-info-val', text: String(src.yearLength(year)) }),
        ' ' + t.totalDays
      ),
      src.isLeap(year) ? el('span', { class: 'year-info-item' },
        el('span', { class: 'calendar-tag', text: t.leapYear })
      ) : null
    );

    const isProlepticGregorian = tgt.id === 'gregorian' && jdEnd < 2299160.5;
    showResult([
      el('p', { class: 'result-label', text: year + ' ' + srcLabel }),
      yearInfo,
      el('p', { class: 'result-span' },
        el('span', { class: 'date-val', text: tgtStartStr }), ' \u2013 ',
        el('span', { class: 'date-val', text: tgtEndStr })
      ),
      isProlepticGregorian ? el('p', { class: 'result-note', text: t.julianDateNote }) : null,
      el('p', { class: 'result-label', text: t.monthBreakdown }),
      table,
      buildMeta([[t.jdn, jdStart + ' \u2013 ' + jdEnd]])
    ]);
  }

  // ---- Helpers ----

  function buildMeta(pairs) {
    const dl = el('dl', { class: 'result-meta' });
    pairs.forEach(([label, value]) => {
      dl.appendChild(el('div', null, el('dt', { text: label }), el('dd', { text: value })));
    });
    return dl;
  }

  function showResult(elements) {
    while (resultPanel.firstChild) resultPanel.removeChild(resultPanel.firstChild);
    elements.forEach(node => { if (node) resultPanel.appendChild(node); });
    const t = I18N[currentLang] || I18N.en;
    const copyBtn = el('button', { class: 'copy-btn', text: t.copyResult });
    copyBtn.type = 'button';
    copyBtn.addEventListener('click', function () {
      const text = resultPanel.innerText.replace(copyBtn.textContent, '').trim();
      navigator.clipboard.writeText(text).then(function () {
        copyBtn.textContent = t.copied;
        setTimeout(function () { copyBtn.textContent = t.copyResult; }, 1500);
      });
    });
    resultPanel.appendChild(copyBtn);

    // Zodiac toggle button (only if there's a zodiac element in results)
    const zodiacEl = resultPanel.querySelector('.result-zodiac');
    if (zodiacEl) {
      const zodiacBtn = el('button', { class: 'zodiac-btn', text: t.zodiacLabel });
      zodiacBtn.type = 'button';
      zodiacBtn.addEventListener('click', function () {
        zodiacEl.classList.toggle('hidden');
        zodiacBtn.classList.toggle('active');
      });
      resultPanel.appendChild(zodiacBtn);
    }

    resultPanel.classList.add('has-result');
  }

  // ---- History ----

  const HISTORY_KEY = 'kalkal-history';
  const HISTORY_MAX = 20;
  const historyList = $('#history-list');
  const historyPanel = $('#history-panel');
  const historyClearBtn = $('#history-clear');

  function getHistory() {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; }
    catch { return []; }
  }

  function saveHistory(entry) {
    const hist = getHistory();
    // Deduplicate: remove if same params already exist
    const dominated = hist.findIndex(h =>
      h.fromCal === entry.fromCal && h.toCal === entry.toCal &&
      h.year === entry.year && h.month === entry.month && h.day === entry.day &&
      h.variant === entry.variant
    );
    if (dominated >= 0) hist.splice(dominated, 1);
    hist.unshift(entry);
    if (hist.length > HISTORY_MAX) hist.length = HISTORY_MAX;
    localStorage.setItem(HISTORY_KEY, JSON.stringify(hist));
    renderHistory();
  }

  function shortCalName(id) {
    const SHORT = {
      hijri: 'AH', julian: 'Jul.', gregorian: 'Greg.', coptic: 'Copt.',
      ethiopian: 'Eth.', yazdgerdi: 'Zoro.', armenian: 'Arm.',
      solarHijri: 'SH', byzantine: 'Byz.', alexandrian: 'Alex.',
      seleucid: 'Sel.', syriac: 'Syr.', rumi: 'R\u016bm\u012b',
      egyptian: 'Egypt.', auc: 'AUC', spanish: 'Span.',
      olympiad: 'Ol.', macedonian: 'Mac.'
    };
    return SHORT[id] || id;
  }

  function fmtDate(cal, t, y, m, d) {
    if (!m) return String(y);
    const names = cal.monthNames(t);
    const mName = names[m - 1] || String(m);
    // Abbreviate month to 3 chars if > 5 chars
    const shortM = mName.length > 5 ? mName.slice(0, 3) + '.' : mName;
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
      resStr = fmtDate(tgt, t, r1.year, r1.month, r1.day) + ' \u2013 ' + fmtDate(tgt, t, r2.year, r2.month, r2.day);
    } else {
      const r1 = tgt.fromJD(src.toJD(entry.year, 1, 1));
      const lastM = src.monthCount;
      const r2 = tgt.fromJD(src.toJD(entry.year, lastM, src.monthLength(entry.year, lastM)));
      resStr = r1.year === r2.year ? String(r1.year) : r1.year + '\u2013' + r2.year;
    }

    return srcStr + ' ' + srcShort + '  \u2192  ' + resStr + ' ' + tgtShort;
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
      const btn = el('button', { class: 'history-entry', text: summary });
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
    toCalInput.value = t.calendars[entry.toCal] || entry.toCal;
    onCalendarChange(fromCalInput);
    onCalendarChange(toCalInput);

    // Set variant if applicable
    const srcCal = CALENDARS[entry.fromCal];
    if (srcCal && srcCal.variants && entry.variant) {
      srcCal._variant = entry.variant;
      updateVariantBar(fromVariantsBar, fromCalInput);
    }

    // Set date fields
    $('#from-year').value = entry.year;
    $('#from-month').value = entry.month || '';
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
      month: parseInt($('#from-month').value, 10) || null,
      day: parseInt($('#from-day').value, 10) || null,
      variant: srcCal._variant || null,
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

  // Clear errors on any input change
  form.addEventListener('input', () => clearError());

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
    if (params.get('m')) $('#from-month').value = params.get('m');
    if (params.get('d')) $('#from-day').value = params.get('d');
    convert();
  }
})();

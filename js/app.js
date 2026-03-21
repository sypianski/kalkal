// kalkal — UI logic (unified form)
// Depends on: Cal (hijri.js), I18N (i18n.js)

(() => {
  'use strict';

  let currentLang = localStorage.getItem('kalkal-lang') || 'en';

  // Calendar registry
  const CALENDARS = {
    hijri: {
      id: 'hijri',
      toJD: (y, m, d) => Cal.hijriToJD(y, m, d),
      fromJD: (jd) => Cal.jdToHijri(jd),
      monthLength: (y, m) => Cal.hijriMonthLength(y, m),
      yearLength: (y) => Cal.hijriYearLength(y),
      isLeap: (y) => Cal.isHijriLeapYear(y),
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
      monthNames: (t) => t.copticMonths || I18N.en.copticMonths
    },
    ethiopian: {
      id: 'ethiopian',
      toJD: (y, m, d) => Cal.ethiopianToJD(y, m, d),
      fromJD: (jd) => Cal.jdToEthiopian(jd),
      monthLength: (y, m) => Cal.ethiopianMonthLength(y, m),
      yearLength: (y) => Cal.ethiopianYearLength(y),
      isLeap: (y) => Cal.isEthiopianLeapYear(y),
      monthCount: 13,
      monthNames: (t) => t.ethiopianMonths || I18N.en.ethiopianMonths
    },
    yazdgerdi: {
      id: 'yazdgerdi',
      toJD: (y, m, d) => Cal.yazdgerdiToJD(y, m, d),
      fromJD: (jd) => Cal.jdToYazdgerdi(jd),
      monthLength: (y, m) => Cal.yazdgerdiMonthLength(y, m),
      yearLength: () => Cal.yazdgerdiYearLength(),
      isLeap: () => false,
      monthCount: 13,
      monthNames: (t) => t.persianMonths || I18N.en.persianMonths
    },
    armenian: {
      id: 'armenian',
      toJD: (y, m, d) => Cal.armenianToJD(y, m, d),
      fromJD: (jd) => Cal.jdToArmenian(jd),
      monthLength: (y, m) => Cal.armenianMonthLength(y, m),
      yearLength: () => Cal.armenianYearLength(),
      isLeap: () => false,
      monthCount: 13,
      monthNames: (t) => t.armenianMonths || I18N.en.armenianMonths
    },
    solarHijri: {
      id: 'solarHijri',
      toJD: (y, m, d) => Cal.solarHijriToJD(y, m, d),
      fromJD: (jd) => Cal.jdToSolarHijri(jd),
      monthLength: (y, m) => Cal.solarHijriMonthLength(y, m),
      yearLength: (y) => Cal.solarHijriYearLength(y),
      isLeap: (y) => Cal.isSolarHijriLeapYear(y),
      monthCount: 12,
      monthNames: (t) => t.persianMonths || I18N.en.persianMonths
    }
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
  const toMonthSelect = $('#to-month');

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
    populateMonthSelect(toMonthSelect, srcCal ? srcCal.id : null);
  }

  // ---- Language ----

  function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('kalkal-lang', lang);

    const t = I18N[lang];
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

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

    $$('.lang-btn', langSwitcher).forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    updateMonthSelects();
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
          if (input === fromCalInput) updateMonthSelects();
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
      if (input === fromCalInput) updateMonthSelects();
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

    // Validate source calendar
    const fromCalVal = fromCalInput.value.trim();
    if (!fromCalVal) { showError(t.errNoFromCal, fromCalInput); return; }
    const srcCal = resolveCalendar(fromCalVal);
    if (!srcCal) { showError(t.errUnknownCal + fromCalVal, fromCalInput); return; }

    // Validate target calendar
    const toCalVal = toCalInput.value.trim();
    if (!toCalVal) { showError(t.errNoToCal, toCalInput); return; }
    const tgtCal = resolveCalendar(toCalVal);
    if (!tgtCal) { showError(t.errUnknownCal + toCalVal, toCalInput); return; }

    if (srcCal.id === tgtCal.id) { showError(t.errSameCal); return; }

    // Validate year
    const fromYear = parseInt($('#from-year').value, 10);
    if (!fromYear || fromYear < 1) { showError(t.errNoYear, $('#from-year')); return; }

    const fromMonth = parseInt($('#from-month').value, 10) || null;
    const fromDay = parseInt($('#from-day').value, 10) || null;
    const toYear = parseInt($('#to-year').value, 10) || null;
    const toMonth = parseInt($('#to-month').value, 10) || null;
    const toDay = parseInt($('#to-day').value, 10) || null;

    // Validate month range
    if (fromMonth && (fromMonth < 1 || fromMonth > srcCal.monthCount)) {
      showError(t.errInvalidMonth, $('#from-month')); return;
    }
    if (toMonth && (toMonth < 1 || toMonth > srcCal.monthCount)) {
      showError(t.errInvalidMonth, $('#to-month')); return;
    }

    // Validate day
    if (fromDay && fromMonth) {
      const maxDay = srcCal.monthLength(fromYear, fromMonth);
      if (fromDay < 1 || fromDay > maxDay) {
        showError(t.errInvalidDay, $('#from-day')); return;
      }
    }

    const hasTo = toYear || toMonth || toDay;

    if (hasTo) {
      const startY = fromYear;
      const startM = fromMonth || 1;
      const startD = fromDay || 1;
      const endY = toYear || fromYear;
      const endM = toMonth || (toYear ? srcCal.monthCount : (fromMonth || srcCal.monthCount));
      const endD = toDay || srcCal.monthLength(endY, endM);
      convertRange(srcCal, tgtCal, startY, startM, startD, endY, endM, endD, t);
    } else if (fromDay && fromMonth) {
      convertDate(srcCal, tgtCal, fromYear, fromMonth, fromDay, t);
    } else if (fromMonth) {
      const startD = 1;
      const endD = srcCal.monthLength(fromYear, fromMonth);
      convertRange(srcCal, tgtCal, fromYear, fromMonth, startD, fromYear, fromMonth, endD, t);
    } else {
      convertYearRange(srcCal, tgtCal, fromYear, t);
    }
  }

  function convertDate(src, tgt, y, m, d, t) {
    const jd = src.toJD(y, m, d);
    const result = tgt.fromJD(jd);
    const dow = Cal.getDayOfWeek(jd);
    const srcNames = src.monthNames(t);
    const tgtNames = tgt.monthNames(t);

    showResult([
      el('p', { class: 'result-label', text: t.calendars[src.id] }),
      el('p', { class: 'result-secondary', text: d + ' ' + srcNames[m - 1] + ' ' + y }),
      el('p', { class: 'result-label', text: t.calendars[tgt.id] }),
      el('p', { class: 'result-main', text: result.day + ' ' + tgtNames[result.month - 1] + ' ' + result.year }),
      el('p', { class: 'result-secondary', text: t.weekdays[dow] }),
      buildMeta([[t.jdn, String(jd)]])
    ]);
  }

  function convertRange(src, tgt, y1, m1, d1, y2, m2, d2, t) {
    const jdStart = src.toJD(y1, m1, d1);
    const jdEnd = src.toJD(y2, m2, d2);
    const startResult = tgt.fromJD(jdStart);
    const endResult = tgt.fromJD(jdEnd);
    const srcNames = src.monthNames(t);
    const tgtNames = tgt.monthNames(t);

    const srcStartStr = d1 + ' ' + srcNames[m1 - 1] + ' ' + y1;
    const srcEndStr = d2 + ' ' + srcNames[m2 - 1] + ' ' + y2;
    const tgtStartStr = startResult.day + ' ' + tgtNames[startResult.month - 1] + ' ' + startResult.year;
    const tgtEndStr = endResult.day + ' ' + tgtNames[endResult.month - 1] + ' ' + endResult.year;

    const overlapping = [];
    let oy = startResult.year, om = startResult.month;
    while (oy < endResult.year || (oy === endResult.year && om <= endResult.month)) {
      overlapping.push({ year: oy, month: om, days: tgt.monthLength(oy, om) });
      om++;
      if (om > tgt.monthCount) { om = 1; oy++; }
    }

    showResult([
      el('p', { class: 'result-label', text: t.calendars[src.id] }),
      el('p', { class: 'result-secondary', text: srcStartStr + ' \u2013 ' + srcEndStr }),
      el('p', { class: 'result-label', text: t.calendars[tgt.id] }),
      el('p', { class: 'result-span' },
        el('span', { class: 'date-val', text: tgtStartStr }),
        ' \u2013 ',
        el('span', { class: 'date-val', text: tgtEndStr })
      ),
      el('p', { class: 'result-label', text: t.monthBreakdown }),
      buildOverlapTable(overlapping, tgt, t),
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

    showResult([
      el('p', { class: 'result-label', text: year + ' ' + srcLabel }),
      yearInfo,
      el('p', { class: 'result-span' },
        el('span', { class: 'date-val', text: tgtStartStr }), ' \u2013 ',
        el('span', { class: 'date-val', text: tgtEndStr })
      ),
      el('p', { class: 'result-label', text: t.monthBreakdown }),
      table,
      buildMeta([[t.jdn, jdStart + ' \u2013 ' + jdEnd]])
    ]);
  }

  // ---- Helpers ----

  function buildOverlapTable(overlapping, cal, t) {
    const names = cal.monthNames(t);
    const table = el('table', { class: 'year-table' });
    table.appendChild(el('thead', null, el('tr', null,
      el('th', { text: t.calendars[cal.id] }), el('th', { text: t.totalDays })
    )));
    const tbody = el('tbody');
    overlapping.forEach(o => {
      tbody.appendChild(el('tr', null,
        el('td', { class: 'month-name', text: names[o.month - 1] + ' ' + o.year }),
        el('td', { text: String(o.days) })
      ));
    });
    table.appendChild(tbody);
    return table;
  }

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
    resultPanel.classList.add('has-result');
  }

  // ---- Events ----

  langSwitcher.addEventListener('click', e => {
    const btn = e.target.closest('.lang-btn');
    if (!btn) return;
    setLang(btn.dataset.lang);
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
})();

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is kalkal

A multi-calendar date converter web app. Converts between 20 calendar systems (Hijri, Gregorian, Julian, Coptic, Ethiopian, Solar Hijri, Byzantine, Syriac, Egyptian, Armenian, and more) using Julian Day Number (JDN) as the universal intermediary. Supports 4 languages (EN, PL, AR with RTL, EO) and ISO 233 transliteration for Arabic month names.

## Running

Zero dependencies, zero build step. Open `index.html` in a browser or:
```bash
python3 -m http.server 8000
```

## Running Tests

```bash
node tests/verify.js                # Basic conversion output
node tests/cross-verify.js          # Cross-verification against Fourmilab, Intl, Python hijri-converter
node tests/verify-all-calendars.js  # Round-trips, known dates, cross-calendar consistency for ALL calendars
```

Tests run in Node.js by loading the browser-targeted Cal IIFE. No test framework — just console output with pass/fail counts.

## Architecture

All conversion flows through JDN: `SourceCalendar → JD → TargetCalendar`.

- **`js/hijri.js`** — Core `Cal` object (global IIFE). Contains ALL calendar conversion algorithms: `*ToJD()` and `jdTo*()` for every supported calendar, plus leap year, month length, day-of-week, and zodiac helpers. This is the computational engine — everything else depends on it.
- **`js/i18n.js`** — `I18N` object with translations for all 4 languages. Calendar names, month names (including ISO 233 transliterated Hijri months), UI strings, error messages.
- **`js/app.js`** — UI logic. The `CALENDARS` registry maps each calendar ID to its `Cal.*` functions. Handles autocomplete, variant selection (4 Hijri tabular variants: IIc/Wüstenfeld default, IIa/Kuwaiti, IIIa/West civil, IVa/Ḥabash), form validation, and result rendering. Single-page IIFE.
- **`js/astronomy.js`** — `Astronomy` object. Moon phase calculation (Meeus algorithm) and curated historical astronomical events (comets, supernovae, conjunctions) with JDN lookup.
- **`js/eclipses.js`** — `Eclipses` object. Solar eclipse lookup by JDN for Middle East region (1–1500 CE), shown in date conversion results.
- **`js/ai.js`** — Optional Gemini Flash integration for natural language date queries (requires user-provided API key in localStorage).
- **`js/pages.js`** — i18n and shared logic for subpages (`calendars.html`, `methodology.html`).

## Key Concepts

- **Hijri variants**: The 4 tabular variants differ only in which years of the 30-year cycle are leap. IIc (Wüstenfeld) is the default for historiographic use. IIa matches `Intl.DateTimeFormat`'s `islamic-civil`.
- **Julian/Gregorian cutover**: Dates before Oct 15, 1582 use Julian calendar. JD 2299160.5 is the cutover point.
- **Epoch**: All Hijri variants share epoch JD 1948439.5 (16 Jul 622 CE Julian = 1 Muharram 1 AH).
- **13-month calendars**: Coptic, Ethiopian, Yazdgerdi, Armenian, and Egyptian have 13 months (12 x 30 + 5/6 epagomenal days).

## Adding a New Calendar

1. Add `*ToJD()`, `jdTo*()`, month length, year length, and leap year functions to `Cal` in `js/hijri.js`
2. Add a calendar entry in the `CALENDARS` registry in `js/app.js`
3. Add month names and calendar display name to all 4 languages in `js/i18n.js`
4. Add calendar description to `js/pages.js` for the Calendars subpage
5. Add test cases (known scholarly dates, round-trips) to `tests/verify-all-calendars.js`

## Fonts

- **Charis SIL** — ISO 233 transliteration characters
- **Amiri** — Arabic naskh script
- **Noto Sans / Noto Sans Mono** — UI text

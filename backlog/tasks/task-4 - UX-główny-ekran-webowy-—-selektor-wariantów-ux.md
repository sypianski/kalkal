---
id: TASK-4
title: 'UX: główny ekran webowy — selektor wariantów (/ux)'
status: Done
assignee: []
created_date: '2026-10-24 09:24'
updated_date: '2026-10-24 09:52'
labels:
  - ux
  - web
dependencies: []
priority: high
ordinal: 4000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Selektor wariantów per sekcja dla index.html + js/app.js (artefakt, wybór w db, potem wdrożenie). Punkt wyjścia: uwagi z TODO.md (marginesy menu, pusta historia, boks „To”, rozdzielenie boksów prawej kolumny, Month breakdown pod Copy). Pamiętaj: zmiany silnika lustrzanie w Flutter/Alfred; bump CACHE_VERSION w sw.js.
<!-- SECTION:DESCRIPTION:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Artefakt selektora: https://claude.ai/artifact/VRAQkgbHfdLt7W8DzTnagd (db: wybor/kalkal-web). Czeka na wybór usera; po nim wdrożenie w index.html / js/app.js / css/style.css (+ bump CACHE_VERSION w sw.js).

Wdrożone w commitach c607c53, 7fe8f4c, 3bde2e7, 6b2bed5 i ostatnim (zakładki). Weryfikacja: zrzuty Playwright 1360 px i 390 px, brak błędów w konsoli, testy silnika 110/110. Nie pushowano (push = deploy). Martwy CSS .copy-box*/.copy-card zostawiony (do sprzątnięcia). Flutter (TASK-1) dostanie te same zmiany osobno.
<!-- SECTION:NOTES:END -->

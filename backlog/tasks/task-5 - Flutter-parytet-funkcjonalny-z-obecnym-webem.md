---
id: TASK-5
title: 'Flutter: parytet funkcjonalny z obecnym webem'
status: Done
assignee: []
created_date: '2026-10-24 10:45'
updated_date: '2026-10-24 11:46'
labels:
  - flutter
  - parity
dependencies: []
ordinal: 5000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Doprowadzić flutter_app/ do parytetu z webem (112 commitów w js/css/index.html od portu f8f9029). Bez zmian wyglądu — tylko funkcje i treść: wyniki (grupowanie, tagi kalendarzy, trzy przyciski kopiowania, month breakdown pod copy), astronomia i zaćmienia osobno, strony (kalendarze/metodologia/dynastie/zaćmienia/o programie/ustawienia), puste stany. Silnik: zsynchronizować js/hijri.js ↔ cal.dart. Dopiero po tym TASK-1 (/ux na widoku mobilnym).
<!-- SECTION:DESCRIPTION:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Parytet Fluttera z webem wdrożony lokalnie w 3 commitach: 918dfff (A: tagi kalendarzy, bridge-eq, trzy przyciski kopiowania, numerowane kroki, i18n toLabel/introStep1-3), 45759f3 (B: układ szeroki od 601 px — nagłówek, karta formularza, komórka To, zakładki: inne kalendarze / astro / rozbicie miesięcy / historia; contextualRows), 7b38ab9 (C: Ustawienia jako lista radio z opisami i przykładem Hijri, Kalendarze i Metodologia ze spisem treści). Silnik bez zmian od portu (hijri.js/astronomy/eclipses). Testy: flutter test 25/25, dart analyze bez błędów; zrzuty ze skryptu testowego 390 i 1360 px. Nie zrobione: podświetlanie aktywnej pozycji spisu (IntersectionObserver), tłumaczenia arabskie nowych kluczy (fallback EN), build webowy beta/ i push. Dalej: TASK-1 (/ux na widoku mobilnym).
<!-- SECTION:NOTES:END -->

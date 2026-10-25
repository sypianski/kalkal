---
id: TASK-14
title: >-
  Yazdgerdi: brak nazwy 13. miesiąca (dni epagomenalne) — RangeError w Flutter,
  'undefined' w webie
status: To Do
assignee: []
created_date: '2026-10-24 15:06'
labels:
  - flutter
  - bug
dependencies: []
ordinal: 14000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Yazdgerdi (warianty Shahenshahi/Qadimi/Fasli) ma 13 miesięcy, ale używa listy persianMonths z 12 nazwami. Flutter: contextualRows (lib/logic/convert.dart ~779) rzuca RangeError (index 12), gdy data lub koniec zakresu wypada w dniach epagomenalnych (np. konwersja samego roku 656 AH → panel Other); web: js/app.js buildContextualPanel pokazuje 'undefined'. Wymaga decyzji merytorycznej: nazwa 13. miesiąca (Andargāh / Gāthā / Panje?) we wszystkich językach (EN/PL/EO + AR w Flutter) oraz dopisania do monthNames dla yazdgerdi. Wykryte przy robieniu zrzutów do App Store (2026-10-24). Poprawka wymaga lustra: js/i18n.js + js/app.js + flutter_app lib/i18n + lib/engine/registry.dart + alfred/cal-engine.js.
<!-- SECTION:DESCRIPTION:END -->

## Notatka (2026-10-24, po zrzutach)

Skutek poważniejszy niż samo `RangeError`: wyjątek leci w `setState` (`ConverterScreenState._setOut` → `contextualRows`), więc `markNeedsBuild` się nie wykonuje i UI **w ogóle się nie odświeża** — użytkownik po konwersji całego roku 656 AH (koniec zakresu w dniach epagomenalnych Yazdgerdi) nie widzi wyniku. Wystąpienie rzadkie (okno 5 dni, kilka % lat), ale realne. Doraźna łatka (przed ustaleniem nazwy miesiąca): w `contextualRows` pominąć wiersz, gdy `r.month > names.length` (lub `e.month`), zamiast rzucać. Do rozstrzygnięcia: czy łatać przed pierwszym wydaniem w App Store.

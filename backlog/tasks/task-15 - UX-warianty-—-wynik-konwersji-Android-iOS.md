---
id: TASK-15
title: 'UX: warianty — wynik konwersji (Android/iOS)'
status: Done
assignee: []
created_date: '2026-10-25 19:01'
updated_date: '2026-10-25 19:01'
labels:
  - ux
  - flutter
dependencies: []
ordinal: 15000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Selektor wariantów dla ekranu wyniku konwersji we Flutterze (telefon). Pliki: flutter_app/lib/ui/result_widgets.dart, converter_screen.dart. Selektor: https://claude.ai/artifact/7svjuLUHYStzPU648wdQMq (doc wybor/kalkal-wynik). Powiązane: TASK-1.
<!-- SECTION:DESCRIPTION:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Wdrożono wybór z selektora (wybor/kalkal-wynik, zatwierdzony): pasek OD/Zmień (krótka nazwa celu, przycisk sygnałowy 44 px), data w dwóch liniach z czarnym znacznikiem kalendarza, zakres roku z drugą datą wyrównaną do lewej, jeden przycisk Kopiuj + arkusz Kopiuj jako, warianty hidżry pod datą z podpisem, zakładki 48 px z Inne pierwszą, kafle 2x3 w Inne (naprawa łamania dat), miesiące z rokiem jako nagłówkiem grupy. Tylko układ telefonu (<601 px); szeroki układ bez zmian. Silnik JS/Alfred bez zmian. Testy: flutter test 35 OK. Nie sprawdzono na urządzeniu; tłumaczenia ar/eo nowych kluczy (copy, copyAs, fmt*) do weryfikacji.
<!-- SECTION:NOTES:END -->

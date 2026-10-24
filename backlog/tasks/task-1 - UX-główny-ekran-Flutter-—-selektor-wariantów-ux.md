---
id: TASK-1
title: 'UX: główny ekran Flutter — selektor wariantów (/ux)'
status: Done
assignee: []
created_date: '2026-10-24 09:24'
updated_date: '2026-10-24 12:09'
labels:
  - ux
  - flutter
dependencies: []
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Selektor wariantów dla flutter_app/lib/ui (konwerter, wyniki, dolna nawigacja). Po zatwierdzeniu wyboru ekranu webowego, żeby zachować spójność.
<!-- SECTION:DESCRIPTION:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Selektor: https://claude.ai/artifact/FAZGDbjYQypcd4TaXF2Fyt (doc wybor/kalkal-mobile). Wdrożono: formularz jako jedna karta z podpisami nad polami (bez numerów), przycisk sygnałowy, wynik u góry ze zwiniętym formularzem (pasek Zmień), zakładki Astro/Inne/Miesiące/Historia, stan pusty = trzy kroki, nawigacja Material z arkuszem Więcej, Ostatnio użyte w wyborze kalendarza (prefs kalkal-recent-cals), ustawienia jako wiersze z arkuszem. Commity d823c09, 4894e23. Nie sprawdzono na urządzeniu ani w flutter build web; tłumaczenie ar dla toLabel nadal brak.
<!-- SECTION:NOTES:END -->

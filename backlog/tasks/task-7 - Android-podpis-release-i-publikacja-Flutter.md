---
id: TASK-7
title: 'Android: podpis release i publikacja (Flutter)'
status: To Do
assignee: []
created_date: '2026-10-24 10:45'
updated_date: '2026-10-24 13:12'
labels:
  - flutter
  - android
dependencies: []
ordinal: 7000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
build.gradle.kts używa dziś podpisu debug (TODO). Dodać keystore + key.properties (poza repo, sekrety w 1Password vault robot), podpisany AAB/APK, wersjonowanie (podbicie wersji jako krok 1), wgranie przez skill playstore, kopia do ~/apps/ przez sforna. applicationId app.sypianski.kalkal.
<!-- SECTION:DESCRIPTION:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-10-24: web zostaje w HTML, Flutter tylko iOS/Android. Pierwsze wydanie ma zawierać UX telefonu (TASK-1) i strony wzorowane na webie (commity d823c09..665ff12). Najpierw bump wersji.
<!-- SECTION:NOTES:END -->

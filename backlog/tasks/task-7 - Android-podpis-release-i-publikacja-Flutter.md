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

2026-10-24 (wykonane): wersja 1.0.4+6; keystore ~/.android/kalkal-release.jks (alias kalkal), hasło + plik .jks w 1Password robot ("kalkal Play Store Keystore"); key.properties gitignored; build.gradle.kts podpisuje release (fallback na debug bez key.properties); AAB i APK arm64 zweryfikowane (odcisk SHA256 zgodny); APK w ~/apps/kalkal/. Play Console: apka app.sypianski.kalkal utworzona jako draft (app id 4975370072393064220, konto 5891741574663739576). AAB 1.0.4+6 (versionCode 6) wgrany na tor internal jako draft. Zostaje: deklaracje App content i listing wg console-procedure.md.

2026-10-24 (Play Console): wszystkie 10 deklaracji App content zapisane (polityka https://kalkal.online/privacy.html, reklamy: nie, logowanie: nie, Ad ID: nie, rządowa: nie, grupa 18+, Data safety: brak zbieranych danych, zdrowie/finanse: brak, IARC: All Other App Types, 9x No). Zostaje: store listing (ikona 512, feature graphic 1024x500, min. 2 zrzuty telefonu, opisy), store settings (kategoria, kontakt dev@sypian.ski), Send for review.
<!-- SECTION:NOTES:END -->

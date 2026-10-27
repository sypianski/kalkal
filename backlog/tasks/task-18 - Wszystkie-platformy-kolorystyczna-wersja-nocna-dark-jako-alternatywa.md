---
id: TASK-18
title: 'Wszystkie platformy: kolorystyczna wersja nocna (dark) jako alternatywa'
status: In Progress
assignee: []
created_date: '2026-10-26 16:49'
updated_date: '2026-10-26 16:51'
labels:
  - ux
dependencies: []
ordinal: 18000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Dziś kalkal ma jedną paletę (jasny brutalizm: #f0f0ec / #fff / #000, sygnał #1b3dff) oraz tryb e-ink (czerń na bieli, TASK-17). Brak jakiejkolwiek wersji nocnej — w kodzie nie ma ani jednego `prefers-color-scheme`. Potrzebny kolorowy motyw nocny jako alternatywa na wszystkich aktywnych platformach.

Zakres platform:
- Web (index.html + podstrony: calendars/methodology/dynasties/eclipses/about/settings, maps/): tokeny w `:root` w css/style.css (~430 literałów kolorów w pliku), nowy `html[data-theme="night"]`.
- Flutter iOS/Android: `lib/ui/tokens.dart` ma kolory jako `const` (kBg, kSurface, kInk*, kShadow, kSignal…, ~220 użyć w lib/ui) — motyw wymaga zamiany na tokeny zależne od motywu (ThemeExtension / kontekst), nie samego `ThemeData.dark()`.
- Alfred: bez zmian (UI rysuje Alfred, kolory systemowe) — odnotować jako N/A. mobile/ (Expo) przestarzałe — poza zakresem.

Założenia projektowe do potwierdzenia (/ux):
- Motyw to OSOBNA oś od trybu wyświetlania: Auto (systemowy) / Jasny / Nocny, klucz `kalkal-theme`, obok istniejącego `kalkal-display`. E-ink zawsze wygrywa i wymusza jasny (czerń na bieli).
- „Kolorystyczna” = nie goła inwersja: zachować brutalistyczny charakter (grube ramki, twarde cienie bez rozmycia), ale z własną paletą nocną i kolorem sygnałowym o kontraście dobranym do ciemnego tła (#1b3dff na ciemnym nie przejdzie WCAG). Twardy cień #242220 na ciemnym tle jest niewidoczny — potrzebny jasny/akcentowy cień.
- Przejrzeć miejsca z zaszytą ciemnością: plansza zaćmień („dark slab”), nagłówek, mapy zaćmień w maps/ (HTML z NASA), obrazek/ikona apki.

Pułapki wdrożeniowe:
- Web: ustawić `data-theme` w <head> inline-skryptem przed renderem (bez błysku jasnego motywu), zsynchronizować `<meta name="theme-color">`, dodać `color-scheme`.
- Web: zmiana CSS/JS → podbić `CACHE_VERSION` w sw.js (+ `?v=` przy css w index.html/settings.html).
- Nowe napisy w Ustawieniach (Auto/Jasny/Nocny) dodać do js/i18n.js (EN/PL/EO) i przegenerować Dart: `node tools/gen_i18n_dart.js` / `gen_pages_i18n_dart.js`.
- Flutter: wersja tylko w pubspec.yaml; zrzuty App Store (integration_test/screenshot_test.dart) zostają w jasnym.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Web: Ustawienia mają wybór Auto/Jasny/Nocny; Auto podąża za prefers-color-scheme; wybór zapamiętany (kalkal-theme)
- [ ] #2 Web: wszystkie strony (konwerter, podstrony, mapy zaćmień) czytelne w trybie nocnym; kontrast tekstu i elementów klikalnych ≥ WCAG AA; brak błysku jasnego motywu przy ładowaniu
- [ ] #3 Web: e-ink wymusza jasny motyw niezależnie od wyboru; sw.js CACHE_VERSION podbity
- [ ] #4 Flutter: te same trzy tryby w Ustawieniach, tokeny kolorów zależne od motywu (bez const kolorów w widokach), wygląd 1:1 z webem
- [ ] #5 Flutter: status bar / nawigacja systemowa dopasowane do motywu; testy (flutter test) przechodzą, w tym phone_ui_test w obu motywach
- [ ] #6 Nowe stringi w EN/PL/EO, Dart i18n przegenerowany; Alfred odnotowany jako N/A
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. /ux wewnątrz ticketu: selektor wariantów palety nocnej (2–4 warianty koloru tła/powierzchni/sygnału/cienia + podgląd na ekranie konwertera i wyniku); wybór zapisuje user w artefakcie.
2. Web: tokeny `html[data-theme="night"]` w css/style.css wg wybranego wariantu, inline-skrypt w <head>, wybór w Ustawieniach, theme-color, podstrony i maps/, podbicie sw.js CACHE_VERSION.
3. Flutter: tokeny zależne od motywu (ThemeExtension), Prefs `kalkal-theme`, wybór w Ustawieniach, status bar, testy w obu motywach.
4. i18n EN/PL/EO + regeneracja Dart; Alfred N/A.
<!-- SECTION:PLAN:END -->

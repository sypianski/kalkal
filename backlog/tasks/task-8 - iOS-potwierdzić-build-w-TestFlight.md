---
id: TASK-8
title: 'iOS: potwierdzić build w TestFlight'
status: Done
assignee: []
created_date: '2026-10-24 10:45'
updated_date: '2026-10-24 14:23'
labels:
  - flutter
  - ios
dependencies: []
ordinal: 8000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Sprawdzić przez ssh mac / App Store Connect, czy build 1.0.0+2 jest wgrany. Jeśli nie — fastlane beta (lane bump → build → upload). Wysłanie do App Review tylko za zgodą usera.
<!-- SECTION:DESCRIPTION:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-10-24: j.w. — build ma zawierać UX telefonu (TASK-1) i parytet (TASK-5). Build przez ssh mac, bump wersji najpierw.

2026-10-24 (sprawdzenie przez ASC API z Maca, tylko odczyt): w App Store Connect NIE MA rekordu apki `app.sypianski.kalkal` (są tylko Kanaletto, Kazimirski, Vaporetti) — żadnego builda w TestFlight, 1.0.0+2 też nie. Bundle ID jest zarejestrowany w Developer Portal. Blokery przed `fastlane ios beta`: (1) user zakłada rekord apki ręcznie (appstoreconnect.apple.com → Apps → + → New App; API tego nie umie); (2) kopia na Macu (~/projekti/kalkal, 1.0.0+3, 3 X, bez .git) jest przestarzała — rsync z VPS (1.0.3+5) przed buildem; (3) upload do TestFlight tylko po wyraźnym OK (Publish Gate). Bump wersji: lane `beta` robi go sam (→ 1.0.3+6).
2026-10-24 (później): rekord apki założony przez retumilo w ASC — „Kalkal – Calendar Converter" (nazwa „Kalkal" zajęta), en-US, bundle app.sypianski.kalkal, SKU kalkal, ASC ID 6826583198. Bloker (1) zdjęty. Uwaga: baner „Apple Developer Program License Agreement Updated" — Account Holder musi zaakceptować umowę, inaczej upload/submit może być blokowany. Zostają: rsync na Maca + `fastlane ios beta` po OK usera.
2026-10-24 (wieczór): ręczne próby buildu zrzuciły się (stary keychain.sh bez `guard`, brak hasła keychaina, zerwane ssh) i zrezygnowano z buildu w dzień — zadanie przeniesione do nokte: `~/utensili/nokte/taski/024-kalkal-testflight.sh` (02:00; rsync → `fastlane ios beta` z nice 19 + caffeinate; hasło keychaina z 1Password `pomeldonu-build-keychain` przez stdin; po sukcesie wersja wraca do pubspec na VPS). Zgoda usera na upload do TestFlight: 2026-10-24. Do zamknięcia TASK-8: rano sprawdzić WYNIK w `diari/` i build w TestFlight. Naprawione 2026-10-24: do wspólnego `~/.config/pomeldonu/keychain.sh` na Macu dopisano `guard` (= `restore`; kopia: keychain.sh.bak-2026-10-24), nakładka z /tmp usunięta.
2026-10-24 16:22: GOTOWE — build 1.0.4 (7) wgrany do TestFlight i przetworzony przez Apple (app_id 6826583198), rozesłany do testerów wewnętrznych. Wysłany ręcznie przez zadanie nokte 024 (zgoda usera); w kolejce nocnej oznaczone `.preta`, żeby nie wgrało duplikatu. Wersja w pubspec VPS = 1.0.4+7. Nie wysyłano do App Review.
<!-- SECTION:NOTES:END -->

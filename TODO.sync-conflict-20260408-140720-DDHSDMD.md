## Web
- [ ] Add more calendar systems (French Republican, etc. if missing)
- [ ] Improve mobile UX based on recent layout changes
- [ ] Expand test coverage for edge cases (leap years, era boundaries)
- [ ] Add historical event annotations to date results
- [ ] Optimize service worker caching strategy
- [ ] Complete eclipse data integration for broader date ranges

## Mobile app (parity with web)
- [x] Multi-language support (PL, AR with RTL via I18nManager, EO) — currently EN only
- [x] Astro section as collapsible tile (matching web `33aa97f`)
- [x] Unified tile system for contextual / out-of-era calendars in results (`a3e221d`, `612f929`)
- [x] Variant switching from results screen (`5013f4c`)
- [x] Pre-filled target calendar + Astro button in results
- [x] Group calendars by cultural sphere in picker (`0e94654`)
- [x] Verify Parker & Dubberstein Babylonian tables present in `mobile/src/engine/cal.js`
- [x] Verify Human Era variants present

## Changes to the Android app. 
Zmieńmy zupełnie logikę aplikacji. 

### Ekran początkowy
Pole wyboru kalendarza (lista rozwijana), domyślnie wybrana hijra.
Pole wpisania roku z klawiatury apki (nie systemowej)
Przycisk OK/wyszukania kalendarza -> wysyła do ekranu konwersji
Na dole mało widoczny przycisk Informacje -> odsyła do ekranu informacji

### Ekran konwersji
Na górze wybrane kalendarze Z i NA wraz z wynikami konwersji i możliwością zmiany kalendarzy (lista rozwijana)
Możliwość wybrania miesiąca
Możliwość wpisania daty (z klawiatury apki)
Na dole mało widoczny przycisk Informacje -> odsyła do ekranu informacji

## Ekran informacji
Tutaj informacje o kalendarzach, metodologia itd.
W osobnych zakładkach
Oraz przycisk powrotu do ekranu początkowego
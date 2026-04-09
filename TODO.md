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

## Changes to the Android app (rebuild per new TODO logic)
- [x] Start screen: calendar picker (default Hijri), custom NumPad, OK → Converter, Info button
- [x] Rebuild ConverterScreen: FROM/TO dropdowns with live results on top, month grid, custom in-app numeric keypad (no system keyboard), muted Information button at the bottom
- [x] ConverterScreen: NumPad hidden by default, appears only when user taps year or day field (Done button to dismiss)
- [x] ConverterScreen: Month picker changed from 3-column grid to vertical list (one row per month)
- [x] ConverterScreen: Selector order changed to year → month → day
- [x] Info screen with tabbed layout (Calendars & Methodology + back button to Converter)
- [x] use /frontend-desing to improve the general design
- [x] don't use yellow
- [x] Restore / relocate language + theme toggles — added as Settings tab in InfoScreen
- [x] Restore / relocate history, Astro tile, and contextual/out-of-era calendar panels — collapsible Tiles in scrollable result area of ConverterScreen
- [ ] Verify custom keypad layout on small screens (keypad is bottom-pinned; top section scrolls)
- [ ] Localize keypad labels if needed (C / ⌫ currently symbolic, works across languages)
- [ ] Start screen: persist last-used calendar in AsyncStorage
- [ ] Manual test on device: live conversion, variant switching, month grid for 13-month calendars (Coptic, Ethiopian, Armenian, etc.)

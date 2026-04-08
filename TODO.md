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
- [x] Start screen: calendar picker (default Hijri), custom NumPad, OK → Converter, Info button (branch: android/start-screen)

## Mobile app (next steps)
- [ ] ConverterScreen: consider hiding system keyboard triggers entirely (current input page still has TextInput for month/day — swap to NumPad or picker)
- [ ] InfoScreen: expand with calendar-by-calendar descriptions (reuse CalendarsScreen content)
- [ ] Start screen: persist last-used calendar in AsyncStorage
- [ ] Test start screen UX on physical device / Expo Go

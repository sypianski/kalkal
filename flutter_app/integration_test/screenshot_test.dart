// Captures App Store screenshots (phone layout < 601 px and wide/iPad layout).
// Run via `flutter drive` on a simulator, once per device:
//   flutter drive --driver=test_driver/integration_test.dart \
//     --target=integration_test/screenshot_test.dart -d <simulator>
// Files land in screenshots_out/ (see test_driver/integration_test.dart).

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:kalkal/engine/registry.dart';
import 'package:kalkal/i18n/i18n.dart';
import 'package:kalkal/i18n/mobile_i18n.dart';
import 'package:kalkal/main.dart' as app;
import 'package:kalkal/ui/tokens.dart';
import 'package:kalkal/ui/widgets.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  final binding = IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  // pumpAndSettle can hang on animations, so pump in fixed slices.
  Future<void> settle(WidgetTester tester, [double seconds = 1]) async {
    final slices = (seconds * 5).round();
    for (var i = 0; i < slices; i++) {
      await tester.pump(const Duration(milliseconds: 200));
    }
  }

  // Labels may be rendered as typed or upper-cased; accept either.
  Finder label(String s) {
    final exact = find.text(s);
    return exact.evaluate().isNotEmpty ? exact : find.text(s.toUpperCase());
  }

  // Phone has ConvertButton; the wide layout has its own private button.
  Finder convertBtn() {
    final c = find.byType(ConvertButton);
    return c.evaluate().isNotEmpty ? c : label(I18n.t('en', 'convert')).first;
  }

  testWidgets('capture App Store screenshots', (tester) async {
    final sp = await SharedPreferences.getInstance();
    await sp.clear();
    await sp.setString('kalkal-lang', 'en');

    await app.main();
    await settle(tester, 2);

    final view = tester.view;
    final wide =
        view.physicalSize.width / view.devicePixelRatio >= kWideBreakpoint;
    await binding.takeScreenshot('01_home');

    // Full date in one go: 7 Safar 657 AH (year, month picker, day, Convert).
    await tester.enterText(find.byType(TextField).first, '657');
    await settle(tester);
    if (wide) {
      // The wide layout reveals the month field only after a first Convert.
      // That whole-year convert hits the known Yazdgerdi RangeError (TASK-14),
      // which is swallowed here so the test can continue.
      await tester.tap(convertBtn());
      await settle(tester, 1.5);
      tester.takeException();
    }
    await tester.tap(find.text('—').first);
    await settle(tester);
    final safar = kWebCalendars['hijri']!.monthNames('en')[1];
    await tester.tap(find.text(safar).last);
    await settle(tester);
    await tester.enterText(find.byType(TextField).at(1), '7');
    await tester.tap(convertBtn());
    await settle(tester, 1.5);
    FocusManager.instance.primaryFocus?.unfocus();
    await settle(tester);
    await binding.takeScreenshot('02_date');

    // Second tab of the tile box. Phone: "Other" (Astro is the default tab);
    // wide layout: "Astro" ("Other contemporaneous calendars" is the default).
    final other = wide
        ? label(I18n.t('en', 'astroLabel'))
        : label(MobileI18n.t('en', 'tabOther'));
    if (other.evaluate().isNotEmpty) {
      await tester.ensureVisible(other.first);
      await settle(tester);
      await tester.tap(other.first);
      await settle(tester);
    }
    await binding.takeScreenshot('03_other');

    // Calendars page via the navigation (bottom bar on the phone, rail on iPad).
    final nav = label(I18n.t('en', 'navCalendars'));
    await tester.tap(nav.last);
    await settle(tester, 2);
    await binding.takeScreenshot('04_calendars');
    // ignore: avoid_print
    print('screenshots done (wide=$wide)');
  });
}

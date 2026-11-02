// A slow, watchable walkthrough used only to record an App Review demo video.
// Run on a simulator while recording:
//   xcrun simctl io booted recordVideo kalkal-demo.mov &
//   flutter drive --driver=test_driver/integration_test.dart \
//     --target=integration_test/demo_test.dart -d <simulator>
// No screenshots; the recording is made by simctl, not by the test.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:kalkal/engine/registry.dart';
import 'package:kalkal/i18n/i18n.dart';
import 'package:kalkal/i18n/mobile_i18n.dart';
import 'package:kalkal/main.dart' as app;
import 'package:kalkal/ui/widgets.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  // pumpAndSettle can hang on animations, so pump in fixed slices.
  Future<void> hold(WidgetTester t, double seconds) async {
    final slices = (seconds * 5).round();
    for (var i = 0; i < slices; i++) {
      await t.pump(const Duration(milliseconds: 200));
    }
  }

  // Labels may be rendered as typed or upper-cased; accept either.
  Finder label(String s) {
    final exact = find.text(s);
    return exact.evaluate().isNotEmpty ? exact : find.text(s.toUpperCase());
  }

  Future<void> tapIf(WidgetTester t, Finder f, [double after = 2]) async {
    if (f.evaluate().isEmpty) return;
    await t.ensureVisible(f.first);
    await hold(t, 0.5);
    await t.tap(f.first);
    await hold(t, after);
  }

  testWidgets('demo walkthrough', (tester) async {
    final sp = await SharedPreferences.getInstance();
    await sp.clear();
    await sp.setString('kalkal-lang', 'en');

    await app.main();
    await hold(tester, 3);

    // Converter: 7 Safar 657 AH (year, month picker, day, Convert).
    await tester.enterText(find.byType(TextField).first, '657');
    await hold(tester, 2);
    await tester.tap(find.text('—').first);
    await hold(tester, 2);
    final safar = kWebCalendars['hijri']!.monthNames('en')[1];
    await tester.tap(find.text(safar).last);
    await hold(tester, 2);
    await tester.enterText(find.byType(TextField).at(1), '7');
    await hold(tester, 1.5);
    final convert = find.byType(ConvertButton);
    await tester.tap(
        convert.evaluate().isNotEmpty ? convert : label(I18n.t('en', 'convert')).first);
    await hold(tester, 3);
    FocusManager.instance.primaryFocus?.unfocus();
    await hold(tester, 3);

    // Second tab of the result box.
    await tapIf(tester, label(MobileI18n.t('en', 'tabOther')), 4);

    // Calendars page.
    await tapIf(tester, label(I18n.t('en', 'navCalendars')).last, 4);

    // Settings (under "More" on the phone): switch language and back.
    await tapIf(tester, label(MobileI18n.t('en', 'more')).last, 2);
    await tapIf(tester, label(I18n.t('en', 'settings')).last, 3);
    await tapIf(tester, find.text('PL — Polski'), 3);
    await tapIf(tester, find.text('EN — English'), 3);
  });
}

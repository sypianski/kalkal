// Captures App Store screenshots. Run via `flutter drive` on a simulator:
//   flutter drive --driver=test_driver/integration_test.dart \
//     --target=integration_test/screenshot_test.dart -d <simulator>

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:kalkal/engine/registry.dart';
import 'package:kalkal/main.dart' as app;
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

  testWidgets('capture App Store screenshots', (tester) async {
    final sp = await SharedPreferences.getInstance();
    await sp.clear();
    await sp.setString('kalkal-lang', 'en');

    await app.main();
    await settle(tester, 2);
    await binding.takeScreenshot('01_home');

    // Year only → whole-year range.
    await tester.enterText(find.byType(TextField).first, '656');
    await tester.tap(find.byType(ConvertButton));
    await settle(tester);

    // Refine to a full date: 7 Ṣafar 656 AH.
    final monthSlab = find.ancestor(
        of: find.text('03 • MONTH'), matching: find.byType(Slab));
    await tester.tap(
        find.descendant(of: monthSlab, matching: find.byType(InkWell)).first);
    await settle(tester);
    final safar = kWebCalendars['hijri']!.monthNames('en')[1];
    await tester.tap(find.text(safar).last);
    await settle(tester);
    await tester.enterText(find.byType(TextField).at(1), '7');
    await tester.testTextInput.receiveAction(TextInputAction.done);
    await settle(tester);
    FocusManager.instance.primaryFocus?.unfocus();
    await settle(tester);
    await binding.takeScreenshot('02_date');

    await tester.drag(find.byType(ListView).first, const Offset(0, -420));
    await settle(tester);
    final astro = find.text('ASTRO');
    if (astro.evaluate().isNotEmpty) {
      await tester.tap(astro.first);
      await settle(tester);
    }
    await binding.takeScreenshot('03_result');

    await tester.tap(find.text('▦'));
    await settle(tester, 2);
    await binding.takeScreenshot('04_calendars');
  });
}

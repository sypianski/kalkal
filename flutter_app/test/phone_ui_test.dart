// Phone layout (< 601 px) behaviour from the TASK-1 UX round.

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:kalkal/main.dart';
import 'package:kalkal/state/prefs.dart';

Future<void> boot(WidgetTester t, {Map<String, Object> prefs = const {}}) async {
  SharedPreferences.setMockInitialValues({'kalkal-lang': 'en', ...prefs});
  await Prefs.init();
  t.view.physicalSize = const Size(390, 844);
  t.view.devicePixelRatio = 1.0;
  addTearDown(t.view.reset);
  await t.pumpWidget(const KalkalApp());
  await t.pump(const Duration(milliseconds: 300));
}

void main() {
  testWidgets('convert folds the form into a strip, Change unfolds it',
      (t) async {
    await boot(t);
    expect(find.text('CONVERT'), findsOneWidget);
    await t.enterText(find.byType(TextField).first, '1445');
    await t.tap(find.text('CONVERT'));
    await t.pump(const Duration(milliseconds: 400));
    expect(find.text('CONVERT'), findsNothing);
    expect(find.textContaining('CHANGE'), findsOneWidget);
    await t.tap(find.textContaining('CHANGE'));
    await t.pump(const Duration(milliseconds: 400));
    expect(find.text('CONVERT'), findsOneWidget);
  });

  testWidgets('More tab opens a sheet that leads to Settings', (t) async {
    await boot(t);
    await t.tap(find.text('More'));
    await t.pumpAndSettle();
    expect(find.text('METHODOLOGY'), findsOneWidget);
    await t.tap(find.text('SETTINGS').last);
    await t.pumpAndSettle();
    // Settings on the phone: one row per variant group.
    expect(find.textContaining('HIJRI'), findsWidgets);
  });

  testWidgets('picked calendars show up under "Recent"', (t) async {
    await boot(t);
    expect(Prefs.instance.recentCals, isEmpty);
    await t.tap(find.text('Hijri').first);
    await t.pumpAndSettle();
    expect(find.text('RECENT'), findsNothing);
    await t.tap(find.text('Julian').last);
    await t.pumpAndSettle();
    expect(Prefs.instance.recentCals, ['julian']);
    await t.tap(find.text('Julian').first);
    await t.pumpAndSettle();
    expect(find.text('RECENT'), findsOneWidget);
  });

  test('recentCals keeps 3, newest first, no duplicates', () async {
    SharedPreferences.setMockInitialValues({});
    await Prefs.init();
    for (final id in ['coptic', 'hebrew', 'julian', 'coptic', 'hijri']) {
      Prefs.instance.pushRecentCal(id);
    }
    expect(Prefs.instance.recentCals, ['hijri', 'coptic', 'julian']);
  });
}

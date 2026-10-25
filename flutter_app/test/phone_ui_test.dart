// Phone layout (< 601 px) behaviour from the TASK-1 / TASK-15 / TASK-16 UX rounds.

import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
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
  testWidgets('convert folds the form into the result card, Change unfolds it',
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

  // TASK-15: result screen on the phone.
  String hist(Map<String, Object?> e) => jsonEncode([
        {'fromCal': 'hijri', 'toCal': 'gregorian', 'ts': 1, ...e}
      ]);

  Future<void> openFromHistory(WidgetTester t, String entryText) async {
    await t.tap(find.textContaining(entryText));
    await t.pump(const Duration(milliseconds: 500));
  }

  testWidgets('day result: one card, source once, Other list open (TASK-16)',
      (t) async {
    t.view.physicalSize = const Size(390, 1600);
    await boot(t, prefs: {
      'kalkal-history': hist({'year': 1445, 'month': 9, 'day': 10})
    });
    t.view.physicalSize = const Size(390, 1600);
    await openFromHistory(t, 'Ram');
    // The card opens with the source (caption + date) and the CHANGE button.
    expect(find.textContaining('FROM'), findsOneWidget);
    expect(find.textContaining('TO · AD'), findsOneWidget);
    // The source date is stated once and is 18 px, not the old 12.5 px line.
    final src = find.textContaining('1445 AH');
    expect(src, findsOneWidget);
    expect(t.widget<Text>(src).style!.fontSize, 18);
    expect(find.textContaining('←'), findsNothing);
    // Result: "20 March" and the year with its AD tag on the black block.
    expect(find.text('20 March'), findsOneWidget);
    expect(find.text('2024'), findsOneWidget);
    // Other calendars sit open under a heading, without a tab bar.
    expect(find.text('OTHER CONTEMPORANEOUS CALENDARS'), findsOneWidget);
    expect(find.text('HEBREW'), findsOneWidget);
    expect(find.text('10 Adar II'), findsOneWidget);
    expect(find.text('OTHER'), findsNothing);
    // Astro and History are collapsed rows; opening one shows its body.
    expect(find.text('ASTRO'), findsOneWidget);
    expect(find.text('Waxing Moon'), findsNothing);
    await t.tap(find.text('ASTRO'));
    await t.pump(const Duration(milliseconds: 300));
    expect(find.textContaining('Pisces'), findsOneWidget);
    expect(find.text('HISTORY'), findsOneWidget);
  });

  testWidgets('copy: one button, the arrow opens a "Copy as" sheet',
      (t) async {
    await boot(t, prefs: {
      'kalkal-history': hist({'year': 1445, 'month': 9, 'day': 10})
    });
    String? clip;
    t.binding.defaultBinaryMessenger
        .setMockMethodCallHandler(SystemChannels.platform, (call) async {
      if (call.method == 'Clipboard.setData') {
        clip = (call.arguments as Map)['text'] as String?;
      }
      return null;
    });
    addTearDown(() => t.binding.defaultBinaryMessenger
        .setMockMethodCallHandler(SystemChannels.platform, null));
    await openFromHistory(t, 'Ram');
    expect(find.text('COPY'), findsOneWidget);
    expect(find.text('1445/2024'), findsNothing);
    await t.tap(find.text('▾').last);
    await t.pumpAndSettle();
    expect(find.text('COPY AS'), findsOneWidget);
    expect(find.text('1445/2024'), findsOneWidget);
    await t.tap(find.text('1445/2024'));
    await t.pumpAndSettle();
    expect(find.text('COPY AS'), findsNothing);
    expect(clip, '1445/2024');
    // The main button copies the full date and flashes "Copied!".
    await t.pump(const Duration(milliseconds: 1300));
    await t.tap(find.text('COPY'));
    await t.pump(const Duration(milliseconds: 100));
    expect(clip, '20 March 2024');
    expect(find.text('COPIED!'), findsOneWidget);
    await t.pump(const Duration(milliseconds: 1300));
    expect(find.text('COPIED!'), findsNothing);
  });

  testWidgets('year result: years only, months in a row that opens', (t) async {
    t.view.physicalSize = const Size(390, 1800);
    await boot(t, prefs: {'kalkal-history': hist({'year': 1445})});
    t.view.physicalSize = const Size(390, 1800);
    await openFromHistory(t, '1445 AH');
    // Only the two years — no equation and no full span line.
    expect(find.text('2023'), findsOneWidget);
    expect(find.text('2024'), findsOneWidget);
    expect(find.textContaining('1445 AH = '), findsNothing);
    expect(find.textContaining('July 2023 – '), findsNothing);
    // End year starts at the left edge of its column.
    final y1 = t.getTopLeft(find.text('2023')).dx;
    final y2 = t.getTopLeft(find.text('2024')).dx;
    expect(y2 > y1, isTrue);
    // Months are a collapsed row; open it for the groups.
    expect(find.textContaining('14 December – 11 January 2024'), findsNothing);
    await t.tap(find.text('MONTHS'));
    await t.pump(const Duration(milliseconds: 300));
    expect(find.text('2023'), findsWidgets);
    expect(find.textContaining('14 December – 11 January 2024'), findsOneWidget);
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

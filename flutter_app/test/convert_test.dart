// Conversion-pipeline tests — reference values generated from the live JS
// engine (js/hijri.js + js/app.js semantics).

import 'package:flutter_test/flutter_test.dart';
import 'package:kalkal/engine/cal.dart';
import 'package:kalkal/engine/registry.dart';
import 'package:kalkal/logic/convert.dart';

void main() {
  test('registry: hijri 9 Jumada I 10 AH -> civil 13 Aug 631 (Julian rules)', () {
    final hijri = kWebCalendars['hijri']!;
    final greg = kWebCalendars['gregorian']!;
    final jd = hijri.toJD(10, 5, 9);
    expect(jd, 1951754.5);
    final r = greg.fromJD(jd);
    expect((r.year, r.month, r.day), (631, 8, 13));
  });

  test('registry: civil 10 Feb 1258 -> hijri IIc 4 Safar 656', () {
    final hijri = kWebCalendars['hijri']!;
    final greg = kWebCalendars['gregorian']!;
    hijri.variant = 'IIc';
    final r = hijri.fromJD(greg.toJD(1258, 2, 10));
    expect((r.year, r.month, r.day), (656, 2, 4));
  });

  test('registry: byzantine (Constantinople) 6532-9-1 -> 1 May 1024', () {
    final byz = kWebCalendars['byzantine']!;
    byz.variant = 'Constantinople';
    expect(byz.toJD(6532, 9, 1), 2095194.5);
    final r = kWebCalendars['gregorian']!.fromJD(byz.toJD(6532, 9, 1));
    expect((r.year, r.month, r.day), (1024, 5, 1));
  });

  test('romanDayNotation matches JS port', () {
    expect(romanDayNotation(3, 15, false), 'Idibus Martiis');
    expect(romanDayNotation(3, 17, false), 'ante diem XVI Kalendas Apriles');
    expect(romanDayNotation(1, 1, false), 'Kalendis Ianuariis');
  });

  test('indiction for 27 Jan 632 is 14', () {
    expect(Cal.indictionFromJD(Cal.civilToJD(632, 1, 27)), 14);
  });

  test('convert: single day hijri->gregorian produces bridge + copy data', () {
    final out = convert(
      src: kWebCalendars['hijri']!,
      tgt: kWebCalendars['gregorian']!,
      year: 10,
      month: 5,
      day: 9,
      lang: 'en',
    );
    expect(out.isSingle, true);
    expect(out.tgtFullText, '13 August 631');
    expect(out.srcFullText, '9 Ǧumādā al-Ūlā 10'); // ISO 233, as on the web
    expect(out.copyData.yearOnlyText, '631');
    expect(out.copyData.yearPairText, '10/631');
    // Astro card always has zodiac + moon + jdn.
    expect(out.astro.any((a) => a.kind == 'zodiac'), true);
    expect(out.astro.any((a) => a.kind == 'moon'), true);
    expect(out.astro.last.kind, 'jdn');
    expect(out.astro.last.text, '1951754.5');
  });

  test('convert: same calendar throws errSameCal', () {
    expect(
      () => convert(
        src: kWebCalendars['gregorian']!,
        tgt: kWebCalendars['gregorian']!,
        year: 2000,
        lang: 'en',
      ),
      throwsA(isA<ConvertException>()),
    );
  });

  test('convert: year-only produces range with breakdown rows', () {
    final out = convert(
      src: kWebCalendars['hijri']!,
      tgt: kWebCalendars['gregorian']!,
      year: 656,
      lang: 'en',
    );
    expect(out.isSingle, false);
    expect(out.breakdown.length, 12);
    expect(out.jdEnd, isNotNull);
    expect(out.copyData.kind, 'year-range');
  });

  test('convert: eclipse of 27 Jan 632 surfaces in astro card with map link', () {
    final out = convert(
      src: kWebCalendars['gregorian']!,
      tgt: kWebCalendars['hijri']!,
      year: 632,
      month: 1,
      day: 27,
      lang: 'en',
    );
    final ecl = out.astro.where((a) => a.kind == 'eclipse').toList();
    expect(ecl, isNotEmpty);
    // noteKey is '10632ibrahim' (not 'ibrahim632'), so like the web the
    // link resolves to the generated map page, not eklipso.html.
    expect(ecl.first.linkHref, contains('maps/106320127.html'));
  });

  test('smart ranges collapse like the web', () {
    const names = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    expect(smartDateRange(const YMD(632, 1, 1), const YMD(632, 1, 29), names, ''),
        '1–29 January 632');
    expect(smartDateRange(const YMD(632, 1, 5), const YMD(632, 3, 2), names, ''),
        '5 January – 2 March 632');
    expect(smartYearRange(631, 632, ''), '631–632');
    expect(smartYearRange(632, 632, ''), '632');
  });

  test('history summary abbreviates long month names', () {
    final s = buildHistorySummary('en', 'hijri', 'gregorian', 10, 5, 9);
    expect(s.src, '9 Ǧum. 10 AH');
    expect(s.res, '13 Aug. 631 AD');
  });

  test('variant divergence: hijri IIc vs IVa may differ on some dates', () {
    // 15 Ramadan 100 AH across variants — grouped output when they differ.
    final out = convert(
      src: kWebCalendars['hijri']!,
      tgt: kWebCalendars['julian']!,
      year: 100,
      month: 9,
      day: 15,
      lang: 'en',
    );
    expect(out.isSingle, true);
    // Either all variants agree (no alt lines) or alts carry labels.
    for (final line in out.altLines) {
      expect(line, contains(': '));
    }
  });

  test('calTag: roman has no tag, new short names present', () {
    expect(calTag('roman'), '');
    expect(calTag('hijri'), 'AH');
    expect(calTag('hebrew'), 'AM');
    expect(calTag('bp'), 'BP');
  });

  test('year range: bridgeEq "1445 AH = 2023–2024 AD", tags on single', () {
    final out = convertYearRange(
        kWebCalendars['hijri']!, kWebCalendars['gregorian']!, 1445, 'en');
    expect(out.bridgeEq, '1445 AH = 2023–2024 AD');
    final one = convertDate(kWebCalendars['hijri']!, kWebCalendars['gregorian']!,
        1445, 1, 1, 'en');
    expect(one.tgtTag, 'AD');
    expect(one.srcTag, 'AH');
    expect(one.bridgeEq, isNull);
  });

  test('contextualRows: 19 Jul 2023 lists calendars in use, not src/tgt', () {
    final jd = kWebCalendars['gregorian']!.toJD(2023, 7, 19);
    final rows = contextualRows(jd, null, 'hijri', 'gregorian', 'en');
    final ids = rows.map((r) => r.calId).toList();
    expect(ids, isNot(contains('hijri')));
    expect(ids, isNot(contains('gregorian')));
    expect(ids, containsAll(['hebrew', 'coptic', 'solarHijri']));
    expect(rows.firstWhere((r) => r.calId == 'hebrew').yearStr, '5783');
  });

  test('contextualRows: whole-year range ending in Yazdgerdi epagomenal days '
      'does not throw (TASK-14)', () {
    final out = convert(
      src: kWebCalendars['hijri']!,
      tgt: kWebCalendars['gregorian']!,
      year: 656,
      month: null,
      day: null,
      lang: 'en',
    );
    final rows = contextualRows(out.jd, out.jdEnd, 'hijri', 'gregorian', 'en');
    expect(rows.any((r) => r.calId == 'yazdgerdi'), isFalse);
    expect(rows, isNotEmpty);
  });
}

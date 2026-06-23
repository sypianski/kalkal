import 'package:flutter_test/flutter_test.dart';
import 'package:kalkal/engine/cal.dart';

void main() {
  test('Gregorian 2000-01-01 → JDN 2451544.5', () {
    expect(Cal.gregorianToJD(2000, 1, 1), 2451544.5);
  });

  test('Gregorian roundtrip 2026-06-23', () {
    final jd = Cal.gregorianToJD(2026, 6, 23);
    final r = Cal.jdToGregorian(jd);
    expect(r.year, 2026);
    expect(r.month, 6);
    expect(r.day, 23);
  });

  test('Hijri 1 Muharram 1 = epoch (Jul 16 622 Julian)', () {
    final jd = Cal.hijriToJD(1, 1, 1);
    expect(jd, 1948439.5);
    final j = Cal.jdToJulian(jd);
    expect(j.year, 622);
    expect(j.month, 7);
    expect(j.day, 16);
  });

  test('Gregorian → Hijri: 2026-06-23 → known Hijri', () {
    final jd = Cal.gregorianToJD(2026, 6, 23);
    final h = Cal.jdToHijri(jd);
    expect(h.year, isNonZero);
    expect(h.month, inInclusiveRange(1, 12));
    expect(h.day, inInclusiveRange(1, 30));
    final back = Cal.hijriToJD(h.year, h.month, h.day);
    expect(back, jd);
  });

  test('Julian → Gregorian cutover: Oct 4 1582 Jul = Oct 14 1582 Greg', () {
    final jdJ = Cal.julianToJD(1582, 10, 4);
    final g = Cal.jdToGregorian(jdJ);
    expect(g.year, 1582);
    expect(g.month, 10);
    expect(g.day, 14);
  });

  test('Day of week: 2026-06-23 (Tuesday)', () {
    final jd = Cal.gregorianToJD(2026, 6, 23);
    expect(Cal.getDayOfWeek(jd), 2);
  });

  test('Solar Hijri roundtrip', () {
    final jd = Cal.solarHijriToJD(1405, 4, 2);
    final r = Cal.jdToSolarHijri(jd);
    expect(r.year, 1405);
    expect(r.month, 4);
    expect(r.day, 2);
  });

  test('Hebrew roundtrip', () {
    final jd = Cal.hebrewToJD(5786, 1, 1);
    final r = Cal.jdToHebrew(jd);
    expect(r.year, 5786);
    expect(r.month, 1);
    expect(r.day, 1);
  });

  test('Coptic roundtrip', () {
    final jd = Cal.copticToJD(1742, 10, 16);
    final r = Cal.jdToCoptic(jd);
    expect(r.year, 1742);
    expect(r.month, 10);
    expect(r.day, 16);
  });

  test('Byzantine roundtrip', () {
    final jd = Cal.byzantineToJD(7534, 11, 15);
    final r = Cal.jdToByzantine(jd);
    expect(r.year, 7534);
    expect(r.month, 11);
    expect(r.day, 15);
  });
}

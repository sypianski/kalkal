// Conversion pipeline — faithful port of convert()/convertDate()/
// convertRange()/convertYearRange() and their helpers from js/app.js,
// producing plain data models the widgets render.

import '../engine/astronomy.dart';
import '../engine/cal.dart';
import '../engine/eclipses.dart';
import '../engine/registry.dart';
import '../i18n/i18n.dart';

const String kWebBase = 'https://kalkal.online';

// JS-style number printing: 27.0 -> "27", 27.4 -> "27.4".
String jsNum(double v) {
  if (v == v.roundToDouble()) return v.round().toString();
  return v.toString();
}

class ConvertException implements Exception {
  final String message;
  final String field; // 'fromCal' | 'toCal' | 'year' | 'month' | 'day' | ''
  ConvertException(this.message, [this.field = '']);
}

class CopyData {
  final String kind; // 'single' | 'range' | 'year-range'
  final String defaultText;
  final String yearOnlyText;
  final String fullBlockText;
  final String? yearPairText;
  final String tgtCalLabel;
  final String srcCalLabel;
  const CopyData({
    required this.kind,
    required this.defaultText,
    required this.yearOnlyText,
    required this.fullBlockText,
    this.yearPairText,
    required this.tgtCalLabel,
    required this.srcCalLabel,
  });
}

class AstroItem {
  final String kind; // zodiac|eclipse|moon|comet|supernova|conjunction|jdn
  final String? icon;
  final String text;
  final String? detail;
  final String? note;
  final String? linkLabel;
  final String? linkHref; // absolute URL
  const AstroItem({
    required this.kind,
    this.icon,
    required this.text,
    this.detail,
    this.note,
    this.linkLabel,
    this.linkHref,
  });
}

/// One row of the "Other contemporaneous calendars" panel.
class ContextRow {
  final String calId;
  final String label;
  final String yearStr;
  final String datesStr;
  const ContextRow(this.calId, this.label, this.yearStr, this.datesStr);
}

class BreakdownRow {
  final String srcName;
  final int days;
  final String startStr;
  final String endStr;
  // Year-less day + month and the bare years: the phone table groups rows by
  // start year and prints the end year only when it differs from the group.
  final String startDM;
  final String endDM;
  final int startYear;
  final int endYear;
  const BreakdownRow(
    this.srcName,
    this.days,
    this.startStr,
    this.endStr, {
    required this.startDM,
    required this.endDM,
    required this.startYear,
    required this.endYear,
  });
}

/// "19 July" — day + month name without the year.
String _dayMonth(List<String> names, YMD d) => '${d.day} ${names[d.month - 1]}';

class ConvertOutput {
  final bool isSingle;
  // single-day bridge
  final String? tgtFullText;
  final String? tgtDetail; // "20 March" — the line above the year on phones
  final String? tgtYearStr; // "2024" / "7532 AUC"
  final String? srcFullText;
  final String tgtTag; // calTag() of the target, '' when none
  final String srcTag;
  final String? bridgeEq; // "1445 AH = 2023–2024 AD" under a range bridge
  final List<String> altLines; // "label1, label2: alt date"
  final String? indictionLine;
  final String? animalLine;
  final String? babylonianNote;
  // which calendar (if any) gets the variant toggle bar in results
  final WebCalendar? secondaryCal;
  // range bridge
  final String? startYearStr;
  final String? endYearStr;
  final String? startDetail;
  final String? endDetail;
  final String? spanStartStr;
  final String? spanEndStr;
  final List<BreakdownRow> breakdown;
  final List<String> astroHighlights;
  final List<AstroItem> astro;
  final CopyData copyData;
  final double jd;
  final double? jdEnd;
  const ConvertOutput({
    required this.isSingle,
    this.tgtFullText,
    this.tgtDetail,
    this.tgtYearStr,
    this.srcFullText,
    this.tgtTag = '',
    this.srcTag = '',
    this.bridgeEq,
    this.altLines = const [],
    this.indictionLine,
    this.animalLine,
    this.babylonianNote,
    this.secondaryCal,
    this.startYearStr,
    this.endYearStr,
    this.startDetail,
    this.endDetail,
    this.spanStartStr,
    this.spanEndStr,
    this.breakdown = const [],
    this.astroHighlights = const [],
    required this.astro,
    required this.copyData,
    required this.jd,
    this.jdEnd,
  });
}

// ---- helpers straight from js/app.js ----

class FmtRange {
  final String startStr;
  final String endStr;
  const FmtRange(this.startStr, this.endStr);
}

FmtRange fmtDateRange(List<String> names, YMD s, YMD e) {
  final startStr =
      '${s.day} ${names[s.month - 1]}${s.year == e.year ? '' : ' ${s.year}'}';
  final endStr = '${e.day} ${names[e.month - 1]} ${e.year}';
  return FmtRange(startStr, endStr);
}

String smartDateRange(YMD s, YMD e, List<String> names, String yearSuf) {
  final sMonthName = (s.month - 1 < names.length) ? names[s.month - 1] : '';
  final eMonthName = (e.month - 1 < names.length) ? names[e.month - 1] : '';
  final sYr = '${s.year}$yearSuf';
  final eYr = '${e.year}$yearSuf';
  if (s.year == e.year && s.month == e.month && s.day == e.day) {
    return '${s.day} $sMonthName $sYr';
  }
  if (s.year == e.year && s.month == e.month) {
    return '${s.day}–${e.day} $sMonthName $sYr';
  }
  if (s.year == e.year) {
    return '${s.day} $sMonthName – ${e.day} $eMonthName $sYr';
  }
  return '${s.day} $sMonthName $sYr – ${e.day} $eMonthName $eYr';
}

String smartYearRange(int yStart, int yEnd, String yearSuf) {
  if (yStart == yEnd) return '$yStart$yearSuf';
  return '$yStart–$yEnd$yearSuf';
}

// fmtDate() in js/app.js — history summaries.
String fmtHistDate(WebCalendar cal, String lang, int y, int? m, int? d,
    [bool omitYear = false]) {
  if (m == null) return '$y';
  final names = cal.monthNamesGen(lang);
  final mName = (m - 1 < names.length) ? names[m - 1] : '$m';
  final shortM = mName.length > 5 ? '${mName.substring(0, 3)}.' : mName;
  if (omitYear) return d != null ? '$d $shortM' : shortM;
  return d != null ? '$d $shortM $y' : '$shortM $y';
}

class HistorySummary {
  final String src;
  final String res;
  const HistorySummary(this.src, this.res);
}

HistorySummary buildHistorySummary(
    String lang, String fromCal, String toCal, int year, int? month, int? day) {
  final src = kWebCalendars[fromCal];
  final tgt = kWebCalendars[toCal];
  if (src == null || tgt == null) {
    return HistorySummary('$fromCal → $toCal', '');
  }
  final srcShort = shortCalName(fromCal);
  final tgtShort = shortCalName(toCal);
  final srcStr = fmtHistDate(src, lang, year, month, day);
  String resStr;
  if (day != null && month != null) {
    final r = tgt.fromJD(src.toJD(year, month, day));
    resStr = fmtHistDate(tgt, lang, r.year, r.month, r.day);
  } else if (month != null) {
    final r1 = tgt.fromJD(src.toJD(year, month, 1));
    final last = src.monthLength(year, month);
    final r2 = tgt.fromJD(src.toJD(year, month, last));
    resStr =
        '${fmtHistDate(tgt, lang, r1.year, r1.month, r1.day, r1.year == r2.year)}'
        ' – ${fmtHistDate(tgt, lang, r2.year, r2.month, r2.day)}';
  } else {
    final r1 = tgt.fromJD(src.toJD(year, 1, 1));
    final lastM = src.monthCount;
    final r2 = tgt.fromJD(src.toJD(year, lastM, src.monthLength(year, lastM)));
    resStr = r1.year == r2.year ? '${r1.year}' : '${r1.year}–${r2.year}';
  }
  return HistorySummary('$srcStr $srcShort', '$resStr $tgtShort');
}

// ---- astro builders ----

AstroItem? _eclipseItem(double jd, String lang, WebCalendar? tgt,
    List<String>? tgtNames) {
  final ecl = Eclipses.lookup(jd);
  if (ecl == null) return null;
  final typeStr = Eclipses.typeLabel(
      ecl.type, I18n.nested[lang]?['eclipseTypes'] ?? I18n.nested['en']!['eclipseTypes']);
  final magStr = ecl.mag != 0 ? ' (${ecl.mag.toStringAsFixed(3)})' : '';
  var text = '${I18n.t(lang, 'eclipseLabel')}: $typeStr$magStr';
  if (tgt != null && tgtNames != null) {
    final eclDate = tgt.fromJD(jd);
    text += ' — ${eclDate.day} ${tgtNames[eclDate.month - 1]} ${eclDate.year}';
  }
  String? note;
  if (ecl.notable && ecl.noteKey != null) {
    final n = I18n.nestedT(lang, 'eclipseNotes', ecl.noteKey!);
    if (n != ecl.noteKey) note = n;
  }
  String? linkLabel;
  String? linkHref;
  if (ecl.notable) {
    if (ecl.noteKey == 'ibrahim632') {
      linkHref = '$kWebBase/eklipso.html';
    } else if (ecl.noteKey != null) {
      final he = '${ecl.year + 10000}'
          '${ecl.month < 10 ? '0' : ''}${ecl.month}'
          '${ecl.day < 10 ? '0' : ''}${ecl.day}';
      linkHref = '$kWebBase/maps/$he.html';
    } else {
      linkHref = '$kWebBase/eclipses.html';
    }
    linkLabel = ecl.noteKey != null
        ? I18n.t(lang, 'eclipseViewMap')
        : I18n.t(lang, 'eclipseViewCatalogue');
  }
  return AstroItem(
    kind: 'eclipse',
    icon: '◐',
    text: text,
    note: note,
    linkLabel: linkLabel,
    linkHref: linkHref,
  );
}

AstroItem _moonItem(double jd, String lang) {
  final moon = Astronomy.moonPhase(jd);
  final phaseName = I18n.nestedT(lang, 'moonPhases', moon.name);
  return AstroItem(
    kind: 'moon',
    icon: moon.icon,
    text: '${I18n.t(lang, 'moonPhaseLabel')}: $phaseName',
    detail: '${jsNum(moon.age)} ${I18n.t(lang, 'moonAge')} • '
        '${jsNum(moon.illumination)}% ${I18n.t(lang, 'moonIllumination')}',
  );
}

AstroItem? _cometItem(double jd, String lang) {
  final comet = Astronomy.lookupComet(jd);
  if (comet == null) return null;
  final cName = I18n.nestedT(lang, 'cometNames', comet.id);
  String? note;
  if (comet.noteKey != null) {
    final n = I18n.nestedT(lang, 'cometNotes', comet.noteKey!);
    if (n != comet.noteKey) note = n;
  }
  return AstroItem(
    kind: 'comet',
    icon: '☄️',
    text: '${I18n.t(lang, 'cometLabel')}: $cName (${comet.year})',
    note: note,
  );
}

AstroItem? _supernovaItem(double jd, String lang, {bool plusSign = true}) {
  final sn = Astronomy.lookupSupernova(jd);
  if (sn == null) return null;
  final snMag = (plusSign && sn.peakMag > 0)
      ? '+${jsNum(sn.peakMag)}'
      : jsNum(sn.peakMag);
  String? note;
  if (sn.noteKey != null) {
    final n = I18n.nestedT(lang, 'supernovaNotes', sn.noteKey!);
    if (n != sn.noteKey) note = n;
  }
  return AstroItem(
    kind: 'supernova',
    icon: '💥',
    text: '${I18n.t(lang, 'supernovaLabel')}: ${sn.id} '
        '(${sn.constellation}, mag $snMag)',
    note: note,
  );
}

AstroItem? _conjunctionItem(double jd, String lang) {
  final conj = Astronomy.lookupConjunction(jd);
  if (conj == null) return null;
  final p1 = I18n.nestedT(lang, 'planetNames', conj.planet1);
  final p2 = I18n.nestedT(lang, 'planetNames', conj.planet2);
  final sepStr = conj.separation < 60
      ? '${conj.separation}′'
      : '${(conj.separation / 60).toStringAsFixed(1)}°';
  String? note;
  if (conj.noteKey != null) {
    final n = I18n.nestedT(lang, 'conjunctionNotes', conj.noteKey!);
    if (n != conj.noteKey) note = n;
  }
  return AstroItem(
    kind: 'conjunction',
    icon: '✨',
    text: '${I18n.t(lang, 'conjunctionLabel')}: $p1–$p2 ($sepStr)',
    note: note,
  );
}

// Range astro sweep — buildRangeAstroPanel() in js/app.js.
(List<AstroItem>, List<String>) buildRangeAstro(
    double jdStart, double jdEnd, WebCalendar tgt, List<String> tgtNames,
    String lang) {
  final items = <AstroItem>[];
  final highlights = <String>[];
  for (var d = jdStart; d <= jdEnd; d++) {
    final ecl = Eclipses.lookup(d);
    if (ecl != null) {
      final item = _eclipseItem(d, lang, tgt, tgtNames)!;
      items.add(item);
      final typeStr = Eclipses.typeLabel(ecl.type,
          I18n.nested[lang]?['eclipseTypes'] ?? I18n.nested['en']!['eclipseTypes']);
      highlights.add('◐ $typeStr');
    }
  }
  final seenComets = <int>{};
  for (var d = jdStart; d <= jdEnd; d++) {
    final comet = Astronomy.lookupComet(d);
    if (comet != null && !seenComets.contains(comet.perihelionJD)) {
      seenComets.add(comet.perihelionJD);
      items.add(_cometItem(d, lang)!);
      highlights.add('☄ ${I18n.nestedT(lang, 'cometNames', comet.id)}');
    }
  }
  final seenSN = <String>{};
  for (var d = jdStart; d <= jdEnd; d++) {
    final sn = Astronomy.lookupSupernova(d);
    if (sn != null && !seenSN.contains(sn.id)) {
      seenSN.add(sn.id);
      items.add(_supernovaItem(d, lang, plusSign: false)!);
      highlights.add('✦ ${sn.id}');
    }
  }
  final seenConj = <int>{};
  for (var d = jdStart; d <= jdEnd; d++) {
    final conj = Astronomy.lookupConjunction(d);
    if (conj != null && !seenConj.contains(conj.closestJD)) {
      seenConj.add(conj.closestJD);
      items.add(_conjunctionItem(d, lang)!);
      final p1 = I18n.nestedT(lang, 'planetNames', conj.planet1);
      final p2 = I18n.nestedT(lang, 'planetNames', conj.planet2);
      highlights.add('✨ $p1–$p2');
    }
  }
  items.add(AstroItem(
    kind: 'jdn',
    text: '${jsNum(jdStart)} – ${jsNum(jdEnd)}',
  ));
  return (items, highlights);
}

// ---- main entry — convert() in js/app.js ----

ConvertOutput convert({
  required WebCalendar src,
  required WebCalendar tgt,
  required int year,
  int? month,
  int? day,
  required String lang,
}) {
  if (src.id == tgt.id) {
    throw ConvertException(I18n.t(lang, 'errSameCal'));
  }
  // Ensure default variants for validation & range conversions.
  if (src.variants != null) src.variant = src.defaultVariant;
  if (tgt.variants != null) tgt.variant = tgt.defaultVariant;

  if (year < 1) {
    throw ConvertException(I18n.t(lang, 'errNoYear'), 'year');
  }
  if (month != null && (month < 1 || month > src.monthCount)) {
    throw ConvertException(I18n.t(lang, 'errInvalidMonth'), 'month');
  }
  if (day != null && month != null) {
    final maxDay = src.monthLength(year, month);
    if (day < 1 || day > maxDay) {
      throw ConvertException(I18n.t(lang, 'errInvalidDay'), 'day');
    }
  }

  if (day != null && month != null) {
    return convertDate(src, tgt, year, month, day, lang);
  } else if (month != null) {
    final endD = src.monthLength(year, month);
    return convertRange(src, tgt, year, month, 1, year, month, endD, lang);
  } else {
    return convertYearRange(src, tgt, year, lang);
  }
}

ConvertOutput convertDate(
    WebCalendar src, WebCalendar tgt, int y, int m, int d, String lang) {
  final hasSrcVars = src.variants != null;
  final hasTgtVars = tgt.variants != null;

  WebCalendar? secondaryCal;
  List<String?> srcVars, tgtVars;
  if (hasSrcVars && hasTgtVars) {
    final srcPrio = kVariantPriority[src.id] ?? 99;
    final tgtPrio = kVariantPriority[tgt.id] ?? 99;
    if (srcPrio <= tgtPrio) {
      secondaryCal = tgt;
      srcVars = List<String?>.from(src.variants!);
      tgtVars = [tgt.variant];
    } else {
      secondaryCal = src;
      srcVars = [src.variant];
      tgtVars = List<String?>.from(tgt.variants!);
    }
  } else {
    srcVars = hasSrcVars ? List<String?>.from(src.variants!) : [null];
    tgtVars = hasTgtVars ? List<String?>.from(tgt.variants!) : [null];
  }

  // All variant combinations grouped by identical target date.
  final groups = <String, _VariantGroup>{};
  final groupOrder = <String>[];
  for (final sv in srcVars) {
    if (hasSrcVars) src.variant = sv!;
    final maxDay = src.monthLength(y, m);
    if (d > maxDay) continue;
    final jd = src.toJD(y, m, d);
    for (final tv in tgtVars) {
      if (hasTgtVars) tgt.variant = tv!;
      final result = tgt.fromJD(jd);
      final key = '${result.year}-${result.month}-${result.day}';
      if (!groups.containsKey(key)) {
        groups[key] = _VariantGroup(result, jd, tgt.monthNamesGen(lang));
        groupOrder.add(key);
      }
      String vlabel = '';
      if (hasSrcVars && secondaryCal == null) {
        vlabel = kVariantLabels[sv] ?? sv!;
      } else if (hasTgtVars && secondaryCal == null) {
        vlabel = kVariantLabels[tv] ?? tv!;
      } else if (secondaryCal == tgt) {
        vlabel = kVariantLabels[sv] ?? sv!;
      } else if (secondaryCal == src) {
        vlabel = kVariantLabels[tv] ?? tv!;
      }
      if (vlabel.isNotEmpty && !groups[key]!.labels.contains(vlabel)) {
        groups[key]!.labels.add(vlabel);
      }
    }
  }

  final groupList = [for (final k in groupOrder) groups[k]!];
  final showVarLabels = groupList.length > 1;
  final primaryJd = groupList.first.jd;

  if (hasSrcVars) src.variant = src.defaultVariant;
  final srcNames = src.monthNamesGen(lang);

  final g0 = groupList.first;
  final srcCalName = I18n.calendarName(lang, src.id);
  final tgtCalName = I18n.calendarName(lang, tgt.id);
  final srcMonthName = (m - 1 < srcNames.length) ? srcNames[m - 1] : '';
  final srcDetail = srcMonthName.isNotEmpty ? '$d $srcMonthName' : '$d';
  final tgtMonth0 =
      (g0.result.month - 1 < g0.tgtNames.length) ? g0.tgtNames[g0.result.month - 1] : '';
  final tgtYearStr =
      tgt.id == 'roman' ? '${g0.result.year} AUC' : '${g0.result.year}';
  String tgtDetail;
  if (tgt.id == 'roman' && g0.result.day > 0) {
    tgtDetail =
        romanDayNotation(g0.result.month, g0.result.day, tgt.isLeap(g0.result.year));
  } else {
    tgtDetail = tgtMonth0.isNotEmpty ? '${g0.result.day} $tgtMonth0' : '';
  }

  final srcFullText = srcDetail.isNotEmpty ? '$srcDetail $y' : '$y';
  final tgtFullText = tgtDetail.isNotEmpty ? '$tgtDetail $tgtYearStr' : tgtYearStr;

  // Copy data.
  final tgtYearOnlyText = '${g0.result.year}${tgt.id == 'roman' ? ' AUC' : ''}';
  final srcYearOnlyText = '$y${src.id == 'roman' ? ' AUC' : ''}';
  final tgtShort = shortCalName(tgt.id);
  String? yearPairText;
  if (tgt.id == 'gregorian' && src.id != 'gregorian') {
    yearPairText = '$srcYearOnlyText/$tgtYearOnlyText';
  } else if (src.id == 'gregorian' && tgt.id != 'gregorian') {
    yearPairText = '$tgtYearOnlyText/$srcYearOnlyText';
  }
  final copyData = CopyData(
    kind: 'single',
    defaultText: tgtFullText,
    yearOnlyText: tgtYearOnlyText,
    fullBlockText: '$tgtFullText $tgtShort',
    yearPairText: yearPairText,
    tgtCalLabel: tgtCalName,
    srcCalLabel: srcCalName,
  );

  // Alternate variant lines.
  final altLines = <String>[];
  if (showVarLabels) {
    for (final g in groupList) {
      if (g.labels.isEmpty) continue;
      String altText;
      if (tgt.id == 'roman' && g.result.day > 0) {
        altText =
            '${romanDayNotation(g.result.month, g.result.day, tgt.isLeap(g.result.year))}'
            ' ${g.result.year} AUC';
      } else {
        altText =
            '${g.result.day} ${g.tgtNames[g.result.month - 1]} ${g.result.year}';
      }
      altLines.add('${g.labels.join(', ')}: $altText');
    }
  }

  String? indictionLine;
  if (tgt.id == 'byzantine') {
    indictionLine = '${I18n.t(lang, 'indictionLabel')} ${Cal.indictionFromJD(g0.jd)}';
  }
  final primaryResult = groupList.first.result;
  String? animalLine;
  if (tgt.id == 'ilkhani') {
    final animal = Cal.ilkhaniAnimalYear(primaryResult.year);
    animalLine =
        '${I18n.t(lang, 'animalYearLabel')}: ${I18n.nestedT(lang, 'ilkhaniAnimals', animal)}';
  }
  String? babylonianNote;
  if (tgt.id == 'babylonian') {
    babylonianNote = Cal.isBabylonianPD(primaryResult.year)
        ? I18n.t(lang, 'babylonianPDNote')
        : I18n.t(lang, 'babylonianArithNote');
  }

  // Astro card content.
  final astro = <AstroItem>[];
  final zi = Cal.getZodiacSign(primaryJd);
  const zodiacSymbols = '♈♉♊♋♌♍♎♏♐♑♒♓';
  astro.add(AstroItem(
    kind: 'zodiac',
    text: '${zodiacSymbols[zi]} ${I18n.zodiacFor(lang)[zi]}',
  ));
  final ecl = _eclipseItem(primaryJd, lang, null, null);
  if (ecl != null) astro.add(ecl);
  astro.add(_moonItem(primaryJd, lang));
  final comet = _cometItem(primaryJd, lang);
  if (comet != null) astro.add(comet);
  final sn = _supernovaItem(primaryJd, lang);
  if (sn != null) astro.add(sn);
  final conj = _conjunctionItem(primaryJd, lang);
  if (conj != null) astro.add(conj);
  astro.add(AstroItem(kind: 'jdn', text: jsNum(primaryJd)));

  return ConvertOutput(
    isSingle: true,
    tgtFullText: tgtFullText,
    tgtDetail: tgtDetail,
    tgtYearStr: tgtYearStr,
    srcFullText: srcFullText,
    tgtTag: calTag(tgt.id),
    srcTag: calTag(src.id),
    altLines: altLines,
    indictionLine: indictionLine,
    animalLine: animalLine,
    babylonianNote: babylonianNote,
    secondaryCal: secondaryCal,
    astro: astro,
    copyData: copyData,
    jd: primaryJd,
  );
}

// buildBridgeEq() in js/app.js.
String _bridgeEq(String srcPart, String srcId, String tgtPart, String tgtId) {
  final st = calTag(srcId), tt = calTag(tgtId);
  return '$srcPart${st.isEmpty ? '' : ' $st'} = $tgtPart${tt.isEmpty ? '' : ' $tt'}';
}

class _VariantGroup {
  final YMD result;
  final double jd;
  final List<String> tgtNames;
  final List<String> labels = [];
  _VariantGroup(this.result, this.jd, this.tgtNames);
}

ConvertOutput convertRange(WebCalendar src, WebCalendar tgt, int y1, int m1,
    int d1, int y2, int m2, int d2, String lang) {
  final jdStart = src.toJD(y1, m1, d1);
  final jdEnd = src.toJD(y2, m2, d2);
  final startResult = tgt.fromJD(jdStart);
  final endResult = tgt.fromJD(jdEnd);
  final srcNames = src.monthNames(lang);
  final tgtNames = tgt.monthNamesGen(lang);

  final tgtRange = fmtDateRange(tgtNames, startResult, endResult);

  final monthRows = <BreakdownRow>[];
  var cy = y1, cm = m1;
  while (cy < y2 || (cy == y2 && cm <= m2)) {
    final mFirstDay = (cy == y1 && cm == m1) ? d1 : 1;
    final mLastDay = (cy == y2 && cm == m2) ? d2 : src.monthLength(cy, cm);
    final mDays = mLastDay - mFirstDay + 1;
    final mStartTgt = tgt.fromJD(src.toJD(cy, cm, mFirstDay));
    final mEndTgt = tgt.fromJD(src.toJD(cy, cm, mLastDay));
    final rowRange = fmtDateRange(tgtNames, mStartTgt, mEndTgt);
    monthRows.add(BreakdownRow(
      '${srcNames[cm - 1]} $cy',
      mDays,
      rowRange.startStr,
      rowRange.endStr,
      startDM: _dayMonth(tgtNames, mStartTgt),
      endDM: _dayMonth(tgtNames, mEndTgt),
      startYear: mStartTgt.year,
      endYear: mEndTgt.year,
    ));
    cm++;
    if (cm > src.monthCount) {
      cm = 1;
      cy++;
    }
  }

  final (astroItems, highlights) =
      buildRangeAstro(jdStart, jdEnd, tgt, tgtNames, lang);
  final hasEvents = astroItems.length > 1; // beyond the JDN meta row

  final rangeYearSuf = tgt.id == 'roman' ? ' AUC' : '';
  final srcYearSuf = src.id == 'roman' ? ' AUC' : '';
  final smartTgtRange = smartDateRange(startResult, endResult, tgtNames, rangeYearSuf);
  final smartTgtYears = smartYearRange(startResult.year, endResult.year, rangeYearSuf);
  final smartSrcYears = smartYearRange(y1, y2, srcYearSuf);
  String? yearPairText;
  if (tgt.id == 'gregorian' && src.id != 'gregorian') {
    yearPairText = '$smartSrcYears/$smartTgtYears';
  } else if (src.id == 'gregorian' && tgt.id != 'gregorian') {
    yearPairText = '$smartTgtYears/$smartSrcYears';
  }

  return ConvertOutput(
    isSingle: false,
    startYearStr:
        tgt.id == 'roman' ? '${startResult.year} AUC' : '${startResult.year}',
    endYearStr: tgt.id == 'roman' ? '${endResult.year} AUC' : '${endResult.year}',
    startDetail: '${startResult.day} ${tgtNames[startResult.month - 1]}',
    endDetail: '${endResult.day} ${tgtNames[endResult.month - 1]}',
    spanStartStr: tgtRange.startStr,
    spanEndStr: tgtRange.endStr,
    bridgeEq: _bridgeEq('${srcNames[m1 - 1]} $smartSrcYears', src.id,
        smartTgtYears, tgt.id),
    breakdown: monthRows.length > 1 ? monthRows : const [],
    astro: hasEvents ? astroItems : astroItems, // JDN row always present
    astroHighlights: highlights,
    copyData: CopyData(
      kind: 'range',
      defaultText: smartTgtRange,
      yearOnlyText: smartTgtYears,
      fullBlockText: '$smartTgtRange ${shortCalName(tgt.id)}',
      yearPairText: yearPairText,
      tgtCalLabel: I18n.calendarName(lang, tgt.id),
      srcCalLabel: I18n.calendarName(lang, src.id),
    ),
    jd: jdStart,
    jdEnd: jdEnd,
  );
}

ConvertOutput convertYearRange(
    WebCalendar src, WebCalendar tgt, int year, String lang) {
  final jdStart = src.toJD(year, 1, 1);
  final jdEnd =
      src.toJD(year, src.monthCount, src.monthLength(year, src.monthCount));
  final startResult = tgt.fromJD(jdStart);
  final endResult = tgt.fromJD(jdEnd);
  final tgtNames = tgt.monthNamesGen(lang);
  final srcNames = src.monthNames(lang);

  final tgtRange = fmtDateRange(tgtNames, startResult, endResult);

  final monthRows = <BreakdownRow>[];
  for (var m = 1; m <= src.monthCount; m++) {
    final mLen = src.monthLength(year, m);
    final mStartTgt = tgt.fromJD(src.toJD(year, m, 1));
    final mEndTgt = tgt.fromJD(src.toJD(year, m, mLen));
    final rowRange = fmtDateRange(tgtNames, mStartTgt, mEndTgt);
    monthRows.add(BreakdownRow(
      srcNames[m - 1],
      mLen,
      rowRange.startStr,
      rowRange.endStr,
      startDM: _dayMonth(tgtNames, mStartTgt),
      endDM: _dayMonth(tgtNames, mEndTgt),
      startYear: mStartTgt.year,
      endYear: mEndTgt.year,
    ));
  }

  final (astroItems, highlights) =
      buildRangeAstro(jdStart, jdEnd, tgt, tgtNames, lang);

  final yearSuf = tgt.id == 'roman' ? ' AUC' : '';
  final srcSuf = src.id == 'roman' ? ' AUC' : '';
  final smartTgtRange = smartDateRange(startResult, endResult, tgtNames, yearSuf);
  final smartTgtYears = smartYearRange(startResult.year, endResult.year, yearSuf);
  final smartSrcYears = '$year$srcSuf';
  String? yearPairText;
  if (tgt.id == 'gregorian' && src.id != 'gregorian') {
    yearPairText = '$smartSrcYears/$smartTgtYears';
  } else if (src.id == 'gregorian' && tgt.id != 'gregorian') {
    yearPairText = '$smartTgtYears/$smartSrcYears';
  }

  return ConvertOutput(
    isSingle: false,
    startYearStr:
        tgt.id == 'roman' ? '${startResult.year} AUC' : '${startResult.year}',
    endYearStr: tgt.id == 'roman' ? '${endResult.year} AUC' : '${endResult.year}',
    startDetail: '${startResult.day} ${tgtNames[startResult.month - 1]}',
    endDetail: '${endResult.day} ${tgtNames[endResult.month - 1]}',
    spanStartStr: tgtRange.startStr,
    spanEndStr: tgtRange.endStr,
    bridgeEq: _bridgeEq(smartSrcYears, src.id, smartTgtYears, tgt.id),
    breakdown: monthRows,
    astro: astroItems,
    astroHighlights: highlights,
    copyData: CopyData(
      kind: 'year-range',
      defaultText: smartTgtRange,
      yearOnlyText: smartTgtYears,
      fullBlockText: '$smartTgtRange ${shortCalName(tgt.id)}',
      yearPairText: yearPairText,
      tgtCalLabel: I18n.calendarName(lang, tgt.id),
      srcCalLabel: I18n.calendarName(lang, src.id),
    ),
    jd: jdStart,
    jdEnd: jdEnd,
  );
}


// CONTEXTUAL_PRIORITY in js/app.js.
const _kContextualPriority = [
  'gregorian', 'hijri', 'julian', 'hebrew', 'coptic', 'byzantine',
  'seleucid', 'syriac', 'solarHijri', 'yazdgerdi', 'armenian',
  'ethiopian', 'roman', 'babylonian', 'macedonian', 'antiochene',
  'egyptian', 'olympiad', 'spanish', 'ilkhani', 'rumi',
];

/// buildContextualPanel() in js/app.js — the same moment in every calendar
/// that was in use then (historicalRange contains [jd]), minus source/target.
List<ContextRow> contextualRows(
    double jd, double? jdEnd, String srcId, String tgtId, String lang) {
  final rows = <ContextRow>[];
  for (final id in _kContextualPriority) {
    if (id == srcId || id == tgtId) continue;
    final cal = kWebCalendars[id];
    final range = cal?.historicalRange;
    if (cal == null || range == null) continue;
    if (jd < range[0] || jd > range[1]) continue;
    final r = cal.fromJD(jd);
    final names = cal.monthNamesGen(lang);
    final e = jdEnd != null ? cal.fromJD(jdEnd) : null;
    // Skip calendars whose month has no name (Yazdgerdi's 13th month, TASK-14):
    // an index error here would abort the whole setState and hide the result.
    if (r.month > names.length || (e != null && e.month > names.length)) {
      continue;
    }
    String yearStr, datesStr;
    if (e != null) {
      yearStr = r.year == e.year ? '${r.year}' : '${r.year}–${e.year}';
      datesStr =
          '${r.day} ${names[r.month - 1]} – ${e.day} ${names[e.month - 1]}';
    } else if (id == 'roman' && r.day > 0) {
      yearStr = '${r.year} AUC';
      datesStr = romanDayNotation(r.month, r.day, cal.isLeap(r.year));
    } else {
      yearStr = '${r.year}';
      datesStr = '${r.day} ${names[r.month - 1]}';
    }
    rows.add(ContextRow(id, I18n.calendarName(lang, id), yearStr, datesStr));
  }
  return rows;
}

// Persistent app state. Keys and JSON shapes intentionally identical to the
// web app's localStorage model (js/app.js), so behaviour matches 1:1.

import 'dart:convert';
import 'dart:ui' as ui;

import 'package:shared_preferences/shared_preferences.dart';

import '../engine/registry.dart';

class HistoryEntry {
  final String fromCal;
  final String toCal;
  final int year;
  final int? month;
  final int? day;
  final int ts;
  const HistoryEntry({
    required this.fromCal,
    required this.toCal,
    required this.year,
    this.month,
    this.day,
    required this.ts,
  });

  Map<String, dynamic> toJson() => {
        'fromCal': fromCal,
        'toCal': toCal,
        'year': year,
        'month': month,
        'day': day,
        'ts': ts,
      };

  static HistoryEntry? fromJson(dynamic j) {
    if (j is! Map) return null;
    final year = j['year'];
    if (year is! int) return null;
    return HistoryEntry(
      fromCal: j['fromCal'] as String? ?? '',
      toCal: j['toCal'] as String? ?? '',
      year: year,
      month: j['month'] is int ? j['month'] as int : null,
      day: j['day'] is int ? j['day'] as int : null,
      ts: j['ts'] is int ? j['ts'] as int : 0,
    );
  }
}

class Prefs {
  Prefs._(this._sp);
  static late Prefs instance;
  final SharedPreferences _sp;

  static Future<void> init() async {
    instance = Prefs._(await SharedPreferences.getInstance());
  }

  // ---- language (kalkal-lang) — detectLang() fallback like js/app.js ----
  static const _supportedUi = ['en', 'pl', 'eo']; // live web offers these 3

  String get lang {
    final stored = _sp.getString('kalkal-lang');
    if (stored != null && _supportedUi.contains(stored)) return stored;
    for (final locale in ui.PlatformDispatcher.instance.locales) {
      final code = locale.languageCode.toLowerCase();
      if (_supportedUi.contains(code)) return code;
    }
    return 'en';
  }

  set lang(String v) => _sp.setString('kalkal-lang', v);

  // ---- last source calendar (kalkal-from-cal), default hijri ----
  String get fromCal {
    final v = _sp.getString('kalkal-from-cal');
    return (v != null && kWebCalendars.containsKey(v)) ? v : 'hijri';
  }

  set fromCal(String v) => _sp.setString('kalkal-from-cal', v);

  // ---- recently picked calendars (kalkal-recent-cals), max 3, newest first.
  // Flutter-only (TASK-1): feeds the "Recent" group of the calendar picker. ----
  static const recentCalsMax = 3;

  List<String> get recentCals {
    final raw = _sp.getStringList('kalkal-recent-cals') ?? const <String>[];
    return raw.where(kWebCalendars.containsKey).toList();
  }

  void pushRecentCal(String id) {
    final list = recentCals..remove(id);
    list.insert(0, id);
    if (list.length > recentCalsMax) list.length = recentCalsMax;
    _sp.setStringList('kalkal-recent-cals', list);
  }

  // ---- copy mode (kalkal-copy-mode): default | year | pair ----
  String get copyMode => _sp.getString('kalkal-copy-mode') ?? 'default';
  set copyMode(String v) => _sp.setString('kalkal-copy-mode', v);

  // ---- calendar variants (kalkal-<id>-variant) ----
  String? variantFor(String calId) => _sp.getString('kalkal-$calId-variant');

  void setVariant(String calId, String v) =>
      _sp.setString('kalkal-$calId-variant', v);

  /// Apply persisted variant prefs onto the registry — the top-of-app.js
  /// "Apply persisted variant preferences" block.
  void applyVariants() {
    for (final calId in ['hijri', 'byzantine', 'seleucid', 'yazdgerdi']) {
      final cal = kWebCalendars[calId]!;
      final stored = variantFor(calId);
      if (stored != null && (cal.variants?.contains(stored) ?? false)) {
        cal.variant = stored;
        cal.defaultVariant = stored;
      }
    }
  }

  // ---- history (kalkal-history), max 20, newest first, dedup ----
  static const historyMax = 20;

  List<HistoryEntry> get history {
    final raw = _sp.getString('kalkal-history');
    if (raw == null) return [];
    try {
      final list = jsonDecode(raw);
      if (list is! List) return [];
      return list
          .map(HistoryEntry.fromJson)
          .whereType<HistoryEntry>()
          .toList();
    } catch (_) {
      return [];
    }
  }

  void saveHistory(HistoryEntry entry) {
    final hist = history;
    hist.removeWhere((h) =>
        h.fromCal == entry.fromCal &&
        h.toCal == entry.toCal &&
        h.year == entry.year &&
        h.month == entry.month &&
        h.day == entry.day);
    hist.insert(0, entry);
    if (hist.length > historyMax) hist.length = historyMax;
    _sp.setString(
        'kalkal-history', jsonEncode(hist.map((h) => h.toJson()).toList()));
  }

  void clearHistory() => _sp.remove('kalkal-history');
}

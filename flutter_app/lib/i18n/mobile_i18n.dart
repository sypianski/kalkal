// Strings that exist only in the Flutter phone layout (TASK-1). They are not
// in js/i18n.js, so they live here instead of the generated i18n.dart.
// Missing language → English, like I18n.t.

class MobileI18n {
  MobileI18n._();

  static const Map<String, Map<String, String>> _s = {
    'en': {
      'copy': 'Copy',
      'copyAs': 'Copy as',
      'fmtFull': 'Full date',
      'fmtYear': 'Year only',
      'fmtRange': 'Whole range',
      'fmtYears': 'Years only',
      'fmtPair': 'Year pair',
      'change': 'Change',
      'more': 'More',
      'recent': 'Recent',
      'tabOther': 'Other',
      'tabMonths': 'Months',
      'moreSheetTitle': 'More',
    },
    'pl': {
      'copy': 'Kopiuj',
      'copyAs': 'Kopiuj jako',
      'fmtFull': 'Pełna data',
      'fmtYear': 'Sam rok',
      'fmtRange': 'Cały zakres',
      'fmtYears': 'Same lata',
      'fmtPair': 'Para lat',
      'change': 'Zmień',
      'more': 'Więcej',
      'recent': 'Ostatnio',
      'tabOther': 'Inne',
      'tabMonths': 'Miesiące',
      'moreSheetTitle': 'Więcej',
    },
    'eo': {
      'copy': 'Kopii',
      'copyAs': 'Kopii kiel',
      'fmtFull': 'Plena dato',
      'fmtYear': 'Nur jaro',
      'fmtRange': 'Tuta periodo',
      'fmtYears': 'Nur jaroj',
      'fmtPair': 'Paro de jaroj',
      'change': 'Ŝanĝi',
      'more': 'Pli',
      'recent': 'Lastaj',
      'tabOther': 'Aliaj',
      'tabMonths': 'Monatoj',
      'moreSheetTitle': 'Pli',
    },
    'ar': {
      'copy': 'نسخ',
      'copyAs': 'نسخ كـ',
      'fmtFull': 'التاريخ الكامل',
      'fmtYear': 'السنة فقط',
      'fmtRange': 'النطاق كاملاً',
      'fmtYears': 'السنوات فقط',
      'fmtPair': 'زوج السنوات',
      'change': 'تغيير',
      'more': 'المزيد',
      'recent': 'الأخيرة',
      'tabOther': 'أخرى',
      'tabMonths': 'الأشهر',
      'moreSheetTitle': 'المزيد',
    },
  };

  static String t(String lang, String key) =>
      _s[lang]?[key] ?? _s['en']![key] ?? key;
}

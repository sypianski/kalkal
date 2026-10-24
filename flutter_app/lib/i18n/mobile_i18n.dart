// Strings that exist only in the Flutter phone layout (TASK-1). They are not
// in js/i18n.js, so they live here instead of the generated i18n.dart.
// Missing language → English, like I18n.t.

class MobileI18n {
  MobileI18n._();

  static const Map<String, Map<String, String>> _s = {
    'en': {
      'change': 'Change',
      'more': 'More',
      'recent': 'Recent',
      'tabOther': 'Other',
      'tabMonths': 'Months',
      'moreSheetTitle': 'More',
    },
    'pl': {
      'change': 'Zmień',
      'more': 'Więcej',
      'recent': 'Ostatnio',
      'tabOther': 'Inne',
      'tabMonths': 'Miesiące',
      'moreSheetTitle': 'Więcej',
    },
    'eo': {
      'change': 'Ŝanĝi',
      'more': 'Pli',
      'recent': 'Lastaj',
      'tabOther': 'Aliaj',
      'tabMonths': 'Monatoj',
      'moreSheetTitle': 'Pli',
    },
    'ar': {
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

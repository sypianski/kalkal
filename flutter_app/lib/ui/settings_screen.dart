// Settings page — settings.html port (§6): language + per-calendar variant
// pill groups, persisted under the same keys as the web localStorage.

import 'package:flutter/material.dart';

import '../engine/cal.dart';
import '../engine/registry.dart';
import '../i18n/i18n.dart';
import '../i18n/pages_i18n.dart';
import '../state/prefs.dart';
import 'tokens.dart';

class SettingsScreen extends StatefulWidget {
  final String lang;
  final ValueChanged<String> onLangChanged;
  const SettingsScreen({
    super.key,
    required this.lang,
    required this.onLangChanged,
  });

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  String get _lang => widget.lang;

  static const _langOptions = [
    ('en', 'EN — English'),
    ('pl', 'PL — Polski'),
    ('eo', 'EO — Esperanto'),
  ];

  // (calId, settings heading key, variant ids)
  static const _variantGroups = [
    ('hijri', 'settingsHijriHeading', 'settingsHijriDesc'),
    ('byzantine', 'settingsByzantineHeading', 'settingsByzantineDesc'),
    ('seleucid', 'settingsSeleucidHeading', 'settingsSeleucidDesc'),
    ('yazdgerdi', 'settingsYazdgerdiHeading', 'settingsYazdgerdiDesc'),
  ];

  @override
  Widget build(BuildContext context) {
    final wide = isWide(context);
    return Align(
      alignment: Alignment.topCenter,
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 1100),
        child: ListView(
          padding: wide
              ? const EdgeInsets.fromLTRB(40, 40, 40, 40)
              : const EdgeInsets.fromLTRB(10, 12, 10, 20),
          children: [
            _group(
              wide: wide,
              heading: I18n.t(_lang, 'language'),
              child: Wrap(
                spacing: 6,
                runSpacing: 6,
                children: [
                  for (final (code, label) in _langOptions)
                    _pill(label, code == _lang, wide, () {
                      Prefs.instance.lang = code;
                      widget.onLangChanged(code);
                    }),
                ],
              ),
            ),
            if (wide)
              for (final (calId, headingKey, descKey) in _variantGroups)
                _group(
                  wide: wide,
                  heading: I18n.t(_lang, headingKey),
                  desc: I18n.t(_lang, descKey),
                  child: _variantList(calId),
                )
            else
              _variantRowsCard(),
          ],
        ),
      ),
    );
  }

  // Radio rows of one variant group (name, description, optional example).
  // [afterPick] runs after the choice is stored — the phone sheet closes.
  Widget _variantList(String calId, {VoidCallback? afterPick}) {
    final cal = kWebCalendars[calId]!;
    final current = Prefs.instance.variantFor(calId) ?? cal.defaultVariant;
    final items = PagesI18n.calendarVariantItems[_lang]?[calId] ??
        PagesI18n.calendarVariantItems['en']?[calId] ??
        const <String>[];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        if (calId == 'hijri') _hijriExample(),
        Container(height: 2, color: kInk),
        for (var i = 0; i < cal.variants!.length; i++)
          _variantRow(
            name: _variantName(cal.variants![i]),
            desc: i < items.length ? items[i] : '',
            example: calId == 'hijri'
                ? _hijriVariantExample(cal.variants![i])
                : null,
            active: cal.variants![i] == current,
            onTap: () {
              final v = cal.variants![i];
              Prefs.instance.setVariant(calId, v);
              cal.variant = v;
              cal.defaultVariant = v;
              setState(() {});
              afterPick?.call();
            },
          ),
      ],
    );
  }

  // Phone: one card, one row per variant group (heading + current variant);
  // a tap opens a sheet with the full list and descriptions (TASK-1).
  Widget _variantRowsCard() {
    return Container(
      decoration: slabDecoration(shadow: 4),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          for (var i = 0; i < _variantGroups.length; i++) ...[
            if (i > 0) Container(height: 2, color: kSurface2),
            Builder(builder: (context) {
              final (calId, headingKey, _) = _variantGroups[i];
              final cal = kWebCalendars[calId]!;
              final current =
                  Prefs.instance.variantFor(calId) ?? cal.defaultVariant;
              return InkWell(
                onTap: () => _openVariantSheet(_variantGroups[i]),
                child: Container(
                  constraints: const BoxConstraints(minHeight: 64),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                  child: Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(I18n.t(_lang, headingKey).toUpperCase(),
                                style: mono(11,
                                    weight: FontWeight.w800,
                                    letterSpacing: 1.2)),
                            const SizedBox(height: 4),
                            Text(_variantName(current),
                                style: mono(12.5, color: kSignal)),
                          ],
                        ),
                      ),
                      Text('›', style: mono(20, weight: FontWeight.w700)),
                    ],
                  ),
                ),
              );
            }),
          ],
        ],
      ),
    );
  }

  Future<void> _openVariantSheet((String, String, String) g) {
    final (calId, headingKey, descKey) = g;
    return showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: kSurface,
      shape: const RoundedRectangleBorder(),
      constraints: BoxConstraints(
        maxHeight: MediaQuery.of(context).size.height * 0.85,
      ),
      builder: (ctx) => SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(16, 18, 16, 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(I18n.t(_lang, headingKey).toUpperCase(),
                  style: mono(12, weight: FontWeight.w800, letterSpacing: 1.8)),
              Padding(
                padding: const EdgeInsets.only(top: 6, bottom: 12),
                child: Text(I18n.t(_lang, descKey),
                    style: mono(13, color: kInk600, height: 1.45)),
              ),
              _variantList(calId, afterPick: () => Navigator.of(ctx).pop()),
            ],
          ),
        ),
      ),
    );
  }

  static const _variantNameKeys = {
    'IIa': 'variantEastCivil',
    'IIIa': 'variantWestCivil',
    'IVa': 'variantHabash',
    'Constantinople': 'variantConstantinople',
    'Alexandrian': 'variantAlexandrian',
    'Macedonian': 'variantMacedonian',
    'Babylonian': 'variantBabylonian',
    'Shahenshahi': 'variantShahenshahi',
    'Qadimi': 'variantQadimi',
    'Fasli': 'variantFasli',
  };

  String _variantName(String v) {
    if (v == 'IIc') return 'Wüstenfeld (IIc)';
    if (v == 'ChronPasch') return 'Chron. Paschale';
    final key = _variantNameKeys[v];
    return key == null ? (kVariantLabels[v] ?? v) : I18n.t(_lang, key);
  }

  // 1 Muharram 8 AH by each tabular variant, as a Julian date — makes the
  // one-day differences visible (settings.html fillHijriExample).
  String _hijriVariantExample(String variant) {
    final d = Cal.jdToJulian(Cal.hijriToJD(8, 1, 1, variant));
    final months = I18n.monthList(_lang, 'gregorianMonthsGen') ??
        I18n.monthNames(_lang, 'gregorian');
    final name = d.month - 1 < months.length ? months[d.month - 1] : '${d.month}';
    return '${d.day} $name ${d.year}';
  }

  Widget _hijriExample() {
    final m = I18n.monthNames(_lang, 'hijri').first;
    final tpl = PagesI18n.t(_lang, 'settingsExample');
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Text(tpl.replaceAll('{m}', m),
          style: mono(12, weight: FontWeight.w700, color: kSignal, height: 1.4)),
    );
  }

  // Radio row of the web: round marker, name + description, example in signal blue.
  Widget _variantRow({
    required String name,
    required String desc,
    required bool active,
    required VoidCallback onTap,
    String? example,
  }) {
    final wide = isWide(context);
    final text = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(name, style: mono(13.6, weight: FontWeight.w700, height: 1.5)),
        if (desc.isNotEmpty)
          Padding(
            padding: const EdgeInsets.only(top: 2),
            child: Text(desc,
                style: mono(wide ? 12.8 : 14, color: kInk700, height: 1.5)),
          ),
      ],
    );
    final ex = example == null
        ? null
        : Text(example,
            style: mono(12, weight: FontWeight.w700, color: kSignal));
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 11.2),
        decoration: const BoxDecoration(
            border: Border(bottom: BorderSide(color: Color(0xFFA8A8A2)))),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 16,
              height: 16,
              margin: const EdgeInsets.only(top: 2),
              padding: const EdgeInsets.all(2.5),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: kWhite,
                border: Border.all(color: active ? kSignal : kInk, width: 2),
              ),
              child: active
                  ? const DecoratedBox(
                      decoration:
                          BoxDecoration(shape: BoxShape.circle, color: kSignal))
                  : null,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: wide || ex == null
                  ? text
                  : Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [text, const SizedBox(height: 4), ex],
                    ),
            ),
            if (wide && ex != null)
              Padding(padding: const EdgeInsets.only(left: 16), child: ex),
          ],
        ),
      ),
    );
  }

  // Flat group: grey caps heading, optional description, content, heavy rule below.
  Widget _group({
    required bool wide,
    required String heading,
    String? desc,
    required Widget child,
  }) {
    return Container(
      margin: EdgeInsets.only(bottom: wide ? 40 : 24),
      padding: EdgeInsets.only(bottom: wide ? 40 : 24),
      decoration: const BoxDecoration(
          border: Border(bottom: BorderSide(color: kInk, width: 2))),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Padding(
            padding: const EdgeInsets.only(bottom: 9.6),
            child: Text(heading.toUpperCase(),
                style: mono(wide ? 10.4 : 11.5,
                    weight: FontWeight.w700,
                    color: kInk400,
                    letterSpacing: 1.25)),
          ),
          if (desc != null && desc.isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Text(desc,
                  style: mono(wide ? 12.8 : 14, color: kInk500, height: 1.5)),
            ),
          child,
        ],
      ),
    );
  }

  Widget _pill(String label, bool active, bool wide, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: wide
            ? const EdgeInsets.symmetric(horizontal: 9.5, vertical: 4.5)
            : const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(
          color: active ? kSignal : kSurface2,
          border: Border.all(color: active ? kSignal : kInk400),
        ),
        child: Text(
          label,
          style: mono(wide ? 11.2 : 14.4,
              weight: FontWeight.w600, color: active ? kWhite : kInk500),
        ),
      ),
    );
  }
}

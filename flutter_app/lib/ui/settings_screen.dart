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
    return ListView(
      padding: const EdgeInsets.fromLTRB(10, 10, 10, 20),
      children: [
        Container(
          color: kInk,
          padding: const EdgeInsets.fromLTRB(16, 18, 16, 16),
          child: Text(
            I18n.t(_lang, 'settings').toUpperCase(),
            style: mono(17,
                weight: FontWeight.w800, color: kWhite, letterSpacing: 2),
          ),
        ),
        const SizedBox(height: 14),
        _group(
          heading: I18n.t(_lang, 'language'),
          desc: null,
          child: Wrap(
            spacing: 6,
            runSpacing: 6,
            children: [
              for (final (code, label) in _langOptions)
                _pill(label, code == _lang, () {
                  Prefs.instance.lang = code;
                  widget.onLangChanged(code);
                }),
            ],
          ),
        ),
        if (isWide(context))
          for (final (calId, headingKey, descKey) in _variantGroups) ...[
            const SizedBox(height: 14),
            _group(
              heading: I18n.t(_lang, headingKey),
              desc: I18n.t(_lang, descKey),
              child: _variantList(calId),
            ),
          ]
        else ...[
          const SizedBox(height: 14),
          _variantRowsCard(),
        ],
      ],
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
                    style: mono(10.5, color: kInk600, height: 1.45)),
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
      padding: const EdgeInsets.only(bottom: 10),
      child: Text(tpl.replaceAll('{m}', m),
          style: mono(10.5, color: kInk500, height: 1.4)),
    );
  }

  // Radio row: square, name + description, optional example on the right.
  Widget _variantRow({
    required String name,
    required String desc,
    required bool active,
    required VoidCallback onTap,
    String? example,
  }) {
    return InkWell(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: kSurface,
          border: Border.all(color: active ? kSignal : kInk, width: 2),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 18,
              height: 18,
              margin: const EdgeInsets.only(top: 1),
              decoration: BoxDecoration(
                color: active ? kSignal : Colors.transparent,
                border: Border.all(color: active ? kSignal : kInk, width: 2),
              ),
              child: active
                  ? const Icon(Icons.check, size: 12, color: kWhite)
                  : null,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(name, style: mono(12.5, weight: FontWeight.w800)),
                  if (desc.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.only(top: 4),
                      child: Text(desc,
                          style: mono(10.5, color: kInk600, height: 1.45)),
                    ),
                ],
              ),
            ),
            if (example != null)
              Padding(
                padding: const EdgeInsets.only(left: 12),
                child: Text(example,
                    style: mono(11, weight: FontWeight.w700, color: kInk700)),
              ),
          ],
        ),
      ),
    );
  }

  Widget _group({required String heading, String? desc, required Widget child}) {
    return Container(
      decoration: slabDecoration(shadow: 4),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(heading.toUpperCase(),
              style: mono(12, weight: FontWeight.w800, letterSpacing: 1.8)),
          if (desc != null && desc.isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(top: 6),
              child: Text(desc, style: mono(10.5, color: kInk600, height: 1.45)),
            ),
          const SizedBox(height: 12),
          child,
        ],
      ),
    );
  }

  Widget _pill(String label, bool active, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: Container(
        constraints: const BoxConstraints(minHeight: 44),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: active ? kSignal : kSurface,
          border: Border.all(color: active ? kSignal : kInk, width: 2),
        ),
        alignment: Alignment.center,
        child: Text(
          label,
          style: mono(12.5,
              weight: FontWeight.w700, color: active ? kWhite : kInk),
        ),
      ),
    );
  }
}

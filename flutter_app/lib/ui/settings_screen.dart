// Settings page — settings.html port (§6): language + per-calendar variant
// pill groups, persisted under the same keys as the web localStorage.

import 'package:flutter/material.dart';

import '../engine/registry.dart';
import '../i18n/i18n.dart';
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
        for (final (calId, headingKey, descKey) in _variantGroups) ...[
          const SizedBox(height: 14),
          Builder(builder: (context) {
            final cal = kWebCalendars[calId]!;
            final current =
                Prefs.instance.variantFor(calId) ?? cal.defaultVariant;
            return _group(
              heading: I18n.t(_lang, headingKey),
              desc: I18n.t(_lang, descKey),
              child: Wrap(
                spacing: 6,
                runSpacing: 6,
                children: [
                  for (final v in cal.variants!)
                    _pill(kVariantLabels[v] ?? v, v == current, () {
                      Prefs.instance.setVariant(calId, v);
                      cal.variant = v;
                      cal.defaultVariant = v;
                      setState(() {});
                    }),
                ],
              ),
            );
          }),
        ],
      ],
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
          color: active ? kInk : kSurface,
          border: Border.all(color: kInk, width: 2),
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

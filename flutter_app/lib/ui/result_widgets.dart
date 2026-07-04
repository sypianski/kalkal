// Result panel, copy accordion, astro card, history panel — the mobile
// result stack of index.html (§3 of the UI spec).

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart';

import '../engine/registry.dart';
import '../i18n/i18n.dart';
import '../logic/convert.dart';
import '../state/prefs.dart';
import 'tokens.dart';
import 'widgets.dart';

/// RESULT slab — heavier border (3px) + 6px shadow + corner badge.
class ResultPanel extends StatelessWidget {
  final String lang;
  final ConvertOutput out;
  final void Function(WebCalendar cal, String variant)? onVariantTap;
  const ResultPanel({
    super.key,
    required this.lang,
    required this.out,
    this.onVariantTap,
  });

  @override
  Widget build(BuildContext context) {
    final secondary = out.secondaryCal;
    return Container(
      decoration: slabDecoration(border: kBorderResult, shadow: 6),
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(18, 26, 18, 18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (secondary != null && onVariantTap != null)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: Wrap(
                      spacing: 4,
                      runSpacing: 4,
                      children: [
                        for (final v in secondary.variants!)
                          VariantButton(
                            label: kVariantLabels[v] ?? v,
                            active: v == secondary.variant,
                            onTap: () => onVariantTap!(secondary, v),
                          ),
                      ],
                    ),
                  ),
                if (out.isSingle) ..._single() else ..._range(),
              ],
            ),
          ),
          Positioned(
            top: 0,
            right: 0,
            child: Container(
              color: kInk,
              padding: const EdgeInsets.fromLTRB(8, 4, 8, 3),
              child: Text(
                'RESULT',
                style: mono(9,
                    weight: FontWeight.w700, color: kWhite, letterSpacing: 1.3),
              ),
            ),
          ),
        ],
      ),
    );
  }

  List<Widget> _single() {
    return [
      // Target full date — big, black 3px underline.
      Container(
        decoration: const BoxDecoration(
          border: Border(bottom: BorderSide(color: kInk, width: 3)),
        ),
        padding: const EdgeInsets.only(bottom: 4),
        child: Text(
          out.tgtFullText!,
          style: mono(26, weight: FontWeight.w900, height: 1.15),
        ),
      ),
      const SizedBox(height: 6),
      Text(out.srcFullText!, style: mono(11, color: kInk400)),
      for (final line in out.altLines)
        Padding(
          padding: const EdgeInsets.only(top: 8),
          child: Text(line, style: mono(11.5, color: kInk600)),
        ),
      if (out.indictionLine != null)
        Padding(
          padding: const EdgeInsets.only(top: 8),
          child: Text(out.indictionLine!, style: mono(12, color: kInk700)),
        ),
      if (out.animalLine != null)
        Padding(
          padding: const EdgeInsets.only(top: 8),
          child: Text(out.animalLine!, style: mono(12, color: kInk700)),
        ),
      if (out.babylonianNote != null)
        Padding(
          padding: const EdgeInsets.only(top: 10),
          child: Text(out.babylonianNote!,
              style: mono(10.5, color: kInk600, height: 1.4)),
        ),
    ];
  }

  List<Widget> _range() {
    return [
      Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                FittedBox(
                  fit: BoxFit.scaleDown,
                  alignment: Alignment.centerLeft,
                  child: Text(out.startYearStr!,
                      style: mono(38, weight: FontWeight.w900, height: 1.05)),
                ),
                Text(out.startDetail!, style: mono(11, color: kInk600)),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8),
            child: Text('→', style: mono(22, weight: FontWeight.w700)),
          ),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                FittedBox(
                  fit: BoxFit.scaleDown,
                  alignment: Alignment.centerRight,
                  child: Text(out.endYearStr!,
                      style: mono(38, weight: FontWeight.w900, height: 1.05)),
                ),
                Text(out.endDetail!, style: mono(11, color: kInk600)),
              ],
            ),
          ),
        ],
      ),
      const SizedBox(height: 12),
      Text('${out.spanStartStr} – ${out.spanEndStr}',
          style: mono(12.5, color: kInk700)),
    ];
  }
}

/// Copy accordion — `.copy-box` (§3.3). Header copies the active mode text;
/// body lists modes (default / year / pair) with set-default + mini-copy.
class CopyCard extends StatefulWidget {
  final String lang;
  final CopyData data;
  const CopyCard({super.key, required this.lang, required this.data});

  @override
  State<CopyCard> createState() => _CopyCardState();
}

class _CopyCardState extends State<CopyCard> {
  bool _expanded = false;
  bool _copied = false;
  late String _active;

  List<({String key, String text})> get _modes => [
        (key: 'default', text: widget.data.defaultText),
        (key: 'year', text: widget.data.yearOnlyText),
        if (widget.data.yearPairText != null)
          (key: 'pair', text: widget.data.yearPairText!),
      ];

  @override
  void initState() {
    super.initState();
    final saved = Prefs.instance.copyMode;
    _active = _modes.any((m) => m.key == saved) ? saved : 'default';
  }

  @override
  void didUpdateWidget(covariant CopyCard old) {
    super.didUpdateWidget(old);
    if (!_modes.any((m) => m.key == _active)) _active = 'default';
  }

  String get _activeText =>
      _modes.firstWhere((m) => m.key == _active, orElse: () => _modes.first).text;

  Future<void> _copy(String text) async {
    await Clipboard.setData(ClipboardData(text: text));
    if (!mounted) return;
    setState(() => _copied = true);
    Future.delayed(const Duration(milliseconds: 1200), () {
      if (mounted) setState(() => _copied = false);
    });
  }

  void _setActive(String key) {
    setState(() => _active = key);
    Prefs.instance.copyMode = key;
  }

  @override
  Widget build(BuildContext context) {
    String t(String k) => I18n.t(widget.lang, k);
    return Container(
      decoration: slabDecoration(shadow: 4),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            children: [
              Expanded(
                child: InkWell(
                  onTap: () => _copy(_activeText),
                  child: Container(
                    constraints: const BoxConstraints(minHeight: 58),
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    alignment: Alignment.centerLeft,
                    child: Text(
                      (_copied ? t('copied') : t('copyResult')).toUpperCase(),
                      style: mono(13.5,
                          weight: FontWeight.w800, letterSpacing: 2.4),
                    ),
                  ),
                ),
              ),
              InkWell(
                onTap: () => setState(() => _expanded = !_expanded),
                child: Container(
                  constraints:
                      const BoxConstraints(minHeight: 58, minWidth: 52),
                  alignment: Alignment.center,
                  child: AnimatedRotation(
                    turns: _expanded ? 0.5 : 0,
                    duration: const Duration(milliseconds: 150),
                    child: Text('▾', style: mono(14, weight: FontWeight.w700)),
                  ),
                ),
              ),
            ],
          ),
          if (_expanded)
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  for (final m in _modes)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: Row(
                        children: [
                          InkWell(
                            onTap: () => _setActive(m.key),
                            child: Container(
                              width: 18,
                              height: 18,
                              decoration: BoxDecoration(
                                color:
                                    m.key == _active ? kInk : Colors.transparent,
                                border: Border.all(color: kInk, width: 2),
                              ),
                            ),
                          ),
                          const SizedBox(width: 10),
                          Expanded(
                            child: InkWell(
                              onTap: () => _setActive(m.key),
                              child: Text(m.text, style: mono(12.5)),
                            ),
                          ),
                          InkWell(
                            onTap: () => _copy(m.text),
                            child: Padding(
                              padding: const EdgeInsets.all(6),
                              child: Text('⧉',
                                  style: mono(15, weight: FontWeight.w700)),
                            ),
                          ),
                        ],
                      ),
                    ),
                  Text(
                    t('copyHelp').replaceAll('{icon}', '⧉'),
                    style: mono(10, color: kInk500),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}

/// Astro card — collapsible tile, starts collapsed; zodiac, eclipse, moon,
/// comet, supernova, conjunction rows + JDN meta (§3.2).
class AstroCard extends StatefulWidget {
  final String lang;
  final List<AstroItem> items;
  const AstroCard({super.key, required this.lang, required this.items});

  @override
  State<AstroCard> createState() => _AstroCardState();
}

class _AstroCardState extends State<AstroCard> {
  bool _expanded = false;

  @override
  Widget build(BuildContext context) {
    final hints = <String>[];
    for (final it in widget.items) {
      switch (it.kind) {
        case 'eclipse':
          hints.add('◐');
        case 'comet':
          hints.add('☄');
        case 'supernova':
          hints.add('✦');
        case 'conjunction':
          hints.add('✨');
      }
    }
    return TileToggle(
      title: I18n.t(widget.lang, 'astroLabel'),
      hints: hints.join(' '),
      expanded: _expanded,
      onTap: () => setState(() => _expanded = !_expanded),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          for (final it in widget.items)
            if (it.kind == 'jdn')
              Padding(
                padding: const EdgeInsets.only(top: 10),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('${I18n.t(widget.lang, 'jdn').toUpperCase()}  ',
                        style: mono(9,
                            color: kInk500,
                            weight: FontWeight.w700,
                            letterSpacing: 1)),
                    Expanded(child: Text(it.text, style: mono(11.5))),
                  ],
                ),
              )
            else
              Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        if (it.icon != null)
                          Padding(
                            padding: const EdgeInsets.only(right: 8),
                            child: Text(it.icon!, style: mono(14)),
                          ),
                        Expanded(
                            child:
                                Text(it.text, style: mono(12.5, height: 1.4))),
                      ],
                    ),
                    if (it.detail != null)
                      Padding(
                        padding: const EdgeInsets.only(top: 2, left: 22),
                        child: Text(it.detail!,
                            style: mono(10.5, color: kInk500)),
                      ),
                    if (it.note != null)
                      Padding(
                        padding: const EdgeInsets.only(top: 4, left: 22),
                        child: Text(it.note!,
                            style: mono(10.5, color: kInk600, height: 1.4)),
                      ),
                    if (it.linkHref != null)
                      Padding(
                        padding: const EdgeInsets.only(top: 4, left: 22),
                        child: InkWell(
                          onTap: () => launchUrl(Uri.parse(it.linkHref!),
                              mode: LaunchMode.externalApplication),
                          child: Text(
                            it.linkLabel ?? it.linkHref!,
                            style: mono(11,
                                    weight: FontWeight.w700, color: kInk)
                                .copyWith(
                                    decoration: TextDecoration.underline),
                          ),
                        ),
                      ),
                  ],
                ),
              ),
        ],
      ),
    );
  }
}

/// History panel — tile with entries + Clear (§5). Auto-expand handled by
/// the parent via [expanded]/[onToggle].
class HistoryPanel extends StatelessWidget {
  final String lang;
  final List<HistoryEntry> entries;
  final bool expanded;
  final VoidCallback onToggle;
  final ValueChanged<HistoryEntry> onRestore;
  final VoidCallback onClear;
  const HistoryPanel({
    super.key,
    required this.lang,
    required this.entries,
    required this.expanded,
    required this.onToggle,
    required this.onRestore,
    required this.onClear,
  });

  @override
  Widget build(BuildContext context) {
    return TileToggle(
      title: I18n.t(lang, 'history'),
      expanded: expanded,
      onTap: onToggle,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          for (final e in entries)
            Builder(builder: (context) {
              final s = buildHistorySummary(
                  lang, e.fromCal, e.toCal, e.year, e.month, e.day);
              return InkWell(
                onTap: () => onRestore(e),
                child: Container(
                  constraints: const BoxConstraints(minHeight: 44),
                  padding: const EdgeInsets.symmetric(vertical: 6),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SizedBox(
                        width: 126,
                        child: Text(s.src,
                            style: mono(10.5, weight: FontWeight.w700)),
                      ),
                      Expanded(
                        child:
                            Text(s.res, style: mono(10.5, color: kInk600)),
                      ),
                    ],
                  ),
                ),
              );
            }),
          Align(
            alignment: Alignment.centerRight,
            child: TextButton(
              onPressed: () async {
                final ok = await showDialog<bool>(
                  context: context,
                  builder: (ctx) => AlertDialog(
                    backgroundColor: kSurface,
                    shape: const RoundedRectangleBorder(
                        side: BorderSide(color: kInk, width: 2.5)),
                    content: Text(I18n.t(lang, 'clearHistoryConfirm'),
                        style: mono(13)),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(ctx, false),
                        child: Text('✕', style: mono(14, color: kInk600)),
                      ),
                      TextButton(
                        onPressed: () => Navigator.pop(ctx, true),
                        child: Text('OK',
                            style: mono(14, weight: FontWeight.w800)),
                      ),
                    ],
                  ),
                );
                if (ok == true) onClear();
              },
              child: Text(
                I18n.t(lang, 'clearHistory').toUpperCase(),
                style: mono(10.5,
                    weight: FontWeight.w700,
                    color: kInk600,
                    letterSpacing: 1.2),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

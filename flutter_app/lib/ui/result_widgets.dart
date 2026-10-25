// Result panel, copy accordion, astro card, history panel — the mobile
// result stack of index.html (§3 of the UI spec).

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart';

import '../engine/registry.dart';
import '../i18n/i18n.dart';
import '../i18n/mobile_i18n.dart';
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
    final wide = isWide(context);
    final secondary = out.secondaryCal;
    return Container(
      decoration: slabDecoration(border: kBorderResult, shadow: wide ? 8 : 6),
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Padding(
            padding: wide
                ? const EdgeInsets.fromLTRB(36, 36, 36, 28)
                : const EdgeInsets.fromLTRB(18, 20, 18, 18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Wide layout: variant toggles on top. Phone: under the date,
                // with a caption saying whose variant it is (TASK-15).
                if (wide && secondary != null && onVariantTap != null)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: _variantButtons(secondary),
                  ),
                if (out.isSingle)
                  ...(wide ? _single(wide) : _singlePhone())
                else
                  ..._range(wide),
                if (!wide && secondary != null && onVariantTap != null)
                  Padding(
                    padding: const EdgeInsets.only(top: 12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '${I18n.calendarName(lang, secondary.id)} · '
                                  '${kVariantLabels[secondary.variant] ?? secondary.variant}'
                              .toUpperCase(),
                          style: mono(9.5,
                              weight: FontWeight.w700,
                              color: kInk600,
                              letterSpacing: 1.5),
                        ),
                        const SizedBox(height: 4),
                        _variantButtons(secondary),
                      ],
                    ),
                  ),
                if (out.copyData.defaultText.isNotEmpty)
                  wide
                      ? CopyTrio(lang: lang, data: out.copyData)
                      : CopyMenu(lang: lang, data: out.copyData),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _variantButtons(WebCalendar secondary) => Wrap(
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
      );

  // Lines under the date that belong to the target calendar (variants,
  // indiction, animal year, Babylonian note) — shared by both layouts.
  List<Widget> _extras() => [
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

  // Phone, single day: day + month on one line, the year (with a black
  // calendar tag) under it on the signal rule, then the source date in a
  // readable colour. A long Hijri month name shrinks instead of wrapping.
  List<Widget> _singlePhone() {
    final detail = out.tgtDetail ?? '';
    final year = out.tgtYearStr ?? out.tgtFullText!;
    return [
      if (detail.isNotEmpty)
        FittedBox(
          fit: BoxFit.scaleDown,
          alignment: Alignment.centerLeft,
          child: Text(detail, style: mono(30, weight: FontWeight.w900, height: 1.05)),
        ),
      Container(
        decoration: const BoxDecoration(
            border: Border(bottom: BorderSide(color: kSignal, width: 3))),
        padding: const EdgeInsets.only(bottom: 4),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Flexible(
              child: Text(year,
                  style: mono(30, weight: FontWeight.w900, height: 1.1)),
            ),
            if (out.tgtTag.isNotEmpty) ...[
              const SizedBox(width: 8),
              Container(
                color: kInk,
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                child: Text(out.tgtTag,
                    style: mono(11,
                        weight: FontWeight.w700,
                        color: kWhite,
                        letterSpacing: 0.6)),
              ),
            ],
          ],
        ),
      ),
      const SizedBox(height: 8),
      Text(
        '← ${out.srcFullText!}${out.srcTag.isEmpty ? '' : ' ${out.srcTag}'}',
        style: mono(12.5, color: kInk700),
      ),
      ..._extras(),
    ];
  }

  List<Widget> _single(bool wide) {
    return [
      // Target full date — big, black 3px underline.
      Container(
        decoration: BoxDecoration(
          border: Border(
              bottom: BorderSide(color: wide ? kInk : kSignal, width: 3)),
        ),
        padding: const EdgeInsets.only(bottom: 4),
        child: Text.rich(
          TextSpan(
            style: mono(26, weight: FontWeight.w900, height: 1.15),
            children: [
              TextSpan(text: out.tgtFullText!),
              if (out.tgtTag.isNotEmpty)
                WidgetSpan(
                  alignment: PlaceholderAlignment.top,
                  child: Padding(
                    padding: const EdgeInsets.only(left: 6, top: 2),
                    child: Text(out.tgtTag,
                        style: mono(11,
                            weight: FontWeight.w700,
                            color: kSignal,
                            letterSpacing: 0.4)),
                  ),
                ),
            ],
          ),
        ),
      ),
      const SizedBox(height: 6),
      Text(
        out.srcTag.isEmpty
            ? out.srcFullText!
            : '${out.srcFullText!} ${out.srcTag}',
        style: mono(11, color: kInk400),
      ),
      ..._extras(),
    ];
  }

  // Wide layout: each range year sits on a 3px black rule (`.bridge-year`).
  // Phone: same rule in the signal colour.
  Widget _yearUnderline(bool wide, Widget year) => Container(
        decoration: BoxDecoration(
            border: Border(
                bottom: BorderSide(color: wide ? kInk : kSignal, width: 3))),
        padding: const EdgeInsets.only(bottom: 2),
        child: year,
      );

  List<Widget> _range(bool wide) {
    return [
      Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _yearUnderline(
                  wide,
                  FittedBox(
                    fit: BoxFit.scaleDown,
                    alignment: Alignment.centerLeft,
                    child: Text(out.startYearStr!,
                        style: mono(38, weight: FontWeight.w900, height: 1.05)),
                  ),
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
              // Phone: the end year starts at its column's left edge (TASK-15).
              crossAxisAlignment:
                  wide ? CrossAxisAlignment.end : CrossAxisAlignment.start,
              children: [
                _yearUnderline(
                  wide,
                  FittedBox(
                    fit: BoxFit.scaleDown,
                    alignment: wide ? Alignment.centerRight : Alignment.centerLeft,
                    child: Text(out.endYearStr!,
                        style: mono(38, weight: FontWeight.w900, height: 1.05)),
                  ),
                ),
                Text(out.endDetail!, style: mono(11, color: kInk600)),
              ],
            ),
          ),
        ],
      ),
      if (out.bridgeEq != null)
        Padding(
          padding: const EdgeInsets.only(top: 6),
          child: Text(out.bridgeEq!, style: mono(12.5, color: kInk500)),
        ),
      const SizedBox(height: 12),
      Text('${out.spanStartStr} – ${out.spanEndStr}',
          style: mono(12.5, color: kInk700)),
    ];
  }
}

/// Row of copy buttons under the result, one per format — `.copy-trio`.
/// Formats that would repeat an earlier one are skipped.
class CopyTrio extends StatefulWidget {
  final String lang;
  final CopyData data;
  const CopyTrio({super.key, required this.lang, required this.data});

  @override
  State<CopyTrio> createState() => _CopyTrioState();
}

class _CopyTrioState extends State<CopyTrio> {
  String? _copiedText;

  List<String> get _texts {
    final seen = <String>{};
    return [
      widget.data.defaultText,
      widget.data.yearOnlyText,
      widget.data.yearPairText,
    ].whereType<String>().where((t) => t.isNotEmpty && seen.add(t)).toList();
  }

  Future<void> _copy(String text) async {
    await Clipboard.setData(ClipboardData(text: text));
    if (!mounted) return;
    setState(() => _copiedText = text);
    Future.delayed(const Duration(milliseconds: 1200), () {
      if (mounted && _copiedText == text) setState(() => _copiedText = null);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 14),
      child: Wrap(
        spacing: 8,
        runSpacing: 6,
        children: [
          for (final text in _texts)
            _CopyTrioButton(
              label: _copiedText == text
                  ? I18n.t(widget.lang, 'copied')
                  : text,
              copied: _copiedText == text,
              onTap: () => _copy(text),
            ),
        ],
      ),
    );
  }
}

class _CopyTrioButton extends StatefulWidget {
  final String label;
  final bool copied;
  final VoidCallback onTap;
  const _CopyTrioButton(
      {required this.label, required this.copied, required this.onTap});

  @override
  State<_CopyTrioButton> createState() => _CopyTrioButtonState();
}

class _CopyTrioButtonState extends State<_CopyTrioButton> {
  bool _hot = false; // hover / focus / press → inverted

  @override
  Widget build(BuildContext context) {
    final bg = widget.copied ? kSignal : (_hot ? kInk : kSurface);
    final fg = (widget.copied || _hot) ? kWhite : kInk;
    return InkWell(
      onTap: widget.onTap,
      onHover: (v) => setState(() => _hot = v),
      onFocusChange: (v) => setState(() => _hot = v),
      child: Container(
        constraints: const BoxConstraints(minHeight: 40),
        padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 6),
        decoration: BoxDecoration(
          color: bg,
          border: Border.all(
              color: widget.copied ? kSignal : kInk, width: kBorderSubtle),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.copy_rounded, size: 15, color: fg),
            const SizedBox(width: 7),
            Flexible(
              child: Text(widget.label,
                  style: mono(12.5, weight: FontWeight.w700, color: fg)),
            ),
          ],
        ),
      ),
    );
  }
}

/// Astro card — collapsible tile, starts collapsed; zodiac, eclipse, moon,
/// comet, supernova, conjunction rows + JDN meta (§3.2).
class AstroCard extends StatefulWidget {
  final String lang;
  final List<AstroItem> items;
  /// Only the content, without the collapsible tile (used inside wide tabs).
  final bool bare;
  const AstroCard(
      {super.key, required this.lang, required this.items, this.bare = false});

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
    final tile = TileToggle(
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
    return widget.bare ? tile.child : tile;
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
  final bool bare;
  const HistoryPanel({
    super.key,
    required this.lang,
    required this.entries,
    required this.expanded,
    required this.onToggle,
    required this.onRestore,
    required this.onClear,
    this.bare = false,
  });

  @override
  Widget build(BuildContext context) {
    final tile = TileToggle(
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
    return bare ? tile.child : tile;
  }
}


/// "Other contemporaneous calendars" — `.contextual-list`: calendar name
/// (links to its page), bold year(s), day + month.
class ContextualList extends StatelessWidget {
  final List<ContextRow> rows;
  final void Function(String calId)? onOpenCalendarPage;
  const ContextualList({super.key, required this.rows, this.onOpenCalendarPage});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        for (final r in rows)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 5),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.baseline,
              textBaseline: TextBaseline.alphabetic,
              children: [
                SizedBox(
                  width: 190,
                  child: InkWell(
                    onTap: () => onOpenCalendarPage?.call(r.calId),
                    child: Text(
                      r.label.toUpperCase(),
                      style: mono(10.5,
                              color: kInk600,
                              weight: FontWeight.w700,
                              letterSpacing: 0.6)
                          .copyWith(decoration: TextDecoration.underline),
                    ),
                  ),
                ),
                SizedBox(
                  width: 120,
                  child: Text(r.yearStr,
                      style: mono(12.5, weight: FontWeight.w800)),
                ),
                Expanded(
                  child: Text(r.datesStr, style: mono(12, color: kInk600)),
                ),
              ],
            ),
          ),
      ],
    );
  }
}

/// Month breakdown — `.year-table`: source month, target start/end, days.
class BreakdownTable extends StatelessWidget {
  final String lang;
  final String srcId;
  final String tgtId;
  final List<BreakdownRow> rows;
  const BreakdownTable({
    super.key,
    required this.lang,
    required this.srcId,
    required this.tgtId,
    required this.rows,
  });

  @override
  Widget build(BuildContext context) {
    final head = mono(10.5,
        weight: FontWeight.w800, color: kInk600, letterSpacing: 0.6);
    final tgt = shortCalName(tgtId);
    Widget cell(String text, TextStyle st, {int flex = 1, TextAlign? align}) =>
        Expanded(
            flex: flex,
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 6),
              child: Text(text, style: st, textAlign: align),
            ));
    return Column(
      children: [
        Container(
          decoration: const BoxDecoration(
              border: Border(bottom: BorderSide(color: kInk, width: 2))),
          child: Row(children: [
            cell(shortCalName(srcId), head, flex: 3),
            cell('$tgt (${I18n.t(lang, 'rangeStart')})', head, flex: 3),
            cell('$tgt (${I18n.t(lang, 'rangeEnd')})', head, flex: 3),
            cell(I18n.t(lang, 'totalDays'), head,
                flex: 1, align: TextAlign.end),
          ]),
        ),
        for (final r in rows)
          Container(
            decoration: const BoxDecoration(
                border: Border(bottom: BorderSide(color: kSurface2, width: 1.5))),
            child: Row(children: [
              cell(r.srcName, mono(12, weight: FontWeight.w700), flex: 3),
              cell(r.startStr, mono(12), flex: 3),
              cell(r.endStr, mono(12), flex: 3),
              cell('${r.days}', mono(12), flex: 1, align: TextAlign.end),
            ]),
          ),
      ],
    );
  }
}

/// Phone copy control (TASK-15): one signal "Copy" button for the full text
/// plus a ▾ button that opens a "Copy as" sheet with every distinct format
/// and what it is called. Replaces the row of text-labelled buttons.
class CopyMenu extends StatefulWidget {
  final String lang;
  final CopyData data;
  const CopyMenu({super.key, required this.lang, required this.data});

  @override
  State<CopyMenu> createState() => _CopyMenuState();
}

class _CopyMenuState extends State<CopyMenu> {
  bool _copied = false;

  /// (label, text) pairs, formats that repeat an earlier one are skipped.
  List<(String, String)> get _items {
    final single = widget.data.kind == 'single';
    String l(String k) => MobileI18n.t(widget.lang, k);
    final all = <(String, String?)>[
      (single ? l('fmtFull') : l('fmtRange'), widget.data.defaultText),
      (single ? l('fmtYear') : l('fmtYears'), widget.data.yearOnlyText),
      (l('fmtPair'), widget.data.yearPairText),
    ];
    final seen = <String>{};
    return [
      for (final (label, text) in all)
        if (text != null && text.isNotEmpty && seen.add(text)) (label, text),
    ];
  }

  Future<void> _copy(String text) async {
    await Clipboard.setData(ClipboardData(text: text));
    if (!mounted) return;
    setState(() => _copied = true);
    Future.delayed(const Duration(milliseconds: 1200), () {
      if (mounted) setState(() => _copied = false);
    });
  }

  Future<void> _openSheet(List<(String, String)> items) async {
    final text = await showModalBottomSheet<String>(
      context: context,
      backgroundColor: kSurface,
      shape: const RoundedRectangleBorder(),
      builder: (ctx) => Container(
        decoration: const BoxDecoration(
          border: Border(top: BorderSide(color: kInk, width: 3)),
        ),
        child: SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(18, 14, 18, 6),
                child: Text(
                  MobileI18n.t(widget.lang, 'copyAs').toUpperCase(),
                  style: mono(11,
                      weight: FontWeight.w800,
                      color: kInk600,
                      letterSpacing: 1.4),
                ),
              ),
              for (final (label, text) in items)
                InkWell(
                  onTap: () => Navigator.of(ctx).pop(text),
                  child: Container(
                    constraints: const BoxConstraints(minHeight: 58),
                    padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 8),
                    child: Row(
                      children: [
                        Expanded(
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(label.toUpperCase(),
                                  style: mono(10,
                                      color: kInk500,
                                      weight: FontWeight.w700,
                                      letterSpacing: 1)),
                              const SizedBox(height: 2),
                              Text(text, style: mono(14, weight: FontWeight.w700)),
                            ],
                          ),
                        ),
                        const Icon(Icons.copy_rounded, size: 18, color: kInk),
                      ],
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
    if (text != null) _copy(text);
  }

  @override
  Widget build(BuildContext context) {
    final items = _items;
    if (items.isEmpty) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.only(top: 14),
      child: Row(
        children: [
          Expanded(
            child: Material(
              color: kSignal,
              child: InkWell(
                onTap: () => _copy(items.first.$2),
                child: Container(
                  constraints: const BoxConstraints(minHeight: 46),
                  alignment: Alignment.center,
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.copy_rounded, size: 16, color: kWhite),
                      const SizedBox(width: 8),
                      Text(
                        (_copied
                                ? I18n.t(widget.lang, 'copied')
                                : MobileI18n.t(widget.lang, 'copy'))
                            .toUpperCase(),
                        style: mono(13,
                            weight: FontWeight.w800,
                            color: kWhite,
                            letterSpacing: 1.6),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
          if (items.length > 1) ...[
            const SizedBox(width: 8),
            InkWell(
              onTap: () => _openSheet(items),
              child: Container(
                width: 46,
                height: 46,
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: kSurface,
                  border: Border.all(color: kInk, width: kBorderSubtle),
                ),
                child: Text('▾', style: mono(15, weight: FontWeight.w700)),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

/// Phone version of the "Other calendars" list (TASK-15): two columns of
/// tiles — small calendar name, big year, date — so nothing is squeezed into
/// a fixed-width column. A tile opens the calendar's page.
class ContextualTiles extends StatelessWidget {
  final List<ContextRow> rows;
  final void Function(String calId)? onOpenCalendarPage;
  const ContextualTiles({super.key, required this.rows, this.onOpenCalendarPage});

  Widget _tile(ContextRow r) => InkWell(
        onTap: () => onOpenCalendarPage?.call(r.calId),
        child: Container(
          decoration:
              BoxDecoration(border: Border.all(color: kInk, width: 1.5)),
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 9),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(r.label.toUpperCase(),
                  style: mono(9,
                      color: kInk600,
                      weight: FontWeight.w700,
                      letterSpacing: 0.5)),
              const SizedBox(height: 2),
              FittedBox(
                fit: BoxFit.scaleDown,
                alignment: Alignment.centerLeft,
                child: Text(r.yearStr,
                    style: mono(20, weight: FontWeight.w900, height: 1.15)),
              ),
              Text(r.datesStr, style: mono(11.5, color: kInk600)),
            ],
          ),
        ),
      );

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        for (var i = 0; i < rows.length; i += 2)
          Padding(
            padding: EdgeInsets.only(bottom: i + 2 < rows.length ? 8 : 0),
            child: IntrinsicHeight(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Expanded(child: _tile(rows[i])),
                  const SizedBox(width: 8),
                  Expanded(
                      child: i + 1 < rows.length
                          ? _tile(rows[i + 1])
                          : const SizedBox.shrink()),
                ],
              ),
            ),
          ),
      ],
    );
  }
}

/// Phone version of the month breakdown (TASK-15): the target year is a group
/// heading printed once; rows hold month name, day range and length. A month
/// that runs into the next year carries that year after its end date.
class BreakdownGroups extends StatelessWidget {
  final List<BreakdownRow> rows;
  const BreakdownGroups({super.key, required this.rows});

  @override
  Widget build(BuildContext context) {
    final children = <Widget>[];
    int? group;
    for (final r in rows) {
      if (r.startYear != group) {
        group = r.startYear;
        children.add(Container(
          width: double.infinity,
          padding: EdgeInsets.fromLTRB(0, children.isEmpty ? 0 : 10, 0, 4),
          decoration: const BoxDecoration(
              border: Border(bottom: BorderSide(color: kInk, width: 2))),
          child: Text('$group', style: mono(15, weight: FontWeight.w900)),
        ));
      }
      final end = r.endYear == group ? r.endDM : '${r.endDM} ${r.endYear}';
      children.add(Container(
        padding: const EdgeInsets.symmetric(vertical: 6),
        decoration: const BoxDecoration(
            border: Border(bottom: BorderSide(color: kSurface2, width: 1.5))),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.baseline,
          textBaseline: TextBaseline.alphabetic,
          children: [
            SizedBox(
              width: 118,
              child: Text(r.srcName, style: mono(12, weight: FontWeight.w700)),
            ),
            Expanded(child: Text('${r.startDM} – $end', style: mono(12))),
            const SizedBox(width: 8),
            Text('${r.days}', style: mono(11, color: kInk500)),
          ],
        ),
      ));
    }
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: children);
  }
}

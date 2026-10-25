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
///
/// Phone (TASK-16): one card. When the form is folded the card starts with
/// the source ("FROM · Hijri", the date, a CHANGE button), then a rule, then
/// the result on a black block — each date appears once. Wide stays as it was.
class ResultPanel extends StatelessWidget {
  final String lang;
  final ConvertOutput out;
  final void Function(WebCalendar cal, String variant)? onVariantTap;

  /// Phone only: name of the source calendar and of the target ("AD") for the
  /// FROM / TO captions, and the CHANGE action. A null [onChange] means the
  /// form is open above the card, so the source part is left out.
  final String? srcLabel;
  final String? tgtLabel;
  final VoidCallback? onChange;
  const ResultPanel({
    super.key,
    required this.lang,
    required this.out,
    this.onVariantTap,
    this.srcLabel,
    this.tgtLabel,
    this.onChange,
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
                : const EdgeInsets.fromLTRB(18, 18, 18, 18),
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
                if (wide)
                  ...(out.isSingle ? _single() : _range())
                else
                  ..._phoneBody(),
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
                          style: sans(10,
                              weight: FontWeight.w700,
                              color: kInk600,
                              letterSpacing: 1.2),
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
  List<Widget> _extras({bool useSans = false}) => [
        for (final line in out.altLines)
          Padding(
            padding: const EdgeInsets.only(top: 8),
            child: Text(line, style: face(useSans, 11.5, color: kInk600)),
          ),
        if (out.indictionLine != null)
          Padding(
            padding: const EdgeInsets.only(top: 8),
            child:
                Text(out.indictionLine!, style: face(useSans, 12, color: kInk700)),
          ),
        if (out.animalLine != null)
          Padding(
            padding: const EdgeInsets.only(top: 8),
            child: Text(out.animalLine!, style: face(useSans, 12, color: kInk700)),
          ),
        if (out.babylonianNote != null)
          Padding(
            padding: const EdgeInsets.only(top: 10),
            child: Text(out.babylonianNote!,
                style: face(useSans, 10.5, color: kInk600, height: 1.4)),
          ),
      ];

  // ---- phone ----

  List<Widget> _phoneBody() {
    return [
      if (onChange != null) ..._phoneSource(),
      if (onChange != null && tgtLabel != null)
        Padding(
          padding: const EdgeInsets.only(bottom: 6),
          child: Text(
            '${I18n.t(lang, 'toLabel')} · $tgtLabel'.toUpperCase(),
            style: sans(10,
                weight: FontWeight.w700, color: kInk600, letterSpacing: 1.4),
          ),
        ),
      Container(
        width: double.infinity,
        color: kInk,
        padding: const EdgeInsets.fromLTRB(14, 12, 14, 12),
        child: out.isSingle ? _phoneSingle() : _phoneRange(),
      ),
      ..._extras(useSans: true),
    ];
  }

  // "FROM · Hijri / 10 Ramaḍān 1445 AH   [CHANGE ▾]", then a rule.
  List<Widget> _phoneSource() {
    final src =
        '${out.srcFullText ?? ''}${out.srcTag.isEmpty ? '' : ' ${out.srcTag}'}';
    return [
      Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '${I18n.t(lang, 'labelFrom')}${srcLabel == null ? '' : ' · $srcLabel'}'
                      .toUpperCase(),
                  style: sans(10,
                      weight: FontWeight.w700,
                      color: kInk600,
                      letterSpacing: 1.4),
                ),
                const SizedBox(height: 3),
                Text(src,
                    style: sans(18, weight: FontWeight.w700, height: 1.25)),
              ],
            ),
          ),
          const SizedBox(width: 10),
          InkWell(
            onTap: onChange,
            child: Container(
              color: kSignal,
              constraints: const BoxConstraints(minHeight: 44),
              padding: const EdgeInsets.symmetric(horizontal: 14),
              alignment: Alignment.center,
              child: Text(
                '${MobileI18n.t(lang, 'change').toUpperCase()} ▾',
                style: sans(11,
                    weight: FontWeight.w700, color: kWhite, letterSpacing: 1.2),
              ),
            ),
          ),
        ],
      ),
      Container(
        margin: const EdgeInsets.symmetric(vertical: 12),
        height: kBorderSlab,
        color: kInk,
      ),
    ];
  }

  // Single day on the black block: day + month (shrinks instead of wrapping),
  // then the year with its calendar tag as a white chip.
  Widget _phoneSingle() {
    final detail = out.tgtDetail ?? '';
    final year = out.tgtYearStr ?? out.tgtFullText!;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (detail.isNotEmpty)
          FittedBox(
            fit: BoxFit.scaleDown,
            alignment: Alignment.centerLeft,
            child: Text(detail,
                style: sans(30, weight: FontWeight.w700, color: kWhite, height: 1.1)),
          ),
        Row(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Flexible(
              child: Text(year,
                  style: sans(30, weight: FontWeight.w700, color: kWhite, height: 1.15)),
            ),
            if (out.tgtTag.isNotEmpty) ...[
              const SizedBox(width: 8),
              Container(
                color: kWhite,
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                child: Text(out.tgtTag,
                    style: sans(11,
                        weight: FontWeight.w700, color: kInk, letterSpacing: 0.6)),
              ),
            ],
          ],
        ),
      ],
    );
  }

  // Year / month range on the black block: the two years with their day and
  // month. The equation and the full span are left out — the source is in the
  // card above and the whole span is one tap away in the copy menu.
  Widget _phoneRange() {
    Widget end(String year, String detail) => Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              FittedBox(
                fit: BoxFit.scaleDown,
                alignment: Alignment.centerLeft,
                child: Text(year,
                    style: mono(38, weight: FontWeight.w900, color: kWhite, height: 1.05)),
              ),
              Text(detail, style: sans(12, color: kSurface2)),
            ],
          ),
        );
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        end(out.startYearStr!, out.startDetail!),
        Padding(
          padding: const EdgeInsets.fromLTRB(8, 8, 8, 0),
          child: Text('→',
              style: sans(22, weight: FontWeight.w700, color: kWhite)),
        ),
        end(out.endYearStr!, out.endDetail!),
      ],
    );
  }

  // ---- wide ----

  List<Widget> _single() {
    return [
      // Target full date — big, black 3px underline.
      Container(
        decoration: const BoxDecoration(
          border: Border(bottom: BorderSide(color: kInk, width: 3)),
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

  // Each range year sits on a 3px black rule (`.bridge-year`).
  Widget _yearUnderline(Widget year) => Container(
        decoration: const BoxDecoration(
            border: Border(bottom: BorderSide(color: kInk, width: 3))),
        padding: const EdgeInsets.only(bottom: 2),
        child: year,
      );

  List<Widget> _range() {
    return [
      Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _yearUnderline(
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
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                _yearUnderline(
                  FittedBox(
                    fit: BoxFit.scaleDown,
                    alignment: Alignment.centerRight,
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
  /// Phone: Noto Sans for the text, mono only for the JDN (TASK-16).
  final bool phone;
  const AstroCard(
      {super.key,
      required this.lang,
      required this.items,
      this.bare = false,
      this.phone = false});

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
                        style: face(widget.phone, 9,
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
                            child: Text(it.icon!, style: face(widget.phone, 14)),
                          ),
                        Expanded(
                            child:
                                Text(it.text, style: face(widget.phone, 12.5, height: 1.4))),
                      ],
                    ),
                    if (it.detail != null)
                      Padding(
                        padding: const EdgeInsets.only(top: 2, left: 22),
                        child: Text(it.detail!,
                            style: face(widget.phone, 10.5, color: kInk500)),
                      ),
                    if (it.note != null)
                      Padding(
                        padding: const EdgeInsets.only(top: 4, left: 22),
                        child: Text(it.note!,
                            style: face(widget.phone, 10.5, color: kInk600, height: 1.4)),
                      ),
                    if (it.linkHref != null)
                      Padding(
                        padding: const EdgeInsets.only(top: 4, left: 22),
                        child: InkWell(
                          onTap: () => launchUrl(Uri.parse(it.linkHref!),
                              mode: LaunchMode.externalApplication),
                          child: Text(
                            it.linkLabel ?? it.linkHref!,
                            style: face(widget.phone, 11,
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
  final bool phone; // Noto Sans for the entries (TASK-16)
  const HistoryPanel({
    super.key,
    required this.lang,
    required this.entries,
    required this.expanded,
    required this.onToggle,
    required this.onRestore,
    required this.onClear,
    this.bare = false,
    this.phone = false,
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
                            style: face(phone, 10.5, weight: FontWeight.w700)),
                      ),
                      Expanded(
                        child:
                            Text(s.res, style: face(phone, 10.5, color: kInk600)),
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
                        style: face(phone, 13)),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(ctx, false),
                        child: Text('✕', style: face(phone, 14, color: kInk600)),
                      ),
                      TextButton(
                        onPressed: () => Navigator.pop(ctx, true),
                        child: Text('OK',
                            style: face(phone, 14, weight: FontWeight.w800)),
                      ),
                    ],
                  ),
                );
                if (ok == true) onClear();
              },
              child: Text(
                I18n.t(lang, 'clearHistory').toUpperCase(),
                style: face(phone, 10.5,
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
                  style: sans(11,
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
                                  style: sans(10,
                                      color: kInk500,
                                      weight: FontWeight.w700,
                                      letterSpacing: 1)),
                              const SizedBox(height: 2),
                              Text(text, style: sans(14, weight: FontWeight.w700)),
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
                        style: sans(13,
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
                child: Text('▾', style: sans(15, weight: FontWeight.w700)),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

/// Phone version of the "Other calendars" list (TASK-16): two columns, no
/// frames — thin rules between rows, small calendar name, big year, date. A
/// cell opens the calendar's page.
class ContextualPlain extends StatelessWidget {
  final List<ContextRow> rows;
  final void Function(String calId)? onOpenCalendarPage;
  const ContextualPlain({super.key, required this.rows, this.onOpenCalendarPage});

  Widget _cell(ContextRow? r) {
    if (r == null) return const SizedBox.shrink();
    return InkWell(
      onTap: () => onOpenCalendarPage?.call(r.calId),
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 9),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(r.label.toUpperCase(),
                style: sans(9.5,
                    color: kInk600, weight: FontWeight.w700, letterSpacing: 0.5)),
            const SizedBox(height: 2),
            FittedBox(
              fit: BoxFit.scaleDown,
              alignment: Alignment.centerLeft,
              child: Text(r.yearStr,
                  style: sans(18, weight: FontWeight.w700, height: 1.15)),
            ),
            Text(r.datesStr, style: sans(12, color: kInk600)),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        for (var i = 0; i < rows.length; i += 2)
          Container(
            decoration: BoxDecoration(
                border: i == 0
                    ? null
                    : const Border(top: BorderSide(color: kSurface2, width: 1.5))),
            child: IntrinsicHeight(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Expanded(child: _cell(rows[i])),
                  const SizedBox(width: 18),
                  Expanded(child: _cell(i + 1 < rows.length ? rows[i + 1] : null)),
                ],
              ),
            ),
          ),
      ],
    );
  }
}

/// Section heading of the phone result box: "OTHER CALENDARS ......... 6".
class PhoneSectionHeading extends StatelessWidget {
  final String title;
  final String? hint;
  const PhoneSectionHeading({super.key, required this.title, this.hint});

  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.only(bottom: 4),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.baseline,
          textBaseline: TextBaseline.alphabetic,
          children: [
            Expanded(
              child: Text(title.toUpperCase(),
                  style: sans(11,
                      weight: FontWeight.w700, color: kInk700, letterSpacing: 1.3)),
            ),
            if (hint != null && hint!.isNotEmpty)
              Text(hint!, style: sans(11, color: kInk500)),
          ],
        ),
      );
}

/// Collapsed row of the phone result box (TASK-16): title, a short hint and a
/// ▸ / ▴ chevron. The body shows under it while [open].
class PhoneFoldRow extends StatelessWidget {
  final String title;
  final String? hint;
  final bool open;
  final VoidCallback onTap;
  final Widget body;
  const PhoneFoldRow({
    super.key,
    required this.title,
    this.hint,
    required this.open,
    required this.onTap,
    required this.body,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        InkWell(
          onTap: onTap,
          child: Container(
            constraints: const BoxConstraints(minHeight: 52),
            padding: const EdgeInsets.symmetric(horizontal: 16),
            decoration: const BoxDecoration(
                border: Border(top: BorderSide(color: kInk, width: kBorderSlab))),
            child: Row(
              children: [
                Expanded(
                  child: Text(title.toUpperCase(),
                      style: sans(12,
                          weight: FontWeight.w700, letterSpacing: 1.4)),
                ),
                if (hint != null && hint!.isNotEmpty)
                  Padding(
                    padding: const EdgeInsets.only(right: 10),
                    child: Text(hint!, style: sans(12, color: kInk500)),
                  ),
                Text(open ? '▴' : '▸', style: sans(13, weight: FontWeight.w700)),
              ],
            ),
          ),
        ),
        if (open)
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 4, 16, 16),
            child: body,
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
              child: Text(r.srcName, style: sans(12.5, weight: FontWeight.w700)),
            ),
            Expanded(child: Text('${r.startDM} – $end', style: sans(12.5))),
            const SizedBox(width: 8),
            Text('${r.days}', style: mono(11, color: kInk500)),
          ],
        ),
      ));
    }
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: children);
  }
}

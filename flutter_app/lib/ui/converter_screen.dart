// Converter screen — 1:1 port of the mobile index.html flow (§1.1–§2 of
// the UI spec): slab order, refine-after-convert state machine, history,
// variant toggles, astro card.

import 'package:flutter/material.dart';

import '../engine/registry.dart';
import '../i18n/i18n.dart';
import '../logic/convert.dart';
import '../state/prefs.dart';
import 'calendar_picker.dart';
import 'result_widgets.dart';
import 'tokens.dart';
import 'widgets.dart';

class ConverterScreen extends StatefulWidget {
  final String lang;
  final void Function(String calId)? onOpenCalendarPage;
  const ConverterScreen({
    super.key,
    required this.lang,
    this.onOpenCalendarPage,
  });

  @override
  State<ConverterScreen> createState() => ConverterScreenState();
}

class ConverterScreenState extends State<ConverterScreen> {
  late String _fromId;
  String? _toId; // null = implicit Gregorian (empty TO input on the web)
  final _yearCtl = TextEditingController();
  final _dayCtl = TextEditingController();
  int? _month;

  ConvertOutput? _out;
  List<ContextRow> _ctx = const [];
  String? _tab; // active tab of the wide tile box: ctx | astro | bd | hist
  String? _error;
  bool _historyExpanded = false;

  String get _lang => widget.lang;

  @override
  void initState() {
    super.initState();
    Prefs.instance.applyVariants();
    _fromId = Prefs.instance.fromCal;
    _historyExpanded = Prefs.instance.history.isNotEmpty;
  }

  @override
  void dispose() {
    _yearCtl.dispose();
    _dayCtl.dispose();
    super.dispose();
  }

  WebCalendar get _src => kWebCalendars[_fromId]!;
  WebCalendar get _tgt => kWebCalendars[_toId ?? 'gregorian']!;
  bool get _hasResult => _out != null;

  void _setOut(ConvertOutput out) {
    _out = out;
    _ctx = contextualRows(out.jd, out.jdEnd, _src.id, _tgt.id, _lang);
  }

  void _clearError() {
    if (_error != null) setState(() => _error = null);
  }

  int? get _day {
    final d = int.tryParse(_dayCtl.text.trim());
    return (d == null || d == 0) ? null : d;
  }

  void _convert() {
    final year = int.tryParse(_yearCtl.text.trim());
    try {
      if (year == null || year < 1) {
        throw ConvertException(I18n.t(_lang, 'errNoYear'), 'year');
      }
      final out = convert(
        src: _src,
        tgt: _tgt,
        year: year,
        month: _month,
        day: _day,
        lang: _lang,
      );
      setState(() {
        _setOut(out);
        _error = null;
        // History auto-collapses when a result is on screen (§5).
        _historyExpanded = false;
      });
      Prefs.instance.saveHistory(HistoryEntry(
        fromCal: _src.id,
        toCal: _tgt.id,
        year: year,
        month: _month,
        day: _day,
        ts: DateTime.now().millisecondsSinceEpoch,
      ));
    } on ConvertException catch (e) {
      setState(() {
        _error = e.message;
      });
    }
  }

  void _onVariantTap(WebCalendar cal, String v) {
    final year = int.tryParse(_yearCtl.text.trim());
    if (year == null || _month == null || _day == null) return;
    cal.variant = v;
    setState(() {
      _setOut(convertDate(_src, _tgt, year, _month!, _day!, _lang));
    });
  }

  void _restoreHistory(HistoryEntry e) {
    if (!kWebCalendars.containsKey(e.fromCal)) return;
    setState(() {
      _fromId = e.fromCal;
      // `human` target restored as empty on the web (§5).
      _toId = e.toCal == 'human' ? null : e.toCal;
      _yearCtl.text = '${e.year}';
      _month = e.month;
      _dayCtl.text = e.day?.toString() ?? '';
    });
    Prefs.instance.fromCal = e.fromCal;
    _convert();
  }

  // ---- build ----

  @override
  Widget build(BuildContext context) {
    if (isWide(context)) return _wideBuild();
    final history = Prefs.instance.history;
    final showIntro = history.isEmpty;
    const gap = SizedBox(height: 14);

    return ListView(
      padding: const EdgeInsets.fromLTRB(10, 10, 10, 20),
      children: [
        if (showIntro) ...[_titleBox(), gap, _introCard(), gap],
        _fromSlab(),
        gap,
        _yearSlab(),
        if (_hasResult) ...[gap, _refineRow(), gap, _toSlab()],
        if (_error != null) ...[gap, _errorStrip()],
        gap,
        ConvertButton(label: I18n.t(_lang, 'convert'), onPressed: _convert),
        if (_out != null) ...[
          gap,
          ResultPanel(lang: _lang, out: _out!, onVariantTap: _onVariantTap),
          gap,
          AstroCard(lang: _lang, items: _out!.astro),
        ],
        if (history.isNotEmpty) ...[
          gap,
          HistoryPanel(
            lang: _lang,
            entries: history,
            expanded: _historyExpanded,
            onToggle: () =>
                setState(() => _historyExpanded = !_historyExpanded),
            onRestore: _restoreHistory,
            onClear: () {
              Prefs.instance.clearHistory();
              setState(() => _historyExpanded = false);
            },
          ),
        ],
      ],
    );
  }

  // Black slab with the app title — #mobile-title-box.
  Widget _titleBox() {
    return Container(
      color: kInk,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Text(
        I18n.t(_lang, 'appTitle').toUpperCase(),
        style:
            mono(15, weight: FontWeight.w800, color: kWhite, letterSpacing: 2),
      ),
    );
  }

  // Intro card — #history-empty-instruction: description + three numbered steps.
  Widget _introCard() {
    final wide = isWide(context);
    return Container(
      decoration: slabDecoration(shadow: 4),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(I18n.t(_lang, 'introDesc'), style: mono(11.5, height: 1.5)),
          const SizedBox(height: 12),
          Container(
            decoration: const BoxDecoration(
              border: Border(top: BorderSide(color: kSurface2, width: 2)),
            ),
            padding: const EdgeInsets.only(top: 12),
            child: Column(
              children: [
                for (var i = 1; i <= 3; i++)
                  Padding(
                    padding: EdgeInsets.only(bottom: i < 3 ? 10 : 0),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          width: 24,
                          height: 24,
                          alignment: Alignment.center,
                          color: wide ? kSignal : kInk,
                          child: Text('$i',
                              style: mono(12.5,
                                  weight: FontWeight.w700, color: kWhite)),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Text(I18n.t(_lang, 'introStep$i'),
                              style: mono(12.5, height: 1.5, color: kInk700)),
                        ),
                      ],
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _fromSlab() {
    return Slab(
      tag: '01 • FROM',
      child: _calField(
        calId: _fromId,
        onPick: () async {
          final id =
              await showCalendarPicker(context, _lang, selectedId: _fromId);
          if (id == null) return;
          setState(() {
            _fromId = id;
            _month = null;
            _dayCtl.clear();
          });
          Prefs.instance.fromCal = id;
          _clearError();
        },
      ),
    );
  }

  Widget _toSlab() {
    return Slab(
      tag: '05 • TO',
      child: _calField(
        calId: _toId ?? 'gregorian',
        onPick: () async {
          final id = await showCalendarPicker(context, _lang,
              selectedId: _toId ?? 'gregorian');
          if (id == null) return;
          setState(() => _toId = id);
          _clearError();
          // Selecting TO re-converts immediately when a result shows (§B).
          if (_hasResult) _convert();
        },
      ),
    );
  }

  Widget _calField({required String calId, required VoidCallback onPick}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        InkWell(
          onTap: onPick,
          child: Container(
            decoration: const BoxDecoration(
              border: Border(bottom: BorderSide(color: kInk, width: 2)),
            ),
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    I18n.calendarName(_lang, calId),
                    style: mono(16, weight: FontWeight.w700),
                  ),
                ),
                Text('▾', style: mono(13, weight: FontWeight.w700)),
              ],
            ),
          ),
        ),
        const SizedBox(height: 6),
        InkWell(
          onTap: () => widget.onOpenCalendarPage?.call(calId),
          child: Text(
            I18n.t(_lang, 'aboutCalendarTpl')
                .replaceAll('{name}', I18n.calendarName(_lang, calId)),
            style: mono(10, color: kInk500)
                .copyWith(decoration: TextDecoration.underline),
          ),
        ),
      ],
    );
  }

  Widget _yearSlab() {
    return Slab(
      tag: '02 • YEAR',
      child: TextField(
        controller: _yearCtl,
        keyboardType: TextInputType.number,
        style: mono(24, weight: FontWeight.w800),
        decoration: slabInputDecoration(),
        onTap: () => _yearCtl.selection = TextSelection(
            baseOffset: 0, extentOffset: _yearCtl.text.length),
        onChanged: (_) {
          // Year edit clears month + day (§C).
          setState(() {
            _month = null;
            _dayCtl.clear();
          });
          _clearError();
        },
        onSubmitted: (_) => _convert(),
      ),
    );
  }

  // Month picker field (underlined, ▾) — shared by the phone slab and the
  // wide card.
  Widget _monthField({double vPad = 10}) {
    final monthNames = _src.monthNames(_lang);
    final monthLabel = (_month != null && _month! - 1 < monthNames.length)
        ? monthNames[_month! - 1]
        : '';
    return InkWell(
      onTap: () async {
        final m = await showMonthPicker(context, _lang, _src, _month);
        if (m == null) return; // dismissed
        setState(() {
          _month = m == 0 ? null : m;
          if (_month == null) _dayCtl.clear();
        });
        _clearError();
        if (_hasResult) _convert();
      },
      child: Container(
        decoration: const BoxDecoration(
          border: Border(bottom: BorderSide(color: kInk, width: 2)),
        ),
        padding: EdgeInsets.symmetric(vertical: vPad),
        child: Row(
          children: [
            Expanded(
              child: Text(
                monthLabel,
                style: mono(15, weight: FontWeight.w700),
                overflow: TextOverflow.ellipsis,
              ),
            ),
            Text('▾', style: mono(13, weight: FontWeight.w700)),
          ],
        ),
      ),
    );
  }

  Widget _dayField() {
    return TextField(
      controller: _dayCtl,
      keyboardType: TextInputType.number,
      style: mono(24, weight: FontWeight.w800),
      decoration: slabInputDecoration(),
      onTap: () => _dayCtl.selection =
          TextSelection(baseOffset: 0, extentOffset: _dayCtl.text.length),
      onChanged: (_) => _clearError(),
      onSubmitted: (_) {
        if (_hasResult) _convert();
      },
      onEditingComplete: () {
        FocusScope.of(context).unfocus();
        if (_hasResult) _convert();
      },
    );
  }

  // Refine row: MONTH (2fr) + DAY (1fr), visible after first convert (§D).
  Widget _refineRow() {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          flex: 2,
          child: Slab(tag: '03 • MONTH', child: _monthField()),
        ),
        const SizedBox(width: 10),
        Expanded(
          flex: 1,
          child: Slab(tag: '04 • DAY', child: _dayField()),
        ),
      ],
    );
  }

  // Form error — white-on-black mono uppercase strip.
  Widget _errorStrip() {
    return Container(
      color: kInk,
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      child: Text(
        _error!.toUpperCase(),
        style: mono(11,
            weight: FontWeight.w700, color: kWhite, letterSpacing: 1.2),
      ),
    );
  }

  // ====================== wide layout (>= 601 px) ======================
  // Mirrors the desktop web: form card on the left (From / Year / Convert,
  // Month / Day after the first convert), on the right the "To" cell, the
  // result card and one tabbed tile box.

  static const _gapW = SizedBox(height: 24);

  BoxDecoration get _wideCard =>
      slabDecoration(border: kBorderResult, shadow: 8);

  Widget _wideLabel(String text) => Text(
        text.toUpperCase(),
        style: mono(9.5,
            color: kInk400, weight: FontWeight.w700, letterSpacing: 2.4),
      );

  Widget _wideBuild() {
    final history = Prefs.instance.history;
    return ListView(
      padding: const EdgeInsets.fromLTRB(24, 48, 32, 56),
      children: [
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SizedBox(
              width: 300,
              child: Column(
                children: [
                  _wideFormCard(),
                  if (_hasResult) ...[_gapW, _wideRefineCard()],
                ],
              ),
            ),
            const SizedBox(width: 24),
            Expanded(child: _wideRight(history)),
          ],
        ),
      ],
    );
  }

  Widget _wideFormCard() {
    return Container(
      decoration: _wideCard,
      padding: const EdgeInsets.fromLTRB(40, 40, 40, 36),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          _wideLabel(I18n.t(_lang, 'fromCalendar')),
          const SizedBox(height: 6),
          _wideCalField(
            calId: _fromId,
            onPick: () async {
              final id =
                  await showCalendarPicker(context, _lang, selectedId: _fromId);
              if (id == null) return;
              setState(() {
                _fromId = id;
                _month = null;
                _dayCtl.clear();
              });
              Prefs.instance.fromCal = id;
              _clearError();
            },
          ),
          const SizedBox(height: 22),
          _wideLabel(I18n.t(_lang, 'year')),
          TextField(
            controller: _yearCtl,
            keyboardType: TextInputType.number,
            style: mono(24, weight: FontWeight.w800),
            decoration: slabInputDecoration(),
            onTap: () => _yearCtl.selection = TextSelection(
                baseOffset: 0, extentOffset: _yearCtl.text.length),
            onChanged: (_) {
              setState(() {
                _month = null;
                _dayCtl.clear();
              });
              _clearError();
            },
            onSubmitted: (_) => _convert(),
          ),
          const SizedBox(height: 28),
          Align(
            alignment: Alignment.centerRight,
            child: _WideConvertButton(
                label: I18n.t(_lang, 'convert'), onPressed: _convert),
          ),
        ],
      ),
    );
  }

  Widget _wideRefineCard() {
    return Container(
      decoration: _wideCard,
      padding: const EdgeInsets.fromLTRB(40, 32, 40, 36),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          _wideLabel(I18n.t(_lang, 'month')),
          _monthField(vPad: 8),
          const SizedBox(height: 22),
          _wideLabel(I18n.t(_lang, 'day')),
          _dayField(),
        ],
      ),
    );
  }

  // Calendar field: bold name, underline, "about … →" link beneath.
  Widget _wideCalField({required String calId, required VoidCallback onPick}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        InkWell(
          onTap: onPick,
          child: Container(
            decoration: const BoxDecoration(
              border: Border(bottom: BorderSide(color: kInk, width: 2)),
            ),
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    I18n.calendarName(_lang, calId).toUpperCase(),
                    style: mono(14, weight: FontWeight.w800, letterSpacing: 1),
                  ),
                ),
                Text('▾', style: mono(12, weight: FontWeight.w700)),
              ],
            ),
          ),
        ),
        const SizedBox(height: 6),
        Align(
          alignment: Alignment.centerLeft,
          child: InkWell(
            onTap: () => widget.onOpenCalendarPage?.call(calId),
            child: Text(
              I18n.t(_lang, 'aboutCalendarTpl')
                  .replaceAll('{name}', I18n.calendarName(_lang, calId))
                  .toUpperCase(),
              style: mono(9.5, color: kInk400, letterSpacing: 0.8)
                  .copyWith(decoration: TextDecoration.underline),
            ),
          ),
        ),
      ],
    );
  }

  Widget _wideRight(List<HistoryEntry> history) {
    if (!_hasResult) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          if (_error != null) ...[_errorStrip(), _gapW],
          if (history.isEmpty) _introCard() else _wideTabBox(history),
        ],
      );
    }
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        if (_error != null) ...[_errorStrip(), _gapW],
        _wideToCell(),
        _gapW,
        ResultPanel(lang: _lang, out: _out!, onVariantTap: _onVariantTap),
        _gapW,
        _wideTabBox(history),
      ],
    );
  }

  // "To" cell: signal-coloured label on the left, calendar field on the right.
  Widget _wideToCell() {
    return Container(
      decoration: _wideCard,
      child: IntrinsicHeight(
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Container(
              width: 72,
              color: kSignal,
              alignment: Alignment.center,
              child: Text(
                I18n.t(_lang, 'toLabel').toUpperCase(),
                style: mono(11.5,
                    weight: FontWeight.w700,
                    color: kWhite,
                    letterSpacing: 3.2),
              ),
            ),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 36, vertical: 20),
                child: _wideCalField(
                  calId: _toId ?? 'gregorian',
                  onPick: () async {
                    final id = await showCalendarPicker(context, _lang,
                        selectedId: _toId ?? 'gregorian');
                    if (id == null) return;
                    setState(() => _toId = id);
                    _clearError();
                    if (_hasResult) _convert();
                  },
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // One tabbed box for contextual / astro / month breakdown / history.
  Widget _wideTabBox(List<HistoryEntry> history) {
    String t(String k) => I18n.t(_lang, k);
    final defs = <(String, String)>[
      if (_hasResult && _ctx.isNotEmpty) ('ctx', t('contextualLabel')),
      if (_hasResult) ('astro', t('astroLabel')),
      if (_hasResult && _out!.breakdown.isNotEmpty)
        ('bd', t('monthBreakdown')),
      if (history.isNotEmpty) ('hist', t('history')),
    ];
    if (defs.isEmpty) return const SizedBox.shrink();
    final active = defs.any((d) => d.$1 == _tab) ? _tab! : defs.first.$1;

    Widget content;
    switch (active) {
      case 'ctx':
        content = ContextualList(
            rows: _ctx, onOpenCalendarPage: widget.onOpenCalendarPage);
      case 'astro':
        content = AstroCard(lang: _lang, items: _out!.astro, bare: true);
      case 'bd':
        content = BreakdownTable(
            lang: _lang,
            srcId: _src.id,
            tgtId: _tgt.id,
            rows: _out!.breakdown);
      default:
        content = HistoryPanel(
          lang: _lang,
          entries: history,
          expanded: true,
          onToggle: () {},
          onRestore: _restoreHistory,
          onClear: () {
            Prefs.instance.clearHistory();
            setState(() => _tab = null);
          },
          bare: true,
        );
    }

    return Container(
      decoration: _wideCard,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            decoration: const BoxDecoration(
              border: Border(bottom: BorderSide(color: kInk, width: 3)),
            ),
            child: IntrinsicHeight(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  for (var i = 0; i < defs.length; i++)
                    Expanded(
                      flex: defs[i].$2.length + 6,
                      child: InkWell(
                        onTap: () => setState(() => _tab = defs[i].$1),
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 14),
                          alignment: Alignment.center,
                          decoration: BoxDecoration(
                            color: defs[i].$1 == active ? kSignal : kSurface,
                            border: i < defs.length - 1
                                ? const Border(
                                    right: BorderSide(color: kInk, width: 2))
                                : null,
                          ),
                          child: Text(
                            defs[i].$2.toUpperCase(),
                            textAlign: TextAlign.center,
                            style: mono(11,
                                weight: FontWeight.w700,
                                letterSpacing: 1.4,
                                color: defs[i].$1 == active
                                    ? kWhite
                                    : kInk600),
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(36, 24, 36, 28),
            child: content,
          ),
        ],
      ),
    );
  }
}

class _WideConvertButton extends StatefulWidget {
  final String label;
  final VoidCallback onPressed;
  const _WideConvertButton({required this.label, required this.onPressed});

  @override
  State<_WideConvertButton> createState() => _WideConvertButtonState();
}

class _WideConvertButtonState extends State<_WideConvertButton> {
  bool _hover = false;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: _hover ? kSignalDark : kSignal,
      child: InkWell(
        onTap: widget.onPressed,
        onHover: (v) => setState(() => _hover = v),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                widget.label.toUpperCase(),
                style: mono(13,
                    weight: FontWeight.w800, letterSpacing: 2.6, color: kWhite),
              ),
              const SizedBox(width: 10),
              const Icon(Icons.arrow_forward, color: kWhite, size: 16),
            ],
          ),
        ),
      ),
    );
  }
}

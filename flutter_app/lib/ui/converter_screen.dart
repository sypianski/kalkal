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
        _out = out;
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
      _out = convertDate(_src, _tgt, year, _month!, _day!, _lang);
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

  // Refine row: MONTH (2fr) + DAY (1fr), visible after first convert (§D).
  Widget _refineRow() {
    final monthNames = _src.monthNames(_lang);
    final monthLabel = (_month != null && _month! - 1 < monthNames.length)
        ? monthNames[_month! - 1]
        : '';
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          flex: 2,
          child: Slab(
            tag: '03 • MONTH',
            child: InkWell(
              onTap: () async {
                final m =
                    await showMonthPicker(context, _lang, _src, _month);
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
                padding: const EdgeInsets.symmetric(vertical: 10),
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
            ),
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          flex: 1,
          child: Slab(
            tag: '04 • DAY',
            child: TextField(
              controller: _dayCtl,
              keyboardType: TextInputType.number,
              style: mono(24, weight: FontWeight.w800),
              decoration: slabInputDecoration(),
              onTap: () => _dayCtl.selection = TextSelection(
                  baseOffset: 0, extentOffset: _dayCtl.text.length),
              onChanged: (_) => _clearError(),
              onSubmitted: (_) {
                if (_hasResult) _convert();
              },
              onEditingComplete: () {
                FocusScope.of(context).unfocus();
                if (_hasResult) _convert();
              },
            ),
          ),
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
}

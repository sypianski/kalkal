// Subpage screens — calendars.html, methodology.html, about.html ports.
// Calendars and Methodology follow the prod web look (css/style.css): no title
// banner, numbered side contents, 3px-bordered cards with offset shadow.

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart';

import '../i18n/i18n.dart';
import '../i18n/pages_i18n.dart';
import 'tokens.dart';

// Page-only greys of the web (--parchment tints used by asides and formulas).
const _kAside = Color(0xFFF8F8F5);
const _kAsideWarn = Color(0xFFF0F0EC);
const _kRuleGrey = Color(0xFFCCCCCC);

/// Wide pages sit in the web's 1100px `main-content--prose` column.
class _PageFrame extends StatelessWidget {
  final bool wide;
  final Widget child;
  const _PageFrame({required this.wide, required this.child});

  @override
  Widget build(BuildContext context) => Align(
        alignment: Alignment.topCenter,
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1100),
          child: Padding(
            padding: wide
                ? const EdgeInsets.fromLTRB(40, 40, 40, 0)
                : const EdgeInsets.fromLTRB(10, 10, 10, 0),
            child: child,
          ),
        ),
      );
}

/// Heading with a heavy rule only as wide as its text (`h2` inline-block).
class _UnderlinedTitle extends StatelessWidget {
  final String text;
  final double size;
  final double letterSpacing;
  const _UnderlinedTitle(this.text, {required this.size, required this.letterSpacing});

  @override
  Widget build(BuildContext context) => Align(
        alignment: Alignment.centerLeft,
        child: Container(
          padding: const EdgeInsets.only(bottom: 4),
          decoration: const BoxDecoration(
              border: Border(bottom: BorderSide(color: kInk, width: 3))),
          child: Text(text.toUpperCase(),
              style: mono(size,
                  weight: FontWeight.w900,
                  letterSpacing: letterSpacing,
                  height: 1.25)),
        ),
      );
}

/// Side contents column: 4px black rule on the left, sticky in the web.
class _SideContents extends StatelessWidget {
  final double width;
  final Widget child;
  const _SideContents({required this.width, required this.child});

  @override
  Widget build(BuildContext context) => SizedBox(
        width: width,
        child: Container(
          decoration: const BoxDecoration(
              border: Border(left: BorderSide(color: kInk, width: 4))),
          padding: const EdgeInsets.only(left: 16),
          child: SingleChildScrollView(child: child),
        ),
      );
}

/// Phone contents: white box with a thick left rule, collapsed `<details>`.
class _MobileContents extends StatefulWidget {
  final String title;
  final Widget child;
  final double titleSize;
  const _MobileContents(
      {required this.title, required this.child, this.titleSize = 14.4});

  @override
  State<_MobileContents> createState() => _MobileContentsState();
}

class _MobileContentsState extends State<_MobileContents> {
  bool _open = false;

  @override
  Widget build(BuildContext context) => Container(
        decoration: const BoxDecoration(
          color: kSurface,
          border: Border(
            top: BorderSide(color: kInk, width: 3),
            bottom: BorderSide(color: kInk, width: 3),
            right: BorderSide(color: kInk, width: 3),
            left: BorderSide(color: kInk, width: 6),
          ),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            InkWell(
              onTap: () => setState(() => _open = !_open),
              child: Row(
                children: [
                  Expanded(
                    child: Text(widget.title.toUpperCase(),
                        style: mono(widget.titleSize,
                            weight: FontWeight.w900, letterSpacing: 0.86)),
                  ),
                  Text(_open ? '▴' : '▾', style: mono(14)),
                ],
              ),
            ),
            if (_open) ...[
              const SizedBox(height: 8),
              widget.child,
            ],
          ],
        ),
      );
}

/// Which of [order] is the current one: the last whose top has passed [limit]
/// (viewport y of the scroll area + a little slack) — drives the active TOC link.
String? _activeOf(List<String> order, Map<String, GlobalKey> keys, double limit) {
  String? active;
  for (final id in order) {
    final ctx = keys[id]?.currentContext;
    final box = ctx?.findRenderObject();
    if (box is! RenderBox || !box.attached) continue;
    if (box.localToGlobal(Offset.zero).dy <= limit) active = id;
  }
  return active ?? (order.isEmpty ? null : order.first);
}

// ---------------------------------------------------------------------------
// Calendars page — one card per calendar, grouped like pages.js regroups.
// ---------------------------------------------------------------------------

const _seasonBand = [
  (band: Color(0xFF2D5A27), label: Color(0xFF5A7A4A)), // spring
  (band: Color(0xFFB8860B), label: Color(0xFF333333)), // summer
  (band: Color(0xFF8B2500), label: Color(0xFF000000)), // autumn
  (band: Color(0xFF1A3A4A), label: Color(0xFF4A6070)), // winter
];

class CalendarsScreen extends StatefulWidget {
  final String lang;
  final String? anchorCalId; // deep link from "about {name} calendar →"
  const CalendarsScreen({super.key, required this.lang, this.anchorCalId});

  @override
  State<CalendarsScreen> createState() => _CalendarsScreenState();
}

class _CalendarsScreenState extends State<CalendarsScreen> {
  final _scrollCtl = ScrollController();
  final _cardKeys = <String, GlobalKey>{};
  final _order = <String>[];
  String? _active;

  @override
  void initState() {
    super.initState();
    for (final g in PagesI18n.calGroups) {
      for (final id in g.calendarIds) {
        _cardKeys[id] = GlobalKey();
        _order.add(id);
      }
    }
    _scrollCtl.addListener(_onScroll);
    if (widget.anchorCalId != null) {
      WidgetsBinding.instance
          .addPostFrameCallback((_) => _scrollTo(widget.anchorCalId!));
    }
  }

  @override
  void dispose() {
    _scrollCtl.dispose();
    super.dispose();
  }

  void _onScroll() {
    final ctx = _scrollCtl.hasClients ? _scrollCtl.position.context.notificationContext : null;
    final box = ctx?.findRenderObject();
    final top = box is RenderBox ? box.localToGlobal(Offset.zero).dy : 0.0;
    final a = _activeOf(_order, _cardKeys, top + 80);
    if (a != _active) setState(() => _active = a);
  }

  void _scrollTo(String calId) {
    final ctx = _cardKeys[calId]?.currentContext;
    if (ctx != null) {
      Scrollable.ensureVisible(ctx, duration: const Duration(milliseconds: 300));
    }
  }

  Widget _toc(String lang) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          for (final g in PagesI18n.calGroups) ...[
            Container(
              margin: const EdgeInsets.only(top: 6, bottom: 3),
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3.5),
              color: kInk800,
              child: Text(I18n.calendarGroup(lang, g.id).toUpperCase(),
                  style: mono(11.5,
                      weight: FontWeight.w700,
                      color: kWhite,
                      letterSpacing: 0.69,
                      height: 1.6)),
            ),
            for (final id in g.calendarIds)
              InkWell(
                onTap: () => _scrollTo(id),
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 2.5),
                  child: Text(
                    (PagesI18n.calT(lang, id, 'name') ?? I18n.calendarName(lang, id))
                        .toUpperCase(),
                    style: mono(11.5,
                        weight: FontWeight.w700,
                        color: id == _active ? kSignal : kInk700,
                        letterSpacing: 0.69,
                        height: 1.6),
                  ),
                ),
              ),
          ],
        ],
      );

  // Group heading: heavy 4px rule with the calendar count (`.cal-group-heading`).
  Widget _groupHeading(String lang, PageCalGroup g,
          {required bool first, required bool wide}) =>
      Container(
        margin: EdgeInsets.only(top: first ? 0 : (wide ? 40 : 28), bottom: 16),
        padding: const EdgeInsets.symmetric(vertical: 5.6),
        decoration: const BoxDecoration(
            border: Border(bottom: BorderSide(color: kInk, width: 4))),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.baseline,
          textBaseline: TextBaseline.alphabetic,
          children: [
            Flexible(
              child: Text(I18n.calendarGroup(lang, g.id).toUpperCase(),
                  style: mono(16, weight: FontWeight.w700, letterSpacing: 1.92)),
            ),
            const SizedBox(width: 12),
            Text('${g.calendarIds.length}',
                style: mono(12.5, weight: FontWeight.w700, color: kInk600)),
          ],
        ),
      );

  Widget _cards(String lang, bool wide) => Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          for (var gi = 0; gi < PagesI18n.calGroups.length; gi++) ...[
            _groupHeading(lang, PagesI18n.calGroups[gi],
                first: gi == 0, wide: wide),
            for (final id in PagesI18n.calGroups[gi].calendarIds) ...[
              _CalCard(key: _cardKeys[id], lang: lang, calId: id, wide: wide),
              SizedBox(height: wide ? 32 : 20),
            ],
          ],
        ],
      );

  @override
  Widget build(BuildContext context) {
    final lang = widget.lang;
    // From 901px the contents sit in a side column next to the cards.
    if (MediaQuery.sizeOf(context).width >= 901) {
      return _PageFrame(
        wide: true,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _SideContents(width: 230, child: _toc(lang)),
            const SizedBox(width: 40),
            Expanded(
              child: SingleChildScrollView(
                controller: _scrollCtl,
                padding: const EdgeInsets.only(right: 8, bottom: 40),
                child: _cards(lang, true),
              ),
            ),
          ],
        ),
      );
    }
    final wide = isWide(context);
    return _PageFrame(
      wide: wide,
      child: SingleChildScrollView(
        controller: _scrollCtl,
        padding: const EdgeInsets.only(bottom: 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _MobileContents(
                title: PagesI18n.t(lang, 'tocTitle'), child: _toc(lang)),
            const SizedBox(height: 20),
            _cards(lang, wide),
          ],
        ),
      ),
    );
  }
}

class _CalCard extends StatefulWidget {
  final String lang;
  final String calId;
  final bool wide;
  const _CalCard(
      {super.key, required this.lang, required this.calId, required this.wide});

  @override
  State<_CalCard> createState() => _CalCardState();
}

class _CalCardState extends State<_CalCard> {
  bool _formulaOpen = false; // <details> collapsed

  @override
  Widget build(BuildContext context) {
    final lang = widget.lang;
    final id = widget.calId;
    final wide = widget.wide;
    final d = PagesI18n.calendarDescription(lang, id);
    final variants = PagesI18n.variantItems(lang, id);
    final variantLabels = PagesI18n.variantLabels[id] ?? const [];
    final meta = PagesI18n.calMonthMeta[id];

    Widget para(String? text,
            {Color color = kInk700,
            double size = 13.12,
            FontWeight weight = FontWeight.w400,
            double height = 1.8}) =>
        text == null || text.isEmpty
            ? const SizedBox.shrink()
            : Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: Text(text,
                    style: mono(size, color: color, weight: weight, height: height)),
              );

    return Container(
      decoration: BoxDecoration(
        color: kSurface,
        border: Border.all(color: kInk, width: 3),
        boxShadow: brutShadow(wide ? 6 : 4),
      ),
      padding: EdgeInsets.all(wide ? 24 : 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          _UnderlinedTitle(d['name'] ?? I18n.calendarName(lang, id),
              size: wide ? 20.8 : 17.6, letterSpacing: wide ? 2.08 : 1.76),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 6,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              if (d['type'] != null)
                Container(
                  color: kInk,
                  padding: const EdgeInsets.symmetric(horizontal: 6.2, vertical: 2.6),
                  child: Text(d['type']!.toUpperCase(),
                      style: mono(10.4,
                          weight: FontWeight.w900,
                          color: kWhite,
                          letterSpacing: 0.62,
                          height: 1.6)),
                ),
              if (d['epoch'] != null)
                Text(d['epoch']!, style: mono(11.5, color: kInk600)),
            ],
          ),
          const SizedBox(height: 16),
          para(d['intro'],
              color: kInk600, size: 15.2, weight: FontWeight.w900, height: 1.8),
          para(d['body']),
          para(d['adoption']),
          para(d['usage']),
          para(d['tabular']),
          para(d['arithmetic']),
          if (variants.isNotEmpty) ...[
            for (var i = 0; i < variants.length; i++)
              Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (i < variantLabels.length)
                      Text(variantLabels[i].label,
                          style: mono(13.12, weight: FontWeight.w700, height: 1.6)),
                    if (i < variantLabels.length && variantLabels[i].note.isNotEmpty)
                      Text(variantLabels[i].note,
                          style: mono(11.5, color: kInk500, height: 1.6)),
                    Text(variants[i],
                        style: mono(13.12, color: kInk700, height: 1.7)),
                  ],
                ),
              ),
            const SizedBox(height: 6),
          ],
          para(d['variantsDivergence']),
          para(d['warning'], color: kInk600),
          if (d['formula'] != null || d['source'] != null) _formula(d, lang),
          if (meta != null) _seasons(lang, meta, wide),
        ],
      ),
    );
  }

  // `<details>`: bordered uppercase summary, then math block and source line.
  Widget _formula(Map<String, String> d, String lang) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const SizedBox(height: 8),
        InkWell(
          onTap: () => setState(() => _formulaOpen = !_formulaOpen),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 14.4, vertical: 9.6),
            decoration: BoxDecoration(
                color: kSurface, border: Border.all(color: kInk, width: 2)),
            child: Row(
              children: [
                Expanded(
                  child: Text(PagesI18n.t(lang, 'formulaLabel').toUpperCase(),
                      style: mono(12.5,
                          weight: FontWeight.w700, letterSpacing: 1.5, height: 1.6)),
                ),
                Text(_formulaOpen ? '▴' : '▾', style: mono(12.5)),
              ],
            ),
          ),
        ),
        if (_formulaOpen)
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                if (d['formula'] != null)
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: const BoxDecoration(
                      color: _kAside,
                      border: Border(left: BorderSide(color: _kRuleGrey, width: 3)),
                    ),
                    child: Text(d['formula']!,
                        style: mono(12.5, color: kInk, height: 1.8)),
                  ),
                if (d['source'] != null)
                  Container(
                    margin: const EdgeInsets.only(top: 12),
                    padding: const EdgeInsets.only(top: 6),
                    decoration: const BoxDecoration(
                        border: Border(top: BorderSide(color: _kRuleGrey))),
                    child: Text('${PagesI18n.t(lang, 'sourceLabel')}: ${d['source']}',
                        style: mono(12.5, color: kInk400, height: 1.8)),
                  ),
              ],
            ),
          ),
        const SizedBox(height: 16),
      ],
    );
  }

  Widget _monthRow(int i, String name, String days) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 1.25),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.baseline,
          textBaseline: TextBaseline.alphabetic,
          children: [
            SizedBox(
                width: 20,
                child: Text('${i + 1}',
                    style: mono(10.4, weight: FontWeight.w900))),
            Expanded(
                child: Text(name,
                    style: mono(12.5, weight: FontWeight.w700, color: kInk700))),
            Text(days, style: mono(10.4, color: kInk600)),
          ],
        ),
      );

  // Months grouped into coloured season bands (4 columns wide, 1 on phone);
  // calendars without a fixed season mapping get a plain list.
  Widget _seasons(String lang, CalMonthMeta meta, bool wide) {
    final names = I18n.monthList(lang, meta.monthsKey) ?? const <String>[];
    final labels = PagesI18n.seasonLabelsFor(lang);
    final n = names.length < meta.days.length ? names.length : meta.days.length;
    if (n == 0) return const SizedBox.shrink();
    final container = Container(
      margin: const EdgeInsets.only(top: 8),
      padding: const EdgeInsets.only(top: 16),
      decoration: const BoxDecoration(
          border: Border(top: BorderSide(color: kInk, width: 3))),
    );
    if (meta.seasons == null) {
      return Container(
        margin: container.margin,
        padding: container.padding,
        decoration: container.decoration,
        child: Column(children: [
          for (var i = 0; i < n; i++) _monthRow(i, names[i], meta.days[i]),
        ]),
      );
    }
    final bands = <Widget>[];
    for (var s = 0; s < 4; s++) {
      final idx = [
        for (var i = 0; i < n && i < meta.seasons!.length; i++)
          if (meta.seasons![i] == s) i
      ];
      if (idx.isEmpty) continue;
      bands.add(Container(
        padding: const EdgeInsets.only(top: 4),
        decoration: BoxDecoration(
            border: Border(top: BorderSide(color: _seasonBand[s].band, width: 5))),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Padding(
              padding: const EdgeInsets.only(bottom: 3),
              child: Text(labels[s].toUpperCase(),
                  style: mono(9.3,
                      weight: FontWeight.w900,
                      color: _seasonBand[s].label,
                      letterSpacing: 0.93)),
            ),
            for (final i in idx) _monthRow(i, names[i], meta.days[i]),
          ],
        ),
      ));
    }
    return Container(
      margin: container.margin,
      padding: container.padding,
      decoration: container.decoration,
      child: wide
          ? Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                for (var i = 0; i < bands.length; i++) ...[
                  if (i > 0) const SizedBox(width: 16),
                  Expanded(child: bands[i]),
                ],
              ],
            )
          : Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                for (var i = 0; i < bands.length; i++) ...[
                  if (i > 0) const SizedBox(height: 14),
                  bands[i],
                ],
              ],
            ),
    );
  }
}

// ---------------------------------------------------------------------------
// Methodology page.
// ---------------------------------------------------------------------------

class MethodologyScreen extends StatefulWidget {
  final String lang;
  const MethodologyScreen({super.key, required this.lang});

  @override
  State<MethodologyScreen> createState() => _MethodologyScreenState();
}

class _MethodologyScreenState extends State<MethodologyScreen> {
  final _scrollCtl = ScrollController();
  final _keys = {for (final s in PagesI18n.methSectionOrder) s: GlobalKey()};
  String? _active;

  @override
  void initState() {
    super.initState();
    _scrollCtl.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollCtl.dispose();
    super.dispose();
  }

  void _onScroll() {
    final ctx = _scrollCtl.hasClients ? _scrollCtl.position.context.notificationContext : null;
    final box = ctx?.findRenderObject();
    final top = box is RenderBox ? box.localToGlobal(Offset.zero).dy : 0.0;
    final a = _activeOf(PagesI18n.methSectionOrder, _keys, top + 80);
    if (a != _active) setState(() => _active = a);
  }

  void _scrollTo(String sec) {
    final ctx = _keys[sec]?.currentContext;
    if (ctx != null) {
      Scrollable.ensureVisible(ctx, duration: const Duration(milliseconds: 300));
    }
  }

  Widget _toc(String lang) {
    final secs = [
      for (final s in PagesI18n.methSectionOrder)
        if (PagesI18n.methT(lang, s, 'title') != null) s
    ];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        for (var i = 0; i < secs.length; i++)
          InkWell(
            onTap: () => _scrollTo(secs[i]),
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 6),
              child: Text.rich(TextSpan(children: [
                TextSpan(
                    text: '${(i + 1).toString().padLeft(2, '0')}  ',
                    style: mono(12, weight: FontWeight.w700, color: kSignal)),
                TextSpan(
                    text: PagesI18n.methT(lang, secs[i], 'title')!,
                    style: mono(14.08,
                        weight: FontWeight.w600,
                        color: secs[i] == _active ? kSignal : kInk700,
                        height: 1.4)),
              ])),
            ),
          ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final lang = widget.lang;
    final wide = MediaQuery.sizeOf(context).width >= 801;
    final intro = wide
        // Wide: plain bold paragraph, no box.
        ? Text(PagesI18n.t(lang, 'methIntro'),
            style: mono(16, weight: FontWeight.w700, height: 1.8))
        // Phone: white block, heavy border + offset shadow.
        : Container(
            decoration: BoxDecoration(
              color: kSurface,
              border: Border.all(color: kInk, width: 4),
              boxShadow: brutShadow(4),
            ),
            padding: const EdgeInsets.all(20),
            child: Text(PagesI18n.t(lang, 'methIntro'),
                style: mono(15.2, weight: FontWeight.w600, height: 1.6)),
          );
    final sections = Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        for (final sec in PagesI18n.methSectionOrder) ...[
          _MethSection(key: _keys[sec], lang: lang, sectionId: sec, flat: wide),
          SizedBox(height: wide ? 40 : 20),
        ],
      ],
    );

    if (wide) {
      return _PageFrame(
        wide: true,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _SideContents(width: 200, child: _toc(lang)),
            const SizedBox(width: 48),
            Expanded(
              child: Align(
                alignment: Alignment.topLeft,
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 680),
                  child: SingleChildScrollView(
                    controller: _scrollCtl,
                    padding: const EdgeInsets.only(bottom: 40),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        intro,
                        const SizedBox(height: 40),
                        sections,
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      );
    }
    return _PageFrame(
      wide: false,
      child: SingleChildScrollView(
        controller: _scrollCtl,
        padding: const EdgeInsets.only(bottom: 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            _MobileContents(
                title: PagesI18n.t(lang, 'tocTitle'),
                titleSize: 18.4,
                child: _toc(lang)),
            const SizedBox(height: 20),
            intro,
            const SizedBox(height: 20),
            sections,
          ],
        ),
      ),
    );
  }
}

class _MethSection extends StatelessWidget {
  final String lang;
  final String sectionId;
  final bool flat; // wide: a 4px top rule instead of a bordered card
  const _MethSection(
      {super.key,
      required this.lang,
      required this.sectionId,
      this.flat = false});

  Widget _para(String text) => Padding(
        padding: const EdgeInsets.only(bottom: 16),
        child: Text(text, style: mono(13.12, color: kInk700, height: 1.9)),
      );

  // `.meth-aside`: grey block with a left rule; the warning variant is black-ruled.
  Widget _aside(String text, {bool warning = false}) => Container(
        margin: const EdgeInsets.symmetric(vertical: 16),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        decoration: BoxDecoration(
          color: warning ? _kAsideWarn : _kAside,
          border: Border(
              left: BorderSide(color: warning ? kInk : _kRuleGrey, width: 4)),
        ),
        child: Text(text, style: mono(13.12, color: kInk700, height: 1.6)),
      );

  @override
  Widget build(BuildContext context) {
    final title = PagesI18n.methT(lang, sectionId, 'title');
    final body = PagesI18n.methT(lang, sectionId, 'body');
    final body2 = PagesI18n.methT(lang, sectionId, 'body2');
    final warning = PagesI18n.methT(lang, sectionId, 'warning');
    final note = PagesI18n.methT(lang, sectionId, 'note');
    final isSources = sectionId == 'methSources';
    final sources = isSources ? PagesI18n.methSources(lang) : const <List<String>>[];
    return Container(
      decoration: flat
          ? const BoxDecoration(
              border: Border(top: BorderSide(color: kInk, width: 4)))
          : BoxDecoration(
              color: kSurface,
              border: Border.all(color: kInk, width: 3),
              boxShadow: brutShadow(4),
            ),
      padding: flat ? const EdgeInsets.only(top: 22) : const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          if (title != null) ...[
            _UnderlinedTitle(title, size: 18.4, letterSpacing: 2.2),
            const SizedBox(height: 16),
          ],
          if (body != null) _para(body),
          if (note != null) _aside(note),
          if (body2 != null) _para(body2),
          if (warning != null) _aside(warning, warning: true),
          for (var i = 0; i < sources.length; i++)
            Padding(
              padding: const EdgeInsets.only(bottom: 6),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  SizedBox(
                      width: 26,
                      child: Text('${i + 1}.',
                          style: mono(13.6, color: kInk600, height: 1.8))),
                  Expanded(
                    child: Text.rich(TextSpan(children: [
                      TextSpan(text: sources[i][0]),
                      TextSpan(
                          text: sources[i].length > 1 ? sources[i][1] : '',
                          style: const TextStyle(fontStyle: FontStyle.italic)),
                      TextSpan(text: sources[i].length > 2 ? sources[i][2] : ''),
                    ], style: mono(13.6, color: kInk600, height: 1.8))),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// About page — quiet author card (TASK-9, mirrors about.html).
// The GitHub button has no star count here: the app works offline and the
// privacy policy promises no network requests of its own.
// ---------------------------------------------------------------------------

class AboutScreen extends StatelessWidget {
  final String lang;
  const AboutScreen({super.key, required this.lang});

  static const _kodeUrl = 'https://github.com/sypianski/kalkal';

  void _open(String url) =>
      launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);

  @override
  Widget build(BuildContext context) {
    String a(String k) => PagesI18n.aboutT(lang, k);
    // App Store review rejects external donation links in native iOS builds;
    // web and Android keep it.
    final showKofi = kIsWeb || defaultTargetPlatform != TargetPlatform.iOS;

    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 24, 16, 24),
      children: [
        Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 460),
            child: Container(
              decoration: BoxDecoration(
                color: kSurface,
                border: Border.all(color: kInk300, width: 1),
              ),
              padding: const EdgeInsets.all(18),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text('${a('namePrefix')}\nJakub\nSypiański',
                      style: mono(19, weight: FontWeight.w700, height: 1.1)),
                  const SizedBox(height: 14),
                  Text(a('bio'), style: mono(11.5, height: 1.55)),
                  const SizedBox(height: 18),
                  Text(a('note'),
                      style: mono(11, color: kInk700, height: 1.55)),
                  const SizedBox(height: 14),
                  _button('→  sypian.ski', filled: true,
                      onTap: () => _open('https://sypian.ski')),
                  const SizedBox(height: 8),
                  _button('★  ${a('github')}',
                      onTap: () => _open(_kodeUrl)),
                  const SizedBox(height: 12),
                  Wrap(
                    alignment: WrapAlignment.center,
                    spacing: 18,
                    runSpacing: 8,
                    children: [
                      _textLink('✉ ${a('email')}',
                          () => _open('mailto:sypianski@outlook.com')),
                      if (showKofi)
                        _textLink(
                            a('kofi'), () => _open('https://ko-fi.com/sypianski')),
                    ],
                  ),
                  const SizedBox(height: 16),
                  _cite(context, a('citeTitle'), a('citeText'),
                      a('citeCopy'), a('citeCopied')),
                  const SizedBox(height: 14),
                  const Divider(height: 1, color: kInk300),
                  const SizedBox(height: 10),
                  Center(
                    child: _textLink(a('privacy'),
                        () => _open('https://kalkal.online/privacy.html'),
                        size: 10),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _button(String label,
      {bool filled = false, required VoidCallback onTap}) {
    return Material(
      color: filled ? kInk800 : Colors.transparent,
      shape: const Border.fromBorderSide(
          BorderSide(color: kInk800, width: 1)),
      child: InkWell(
        onTap: onTap,
        child: Container(
          constraints: const BoxConstraints(minHeight: 48),
          alignment: Alignment.center,
          child: Text(label,
              style: mono(12,
                  weight: FontWeight.w700,
                  color: filled ? kWhite : kInk)),
        ),
      ),
    );
  }

  Widget _textLink(String label, VoidCallback onTap, {double size = 11.5}) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 6),
        child: Text(label,
            style: mono(size, weight: FontWeight.w600).copyWith(
                decoration: TextDecoration.underline)),
      ),
    );
  }

  Widget _cite(BuildContext context, String title, String text, String copy,
      String copied) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        border: Border.all(color: kInk500, width: 1),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title.toUpperCase(),
              style: mono(9.5, weight: FontWeight.w700, color: kInk500,
                  letterSpacing: 1.3)),
          const SizedBox(height: 4),
          Text(text, style: mono(10.5, height: 1.5)),
          const SizedBox(height: 2),
          InkWell(
            onTap: () async {
              await Clipboard.setData(ClipboardData(text: text));
              if (context.mounted) {
                ScaffoldMessenger.of(context)
                  ..hideCurrentSnackBar()
                  ..showSnackBar(SnackBar(
                      content: Text(copied, style: mono(11, color: kWhite)),
                      duration: const Duration(seconds: 1)));
              }
            },
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 6),
              child: Text(copy,
                  style: mono(10.5, weight: FontWeight.w600).copyWith(
                      decoration: TextDecoration.underline)),
            ),
          ),
        ],
      ),
    );
  }
}

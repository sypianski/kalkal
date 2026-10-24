// Subpage screens — calendars.html, methodology.html, about.html ports.

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart';

import '../i18n/i18n.dart';
import '../i18n/pages_i18n.dart';
import 'tokens.dart';
import 'widgets.dart';

class _PageHeader extends StatelessWidget {
  final String title;
  final String subtitle;
  const _PageHeader(this.title, this.subtitle);

  @override
  Widget build(BuildContext context) {
    return Container(
      color: kInk,
      padding: const EdgeInsets.fromLTRB(16, 18, 16, 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title.toUpperCase(),
              style: mono(17,
                  weight: FontWeight.w800, color: kWhite, letterSpacing: 2)),
          const SizedBox(height: 4),
          Text(subtitle, style: mono(10.5, color: kNavText, height: 1.4)),
        ],
      ),
    );
  }
}

/// Contents link row: signal-coloured marker + underlined label.
class _TocLink extends StatelessWidget {
  final String label;
  final VoidCallback onTap;
  final double size;
  const _TocLink(this.label, this.onTap, {this.size = 12});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 4),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('▪ ', style: mono(size, color: kSignal)),
            Expanded(
              child: Text(label,
                  style: mono(size, weight: FontWeight.w600)
                      .copyWith(decoration: TextDecoration.underline)),
            ),
          ],
        ),
      ),
    );
  }
}

/// Collapsible "Contents" box — the `<details>` of the phone layout.
class _ContentsBox extends StatefulWidget {
  final String title;
  final Widget child;
  const _ContentsBox({required this.title, required this.child});

  @override
  State<_ContentsBox> createState() => _ContentsBoxState();
}

class _ContentsBoxState extends State<_ContentsBox> {
  bool _open = false;

  @override
  Widget build(BuildContext context) => TileToggle(
        title: widget.title,
        expanded: _open,
        onTap: () => setState(() => _open = !_open),
        child: widget.child,
      );
}

/// Wide layout: contents column with a 4px rule on its left, like the
/// sticky side list of the web.
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
          padding: const EdgeInsets.only(left: 14),
          child: SingleChildScrollView(child: child),
        ),
      );
}

// ---------------------------------------------------------------------------
// Calendars page — one card per calendar, grouped like pages.js regroups.
// ---------------------------------------------------------------------------

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

  @override
  void initState() {
    super.initState();
    for (final g in PagesI18n.calGroups) {
      for (final id in g.calendarIds) {
        _cardKeys[id] = GlobalKey();
      }
    }
    if (widget.anchorCalId != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) => _scrollTo(widget.anchorCalId!));
    }
  }

  void _scrollTo(String calId) {
    final key = _cardKeys[calId];
    final ctx = key?.currentContext;
    if (ctx != null) {
      Scrollable.ensureVisible(ctx,
          duration: const Duration(milliseconds: 300));
    }
  }

  Widget _toc(String lang) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          for (final g in PagesI18n.calGroups) ...[
            Padding(
              padding: const EdgeInsets.only(top: 8, bottom: 4),
              child: Text(
                I18n.calendarGroup(lang, g.id).toUpperCase(),
                style: mono(9,
                    weight: FontWeight.w700, color: kInk500, letterSpacing: 1.5),
              ),
            ),
            for (final id in g.calendarIds)
              _TocLink(
                PagesI18n.calT(lang, id, 'name') ?? I18n.calendarName(lang, id),
                () => _scrollTo(id),
                size: 11.5,
              ),
          ],
        ],
      );

  // Group heading: thin 4px rule with the calendar count (`.cal-group-heading`).
  Widget _groupHeading(String lang, PageCalGroup g, {required bool first}) =>
      Container(
        margin: EdgeInsets.only(top: first ? 0 : 28, bottom: 14),
        padding: const EdgeInsets.only(bottom: 6),
        decoration: const BoxDecoration(
            border: Border(bottom: BorderSide(color: kInk, width: 4))),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.baseline,
          textBaseline: TextBaseline.alphabetic,
          children: [
            Flexible(
              child: Text(
                I18n.calendarGroup(lang, g.id).toUpperCase(),
                style: mono(13, weight: FontWeight.w800, letterSpacing: 1.6),
              ),
            ),
            Text('${g.calendarIds.length}',
                style: mono(11, color: kInk600, letterSpacing: 1)),
          ],
        ),
      );

  Widget _cards(String lang) => Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          for (var gi = 0; gi < PagesI18n.calGroups.length; gi++) ...[
            _groupHeading(lang, PagesI18n.calGroups[gi], first: gi == 0),
            for (final id in PagesI18n.calGroups[gi].calendarIds) ...[
              _CalCard(key: _cardKeys[id], lang: lang, calId: id),
              const SizedBox(height: 14),
            ],
          ],
        ],
      );

  @override
  Widget build(BuildContext context) {
    final lang = widget.lang;
    final header = _PageHeader(
        PagesI18n.t(lang, 'calPageTitle'), PagesI18n.t(lang, 'calPageSubtitle'));
    // From 901px the contents sit in a side column next to the cards.
    if (MediaQuery.sizeOf(context).width >= 901) {
      return Padding(
        padding: const EdgeInsets.fromLTRB(10, 10, 10, 0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            header,
            const SizedBox(height: 20),
            Expanded(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _SideContents(width: 230, child: _toc(lang)),
                  const SizedBox(width: 40),
                  Expanded(
                    child: SingleChildScrollView(
                      controller: _scrollCtl,
                      padding: const EdgeInsets.only(bottom: 20),
                      child: _cards(lang),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      );
    }
    return SingleChildScrollView(
      controller: _scrollCtl,
      padding: const EdgeInsets.fromLTRB(10, 10, 10, 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          header,
          const SizedBox(height: 14),
          _ContentsBox(title: PagesI18n.t(lang, 'tocTitle'), child: _toc(lang)),
          const SizedBox(height: 14),
          _cards(lang),
        ],
      ),
    );
  }
}

class _CalCard extends StatefulWidget {
  final String lang;
  final String calId;
  const _CalCard({super.key, required this.lang, required this.calId});

  @override
  State<_CalCard> createState() => _CalCardState();
}

class _CalCardState extends State<_CalCard> {
  bool _formulaOpen = false; // <details> collapsed on mobile

  @override
  Widget build(BuildContext context) {
    final lang = widget.lang;
    final id = widget.calId;
    final d = PagesI18n.calendarDescription(lang, id);
    final variants = PagesI18n.variantItems(lang, id);
    final variantLabels = PagesI18n.variantLabels[id] ?? const [];
    final meta = PagesI18n.calMonthMeta[id];

    Widget para(String? text, {Color color = kInk, double size = 11.5}) =>
        text == null || text.isEmpty
            ? const SizedBox.shrink()
            : Padding(
                padding: const EdgeInsets.only(top: 8),
                child: Text(text, style: mono(size, color: color, height: 1.5)),
              );

    return Container(
      decoration: slabDecoration(shadow: 4),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(d['name'] ?? I18n.calendarName(lang, id),
              style: mono(16, weight: FontWeight.w800)),
          const SizedBox(height: 6),
          if (d['type'] != null)
            Text(d['type']!, style: mono(10.5, color: kInk600)),
          if (d['epoch'] != null)
            Text(d['epoch']!, style: mono(10.5, color: kInk600)),
          para(d['intro']),
          para(d['body']),
          para(d['adoption']),
          para(d['usage']),
          para(d['tabular'], color: kInk700, size: 10.5),
          para(d['arithmetic'], color: kInk700, size: 10.5),
          // Month-season strip.
          if (meta != null) _monthTable(lang, id, meta),
          // Variants list.
          if (variants.isNotEmpty) ...[
            const SizedBox(height: 10),
            for (var i = 0; i < variants.length; i++)
              Padding(
                padding: const EdgeInsets.only(bottom: 6),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    if (i < variantLabels.length)
                      Text(variantLabels[i].label,
                          style: mono(11, weight: FontWeight.w700)),
                    if (i < variantLabels.length &&
                        variantLabels[i].note.isNotEmpty)
                      Text(variantLabels[i].note,
                          style: mono(10, color: kInk500)),
                    Text(variants[i], style: mono(10.5, height: 1.45)),
                  ],
                ),
              ),
          ],
          para(d['variantsDivergence'], color: kInk700, size: 10.5),
          // Formula (collapsed <details> on mobile).
          if (d['formula'] != null || d['source'] != null) ...[
            const SizedBox(height: 8),
            InkWell(
              onTap: () => setState(() => _formulaOpen = !_formulaOpen),
              child: Row(
                children: [
                  Text(
                    PagesI18n.t(lang, 'formulaLabel').toUpperCase(),
                    style: mono(10,
                        weight: FontWeight.w700,
                        letterSpacing: 1.5,
                        color: kInk600),
                  ),
                  const SizedBox(width: 6),
                  Text(_formulaOpen ? '▴' : '▾', style: mono(10)),
                ],
              ),
            ),
            if (_formulaOpen) ...[
              para(d['formula'], color: kInk700, size: 10.5),
              if (d['source'] != null)
                Padding(
                  padding: const EdgeInsets.only(top: 6),
                  child: Text(
                    '${PagesI18n.t(lang, 'sourceLabel')}: ${d['source']}',
                    style: mono(10, color: kInk500, height: 1.4),
                  ),
                ),
            ],
          ],
          para(d['warning'], color: kInk600, size: 10.5),
        ],
      ),
    );
  }

  Widget _monthTable(String lang, String id, CalMonthMeta meta) {
    final names = I18n.monthList(lang, meta.monthsKey) ?? const <String>[];
    final seasons = PagesI18n.seasonLabelsFor(lang);
    if (names.isEmpty) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.only(top: 10),
      child: Column(
        children: [
          for (var i = 0; i < names.length && i < meta.days.length; i++)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 1.5),
              child: Row(
                children: [
                  SizedBox(
                      width: 20,
                      child: Text('${i + 1}',
                          style: mono(9.5, color: kInk500))),
                  Expanded(
                      child: Text(names[i],
                          style: mono(11, weight: FontWeight.w600))),
                  SizedBox(
                      width: 46,
                      child: Text(meta.days[i],
                          textAlign: TextAlign.right,
                          style: mono(10, color: kInk600))),
                  SizedBox(
                    width: 74,
                    child: Text(
                      meta.seasons != null && i < meta.seasons!.length
                          ? seasons[meta.seasons![i]]
                          : '',
                      textAlign: TextAlign.right,
                      style: mono(9.5, color: kInk500),
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
  final _keys = {for (final s in PagesI18n.methSectionOrder) s: GlobalKey()};

  void _scrollTo(String sec) {
    final ctx = _keys[sec]?.currentContext;
    if (ctx != null) {
      Scrollable.ensureVisible(ctx,
          duration: const Duration(milliseconds: 300));
    }
  }

  Widget _toc(String lang) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          for (final sec in PagesI18n.methSectionOrder)
            if (PagesI18n.methT(lang, sec, 'title') != null)
              _TocLink(PagesI18n.methT(lang, sec, 'title')!,
                  () => _scrollTo(sec),
                  size: 11.5),
        ],
      );

  @override
  Widget build(BuildContext context) {
    final lang = widget.lang;
    final wide = MediaQuery.sizeOf(context).width >= 801;
    final header = _PageHeader(PagesI18n.t(lang, 'methPageTitle'),
        PagesI18n.t(lang, 'methPageSubtitle'));
    final intro = wide
        // Wide: plain bold paragraph, no box.
        ? Text(PagesI18n.t(lang, 'methIntro'),
            style: mono(13, weight: FontWeight.w700, height: 1.55))
        // Phone: mono block, 4px left black border + offset shadow.
        : Container(
            decoration: BoxDecoration(
              color: kSurface,
              border: const Border(
                left: BorderSide(color: kInk, width: 4),
                top: BorderSide(color: kInk, width: 2),
                right: BorderSide(color: kInk, width: 2),
                bottom: BorderSide(color: kInk, width: 2),
              ),
              boxShadow: brutShadow(4),
            ),
            padding: const EdgeInsets.all(14),
            child: Text(PagesI18n.t(lang, 'methIntro'),
                style: mono(11.5, height: 1.55)),
          );
    final sections = Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        for (final sec in PagesI18n.methSectionOrder) ...[
          _MethSection(
              key: _keys[sec], lang: lang, sectionId: sec, flat: wide),
          SizedBox(height: wide ? 28 : 14),
        ],
      ],
    );

    if (wide) {
      return Padding(
        padding: const EdgeInsets.fromLTRB(10, 10, 10, 0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            header,
            const SizedBox(height: 20),
            Expanded(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _SideContents(width: 200, child: _toc(lang)),
                  const SizedBox(width: 48),
                  Expanded(
                    child: Align(
                      alignment: Alignment.topLeft,
                      child: ConstrainedBox(
                        constraints: const BoxConstraints(maxWidth: 620),
                        child: SingleChildScrollView(
                          padding: const EdgeInsets.only(bottom: 20),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              intro,
                              const SizedBox(height: 28),
                              sections,
                            ],
                          ),
                        ),
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
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(10, 10, 10, 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          header,
          const SizedBox(height: 14),
          _ContentsBox(title: PagesI18n.t(lang, 'tocTitle'), child: _toc(lang)),
          const SizedBox(height: 14),
          intro,
          const SizedBox(height: 14),
          sections,
        ],
      ),
    );
  }
}

class _MethSection extends StatelessWidget {
  final String lang;
  final String sectionId;
  final bool flat; // wide: a 4px top rule instead of a slab
  const _MethSection(
      {super.key,
      required this.lang,
      required this.sectionId,
      this.flat = false});

  @override
  Widget build(BuildContext context) {
    final title = PagesI18n.methT(lang, sectionId, 'title');
    final body = PagesI18n.methT(lang, sectionId, 'body');
    final body2 = PagesI18n.methT(lang, sectionId, 'body2');
    final warning = PagesI18n.methT(lang, sectionId, 'warning');
    final note = PagesI18n.methT(lang, sectionId, 'note');
    final isSources = sectionId == 'methSources';
    return Container(
      decoration: flat
          ? const BoxDecoration(
              border: Border(top: BorderSide(color: kInk, width: 4)))
          : slabDecoration(shadow: 4),
      padding: flat
          ? const EdgeInsets.only(top: 22)
          : const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (title != null)
            Text(title.toUpperCase(),
                style: mono(13, weight: FontWeight.w800, letterSpacing: 1.5)),
          if (body != null)
            Padding(
              padding: const EdgeInsets.only(top: 8),
              child: Text(body, style: mono(11.5, height: 1.55)),
            ),
          if (body2 != null)
            Padding(
              padding: const EdgeInsets.only(top: 8),
              child: Text(body2, style: mono(11.5, height: 1.55)),
            ),
          if (isSources)
            for (final triple in PagesI18n.methSources(lang))
              Padding(
                padding: const EdgeInsets.only(top: 8),
                child: Text.rich(
                  TextSpan(children: [
                    TextSpan(text: triple[0], style: mono(11, height: 1.5)),
                    TextSpan(
                        text: triple.length > 1 ? triple[1] : '',
                        style: mono(11, height: 1.5)
                            .copyWith(fontStyle: FontStyle.italic)),
                    TextSpan(
                        text: triple.length > 2 ? triple[2] : '',
                        style: mono(11, height: 1.5)),
                  ]),
                ),
              ),
          if (warning != null)
            Padding(
              padding: const EdgeInsets.only(top: 10),
              child: Text(warning, style: mono(10.5, color: kInk600, height: 1.5)),
            ),
          if (note != null)
            Padding(
              padding: const EdgeInsets.only(top: 10),
              child: Text(note, style: mono(10.5, color: kInk600, height: 1.5)),
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

// Subpage screens — calendars.html, methodology.html, about.html ports.

import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../engine/cal.dart';
import '../engine/registry.dart';
import '../i18n/i18n.dart';
import '../i18n/pages_i18n.dart';
import 'tokens.dart';

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

  @override
  Widget build(BuildContext context) {
    final lang = widget.lang;
    return ListView(
      controller: _scrollCtl,
      padding: const EdgeInsets.fromLTRB(10, 10, 10, 20),
      children: [
        _PageHeader(
            PagesI18n.t(lang, 'calPageTitle'), PagesI18n.t(lang, 'calPageSubtitle')),
        const SizedBox(height: 14),
        // TOC — grouped list of anchor links.
        Container(
          decoration: slabDecoration(shadow: 4),
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              for (final g in PagesI18n.calGroups) ...[
                Padding(
                  padding: const EdgeInsets.only(top: 6, bottom: 4),
                  child: Text(
                    I18n.calendarGroup(lang, g.id).toUpperCase(),
                    style: mono(9,
                        weight: FontWeight.w700,
                        color: kInk500,
                        letterSpacing: 1.5),
                  ),
                ),
                for (final id in g.calendarIds)
                  InkWell(
                    onTap: () => _scrollTo(id),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 4),
                      child: Text(
                        PagesI18n.calT(lang, id, 'name') ??
                            I18n.calendarName(lang, id),
                        style: mono(12, weight: FontWeight.w600).copyWith(
                            decoration: TextDecoration.underline),
                      ),
                    ),
                  ),
              ],
            ],
          ),
        ),
        const SizedBox(height: 14),
        for (final g in PagesI18n.calGroups) ...[
          Padding(
            padding: const EdgeInsets.only(top: 10, bottom: 8),
            child: Text(
              I18n.calendarGroup(lang, g.id).toUpperCase(),
              style: mono(12,
                  weight: FontWeight.w800, letterSpacing: 2, color: kInk700),
            ),
          ),
          for (final id in g.calendarIds) ...[
            _CalCard(key: _cardKeys[id], lang: lang, calId: id),
            const SizedBox(height: 14),
          ],
        ],
      ],
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

class MethodologyScreen extends StatelessWidget {
  final String lang;
  const MethodologyScreen({super.key, required this.lang});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.fromLTRB(10, 10, 10, 20),
      children: [
        _PageHeader(PagesI18n.t(lang, 'methPageTitle'),
            PagesI18n.t(lang, 'methPageSubtitle')),
        const SizedBox(height: 14),
        // Intro callout — mono block, 4px left black border + offset shadow.
        Container(
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
        ),
        const SizedBox(height: 14),
        for (final sec in PagesI18n.methSectionOrder) ...[
          _MethSection(lang: lang, sectionId: sec),
          const SizedBox(height: 14),
        ],
      ],
    );
  }
}

class _MethSection extends StatelessWidget {
  final String lang;
  final String sectionId;
  const _MethSection({required this.lang, required this.sectionId});

  @override
  Widget build(BuildContext context) {
    final title = PagesI18n.methT(lang, sectionId, 'title');
    final body = PagesI18n.methT(lang, sectionId, 'body');
    final body2 = PagesI18n.methT(lang, sectionId, 'body2');
    final warning = PagesI18n.methT(lang, sectionId, 'warning');
    final note = PagesI18n.methT(lang, sectionId, 'note');
    final isSources = sectionId == 'methSources';
    return Container(
      decoration: slabDecoration(shadow: 4),
      padding: const EdgeInsets.all(16),
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
// About page — colophon card.
// ---------------------------------------------------------------------------

class AboutScreen extends StatelessWidget {
  final String lang;
  const AboutScreen({super.key, required this.lang});

  @override
  Widget build(BuildContext context) {
    String a(String k) => PagesI18n.aboutT(lang, k);
    // #colophon-stamp — today's date in AH and HE, filled by about.html JS.
    final now = DateTime.now();
    final jd = Cal.civilToJD(now.year, now.month, now.day);
    final ah = kWebCalendars['hijri']!.fromJD(jd);
    final he = kWebCalendars['human']!.fromJD(jd);
    final stamp = 'AH ${ah.year} · HE ${he.year}';

    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 24, 16, 24),
      children: [
        Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 460),
            child: Container(
              decoration: slabDecoration(border: kBorderResult, shadow: 7),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Band.
                  Container(
                    color: kInk,
                    padding: const EdgeInsets.symmetric(
                        horizontal: 14, vertical: 10),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(a('bandCode'),
                            style: mono(10,
                                color: kNavText, letterSpacing: 1.5)),
                        Text(stamp,
                            style: mono(10,
                                color: kNavText, letterSpacing: 1)),
                      ],
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(18),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('${a('namePrefix')} Jakub Sypiański',
                            style: mono(19, weight: FontWeight.w800)),
                        const SizedBox(height: 14),
                        _metaRow(a('fieldLabel'), a('fieldValue')),
                        _metaRow(a('projectLabel'), a('projectValue')),
                        _metaRow(a('licenseLabel'), a('licenseValue')),
                        const SizedBox(height: 14),
                        InkWell(
                          onTap: () => launchUrl(
                              Uri.parse('https://sypian.ski'),
                              mode: LaunchMode.externalApplication),
                          child: Text('sypian.ski',
                              style: mono(12, weight: FontWeight.w700)
                                  .copyWith(
                                      decoration:
                                          TextDecoration.underline)),
                        ),
                        const SizedBox(height: 14),
                        Text(a('note'), style: mono(11, height: 1.5)),
                        const SizedBox(height: 14),
                        Material(
                          color: kInk,
                          child: InkWell(
                            onTap: () => launchUrl(
                                Uri.parse('https://ko-fi.com/sypianski'),
                                mode: LaunchMode.externalApplication),
                            child: Container(
                              constraints:
                                  const BoxConstraints(minHeight: 48),
                              alignment: Alignment.center,
                              child: Text(
                                a('kofi').toUpperCase(),
                                style: mono(12,
                                    weight: FontWeight.w800,
                                    color: kWhite,
                                    letterSpacing: 1.6),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _metaRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 110,
            child: Text(label,
                style: mono(10, color: kInk500, letterSpacing: 1)),
          ),
          Expanded(child: Text(value, style: mono(11.5))),
        ],
      ),
    );
  }
}

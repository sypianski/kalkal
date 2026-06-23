import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'engine/cal.dart';
import 'engine/calendars.dart';

// Brutalist tokens (mirrors css/style.css). Webapp uses solid black header
// and black converter card with inverted (white) text.
const Color kBg = Color(0xFFF0F0EC);
const Color kSurface = Color(0xFFFFFFFF);
const Color kInk = Color(0xFF000000);
const Color kInkInverse = Color(0xFFFFFFFF);
const Color kMuted = Color(0xFF555555);
const Color kMutedInverse = Color(0xFFAAAAAA);
const Color kDim = Color(0xFF888888);
const double kBorderSubtle = 2.0;
const double kBorderStrong = 3.0;

void main() => runApp(const KalkalApp());

class KalkalApp extends StatelessWidget {
  const KalkalApp({super.key});
  @override
  Widget build(BuildContext context) {
    final base = GoogleFonts.notoSansMonoTextTheme();
    return MaterialApp(
      title: 'kalkal — Kalendar Kalkulator',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        scaffoldBackgroundColor: kBg,
        textTheme: base.apply(bodyColor: kInk, displayColor: kInk),
        colorScheme: const ColorScheme.light(
          primary: kInk, onPrimary: kInkInverse,
          surface: kSurface, onSurface: kInk,
        ),
        useMaterial3: true,
      ),
      home: const ConverterScreen(),
    );
  }
}

class ConverterScreen extends StatefulWidget {
  const ConverterScreen({super.key});
  @override
  State<ConverterScreen> createState() => _ConverterScreenState();
}

class _ConverterScreenState extends State<ConverterScreen> {
  String _lang = 'EN';
  String _srcId = 'gregorian';
  String _hijriVariant = 'IIc';
  late int _year;
  late int _month;
  late int _day;
  bool _converted = false;

  @override
  void initState() {
    super.initState();
    _resetDefaults();
  }

  void _resetDefaults() {
    final c = findCalendar(_srcId)!;
    _year = c.defaultYear;
    _month = c.defaultMonth;
    _day = c.defaultDay;
  }

  CalendarDef get _src => findCalendar(_srcId)!;

  double? get _jd {
    try {
      final ml = _src.monthLength(_year, _month);
      if (ml == 0 || _day < 1 || _day > ml) return null;
      return _src.toJD(_year, _month, _day);
    } catch (_) { return null; }
  }

  @override
  Widget build(BuildContext context) {
    final w = MediaQuery.of(context).size.width;
    final wide = w >= 900;
    return Scaffold(
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          _header(),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: wide ? _twoCol() : _oneCol(),
            ),
          ),
        ],
      ),
    );
  }

  // ---------- Header (BLACK) ----------
  Widget _header() {
    return Container(
      color: kInk,
      padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 18),
      child: SafeArea(
        bottom: false,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('KALENDAR KALKULATOR',
                        style: TextStyle(
                          color: kInkInverse,
                          fontSize: 22,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 2,
                          fontFamily: GoogleFonts.notoSansMono().fontFamily,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Row(children: [
                        Text('MULTI-CALENDAR DATE CONVERTER ',
                          style: TextStyle(
                            color: kMutedInverse, fontSize: 11, letterSpacing: 1.2,
                            fontFamily: GoogleFonts.notoSansMono().fontFamily,
                          )),
                        Text('BETA',
                          style: TextStyle(
                            color: const Color(0xFFFF3838), fontSize: 11,
                            fontWeight: FontWeight.w700, letterSpacing: 1.2,
                            fontFamily: GoogleFonts.notoSansMono().fontFamily,
                          )),
                      ]),
                    ],
                  ),
                ),
                _langSwitcher(),
              ],
            ),
            const SizedBox(height: 14),
            _pageNav(),
          ],
        ),
      ),
    );
  }

  Widget _langSwitcher() {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: ['EN','PL','AR','EO'].map((l) {
        final active = _lang == l;
        return Padding(
          padding: const EdgeInsets.only(left: 4),
          child: InkWell(
            onTap: () => setState(() => _lang = l),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: active ? kInkInverse : Colors.transparent,
                border: Border.all(color: kInkInverse, width: 1.5),
              ),
              child: Text(l,
                style: TextStyle(
                  color: active ? kInk : kInkInverse,
                  fontSize: 12, fontWeight: FontWeight.w700, letterSpacing: 1,
                  fontFamily: GoogleFonts.notoSansMono().fontFamily,
                ),
              ),
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _pageNav() {
    final items = ['CONVERTER','CALENDARS','METHODOLOGY','ECLIPSES','JS'];
    return Wrap(
      spacing: 16, runSpacing: 8,
      children: items.map((label) {
        final active = label == 'CONVERTER';
        return Container(
          padding: const EdgeInsets.only(bottom: 4),
          decoration: BoxDecoration(
            border: Border(
              bottom: BorderSide(
                color: active ? kInkInverse : Colors.transparent,
                width: 2,
              ),
            ),
          ),
          child: Text(label,
            style: TextStyle(
              color: active ? kInkInverse : kMutedInverse,
              fontSize: 12, letterSpacing: 1.2,
              fontWeight: active ? FontWeight.w700 : FontWeight.w500,
              fontFamily: GoogleFonts.notoSansMono().fontFamily,
            ),
          ),
        );
      }).toList(),
    );
  }

  // ---------- Layout ----------
  Widget _twoCol() {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(width: 320, child: _converterCard()),
        const SizedBox(width: 32),
        Expanded(child: _rightColumn()),
      ],
    );
  }

  Widget _oneCol() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        _converterCard(),
        const SizedBox(height: 24),
        _rightColumn(),
      ],
    );
  }

  // ---------- Left: Converter card (BLACK) ----------
  Widget _converterCard() {
    final c = _src;
    return Container(
      decoration: const BoxDecoration(color: kInk),
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _labelInv('FROM'),
          const SizedBox(height: 10),
          _calendarPicker(),
          const SizedBox(height: 4),
          Container(height: 1, color: kInkInverse, margin: const EdgeInsets.only(top: 4, bottom: 18)),

          _labelInv('YEAR'),
          const SizedBox(height: 8),
          _invInput(
            key: ValueKey('year-$_srcId'),
            initial: _year.toString(),
            keyboardType: const TextInputType.numberWithOptions(signed: true),
            onChanged: (s) {
              final n = int.tryParse(s);
              if (n != null) setState(() => _year = n);
            },
          ),

          const SizedBox(height: 14),
          _labelInv('MONTH'),
          const SizedBox(height: 8),
          _invDropdown<int>(
            value: _month.clamp(1, c.monthNames.length),
            items: List.generate(c.monthNames.length, (i) =>
              DropdownMenuItem(
                value: i + 1,
                child: Text(c.monthNames[i],
                  style: const TextStyle(color: kInkInverse, fontSize: 14)),
              )),
            onChanged: (v) => setState(() {
              if (v != null) {
                _month = v;
                final ml = c.monthLength(_year, _month);
                if (ml > 0 && _day > ml) _day = ml;
              }
            }),
          ),

          const SizedBox(height: 14),
          _labelInv('DAY'),
          const SizedBox(height: 8),
          _invInput(
            key: ValueKey('day-$_srcId-$_month'),
            initial: _day.toString(),
            keyboardType: TextInputType.number,
            onChanged: (s) {
              final n = int.tryParse(s);
              if (n != null) setState(() => _day = n);
            },
          ),

          if (_srcId == 'hijri') ...[
            const SizedBox(height: 18),
            _labelInv('VARIANT'),
            const SizedBox(height: 6),
            _variantBar(['IIc','IIa','IIIa','IVa'], _hijriVariant, (v) => setState(() => _hijriVariant = v),
              labels: const {'IIc':'WÜSTENFELD','IIa':'EAST','IIIa':'WEST','IVa':'ḤABASH'}),
          ],

          const SizedBox(height: 26),
          Center(
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: kInkInverse,
                foregroundColor: kInk,
                shape: const RoundedRectangleBorder(borderRadius: BorderRadius.zero),
                padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 14),
                elevation: 0,
              ),
              onPressed: () => setState(() => _converted = true),
              child: Row(mainAxisSize: MainAxisSize.min, children: [
                Text('CONVERT',
                  style: TextStyle(
                    fontWeight: FontWeight.w700, letterSpacing: 2, fontSize: 13,
                    fontFamily: GoogleFonts.notoSansMono().fontFamily,
                  )),
                const SizedBox(width: 8),
                const Icon(Icons.arrow_forward, size: 14),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _calendarPicker() {
    return DropdownButtonHideUnderline(
      child: DropdownButton<String>(
        value: _srcId,
        isExpanded: true,
        dropdownColor: kInk,
        iconEnabledColor: kInkInverse,
        style: const TextStyle(color: kInkInverse),
        items: kCalendars.map((c) => DropdownMenuItem(
          value: c.id,
          child: Text(c.name.toUpperCase(),
            style: const TextStyle(
              color: kInkInverse, fontSize: 18,
              fontWeight: FontWeight.w700, letterSpacing: 1.2,
            )),
        )).toList(),
        onChanged: (v) {
          if (v != null) setState(() {
            _srcId = v;
            _resetDefaults();
            _converted = false;
          });
        },
      ),
    );
  }

  // ---------- Right column ----------
  bool _prolepticOpen = false;

  Widget _rightColumn() {
    final jd = _jd;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        _historyBar(),
        const SizedBox(height: 18),
        if (_converted && jd != null) ...[
          _resultPanel(jd),
          const SizedBox(height: 18),
          _contextualCard(jd),
          const SizedBox(height: 12),
          _outOfEraCard(jd),
        ] else if (_converted && jd == null)
          _errorCard()
        else
          _placeholderCard(),
      ],
    );
  }

  Widget _historyBar() {
    return Container(
      decoration: const BoxDecoration(
        color: kSurface,
        border: Border.fromBorderSide(BorderSide(color: kInk, width: kBorderStrong)),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
      child: Row(
        children: [
          Text('HISTORY',
            style: TextStyle(
              color: kDim, fontSize: 13, letterSpacing: 2, fontWeight: FontWeight.w700,
              fontFamily: GoogleFonts.notoSansMono().fontFamily,
            )),
          const SizedBox(width: 6),
          const Icon(Icons.keyboard_arrow_down, size: 18, color: kDim),
          const Spacer(),
        ],
      ),
    );
  }

  Widget _placeholderCard() {
    return Container(
      height: 200,
      alignment: Alignment.center,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text('☉',
            style: TextStyle(
              fontSize: 56, color: kDim,
              fontFamily: GoogleFonts.notoSansMono().fontFamily,
            )),
          const SizedBox(height: 12),
          Text('PICK SOURCE CALENDAR · ENTER DATE · PRESS CONVERT',
            style: TextStyle(
              color: kDim, fontSize: 11, letterSpacing: 1.5,
              fontFamily: GoogleFonts.notoSansMono().fontFamily,
            )),
        ],
      ),
    );
  }

  Widget _resultPanel(double jd) {
    final dow = Cal.getDayOfWeek(jd);
    final zod = Cal.getZodiacSign(jd);
    return Container(
      decoration: const BoxDecoration(
        color: kSurface,
        border: Border.fromBorderSide(BorderSide(color: kInk, width: kBorderStrong)),
      ),
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(kWeekdays[dow].toUpperCase(),
                style: TextStyle(
                  color: kInk, fontWeight: FontWeight.w700,
                  fontSize: 18, letterSpacing: 3,
                  fontFamily: GoogleFonts.notoSansMono().fontFamily,
                )),
              const Spacer(),
              Text('JDN ${jd.toStringAsFixed(1)}',
                style: TextStyle(
                  color: kDim, fontSize: 11, letterSpacing: 1.2,
                  fontFamily: GoogleFonts.notoSansMono().fontFamily,
                )),
              const SizedBox(width: 16),
              Text(kZodiac[zod].toUpperCase(),
                style: TextStyle(
                  color: kDim, fontSize: 11, letterSpacing: 1.2,
                  fontFamily: GoogleFonts.notoSansMono().fontFamily,
                )),
            ],
          ),
          Container(height: 2, color: kInk, margin: const EdgeInsets.symmetric(vertical: 16)),
          // Source date echoed big
          Text('${_src.name.toUpperCase()}',
            style: TextStyle(
              color: kDim, fontSize: 10, letterSpacing: 1.5,
              fontFamily: GoogleFonts.notoSansMono().fontFamily,
            )),
          const SizedBox(height: 4),
          Text(_formatDate(_src, _year, _month, _day),
            style: TextStyle(
              color: kInk, fontSize: 28, fontWeight: FontWeight.w700, letterSpacing: -0.5,
              fontFamily: GoogleFonts.notoSansMono().fontFamily,
            )),
        ],
      ),
    );
  }

  String _formatDate(CalendarDef c, int y, int m, int d) {
    final mn = (m >= 1 && m <= c.monthNames.length) ? c.monthNames[m - 1] : 'M$m';
    return '$d $mn $y';
  }

  // ---------- Contemporaneous calendars (in-era, grouped by family) ----------
  Widget _contextualCard(double jd) {
    final inEra = kCalendars.where((c) => c.id != _srcId && jd >= c.epochJD).toList();
    if (inEra.isEmpty) return const SizedBox.shrink();
    return Container(
      decoration: const BoxDecoration(
        color: kSurface,
        border: Border.fromBorderSide(BorderSide(color: kInk, width: kBorderStrong)),
      ),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('CONTEMPORANEOUS CALENDARS',
            style: TextStyle(
              color: kInk, fontSize: 11, letterSpacing: 2, fontWeight: FontWeight.w700,
              fontFamily: GoogleFonts.notoSansMono().fontFamily,
            )),
          const SizedBox(height: 16),
          _groupedGrid(inEra, jd),
        ],
      ),
    );
  }

  // ---------- Proleptic conversions (collapsed) ----------
  Widget _outOfEraCard(double jd) {
    final proleptic = kCalendars.where((c) => c.id != _srcId && jd < c.epochJD).toList();
    if (proleptic.isEmpty) return const SizedBox.shrink();
    return Container(
      decoration: BoxDecoration(
        color: kSurface,
        border: Border.all(color: kInk, width: kBorderStrong),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          InkWell(
            onTap: () => setState(() => _prolepticOpen = !_prolepticOpen),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
              child: Row(children: [
                Text('PROLEPTIC CONVERSIONS',
                  style: TextStyle(
                    color: kInk, fontSize: 11, letterSpacing: 2, fontWeight: FontWeight.w700,
                    fontFamily: GoogleFonts.notoSansMono().fontFamily,
                  )),
                const Spacer(),
                Icon(_prolepticOpen ? Icons.keyboard_arrow_up : Icons.keyboard_arrow_down, size: 18),
              ]),
            ),
          ),
          if (_prolepticOpen)
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
              child: _groupedGrid(proleptic, jd),
            ),
        ],
      ),
    );
  }

  Widget _groupedGrid(List<CalendarDef> cals, double jd) {
    final byGroup = <String, List<CalendarDef>>{};
    for (final c in cals) {
      byGroup.putIfAbsent(c.group, () => []).add(c);
    }
    final ordered = kGroupOrder.where(byGroup.containsKey).toList();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        for (int i = 0; i < ordered.length; i++) ...[
          if (i > 0) const SizedBox(height: 16),
          Text((kGroupLabels[ordered[i]] ?? ordered[i]).toUpperCase(),
            style: TextStyle(
              color: kDim, fontSize: 9, letterSpacing: 2, fontWeight: FontWeight.w700,
              fontFamily: GoogleFonts.notoSansMono().fontFamily,
            )),
          const SizedBox(height: 8),
          LayoutBuilder(builder: (ctx, bc) {
            final cols = bc.maxWidth < 500 ? 1 : bc.maxWidth < 800 ? 2 : 3;
            final tileW = (bc.maxWidth - (cols - 1) * 16) / cols;
            return Wrap(
              spacing: 16, runSpacing: 12,
              children: byGroup[ordered[i]]!.map((c) => SizedBox(
                width: tileW,
                child: _calTile(c, jd),
              )).toList(),
            );
          }),
        ],
      ],
    );
  }

  Widget _calTile(CalendarDef c, double jd) {
    final ymd = c.fromJD(jd);
    final mn = (ymd.month >= 1 && ymd.month <= c.monthNames.length) ? c.monthNames[ymd.month - 1] : 'M${ymd.month}';
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(c.name.toUpperCase(),
          style: TextStyle(
            color: kDim, fontSize: 9, letterSpacing: 1.5,
            fontFamily: GoogleFonts.notoSansMono().fontFamily,
          )),
        const SizedBox(height: 2),
        Text('${ymd.day} $mn ${ymd.year}',
          style: TextStyle(
            color: kInk, fontSize: 14, fontWeight: FontWeight.w500,
            fontFamily: GoogleFonts.notoSansMono().fontFamily,
          )),
      ],
    );
  }

  Widget _resultRow(CalendarDef c, double jd) {
    final ymd = c.fromJD(jd);
    final mn = (ymd.month >= 1 && ymd.month <= c.monthNames.length)
        ? c.monthNames[ymd.month - 1]
        : 'M${ymd.month}';
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 190,
            child: Text(c.name.toUpperCase(),
              style: TextStyle(
                color: kDim, fontSize: 10, letterSpacing: 1.5,
                fontFamily: GoogleFonts.notoSansMono().fontFamily,
              )),
          ),
          Expanded(
            child: Text('${ymd.day} $mn ${ymd.year}',
              style: TextStyle(
                color: kInk, fontSize: 15, fontWeight: FontWeight.w500,
                fontFamily: GoogleFonts.notoSansMono().fontFamily,
              )),
          ),
        ],
      ),
    );
  }

  Widget _errorCard() {
    return Container(
      decoration: const BoxDecoration(
        color: kSurface,
        border: Border.fromBorderSide(BorderSide(color: Colors.red, width: kBorderStrong)),
      ),
      padding: const EdgeInsets.all(20),
      child: Text('INVALID DATE',
        style: TextStyle(
          color: Colors.red, fontWeight: FontWeight.w700, letterSpacing: 2,
          fontFamily: GoogleFonts.notoSansMono().fontFamily,
        )),
    );
  }

  // ---------- Inverted (black-bg) primitives ----------
  Widget _labelInv(String s) => Text(s,
    style: TextStyle(
      color: kMutedInverse, fontSize: 10, letterSpacing: 1.5, fontWeight: FontWeight.w600,
      fontFamily: GoogleFonts.notoSansMono().fontFamily,
    ));

  Widget _invInput({Key? key, required String initial, required TextInputType keyboardType, required ValueChanged<String> onChanged}) {
    return Container(
      decoration: const BoxDecoration(
        border: Border(bottom: BorderSide(color: kInkInverse, width: 1)),
      ),
      child: TextFormField(
        key: key,
        initialValue: initial,
        keyboardType: keyboardType,
        style: TextStyle(
          color: kInkInverse, fontSize: 18, fontWeight: FontWeight.w600,
          fontFamily: GoogleFonts.notoSansMono().fontFamily,
        ),
        cursorColor: kInkInverse,
        decoration: const InputDecoration(
          isDense: true, border: InputBorder.none,
          contentPadding: EdgeInsets.symmetric(vertical: 10),
        ),
        inputFormatters: keyboardType == TextInputType.number
            ? [FilteringTextInputFormatter.digitsOnly]
            : null,
        onChanged: onChanged,
      ),
    );
  }

  Widget _invDropdown<T>({required T value, required List<DropdownMenuItem<T>> items, required ValueChanged<T?> onChanged}) {
    return Container(
      decoration: const BoxDecoration(
        border: Border(bottom: BorderSide(color: kInkInverse, width: 1)),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<T>(
          value: value, items: items, onChanged: onChanged,
          isExpanded: true,
          dropdownColor: kInk,
          iconEnabledColor: kInkInverse,
          style: TextStyle(
            color: kInkInverse, fontSize: 15,
            fontFamily: GoogleFonts.notoSansMono().fontFamily,
          ),
        ),
      ),
    );
  }

  Widget _variantBar(List<String> ids, String selected, ValueChanged<String> onTap, {required Map<String, String> labels}) {
    return Wrap(
      spacing: 4, runSpacing: 4,
      children: ids.map((id) {
        final active = id == selected;
        return InkWell(
          onTap: () => onTap(id),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: active ? kInkInverse : Colors.transparent,
              border: Border.all(color: kInkInverse, width: 1.2),
            ),
            child: Text(labels[id] ?? id,
              style: TextStyle(
                color: active ? kInk : kInkInverse,
                fontSize: 9, letterSpacing: 0.8, fontWeight: FontWeight.w700,
                fontFamily: GoogleFonts.notoSansMono().fontFamily,
              ),
            ),
          ),
        );
      }).toList(),
    );
  }
}

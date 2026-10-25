// Brutalist design tokens — css/style.css custom properties.

import 'package:flutter/material.dart';

// Colors
const kBg = Color(0xFFF0F0EC); // --brut-bg / theme-color
const kSurface = Color(0xFFFFFFFF); // --parchment-100
const kSurface2 = Color(0xFFE8E8E4); // --parchment-200
const kInk = Color(0xFF000000);
const kInk800 = Color(0xFF111111);
const kInk700 = Color(0xFF333333);
const kInk600 = Color(0xFF555555);
const kInk500 = Color(0xFF777777);
const kInk400 = Color(0xFF999999);
const kInk300 = Color(0xFFBBBBBB);
const kShadow = Color(0xFF242220); // --brut-shadow
const kNavText = Color(0xFFB0B0B0);
const kWhite = Color(0xFFFFFFFF);

// Signal colour (--brut-signal): only for things you click or choose.
const kSignal = Color(0xFF1B3DFF);
const kSignalDark = Color(0xFF0D27B8);

/// Width from which the web switches to its desktop layout (`min-width: 601px`).
const kWideBreakpoint = 601.0;
bool isWide(BuildContext context) =>
    MediaQuery.sizeOf(context).width >= kWideBreakpoint;

// Fonts (bundled assets — see pubspec.yaml)
const kMono = 'NotoSansMono';
const kSans = 'NotoSans';
const kCharis = 'CharisSIL';
const kAmiri = 'Amiri';

// Borders (logical px)
const kBorderSlab = 2.5;
const kBorderResult = 3.0;
const kBorderSubtle = 2.0;

// Offset shadows: hard, no blur.
List<BoxShadow> brutShadow(double offset) => [
      BoxShadow(color: kShadow, offset: Offset(offset, offset)),
    ];

// Slab: white card, 2.5px black border, 5px offset shadow.
BoxDecoration slabDecoration({double border = kBorderSlab, double shadow = 5}) =>
    BoxDecoration(
      color: kSurface,
      border: Border.all(color: kInk, width: border),
      boxShadow: brutShadow(shadow),
    );

/// Noto Sans (regular + a real bold) — the phone result screen's face for
/// labels, dates and names; [mono] stays for numerals (TASK-16). Bold weights
/// above 700 map to the bold file, so 800/900 look the same as 700.
TextStyle sans(double size,
        {FontWeight weight = FontWeight.w400,
        Color color = kInk,
        double? letterSpacing,
        double? height}) =>
    TextStyle(
      fontFamily: kSans,
      fontSize: size,
      fontWeight: weight,
      color: color,
      letterSpacing: letterSpacing,
      height: height,
      fontFamilyFallback: const [kCharis, kAmiri, kMono],
    );

/// Phone result widgets pick sans or mono per call site; wide stays mono.
TextStyle face(bool useSans, double size,
        {FontWeight weight = FontWeight.w400,
        Color color = kInk,
        double? letterSpacing,
        double? height}) =>
    useSans
        ? sans(size,
            weight: weight, color: color, letterSpacing: letterSpacing, height: height)
        : mono(size,
            weight: weight, color: color, letterSpacing: letterSpacing, height: height);

TextStyle mono(double size,
        {FontWeight weight = FontWeight.w400,
        Color color = kInk,
        double? letterSpacing,
        double? height}) =>
    TextStyle(
      fontFamily: kMono,
      fontSize: size,
      fontWeight: weight,
      color: color,
      letterSpacing: letterSpacing,
      height: height,
      // ISO 233 transliteration chars (Ǧ, ʿ, Ḥ…) fall back to Charis SIL,
      // Arabic script to Amiri — mirrors css/fonts.css stacks.
      fontFamilyFallback: const [kCharis, kAmiri, kSans],
    );

/// E-ink look (TASK-17), the Flutter side of css/eink.css: the whole app is
/// drawn as usual and then pushed through a luminance threshold, so every
/// grey and the signal blue become black and every light tone becomes white
/// (white-on-blue buttons turn into white-on-black). Text is 25% larger —
/// the web does 16 → 20 px — and animations are off.
class EinkFrame extends StatelessWidget {
  final Widget child;
  const EinkFrame({super.key, required this.child});

  // Luma weights, gain 60 around 0.8: #BBB and darker → black, #E8E8E4 → white.
  static const _k = 60.0;
  static const _t = 0.8;
  static const _filter = ColorFilter.matrix(<double>[
    _k * 0.2126, _k * 0.7152, _k * 0.0722, 0, -_k * _t * 255,
    _k * 0.2126, _k * 0.7152, _k * 0.0722, 0, -_k * _t * 255,
    _k * 0.2126, _k * 0.7152, _k * 0.0722, 0, -_k * _t * 255,
    0, 0, 0, 1, 0,
  ]);

  @override
  Widget build(BuildContext context) {
    final mq = MediaQuery.of(context);
    return MediaQuery(
      data: mq.copyWith(
        textScaler: TextScaler.linear(mq.textScaler.scale(1) * 1.25),
        disableAnimations: true,
      ),
      child: ColoredBox(
        color: kWhite,
        child: ColorFiltered(colorFilter: _filter, child: child),
      ),
    );
  }
}

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

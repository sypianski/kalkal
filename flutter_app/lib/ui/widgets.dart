// Shared brutalist widgets: numbered slab, collapsible tile, bottom nav.

import 'package:flutter/material.dart';

import 'tokens.dart';

/// Form slab — white card, black border, hard shadow, numbered corner tag
/// (`01 • FROM` style, white-on-black, top-right). Mirrors the mobile
/// `.form-field` slabs of css/style.css.
class Slab extends StatelessWidget {
  final String tag; // e.g. '01 • FROM' — English-only, as in the CSS
  final Widget child;
  const Slab({super.key, required this.tag, required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: slabDecoration(),
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(18, 22, 18, 16),
            child: child,
          ),
          Positioned(
            top: 0,
            right: 0,
            child: Container(
              color: kInk,
              padding: const EdgeInsets.fromLTRB(8, 4, 8, 3),
              child: Text(
                tag,
                style: mono(9,
                    weight: FontWeight.w700,
                    color: kWhite,
                    letterSpacing: 1.3),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// Underline-only input inside a slab: mono 700, 2px black bottom border.
InputDecoration slabInputDecoration() => const InputDecoration(
      isDense: true,
      border: UnderlineInputBorder(
        borderSide: BorderSide(color: kInk, width: 2),
      ),
      enabledBorder: UnderlineInputBorder(
        borderSide: BorderSide(color: kInk, width: 2),
      ),
      focusedBorder: UnderlineInputBorder(
        borderSide: BorderSide(color: kInk, width: 2),
      ),
      contentPadding: EdgeInsets.symmetric(vertical: 8),
    );

/// Collapsible tile — `.tile-toggle` + `.tile-content` from the web app.
/// Header: uppercase mono 800 button, min-height 58, chevron ▾ rotating.
class TileToggle extends StatelessWidget {
  final String title;
  final String? hints; // astro glyph hints shown next to the title
  final bool expanded;
  final VoidCallback onTap;
  final Widget child;
  const TileToggle({
    super.key,
    required this.title,
    this.hints,
    required this.expanded,
    required this.onTap,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: slabDecoration(shadow: 4),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          InkWell(
            onTap: onTap,
            child: Container(
              constraints: const BoxConstraints(minHeight: 58),
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      title.toUpperCase(),
                      style: mono(13.5,
                          weight: FontWeight.w800, letterSpacing: 2.4),
                    ),
                  ),
                  if (hints != null && hints!.isNotEmpty)
                    Padding(
                      padding: const EdgeInsets.only(right: 10),
                      child: Text(hints!, style: mono(13, color: kInk600)),
                    ),
                  AnimatedRotation(
                    turns: expanded ? 0.5 : 0,
                    duration: const Duration(milliseconds: 150),
                    child: Text('▾', style: mono(14, weight: FontWeight.w700)),
                  ),
                ],
              ),
            ),
          ),
          if (expanded)
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
              child: child,
            ),
        ],
      ),
    );
  }
}

/// Bottom navigation — fixed black bar, 72px items, Unicode glyph icons,
/// active item gets white text + 3px white top border (`.page-nav` ≤600px).
class NavItem {
  final String glyph;
  final String label;
  const NavItem(this.glyph, this.label);
}

class BrutBottomNav extends StatelessWidget {
  final List<NavItem> items;
  final int activeIndex;
  final ValueChanged<int> onTap;
  const BrutBottomNav({
    super.key,
    required this.items,
    required this.activeIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: kInk,
        border: Border(top: BorderSide(color: kInk700, width: 3)),
      ),
      child: SafeArea(
        top: false,
        child: Row(
          children: [
            for (var i = 0; i < items.length; i++)
              Expanded(
                child: InkWell(
                  onTap: () => onTap(i),
                  child: Container(
                    constraints: const BoxConstraints(minHeight: 72),
                    decoration: BoxDecoration(
                      border: Border(
                        top: BorderSide(
                          color: i == activeIndex
                              ? kWhite
                              : Colors.transparent,
                          width: 3,
                        ),
                      ),
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          items[i].glyph,
                          style: TextStyle(
                            fontSize: 22,
                            height: 1.1,
                            color: i == activeIndex ? kWhite : kNavText,
                          ),
                        ),
                        const SizedBox(height: 3),
                        Text(
                          items[i].label.toUpperCase(),
                          textAlign: TextAlign.center,
                          style: mono(8.5,
                              weight: FontWeight.w700,
                              letterSpacing: 0.7,
                              color: i == activeIndex ? kWhite : kNavText),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

/// Full-width inverted CONVERT button — label left, arrow right, min 58px.
class ConvertButton extends StatelessWidget {
  final String label;
  final VoidCallback onPressed;
  const ConvertButton({super.key, required this.label, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: kInk,
      child: InkWell(
        onTap: onPressed,
        child: Container(
          constraints: const BoxConstraints(minHeight: 58),
          padding: const EdgeInsets.symmetric(horizontal: 20),
          decoration: BoxDecoration(boxShadow: brutShadow(5)),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                label.toUpperCase(),
                style: mono(15,
                    weight: FontWeight.w800, letterSpacing: 2.7, color: kWhite),
              ),
              const Icon(Icons.arrow_forward, color: kWhite, size: 20),
            ],
          ),
        ),
      ),
    );
  }
}

/// Result-variant toggle button (`.variant-btn`): active = black bg / white.
class VariantButton extends StatelessWidget {
  final String label;
  final bool active;
  final VoidCallback onTap;
  const VariantButton({
    super.key,
    required this.label,
    required this.active,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Container(
        constraints: const BoxConstraints(minHeight: 34),
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: active ? kInk : kSurface,
          border: Border.all(color: kInk, width: 1.5),
        ),
        child: Text(
          label,
          style: mono(11,
              weight: FontWeight.w700, color: active ? kWhite : kInk),
        ),
      ),
    );
  }
}

/// Desktop header (`.site-header` + `.page-nav`): title left, menu right.
/// Below 1000 px the menu drops under the title, as on the web.
class WideHeader extends StatelessWidget {
  final String title;
  final List<NavItem> items;
  final int activeIndex;
  final ValueChanged<int> onTap;
  const WideHeader({
    super.key,
    required this.title,
    required this.items,
    required this.activeIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.sizeOf(context).width;
    final pad = ((width - 1100) / 2).clamp(0.0, double.infinity) + 24;
    final titleW = Text(
      title.toUpperCase(),
      style: mono(19, weight: FontWeight.w800, color: kWhite, letterSpacing: 5),
    );
    final nav = Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        for (var i = 0; i < items.length; i++)
          InkWell(
            onTap: () => onTap(i),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                border: Border(
                  bottom: BorderSide(
                      color: i == activeIndex ? kWhite : Colors.transparent,
                      width: 2),
                ),
              ),
              child: Text(
                items[i].label.toUpperCase(),
                style: mono(9.5,
                    weight: FontWeight.w700,
                    letterSpacing: 1.8,
                    color: i == activeIndex ? kWhite : kInk500),
              ),
            ),
          ),
      ],
    );
    return Container(
      color: kInk,
      padding: EdgeInsets.fromLTRB(pad, 14, pad, 12),
      child: width >= 1000
          ? Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [titleW, nav],
            )
          : Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                titleW,
                const SizedBox(height: 10),
                SingleChildScrollView(
                    scrollDirection: Axis.horizontal, child: nav),
              ],
            ),
    );
  }
}

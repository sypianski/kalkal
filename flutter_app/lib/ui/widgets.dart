// Shared brutalist widgets: collapsible tile, bottom nav, convert button.

import 'package:flutter/material.dart';

import 'tokens.dart';

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

/// Navigation entry: Material icon + label (the old Unicode glyphs rendered
/// as empty boxes on fonts without the symbols).
class NavItem {
  final IconData icon;
  final String label;
  const NavItem(this.icon, this.label);
}

/// Phone bottom navigation — black bar, 60px, Material icons in a pill,
/// active item gets a signal top rule and a lighter pill. The last item is
/// "More": it opens a sheet with the remaining screens ([overflow]).
class BrutBottomNav extends StatelessWidget {
  final List<NavItem> items; // main entries, the last one being "More"
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
        border: Border(top: BorderSide(color: kInk700, width: 1)),
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
                    constraints: const BoxConstraints(minHeight: 60),
                    decoration: BoxDecoration(
                      border: Border(
                        top: BorderSide(
                          color: i == activeIndex
                              ? kSignal
                              : Colors.transparent,
                          width: 3,
                        ),
                      ),
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          width: 52,
                          height: 28,
                          alignment: Alignment.center,
                          color: i == activeIndex
                              ? const Color(0xFF2A2A2A)
                              : Colors.transparent,
                          child: Icon(items[i].icon,
                              size: 22,
                              color:
                                  i == activeIndex ? kWhite : kNavText),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          items[i].label,
                          textAlign: TextAlign.center,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: mono(10.5,
                              weight: FontWeight.w600,
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

/// Bottom sheet behind the "More" tab: one big row per remaining screen.
Future<int?> showMoreSheet(BuildContext context,
    {required List<NavItem> items, required int activeIndex}) {
  return showModalBottomSheet<int>(
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
          children: [
            for (var i = 0; i < items.length; i++)
              InkWell(
                onTap: () => Navigator.of(ctx).pop(i),
                child: Container(
                  constraints: const BoxConstraints(minHeight: 60),
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  color: i == activeIndex ? kInk : Colors.transparent,
                  child: Row(
                    children: [
                      Icon(items[i].icon,
                          size: 22,
                          color: i == activeIndex ? kWhite : kInk),
                      const SizedBox(width: 16),
                      Text(
                        items[i].label.toUpperCase(),
                        style: mono(13,
                            weight: FontWeight.w800,
                            letterSpacing: 1.8,
                            color: i == activeIndex ? kWhite : kInk),
                      ),
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    ),
  );
}

/// Full-width signal-colour CONVERT button — label left, arrow right, min 58px.
class ConvertButton extends StatelessWidget {
  final String label;
  final VoidCallback onPressed;
  const ConvertButton({super.key, required this.label, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    // Colour + shadow on the outer box, Material on top so the ripple shows.
    return Container(
      decoration: BoxDecoration(color: kSignal, boxShadow: brutShadow(5)),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onPressed,
          child: Container(
            constraints: const BoxConstraints(minHeight: 58),
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  label.toUpperCase(),
                  style: mono(15,
                      weight: FontWeight.w800,
                      letterSpacing: 2.7,
                      color: kWhite),
                ),
                const Icon(Icons.arrow_forward, color: kWhite, size: 20),
              ],
            ),
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

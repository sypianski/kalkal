// Grouped calendar picker + month picker. On the touch web app the inputs
// are readonly (no keyboard, no filter) and open a full grouped list; here
// that maps to a modal bottom sheet with the same grouping, the vertical
// group-label strip, and ≥44px hit targets.

import 'package:flutter/material.dart';

import '../engine/registry.dart';
import '../i18n/i18n.dart';
import '../i18n/mobile_i18n.dart';
import '../state/prefs.dart';
import 'tokens.dart';

Future<String?> showCalendarPicker(BuildContext context, String lang,
    {String? selectedId}) async {
  final recent = Prefs.instance.recentCals;
  final picked = await showModalBottomSheet<String>(
    context: context,
    backgroundColor: kSurface,
    shape: const RoundedRectangleBorder(), // brutalist: no radius
    constraints: BoxConstraints(
      maxHeight: MediaQuery.of(context).size.height * 0.75,
    ),
    builder: (ctx) => SafeArea(
      child: ListView(
        padding: const EdgeInsets.symmetric(vertical: 6),
        children: [
          if (recent.isNotEmpty)
            _GroupSection(
              label: MobileI18n.t(lang, 'recent'),
              children: [
                for (final id in recent)
                  _PickerItem(
                    label: I18n.calendarName(lang, id),
                    active: id == selectedId,
                    onTap: () => Navigator.of(ctx).pop(id),
                  ),
              ],
            ),
          for (final group in kCalendarGroups) ...[
            _GroupSection(
              label: I18n.calendarGroup(lang, group.group),
              children: [
                for (final id in group.items)
                  _PickerItem(
                    label: I18n.calendarName(lang, id),
                    active: id == selectedId,
                    onTap: () => Navigator.of(ctx).pop(id),
                  ),
              ],
            ),
          ],
        ],
      ),
    ),
  );
  if (picked != null) Prefs.instance.pushRecentCal(picked);
  return picked;
}

/// Month picker — readonly dropdown of the source calendar's month names,
/// first row is the "—" clear item (year-only precision), like the touch
/// month dropdown in js/app.js.
Future<int?> showMonthPicker(BuildContext context, String lang,
    WebCalendar cal, int? selectedMonth) {
  final names = cal.monthNames(lang);
  return showModalBottomSheet<int>(
    context: context,
    backgroundColor: kSurface,
    shape: const RoundedRectangleBorder(),
    constraints: BoxConstraints(
      maxHeight: MediaQuery.of(context).size.height * 0.75,
    ),
    builder: (ctx) => SafeArea(
      child: ListView(
        padding: const EdgeInsets.symmetric(vertical: 6),
        children: [
          _PickerItem(
            label: '—',
            active: selectedMonth == null,
            // sentinel 0 = clear; sheet pop(null) means "dismissed"
            onTap: () => Navigator.of(ctx).pop(0),
          ),
          for (var i = 0; i < cal.monthCount && i < names.length; i++)
            _PickerItem(
              label: names[i],
              active: selectedMonth == i + 1,
              onTap: () => Navigator.of(ctx).pop(i + 1),
            ),
        ],
      ),
    ),
  );
}

class _GroupSection extends StatelessWidget {
  final String label;
  final List<Widget> children;
  const _GroupSection({required this.label, required this.children});

  @override
  Widget build(BuildContext context) {
    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Vertical group label strip (writing-mode: vertical-lr rotated).
          Container(
            width: 26,
            color: kSurface2,
            alignment: Alignment.center,
            child: RotatedBox(
              quarterTurns: 3,
              child: Text(
                label.toUpperCase(),
                style: mono(9,
                    weight: FontWeight.w700,
                    color: kInk600,
                    letterSpacing: 1.5),
              ),
            ),
          ),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: children,
            ),
          ),
        ],
      ),
    );
  }
}

class _PickerItem extends StatelessWidget {
  final String label;
  final bool active;
  final VoidCallback onTap;
  const _PickerItem({
    required this.label,
    required this.active,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Container(
        constraints: const BoxConstraints(minHeight: 44),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        color: active ? kInk : Colors.transparent,
        alignment: Alignment.centerLeft,
        child: Text(
          label,
          style: mono(14,
              weight: active ? FontWeight.w700 : FontWeight.w500,
              color: active ? kWhite : kInk),
        ),
      ),
    );
  }
}

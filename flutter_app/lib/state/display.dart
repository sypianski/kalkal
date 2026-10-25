// Display mode: standard or e-ink — the Flutter counterpart of js/display.js
// and css/eink.css. E-ink = pure black on white, larger text, no animations.
//
// Choice: Prefs 'kalkal-display' = 'eink' | 'normal'. Without a choice the
// mode follows the device: the Android side reports known e-ink makers
// (Onyx/Boox, Bigme, …) — Flutter has no `update: slow` media query.

import 'package:flutter/scheduler.dart' show timeDilation;
import 'package:flutter/services.dart';
import 'package:flutter/foundation.dart';

import 'prefs.dart';

class DisplayMode {
  DisplayMode._();

  /// True while the e-ink look is on. The app root listens to it.
  static final ValueNotifier<bool> eink = ValueNotifier(false);

  static const _channel = MethodChannel('app.sypianski.kalkal/display');

  /// Reads the stored choice (or asks the device) — call once at start-up.
  /// [detect] replaces the device query (widget tests have no native side and
  /// a platform-channel call would never complete under fake async).
  static Future<void> init({Future<bool> Function()? detect}) async {
    final choice = Prefs.instance.displayChoice;
    final on = choice != null ? choice == 'eink' : await (detect ?? _detect)();
    _apply(on);
  }

  /// A user pick from Settings; it overrides auto-detection from now on.
  static void choose(bool on) {
    Prefs.instance.displayChoice = on ? 'eink' : 'normal';
    _apply(on);
  }

  static Future<bool> _detect() async {
    try {
      return await _channel.invokeMethod<bool>('isEink') ?? false;
    } catch (_) {
      return false; // no native side (tests, iOS) → standard
    }
  }

  static void _apply(bool on) {
    eink.value = on;
    // Every animation, sheet slide and ripple finishes in one frame: each
    // intermediate frame would be a visible panel refresh.
    timeDilation = on ? 0.001 : 1.0;
  }
}

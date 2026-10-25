// kalkal — Flutter port of the mobile web app (kalkal.online).
// Shell: fixed black bottom nav (Converter / Calendars / Methodology /
// Settings / Author) over per-tab screens, mirroring `.page-nav` ≤600px.

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'i18n/i18n.dart';
import 'i18n/mobile_i18n.dart';
import 'state/display.dart';
import 'state/prefs.dart';
import 'ui/converter_screen.dart';
import 'ui/pages_screens.dart';
import 'ui/settings_screen.dart';
import 'ui/tokens.dart';
import 'ui/widgets.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Prefs.init();
  await DisplayMode.init();
  SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
    statusBarColor: kBg,
    statusBarIconBrightness: Brightness.dark,
    systemNavigationBarColor: kInk,
    systemNavigationBarIconBrightness: Brightness.light,
  ));
  runApp(const KalkalApp());
}

class KalkalApp extends StatefulWidget {
  const KalkalApp({super.key});

  @override
  State<KalkalApp> createState() => _KalkalAppState();
}

class _KalkalAppState extends State<KalkalApp> {
  late String _lang;
  int _tab = 0;
  String? _calendarsAnchor;

  @override
  void initState() {
    super.initState();
    _lang = Prefs.instance.lang;
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'kalkal — ${I18n.t(_lang, 'appTitle')}',
      debugShowCheckedModeBanner: false,
      builder: (context, child) => ValueListenableBuilder<bool>(
        valueListenable: DisplayMode.eink,
        builder: (context, eink, _) =>
            eink ? EinkFrame(child: child!) : child!,
      ),
      theme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: kBg,
        fontFamily: kMono,
        colorScheme: const ColorScheme.light(
          primary: kInk,
          onPrimary: kWhite,
          surface: kSurface,
          onSurface: kInk,
        ),
        splashFactory: InkRipple.splashFactory,
      ),
      home: Builder(builder: (context) {
        final wide = isWide(context);
        // Tab order: 0 converter, 1 calendars, 2 methodology, 3 settings,
        // 4 author. The phone bar shows the first two plus "More" (2..4).
        final navItems = [
          NavItem(Icons.swap_horiz, I18n.t(_lang, 'navConverter')),
          NavItem(Icons.calendar_month_outlined, I18n.t(_lang, 'navCalendars')),
          NavItem(Icons.menu_book_outlined, I18n.t(_lang, 'navMethodology')),
          NavItem(Icons.tune, I18n.t(_lang, 'settings')),
          NavItem(Icons.person_outline, I18n.t(_lang, 'navAuthor')),
        ];
        void onNav(int i) => setState(() {
              if (i != 1) _calendarsAnchor = null;
              _tab = i;
            });
        final pages = IndexedStack(
          index: _tab,
          children: [
            ConverterScreen(
              key: ValueKey('converter-$_lang'),
              lang: _lang,
              onOpenCalendarPage: (calId) => setState(() {
                _calendarsAnchor = calId;
                _tab = 1;
              }),
            ),
            CalendarsScreen(
              key: ValueKey('calendars-$_lang-$_calendarsAnchor'),
              lang: _lang,
              anchorCalId: _calendarsAnchor,
            ),
            MethodologyScreen(lang: _lang),
            SettingsScreen(
              lang: _lang,
              onLangChanged: (code) => setState(() => _lang = code),
            ),
            AboutScreen(lang: _lang),
          ],
        );
        if (wide) {
          return Scaffold(
            body: Column(
              children: [
                WideHeader(
                  title: I18n.t(_lang, 'appTitle'),
                  items: navItems,
                  activeIndex: _tab,
                  onTap: onNav,
                ),
                Expanded(
                  child: Align(
                    alignment: Alignment.topCenter,
                    child: ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 1100),
                      child: pages,
                    ),
                  ),
                ),
              ],
            ),
          );
        }
        final moreItems = navItems.sublist(2);
        return Scaffold(
          body: SafeArea(bottom: false, child: pages),
          bottomNavigationBar: BrutBottomNav(
            items: [
              navItems[0],
              navItems[1],
              NavItem(Icons.more_horiz, MobileI18n.t(_lang, 'more')),
            ],
            activeIndex: _tab < 2 ? _tab : 2,
            onTap: (i) async {
              if (i < 2) return onNav(i);
              final picked = await showMoreSheet(context,
                  items: moreItems, activeIndex: _tab - 2);
              if (picked != null) onNav(picked + 2);
            },
          ),
        );
      }),
    );
  }
}

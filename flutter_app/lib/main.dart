// kalkal — Flutter port of the mobile web app (kalkal.online).
// Shell: fixed black bottom nav (Converter / Calendars / Methodology /
// Settings / Author) over per-tab screens, mirroring `.page-nav` ≤600px.

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'i18n/i18n.dart';
import 'state/prefs.dart';
import 'ui/converter_screen.dart';
import 'ui/pages_screens.dart';
import 'ui/settings_screen.dart';
import 'ui/tokens.dart';
import 'ui/widgets.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Prefs.init();
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
        final navItems = [
          NavItem('⇄', I18n.t(_lang, 'navConverter')),
          NavItem('▦', I18n.t(_lang, 'navCalendars')),
          NavItem('◆', I18n.t(_lang, 'navMethodology')),
          NavItem('☰', I18n.t(_lang, 'settings')),
          NavItem('❖', I18n.t(_lang, 'navAuthor')),
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
        return Scaffold(
          body: SafeArea(bottom: false, child: pages),
          bottomNavigationBar: BrutBottomNav(
            items: navItems,
            activeIndex: _tab,
            onTap: onNav,
          ),
        );
      }),
    );
  }
}

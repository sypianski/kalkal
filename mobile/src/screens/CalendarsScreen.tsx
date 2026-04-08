import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useT } from '../i18n/LanguageContext';
import { BrutalistCard } from '../components/BrutalistCard';

const CALENDARS_DATA = [
  {
    id: 'gregorian', name: 'AD Calendar (Julian\u2192Gregorian)', type: 'Solar',
    intro: 'The AD (Anno Domini) dating system, using the Julian calendar before 15 October 1582 and the Gregorian calendar after.',
    body: 'Before 1582, dates follow the Julian calendar. From 15 October 1582 onward, the Gregorian reform applies. The reform corrected approximately 10 days of accumulated drift since the Council of Nicaea (325 CE).',
    months: 'January (31), February (28/29), March (31), April (30), May (31), June (30), July (31), August (31), September (30), October (31), November (30), December (31).'
  },
  {
    id: 'julian', name: 'Julian Calendar', type: 'Solar',
    intro: 'Introduced by Julius Caesar in 46 BCE. Predominant calendar in Europe for over 1,600 years.',
    body: 'Every year divisible by 4 is a leap year, giving a mean year of 365.25 days. About 11 minutes longer than the tropical year.',
    months: 'Same as Gregorian, differing only in the leap year rule (every 4th year, no exceptions).'
  },
  {
    id: 'hijri', name: 'Hijri Calendar (Lunar Islamic)', type: 'Lunar',
    intro: 'Purely lunar calendar of 12 months. Epoch: 1 Muharram 1 AH = 16 July 622 CE (Julian).',
    body: 'Alternates months of 30 and 29 days, with leap day in Dhu al-Hijja. Year is ~354 days, cycling through seasons over ~33 years. Four tabular variants exist.',
    months: 'Mu\u1e25arram (30), \u1e62afar (29), Rab\u012b\u02bf al-Awwal (30), Rab\u012b\u02bf a\u1e6f-\u1e6e\u0101n\u012b (29), \u01e6um\u0101d\u0101 al-\u016al\u0101 (30), \u01e6um\u0101d\u0101 al-\u0100\u1e2bira (29), Ra\u01e7ab (30), \u0160a\u02bfb\u0101n (29), Rama\u1e0d\u0101n (30), \u0160aww\u0101l (29), \u1e0e\u016b al-Qa\u02bfda (30), \u1e0e\u016b al-\u1e24i\u01e7\u01e7a (29/30).'
  },
  {
    id: 'solarHijri', name: 'Solar Hijri (Iranian)', type: 'Solar',
    intro: 'Official calendar of Iran and Afghanistan. Solar calendar whose epoch coincides with the Hijra.',
    body: 'First six months: 31 days, next five: 30 days, Esfand: 29/30 days. Uses 2820-year arithmetic cycle.',
    months: 'Farvardin (31), Ordibehe\u0161t (31), \u1e2aord\u0101d (31), Tir (31), Mord\u0101d (31), \u0160ahrivar (31), Mehr (30), \u0100b\u0101n (30), \u0100\u1e0far (30), Dey (30), Bahman (30), Esfand (29/30).'
  },
  {
    id: 'ilkhani', name: 'Ilkhanid Calendar (Kh\u0101n\u012b)', type: 'Solar',
    intro: 'Established by Ghazan Khan as fiscal calendar of the Mongol Ilkhanate in Persia.',
    body: 'Structurally identical to Solar Hijri with different epoch (1302 CE). 12-year Turkic-Mongol animal cycle overlaid.',
    months: 'Same as Solar Hijri.'
  },
  {
    id: 'coptic', name: 'Coptic Calendar', type: 'Solar',
    intro: 'Descends from ancient Egyptian civil calendar. Era of the Martyrs (284 CE).',
    body: '12 months of 30 days + 13th month (Epagomenai) of 5-6 days. Leap years every 4 years.',
    months: 'Thout, Paopi, Hathor, Koiak, Tobi, Meshir, Paremhat, Parmouti, Pashons, Paoni, Epip, Mesori (30 days), Epagomenai (5/6).'
  },
  {
    id: 'ethiopian', name: 'Ethiopian Calendar', type: 'Solar',
    intro: 'Shares Coptic structure but counts from 8 CE (birth of Christ per Ethiopian tradition).',
    body: 'Same structure as Coptic: 12\u00d730 + 5/6 epagomenal days. ~7-8 years behind the Gregorian calendar.',
    months: 'M\u00e4sk\u00e4r\u00e4m, T\u0259qimt, Hidar, Tahsas, T\u0259r, Y\u00e4katit, M\u00e4gabit, Miyazya, Ginbot, S\u00e4n\u00e9, Haml\u00e9, N\u00e4has\u00e9 (30 days), Pagum\u00e9n (5/6).'
  },
  {
    id: 'yazdgerdi', name: 'Zoroastrian Calendar', type: 'Solar (wandering)',
    intro: 'The Zoroastrian religious calendar. Three variants: Shahenshahi, Qadimi, Fasli.',
    body: 'Shahenshahi/Qadimi: 12\u00d730 + 5 epagomenal days = 365 days (wandering). Fasli: solar reform with leap years.',
    months: '12\u00d730 days + Gatha days (5), using Persian month names (Farvardin through Esfand).'
  },
  {
    id: 'armenian', name: 'Armenian Calendar', type: 'Solar (wandering)',
    intro: 'Traditional Armenian calendar. Epoch: 11 July 552 CE.',
    body: '12\u00d730 + 5 epagomenal days = fixed 365 days. A wandering calendar like the Egyptian.',
    months: 'Navasard, Hori, Sahmi, Tr\u0113, K\u2019alo\u0107, Arats, Mehekan, Areg, Ahekan, Mareri, Margats, Hroti\u0107 (30 days), Aweleats\u2019 (5).'
  },
  {
    id: 'egyptian', name: 'Egyptian Calendar', type: 'Solar (wandering)',
    intro: 'One of the oldest known calendars. Era of Nabonassar (747 BCE).',
    body: '12\u00d730 + 5 epagomenal = 365 days, no leap year. Prototype for all later 365-day calendars.',
    months: 'Thoth, Phaophi, Athyr, Choiak, Tybi, Mechir, Phamenoth, Pharmuthi, Pachons, Payni, Epiphi, Mesore (30), Epagomenai (5).'
  },
  {
    id: 'byzantine', name: 'Byzantine Calendar', type: 'Solar',
    intro: 'Anno Mundi calendars counting from creation. Three variants: Constantinople, Alexandrian, Chronicon Paschale.',
    body: 'Julian calendar mechanics with era offset. Constantinople (5509 BCE, Sep start) was official in the Byzantine Empire. Indiction (15-year cycle) displayed alongside dates.',
    months: 'Constantinople: from September. Alexandrian/Chron. Paschale: from March.'
  },
  {
    id: 'seleucid', name: 'Seleucid Calendar', type: 'Solar',
    intro: 'Era of the Greeks counting from 312 BCE. Most widely used era in the eastern Mediterranean for over a millennium.',
    body: 'Two variants: Macedonian (October start) and Babylonian (April start). Julian calendar mechanics with era offset.',
    months: 'Macedonian: from October. Babylonian: from April.'
  },
  {
    id: 'syriac', name: 'Syriac Calendar', type: 'Solar',
    intro: 'Uses Seleucid era with Syriac month names and January\u2013December year.',
    body: 'Julian calendar with 311-year era offset. Month names from Babylonian calendar via Aramaic.',
    months: 'K\u0101n\u016bn II, \u0160b\u0101\u1e6d, \u0100\u1e0f\u0101r, N\u012bs\u0101n, Ayy\u0101r, \u1e24z\u012br\u0101n, Tamm\u016bz, \u0100b, Ayl\u016bl, Ti\u0161r\u012bn I, Ti\u0161r\u012bn II, K\u0101n\u016bn I.'
  },
  {
    id: 'rumi', name: 'R\u016bm\u012b Calendar', type: 'Solar',
    intro: 'Fiscal and civil calendar of the Ottoman Empire. Julian calendar with Hijra-era offset.',
    body: 'Post-1840 reform: Jan\u2013Dec, year = Julian year \u2212 584. Abolished by Turkey in 1926.',
    months: 'January\u2013December with Julian lengths.'
  },
  {
    id: 'macedonian', name: 'Macedonian Calendar', type: 'Solar',
    intro: 'Syro-Macedonian calendar with Macedonian month names, Seleucid era, October year start.',
    body: 'Each month maps to a Julian month in its fixed Roman-era form.',
    months: 'Dios, Apellaios, Audynaios, Peritios, Dystros, Xanthikos, Artemisios, Daisios, Panemos, Loos, Gorpiaios, Hyperberetaios.'
  },
  {
    id: 'auc', name: 'Ab Urbe Condita', type: 'Solar',
    intro: 'Counts from the founding of Rome in 753 BCE (Varronian reckoning).',
    body: 'Julian calendar with era offset. Used in Roman historiography.',
    months: 'January\u2013December.'
  },
  {
    id: 'roman', name: 'Roman Calendar', type: 'Solar',
    intro: 'Julian calendar with traditional Roman date notation: Kalends, Nones, and Ides.',
    body: 'Uses AUC year numbering with Latin month names. Days count backward from Kalendae, Nonae, and Idus.',
    months: 'Ianuarius, Februarius, Martius, Aprilis, Maius, Iunius, Iulius, Augustus, September, October, November, December.'
  },
  {
    id: 'spanish', name: 'Spanish Era', type: 'Solar',
    intro: 'Era Hispanica counts from 38 BCE. Standard in Iberian Peninsula for over 1,000 years.',
    body: 'Julian calendar with 38-year offset. Aragon abandoned it in 1350, Castile in 1383.',
    months: 'January\u2013December.'
  },
  {
    id: 'antiochene', name: 'Antiochene Era', type: 'Solar',
    intro: 'Caesarean Era of Antioch from 49 BCE (Battle of Pharsalus).',
    body: 'Julian calendar with October year start and 49-year era offset.',
    months: 'October\u2013September.'
  },
  {
    id: 'olympiad', name: 'Olympiad Calendar', type: 'Solar',
    intro: '4-year cycles from first Olympic Games in 776 BCE, the framework of Greek historians.',
    body: 'Linear year count from 776 BCE. Display: "Olympiad N, year K".',
    months: 'January\u2013December.'
  },
  {
    id: 'hebrew', name: 'Hebrew Calendar', type: 'Lunisolar',
    intro: 'Lunisolar calendar for religious observances. Epoch: 3761 BCE.',
    body: '19-year Metonic cycle with 7 leap years adding Adar II. Year lengths vary 353\u2013385 days due to postponement rules.',
    months: 'Tishrei (30), Cheshvan (29/30), Kislev (29/30), Tevet (29), Shevat (30), Adar/Adar I (29/30), [Adar II (29)], Nisan (30), Iyar (29), Sivan (30), Tammuz (29), Av (30), Elul (29).'
  },
  {
    id: 'babylonian', name: 'Babylonian Calendar', type: 'Lunisolar',
    intro: 'Ancient Mesopotamian lunisolar calendar. Era of Nabonassar (747 BCE).',
    body: '19-year Metonic cycle for intercalation. Historical months began at observed first lunar crescent.',
    months: 'Nisannu, Ayaru, Simanu, Du\u02bbuzu, Abu, Ul\u016blu, Tashr\u012btu, Ara\u1e2bsamna, Kislimu, T\u0323ebetu, Shaba\u1e6du, Addaru, [Addaru II].'
  },
  {
    id: 'bp', name: 'Before Present', type: 'Solar',
    intro: 'Time scale for archaeology. "Present" = 1950 CE (radiocarbon convention).',
    body: 'Counts backward: BP 0 = 1950 CE, BP 1 = 1949 CE. Gregorian mechanics.',
    months: 'Gregorian months.'
  },
  {
    id: 'human', name: 'Human Era', type: 'Solar',
    intro: 'Holocene Era (HE) adds 10,000 years to the Gregorian calendar.',
    body: 'Proposed by Cesare Emiliani (1993). Year 12,024 HE = 2024 CE. No negative years for recorded history.',
    months: 'Gregorian months.'
  },
];

function CalendarCard({ cal, theme, T }: { cal: typeof CALENDARS_DATA[0]; theme: any; T: any }) {
  const [expanded, setExpanded] = useState(false);
  const isBrut = theme.name === 'brutalist';
  const typeColor = isBrut
    ? theme.colors.accent
    : cal.type.includes('Lunar') ? '#2f6b60' : cal.type.includes('wandering') ? '#a15c2c' : theme.colors.accent;

  return (
    <BrutalistCard>
      <View style={cardStyles.header}>
        <Text style={[cardStyles.name, { color: theme.colors.text }, isBrut && { borderBottomWidth: 2, borderBottomColor: theme.colors.accent, paddingBottom: 2 }]}>
          {cal.name}
        </Text>
        <Text style={[
          cardStyles.type,
          { borderColor: typeColor },
          isBrut
            ? { backgroundColor: '#000', color: theme.colors.accent, borderWidth: 0, paddingHorizontal: 8, paddingVertical: 4 }
            : { color: typeColor, borderWidth: 1 }
        ]}>
          {cal.type}
        </Text>
      </View>
      <Text style={[cardStyles.intro, { color: theme.colors.textSecondary }, isBrut && { fontStyle: 'normal', fontWeight: '700' }]}>{cal.intro}</Text>
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Text style={[
          cardStyles.toggle,
          isBrut
            ? { color: theme.colors.text, backgroundColor: theme.colors.accent, paddingHorizontal: 8, paddingVertical: 4, alignSelf: 'flex-start', fontWeight: '900' }
            : { color: theme.colors.accent }
        ]}>
          {(expanded ? T.showLess : T.showMore).toUpperCase()}
        </Text>
      </TouchableOpacity>
      {expanded && (
        <>
          <Text style={[cardStyles.body, { color: theme.colors.text }]}>{cal.body}</Text>
          <Text style={[cardStyles.monthLabel, { color: isBrut ? theme.colors.text : theme.colors.textMuted }, isBrut && { backgroundColor: '#000', color: theme.colors.accent, paddingHorizontal: 8, paddingVertical: 4, alignSelf: 'flex-start' }]}>{T.monthsLabel}</Text>
          <Text style={[cardStyles.months, { color: theme.colors.textSecondary }]}>{cal.months}</Text>
        </>
      )}
    </BrutalistCard>
  );
}

export function CalendarsScreen() {
  const { theme } = useTheme();
  const T = useT();
  const isBrut = theme.name === 'brutalist';

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text, letterSpacing: isBrut ? 3 : 0 }]}>{T.calendarsScreenTitle}</Text>
      <Text style={[styles.subtitle, { color: isBrut ? theme.colors.accent : theme.colors.textSecondary, letterSpacing: isBrut ? 2 : 0 }]}>
        {CALENDARS_DATA.length} {T.calendarsScreenSubtitle}
      </Text>
      {CALENDARS_DATA.map(cal => (
        <CalendarCard key={cal.id} cal={cal} theme={theme} T={T} />
      ))}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  title: { fontSize: 22, fontWeight: '900', textAlign: 'center', marginTop: 16, textTransform: 'uppercase', letterSpacing: 2 },
  subtitle: { fontSize: 11, textAlign: 'center', marginBottom: 16, textTransform: 'uppercase', fontWeight: '700', letterSpacing: 1.5 },
});

const cardStyles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 8 },
  name: { fontSize: 16, fontWeight: '900', flex: 1, textTransform: 'uppercase', letterSpacing: 0.5 },
  type: { fontSize: 10, fontWeight: '900', paddingHorizontal: 6, paddingVertical: 2, textTransform: 'uppercase', letterSpacing: 1 },
  intro: { fontSize: 14, fontStyle: 'italic', lineHeight: 20 },
  toggle: { fontSize: 12, fontWeight: '700', marginTop: 8, textTransform: 'uppercase', letterSpacing: 1 },
  body: { fontSize: 14, lineHeight: 20, marginTop: 8 },
  monthLabel: { fontSize: 11, fontWeight: '900', textTransform: 'uppercase', marginTop: 12, letterSpacing: 2 },
  months: { fontSize: 13, lineHeight: 19, marginTop: 4 },
});

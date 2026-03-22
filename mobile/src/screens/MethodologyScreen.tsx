import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const SECTIONS = [
  {
    title: 'Julian Day Number',
    body: 'All conversions flow through the Julian Day Number (JDN) as a universal intermediary: SourceCalendar \u2192 JDN \u2192 TargetCalendar. The JDN is a continuous count of days since the beginning of the Julian Period on 1 January 4713 BCE (Julian proleptic calendar). It is used universally in astronomy and calendrical computation because it is independent of any particular calendar system.'
  },
  {
    title: 'Architecture',
    body: 'kalkal is a zero-dependency, client-side application. All calendar algorithms are implemented as pure arithmetic functions in JavaScript. No external APIs, databases, or servers are involved in the computation. The only exception is the optional AI assistant (Gemini Flash), which is entirely optional and requires a user-provided API key.\n\nThe computational engine (Cal object) contains 65+ functions covering 20+ calendar systems. Each calendar provides toJD() and fromJD() functions, plus helpers for month length, year length, and leap year determination.'
  },
  {
    title: 'Algorithm Sources',
    body: 'Primary sources:\n\n\u2022 Meeus, Jean. Astronomical Algorithms, 2nd ed. (1998) \u2014 Julian/Gregorian, Julian Day Number\n\u2022 Reingold & Dershowitz. Calendrical Calculations: The Ultimate Edition (2018) \u2014 Coptic, Ethiopian, Hebrew, general framework\n\u2022 Birashk, Ahmad. A Comparative Calendar (1993) \u2014 Solar Hijri arithmetic cycle\n\u2022 de Blois, Fran\u00e7ois. "Ta\u02bfr\u012bkh" in Encyclopaedia of Islam, 2nd ed. \u2014 Hijri variants\n\u2022 Richards, E. G. Mapping Time (1998) \u2014 Hijri variant classification\n\u2022 Bickerman, E. Chronology of the Ancient World (1980) \u2014 Seleucid, Roman, Greek eras\n\u2022 Grumel, V. La Chronologie (1958) \u2014 Byzantine era offsets\n\u2022 Parker & Dubberstein. Babylonian Chronology 626 BC\u2013AD 75 (1956) \u2014 Babylonian dates'
  },
  {
    title: 'Validation & Verification',
    body: 'Three verification methods are used:\n\n1. Round-trip testing: For every calendar, fromJD(toJD(y, m, d)) must return the original date. This is tested exhaustively across thousands of dates.\n\n2. Cross-verification: Results are compared against:\n   \u2022 Fourmilab Calendar Converter (Julian, Gregorian, Hebrew, Islamic)\n   \u2022 Browser Intl.DateTimeFormat API (islamic-civil variant)\n   \u2022 Python hijri-converter library\n\n3. Spot-checking against scholarly sources: Key dates from historical literature are verified manually.'
  },
  {
    title: 'Key Concepts',
    body: 'Hijri variants: The four tabular variants differ only in which years of the 30-year cycle are leap. IIc (W\u00fcstenfeld) is the default for historiographic use. IIa matches Intl.DateTimeFormat\u2019s islamic-civil.\n\nJulian/Gregorian cutover: Dates before Oct 15, 1582 use the Julian calendar. JDN 2299160.5 is the cutover point.\n\nEpoch: All Hijri variants share epoch JDN 1948439.5 (16 Jul 622 CE Julian = 1 Muharram 1 AH).\n\n13-month calendars: Coptic, Ethiopian, Yazdgerdi, Armenian, and Egyptian have 13 months (12\u00d730 + 5/6 epagomenal days).'
  },
  {
    title: 'References',
    body: '\u2022 Meeus, J. Astronomical Algorithms, 2nd ed. Richmond: Willmann-Bell, 1998.\n\u2022 Reingold, E. M. & Dershowitz, N. Calendrical Calculations: The Ultimate Edition. Cambridge UP, 2018.\n\u2022 Richards, E. G. Mapping Time: The Calendar and its History. Oxford UP, 1998.\n\u2022 Birashk, A. A Comparative Calendar. Tehran: Mazda, 1993.\n\u2022 Bickerman, E. Chronology of the Ancient World. London: Thames & Hudson, 1980.\n\u2022 Grumel, V. La Chronologie. Paris: PUF, 1958.\n\u2022 Parker, R. A. & Dubberstein, W. H. Babylonian Chronology 626 B.C.\u2013A.D. 75. Providence: Brown UP, 1956.\n\u2022 de Blois, F. "Ta\u02bfr\u012bkh" in Encyclopaedia of Islam, 2nd ed.'
  }
];

export function MethodologyScreen() {
  const { theme } = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Methodology</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        How kalkal calculates and how it is verified
      </Text>
      {SECTIONS.map((section, i) => (
        <View key={i} style={[styles.section, { borderColor: theme.colors.border, borderRadius: theme.borderRadius, backgroundColor: theme.colors.cardBg }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.accent }]}>{section.title}</Text>
          <Text style={[styles.sectionBody, { color: theme.colors.text }]}>{section.body}</Text>
        </View>
      ))}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginTop: 16 },
  subtitle: { fontSize: 14, textAlign: 'center', marginBottom: 16 },
  section: { borderWidth: 1, padding: 16, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  sectionBody: { fontSize: 14, lineHeight: 21 },
});

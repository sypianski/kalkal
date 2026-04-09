import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../theme/ThemeContext';
import { useT } from '../i18n/LanguageContext';
import { CalendarPicker } from '../components/CalendarPicker';
import { NumPad } from '../components/NumPad';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Start'>;

// Per TEMPLATE.md: TO is hidden unless FROM is one of these linear/era calendars.
const NEEDS_EXPLICIT_TO = new Set(['human', 'bp', 'gregorian']);
const CALENDAR_STORAGE_KEY = 'kalkal-last-calendar';

export function StartScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const T = useT();
  const isBrut = theme.name === 'brutalist';

  const [fromCal, setFromCal] = useState('hijri');
  const [toCal, setToCal] = useState('gregorian');
  const [year, setYear] = useState('');

  // Load last-used calendar from AsyncStorage on mount
  useEffect(() => {
    AsyncStorage.getItem(CALENDAR_STORAGE_KEY).then(saved => {
      if (saved) setFromCal(saved);
    });
  }, []);

  // Save calendar selection whenever it changes
  useEffect(() => {
    AsyncStorage.setItem(CALENDAR_STORAGE_KEY, fromCal);
  }, [fromCal]);

  const showTo = useMemo(() => NEEDS_EXPLICIT_TO.has(fromCal), [fromCal]);
  const canGo = year.length > 0 && (!showTo || toCal !== fromCal);

  const handleConvert = () => {
    if (!canGo) return;
    navigation.navigate('Converter', {
      calendarId: fromCal,
      year: parseInt(year, 10),
      toCalendarId: showTo ? toCal : undefined,
    });
  };

  const handleFromChange = (id: string) => {
    setFromCal(id);
    // If the newly-picked FROM would clash with default TO, nudge TO away.
    if (id === 'gregorian' && toCal === 'gregorian') setToCal('hijri');
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.scrollBody}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Masthead ───────────────────────────────────────────── */}
        <View style={styles.masthead}>
          <Text style={[styles.eyebrow, { color: theme.colors.textMuted }]}>
            {'\u00a7'} CALENDAR · CONVERTER
          </Text>
          <Text style={[styles.appTitle, { color: theme.colors.text }]}>
            {T.appTitle}
          </Text>
          <View style={styles.rubricRow}>
            <View style={[styles.rubricBar, { backgroundColor: theme.colors.accent }]} />
            <View style={[styles.rubricBar, styles.rubricBarShort, { backgroundColor: theme.colors.border }]} />
          </View>
        </View>

        {/* ── FROM ───────────────────────────────────────────────── */}
        <SectionLabel n="I" label={T.fromCalendar} />
        <View
          style={[
            styles.pickerFrame,
            {
              borderColor: theme.colors.border,
              borderWidth: theme.borderWidth,
              borderRadius: theme.borderRadius,
              backgroundColor: theme.colors.surface,
            },
          ]}
        >
          <CalendarPicker
            value={fromCal}
            onSelect={handleFromChange}
            label={''}
          />
        </View>

        {/* ── TO (conditional) ───────────────────────────────────── */}
        {showTo && (
          <>
            <SectionLabel n="II" label={T.targetCalendar} />
            <View
              style={[
                styles.pickerFrame,
                {
                  borderColor: theme.colors.border,
                  borderWidth: theme.borderWidth,
                  borderRadius: theme.borderRadius,
                  backgroundColor: theme.colors.surface,
                },
              ]}
            >
              <CalendarPicker
                value={toCal}
                onSelect={setToCal}
                label={''}
              />
            </View>
          </>
        )}

        {/* ── YEAR display ───────────────────────────────────────── */}
        <SectionLabel n={showTo ? 'III' : 'II'} label={T.year} />
        <View
          style={[
            styles.yearFrame,
            {
              borderColor: year ? theme.colors.accent : theme.colors.border,
              borderWidth: isBrut ? 3 : theme.borderWidth,
              borderRadius: theme.borderRadius,
              backgroundColor: theme.colors.cardBg,
            },
          ]}
        >
          <Text
            style={[
              styles.yearValue,
              { color: year ? theme.colors.text : theme.colors.textMuted },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {year || T.startYearPlaceholder}
          </Text>
          {year ? (
            <View style={[styles.yearCaret, { backgroundColor: theme.colors.accent }]} />
          ) : null}
        </View>

        {/* ── NumPad ─────────────────────────────────────────────── */}
        <View style={styles.padArea}>
          <NumPad value={year} onChange={setYear} maxLength={6} />
        </View>

        {/* ── CONVERT button ─────────────────────────────────────── */}
        <TouchableOpacity
          style={[
            styles.convertBtn,
            {
              backgroundColor: canGo ? theme.colors.buttonBg : theme.colors.surface,
              borderColor: canGo ? theme.colors.buttonBg : theme.colors.border,
              borderWidth: isBrut ? 3 : theme.borderWidth,
              borderRadius: theme.borderRadius,
            },
          ]}
          onPress={handleConvert}
          disabled={!canGo}
          activeOpacity={0.75}
        >
          <Text
            style={[
              styles.convertText,
              {
                color: canGo
                  ? (isBrut ? theme.colors.accent : theme.colors.buttonText)
                  : theme.colors.textMuted,
              },
            ]}
          >
            {T.startGo}
          </Text>
          <Text
            style={[
              styles.convertGlyph,
              { color: canGo ? theme.colors.accent : theme.colors.textMuted },
            ]}
          >
            {'\u2192'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ── INFO — inconspicuous, fixed at the very bottom ───────── */}
      <TouchableOpacity
        style={styles.infoBtn}
        onPress={() => navigation.navigate('Info')}
        activeOpacity={0.6}
      >
        <View style={[styles.infoDot, { backgroundColor: theme.colors.textMuted }]} />
        <Text style={[styles.infoText, { color: theme.colors.textMuted }]}>
          {T.startInfo}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function SectionLabel({ n, label }: { n: string; label: string }) {
  const { theme } = useTheme();
  return (
    <View style={styles.sectionLabelRow}>
      <Text style={[styles.sectionNumeral, { color: theme.colors.accent }]}>{n}.</Text>
      <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>{label}</Text>
      <View style={[styles.sectionRule, { backgroundColor: theme.colors.border }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 32 : 52,
  },
  scrollBody: {
    paddingBottom: 18,
  },

  // Masthead
  masthead: {
    marginBottom: 18,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.2,
  },
  appTitle: {
    fontSize: 34,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 4,
  },
  rubricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  rubricBar: {
    height: 4,
    width: 56,
  },
  rubricBarShort: {
    width: 18,
    height: 2,
  },

  // Section labels: "I. FROM ─────"
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 6,
    gap: 8,
  },
  sectionNumeral: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  sectionRule: {
    flex: 1,
    height: 1,
    marginLeft: 4,
    opacity: 0.4,
  },

  // Calendar picker wrapper
  pickerFrame: {
    paddingHorizontal: 10,
    paddingVertical: 2,
  },

  // Year display
  yearFrame: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 78,
  },
  yearValue: {
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: 3,
  },
  yearCaret: {
    width: 20,
    height: 3,
    marginTop: 6,
  },

  // Numpad
  padArea: {
    marginTop: 14,
  },

  // Convert button
  convertBtn: {
    marginTop: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  convertText: {
    fontSize: 19,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2.2,
  },
  convertGlyph: {
    fontSize: 22,
    fontWeight: '900',
  },

  // Info (bottom, unobtrusive)
  infoBtn: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingBottom: 14,
    gap: 7,
    opacity: 0.65,
  },
  infoDot: {
    width: 4,
    height: 4,
    borderRadius: 0,
  },
  infoText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});

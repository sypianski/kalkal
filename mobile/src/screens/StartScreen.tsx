import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useT } from '../i18n/LanguageContext';
import { CalendarPicker } from '../components/CalendarPicker';
import { NumPad } from '../components/NumPad';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Start'>;

export function StartScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const T = useT();
  const isBrut = theme.name === 'brutalist';

  const [calendarId, setCalendarId] = useState('hijri');
  const [year, setYear] = useState('');

  const canGo = year.length > 0;

  const handleGo = () => {
    if (!canGo) return;
    navigation.navigate('Converter', { calendarId, year: parseInt(year, 10) });
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isBrut ? 'light-content' : 'dark-content'} />

      {/* Top area: title + picker + year display */}
      <View style={styles.top}>
        {/* App name */}
        <View style={styles.titleWrap}>
          <Text style={[styles.appTitle, { color: isBrut ? theme.colors.text : theme.colors.accent }]}>
            {T.appTitle}
          </Text>
          <View style={[styles.titleRule, { backgroundColor: theme.colors.accent }]} />
        </View>

        {/* Calendar picker */}
        <View style={[
          styles.pickerWrapper,
          {
            borderColor: theme.colors.border,
            borderWidth: theme.borderWidth,
            borderRadius: theme.borderRadius,
            backgroundColor: theme.colors.surface,
          },
        ]}>
          <CalendarPicker
            value={calendarId}
            onSelect={setCalendarId}
            label={T.startCalendarLabel}
          />
        </View>

        {/* Year display */}
        <View style={[
          styles.yearDisplay,
          {
            borderColor: canGo
              ? (isBrut ? theme.colors.accent : theme.colors.accent)
              : theme.colors.border,
            borderWidth: isBrut ? 3 : theme.borderWidth,
            borderRadius: theme.borderRadius,
            backgroundColor: theme.colors.surface,
          },
        ]}>
          <Text style={[
            styles.yearLabel,
            { color: theme.colors.textSecondary },
          ]}>
            {T.year}
          </Text>
          <Text style={[
            styles.yearValue,
            { color: year ? theme.colors.text : theme.colors.textMuted },
          ]}>
            {year || T.startYearPlaceholder}
          </Text>
        </View>
      </View>

      {/* NumPad */}
      <View style={styles.padArea}>
        <NumPad value={year} onChange={setYear} maxLength={6} />
      </View>

      {/* OK button */}
      <TouchableOpacity
        style={[
          styles.okBtn,
          {
            backgroundColor: canGo ? theme.colors.buttonBg : theme.colors.surface,
            borderColor: canGo ? theme.colors.buttonBg : theme.colors.border,
            borderWidth: isBrut ? 3 : theme.borderWidth,
            borderRadius: theme.borderRadius,
          },
        ]}
        onPress={handleGo}
        disabled={!canGo}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.okText,
          {
            color: canGo
              ? (isBrut ? theme.colors.accent : theme.colors.buttonText)
              : theme.colors.textMuted,
          },
        ]}>
          {T.startGo}
        </Text>
      </TouchableOpacity>

      {/* Info link */}
      <TouchableOpacity
        style={styles.infoBtn}
        onPress={() => navigation.navigate('Info')}
        activeOpacity={0.6}
      >
        <Text style={[styles.infoText, { color: theme.colors.textMuted }]}>
          {T.startInfo}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 36 : 56,
    paddingBottom: 24,
  },
  top: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  titleWrap: {
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  titleRule: {
    height: 3,
    width: 56,
    marginTop: 6,
  },
  pickerWrapper: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  yearDisplay: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  yearLabel: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  yearValue: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 2,
  },
  padArea: {
    marginBottom: 16,
  },
  okBtn: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  okText: {
    fontSize: 20,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  infoBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoText: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});

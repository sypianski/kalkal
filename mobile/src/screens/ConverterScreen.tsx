import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeContext';
import { Cal } from '../engine/cal';
import { useT } from '../i18n/LanguageContext';
import { CALENDARS, CalendarDef } from '../engine/calendars';
import { CalendarPicker } from '../components/CalendarPicker';
import { VariantBar } from '../components/VariantBar';
import { BrutalistCard } from '../components/BrutalistCard';
import type { RootStackParamList } from '../../App';

type ActiveField = 'year' | 'day';

type Props = NativeStackScreenProps<RootStackParamList, 'Converter'>;

export function ConverterScreen({ route, navigation }: Props) {
  const { theme } = useTheme();
  const T = useT();
  const isBrut = theme.name === 'brutalist';

  const initCal = route.params?.calendarId ?? 'gregorian';
  const initYear = route.params?.year != null ? String(route.params.year) : '2024';
  const initToCal = initCal === 'hijri' ? 'gregorian' : 'hijri';
  const initVariant = (() => {
    const cal = CALENDARS[initCal];
    return cal?.variants ? (cal.defaultVariant ?? cal.variants[0]) : '';
  })();

  const [fromCal, setFromCal] = useState<string>(initCal);
  const [toCal, setToCal] = useState<string>(initToCal);
  const [fromVariant, setFromVariant] = useState<string>(initVariant);
  const [toVariant, setToVariant] = useState<string>('');
  const [year, setYear] = useState(initYear);
  const [month, setMonth] = useState<number | null>(1);
  const [day, setDay] = useState('1');
  const [active, setActive] = useState<ActiveField>('year');
  const [numpadVisible, setNumpadVisible] = useState(false);

  const getSrc = useCallback((): CalendarDef | null => {
    const cal = CALENDARS[fromCal];
    if (cal?.variants && fromVariant) cal._variant = fromVariant;
    return cal || null;
  }, [fromCal, fromVariant]);

  const getTgt = useCallback((): CalendarDef | null => {
    const cal = CALENDARS[toCal];
    if (cal?.variants && toVariant) cal._variant = toVariant;
    return cal || null;
  }, [toCal, toVariant]);

  const srcCal = getSrc();
  const tgtCal = getTgt();
  const monthNames = useMemo(() => (srcCal ? srcCal.monthNames(T) : []), [srcCal, T]);
  const tgtMonthNames = useMemo(() => (tgtCal ? tgtCal.monthNames(T) : []), [tgtCal, T]);

  const onFromCalChange = (id: string) => {
    setFromCal(id);
    const cal = CALENDARS[id];
    if (cal?.variants) setFromVariant(cal.defaultVariant || cal.variants[0]);
    else setFromVariant('');
    // Clamp month if new calendar has fewer months
    if (month && cal && month > cal.monthCount) setMonth(1);
  };

  const onToCalChange = (id: string) => {
    if (id === fromCal) return;
    setToCal(id);
    const cal = CALENDARS[id];
    if (cal?.variants) setToVariant(cal.defaultVariant || cal.variants[0]);
    else setToVariant('');
  };

  // Live conversion
  const conversion = useMemo(() => {
    if (!srcCal || !tgtCal) return null;
    const y = parseInt(year, 10);
    if (!y || y < 1) return { error: T.errNoYear };
    const m = month;
    const d = parseInt(day, 10);

    if (m && (m < 1 || m > srcCal.monthCount)) {
      return { error: T.errInvalidMonth };
    }
    if (d && m) {
      const maxDay = srcCal.monthLength(y, m);
      if (d < 1 || d > maxDay) return { error: T.errInvalidDay };
    }

    try {
      if (d && m) {
        const jd = srcCal.toJD(y, m, d);
        const r = tgtCal.fromJD(jd);
        const dow = Cal.getDayOfWeek(jd);
        const sourceText = srcCal.id === 'roman'
          ? `${Cal.romanDayNotation(m, d, srcCal.isLeap(y))} ${y} AUC`
          : `${d} ${monthNames[m - 1]} ${y}`;
        const targetText = tgtCal.id === 'roman' && r.day
          ? `${Cal.romanDayNotation(r.month, r.day, tgtCal.isLeap(r.year))} ${r.year} AUC`
          : `${r.day} ${tgtMonthNames[r.month - 1]} ${r.year}`;
        return { sourceText, targetText, weekday: T.weekdays[dow], jd };
      }
      if (m) {
        const mLen = srcCal.monthLength(y, m);
        const jdStart = srcCal.toJD(y, m, 1);
        const jdEnd = srcCal.toJD(y, m, mLen);
        const rs = tgtCal.fromJD(jdStart);
        const re = tgtCal.fromJD(jdEnd);
        return {
          sourceText: `${monthNames[m - 1]} ${y}`,
          targetText: `${rs.day} ${tgtMonthNames[rs.month - 1]} ${rs.year} \u2013 ${re.day} ${tgtMonthNames[re.month - 1]} ${re.year}`,
          jd: jdStart,
        };
      }
      // year only
      const jdStart = srcCal.toJD(y, 1, 1);
      const lastMonth = srcCal.monthCount;
      const jdEnd = srcCal.toJD(y, lastMonth, srcCal.monthLength(y, lastMonth));
      const rs = tgtCal.fromJD(jdStart);
      const re = tgtCal.fromJD(jdEnd);
      return {
        sourceText: `${y}`,
        targetText: `${rs.day} ${tgtMonthNames[rs.month - 1]} ${rs.year} \u2013 ${re.day} ${tgtMonthNames[re.month - 1]} ${re.year}`,
        jd: jdStart,
      };
    } catch (e: any) {
      return { error: e?.message || 'Conversion error' };
    }
  }, [srcCal, tgtCal, year, month, day, monthNames, tgtMonthNames, T]);

  // Custom keypad handlers
  const pressDigit = (d: string) => {
    if (active === 'year') {
      setYear(prev => (prev.length >= 6 ? prev : prev + d));
    } else {
      setDay(prev => {
        const next = prev.length >= 2 ? prev : prev + d;
        return next;
      });
    }
  };

  const pressBackspace = () => {
    if (active === 'year') setYear(prev => prev.slice(0, -1));
    else setDay(prev => prev.slice(0, -1));
  };

  const pressClear = () => {
    if (active === 'year') setYear('');
    else setDay('');
  };

  const openInfo = () => {
    try { navigation.navigate('Info'); } catch {}
  };

  const handleYearTap = () => {
    setActive('year');
    setNumpadVisible(true);
  };

  const handleDayTap = () => {
    setActive('day');
    setNumpadVisible(true);
  };

  const fieldBoxStyle = (isActive: boolean) => ({
    borderColor: isActive ? theme.colors.accent : theme.colors.border,
    borderWidth: theme.borderWidth,
    backgroundColor: isActive ? (isBrut ? theme.colors.accent : theme.colors.surfaceAlt) : theme.colors.surface,
    borderRadius: theme.borderRadius,
  });

  const fieldTextColor = (isActive: boolean) =>
    isActive ? (isBrut ? '#000' : theme.colors.text) : theme.colors.text;

  const keypadKeys: (string | 'back' | 'clear')[] = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    'clear', '0', 'back',
  ];

  // Month list items (flat vertical list)
  const monthItems = useMemo(() => {
    if (!srcCal) return [] as { num: number; name: string }[];
    return monthNames.map((name, i) => ({ num: i + 1, name }));
  }, [srcCal, monthNames]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* ─── TOP: FROM + TO with live results ─── */}
        <BrutalistCard>
          <CalendarPicker value={fromCal} onSelect={onFromCalChange} label={T.fromCalendar} />
          {srcCal?.variants && (
            <View style={{ marginTop: 8 }}>
              <VariantBar
                variants={srcCal.variants}
                selected={fromVariant || srcCal.defaultVariant || srcCal.variants[0]}
                onSelect={(v) => { setFromVariant(v); srcCal._variant = v; }}
              />
            </View>
          )}
          <Text style={[styles.resultText, { color: theme.colors.text, marginTop: 10 }]} numberOfLines={2}>
            {conversion && !('error' in conversion) ? conversion.sourceText : '\u2014'}
          </Text>
        </BrutalistCard>

        <Text style={[styles.arrow, { color: isBrut ? theme.colors.accent : theme.colors.textMuted }]}>{'\u2193'}</Text>

        <BrutalistCard>
          <CalendarPicker value={toCal} onSelect={onToCalChange} label={T.targetCalendar} />
          {tgtCal?.variants && (
            <View style={{ marginTop: 8 }}>
              <VariantBar
                variants={tgtCal.variants}
                selected={toVariant || tgtCal.defaultVariant || tgtCal.variants[0]}
                onSelect={(v) => { setToVariant(v); tgtCal._variant = v; }}
              />
            </View>
          )}
          {conversion && 'error' in conversion ? (
            <Text style={[styles.errorText, { color: theme.colors.error, marginTop: 10 }]}>{conversion.error}</Text>
          ) : (
            <>
              <Text style={[styles.resultMain, { color: theme.colors.text, marginTop: 10, borderBottomWidth: isBrut ? 3 : 0, borderBottomColor: theme.colors.accent, paddingBottom: isBrut ? 4 : 0 }]} numberOfLines={2}>
                {conversion ? conversion.targetText : '\u2014'}
              </Text>
              {conversion && 'weekday' in conversion && conversion.weekday && (
                <Text style={[styles.weekday, { color: theme.colors.textSecondary }]}>{conversion.weekday}</Text>
              )}
            </>
          )}
        </BrutalistCard>

        {/* ─── YEAR FIELD ─── */}
        <TouchableOpacity
          style={[styles.fieldBox, fieldBoxStyle(active === 'year' && numpadVisible), { marginBottom: 10 }]}
          onPress={handleYearTap}
          activeOpacity={0.7}
        >
          <Text style={[styles.fieldLabel, { color: active === 'year' && numpadVisible && isBrut ? '#000' : theme.colors.textSecondary }]}>{T.year}</Text>
          <Text style={[styles.fieldValue, { color: fieldTextColor(active === 'year' && numpadVisible) }]}>
            {year || '\u2014'}
          </Text>
        </TouchableOpacity>

        {/* ─── MONTH PICKER (vertical list) ─── */}
        <BrutalistCard>
          <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>{T.month}</Text>
          {monthItems.map(({ num, name }) => {
            const isActive = month === num;
            return (
              <TouchableOpacity
                key={num}
                style={[
                  styles.monthItem,
                  { borderColor: theme.colors.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius },
                  isActive && { backgroundColor: theme.colors.accent },
                ]}
                onPress={() => setMonth(num)}
              >
                <Text
                  style={[
                    styles.monthItemName,
                    { color: isActive ? (isBrut ? '#000' : theme.colors.text) : theme.colors.text },
                  ]}
                  numberOfLines={1}
                >
                  {num}. {name}
                </Text>
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity
            style={[
              styles.wholeYearBtn,
              { borderColor: theme.colors.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius },
              month === null && { backgroundColor: theme.colors.accent },
            ]}
            onPress={() => setMonth(null)}
          >
            <Text style={[styles.monthItemName, { color: month === null ? (isBrut ? '#000' : theme.colors.text) : theme.colors.textSecondary }]}>
              {T.wholeYear || 'Whole year'}
            </Text>
          </TouchableOpacity>
        </BrutalistCard>

        {/* ─── DAY FIELD ─── */}
        <TouchableOpacity
          style={[styles.fieldBox, fieldBoxStyle(active === 'day' && numpadVisible), { marginTop: 10 }]}
          onPress={handleDayTap}
          activeOpacity={0.7}
        >
          <Text style={[styles.fieldLabel, { color: active === 'day' && numpadVisible && isBrut ? '#000' : theme.colors.textSecondary }]}>{T.day}</Text>
          <Text style={[styles.fieldValue, { color: fieldTextColor(active === 'day' && numpadVisible) }]}>
            {day || '\u2014'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ─── CUSTOM KEYPAD (shown on demand) ─── */}
      {numpadVisible && (
        <View style={[styles.keypadContainer, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border, borderTopWidth: theme.borderWidth }]}>
          <TouchableOpacity
            style={[styles.keypadDoneBtn, { borderColor: theme.colors.border, borderBottomWidth: theme.borderWidth }]}
            onPress={() => setNumpadVisible(false)}
          >
            <Text style={[styles.keypadDoneText, { color: theme.colors.textSecondary }]}>
              {T.doneLabel || 'Done'}
            </Text>
          </TouchableOpacity>
          <View style={styles.keypad}>
            {keypadKeys.map((k, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.keypadKey,
                  {
                    borderColor: theme.colors.border,
                    borderWidth: isBrut ? 2 : 1,
                    borderRadius: theme.borderRadius,
                    backgroundColor: theme.colors.cardBg,
                  },
                ]}
                onPress={() => {
                  if (k === 'back') pressBackspace();
                  else if (k === 'clear') pressClear();
                  else pressDigit(k);
                }}
                onLongPress={() => { if (k === 'back') pressClear(); }}
                activeOpacity={0.6}
              >
                <Text style={[styles.keypadKeyText, { color: theme.colors.text }]}>
                  {k === 'back' ? '\u232B' : k === 'clear' ? 'C' : k}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* ─── INFO BUTTON (muted, bottom) ─── */}
      <TouchableOpacity onPress={openInfo} style={styles.infoBtn} hitSlop={{ top: 8, bottom: 8, left: 20, right: 20 }}>
        <Text style={[styles.infoBtnText, { color: theme.colors.textMuted }]}>
          {T.navMethodology || 'Information'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },

  // Top result display
  resultText: { fontSize: 16, fontWeight: '700' },
  resultMain: { fontSize: 20, fontWeight: '900' },
  weekday: { fontSize: 13, marginTop: 4, fontWeight: '600' },
  errorText: { fontSize: 14, fontWeight: '700' },
  arrow: { fontSize: 18, textAlign: 'center', marginTop: -6, marginBottom: 2, fontWeight: '900' },

  // Month list
  sectionLabel: { fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 },
  monthItem: { paddingHorizontal: 12, paddingVertical: 11, marginBottom: 4 },
  monthItemName: { fontSize: 14, fontWeight: '700' },
  wholeYearBtn: { marginTop: 4, paddingVertical: 11, paddingHorizontal: 12 },

  // Year / Day fields (standalone rows)
  fieldBox: { paddingVertical: 12, paddingHorizontal: 12, alignItems: 'center' },
  fieldLabel: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 2 },
  fieldValue: { fontSize: 22, fontWeight: '900' },

  // Keypad
  keypadContainer: { },
  keypadDoneBtn: { alignItems: 'flex-end', paddingHorizontal: 16, paddingVertical: 6 },
  keypadDoneText: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  keypad: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8, paddingTop: 4, paddingBottom: 4 },
  keypadKey: {
    width: '31.33%',
    marginHorizontal: '1%',
    marginBottom: 6,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keypadKeyText: { fontSize: 22, fontWeight: '900' },

  // Info button
  infoBtn: { alignItems: 'center', paddingVertical: 6, paddingBottom: 10 },
  infoBtnText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.5, opacity: 0.55 },
});

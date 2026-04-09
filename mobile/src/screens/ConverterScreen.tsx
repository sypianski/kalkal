import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../theme/ThemeContext';
import { Cal } from '../engine/cal';
import { useT } from '../i18n/LanguageContext';
import { CALENDARS, CalendarDef } from '../engine/calendars';
import { CalendarPicker } from '../components/CalendarPicker';
import { VariantBar } from '../components/VariantBar';
import { Tile } from '../components/Tile';
import { Astronomy } from '../engine/astronomy';
import type { RootStackParamList } from '../../App';

const HISTORY_KEY = 'kalkal-history';
const HISTORY_MAX = 8;


type HistoryEntry = {
  sourceText: string;
  targetText: string;
  fromCal: string;
  toCal: string;
  ts: number;
};

type ActiveField = 'year' | 'day';

type Props = NativeStackScreenProps<RootStackParamList, 'Converter'>;

export function ConverterScreen({ route, navigation }: Props) {
  const { theme } = useTheme();
  const T = useT();
  const isBrut = theme.name === 'brutalist';

  const initFrom = route.params?.calendarId ?? 'hijri';
  const initYear = route.params?.year != null ? String(route.params.year) : '';
  const initTo =
    route.params?.toCalendarId ??
    (initFrom === 'gregorian' ? 'hijri' : 'gregorian');

  const initVariant = (() => {
    const cal = CALENDARS[initFrom];
    return cal?.variants ? (cal.defaultVariant ?? cal.variants[0]) : '';
  })();

  const [fromCal, setFromCal] = useState<string>(initFrom);
  const [toCal, setToCal] = useState<string>(initTo);
  const [fromVariant, setFromVariant] = useState<string>(initVariant);
  const [toVariant, setToVariant] = useState<string>('');
  const [year, setYear] = useState(initYear);
  const [month, setMonth] = useState<number | null>(1);
  const [day, setDay] = useState('1');
  const [active, setActive] = useState<ActiveField>('year');
  const [numpadVisible, setNumpadVisible] = useState(false);
  const [monthPickerVisible, setMonthPickerVisible] = useState(false);
  const [convertTick, setConvertTick] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const prevConversionRef = useRef<string>('');

  useEffect(() => {
    AsyncStorage.getItem(HISTORY_KEY).then(raw => {
      if (raw) {
        try { setHistory(JSON.parse(raw)); } catch {}
      }
    });
  }, []);

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
    if (month && cal && month > cal.monthCount) setMonth(1);
    if (id === toCal) setToCal(id === 'gregorian' ? 'hijri' : 'gregorian');
  };

  const onToCalChange = (id: string) => {
    if (id === fromCal) return;
    setToCal(id);
    const cal = CALENDARS[id];
    if (cal?.variants) setToVariant(cal.defaultVariant || cal.variants[0]);
    else setToVariant('');
  };

  // Live conversion — recomputed on each field change or CONVERT press.
  const conversion = useMemo(() => {
    void convertTick;
    if (!srcCal || !tgtCal) return null;
    const y = parseInt(year, 10);
    if (!y || y < 1) return { error: T.errNoYear };
    const m = month;
    const d = parseInt(day, 10);

    if (m && (m < 1 || m > srcCal.monthCount)) return { error: T.errInvalidMonth };
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
  }, [srcCal, tgtCal, year, month, day, monthNames, tgtMonthNames, T, convertTick]);

  // Save successful full-date conversions to history
  useEffect(() => {
    if (!conversion || 'error' in conversion) return;
    if (!('weekday' in conversion)) return; // only full date (not year-only or month-only)
    const key = `${conversion.sourceText}→${conversion.targetText}`;
    if (key === prevConversionRef.current) return;
    prevConversionRef.current = key;
    const entry: HistoryEntry = {
      sourceText: conversion.sourceText,
      targetText: conversion.targetText,
      fromCal,
      toCal,
      ts: Date.now(),
    };
    setHistory(prev => {
      const filtered = prev.filter(h => h.sourceText !== entry.sourceText || h.fromCal !== entry.fromCal);
      const next = [entry, ...filtered].slice(0, HISTORY_MAX);
      AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  }, [conversion, fromCal, toCal]);

  const clearHistory = () => {
    setHistory([]);
    AsyncStorage.removeItem(HISTORY_KEY);
  };

  // Keypad handlers
  const pressDigit = (d: string) => {
    if (active === 'year') setYear(prev => (prev.length >= 6 ? prev : prev + d));
    else setDay(prev => (prev.length >= 2 ? prev : prev + d));
  };
  const pressBackspace = () => {
    if (active === 'year') setYear(prev => prev.slice(0, -1));
    else setDay(prev => prev.slice(0, -1));
  };
  const pressClear = () => {
    if (active === 'year') setYear('');
    else setDay('');
  };

  const openNumpad = (which: ActiveField) => {
    setActive(which);
    setNumpadVisible(true);
  };

  const keypadKeys: (string | 'back' | 'clear')[] = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    'clear', '0', 'back',
  ];

  const monthItems = useMemo(() => {
    if (!srcCal) return [] as { num: number; name: string }[];
    return monthNames.map((name, i) => ({ num: i + 1, name }));
  }, [srcCal, monthNames]);

  const hasError = conversion && 'error' in conversion;
  const hasResult = conversion && !('error' in conversion);

  // Astro data for JD
  const astroData = useMemo(() => {
    if (!hasResult) return null;
    const jd = (conversion as any).jd as number;
    if (!jd) return null;
    const moon = Astronomy.moonPhase(jd);
    const comet = Astronomy.lookupComet(jd);
    const sn = Astronomy.lookupSupernova(jd);
    const conj = Astronomy.lookupConjunction(jd);
    return { moon, comet, sn, conj };
  }, [hasResult, conversion]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* ── Masthead (mini) ───────────────────────────────────── */}
      <View style={styles.masthead}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={[styles.backGlyph, { color: theme.colors.accent }]}>{'\u2190'}</Text>
        </TouchableOpacity>
        <Text style={[styles.mastheadTitle, { color: theme.colors.text }]} numberOfLines={1}>
          {T.appTitle}
        </Text>
        <View style={[styles.mastheadRule, { backgroundColor: theme.colors.accent }]} />
      </View>

      {/* ── FROM row ──────────────────────────────────────────── */}
      <Field label={T.fromCalendar} numeral="I" />
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
        <CalendarPicker value={fromCal} onSelect={onFromCalChange} label={''} />
        {srcCal?.variants && (
          <View style={{ marginTop: 6 }}>
            <VariantBar
              variants={srcCal.variants}
              selected={fromVariant || srcCal.defaultVariant || srcCal.variants[0]}
              onSelect={(v) => { setFromVariant(v); srcCal._variant = v; }}
            />
          </View>
        )}
      </View>

      {/* ── YEAR · MONTH · DAY row ────────────────────────────── */}
      <Field label={`${T.year} · ${T.month} · ${T.day}`} numeral="II" />
      <View style={styles.ymdRow}>
        {/* YEAR */}
        <TouchableOpacity
          style={[
            styles.ymdCell,
            styles.ymdYear,
            fieldBoxStyle(theme, active === 'year' && numpadVisible),
          ]}
          onPress={() => openNumpad('year')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.ymdLabel,
              {
                color:
                  active === 'year' && numpadVisible && isBrut
                    ? theme.colors.accentText
                    : theme.colors.textMuted,
              },
            ]}
          >
            {T.year}
          </Text>
          <Text
            style={[
              styles.ymdValue,
              {
                color:
                  active === 'year' && numpadVisible && isBrut
                    ? theme.colors.accentText
                    : theme.colors.text,
              },
            ]}
            numberOfLines={1}
          >
            {year || '\u2014'}
          </Text>
        </TouchableOpacity>

        {/* MONTH */}
        <TouchableOpacity
          style={[styles.ymdCell, styles.ymdMonth, fieldBoxStyle(theme, false)]}
          onPress={() => setMonthPickerVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={[styles.ymdLabel, { color: theme.colors.textMuted }]}>
            {T.month}
          </Text>
          <Text
            style={[styles.ymdValue, { color: theme.colors.text, fontSize: 15 }]}
            numberOfLines={1}
          >
            {month === null
              ? (T.wholeYear || '—')
              : (monthNames[(month ?? 1) - 1]
                ? monthNames[month - 1]
                : '\u2014')}
          </Text>
        </TouchableOpacity>

        {/* DAY */}
        <TouchableOpacity
          style={[
            styles.ymdCell,
            styles.ymdDay,
            fieldBoxStyle(theme, active === 'day' && numpadVisible),
          ]}
          onPress={() => openNumpad('day')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.ymdLabel,
              {
                color:
                  active === 'day' && numpadVisible && isBrut
                    ? theme.colors.accentText
                    : theme.colors.textMuted,
              },
            ]}
          >
            {T.day}
          </Text>
          <Text
            style={[
              styles.ymdValue,
              {
                color:
                  active === 'day' && numpadVisible && isBrut
                    ? theme.colors.accentText
                    : theme.colors.text,
              },
            ]}
            numberOfLines={1}
          >
            {day || '\u2014'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── TO row ────────────────────────────────────────────── */}
      <Field label={T.targetCalendar} numeral="III" />
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
        <CalendarPicker value={toCal} onSelect={onToCalChange} label={''} />
        {tgtCal?.variants && (
          <View style={{ marginTop: 6 }}>
            <VariantBar
              variants={tgtCal.variants}
              selected={toVariant || tgtCal.defaultVariant || tgtCal.variants[0]}
              onSelect={(v) => { setToVariant(v); tgtCal._variant = v; }}
            />
          </View>
        )}
      </View>

      {/* ── CONVERT button ────────────────────────────────────── */}
      <TouchableOpacity
        style={[
          styles.convertBtn,
          {
            backgroundColor: theme.colors.buttonBg,
            borderColor: theme.colors.buttonBg,
            borderWidth: isBrut ? 3 : theme.borderWidth,
            borderRadius: theme.borderRadius,
          },
        ]}
        onPress={() => setConvertTick(t => t + 1)}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.convertText,
            { color: isBrut ? theme.colors.accent : theme.colors.buttonText },
          ]}
        >
          {T.startGo}
        </Text>
        <Text style={[styles.convertGlyph, { color: theme.colors.accent }]}>{'\u2193'}</Text>
      </TouchableOpacity>

      {/* ── SCROLLABLE RESULT AREA ────────────────────────────── */}
      <ScrollView
        style={styles.resultScroll}
        contentContainerStyle={styles.resultScrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Main result card */}
        <View
          style={[
            styles.resultFrame,
            {
              borderColor: theme.colors.border,
              borderWidth: theme.borderWidth,
              borderRadius: theme.borderRadius,
              backgroundColor: theme.colors.cardBg,
            },
          ]}
        >
          <View style={styles.resultHeadRow}>
            <Text style={[styles.resultEyebrow, { color: theme.colors.textMuted }]}>
              {'\u00a7'} RESULT
            </Text>
            <View style={[styles.resultRule, { backgroundColor: theme.colors.accent }]} />
          </View>

          {hasError ? (
            <View style={styles.resultBody}>
              <Text
                style={[styles.resultErrorText, { color: theme.colors.error }]}
                numberOfLines={2}
                adjustsFontSizeToFit
              >
                {(conversion as any).error}
              </Text>
            </View>
          ) : hasResult ? (
            <View style={styles.resultBody}>
              <Text
                style={[styles.resultSource, { color: theme.colors.textSecondary }]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {(conversion as any).sourceText}
              </Text>
              <Text style={[styles.resultArrow, { color: theme.colors.accent }]}>
                {'\u2193'}
              </Text>
              <Text
                style={[
                  styles.resultMain,
                  {
                    color: theme.colors.text,
                    borderBottomColor: theme.colors.accent,
                    borderBottomWidth: isBrut ? 3 : 1,
                  },
                ]}
                numberOfLines={2}
                adjustsFontSizeToFit
                minimumFontScale={0.5}
              >
                {(conversion as any).targetText}
              </Text>
              {'weekday' in (conversion as any) && (conversion as any).weekday ? (
                <Text style={[styles.resultWeekday, { color: theme.colors.textSecondary }]}>
                  {(conversion as any).weekday}
                </Text>
              ) : null}
            </View>
          ) : (
            <View style={styles.resultBody}>
              <Text style={[styles.resultMain, { color: theme.colors.textMuted }]}>
                {'\u2014'}
              </Text>
            </View>
          )}
        </View>

        {/* ── ASTRO TILE ────────────────────────────────────── */}
        {astroData && (
          <Tile title={T.astroLabel || 'Astro'}>
            {/* Moon phase */}
            <View style={styles.astroRow}>
              <Text style={[styles.astroIcon, { color: theme.colors.text }]}>
                {astroData.moon.icon}
              </Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.astroLabel, { color: theme.colors.textMuted }]}>
                  {T.moonPhaseLabel || 'Moon phase'}
                </Text>
                <Text style={[styles.astroValue, { color: theme.colors.text }]}>
                  {T.moonPhases?.[astroData.moon.name] || astroData.moon.name}
                  {' · '}
                  {astroData.moon.illumination}% {T.moonIllumination || 'illuminated'}
                  {' · '}
                  {T.moonAge || 'day'} {astroData.moon.age}
                </Text>
              </View>
            </View>
            {/* Comet */}
            {astroData.comet && (
              <View style={styles.astroRow}>
                <Text style={[styles.astroIcon, { color: theme.colors.text }]}>{'☄'}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.astroLabel, { color: theme.colors.textMuted }]}>
                    {T.cometLabel || 'Comet'}
                  </Text>
                  <Text style={[styles.astroValue, { color: theme.colors.text }]}>
                    {T.cometNames?.[astroData.comet.id] || astroData.comet.id}
                    {astroData.comet.daysFromPerihelion !== 0
                      ? ` (${astroData.comet.daysFromPerihelion > 0 ? '+' : ''}${astroData.comet.daysFromPerihelion}d)`
                      : ''}
                  </Text>
                  {astroData.comet.noteKey && T.cometNotes?.[astroData.comet.noteKey] && (
                    <Text style={[styles.astroNote, { color: theme.colors.textMuted }]}>
                      {T.cometNotes[astroData.comet.noteKey]}
                    </Text>
                  )}
                </View>
              </View>
            )}
            {/* Supernova */}
            {astroData.sn && (
              <View style={styles.astroRow}>
                <Text style={[styles.astroIcon, { color: theme.colors.text }]}>{'✦'}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.astroLabel, { color: theme.colors.textMuted }]}>
                    {T.supernovaLabel || 'Supernova'}
                  </Text>
                  <Text style={[styles.astroValue, { color: theme.colors.text }]}>
                    {astroData.sn.id}
                    {astroData.sn.daysSinceFirst !== 0
                      ? ` (+${astroData.sn.daysSinceFirst}d)`
                      : ''}
                  </Text>
                  {astroData.sn.noteKey && T.supernovaNotes?.[astroData.sn.noteKey] && (
                    <Text style={[styles.astroNote, { color: theme.colors.textMuted }]}>
                      {T.supernovaNotes[astroData.sn.noteKey]}
                    </Text>
                  )}
                </View>
              </View>
            )}
            {/* Conjunction */}
            {astroData.conj && (
              <View style={styles.astroRow}>
                <Text style={[styles.astroIcon, { color: theme.colors.text }]}>{'♃'}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.astroLabel, { color: theme.colors.textMuted }]}>
                    {T.conjunctionLabel || 'Conjunction'}
                  </Text>
                  <Text style={[styles.astroValue, { color: theme.colors.text }]}>
                    {Astronomy.planetName(astroData.conj.planet1, T)}
                    {' & '}
                    {Astronomy.planetName(astroData.conj.planet2, T)}
                    {` ${astroData.conj.separation}'`}
                    {astroData.conj.daysFromClosest !== 0
                      ? ` (${astroData.conj.daysFromClosest > 0 ? '+' : ''}${astroData.conj.daysFromClosest}d)`
                      : ''}
                  </Text>
                  {astroData.conj.noteKey && T.conjunctionNotes?.[astroData.conj.noteKey] && (
                    <Text style={[styles.astroNote, { color: theme.colors.textMuted }]}>
                      {T.conjunctionNotes[astroData.conj.noteKey]}
                    </Text>
                  )}
                </View>
              </View>
            )}
          </Tile>
        )}

        {/* ── HISTORY TILE ──────────────────────────────────── */}
        {history.length > 0 && (
          <Tile title={T.history || 'History'}>
            {history.map((h, i) => (
              <View key={i} style={[styles.historyRow, i > 0 && { borderTopColor: theme.colors.border, borderTopWidth: 1 }]}>
                <Text style={[styles.historyFrom, { color: theme.colors.textMuted }]} numberOfLines={1}>
                  {h.sourceText}
                </Text>
                <Text style={[styles.historyTo, { color: theme.colors.text }]} numberOfLines={1}>
                  {h.targetText}
                </Text>
              </View>
            ))}
            <TouchableOpacity onPress={clearHistory} style={styles.clearHistoryBtn}>
              <Text style={[styles.clearHistoryText, { color: theme.colors.textMuted }]}>
                {T.clearHistory || 'Clear'}
              </Text>
            </TouchableOpacity>
          </Tile>
        )}

        {/* ── INFO (inconspicuous, bottom) ──────────────────── */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Info')}
          style={styles.infoBtn}
          hitSlop={{ top: 8, bottom: 8, left: 20, right: 20 }}
        >
          <View style={[styles.infoDot, { backgroundColor: theme.colors.textMuted }]} />
          <Text style={[styles.infoBtnText, { color: theme.colors.textMuted }]}>
            {T.startInfo || T.navMethodology || 'Info'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ── CUSTOM KEYPAD (shown on demand) ──────────────────── */}
      {numpadVisible && (
        <View
          style={[
            styles.keypadContainer,
            {
              backgroundColor: theme.colors.surface,
              borderTopColor: theme.colors.border,
              borderTopWidth: theme.borderWidth,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.keypadDoneBtn,
              { borderColor: theme.colors.border, borderBottomWidth: theme.borderWidth },
            ]}
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

      {/* ── MONTH PICKER MODAL ─────────────────────────────── */}
      <Modal
        visible={monthPickerVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setMonthPickerVisible(false)}
      >
        <View style={[styles.modal, { backgroundColor: theme.colors.background }]}>
          <View
            style={[
              styles.modalHeader,
              isBrut && { backgroundColor: '#000', paddingTop: 16, paddingBottom: 16 },
            ]}
          >
            <Text style={[styles.modalTitle, { color: isBrut ? '#fff' : theme.colors.text }]}>
              {T.month}
            </Text>
            <TouchableOpacity onPress={() => setMonthPickerVisible(false)}>
              <Text style={[styles.closeBtn, { color: theme.colors.accent }]}>
                {T.doneLabel}
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
            {monthItems.map(({ num, name }) => {
              const isActive = month === num;
              return (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.monthItem,
                    {
                      borderColor: theme.colors.border,
                      borderWidth: theme.borderWidth,
                      borderRadius: theme.borderRadius,
                    },
                    isActive && { backgroundColor: theme.colors.accent },
                  ]}
                  onPress={() => { setMonth(num); setMonthPickerVisible(false); }}
                >
                  <Text
                    style={[
                      styles.monthItemName,
                      {
                        color: isActive
                          ? (isBrut ? theme.colors.accentText : theme.colors.text)
                          : theme.colors.text,
                      },
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
                {
                  borderColor: theme.colors.border,
                  borderWidth: theme.borderWidth,
                  borderRadius: theme.borderRadius,
                },
                month === null && { backgroundColor: theme.colors.accent },
              ]}
              onPress={() => { setMonth(null); setMonthPickerVisible(false); }}
            >
              <Text
                style={[
                  styles.monthItemName,
                  {
                    color:
                      month === null
                        ? (isBrut ? theme.colors.accentText : theme.colors.text)
                        : theme.colors.textSecondary,
                  },
                ]}
              >
                {T.wholeYear || 'Whole year'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

function Field({ label, numeral }: { label: string; numeral: string }) {
  const { theme } = useTheme();
  return (
    <View style={styles.fieldLabelRow}>
      <Text style={[styles.fieldNumeral, { color: theme.colors.accent }]}>{numeral}.</Text>
      <Text style={[styles.fieldLabelText, { color: theme.colors.textSecondary }]} numberOfLines={1}>
        {label}
      </Text>
      <View style={[styles.fieldRule, { backgroundColor: theme.colors.border }]} />
    </View>
  );
}

const fieldBoxStyle = (theme: any, isActive: boolean) => ({
  borderColor: isActive ? theme.colors.accent : theme.colors.border,
  borderWidth: theme.borderWidth,
  backgroundColor: isActive
    ? (theme.name === 'brutalist' ? theme.colors.accent : theme.colors.surfaceAlt)
    : theme.colors.surface,
  borderRadius: theme.borderRadius,
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: Platform.OS === 'android' ? 26 : 44,
    paddingBottom: 6,
  },

  // Mini masthead
  masthead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  backGlyph: {
    fontSize: 22,
    fontWeight: '900',
    paddingRight: 2,
  },
  mastheadTitle: {
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  mastheadRule: {
    flex: 1,
    height: 3,
    marginLeft: 4,
  },

  // Field labels (II. YEAR · MONTH · DAY ─────)
  fieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
    gap: 6,
  },
  fieldNumeral: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  fieldLabelText: {
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1.6,
    flexShrink: 1,
  },
  fieldRule: {
    flex: 1,
    height: 1,
    opacity: 0.4,
  },

  // Picker wrappers
  pickerFrame: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },

  // YMD row
  ymdRow: {
    flexDirection: 'row',
    gap: 6,
  },
  ymdCell: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ymdYear: { flex: 1.6 },
  ymdMonth: { flex: 1.8 },
  ymdDay: { flex: 1 },
  ymdLabel: {
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1.3,
    marginBottom: 1,
  },
  ymdValue: {
    fontSize: 19,
    fontWeight: '900',
  },

  // Convert
  convertBtn: {
    marginTop: 10,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  convertText: {
    fontSize: 16,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  convertGlyph: {
    fontSize: 18,
    fontWeight: '900',
  },

  // Scrollable result area
  resultScroll: {
    flex: 1,
    marginTop: 10,
  },
  resultScrollContent: {
    paddingBottom: 16,
  },

  // Result card
  resultFrame: {
    minHeight: 110,
    padding: 14,
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  resultHeadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resultEyebrow: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },
  resultRule: {
    flex: 1,
    height: 3,
  },
  resultBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
  },
  resultSource: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  resultArrow: {
    fontSize: 18,
    fontWeight: '900',
    marginVertical: 4,
  },
  resultMain: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 0.4,
    textAlign: 'center',
    paddingBottom: 4,
    paddingHorizontal: 4,
  },
  resultWeekday: {
    fontSize: 11,
    marginTop: 6,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.6,
  },
  resultErrorText: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },

  // Info (bottom)
  infoBtn: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 8,
    paddingBottom: 10,
    opacity: 0.65,
  },
  infoDot: {
    width: 4,
    height: 4,
  },
  infoBtnText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  // Keypad
  keypadContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  keypadDoneBtn: {
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  keypadDoneText: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 8,
  },
  keypadKey: {
    width: '31.33%',
    marginHorizontal: '1%',
    marginBottom: 6,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keypadKeyText: {
    fontSize: 22,
    fontWeight: '900',
  },

  // Astro tile
  astroRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 6,
  },
  astroIcon: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
  },
  astroLabel: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  astroValue: {
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  astroNote: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 2,
    fontStyle: 'italic',
  },

  // History tile
  historyRow: {
    paddingVertical: 6,
  },
  historyFrom: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 1,
  },
  historyTo: {
    fontSize: 14,
    fontWeight: '700',
  },
  clearHistoryBtn: {
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  clearHistoryText: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },

  // Month picker modal
  modal: { flex: 1, paddingTop: 16 },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  closeBtn: { fontSize: 17, fontWeight: '700' },
  monthItem: {
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginBottom: 4,
  },
  monthItemName: {
    fontSize: 14,
    fontWeight: '700',
  },
  wholeYearBtn: {
    marginTop: 4,
    paddingVertical: 11,
    paddingHorizontal: 12,
  },
});

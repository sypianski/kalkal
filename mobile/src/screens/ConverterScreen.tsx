import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Cal } from '../engine/cal';
import { T } from '../engine/i18n';
import { CALENDARS, CalendarDef } from '../engine/calendars';
import { Astronomy } from '../engine/astronomy';
import { CalendarPicker } from '../components/CalendarPicker';
import { VariantBar } from '../components/VariantBar';
import { ThemeToggle } from '../components/ThemeToggle';
import { BrutalistCard } from '../components/BrutalistCard';
import { useHistory, HistoryEntry } from '../hooks/useHistory';

type ResultData = { type: 'date'; lines: ResultLine[] }
  | { type: 'range'; lines: ResultLine[]; table?: TableRow[] }
  | { type: 'error'; message: string }
  | null;

interface ResultLine { label?: string; text: string; style?: 'main' | 'secondary' | 'label' | 'meta' | 'note' }
interface TableRow { month: string; days: number; range: string }

export function ConverterScreen() {
  const { theme } = useTheme();
  const history = useHistory();

  const [fromCal, setFromCal] = useState<string>('gregorian');
  const [toCal, setToCal] = useState<string>('hijri');
  const [fromVariant, setFromVariant] = useState<string>('');
  const [toVariant, setToVariant] = useState<string>('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [result, setResult] = useState<ResultData>(null);

  const getSrc = useCallback((): CalendarDef | null => {
    const cal = fromCal ? CALENDARS[fromCal] : null;
    if (cal && cal.variants && fromVariant) cal._variant = fromVariant;
    return cal;
  }, [fromCal, fromVariant]);

  const getTgt = useCallback((): CalendarDef | null => {
    const cal = toCal ? CALENDARS[toCal] : null;
    if (cal && cal.variants && toVariant) cal._variant = toVariant;
    return cal;
  }, [toCal, toVariant]);

  const onFromCalChange = (id: string) => {
    setFromCal(id);
    const cal = CALENDARS[id];
    if (cal?.variants) setFromVariant(cal.defaultVariant || cal.variants[0]);
    else setFromVariant('');
  };

  const onToCalChange = (id: string) => {
    setToCal(id);
    const cal = CALENDARS[id];
    if (cal?.variants) setToVariant(cal.defaultVariant || cal.variants[0]);
    else setToVariant('');
  };

  const convert = () => {
    const src = getSrc();
    const tgt = getTgt();
    if (!src) { setResult({ type: 'error', message: 'Select source calendar' }); return; }
    if (!tgt) { setResult({ type: 'error', message: 'Select target calendar' }); return; }
    if (src.id === tgt.id) { setResult({ type: 'error', message: T.errSameCal }); return; }

    const y = parseInt(year, 10);
    if (!y || y < 1) { setResult({ type: 'error', message: T.errNoYear }); return; }

    const m = parseInt(month, 10) || null;
    const d = parseInt(day, 10) || null;

    if (m && (m < 1 || m > src.monthCount)) {
      setResult({ type: 'error', message: T.errInvalidMonth }); return;
    }
    if (d && m) {
      const maxDay = src.monthLength(y, m);
      if (d < 1 || d > maxDay) { setResult({ type: 'error', message: T.errInvalidDay }); return; }
    }

    if (d && m) {
      convertDate(src, tgt, y, m, d);
    } else if (m) {
      convertMonth(src, tgt, y, m);
    } else {
      convertYear(src, tgt, y);
    }

    history.add({
      fromCal: src.id, toCal: tgt.id,
      year: y, month: m, day: d,
      variant: src._variant || null
    });
  };

  const convertDate = (src: CalendarDef, tgt: CalendarDef, y: number, m: number, d: number) => {
    const jd = src.toJD(y, m, d);
    const res = tgt.fromJD(jd);
    const dow = Cal.getDayOfWeek(jd);
    const srcNames = src.monthNames(T);
    const tgtNames = tgt.monthNames(T);

    const lines: ResultLine[] = [
      { text: (T.calendars as any)[src.id] || src.id, style: 'label' },
      { text: `${d} ${srcNames[m - 1]} ${y}`, style: 'secondary' },
      { text: (T.calendars as any)[tgt.id] || tgt.id, style: 'label' },
      { text: `${res.day} ${tgtNames[res.month - 1]} ${res.year} \u2014 ${T.weekdays[dow]}`, style: 'main' },
    ];

    // Indiction for Byzantine
    if (tgt.id === 'byzantine') {
      const ind = Cal.indictionFromJD(jd);
      lines.push({ text: `${T.indictionLabel || 'Indiction'} ${ind}`, style: 'secondary' });
    }
    // Animal year for Ilkhanid
    if (tgt.id === 'ilkhani') {
      const animal = Cal.ilkhaniAnimalYear(res.year);
      const animalName = (T.ilkhaniAnimals as any)?.[animal] || animal;
      lines.push({ text: `${T.animalYearLabel || 'Animal year'}: ${animalName}`, style: 'secondary' });
    }
    // Roman notation
    if (tgt.id === 'roman' && res.day) {
      const notation = Cal.romanDayNotation(res.month, res.day, tgt.isLeap(res.year));
      lines.push({ text: notation, style: 'secondary' });
    }
    // Babylonian source note
    if (tgt.id === 'babylonian') {
      const isPD = Cal.isBabylonianPD(res.year);
      lines.push({ text: isPD ? T.babylonianPDNote : T.babylonianArithNote, style: 'note' });
    }
    // Proleptic Gregorian note
    if (tgt.id === 'gregorian' && jd < 2299160.5) {
      lines.push({ text: T.julianDateNote, style: 'note' });
    }

    // Zodiac
    const zi = Cal.getZodiacSign(jd);
    const zodiacSymbol = '\u2648\u2649\u264A\u264B\u264C\u264D\u264E\u264F\u2650\u2651\u2652\u2653'[zi];
    lines.push({ text: `${zodiacSymbol} ${T.zodiacSigns[zi]}`, style: 'meta' });

    // Moon phase
    const moon = Astronomy.moonPhase(jd);
    const phaseName = (T.moonPhases as any)?.[moon.name] || moon.name;
    lines.push({ text: `${moon.icon} ${phaseName} \u2014 ${T.moonAge}: ${moon.age}d, ${moon.illumination}%`, style: 'meta' });

    // Comet
    const comet = Astronomy.lookupComet(jd);
    if (comet) {
      const cometName = (T.cometNames as any)?.[comet.id] || comet.id;
      const note = comet.noteKey ? (T.cometNotes as any)?.[comet.noteKey] : null;
      lines.push({ text: `\u2604\uFE0F ${T.cometLabel}: ${cometName} (${comet.year})${note ? ' \u2014 ' + note : ''}`, style: 'meta' });
    }

    // Supernova
    const sn = Astronomy.lookupSupernova(jd);
    if (sn) {
      const note = sn.noteKey ? (T.supernovaNotes as any)?.[sn.noteKey] : null;
      lines.push({ text: `\u2B50 ${T.supernovaLabel}: ${sn.constellation} (mag ${sn.peakMag})${note ? ' \u2014 ' + note : ''}`, style: 'meta' });
    }

    // Conjunction
    const conj = Astronomy.lookupConjunction(jd);
    if (conj) {
      const p1 = Astronomy.planetName(conj.planet1, T);
      const p2 = Astronomy.planetName(conj.planet2, T);
      const sep = conj.separation < 60 ? `${conj.separation}'` : `${(conj.separation / 60).toFixed(1)}\u00b0`;
      const note = conj.noteKey ? (T.conjunctionNotes as any)?.[conj.noteKey] : null;
      lines.push({ text: `${T.conjunctionLabel}: ${p1}\u2013${p2} (${sep})${note ? ' \u2014 ' + note : ''}`, style: 'meta' });
    }

    // JDN
    lines.push({ text: `${T.jdn}: ${jd}`, style: 'meta' });

    setResult({ type: 'date', lines });
  };

  const convertMonth = (src: CalendarDef, tgt: CalendarDef, y: number, m: number) => {
    const startD = 1;
    const endD = src.monthLength(y, m);
    const jdStart = src.toJD(y, m, startD);
    const jdEnd = src.toJD(y, m, endD);
    const resStart = tgt.fromJD(jdStart);
    const resEnd = tgt.fromJD(jdEnd);
    const srcNames = src.monthNames(T);
    const tgtNames = tgt.monthNames(T);

    const lines: ResultLine[] = [
      { text: (T.calendars as any)[src.id], style: 'label' },
      { text: `${srcNames[m - 1]} ${y} (${endD} ${T.totalDays})`, style: 'secondary' },
      { text: (T.calendars as any)[tgt.id], style: 'label' },
      { text: `${resStart.day} ${tgtNames[resStart.month - 1]} ${resStart.year} \u2013 ${resEnd.day} ${tgtNames[resEnd.month - 1]} ${resEnd.year}`, style: 'main' },
    ];

    // Month breakdown table
    const table: TableRow[] = [];
    let curJd = jdStart;
    while (curJd <= jdEnd) {
      const tgtDate = tgt.fromJD(curJd);
      const tgtMonthEnd = Math.min(jdEnd, src.toJD(y, m, endD));
      // Find how many days until target month changes or source range ends
      let daysInChunk = 0;
      let chunkEnd = curJd;
      const startTgt = tgt.fromJD(curJd);
      while (chunkEnd <= jdEnd) {
        const check = tgt.fromJD(chunkEnd);
        if (check.month !== startTgt.month || check.year !== startTgt.year) break;
        daysInChunk++;
        chunkEnd++;
      }
      const endTgt = tgt.fromJD(chunkEnd - 1);
      table.push({
        month: `${tgtNames[startTgt.month - 1]} ${startTgt.year}`,
        days: daysInChunk,
        range: `${startTgt.day}\u2013${endTgt.day}`
      });
      curJd = chunkEnd;
    }
    if (table.length > 1) lines.push({ text: T.monthBreakdown, style: 'label' });

    lines.push({ text: `${T.jdn}: ${jdStart} \u2013 ${jdEnd}`, style: 'meta' });

    setResult({ type: 'range', lines, table: table.length > 1 ? table : undefined });
  };

  const convertYear = (src: CalendarDef, tgt: CalendarDef, y: number) => {
    const jdStart = src.toJD(y, 1, 1);
    const totalDays = src.yearLength(y);
    const lastMonth = src.monthCount;
    const lastDay = src.monthLength(y, lastMonth);
    const jdEnd = src.toJD(y, lastMonth, lastDay);
    const resStart = tgt.fromJD(jdStart);
    const resEnd = tgt.fromJD(jdEnd);
    const srcNames = src.monthNames(T);
    const tgtNames = tgt.monthNames(T);

    const lines: ResultLine[] = [
      { text: `${(T.calendars as any)[src.id]} ${y}`, style: 'label' },
      { text: `${totalDays} ${T.totalDays}${src.isLeap(y) ? ' \u2014 ' + T.leapYear : ''}`, style: 'secondary' },
      { text: (T.calendars as any)[tgt.id], style: 'label' },
      { text: `${resStart.day} ${tgtNames[resStart.month - 1]} ${resStart.year} \u2013 ${resEnd.day} ${tgtNames[resEnd.month - 1]} ${resEnd.year}`, style: 'main' },
    ];

    // Month breakdown
    const table: TableRow[] = [];
    for (let mo = 1; mo <= src.monthCount; mo++) {
      const mLen = src.monthLength(y, mo);
      if (mLen === 0) continue;
      const mJdStart = src.toJD(y, mo, 1);
      const mJdEnd = src.toJD(y, mo, mLen);
      const mResStart = tgt.fromJD(mJdStart);
      const mResEnd = tgt.fromJD(mJdEnd);
      table.push({
        month: srcNames[mo - 1],
        days: mLen,
        range: `${mResStart.day} ${tgtNames[mResStart.month - 1]} ${mResStart.year} \u2013 ${mResEnd.day} ${tgtNames[mResEnd.month - 1]} ${mResEnd.year}`
      });
    }

    lines.push({ text: `${T.jdn}: ${jdStart} \u2013 ${jdEnd}`, style: 'meta' });

    setResult({ type: 'range', lines, table });
  };

  const loadHistoryEntry = (entry: HistoryEntry) => {
    setFromCal(entry.fromCal);
    setToCal(entry.toCal);
    setYear(String(entry.year));
    setMonth(entry.month ? String(entry.month) : '');
    setDay(entry.day ? String(entry.day) : '');
    if (entry.variant) {
      const cal = CALENDARS[entry.fromCal];
      if (cal?.variants) {
        setFromVariant(entry.variant);
        cal._variant = entry.variant;
      }
    }
  };

  const srcCal = fromCal ? CALENDARS[fromCal] : null;
  const tgtCal = toCal ? CALENDARS[toCal] : null;

  // Month names for picker
  const monthNames = srcCal ? srcCal.monthNames(T) : [];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]} keyboardShouldPersistTaps="handled">
      <Text style={[styles.title, { color: theme.colors.text, letterSpacing: theme.name === 'brutalist' ? 3 : 0 }]}>{T.appTitle}</Text>
      <Text style={[styles.subtitle, { color: theme.name === 'brutalist' ? theme.colors.accent : theme.colors.textSecondary, letterSpacing: theme.name === 'brutalist' ? 2 : 0 }]}>{T.appSubtitle}</Text>

      <BrutalistCard>
        {/* Source calendar */}
        <CalendarPicker value={fromCal} onSelect={onFromCalChange} label={T.fromCalendar} />
        {srcCal?.variants && (
          <VariantBar
            variants={srcCal.variants}
            selected={fromVariant || srcCal.defaultVariant || srcCal.variants[0]}
            onSelect={(v) => { setFromVariant(v); srcCal._variant = v; }}
          />
        )}

        {/* Date inputs */}
        <View style={styles.dateRow}>
          <View style={styles.dateField}>
            <Text style={[styles.fieldLabel, { color: theme.colors.textSecondary }]}>{T.year}</Text>
            <TextInput
              style={[styles.numInput, { borderColor: theme.colors.border, color: theme.colors.text, borderRadius: theme.borderRadius }]}
              keyboardType="number-pad"
              value={year}
              onChangeText={setYear}
              placeholder="1"
              placeholderTextColor={theme.colors.textMuted}
            />
          </View>
          <View style={[styles.dateField, { flex: 2 }]}>
            <Text style={[styles.fieldLabel, { color: theme.colors.textSecondary }]}>{T.month}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.monthScroll}>
              <TouchableOpacity
                style={[styles.monthChip, !month && { backgroundColor: theme.colors.accent }]}
                onPress={() => setMonth('')}
              >
                <Text style={[styles.monthChipText, { color: !month ? theme.colors.buttonText : theme.colors.text }]}>{'—'}</Text>
              </TouchableOpacity>
              {monthNames.map((name: string, i: number) => {
                const active = month === String(i + 1);
                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.monthChip, { borderColor: theme.colors.border }, active && { backgroundColor: theme.colors.accent }]}
                    onPress={() => setMonth(String(i + 1))}
                  >
                    <Text style={[styles.monthChipText, { color: active ? theme.colors.buttonText : theme.colors.text }]}>
                      {name.slice(0, 3)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
          <View style={styles.dateField}>
            <Text style={[styles.fieldLabel, { color: theme.colors.textSecondary }]}>{T.day}</Text>
            <TextInput
              style={[styles.numInput, { borderColor: theme.colors.border, color: theme.colors.text, borderRadius: theme.borderRadius }]}
              keyboardType="number-pad"
              value={day}
              onChangeText={setDay}
              placeholder="1"
              placeholderTextColor={theme.colors.textMuted}
            />
          </View>
        </View>

        {/* Target calendar */}
        <View style={{ marginTop: 16 }}>
          <CalendarPicker value={toCal} onSelect={onToCalChange} label={T.targetCalendar} />
          {tgtCal?.variants && (
            <VariantBar
              variants={tgtCal.variants}
              selected={toVariant || tgtCal.defaultVariant || tgtCal.variants[0]}
              onSelect={(v) => { setToVariant(v); tgtCal._variant = v; }}
            />
          )}
        </View>

        {/* Convert button */}
        <TouchableOpacity
          style={[styles.convertBtn, {
            backgroundColor: theme.colors.buttonBg,
            borderRadius: theme.borderRadius,
            borderWidth: theme.name === 'brutalist' ? 3 : 0,
            borderColor: theme.colors.border,
            shadowColor: theme.name === 'brutalist' ? theme.colors.accent : 'transparent',
            shadowOffset: theme.name === 'brutalist' ? { width: 4, height: 4 } : { width: 0, height: 0 },
            shadowOpacity: 1,
            shadowRadius: 0,
          }]}
          onPress={convert}
        >
          <Text style={[styles.convertBtnText, { color: theme.colors.buttonText, letterSpacing: theme.name === 'brutalist' ? 3 : 0 }]}>{T.convert} →</Text>
        </TouchableOpacity>
      </BrutalistCard>

      {/* Result */}
      {result && (
        <BrutalistCard>
          {result.type === 'error' ? (
            <Text style={[styles.errorText, { color: theme.colors.error }]}>{result.message}</Text>
          ) : (
            <>
              {result.lines.map((line, i) => (
                <Text key={i} style={[
                  line.style === 'main' && [styles.resultMain, { color: theme.colors.text, borderBottomWidth: theme.name === 'brutalist' ? 3 : 0, borderBottomColor: theme.colors.accent, paddingBottom: theme.name === 'brutalist' ? 4 : 0, fontWeight: '900' as const }],
                  line.style === 'label' && [styles.resultLabel, { color: theme.name === 'brutalist' ? theme.colors.textMuted : theme.colors.accent }],
                  line.style === 'secondary' && [styles.resultSecondary, { color: theme.colors.text }],
                  line.style === 'meta' && [styles.resultMeta, { color: theme.colors.textMuted }],
                  line.style === 'note' && [styles.resultNote, { color: theme.colors.textSecondary }],
                ]}>
                  {line.text}
                </Text>
              ))}
              {result.type === 'range' && result.table && (
                <View style={[styles.table, { borderColor: theme.colors.border, borderWidth: theme.borderWidth }]}>
                  <View style={[styles.tableHeader, { backgroundColor: theme.colors.surfaceAlt }]}>
                    <Text style={[styles.tableCell, styles.tableCellMonth, { color: theme.name === 'brutalist' ? theme.colors.accent : theme.colors.text, fontWeight: '900' as const }]}>Month</Text>
                    <Text style={[styles.tableCell, styles.tableCellDays, { color: theme.name === 'brutalist' ? theme.colors.accent : theme.colors.text, fontWeight: '900' as const }]}>Days</Text>
                    <Text style={[styles.tableCell, styles.tableCellRange, { color: theme.name === 'brutalist' ? theme.colors.accent : theme.colors.text, fontWeight: '900' as const }]}>Range</Text>
                  </View>
                  {result.table.map((row, i) => (
                    <View key={i} style={[styles.tableRow, { borderTopColor: theme.colors.border }]}>
                      <Text style={[styles.tableCell, styles.tableCellMonth, { color: theme.colors.text }]}>{row.month}</Text>
                      <Text style={[styles.tableCell, styles.tableCellDays, { color: theme.colors.textSecondary }]}>{row.days}</Text>
                      <Text style={[styles.tableCell, styles.tableCellRange, { color: theme.colors.textSecondary }]}>{row.range}</Text>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}
        </BrutalistCard>
      )}

      {/* History */}
      {history.entries.length > 0 && (
        <View style={[styles.historyPanel, { borderColor: theme.colors.border, borderTopWidth: theme.borderWidth }]}>
          <View style={styles.historyHeader}>
            <Text style={[styles.historyTitle, { color: theme.colors.text, letterSpacing: theme.name === 'brutalist' ? 2 : 0 }]}>{T.history}</Text>
            <TouchableOpacity onPress={history.clear}>
              <Text style={[styles.historyClear, { color: theme.name === 'brutalist' ? theme.colors.text : theme.colors.accent }]}>{T.clearHistory}</Text>
            </TouchableOpacity>
          </View>
          {history.entries.map(entry => {
            const srcName = (T.calendars as any)[entry.fromCal] || entry.fromCal;
            const tgtName = (T.calendars as any)[entry.toCal] || entry.toCal;
            const dateStr = [entry.day, entry.month, entry.year].filter(Boolean).join('/');
            return (
              <TouchableOpacity
                key={entry.ts}
                style={[styles.historyEntry, { borderBottomColor: theme.colors.border }]}
                onPress={() => loadHistoryEntry(entry)}
              >
                <Text style={[styles.historyText, { color: theme.colors.text }]} numberOfLines={1}>
                  {dateStr} {srcName} → {tgtName}
                </Text>
                <TouchableOpacity onPress={() => history.remove(entry.ts)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={[styles.historyRemove, { color: theme.colors.textMuted }]}>×</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <ThemeToggle />
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  title: { fontSize: 22, fontWeight: '900', textAlign: 'center', marginTop: 20, textTransform: 'uppercase' },
  subtitle: { fontSize: 11, textAlign: 'center', marginBottom: 20, textTransform: 'uppercase', fontWeight: '700' },
  card: { padding: 16, marginBottom: 16 },
  dateRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  dateField: { flex: 1 },
  fieldLabel: { fontSize: 11, fontWeight: '900', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 1.5 },
  numInput: { borderWidth: 2, paddingHorizontal: 10, paddingVertical: 10, fontSize: 16, textAlign: 'center', fontWeight: '700' },
  monthScroll: { maxHeight: 38 },
  monthChip: { borderWidth: 2, borderColor: 'transparent', paddingHorizontal: 8, paddingVertical: 8, marginRight: 4 },
  monthChipText: { fontSize: 13, fontWeight: '700' },
  convertBtn: { marginTop: 16, paddingVertical: 14, alignItems: 'center' },
  convertBtnText: { fontSize: 16, fontWeight: '900', textTransform: 'uppercase' },
  resultCard: { padding: 16, marginBottom: 16 },
  errorText: { fontSize: 15, fontWeight: '700' },
  resultMain: { fontSize: 20, fontWeight: '900', marginBottom: 4 },
  resultLabel: { fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 2, marginTop: 12 },
  resultSecondary: { fontSize: 16, marginBottom: 2, fontWeight: '600' },
  resultMeta: { fontSize: 13, marginTop: 6 },
  resultNote: { fontSize: 13, fontStyle: 'italic', marginTop: 8 },
  table: { marginTop: 12 },
  tableHeader: { flexDirection: 'row', padding: 8 },
  tableRow: { flexDirection: 'row', padding: 8, borderTopWidth: 2 },
  tableCell: { fontSize: 13, fontWeight: '700' },
  tableCellMonth: { flex: 3 },
  tableCellDays: { flex: 1, textAlign: 'center' },
  tableCellRange: { flex: 4 },
  historyPanel: { paddingTop: 12, marginTop: 8 },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  historyTitle: { fontSize: 14, fontWeight: '900', textTransform: 'uppercase' },
  historyClear: { fontSize: 14, fontWeight: '700' },
  historyEntry: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 2 },
  historyText: { fontSize: 14, flex: 1, fontWeight: '600' },
  historyRemove: { fontSize: 20, paddingLeft: 12 },
});

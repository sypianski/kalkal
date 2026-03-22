import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'kalkal-history';
const MAX = 20;

export interface HistoryEntry {
  fromCal: string;
  toCal: string;
  year: number;
  month: number | null;
  day: number | null;
  variant: string | null;
  ts: number;
}

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then(raw => {
      if (raw) {
        try { setEntries(JSON.parse(raw)); } catch {}
      }
    });
  }, []);

  const save = useCallback((list: HistoryEntry[]) => {
    setEntries(list);
    AsyncStorage.setItem(KEY, JSON.stringify(list));
  }, []);

  const add = useCallback((entry: Omit<HistoryEntry, 'ts'>) => {
    setEntries(prev => {
      const filtered = prev.filter(e =>
        !(e.fromCal === entry.fromCal && e.toCal === entry.toCal &&
          e.year === entry.year && e.month === entry.month &&
          e.day === entry.day && e.variant === entry.variant)
      );
      const next = [{ ...entry, ts: Date.now() }, ...filtered].slice(0, MAX);
      AsyncStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const remove = useCallback((ts: number) => {
    setEntries(prev => {
      const next = prev.filter(e => e.ts !== ts);
      AsyncStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    save([]);
  }, [save]);

  return { entries, add, remove, clear };
}

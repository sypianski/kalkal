import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { manuscript } from './manuscript';
import { brutalist } from './brutalist';

export type Theme = Omit<typeof manuscript, 'name'> & { name: string };
type ThemeName = 'manuscript' | 'brutalist';

const themes: Record<ThemeName, Theme> = { manuscript, brutalist };

interface ThemeContextType {
  theme: Theme;
  themeName: ThemeName;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: brutalist,
  themeName: 'brutalist',
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>('brutalist');

  useEffect(() => {
    AsyncStorage.getItem('kalkal-theme').then(saved => {
      if (saved === 'manuscript' || saved === 'brutalist') setThemeName(saved);
    });
  }, []);

  const toggleTheme = () => {
    const next: ThemeName = themeName === 'manuscript' ? 'brutalist' : 'manuscript';
    setThemeName(next);
    AsyncStorage.setItem('kalkal-theme', next);
  };

  return (
    <ThemeContext.Provider value={{ theme: themes[themeName], themeName, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

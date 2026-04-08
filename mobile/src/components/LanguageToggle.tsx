import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useLanguage, Lang } from '../i18n/LanguageContext';

const LANGS: { code: Lang; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'pl', label: 'PL' },
  { code: 'ar', label: 'AR' },
  { code: 'eo', label: 'EO' },
];

export function LanguageToggle() {
  const { theme } = useTheme();
  const { lang, setLang } = useLanguage();
  const isBrut = theme.name === 'brutalist';

  return (
    <View style={[styles.row, { borderColor: theme.colors.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius }]}>
      {LANGS.map(({ code, label }) => {
        const active = lang === code;
        return (
          <TouchableOpacity
            key={code}
            style={[
              styles.btn,
              active && {
                backgroundColor: isBrut ? theme.colors.accent : theme.colors.surfaceAlt,
              },
            ]}
            onPress={() => setLang(code)}
          >
            <Text style={[
              styles.text,
              { color: active ? (isBrut ? theme.colors.accentText : theme.colors.text) : theme.colors.textSecondary },
            ]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: 12,
    overflow: 'hidden',
  },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    minWidth: 44,
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
});

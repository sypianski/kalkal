import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export function ThemeToggle() {
  const { theme, themeName, toggleTheme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.btn, {
        backgroundColor: theme.name === 'brutalist' ? theme.colors.accent : theme.colors.surface,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius,
        borderWidth: theme.borderWidth,
        shadowColor: theme.name === 'brutalist' ? theme.colors.border : 'transparent',
        shadowOffset: theme.name === 'brutalist' ? { width: 3, height: 3 } : { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 0,
      }]}
      onPress={toggleTheme}
    >
      <Text style={[styles.text, { color: theme.name === 'brutalist' ? theme.colors.accentText : theme.colors.text }]}>
        {themeName === 'manuscript' ? 'Manuscript' : 'Brutalist'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { paddingHorizontal: 12, paddingVertical: 8, alignSelf: 'center', marginVertical: 12 },
  text: { fontSize: 12, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1.5 },
});

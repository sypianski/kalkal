import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export function ThemeToggle() {
  const { theme, themeName, toggleTheme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.btn, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderRadius: theme.borderRadius }]}
      onPress={toggleTheme}
    >
      <Text style={[styles.text, { color: theme.colors.text }]}>
        {themeName === 'manuscript' ? 'Manuscript' : 'Brutalist'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 6, alignSelf: 'center', marginVertical: 12 },
  text: { fontSize: 13, fontWeight: '500' },
});

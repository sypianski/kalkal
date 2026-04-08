import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { VARIANT_LABELS } from '../engine/calendars';

interface Props {
  variants: string[];
  selected: string;
  onSelect: (v: string) => void;
}

export function VariantBar({ variants, selected, onSelect }: Props) {
  const { theme } = useTheme();
  if (variants.length === 0) return null;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bar}>
      {variants.map(v => {
        const active = v === selected;
        return (
          <TouchableOpacity
            key={v}
            style={[
              styles.btn,
              { borderColor: theme.colors.border, borderRadius: theme.borderRadius },
              active && { backgroundColor: theme.colors.accent, borderColor: theme.colors.accent }
            ]}
            onPress={() => onSelect(v)}
          >
            <Text style={[styles.btnText, { color: active ? theme.colors.accentText : theme.colors.text }]}>
              {VARIANT_LABELS[v] || v}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', marginTop: 6, maxHeight: 40 },
  btn: { borderWidth: 2, paddingHorizontal: 10, paddingVertical: 6, marginRight: 6 },
  btnText: { fontSize: 12, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.5 },
});

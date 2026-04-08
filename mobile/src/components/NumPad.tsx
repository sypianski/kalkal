import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  value: string;
  onChange: (v: string) => void;
  maxLength?: number;
}

const KEYS = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '⌫', '0', 'C'];

export function NumPad({ value, onChange, maxLength = 6 }: Props) {
  const { theme } = useTheme();
  const isBrut = theme.name === 'brutalist';

  const press = (k: string) => {
    if (k === '⌫') {
      onChange(value.slice(0, -1));
    } else if (k === 'C') {
      onChange('');
    } else {
      if (value.length >= maxLength) return;
      onChange(value + k);
    }
  };

  return (
    <View style={styles.grid}>
      {KEYS.map(k => {
        const isAction = k === '⌫' || k === 'C';
        return (
          <TouchableOpacity
            key={k}
            style={[
              styles.key,
              {
                backgroundColor: isAction
                  ? (isBrut ? '#222' : theme.colors.surfaceAlt)
                  : (isBrut ? theme.colors.surface : theme.colors.surface),
                borderColor: theme.colors.border,
                borderWidth: theme.borderWidth,
                borderRadius: theme.borderRadius,
              },
            ]}
            onPress={() => press(k)}
            activeOpacity={0.6}
          >
            <Text style={[
              styles.keyText,
              {
                color: isAction
                  ? (isBrut ? theme.colors.accent : theme.colors.accent)
                  : theme.colors.text,
                fontWeight: isAction ? '900' : '700',
              },
            ]}>
              {k}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  key: {
    width: '30%',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    // flex: 1 doesn't work nicely with 3-col, use percentage
  },
  keyText: {
    fontSize: 22,
  },
});

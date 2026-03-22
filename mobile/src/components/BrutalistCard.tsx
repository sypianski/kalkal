import React, { ReactNode } from 'react';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  children: ReactNode;
  style?: ViewStyle;
}

export function BrutalistCard({ children, style }: Props) {
  const { theme } = useTheme();
  const isBrut = theme.name === 'brutalist';
  const offset = 6;

  return (
    <View style={{ position: 'relative', marginBottom: isBrut ? offset + 10 : 16 }}>
      {isBrut && (
        <View style={{
          position: 'absolute',
          top: offset,
          left: offset,
          right: -offset,
          bottom: -offset,
          backgroundColor: '#000',
        }} />
      )}
      <View style={[{
        backgroundColor: theme.colors.cardBg,
        borderColor: theme.colors.border,
        borderWidth: theme.borderWidth,
        borderRadius: theme.borderRadius,
        padding: 16,
        position: 'relative',
      }, !isBrut && {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }, style]}>
        {children}
      </View>
    </View>
  );
}

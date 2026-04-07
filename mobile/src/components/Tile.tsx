import React, { ReactNode, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  title: string;
  defaultExpanded?: boolean;
  children: ReactNode;
}

// Unified collapsible tile, mirroring web's .tile-toggle / .tile-content
// (commits a3e221d, 612f929 in the web app).
export function Tile({ title, defaultExpanded = false, children }: Props) {
  const { theme } = useTheme();
  const isBrut = theme.name === 'brutalist';
  const offset = 6;
  const [expanded, setExpanded] = useState(defaultExpanded);

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
        position: 'relative',
        overflow: 'hidden',
      }, !isBrut && {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }]}>
        <TouchableOpacity
          style={styles.toggle}
          onPress={() => setExpanded(e => !e)}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.toggleText,
            {
              color: expanded ? theme.colors.text : theme.colors.textMuted,
              letterSpacing: isBrut ? 2 : 1,
            }
          ]}>
            {title}
          </Text>
          <Text style={[styles.chevron, { color: expanded ? theme.colors.text : theme.colors.textMuted }]}>
            {expanded ? '\u25B4' : '\u25BE'}
          </Text>
        </TouchableOpacity>
        {expanded && (
          <View style={styles.content}>
            {children}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  toggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
    flex: 1,
  },
  chevron: {
    fontSize: 14,
    fontWeight: '900',
    marginLeft: 8,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 0,
  },
});

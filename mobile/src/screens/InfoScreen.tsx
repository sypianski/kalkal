import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useT } from '../i18n/LanguageContext';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Info'>;

export function InfoScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const T = useT();
  const isBrut = theme.name === 'brutalist';

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isBrut ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[
        styles.header,
        {
          backgroundColor: isBrut ? '#000' : theme.colors.surface,
          borderBottomColor: theme.colors.border,
          borderBottomWidth: theme.borderWidth,
        },
      ]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={[styles.backText, { color: isBrut ? theme.colors.accent : theme.colors.accent }]}>
            ← {T.infoBack}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: isBrut ? '#fff' : theme.colors.text }]}>
          {T.infoTitle}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <Text style={[styles.appName, { color: theme.colors.text }]}>{T.appTitle}</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>{T.appSubtitle}</Text>

        <View style={[styles.section, { borderColor: theme.colors.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius, backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{T.infoMethodTitle}</Text>
          <Text style={[styles.body2, { color: theme.colors.textSecondary }]}>{T.infoMethodBody}</Text>
        </View>

        <View style={[styles.section, { borderColor: theme.colors.border, borderWidth: theme.borderWidth, borderRadius: theme.borderRadius, backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{T.infoCalTitle}</Text>
          <Text style={[styles.body2, { color: theme.colors.textSecondary }]}>{T.infoCalBody}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  backBtn: { marginBottom: 8 },
  backText: { fontSize: 14, fontWeight: '700', letterSpacing: 0.5 },
  title: { fontSize: 22, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1.5 },
  body: { padding: 16, gap: 16 },
  appName: { fontSize: 28, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 2 },
  subtitle: { fontSize: 14, fontWeight: '600', marginTop: 4, marginBottom: 8 },
  section: { padding: 16 },
  sectionTitle: { fontSize: 13, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 },
  body2: { fontSize: 15, lineHeight: 22 },
});

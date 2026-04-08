import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { useT } from '../i18n/LanguageContext';
import { CalendarsScreen } from './CalendarsScreen';
import { MethodologyScreen } from './MethodologyScreen';

type InfoTab = 'calendars' | 'methodology';

export function InfoScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<InfoTab>('calendars');
  const { theme } = useTheme();
  const T = useT();
  const isBrut = theme.name === 'brutalist';

  const tabContent = activeTab === 'calendars' ? <CalendarsScreen /> : <MethodologyScreen />;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header with back button and title */}
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Converter')}
          style={styles.backButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={[styles.backText, { color: theme.colors.accent }]}>← {T.navConverter}</Text>
        </TouchableOpacity>
      </View>

      {/* Tab buttons */}
      <View style={[styles.tabBar, { backgroundColor: theme.colors.tabBar, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity
          onPress={() => setActiveTab('calendars')}
          style={[
            styles.tabButton,
            activeTab === 'calendars' && [
              styles.tabButtonActive,
              { borderBottomColor: theme.colors.tabActive, backgroundColor: isBrut ? theme.colors.background : 'transparent' }
            ],
            { borderBottomColor: theme.colors.border }
          ]}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabLabel,
              {
                color: activeTab === 'calendars' ? theme.colors.tabActive : theme.colors.tabInactive,
                fontWeight: activeTab === 'calendars' ? '900' : '700'
              }
            ]}
          >
            {T.navCalendars}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('methodology')}
          style={[
            styles.tabButton,
            activeTab === 'methodology' && [
              styles.tabButtonActive,
              { borderBottomColor: theme.colors.tabActive, backgroundColor: isBrut ? theme.colors.background : 'transparent' }
            ],
            { borderBottomColor: theme.colors.border }
          ]}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabLabel,
              {
                color: activeTab === 'methodology' ? theme.colors.tabActive : theme.colors.tabInactive,
                fontWeight: activeTab === 'methodology' ? '900' : '700'
              }
            ]}
          >
            {T.navMethodology}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {tabContent}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    paddingVertical: 4,
  },
  backText: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingHorizontal: 0,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButtonActive: {
    borderBottomWidth: 3,
  },
  tabLabel: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

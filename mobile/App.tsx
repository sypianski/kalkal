import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { LanguageProvider, useT } from './src/i18n/LanguageContext';
import { ConverterScreen } from './src/screens/ConverterScreen';
import { InfoScreen } from './src/screens/InfoScreen';

const Tab = createBottomTabNavigator();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Converter: '\u2194\uFE0F',
    Info: 'ℹ️',
  };
  return <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{icons[label] || '\u2022'}</Text>;
}

function AppTabs() {
  const { theme } = useTheme();
  const t = useT();

  return (
    <>
      <StatusBar style={theme.name === 'brutalist' ? 'light' : 'dark'} />
      <Tab.Navigator
        id="main-tabs"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
          tabBarActiveTintColor: theme.colors.tabActive,
          tabBarInactiveTintColor: theme.colors.tabInactive,
          tabBarStyle: {
            backgroundColor: theme.colors.tabBar,
            borderTopColor: theme.name === 'brutalist' ? theme.colors.tabActive : theme.colors.border,
            borderTopWidth: theme.name === 'brutalist' ? 3 : 1,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '900' as const,
            textTransform: 'uppercase' as const,
            letterSpacing: theme.name === 'brutalist' ? 1.5 : 0,
          },
        })}
      >
        <Tab.Screen name="Converter" component={ConverterScreen} options={{ tabBarLabel: t.navConverter }} />
        <Tab.Screen
          name="Info"
          component={InfoScreen}
          options={{ tabBarLabel: t.navInfo || 'Info' }}
        />
      </Tab.Navigator>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <NavigationContainer>
          <AppTabs />
        </NavigationContainer>
      </LanguageProvider>
    </ThemeProvider>
  );
}

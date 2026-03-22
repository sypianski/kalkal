import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { ConverterScreen } from './src/screens/ConverterScreen';
import { CalendarsScreen } from './src/screens/CalendarsScreen';
import { MethodologyScreen } from './src/screens/MethodologyScreen';

const Tab = createBottomTabNavigator();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Converter: '\u2194\uFE0F',
    Calendars: '\u{1F4C5}',
    Methodology: '\u{1F4D6}',
  };
  return <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{icons[label] || '\u2022'}</Text>;
}

function AppTabs() {
  const { theme } = useTheme();

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
        <Tab.Screen name="Converter" component={ConverterScreen} />
        <Tab.Screen name="Calendars" component={CalendarsScreen} />
        <Tab.Screen name="Methodology" component={MethodologyScreen} />
      </Tab.Navigator>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <AppTabs />
      </NavigationContainer>
    </ThemeProvider>
  );
}

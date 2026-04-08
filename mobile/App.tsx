import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from './src/theme/ThemeContext';
import { LanguageProvider } from './src/i18n/LanguageContext';
import { StartScreen } from './src/screens/StartScreen';
import { ConverterScreen } from './src/screens/ConverterScreen';
import { InfoScreen } from './src/screens/InfoScreen';

export type RootStackParamList = {
  Start: undefined;
  Converter: { calendarId: string; year: number; toCalendarId?: string };
  Info: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <NavigationContainer>
          <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Start" component={StartScreen} />
            <Stack.Screen name="Converter" component={ConverterScreen} />
            <Stack.Screen name="Info" component={InfoScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </LanguageProvider>
    </ThemeProvider>
  );
}

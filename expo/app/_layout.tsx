import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { useAppState } from '@/state/useAppState';
import { useEffect } from 'react';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const dictionaryTerms = useAppState((state) => state.dictionaryTerms)
  const setDictionaryTerms = useAppState((state) => state.setDictionaryTerms)
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    const loadDictionary = () => {
      if (!dictionaryTerms) {   
        try {
          // Import your newDictionary.json with UUIDs       
            const dictionaryData = require('@/assets/data/dictionary.json')
            
            // Set it in state
            setDictionaryTerms(dictionaryData)
        } catch (error) {
          logger.error('Failed to load dictionary:', error)
          // Set empty array as fallback
          setDictionaryTerms([])
        }
      }
    }

    loadDictionary()
  }, [setDictionaryTerms])

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useAppState } from '@/state/useAppState'
import React, { useEffect } from 'react'
import AdBanner from '@/components/ui/custom/ads/AdBanner'
import { View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Asset } from 'expo-asset'

// At the top level, preload the images
Asset.loadAsync([
  require('@/assets/images/i-like-food-dark-blue-260.png'),
  require('@/assets/images/i-like-food-light-260.png')
])


export default function RootLayout() {
  const insets = useSafeAreaInsets()
  const colorScheme = useColorScheme()
  const theme = colorScheme === 'light' ? Colors.light : Colors.dark
  const dictionaryTerms = useAppState((state) => state.dictionaryTerms)
  const setDictionaryTerms = useAppState((state) => state.setDictionaryTerms)
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

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
    return null
  }

  

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1, backgroundColor: 'transparent', paddingBottom: Math.max(insets.bottom, 10) }}>
        <StatusBar 
          style={colorScheme === 'dark' ? "light" : "dark"} 
        />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
        
        <AdBanner 
          marginVertical={0}
          style={{ 
            paddingHorizontal: 0,
            backgroundColor: theme.background,
            zIndex: 1000,
            elevation: 1000,
          }}
        />
      </View>
    </ThemeProvider>
  )
}

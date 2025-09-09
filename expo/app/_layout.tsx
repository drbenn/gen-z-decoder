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
import { View, Text } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Asset } from 'expo-asset'
import logger from '@/utils/logger'
import appInitializationService from '@/services/AppInitializationService'
import { ErrorBoundary } from 'react-error-boundary'

// At the top level, preload the images
Asset.loadAsync([
  require('@/assets/images/i-like-food-dark-blue-260.png'),
  require('@/assets/images/i-like-food-light-260.png')
])


export default function RootLayout() {
  const insets = useSafeAreaInsets()
  const colorScheme = useColorScheme()
  const theme = colorScheme === 'light' ? Colors.light : Colors.dark
  const isAppLoading = useAppState((state) => state.isAppLoading)
  // const dictionaryTerms = useAppState((state) => state.dictionaryTerms)
  // const setDictionaryTerms = useAppState((state) => state.setDictionaryTerms)
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  const ErrorFallback = ({error}: {error: Error}) => {
    console.error('App crashed:', error)
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Something went wrong:</Text>
        <Text>{error.message}</Text>
      </View>
    )
  }

  useEffect(() => {
    // Initialize dictionary and other startup tasks
    const initializeApp = async () => {
      try {
        await appInitializationService.initialize()
        console.log('App initialization complete')
      } catch (error) {
        console.error('App initialization failed:', error)
      }
    }

    initializeApp()
  }, [])

  if (!loaded || isAppLoading) {
    // Show loading while fonts load or app initializes
    return null
  }

  

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
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
    </ErrorBoundary>
  )
}

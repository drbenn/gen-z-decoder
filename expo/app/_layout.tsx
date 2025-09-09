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
  const colorScheme = useColorScheme()
  const isAppLoading = useAppState((state) => state.isAppLoading)
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  useEffect(() => {
    // your initialization code
  }, [])

  if (!loaded || isAppLoading) {
    return null
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  )
}

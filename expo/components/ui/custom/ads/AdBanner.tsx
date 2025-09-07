import AD_UNIT_IDS from '@/constants/AdMob';
import APP_CONSTANTS from '@/constants/appConstants';
import { useAppState } from '@/state/useAppState';
import React, { useMemo } from 'react';
import { Platform, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Conditional import to avoid errors in development
let BannerAd: any
let BannerAdSize: any

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const GoogleMobileAds = require('react-native-google-mobile-ads')
  BannerAd = GoogleMobileAds.BannerAd
  BannerAdSize = GoogleMobileAds.BannerAdSize
} catch (error) {
  // Development mode - AdMob not available
  // logger.log('ad banner GoogleMobileAds init error: ', error)
}

interface AdBannerProps {
  size?: any
  style?: ViewStyle
  marginVertical?: number
  position?: 'inline' | 'fixed-bottom'
  respectTabBar?: boolean
}

const AdBanner: React.FC<AdBannerProps> = ({
  size,
  style = {},
  marginVertical = 10,
  position = 'inline',
  respectTabBar = false
}) => {
  const insets = useSafeAreaInsets()
  
  // Get state values from the correct app state
  const isPremiumMember = useAppState((state) => state.isPremiumMember)
  const translationCount = useAppState((state) => state.translationCount)
  const lastInterstitialAt = useAppState((state) => state.lastInterstitialAt)

  // Calculate banner visibility with useMemo to prevent unnecessary re-renders
  const shouldShowBanner = useMemo(() => {
    // If user is premium, NEVER show banner
    if (isPremiumMember) {
      return false
    }
    
    // Always show banner for free users
    return true
  }, [isPremiumMember]) // Only recalculate when premium status changes

  // Early return if premium user
  if (!shouldShowBanner) {
    return null
  }

  // Calculate smart spacing based on position
  const getSmartSpacing = () => {
    if (position === 'fixed-bottom') {
      const baseBottomPadding = Math.max(insets.bottom, 10)
      
      if (respectTabBar) {
        const tabBarHeight = Platform.OS === 'ios' ? 90 : 70
        return baseBottomPadding + tabBarHeight + 10
      }
      
      return baseBottomPadding
    }
    
    return marginVertical
  }

  // Container styles
  const getContainerStyles = () => {
    const smartSpacing = getSmartSpacing()
    
    if (position === 'fixed-bottom') {
      return [
        styles.container,
        styles.fixedBottom,
        {
          paddingBottom: smartSpacing,
          paddingHorizontal: 10,
          backgroundColor: 'transparent',
        },
        style
      ]
    }
    
    return [
      styles.container,
      { marginVertical: smartSpacing },
      style
    ]
  }

  // Development placeholder
  if (!BannerAd || !BannerAdSize) {
    if (APP_CONSTANTS.DEBUG_TOOLS_ACTIVE) {
      return (
        <View style={getContainerStyles()}>
          <View style={styles.placeholderAd}>
            <Text style={styles.placeholderText}>
              BANNER AD - FREE USER
            </Text>
            <Text style={[styles.placeholderText, { fontSize: 10, marginTop: 4 }]}>
              Translations: {translationCount} | Last Ad: {lastInterstitialAt}
            </Text>
            <Text style={[styles.placeholderText, { fontSize: 8, color: '#ffd61fff' }]}>
              DEV MODE BANNER
            </Text>
          </View>
        </View>
      )
    }
    return null
  }

  // Real banner ad for free users
  return (
    <View style={getContainerStyles()}>
      <BannerAd
        unitId={AD_UNIT_IDS.banner}
        size={size || BannerAdSize.ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => {
          // Ad loaded successfully
        }}
        onAdFailedToLoad={(error: any) => {
          console.log('Banner ad failed to load:', error)
        }}
        onAdOpened={() => {
          // Ad opened
        }}
        onAdClosed={() => {
          // Ad closed
        }}
        onAdClicked={() => {
          // Ad clicked - revenue!
        }}
        onAdImpression={() => {
          // Ad impression - revenue!
        }}
      />
      
      {/* Debug info in development */}
      {APP_CONSTANTS.DEBUG_TOOLS_ACTIVE && (
        <View style={styles.debugInfo}>
          <Text style={styles.debugText}>
            FREE USER | Translations: {translationCount}
          </Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fixedBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 1000,
  },
  placeholderAd: {
    height: 50,
    backgroundColor: '#3ec591ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 0,
    width: '100%',
    borderWidth: 2,
    borderColor: '#2b2b2bff',
    paddingVertical: 8,
  },
  placeholderText: {
    color: '#ffffffff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  debugInfo: {
    position: 'absolute',
    top: -20,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 0,
  },
  debugText: {
    color: '#fefffeff',
    fontSize: 8,
    fontWeight: 'bold',
  },
})

export default AdBanner
import adInterstitialService from '@/services/ad/AdInterstitialService'
import { useAppState } from '@/state/useAppState'
import { TranslationHistoryItem, TranslationMode } from '@/types/translate.types'
import { router, useFocusEffect } from 'expo-router'
import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, TextInput, Pressable, useColorScheme, ImageBackground, ScrollView } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { HttpClient } from '@/services/api/httpClient'
import uuid from 'react-native-uuid'
import { Colors } from '@/constants/Colors'
import LottieAnimation from '@/components/ui/custom/LottieAnimation'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import { Ionicons } from '@expo/vector-icons'
import NetInfo from '@react-native-community/netinfo'
import logger from '@/utils/logger'

const MIN_TEXT_LENGTH = 5
const MAX_TEXT_LENGTH = 200

export default function TranslateInputScreen() {
  const colorScheme = useColorScheme()
  const theme = colorScheme === 'light' ? Colors.light : Colors.dark

  const insets = useSafeAreaInsets()
  const [mode, setMode] = useState<TranslationMode>(TranslationMode.ENGLISH_TO_GENZ)
  const [inputText, setInputText] = useState('')
  const [isConnected, setIsConnected] = useState(true)

  // State value - regular selector
  const autoPlayAudio = useAppState((state) => state.autoPlayAudio)
  
  // Action functions with individual selectors (prevents unnecessary re-renders)
  const setAutoPlayAudio = useAppState((state) => state.setAutoPlayAudio)
  const incrementTranslationCount = useAppState((state) => state.incrementTranslationCount)
  const setTranslating = useAppState((state) => state.setTranslating)
  const checkInterstitialReady = useAppState((state) => state.checkInterstitialReady)
  const markInterstitialShown = useAppState((state) => state.markInterstitialShown)
  const setCurrentTranslation = useAppState((state) => state.setCurrentTranslation)
  const updateUsageInfo = useAppState((state) => state.updateUsageInfo)
  const setTranslateError = useAppState((state) => state.setTranslateError)
  const addToHistory = useAppState((state) => state.addToHistory)
  const usageInfo = useAppState((state) => state.usageInfo)
  const isPremiumMember = useAppState.getState().isPremiumMember

  // Clear previous translation when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Clear any previous translation and errors
      setCurrentTranslation(null)
      setTranslateError(null)
      
      logger.log('Input screen focused - cleared previous translation')
    }, [setCurrentTranslation, setTranslateError])
  )

  // Network connectivity monitoring
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false)
      logger.log('Network connectivity changed:', {
        isConnected: state.isConnected,
        type: state.type,
        isInternetReachable: state.isInternetReachable
      })
    })

    // Check initial connectivity
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected ?? false)
    })

    return () => unsubscribe()
  }, [])

  // Check if translation is allowed
  const canTranslate = 
    inputText.trim().length >= MIN_TEXT_LENGTH && 
    inputText.trim().length <= MAX_TEXT_LENGTH && 
    usageInfo.remainingTranslations > 0 &&
    isConnected

  const handleTranslate = async () => {
    // Early return if text is too short or no internet
    if (!canTranslate) {
      return
    }

    // 1. Handle ad first (blocking) - ONLY for free users
    incrementTranslationCount()
    
    if (!isPremiumMember) {
      const shouldShowAd = checkInterstitialReady()
      if (shouldShowAd) {
        try {
          logger.log('Showing interstitial ad for free user...')
          const adShown = await adInterstitialService.showAd()
          
          if (adShown) {
            markInterstitialShown()
            logger.log('Interstitial ad completed, proceeding with translation')
          } else {
            logger.log('Ad failed to show, proceeding anyway')
          }

        } catch (error) {
          logger.log('Ad service error:', error)
        }
      }
    } else {
      logger.log('Premium user - skipping ads')
    }

    logger.log('Translate pressed:', { mode, inputText, autoPlayAudio, isPremiumMember })
    
    // 2. Clear input text immediately
    const textToTranslate = inputText.trim()
    setInputText('')
    
    // 3. Start loading state & navigate
    setTranslating(true)
    router.push('/(tabs)/translate/result')
    
    // 4. API call with error handling
    try {      
      const response = await HttpClient.translateText({ text: textToTranslate, mode })
      console.log('api response: ', response);

      // const response = {
      //   translatedText: 'YOLO',
      //   originalText: 'BOLO',
      //   mode: TranslationMode.ENGLISH_TO_GENZ,
      //   usageInfo: {
      //     translationsUsedToday: 1,
      //     dailyLimit: 10,
      //     remainingTranslations: 9,
      //     isPremium: false
      //   }
      // }
      
      // 5. Update translation, history and usage from successful response
      const translationHistoryItem: TranslationHistoryItem = {
        id: uuid.v4() as string,
        originalText: response.originalText,
        translatedText: response.translatedText,
        mode: response.mode,
        timestamp: new Date().toISOString(),
        isFavorite: false
      }     

      addToHistory(translationHistoryItem)
      setCurrentTranslation(response)
      updateUsageInfo(response.usageInfo)

    } catch (error: unknown | any) {
      logger.error('Error in handleTranslate:', error)
      setTranslateError(error.message)
    } finally {
      // 6. Stop loading
      setTranslating(false)
    }
  }
    
  const getPlaceholder = () => {
    if (!isConnected) {
      return 'Internet connection required for translation...'
    }
    
    return mode === TranslationMode.GENZ_TO_ENGLISH 
      ? 'Enter Gen Z text to translate into English...' 
      : 'Enter English text to translate to Gen Z...'
  }

  return (
    <ScrollView contentContainerStyle={{
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      flexGrow: 1,
      paddingHorizontal: theme.paddingHorizontal,
      paddingTop: insets.top,
      paddingBottom: insets.bottom * 3.5,
    }}>

        {/* Background Pattern */}
        <ImageBackground 
          source={colorScheme === 'dark' 
            ? require('@/assets/images/i-like-food-light-260.png') 
            : require('@/assets/images/i-like-food-light-260.png')
          }
          style={{
            position: 'absolute',
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            zIndex: -1
          }}
          resizeMode="repeat"
          fadeDuration={0}
        />
        
        {/* Bold Translate to Text */}
        {colorScheme === 'light' && (
          <View style={{ position: 'relative', alignItems: 'center' }}>
            {/* Base layer - Red (bottom) */}
            <Text style={{
              fontSize: 50,
              fontWeight: 'bold',
              textAlign: 'center',
              color: theme.primary,
              position: 'absolute',
              transform: [{ translateX: -2 }, { translateY: 2 }],
            }}>
              TRANSLATE TO
            </Text>
            
            {/* Middle layer - Blue */}
            <Text style={{
              fontSize: 50,
              fontWeight: 'bold',
              textAlign: 'center',
              color: theme.surface,
              position: 'absolute',
              transform: [{ translateX: 2 }, { translateY: -1 }],
            }}>
              TRANSLATE TO
            </Text>
            
            {/* Top layer - Green (main text) */}
            <Text style={{
              fontSize: 50,
              fontWeight: 'bold',
              textAlign: 'center',
              color: theme.primaryTint,
              position: 'relative',
            }}>
              TRANSLATE TO
            </Text>
          </View>
        )}

                {/* Bold Translate to Text */}
        {colorScheme === 'dark' && (
          <View style={{ position: 'relative', alignItems: 'center' }}>
            {/* Base layer - Red (bottom) */}
            <Text style={{
              fontSize: 50,
              fontWeight: 'bold',
              textAlign: 'center',
              color: theme.surface,
              position: 'absolute',
              transform: [{ translateX: -2 }, { translateY: 2 }],
            }}>
              TRANSLATE TO
            </Text>
            
            {/* Middle layer - Blue */}
            <Text style={{
              fontSize: 50,
              fontWeight: 'bold',
              textAlign: 'center',
              color: theme.borderColor,
              position: 'absolute',
              transform: [{ translateX: 2 }, { translateY: -1 }],
            }}>
              TRANSLATE TO
            </Text>
            
            {/* Top layer - Green (main text) */}
            <Text style={{
              fontSize: 50,
              fontWeight: 'bold',
              textAlign: 'center',
              color: theme.primary,
              position: 'relative',
            }}>
              TRANSLATE TO
            </Text>
          </View>
        )}

        {/* Mode Toggle */}
        <View style={{
          flexDirection: 'row',
          marginVertical: theme.verticalMargin,
          borderRadius: theme.borderRadius,
          backgroundColor: theme.surface,
          borderColor: theme.borderColor,
          borderWidth: 1,
          padding: 0,
          opacity: !isConnected ? 0.5 : 1,
        }}>
          <Pressable 
            style={({ pressed }) => ({
              flex: 1,
              padding: 8,
              alignItems: 'center',
              borderTopStartRadius: theme.borderRadius,
              borderBottomStartRadius: theme.borderRadius,
              backgroundColor: pressed 
                ? theme.primaryTint 
                : mode === TranslationMode.ENGLISH_TO_GENZ 
                  ? theme.primary 
                  : 'transparent',
            })}
            onPress={() => setMode(TranslationMode.ENGLISH_TO_GENZ)}
            disabled={!isConnected}
          >
            <Text style={{
              color: mode === TranslationMode.ENGLISH_TO_GENZ ? '#fff' : theme.text,
              fontWeight: '500',
              fontSize: 20
            }}>Gen Z</Text>
          </Pressable>
          <Pressable 
            style={({ pressed }) => ({
              flex: 1,
              padding: 8,
              borderTopEndRadius: theme.borderRadius,
              borderBottomEndRadius: theme.borderRadius,
              alignItems: 'center',
              backgroundColor: pressed 
                ? theme.primaryTint 
                : mode === TranslationMode.GENZ_TO_ENGLISH 
                  ? theme.primary 
                  : 'transparent',
            })}
            onPress={() => setMode(TranslationMode.GENZ_TO_ENGLISH)}
            disabled={!isConnected}
          >
            <Text style={{
              color: mode === TranslationMode.GENZ_TO_ENGLISH ? '#fff' : theme.text,
              fontWeight: '500',
              fontSize: 20
            }}>English</Text>
          </Pressable>
        </View>

        {/* Lottie Animations */}
        <View style={{
          minHeight: 200,
          minWidth: 200,
          justifyContent: 'center',
          alignItems: 'center',
          opacity: !isConnected ? 0.5 : 1,
        }}>
          {mode === TranslationMode.GENZ_TO_ENGLISH ? (
            <Animated.View
              key="welcome"
              entering={FadeIn.duration(300)}
              exiting={FadeOut.duration(300)}
              style={{
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <LottieAnimation
                animation="welcome_screen"
                width={225}
                height={225}
                loop={true}
              />
            </Animated.View>
          ) : (
            <Animated.View
              key="running"
              entering={FadeIn.duration(300)}
              exiting={FadeOut.duration(300)}
              style={{
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <LottieAnimation
                animation="man_running"
                width={225}
                height={225}
                loop={true}
                flipped={true}
              />
            </Animated.View>
          )}
        </View>

        {/* Text Input */}
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: !isConnected 
              ? theme.textMuted 
              : !canTranslate && inputText.length > 0 
                ? theme.error 
                : theme.borderColor,
            backgroundColor: theme.surface,
            color: !isConnected ? theme.textMuted : theme.text,
            padding: 15,
            minHeight: 140,
            marginTop: 0,
            marginBottom: 0,
            borderRadius: theme.borderRadius,
            fontSize: 16,
            textAlignVertical: 'top',
            opacity: !isConnected ? 0.5 : 1,
          }}
          placeholder={getPlaceholder()}
          placeholderTextColor={theme.textMuted}
          value={inputText}
          onChangeText={setInputText}
          multiline
          numberOfLines={6}
          editable={isConnected}
        />

        {/* Character count / validation message - Right below text input */}
        <View style={{
          alignItems: 'flex-end',
          justifyContent: 'flex-start',
          height: 18,
          marginBottom: 0,
          marginVertical: 3,
          marginRight: 5,
          backgroundColor: 'transparent'
        }}>
          {inputText.length > 0 && isConnected && (
            <Text style={{
              fontSize: 12,
              color: canTranslate ? theme.textMuted : theme.error,
            }}>
              {inputText.trim().length < MIN_TEXT_LENGTH && inputText.trim().length !== 0 && (
                <Text>
                  {MIN_TEXT_LENGTH} characters minimum
                </Text>
              )}
              {inputText.trim().length > MAX_TEXT_LENGTH && inputText.trim().length !== 0 && (
                <Text>
                  {MAX_TEXT_LENGTH} characters maximum
                </Text>
              )}
            </Text>
          )}
        </View>

        {/* Auto Play Speech Toggle - Settings page style */}
        <Pressable
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 4,
            paddingHorizontal: 10,
            marginTop: 8,
            backgroundColor: pressed ? theme.primaryTint : theme.surface,
            borderRadius: theme.borderRadius,
            borderColor: theme.primary,
            borderWidth: 1,
            opacity: !isConnected ? 0.5 : 1,
          })}
          onPress={() => setAutoPlayAudio(!autoPlayAudio)}
          disabled={!isConnected}
        >
          <View style={{
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16,
          }}>
            <Ionicons name="volume-high-outline" size={24} color={theme.textMuted} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 17,
              fontWeight: '400',
              marginBottom: 2,
              color: theme.text,
            }}>Auto Play Speech</Text>
            <Text style={{
              fontSize: 12,
              color: theme.textMuted,
            }}>Automatically read translations aloud</Text>
          </View>
          
          {/* Status Box */}
          <View style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: theme.borderRadius,
            borderWidth: 1,
            width: 50,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: theme.primary,
            backgroundColor: autoPlayAudio ? theme.primary : 'transparent',
          }}>
            <Text style={{
              fontSize: 12,
              fontWeight: '500',
              color: autoPlayAudio ? '#FFFFFF' : theme.primary,
            }}>
              {autoPlayAudio ? 'ON' : 'OFF'}
            </Text>
          </View>
        </Pressable>

        {/* Network Status Warning */}
        {!isConnected && (
          <View style={{
            backgroundColor: theme.error,
            paddingHorizontal: 18,
            paddingVertical: 12,
            borderRadius: theme.borderRadius,
            marginTop: theme.verticalMargin,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <Ionicons name="wifi-outline" size={20} color="#fff" />
            <Text style={{
              color: '#fff',
              fontSize: 14,
              fontWeight: '500',
              marginLeft: 16,
            }}>
              No internet connection - translation requires internet access
            </Text>
          </View>
        )}

        {/* Daily Translations Remaining - Above translate button */}
        <View style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: theme.verticalMargin / 1.5,
          marginBottom: 5
        }}>
          <Text style={{
            fontSize: 12,
            color: theme.text,
            textAlign: 'center',
            opacity: !isConnected ? 0.5 : 1,
          }}>
            Daily Translations Remaining ({usageInfo.isPremium ? 'premium mode' : 'free mode'}): {usageInfo.remainingTranslations}/{usageInfo.dailyLimit}
          </Text>
        </View>

        {/* Translate Button */}
        <Pressable 
          style={({ pressed }) => ({
            backgroundColor: !canTranslate 
              ? theme.textMuted 
              : pressed 
                ? theme.primaryTint 
                : theme.primary,
            padding: 12,
            alignItems: 'center',
            borderRadius: theme.borderRadius,
            marginTop: 0,
            opacity: !canTranslate ? 0.5 : 1,
          })}
          onPress={handleTranslate}
          disabled={!canTranslate}
        >
          <Text style={{
            color: !canTranslate ? theme.textMuted : '#fff',
            fontSize: 20,
            fontWeight: 'bold',
            letterSpacing: 1,
          }}>
            {!isConnected ? 'NO INTERNET CONNECTION' : 'TRANSLATE'}
          </Text>
        </Pressable>

    </ScrollView>
  )
}
import adInterstitialService from '@/services/ad/AdInterstitialService'
import { useAppState } from '@/state/useAppState'
import { TranslationHistoryItem, TranslationMode } from '@/types/translate.types'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { View, Text, TextInput, Pressable, useColorScheme } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { HttpClient } from '@/services/api/httpClient'
import uuid from 'react-native-uuid'
import { Colors } from '@/constants/Colors'
import LottieAnimation from '@/components/ui/custom/LottieAnimation'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'
import AnimatedTabWrapper, { TabAnimationPresets } from '@/components/ui/custom/AnimatedTabWrapper'


export default function TranslateInputScreen() {
  const colorScheme = useColorScheme()
  const theme = colorScheme === 'light' ? Colors.light : Colors.dark

  const insets = useSafeAreaInsets()
  const [mode, setMode] = useState<TranslationMode>(TranslationMode.ENGLISH_TO_GENZ)
  const [inputText, setInputText] = useState('')

  // ✅ GOOD: Single state value - regular selector
  const autoPlayAudio = useAppState((state) => state.autoPlayAudio)
  
  // ✅ GOOD: Action functions with individual selectors (prevents unnecessary re-renders)
  const setAutoPlayAudio = useAppState((state) => state.setAutoPlayAudio)
  const incrementTranslationCount = useAppState((state) => state.incrementTranslationCount)
  const setTranslating = useAppState((state) => state.setTranslating)
  const checkInterstitialReady = useAppState((state) => state.checkInterstitialReady)
  const markInterstitialShown = useAppState((state) => state.markInterstitialShown)
  const setCurrentTranslation = useAppState((state) => state.setCurrentTranslation)
  const updateUsageInfo = useAppState((state) => state.updateUsageInfo)
  const setTranslateError = useAppState((state) => state.setTranslateError)
  const addToHistory = useAppState((state) => state.addToHistory)

  const handleTranslate = async () => {
    // 1. Handle ad first (blocking)
    incrementTranslationCount()
    const shouldShowAd = checkInterstitialReady()
    if (shouldShowAd) {
      try {
        const adShown = await adInterstitialService.showAd()
        
        if (adShown) {
          markInterstitialShown()
        }

      } catch (error) {
        logger.log('❌ Ad service error:', error)
      }
    }

    logger.log('Translate pressed:', { mode, inputText, autoPlayAudio })
    // 2. Start loading state & navigate
    setTranslating(true)
    router.push('/(tabs)/translate/result')
    
    // 3. API call with error handling
    try {      
      const response = await HttpClient.translateText({ text: inputText, mode })

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

      // 4. Update translation, history and usage from successful response
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
      // 5. Stop loading
      setTranslating(false)
    }
  }
    
  const getPlaceholder = () => {
    return mode === TranslationMode.GENZ_TO_ENGLISH 
      ? 'Enter Gen Z text to translate into English...' 
      : 'Enter English text to translate to Gen Z...'
  }

  return (
    <View style={{
      flex: 0,
      alignItems: 'stretch',
      paddingHorizontal: theme.paddingHorizontal,
      paddingTop: insets.top + theme.verticalMargin,
      paddingBottom: insets.bottom,
      backgroundColor: theme.background,
    }}>
      <AnimatedTabWrapper {...TabAnimationPresets.veniceBeachFade}>
        {/* Bold Translate to Text */}
        <View>
          <Text style={{
            fontSize: 50,
            fontWeight: 'bold',
            textAlign:'center',
            color: theme.text,
            textShadowColor: theme.primary,
            textShadowOffset: { width: -1, height: -1 },
            textShadowRadius: 0,
            // Add multiple shadows for better outline effect
          }}>
            Translate to
          </Text>
        </View>

        {/* Mode Toggle */}
        <View style={{
          flexDirection: 'row',
          marginBottom: theme.verticalMargin,
          borderRadius: theme.borderRadius,
          backgroundColor: theme.surface,
          borderColor: theme.borderColor,
          borderWidth: 1,
          padding: 0,
        }}>
          <Pressable 
            style={({ pressed }) => ({
              flex: 1,
              padding: 8,
              alignItems: 'center',

              backgroundColor: pressed 
                ? theme.primaryTint 
                : mode === TranslationMode.ENGLISH_TO_GENZ 
                  ? theme.primary 
                  : 'transparent',
            })}
            onPress={() => setMode(TranslationMode.ENGLISH_TO_GENZ)}
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
              alignItems: 'center',
              backgroundColor: pressed 
                ? theme.primaryTint 
                : mode === TranslationMode.GENZ_TO_ENGLISH 
                  ? theme.primary 
                  : 'transparent',
            })}
            onPress={() => setMode(TranslationMode.GENZ_TO_ENGLISH)}
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
          minHeight: 225,
          minWidth: 225,
          justifyContent: 'center',
          alignItems: 'center'
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
            borderColor: theme.borderColor,
            backgroundColor: theme.surface,
            color: theme.text,
            padding: 15,
            minHeight: 140,
            marginBottom: theme.verticalMargin,
            borderRadius: theme.borderRadius,
            fontSize: 16,
            textAlignVertical: 'top',
          }}
          placeholder={getPlaceholder()}
          placeholderTextColor={theme.textMuted}
          value={inputText}
          onChangeText={setInputText}
          multiline
          numberOfLines={6}
        />

        {/* Auto-play Audio Toggle */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: theme.verticalMargin,
        }}>
          <Text style={{
            color: theme.text,
            fontSize: 16,
          }}>Auto-play audio:</Text>
          <Pressable 
            style={({ pressed }) => ({
              marginLeft: 10,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderWidth: 1,
              borderRadius: theme.borderRadius,
              borderColor: autoPlayAudio ? theme.primary : theme.borderColor,
              backgroundColor: pressed 
                ? theme.primaryTint 
                : autoPlayAudio 
                  ? theme.primary 
                  : 'transparent',
            })}
            onPress={() => setAutoPlayAudio(!autoPlayAudio)}
          >
            <Text style={{
              color: autoPlayAudio ? '#fff' : theme.text,
              fontWeight: '500',
            }}>{autoPlayAudio ? 'ON' : 'OFF'}</Text>
          </Pressable>
        </View>

        {/* Translate Button */}
        <Pressable 
          style={({ pressed }) => ({
            backgroundColor: pressed ? theme.primaryTint : theme.primary,
            padding: 12,
            alignItems: 'center',
            borderRadius: theme.borderRadius,
            marginTop: theme.verticalMargin,
          })}
          onPress={handleTranslate}
        >
          <Text style={{
            color: '#fff',
            fontSize: 20,
            fontWeight: 'bold',
            letterSpacing: 1,
          }}>TRANSLATE</Text>
        </Pressable>
      </AnimatedTabWrapper>

    </View>
  )
}
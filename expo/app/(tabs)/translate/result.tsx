import { Text, Pressable, View, Share, useColorScheme, ImageBackground, ScrollView } from 'react-native'
import * as Speech from 'expo-speech'
import { useAppState } from '@/state/useAppState'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { router, useFocusEffect } from 'expo-router'
import React, { useCallback, useState } from 'react'
import APP_CONSTANTS from '@/constants/appConstants'
import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import TypewriterResult from '@/components/ui/custom/translate/TypewriterResult'

type TranslateLoadState = 'loading' | 'success' | 'error' | 'empty'

export default function TranslateResultScreen() {
  const colorScheme = useColorScheme()
  const theme = colorScheme === 'light' ? Colors.light : Colors.dark

  const insets = useSafeAreaInsets()
  const [translateLoadState, setTranslateLoadState] = useState<TranslateLoadState>('loading')

  // State values that trigger re-renders
  const isTranslating = useAppState((state) => state.isTranslating)
  const currentTranslation = useAppState((state) => state.currentTranslation)
  const autoPlayAudio = useAppState((state) => state.autoPlayAudio)
  const ttsEnabled = useAppState((state) => state.ttsEnabled)
  const translateError = useAppState((state) => state.translateError)
  const setAutoPlayAudio = useAppState((state) => state.setAutoPlayAudio) 
  const usageInfo = useAppState((state) => state.usageInfo) 

  // Listen for when screen comes into focus (after navigation or ad dismissal)
  useFocusEffect(
    useCallback(() => {
      // Always start with loading state
      setTranslateLoadState('loading')
      
      // After minimum time, determine final state
      const timer = setTimeout(() => {
        if (translateError) {
          setTranslateLoadState('error')
        } else if (currentTranslation) {
          setTranslateLoadState('success')
          autoplayAudio()
        } else {
          setTranslateLoadState('empty')
        }
      }, 1500) // 1.5 seconds minimum loading for all scenarios
      
      return () => clearTimeout(timer)
    }, [translateError, currentTranslation])
  )
  
  // Action functions (stable references)
  const handleTranslateAgain = () => {
    router.back()
  }

  const handleShare = async () => {
    if (currentTranslation?.translatedText) {
      try {
        await Share.share({
          title: `${APP_CONSTANTS.APP_NAME}`,
          message: `Check out this translation: ${currentTranslation.translatedText} \n\n
          ${APP_CONSTANTS.APP_NAME} available on mobile! ${APP_CONSTANTS.APP_WEBSITE}`,
        })
      } catch (error) {
        logger.error('Error sharing translation:', error)
      }
    }
  }

  const autoplayAudio = () => {
    if (autoPlayAudio) {
      setTimeout(() => {
        handleTTS()
      }, 2000) // Delay to let typewriter effect start
    }
  }

  const handleTTS = async () => {
    const isSpeaking = await Speech.isSpeakingAsync()

    if (isSpeaking) return

    const availableVoices = await Speech.getAvailableVoicesAsync()
    // const englishEnhancedVoices = availableVoices.filter((voice: any) => voice.language.includes('en-') && voice.quality === 'Enhanced')
    //   .map((voice: any) => voice.identifier)
    // logger.log('englishEnhancedVoices: ', englishEnhancedVoices)
    
    Speech.speak(currentTranslation?.translatedText ? currentTranslation.translatedText : 'Thats bitch made bruuh', {
      language: 'en-US',
      pitch: 1.4,
      rate: 0.75,
      // voice: 'en-gb-x-rjs-local'   // if device doesnt have specific voice should fall back to its default, however, better not to rely on fallback and use default voice.
    })
  }

  const stopTTS = async () => {
    await Speech.stop()
  }

  const handleToggleAutoPlay = () => {
    setAutoPlayAudio(!autoPlayAudio)
  }

  return (
    <ScrollView contentContainerStyle={{
      flex: 1,
      paddingHorizontal: theme.paddingHorizontal,
      paddingTop: insets.top + theme.verticalMargin,
      paddingBottom: insets.bottom,
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
      
      {/* Original Text Section */}
      <View style={{
        backgroundColor: theme.surface,
        borderRadius: theme.borderRadius,
        borderWidth: 1,
        borderColor: theme.borderColor,
        padding: 15,
        marginBottom: theme.verticalMargin
      }}>
        <Text style={{
          fontSize: 12,
          color: theme.textMuted,
          fontWeight: '500',
          marginBottom: 8,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}>Original Text</Text>
        <Text style={{
          fontSize: 16,
          color: theme.text,
          lineHeight: 22,
        }}>
          {currentTranslation?.originalText || "Sample original text here..."}
        </Text>
      </View>

      {/* Typewriter Translation Result Component */}
      <TypewriterResult 
        loadState={translateLoadState}
        translatedText={currentTranslation?.translatedText}
        errorMessage={translateError}
      />

      {/* Action Buttons Row */}
      <View style={{
        flexDirection: 'row',
        marginBottom: theme.verticalMargin,
        gap: 12,
      }}>
        {/* TTS Button */}
        <Pressable 
          style={({ pressed }) => ({
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: pressed ? theme.primaryTint : theme.surface,
            borderWidth: 1,
            borderColor: !ttsEnabled ? theme.borderColor : theme.primary,
            borderRadius: theme.borderRadius,
            paddingVertical: 12,
            paddingHorizontal: 16,
            opacity: !ttsEnabled ? 0.5 : 1,
          })}
          onPress={handleTTS}
          disabled={!ttsEnabled || isTranslating}
        >
          <Ionicons 
            name="volume-high-outline" 
            size={20} 
            color={!ttsEnabled ? theme.textMuted : theme.primary}
          />
          <Text style={{
            fontSize: 14,
            fontWeight: '500',
            color: !ttsEnabled ? theme.textMuted : theme.text,
            marginLeft: 8,
          }}>Play Audio</Text>
        </Pressable>


        {/* TTS Button */}
        <Pressable 
          style={({ pressed }) => ({
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: pressed ? theme.primaryTint : theme.surface,
            borderWidth: 1,
            borderColor: !ttsEnabled ? theme.borderColor : theme.primary,
            borderRadius: theme.borderRadius,
            paddingVertical: 12,
            paddingHorizontal: 16,
            opacity: !ttsEnabled ? 0.5 : 1,
          })}
          onPress={stopTTS}
          disabled={!ttsEnabled || isTranslating}
        >
          <Ionicons 
            name="volume-off-outline" 
            size={20} 
            color={!ttsEnabled ? theme.textMuted : theme.primary}
          />
          <Text style={{
            fontSize: 14,
            fontWeight: '500',
            color: !ttsEnabled ? theme.textMuted : theme.text,
            marginLeft: 8,
          }}>Stop Audio</Text>
        </Pressable>
      </View>

      {/* Action Buttons Row 2 */}
      <View style={{
        flexDirection: 'row',
        marginBottom: 0,
        gap: 12,
      }}>
        {/* Share Button */}
        {currentTranslation?.translatedText && (
          <Pressable 
            style={({ pressed }) => ({
              paddingVertical: 14,
              paddingHorizontal: 20,
              marginBottom: theme.verticalMargin,
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: pressed ? theme.primaryTint : theme.surface,
              borderWidth: 1,
              borderColor: theme.borderColor,
              borderRadius: theme.borderRadius,
            })}
            onPress={handleShare}
            disabled={isTranslating}
          >
            <Ionicons name="share-outline" size={20} color={theme.text} />
            <Text style={{
              fontSize: 14,
              fontWeight: '500',
              color: theme.text,
              marginLeft: 8,
            }}>Share</Text>
          </Pressable>
        )}

          {/* Auto Play Speech Toggle */}
          <Pressable
            style={({ pressed }) => ({
              paddingHorizontal: 20,
              marginBottom: theme.verticalMargin,
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: autoPlayAudio ? theme.primary : theme.surface,
              borderWidth: 1,
              borderColor: autoPlayAudio ? theme.borderColor : theme.borderColor,
              borderRadius: theme.borderRadius,
            })}
            onPress={handleToggleAutoPlay}
          >
            <View style={{
              flex: 0,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 0,
            }}>
              <Ionicons name="volume-high-outline" size={20} color={autoPlayAudio ? theme.background : theme.text} />
            </View>
            <View>
              <Text style={{
                fontSize: 14,
                fontWeight: '500',
                color: autoPlayAudio ? theme.background : theme.text,
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 6,
                marginTop: 14
              }}>Auto Play</Text>
            </View>
          </Pressable>
      </View>

      {/* remaining count for day */}
      <View style={{
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 0,
        marginBottom: 5,

      }}>
        <Text style={{
          fontSize: 12,
          color: theme.text,
        }}>
          Daily Translations Remaining ({ usageInfo.isPremium ? 'premium mode' : 'free mode'}):  { usageInfo.remainingTranslations }/{ usageInfo.dailyLimit }
        </Text>
      </View>

      {/* Translate Again Button */}
      <Pressable 
        style={({ pressed }) => ({
          backgroundColor: pressed ? theme.primaryTint : theme.primary,
          paddingVertical: 15,
          paddingHorizontal: 20,
          alignItems: 'center',
          borderRadius: theme.borderRadius,
        })}
        onPress={handleTranslateAgain}
      >
        <Text style={{
          color: '#fff',
          fontSize: 18,
          fontWeight: 'bold',
          letterSpacing: 1,
        }}>TRANSLATE AGAIN</Text>
      </Pressable>

    </ScrollView>
  )
}
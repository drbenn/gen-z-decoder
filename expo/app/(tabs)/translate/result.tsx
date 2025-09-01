import { ScrollView, Text, Pressable, View, Share, useColorScheme, ImageBackground } from 'react-native'
import * as Speech from 'expo-speech'
import { useAppState } from '@/state/useAppState'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { router, useFocusEffect } from 'expo-router'
import React, { useCallback, useState } from 'react'
import APP_CONSTANTS from '@/constants/appConstants'
import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'

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

  const clearAllHistory = useAppState((state) => state.clearAllHistory)

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
      }, 1200)
    }
  }

  const handleTTS = async () => {
    const isSpeaking = await Speech.isSpeakingAsync()

    if (isSpeaking) return

    const availableVoices = await Speech.getAvailableVoicesAsync()
    const englishEnhancedVoices = availableVoices.filter((voice: any) => voice.language.includes('en-') && voice.quality === 'Enhanced')
      .map((voice: any) => voice.identifier)
    logger.log('englishEnhancedVoices: ', englishEnhancedVoices)
    
    Speech.speak(currentTranslation?.translatedText ? currentTranslation.translatedText : 'Thats bitch made bruuh', {
      language: 'en-US',
      pitch: 1.4,
      rate: 0.75,
      voice: 'en-gb-x-rjs-local'
    })
  }

  return (
    <View style={{
      flex: 1,
      paddingHorizontal: theme.paddingHorizontal,
      paddingTop: insets.top + theme.verticalMargin,
      paddingBottom: insets.bottom,
    }}>
      {/* Background Pattern */}
      <ImageBackground 
        source={colorScheme === 'dark' 
          ? require('@/assets/images/i-like-food-dark-blue-260.png') 
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
        marginBottom: theme.verticalMargin,
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

      {/* Main Translation Result */}
      <View style={{
        flex: 1,
        backgroundColor: theme.surface,
        borderRadius: theme.borderRadius,
        borderWidth: 1,
        borderColor: theme.borderColor,
        marginBottom: theme.verticalMargin,
        overflow: 'hidden',
      }}>
        <View style={{
          backgroundColor: theme.primary,
          paddingVertical: 12,
          paddingHorizontal: 15,
        }}>
          <Text style={{
            fontSize: 14,
            color: '#fff',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}>Translation Result</Text>
        </View>

        {translateLoadState === 'loading' && (
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}>
            <Text style={{
              fontSize: 18,
              color: theme.text,
              fontWeight: '500',
            }}>Translating...</Text>
            <Text style={{
              fontSize: 14,
              color: theme.textMuted,
              marginTop: 8,
            }}>Working some magic</Text>
          </View>
        )}

        {translateLoadState === 'error' && (
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}>
            <Ionicons name="warning-outline" size={48} color={theme.error} />
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: theme.error,
              marginTop: 16,
              marginBottom: 8,
              textAlign: 'center',
            }}>Translation Failed</Text>
            <Text style={{
              fontSize: 14,
              color: theme.textMuted,
              textAlign: 'center',
              lineHeight: 20,
            }}>{translateError}</Text>
          </View>
        )}

        {translateLoadState === 'success' && (
          <ScrollView style={{
            flex: 1,
            padding: 15,
          }}>
            <Text style={{
              fontSize: 20,
              color: theme.text,
              lineHeight: 28,
              fontWeight: '400',
            }}>
              {currentTranslation?.translatedText}
            </Text>
          </ScrollView>
        )}

        {translateLoadState === 'empty' && (
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}>
            <Ionicons name="document-outline" size={48} color={theme.textMuted} />
            <Text style={{
              fontSize: 16,
              color: theme.textMuted,
              marginTop: 16,
              fontStyle: 'italic',
            }}>No translation available</Text>
          </View>
        )}
      </View>

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

        {/* Share Button */}
        {currentTranslation?.translatedText && (
          <Pressable 
            style={({ pressed }) => ({
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: pressed ? theme.primaryTint : theme.surface,
              borderWidth: 1,
              borderColor: theme.borderColor,
              borderRadius: theme.borderRadius,
              paddingVertical: 12,
              paddingHorizontal: 16,
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
      </View>

      {/* Debug Button - Remove in production */}
      {/* <Pressable onPress={clearAllHistory}>
        <Text style={{
          fontSize: 12,
          color: theme.textMuted,
          textAlign: 'center',
          marginBottom: theme.verticalMargin,
        }}>Clear History</Text>
      </Pressable> */}

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
    </View>
  )
}
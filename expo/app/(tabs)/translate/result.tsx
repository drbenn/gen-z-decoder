import { ScrollView, StyleSheet, Text, Pressable, View, Share } from 'react-native'
import * as Speech from 'expo-speech'
import { useAppState } from '@/state/useAppState'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { router, useFocusEffect } from 'expo-router'
import React, { useCallback, useState } from 'react'
import APP_CONSTANTS from '@/constants/appConstants'

type TranslateLoadState = 'loading' | 'success' | 'error' | 'empty'

export default function TranslateResultScreen() {
  const insets = useSafeAreaInsets()
  const [translateLoadState, setTranslateLoadState] = useState<TranslateLoadState>('loading')

  // ✅ State values that trigger re-renders
  const isTranslating = useAppState((state) => state.isTranslating)
  const currentTranslation = useAppState((state) => state.currentTranslation)
  const autoPlayAudio = useAppState((state) => state.autoPlayAudio)
  const ttsEnabled = useAppState((state) => state.ttsEnabled)
  const translateError = useAppState((state) => state.translateError)


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
  
  // ✅ Action functions (stable references)

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
    logger.log('englishEnhancedVoices: ', englishEnhancedVoices);
    
    Speech.speak(currentTranslation?.translatedText ? currentTranslation.translatedText : 'Thats bitch made bruuh', {
      language: 'en-US',
      pitch: 1.4,
      rate: 0.75,
      voice: 'en-gb-x-rjs-local'
    })
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      
      {/* Original Text (Small) */}
      <View style={styles.originalContainer}>
        <Text style={styles.originalLabel}>Original:</Text>
        <Text style={styles.originalText}>
          {currentTranslation?.originalText || "Sample original text here..."}
        </Text>
      </View>

      {/* Translated Text (Main Focus) */}
      <View style={styles.translatedContainer}>

        {translateLoadState === 'loading' && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Translating...</Text>
          </View>
        )}

        {translateLoadState === 'error' && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Translation Failed</Text>
            <Text style={styles.errorText}>{translateError}</Text>
          </View>
        )}

        {translateLoadState === 'success' && (
          <ScrollView style={styles.translatedScroll}>
            <Text style={styles.translatedText}>
              {currentTranslation?.translatedText}
            </Text>
          </ScrollView>
        )}

        {translateLoadState === 'empty' && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No translation available</Text>
          </View>
        )}

      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        
        {/* TTS Button */}
        <Pressable 
          style={[styles.actionButton, !ttsEnabled && styles.disabledButton]}
          onPress={handleTTS}
          disabled={!ttsEnabled || isTranslating}
        >
          <Text style={styles.actionButtonText}>
            🔊 Play Audio
          </Text>
        </Pressable>

        {/* Share Button */}

        { currentTranslation?.translatedText && 
          <Pressable 
            style={styles.actionButton}
            onPress={handleShare}
            disabled={isTranslating}
          >
            <Text style={styles.actionButtonText}>📤 Share</Text>
          </Pressable>
        }
      </View>

      {/* Translate Again Button */}
      <Pressable 
        style={styles.translateAgainButton}
        onPress={handleTranslateAgain}
      >
        <Text style={styles.translateAgainText}>TRANSLATE AGAIN</Text>
      </Pressable>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  originalContainer: {
    marginBottom: 20,
  },
  originalLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  originalText: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
  },
  translatedContainer: {
    flex: 1,
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  translatedScroll: {
    flex: 1,
  },
  translatedText: {
    fontSize: 18,
    color: '#000',
    lineHeight: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    fontStyle: 'italic',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#ddd',
    padding: 12,
    borderRadius: 5,
    flex: 0.4,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.5,
  },
  actionButtonText: {
    fontSize: 14,
  },
  translateAgainButton: {
    backgroundColor: '#666',
    padding: 15,
    alignItems: 'center',
  },
  translateAgainText: {
    color: '#fff',
    fontSize: 16,
  },
})

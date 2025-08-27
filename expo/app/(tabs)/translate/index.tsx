import adInterstitialService from '@/services/ad/AdInterstitialService'
import { useAppState } from '@/state/useAppState'
import { TranslationHistoryItem, TranslationMode } from '@/types/translate.types'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { HttpClient } from '@/services/api/httpClient'
import { v4 as uuidv4 } from 'uuid'


export default function TranslateInputScreen() {
  const insets = useSafeAreaInsets()
  const [mode, setMode] = useState<TranslationMode>(TranslationMode.GENZ_TO_ENGLISH)
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
      // const response = await HttpClient.translateText({ text: inputText, mode })
      const response = {
        translatedText: 'YOLO',
        originalText: 'BOLO',
        mode: TranslationMode.ENGLISH_TO_GENZ,
        usageInfo: {
          translationsUsedToday: 1,
          dailyLimit: 10,
          remainingTranslations: 9,
          isPremium: false
        }
      }

      logger.log('response: ', response)

      // 4. Update translation, history and usage from successful response
      const translationHistoryItem: TranslationHistoryItem = {
        id: uuidv4(),
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
      ? 'Enter Gen Z text to translate...' 
      : 'Enter English text to translate...'
  }

  return (
    <View style={[styles.container, {paddingTop: insets.top, paddingBottom: insets.bottom}]}>
      
      {/* Mode Toggle */}
      <View style={[styles.toggleContainer]}>
        <Pressable 
          style={[styles.toggleButton, mode === TranslationMode.GENZ_TO_ENGLISH && styles.activeToggle]}
          onPress={() => setMode(TranslationMode.GENZ_TO_ENGLISH)}
        >
          <Text>Gen Z → English</Text>
        </Pressable>
        <Pressable 
          style={[styles.toggleButton, mode === TranslationMode.ENGLISH_TO_GENZ && styles.activeToggle]}
          onPress={() => setMode(TranslationMode.ENGLISH_TO_GENZ)}
        >
          <Text>English → Gen Z</Text>
        </Pressable>
      </View>

      {/* Text Input */}
      <TextInput
        style={styles.textInput}
        placeholder={getPlaceholder()}
        value={inputText}
        onChangeText={setInputText}
        multiline
        numberOfLines={6}
      />

      {/* Auto-play Audio Toggle */}
      <View style={styles.audioToggleContainer}>
        <Text>Auto-play audio:</Text>
        <TouchableOpacity 
          style={[styles.audioToggle, autoPlayAudio && styles.audioToggleActive]}
          onPress={() => setAutoPlayAudio(!autoPlayAudio)}
        >
          <Text>{autoPlayAudio ? 'ON' : 'OFF'}</Text>
        </TouchableOpacity>
      </View>

      {/* Translate Button */}
      <TouchableOpacity 
        style={styles.translateButton}
        onPress={handleTranslate}
      >
        <Text style={styles.translateButtonText}>TRANSLATE</Text>
      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#ddd',
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: '#999',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    minHeight: 120,
    marginBottom: 20,
  },
  audioToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  audioToggle: {
    marginLeft: 10,
    padding: 8,
    backgroundColor: '#ddd',
    alignItems: 'center',
  },
  audioToggleActive: {
    backgroundColor: '#999',
  },
  translateButton: {
    backgroundColor: '#666',
    padding: 15,
    alignItems: 'center',
  },
  translateButtonText: {
    color: '#fff',
  },
})
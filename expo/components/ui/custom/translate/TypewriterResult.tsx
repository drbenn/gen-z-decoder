import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, useColorScheme } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'

type TranslateLoadState = 'loading' | 'success' | 'error' | 'empty'

interface TypewriterResultProps {
  loadState: TranslateLoadState
  translatedText?: string
  errorMessage?: string | null
}

export default function TypewriterResult({ loadState, translatedText, errorMessage }: TypewriterResultProps) {
  const colorScheme = useColorScheme()
  const theme = colorScheme === 'light' ? Colors.light : Colors.dark

  const [displayedText, setDisplayedText] = useState('')
  const [showCursor, setShowCursor] = useState(true)

  // Typewriter effect for success state (word by word with randomness)
  useEffect(() => {
    if (loadState === 'success' && translatedText) {
      setDisplayedText('')
      const words = translatedText.split(' ')
      let currentWordIndex = 0
      
      const showNextWord = () => {
        if (currentWordIndex < words.length) {
          const wordsToShow = words.slice(0, currentWordIndex + 1)
          setDisplayedText(wordsToShow.join(' '))
          currentWordIndex++
          
          // Random delay between 80ms and 220ms
          const randomDelay = Math.random() * 140 + 80
          setTimeout(showNextWord, randomDelay)
        } else {
          // Stop cursor blinking after text is complete
          setTimeout(() => setShowCursor(false), 1000)
        }
      }
      
      // Start with initial delay
      const initialDelay = Math.random() * 200 + 120
      setTimeout(showNextWord, initialDelay)
    }
  }, [loadState, translatedText])

  // Cursor blink effect
  useEffect(() => {
    if (loadState === 'success' && showCursor) {
      const cursorInterval = setInterval(() => {
        setShowCursor((prev) => !prev)
      }, 500)

      return () => clearInterval(cursorInterval)
    }
  }, [loadState, showCursor])

  // Reset states when load state changes
  useEffect(() => {
    if (loadState === 'loading') {
      setDisplayedText('')
      setShowCursor(true)
    }
  }, [loadState])

  return (
    <View style={{
      flex: 1,
      backgroundColor: theme.surface,
      borderRadius: theme.borderRadius,
      borderWidth: 1,
      borderColor: theme.borderColor,
      marginBottom: theme.verticalMargin,
      overflow: 'hidden',
    }}>
      {/* Header */}
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

      {/* Loading State */}
      {loadState === 'loading' && (
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

      {/* Error State */}
      {loadState === 'error' && (
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
          }}>{errorMessage}</Text>
        </View>
      )}

      {/* Success State with Typewriter Effect */}
      {loadState === 'success' && (
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
            {displayedText}
            {showCursor && (
              <Text style={{ 
                color: theme.primary,
                fontWeight: 'bold' 
              }}>|</Text>
            )}
          </Text>
        </ScrollView>
      )}

      {/* Empty State */}
      {loadState === 'empty' && (
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
  )
}
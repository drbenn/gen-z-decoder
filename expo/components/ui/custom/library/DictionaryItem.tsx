import React, { useState } from 'react'
import { View, Text, Pressable, useColorScheme } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
import { DictionaryEntry } from '@/types/dictionary.types'
import { TextToSpeechService } from '@/services/TextToSpeechService'

interface DictionaryItemProps {
  item: DictionaryEntry
  onToggleFavorite: (id: string) => void
}

export default function DictionaryItem({ item, onToggleFavorite }: DictionaryItemProps) {
  const colorScheme = useColorScheme()
  const theme = colorScheme === 'light' ? Colors.light : Colors.dark
  const [expanded, setExpanded] = useState(false)

  const handleTTS = async (text: string) => {
    await TextToSpeechService.handleTTS(text)
  }

  return (
    <View style={{
      backgroundColor: theme.surface,
      marginVertical: 4,
      borderRadius: theme.borderRadius,
      borderWidth: 1,
      borderColor: theme.borderColor,
    }}>
      <Pressable 
        onPress={() => setExpanded(!expanded)} 
        style={({ pressed }) => ({
          padding: 16,
          backgroundColor: pressed ? theme.primaryTint : 'transparent',
          borderRadius: theme.borderRadius,
        })}
      >
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 4,
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.text,
            flex: 1,
          }}>
            {item.term}
            {item.pronunciation && (
              <Text style={{
                fontWeight: 'normal',
                color: theme.textMuted,
                fontSize: 14,
              }}> ({item.pronunciation})</Text>
            )}
          </Text>
          <Pressable 
            onPress={() => onToggleFavorite(item.id)}
            style={({ pressed }) => ({
              backgroundColor: pressed ? theme.primaryTint : 'transparent',
              borderRadius: 12,
              padding: 4,
            })}
          >
            <Ionicons 
              name={item.is_favorite ? 'bookmark' : 'bookmark-outline'} 
              size={18} 
              color={item.is_favorite ? theme.primary : theme.textMuted} 
            />
          </Pressable>
        </View>
      
        <Text style={{
          fontSize: 15,
          color: theme.text,
          marginBottom: 8,
          lineHeight: 20,
        }}>{item.definition}</Text>
      
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Text style={{
            fontSize: 12,
            color: theme.text,
            borderWidth: 1.5,
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: theme.borderRadius,
            borderColor: theme.textMuted,
            fontWeight: '600',
            textTransform: 'uppercase',
          }}>{item.category}</Text>
          <Text style={{
            fontSize: 18,
            color: theme.textMuted,
            fontWeight: 'bold',
          }}>{expanded ? '−' : '+'}</Text>
        </View>
      </Pressable>

      {expanded && (
        <View style={{
          paddingHorizontal: 16,
          paddingBottom: 16,
          borderTopWidth: 1,
          borderTopColor: theme.borderColor,
        }}>
          <View style={{ marginVertical: 12 }}>
            <Text style={{
              fontSize: 13,
              fontWeight: 'bold',
              color: theme.text,
              marginBottom: 4,
            }}>Examples:</Text>
            {item.examples.map((example: string, index: number) => (
              <View 
                key={index}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Text  style={{
                  fontSize: 14,
                  color: theme.textMuted,
                  fontStyle: 'italic',
                  marginBottom: 2,
                }}>• {example}</Text>

                <Pressable
                  style={({ pressed }) => ({
                    paddingLeft: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                    backgroundColor: pressed ? theme.primaryTint : theme.surface,
                    borderWidth: 1,
                    borderColor: theme.primary,
                    borderRadius: theme.borderRadius,
                    height: 30,
                    width: 40,
                  })}
                  onPress={() => handleTTS(example)}
                >
                  <Ionicons name="volume-high-outline" size={18} color={theme.primary} />  
                </Pressable>
              </View>  
            ))}
          </View>

          <View style={{ marginBottom: 12 }}>
            <Text style={{
              fontSize: 13,
              fontWeight: 'bold',
              color: theme.text,
              marginBottom: 4,
            }}>Details:</Text>
            <Text style={{
              fontSize: 13,
              color: theme.textMuted,
              marginBottom: 2,
            }}>Sentiment: {item.sentiment}</Text>
            <Text style={{
              fontSize: 13,
              color: theme.textMuted,
              marginBottom: 2,
            }}>Popularity: {item.popularity}/10</Text>
            <Text style={{
              fontSize: 13,
              color: theme.textMuted,
              marginBottom: 2,
            }}>Contexts: {item.contexts.join(', ')}</Text>
          </View>

          {item.related_terms.length > 0 && (
            <View style={{ marginBottom: 12 }}>
              <Text style={{
                fontSize: 13,
                fontWeight: 'bold',
                color: theme.text,
                marginBottom: 4,
              }}>Related:</Text>
              <Text style={{
                fontSize: 13,
                color: theme.textMuted,
              }}>{item.related_terms.join(', ')}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  )
}
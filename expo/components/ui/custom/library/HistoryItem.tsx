import React from 'react'
import { View, Text, Pressable, useColorScheme, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
import { TranslationHistoryItem, TranslationMode } from '@/types/translate.types'

interface HistoryItemProps {
  item: TranslationHistoryItem
  onToggleFavorite: (id: string) => void
  onRemoveItem: (id: string) => void
}

export default function HistoryItem({ item, onToggleFavorite, onRemoveItem }: HistoryItemProps) {
  const colorScheme = useColorScheme()
  const theme = colorScheme === 'light' ? Colors.light : Colors.dark

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const handleDeletePress = () => {
    Alert.alert(
      "Delete Translation",
      "Are you sure you want to remove this translation from your history?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => onRemoveItem(item.id)
        }
      ]
    )
  }

  return (
    <View style={{
      backgroundColor: theme.surface,
      padding: 16,
      marginVertical: 4,
      borderRadius: theme.borderRadius,
      borderWidth: 1,
      borderColor: theme.borderColor,
    }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
      }}>
        <Text style={{
          fontSize: 12,
          color: theme.textMuted,
          fontWeight: '600',
        }}>
          {item.mode === TranslationMode.GENZ_TO_ENGLISH ? 'Gen Z → English' : 'English → Gen Z'}
        </Text>
        
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          {/* Favorite button */}
          <Pressable 
            onPress={() => onToggleFavorite(item.id)}
            style={({ pressed }) => ({
              backgroundColor: pressed ? theme.primaryTint : 'transparent',
              borderRadius: 12,
              padding: 4,
              marginRight: 8,
            })}
          >
            <Ionicons 
              name={item.isFavorite ? 'bookmark' : 'bookmark-outline'} 
              size={18} 
              color={item.isFavorite ? theme.primary : theme.textMuted} 
            />
          </Pressable>

          {/* Delete button */}
          <Pressable 
            onPress={handleDeletePress}
            style={({ pressed }) => ({
              backgroundColor: pressed ? theme.primaryTint : 'transparent',
              borderRadius: 12,
              padding: 4,
            })}
          >
            <Ionicons 
              name="close" 
              size={18} 
              color={theme.textMuted} 
            />
          </Pressable>
        </View>
      </View>
    
      <View style={{ marginBottom: 8 }}>
        <Text style={{
          fontSize: 16,
          color: theme.text,
          marginBottom: 8,
        }}>
          {item.mode === TranslationMode.ENGLISH_TO_GENZ ? 'English' : 'Gen Z'} -- {item.originalText}
        </Text>

      <View style={{marginVertical: theme.verticalMargin / 2, paddingLeft: 10}}>
        <Ionicons 
          name={'arrow-down'} 
          size={25}
          color={theme.primary} 
        />
      </View>


        <Text style={{
          fontSize: 16,
          color: theme.text,
          fontStyle: 'italic',
        }}>
          {item.mode === TranslationMode.ENGLISH_TO_GENZ ? 'Gen Z' : 'English'} -- {item.translatedText}
        </Text>
      </View>
      <Text style={{
        fontSize: 11,
        color: theme.textMuted,
        textAlign: 'right',
      }}>
        {formatTime(item.timestamp)}
      </Text>
    </View>
  )
}
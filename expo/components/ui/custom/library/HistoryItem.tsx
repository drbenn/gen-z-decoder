import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native'
import { Colors } from 'react-native/Libraries/NewAppScreen'

interface TranslationHistoryItem {
  id: string
  originalText: string
  translatedText: string
  mode: string // TranslationMode
  timestamp: string
  isFavorite: boolean
}

interface HistoryItemProps {
  item: TranslationHistoryItem
  onToggleFavorite: (id: string) => void
}

export default function HistoryItem({ item, onToggleFavorite }: HistoryItemProps) {
  const colorScheme = useColorScheme()
  const theme = colorScheme === 'light' ? Colors.light : Colors.dark


  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.mode}>{item.mode === 'genZToEnglish' ? 'Gen Z → English' : 'English → Gen Z'}</Text>
        <TouchableOpacity onPress={() => onToggleFavorite(item.id)}>
          <Text style={styles.favorite}>{item.isFavorite ? '⭐' : '☆'}</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.originalText}>{item.originalText}</Text>
        <Text style={styles.arrow}>↓</Text>
        <Text style={styles.translatedText}>{item.translatedText}</Text>
      </View>
      
      <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mode: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  favorite: {
    fontSize: 18,
  },
  textContainer: {
    marginBottom: 8,
  },
  originalText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  arrow: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  translatedText: {
    fontSize: 16,
    color: '#007AFF',
    fontStyle: 'italic',
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    textAlign: 'right',
  },
})
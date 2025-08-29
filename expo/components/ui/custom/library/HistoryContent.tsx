import { useAppState } from '@/state/useAppState'
import React from 'react'
import { FlatList, View, Text, StyleSheet } from 'react-native'
import HistoryItem from './HistoryItem'


interface TranslationHistoryItem {
  id: string
  originalText: string
  translatedText: string
  mode: string
  timestamp: string
  isFavorite: boolean
}

export default function HistoryContent() {
  const translationHistory = useAppState((state) => state.translationHistory)
  const setHistoryFavorite = useAppState((state) => state.setHistoryFavorite)

  const renderHistoryItem = ({ item }: { item: TranslationHistoryItem }) => (
    <HistoryItem 
      item={item} 
      onToggleFavorite={(id: string) => setHistoryFavorite(id, !item.isFavorite)}
    />
  )

  if (!translationHistory || translationHistory.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No translation history yet</Text>
        <Text style={styles.emptySubtext}>Your translations will appear here</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={translationHistory}
      keyExtractor={(item: TranslationHistoryItem) => item.id}
      renderItem={renderHistoryItem}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  )
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
})
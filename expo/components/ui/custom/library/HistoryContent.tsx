import { useAppState } from '@/state/useAppState'
import React, { useMemo } from 'react'
import { FlatList, View, Text, StyleSheet, useColorScheme } from 'react-native'
import HistoryItem from './HistoryItem'
import { TranslationHistoryItem } from '@/types/translate.types'
import { Colors } from 'react-native/Libraries/NewAppScreen'



export default function HistoryContent() {
  const colorScheme = useColorScheme()
  const theme = colorScheme === 'light' ? Colors.light : Colors.dark

  const translationHistory = useAppState((state) => state.translationHistory)
  const setHistoryFavorite = useAppState((state) => state.setHistoryFavorite)

  // top nav chip used in librarySlice for filtering of both dictionary and history 
  const isFavoritesChipActive = useAppState((state) => state.isFavoritesChipActive)

  // useMemo prevents re-filtering on every render (only when dependencies change)
  const filteredHistoryItems = useMemo(() => {
    return isFavoritesChipActive
      ? translationHistory.filter((term: TranslationHistoryItem) => term.isFavorite)
      : translationHistory
  }, [isFavoritesChipActive, translationHistory])


  const renderHistoryItem = ({ item }: { item: TranslationHistoryItem }) => (
    <HistoryItem 
      item={item} 
      onToggleFavorite={(id: string) => setHistoryFavorite(id, !item.isFavorite)}
    />
  )

  // empty state message for favorites
  if (!translationHistory || translationHistory.length === 0) {
    const emptyText = isFavoritesChipActive ? 'No translation history yet' : 'Translation history not loaded'
    const emptySubtext = isFavoritesChipActive ? 'Your translations will appear here' : 'Translation history will appear here'
    
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyText}</Text>
        <Text style={styles.emptySubtext}>{emptySubtext}</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={filteredHistoryItems}
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
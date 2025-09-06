import { useAppState } from '@/state/useAppState'
import React, { useMemo } from 'react'
import { FlatList, View, Text, useColorScheme } from 'react-native'
import HistoryItem from './HistoryItem'
import { TranslationHistoryItem } from '@/types/translate.types'
import { Colors } from '@/constants/Colors'

export default function HistoryContent() {
  const colorScheme = useColorScheme()
  const theme = colorScheme === 'light' ? Colors.light : Colors.dark
  
  const translationHistory = useAppState((state) => state.translationHistory)
  const setHistoryFavorite = useAppState((state) => state.setHistoryFavorite)
  const removeOneFromHistory = useAppState((state) => state.removeOneFromHistory)
  const librarySearchTerm = useAppState((state) => state.librarySearchTerm)

  // top nav chip used in librarySlice for filtering of both dictionary and history
  const isFavoritesChipActive = useAppState((state) => state.isFavoritesChipActive)
  
  // useMemo prevents re-filtering on every render (only when dependencies change)
  const filteredHistoryItems = useMemo(() => {
    let filtered = isFavoritesChipActive
      ? translationHistory.filter((item: TranslationHistoryItem) => item.isFavorite)
      : translationHistory

    // Add search filter if search term exists and is longer than 1 character
    if (librarySearchTerm && librarySearchTerm.length > 1) {
      filtered = filtered.filter((item: TranslationHistoryItem) => 
        item.originalText.toLowerCase().includes(librarySearchTerm.toLowerCase()) ||
        item.translatedText.toLowerCase().includes(librarySearchTerm.toLowerCase())
      )
    }

    return filtered
  }, [isFavoritesChipActive, translationHistory, librarySearchTerm])

  const renderHistoryItem = ({ item }: { item: TranslationHistoryItem }) => (
    <HistoryItem
      item={item}
      onToggleFavorite={(id: string) => setHistoryFavorite(id, !item.isFavorite)}
      onRemoveItem={(id: string) => removeOneFromHistory(id)}
    />
  )

  // empty state message for favorites
  if (!filteredHistoryItems  || filteredHistoryItems .length === 0) {
    const emptyText = isFavoritesChipActive ? 'No translation history yet' : 'Translation history not loaded'
    const emptySubtext = isFavoritesChipActive ? 'Your translations will appear here' : 'Translation history will appear here'

    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
      }}>
        <Text style={{
          fontSize: 18,
          color: theme.textMuted,
          textAlign: 'center',
          marginBottom: 8,
        }}>{emptyText}</Text>
        <Text style={{
          fontSize: 14,
          color: theme.textMuted,
          textAlign: 'center',
        }}>{emptySubtext}</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={filteredHistoryItems}
      keyExtractor={(item: TranslationHistoryItem) => item.id}
      renderItem={renderHistoryItem}
      contentContainerStyle={{
        padding: 16,
      }}
      showsVerticalScrollIndicator={false}
    />
  )
}
import React, { useMemo } from 'react'
import { FlatList, View, Text, useColorScheme } from 'react-native'
import DictionaryItem from './DictionaryItem'
import { useAppState } from '@/state/useAppState'
import { Colors } from '@/constants/Colors'
import { DictionaryEntry } from '@/types/dictionary.types'

export default function DictionaryContent() {
  const colorScheme = useColorScheme()
  const theme = colorScheme === 'light' ? Colors.light : Colors.dark
  
  const dictionaryTerms = useAppState((state) => state.dictionaryTerms)
  const setDictionaryFavorite = useAppState((state) => state.setDictionaryFavorite)

  const librarySearchTerm = useAppState((state) => state.librarySearchTerm)

  // top nav chip used in librarySlice for filtering of both dictionary and history
  const isFavoritesChipActive = useAppState((state) => state.isFavoritesChipActive)
  
  // useMemo prevents re-filtering on every render (only when dependencies change)
  const filteredTerms = useMemo(() => {
    let filtered = isFavoritesChipActive
      ? dictionaryTerms.filter((term: DictionaryEntry) => term.is_favorite)
      : dictionaryTerms

    // Add search filter if search term exists and is longer than 1 character
    if (librarySearchTerm && librarySearchTerm.length > 1) {
      filtered = filtered.filter((term: DictionaryEntry) => 
        term.term.toLowerCase().includes(librarySearchTerm.toLowerCase())
      )
    }

    return filtered
  }, [isFavoritesChipActive, dictionaryTerms, librarySearchTerm])

  const renderDictionaryItem = ({ item }: { item: DictionaryEntry }) => (
    <DictionaryItem
      item={item}
      onToggleFavorite={(id: string) => setDictionaryFavorite(id, !item.is_favorite)}
    />
  )

  // empty state message for favorites
  if (!filteredTerms || filteredTerms.length === 0) {
    const emptyText = isFavoritesChipActive ? 'No favorite terms yet' : 'Dictionary not loaded'
    const emptySubtext = isFavoritesChipActive ? 'Star some terms to see them here' : 'Gen-Z slang terms will appear here'
  
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
      data={filteredTerms}
      keyExtractor={(item: DictionaryEntry) => item.id}
      renderItem={renderDictionaryItem}
      contentContainerStyle={{
        padding: 16,
      }}
      showsVerticalScrollIndicator={false}
    />
  )
}
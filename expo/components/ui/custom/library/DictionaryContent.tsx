import React, { useMemo } from 'react'
import { FlatList, View, Text, StyleSheet, useColorScheme } from 'react-native'
import DictionaryItem from './DictionaryItem'
import { useAppState } from '@/state/useAppState'
import { Colors } from 'react-native/Libraries/NewAppScreen'

interface DictionaryEntry {
  id: string
  term: string
  pronunciation?: string
  definition: string
  examples: string[]
  category: string
  sentiment: string
  contexts: string[]
  popularity: number
  related_terms: string[]
  last_updated: string
  is_favorite?: boolean
}

export default function DictionaryContent() {
  const colorScheme = useColorScheme()
  const theme = colorScheme === 'light' ? Colors.light : Colors.dark


    const dictionaryTerms = useAppState((state) => state.dictionaryTerms)
    const setDictionaryFavorite = useAppState((state) => state.setDictionaryFavorite)

    // top nav chip used in librarySlice for filtering of both dictionary and history 
    const isFavoritesChipActive = useAppState((state) => state.isFavoritesChipActive)

    // useMemo prevents re-filtering on every render (only when dependencies change)
    const filteredTerms = useMemo(() => {
      return isFavoritesChipActive
        ? dictionaryTerms.filter((term: DictionaryEntry) => term.is_favorite)
        : dictionaryTerms
    }, [isFavoritesChipActive, dictionaryTerms])


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
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyText}</Text>
        <Text style={styles.emptySubtext}>{emptySubtext}</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={filteredTerms}
      keyExtractor={(item: DictionaryEntry) => item.id}
      renderItem={renderDictionaryItem}
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
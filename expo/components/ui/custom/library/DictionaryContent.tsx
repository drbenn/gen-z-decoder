import React from 'react'
import { FlatList, View, Text, StyleSheet } from 'react-native'
import DictionaryItem from './DictionaryItem'
import { useAppState } from '@/state/useAppState'

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
    const dictionaryTerms = useAppState((state) => state.dictionaryTerms)
    const setDictionaryFavorite = useAppState((state) => state.setDictionaryFavorite)

  const renderDictionaryItem = ({ item }: { item: DictionaryEntry }) => (
    <DictionaryItem 
      item={item} 
      onToggleFavorite={(id: string) => setDictionaryFavorite(id, !item.is_favorite)}
    />
  )

  if (!dictionaryTerms || dictionaryTerms.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Dictionary not loaded</Text>
        <Text style={styles.emptySubtext}>Slang terms will appear here</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={dictionaryTerms}
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
import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native'
import { Colors } from 'react-native/Libraries/NewAppScreen'

interface DictionaryEntry {
  id: string
  term: string
  pronunciation?: string
  definition: string
  examples: string[]
  category: string // SlangCategory
  sentiment: string // SlangSentiment
  contexts: string[] // UsageContext[]
  popularity: number
  related_terms: string[]
  last_updated: string
  is_favorite?: boolean
}

interface DictionaryItemProps {
  item: DictionaryEntry
  onToggleFavorite: (id: string) => void
}

export default function DictionaryItem({ item, onToggleFavorite }: DictionaryItemProps) {
  const colorScheme = useColorScheme()
  const theme = colorScheme === 'light' ? Colors.light : Colors.dark

  const [expanded, setExpanded] = useState(false)

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.term}>
            {item.term}
            {item.pronunciation && <Text style={styles.pronunciation}> ({item.pronunciation})</Text>}
          </Text>
          <TouchableOpacity onPress={() => onToggleFavorite(item.id)}>
            <Text style={styles.favorite}>{item.is_favorite ? '⭐' : '☆'}</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.definition}>{item.definition}</Text>
        
        <View style={styles.expandRow}>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.expandIcon}>{expanded ? '−' : '+'}</Text>
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.expandedContent}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Examples:</Text>
            {item.examples.map((example: string, index: number) => (
              <Text key={index} style={styles.example}>• {example}</Text>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details:</Text>
            <Text style={styles.detail}>Sentiment: {item.sentiment}</Text>
            <Text style={styles.detail}>Popularity: {item.popularity}/10</Text>
            <Text style={styles.detail}>Contexts: {item.contexts.join(', ')}</Text>
          </View>

          {item.related_terms.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Related:</Text>
              <Text style={styles.detail}>{item.related_terms.join(', ')}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  header: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  term: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  pronunciation: {
    fontWeight: 'normal',
    color: '#666',
    fontSize: 14,
  },
  favorite: {
    fontSize: 18,
  },
  definition: {
    fontSize: 15,
    color: '#555',
    marginBottom: 8,
    lineHeight: 20,
  },
  expandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  expandIcon: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
  expandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  example: {
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  detail: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
})
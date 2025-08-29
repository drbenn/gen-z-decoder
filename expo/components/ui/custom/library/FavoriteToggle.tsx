import React from 'react'
import { TouchableOpacity, Text, StyleSheet, useColorScheme } from 'react-native'
import { Colors } from 'react-native/Libraries/NewAppScreen'

interface FavoriteToggleProps {
  isActive: boolean
  onPress: () => void
}

export default function FavoriteToggle({ isActive, onPress }: FavoriteToggleProps) {
  const colorScheme = useColorScheme()
  const theme = colorScheme === 'light' ? Colors.light : Colors.dark


  return (
    <TouchableOpacity 
      style={[styles.toggle, isActive && styles.activeToggle]} 
      onPress={onPress}
    >
      <Text style={[styles.text, isActive && styles.activeText]}>
        Favorites
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  toggle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#d0d0d0',
  },
  activeToggle: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  text: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  activeText: {
    color: '#fff',
  },
})
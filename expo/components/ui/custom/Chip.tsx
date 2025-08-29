import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'

interface ChipProps {
  label: string
  onPress: () => void
  active?: boolean
}

export default function Chip({ label, onPress, active = false }: ChipProps) {
  return (
    <TouchableOpacity 
      style={[styles.chip, active && styles.activeChip]} 
      onPress={onPress}
    >
      <Text style={[styles.text, active && styles.activeText]}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#d0d0d0',
  },
  activeChip: {
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
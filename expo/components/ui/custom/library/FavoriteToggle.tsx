import React from 'react'
import { Pressable, Text, useColorScheme } from 'react-native'
import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'

interface FavoriteToggleProps {
  isActive: boolean
  onPress: () => void
}

export default function FavoriteToggle({ isActive, onPress }: FavoriteToggleProps) {
  const colorScheme = useColorScheme()
  const theme = colorScheme === 'light' ? Colors.light : Colors.dark

  return (
    <Pressable
      style={({ pressed }) => ({
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: isActive ? theme.primary : theme.borderColor,
        backgroundColor: pressed 
          ? theme.primary
          : isActive 
            ? theme.primaryTint 
            : 'transparent',
      })}
      onPress={onPress}
    >
      <Text style={{
        fontSize: 14,
        fontWeight: '500',
        color: theme.text,
      }}>
      <Ionicons 
        name={isActive ? 'bookmark' : 'bookmark-outline'} 
        size={12} 
        color={isActive ? theme.primary : theme.textMuted}
      />
        &nbsp;Favorites
      </Text>
    </Pressable>
  )
}
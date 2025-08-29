import React from 'react'
import { Pressable, Text, useColorScheme } from 'react-native'
import { Colors } from '@/constants/Colors'

interface ChipProps {
  label: string
  onPress: () => void
  active?: boolean
}

export default function Chip({ label, onPress, active = false }: ChipProps) {
  const colorScheme = useColorScheme()
  const theme = colorScheme === 'light' ? Colors.light : Colors.dark

  return (
    <Pressable
      style={({ pressed }) => ({
        paddingHorizontal: 22,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: active ? theme.primary : theme.borderColor,
        backgroundColor: pressed 
          ? theme.primaryTint 
          : active 
            ? theme.primary 
            : 'transparent',
      })}
      onPress={onPress}
    >
      <Text style={{
        fontSize: 14,
        fontWeight: '500',
        color: active ? '#fff' : theme.text,
      }}>
        {label}
      </Text>
    </Pressable>
  )
}
import React from 'react'
import { View, Pressable, Text, useColorScheme } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'
import { Colors } from '@/constants/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

// Separate component for animated regular tabs
function AnimatedTab({ route, isFocused, onPress, theme }: any) {
  const scaleX = useSharedValue(isFocused ? 1 : 0.65)
  const opacity = useSharedValue(isFocused ? 1 : 0)

  React.useEffect(() => {
    scaleX.value = withTiming(isFocused ? 1 : 0.65, { duration: 240 })
    opacity.value = withTiming(isFocused ? 1 : 0, { duration: 240 })
  }, [isFocused])

  const animatedPillStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: scaleX.value }],
    opacity: opacity.value,
  }))

  const getTabIcon = (routeName: string) => {
    const iconColor = isFocused ? '#fff' : theme.textMuted
    const size = 24

    switch (routeName) {
      case 'library':
        return <Ionicons name="library-outline" size={size} color={iconColor} />
      case 'settings':
        return <Ionicons name="settings-outline" size={size} color={iconColor} />
      default:
        return <Ionicons name="circle" size={size} color={iconColor} />
    }
  }

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Pressable onPress={onPress} style={{ position: 'relative' }}>
        <Animated.View
          style={[
            {
              position: 'absolute',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: theme.primary,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            },
            animatedPillStyle,
          ]}
        />
        <View style={{
          paddingHorizontal: 16,
          paddingVertical: 5,
          borderRadius: 20,
          marginBottom: 0,
        }}>
          {getTabIcon(route.name)}
        </View>
      </Pressable>
      <Text style={{
        marginTop: 4,
        fontSize: 11,
        color: isFocused ? theme.primary : theme.textMuted,
        fontWeight: isFocused ? '600' : '400',
      }}>
        {route.name.charAt(0).toUpperCase() + route.name.slice(1)}
      </Text>
    </View>
  )
}

// Separate component for animated translate tab
function AnimatedTranslateTab({ route, isFocused, onPress, theme }: any) {
  const opacity = useSharedValue(isFocused ? 1 : 0.6)

  React.useEffect(() => {
    opacity.value = withTiming(isFocused ? 1 : 0.6, { duration: 240 })
  }, [isFocused])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Pressable onPress={onPress}>
        <Animated.View style={animatedStyle}>
          <LinearGradient
            colors={[theme.primary, theme.primaryTint]}
            style={{
              width: 50,
              height: 50,
              borderRadius: 28,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 4,
            }}
          >
            <Ionicons name="language" size={28} color="#fff" />
          </LinearGradient>
        </Animated.View>
      </Pressable>
      <Text style={{
        fontSize: 11,
        color: isFocused ? theme.text : theme.textMuted,
        fontWeight: '500',
      }}>
        Translate
      </Text>
    </View>
  )
}

interface CustomTabBarProps {
  state: any
  descriptors: any
  navigation: any
}

export default function CustomTabBar({ state, descriptors, navigation }: CustomTabBarProps) {
  const colorScheme = useColorScheme()
  const theme = colorScheme === 'light' ? Colors.light : Colors.dark
  const insets = useSafeAreaInsets()

  return (
    <View style={{
      flexDirection: 'row',
      backgroundColor: theme.surface,
      paddingBottom: insets.bottom,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.borderColor,
    }}>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index
        const isTranslateTab = route.name === 'translate'

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }

        if (isTranslateTab) {
          return (
            <AnimatedTranslateTab
              key={route.key}
              route={route}
              isFocused={isFocused}
              onPress={onPress}
              theme={theme}
            />
          )
        }

        return (
          <AnimatedTab
            key={route.key}
            route={route}
            isFocused={isFocused}
            onPress={onPress}
            theme={theme}
          />
        )
      })}
    </View>
  )
}
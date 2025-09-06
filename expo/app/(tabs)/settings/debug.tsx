import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import {
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Colors } from '@/constants/Colors'
import { useAppState } from '@/state/useAppState'
import APP_CONSTANTS from '@/constants/appConstants'

export default function DebugScreen() {
  const colorScheme = useColorScheme()
  const theme = colorScheme === 'light' ? Colors.light : Colors.dark
  const insets = useSafeAreaInsets()

  const isPremiumMember = useAppState((state) => state.isPremiumMember)
  const setIsPremiumMember = useAppState((state) => state.setIsPremiumMember)
  const translationCount = useAppState((state) => state.translationCount)
  const resetAdState = useAppState((state) => state.resetAdState)

  const handleTogglePremium = () => {
    setIsPremiumMember(!isPremiumMember)
  }

  const handleResetAdState = () => {
    resetAdState()
  }

  return (
    <View style={{
      flex: 1,
      paddingHorizontal: theme.paddingHorizontal,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    }}>

      {/* Background Pattern */}
      <ImageBackground 
        source={colorScheme === 'dark' 
          ? require('@/assets/images/i-like-food-dark-blue-260.png') 
          : require('@/assets/images/i-like-food-light-260.png')
        }
        style={{
          position: 'absolute',
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0,
          zIndex: -1
        }}
        resizeMode="repeat"
      />

      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <Pressable
          onPress={() => router.back()}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 24,
          }}
        >
          <Ionicons name="chevron-back" size={24} color={theme.primary} />
          <Text style={{
            fontSize: 18,
            marginLeft: 4,
            color: theme.primary,
          }}>Back</Text>
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: 10,
          paddingBottom: 80,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={{
            fontSize: 24,
            fontWeight: '700',
            marginBottom: 12,
            color: '#ff6b6b',
          }}>Debug Mode</Text>
          <Text style={{
            fontSize: 16,
            lineHeight: 24,
            color: theme.textMuted,
            marginBottom: 24,
          }}>
            Developer testing controls. These settings are for development and testing purposes only.
          </Text>
        </View>

        {/* Premium Status Toggle */}
        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColor,
          }}
          onPress={handleTogglePremium}
        >
          <View style={{
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16,
          }}>
            <Ionicons name="diamond-outline" size={24} color={isPremiumMember ? '#ffd700' : theme.textMuted} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 17,
              fontWeight: '400',
              marginBottom: 2,
              color: theme.text,
            }}>Premium Member Status</Text>
            <Text style={{
              fontSize: 14,
              color: theme.textMuted,
            }}>
              {isPremiumMember 
                ? `Premium active - ${APP_CONSTANTS.PREMIUM_MEMBER_DAILY_TRANSLATION_LIMIT}/day, no ads` 
                : `Free user - ${APP_CONSTANTS.FREE_MEMBER_DAILY_TRANSLATION_LIMIT}/day, with ads`
              }
            </Text>
          </View>
          
          {/* Status Toggle */}
          <View style={{
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: theme.borderRadius,
            borderWidth: 1,
            width: 80,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: isPremiumMember ? '#ffd700' : theme.primary,
            backgroundColor: isPremiumMember ? '#ffd700' : 'transparent',
          }}>
            <Text style={{
              fontSize: 12,
              fontWeight: '500',
              color: isPremiumMember ? '#000' : theme.primary,
            }}>
              {isPremiumMember ? 'PREMIUM' : 'FREE'}
            </Text>
          </View>
        </Pressable>

        {/* Reset Ad State */}
        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColor,
          }}
          onPress={handleResetAdState}
        >
          <View style={{
            width: 40,
            height: 40,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 16,
          }}>
            <Ionicons name="refresh-outline" size={24} color={theme.textMuted} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 17,
              fontWeight: '400',
              marginBottom: 2,
              color: theme.text,
            }}>Reset Ad State</Text>
            <Text style={{
              fontSize: 14,
              color: theme.textMuted,
            }}>Reset translation count ({translationCount}) and ad tracking</Text>
          </View>
        </Pressable>

        {/* Current Status Display */}
        <View style={{
          marginTop: 32,
          padding: 16,
          backgroundColor: 'rgba(255, 107, 107, 0.1)',
          borderRadius: theme.borderRadius,
          borderWidth: 1,
          borderColor: '#ff6b6b',
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#ff6b6b',
            marginBottom: 8,
          }}>Current Status</Text>
          <Text style={{
            fontSize: 14,
            color: theme.text,
            marginBottom: 4,
          }}>Premium: {isPremiumMember ? 'YES' : 'NO'}</Text>
          <Text style={{
            fontSize: 14,
            color: theme.text,
            marginBottom: 4,
          }}>Translation Count: {translationCount}</Text>
          <Text style={{
            fontSize: 14,
            color: theme.text,
            marginBottom: 4,
          }}>Daily Limit: {isPremiumMember ? APP_CONSTANTS.PREMIUM_MEMBER_DAILY_TRANSLATION_LIMIT : APP_CONSTANTS.FREE_MEMBER_DAILY_TRANSLATION_LIMIT}</Text>
          <Text style={{
            fontSize: 14,
            color: theme.text,
          }}>Ads Enabled: {isPremiumMember ? 'NO' : 'YES'}</Text>
        </View>

        {/* Future Debug Options Placeholder */}
        <View style={{
          marginTop: 24,
          padding: 16,
          backgroundColor: 'rgba(128, 128, 128, 0.1)',
          borderRadius: theme.borderRadius,
        }}>
          <Text style={{
            fontSize: 14,
            color: theme.textMuted,
            fontStyle: 'italic',
            textAlign: 'center',
          }}>
            Additional debug options will appear here as needed
          </Text>
        </View>

      </ScrollView>
    </View>
  )
}
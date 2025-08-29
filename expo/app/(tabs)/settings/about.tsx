import APP_CONSTANTS from '@/constants/appConstants'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import {
  Linking,
  SafeAreaView,
  ScrollView,
  Text,
  Pressable,
  View,
  useColorScheme
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Colors } from '@/constants/Colors';


export default function AboutScreen() {
  const colorScheme = useColorScheme()
  const theme = colorScheme === 'light' ? Colors.light : Colors.dark
  const insets = useSafeAreaInsets()

  const handleEmailPress = () => {
    Linking.openURL(`mailto:${APP_CONSTANTS.DEVELOPER_EMAIL}`)
  }

  const handleCompanyWebsitePress = () => {
    Linking.openURL(APP_CONSTANTS.DEVELOPER_WEBSITE)
  }

    const handleAppWebsitePress = () => {
    Linking.openURL(APP_CONSTANTS.APP_WEBSITE)
  }

  const handlePrivacyPolicyPress = () => {
    Linking.openURL(APP_CONSTANTS.APP_WEBSITE_APP_PRIVACY_POLICY)
  }

  const handleTermsOfServicePress = () => {
    Linking.openURL(APP_CONSTANTS.APP_WEBSITE_APP_TERMS_OF_SERVICE)
  }

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: theme.paddingHorizontal,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    }}>
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
            color: theme.text,
          }}>About</Text>
          <Text style={{
            fontSize: 16,
            lineHeight: 24,
            color: theme.text,
          }}>
            {APP_CONSTANTS.APP_NAME} is the two-way slang translator that bridges the communication gap between Gen Z and older generations, helping families understand each other better.
            {'\n'}{'\n'}
            Translate Gen Z slang to standard English and vice versa using AI-powered translation that understands context and nuance. Browse an extensive dictionary of authentic slang terms, save your favorites, and keep a history of translations. Whether you&apos;re a parent trying to decode your teen&apos;s texts or a Gen Z user explaining something to family, we&apos;ve got you covered - no cap!
          </Text>
          <Text style={{
            fontSize: 12,
            lineHeight: 12,
            marginTop: 18,
            marginRight: 6,
            textAlign: 'right',
            color: theme.primaryTint,
          }}>
            Version { APP_CONSTANTS.VERSION_NO }
          </Text>
        </View>

        {/* Developer Info */}
        <View>
          <Text style={{
            fontSize: 24,
            fontWeight: '600',
            marginTop: theme.verticalMargin *2,
            marginBottom: theme.verticalMargin,
            color: theme.text,
          }}>Created by { APP_CONSTANTS.DEVELOPER_CO }</Text>
          
          <View style={{ marginTop: 0 }}>
            <Pressable onPress={handleCompanyWebsitePress} style={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              marginBottom: 20,
            }}>
              <Text style={{
                fontSize: 16,
                marginRight: 8,
                color: theme.text,
              }}>Website:</Text>
              <Text style={{
                fontSize: 16,
                textDecorationLine: 'underline',
                color: theme.primary,
              }}>{APP_CONSTANTS.DEVELOPER_WEBSITE}</Text>
            </Pressable>

            <Pressable onPress={handleAppWebsitePress} style={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              marginBottom: 20,
            }}>
              <Text style={{
                fontSize: 16,
                marginRight: 8,
                color: theme.text,
              }}>App Website:</Text>
              <Text style={{
                fontSize: 16,
                textDecorationLine: 'underline',
                color: theme.primary,
              }}>{ APP_CONSTANTS.APP_WEBSITE }</Text>
            </Pressable>

            <Pressable onPress={handleEmailPress} style={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              marginBottom: 20,
            }}>
              <Text style={{
                fontSize: 16,
                marginRight: 8,
                color: theme.text,
              }}>Email:</Text>
              <Text style={{
                fontSize: 16,
                textDecorationLine: 'underline',
                color: theme.primary,
              }}>{ APP_CONSTANTS.DEVELOPER_EMAIL }</Text>
            </Pressable>

            <Pressable onPress={handlePrivacyPolicyPress} style={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              marginBottom: 20,
            }}>
              <Text style={{
                fontSize: 16,
                marginRight: 8,
                color: theme.text,
              }}>Privacy Policy:</Text>
              <Text style={{
                fontSize: 16,
                textDecorationLine: 'underline',
                color: theme.primary,
              }}>{ APP_CONSTANTS.APP_WEBSITE_APP_PRIVACY_POLICY }</Text>
            </Pressable>

            <Pressable onPress={handleTermsOfServicePress} style={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              marginBottom: 20,
            }}>
              <Text style={{
                fontSize: 16,
                marginRight: 8,
                color: theme.text,
              }}>Terms of Service:</Text>
              <Text style={{
                fontSize: 16,
                textDecorationLine: 'underline',
                color: theme.primary,
              }}>{ APP_CONSTANTS.APP_WEBSITE_APP_TERMS_OF_SERVICE }</Text>
            </Pressable>
          </View>
        </View>
        
      </ScrollView>
    </SafeAreaView>
  )
}

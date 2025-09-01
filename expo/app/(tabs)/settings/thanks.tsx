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
import { Colors } from '@/constants/Colors'


export default function ThanksScreen() {
  const colorScheme = useColorScheme()
  const theme = colorScheme === 'light' ? Colors.light : Colors.dark
  const insets = useSafeAreaInsets()

  const handleLottieWebsitePress = () => {
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
          {/* Thanks Info */}
          <View>            
            <View style={{ marginTop: 0 }}>
              <Pressable onPress={handleLottieWebsitePress} style={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                marginBottom: 20,
              }}>
                <Text style={{
                  fontSize: 16,
                  textDecorationLine: 'underline',
                  color: theme.primary,
                }}>https://lottiefiles.com</Text>
                <Text style={{
                  fontSize: 16,
                  marginRight: 8,
                  color: theme.text,
                }}>For their excellent animations platform. 
                {'\n'}{'\n'}
                However, I would have loved to have provided the actual links to the people who created the lottie files - but lottiefiles.com is not the most conducive to finding who created the image after its added to your dashboard. Sorry. Not spending 3 hours looking through 347 pages of images after using the literal search term &apos;loading cat&apos; of the image title, etc.
                </Text>
              </Pressable>

            </View>
          </View>
        </ScrollView>
        
    </SafeAreaView>
  )
}

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
  useColorScheme,
  ImageBackground
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

  return (
    <SafeAreaView style={{
      flex: 1,
      // backgroundColor: theme.background,
      paddingHorizontal: theme.paddingHorizontal,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    }}>

        {/* Sick svg-ish pattern background */}
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
                I would have loved to have provided the actual links to the people who created the lottie files - but lottiefiles.com is not the most conducive to finding who created the image after its added to your dashboard. Looking through 347 pages of images after using the exact search term of the image is 
                not how I would like to spend my entire evening.
                </Text>
              </Pressable>

            </View>
          </View>
        </ScrollView>
        
    </SafeAreaView>
  )
}

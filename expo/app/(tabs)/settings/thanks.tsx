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
    Linking.openURL('https://lottiefiles.com')
  }

  const handleDirkWebsitePress = () => {
    Linking.openURL('https://lottiefiles.com/v0c9mqviju3r0pnm')
  }

  const handleAarthiWebsitePress = () => {
    Linking.openURL('https://dribbble.com/aarthibn')
  }

  const handlePhuongWebsitePress = () => {
    Linking.openURL('https://lottiefiles.com/mthy5bymut')
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
                }}>LottieFiles</Text>
                <Text style={{
                  fontSize: 16,
                  marginRight: 8,
                  color: theme.text,
                }}>For their animations platform. 
                </Text>
              </Pressable>

              <Pressable onPress={handleDirkWebsitePress} style={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                marginBottom: 20,
              }}>
                <Text style={{
                  fontSize: 16,
                  textDecorationLine: 'underline',
                  color: theme.primary,
                }}>Dirk Rittberger</Text>
                <Text style={{
                  fontSize: 16,
                  marginRight: 8,
                  color: theme.text,
                }}>For the most excellent couple giving thumbs up animation.
                </Text>
              </Pressable>

              <Pressable onPress={handleAarthiWebsitePress} style={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                marginBottom: 20,
              }}>
                <Text style={{
                  fontSize: 16,
                  textDecorationLine: 'underline',
                  color: theme.primary,
                }}>AARTHI B N</Text>
                <Text style={{
                  fontSize: 16,
                  marginRight: 8,
                  color: theme.text,
                }}>For the cool, running gen-z in slippers animation.
                </Text>
              </Pressable>

              <Pressable onPress={handlePhuongWebsitePress} style={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                marginBottom: 20,
              }}>
                <Text style={{
                  fontSize: 16,
                  textDecorationLine: 'underline',
                  color: theme.primary,
                }}>Phuong-Anh Nguyen </Text>
                <Text style={{
                  fontSize: 16,
                  marginRight: 8,
                  color: theme.text,
                }}>For the awesome, loading cat animation.
                </Text>
              </Pressable>

            </View>
          </View>
        </ScrollView>
        
    </SafeAreaView>
  )
}

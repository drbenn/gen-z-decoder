import APP_CONSTANTS from '@/constants/appConstants'
import { router } from 'expo-router'
import { ImageBackground, Pressable, ScrollView, Share, Text, useColorScheme, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import { useAppState } from '@/state/useAppState'


export default function SettingsScreen() {
  const colorScheme = useColorScheme()
  const theme = colorScheme === 'light' ? Colors.light : Colors.dark
  const insets = useSafeAreaInsets()

  const autoPlayAudio = useAppState((state) => state.autoPlayAudio)
  const setAutoPlayAudio = useAppState((state) => state.setAutoPlayAudio)
  const debugModeUnlocked = useAppState((state) => state.debugModeUnlocked)

  const handleAbout = () => {
    router.push('/settings/about')
  }

  const handleThanks = () => {
    router.push('/settings/thanks')
  }

  const handleDebug = () => {
    router.push('/settings/debug')
  }

  const handleShareAppWithFriends = async () => {
    try {
      await Share.share({
        message: `Bridge the generational communication gap with ${APP_CONSTANTS.APP_NAME} - the AI-powered translator that actually understands Gen Z slang! Translate between Gen Z and standard English in both directions, browse an authentic slang dictionary.\n\n${APP_CONSTANTS.APP_NAME}: ${APP_CONSTANTS.APP_WEBSITE}`,
        url: APP_CONSTANTS.APP_WEBSITE,
        title: `${APP_CONSTANTS.APP_NAME} App`
      })
    } catch (error) {
      logger.log('Error sharing:', error)
    }
  }

  const handleToggleAutoPlay = () => {
    setAutoPlayAudio(!autoPlayAudio)
  }

  return (
    <View 
      style={[
        { flex: 1, backgroundColor: 'transparent'}, 
        { paddingTop: insets.top, paddingBottom: insets.bottom }
      ]}
    >
        {/* Sick svg-ish pattern background */}
        <ImageBackground 
          source={colorScheme === 'dark' 
            ? require('@/assets/images/i-like-food-light-260.png') 
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

        <ScrollView style={{ paddingTop: theme.verticalMargin }}>

          {/* Page Title */}
          <View style={{marginBottom: 5}}>
            <Text style={{
              fontSize: 24,
              fontWeight: 700,
              marginLeft: theme.paddingHorizontal * 1.25,
              marginBottom: 12,
              color: theme.text,
            }}>Settings</Text>
          </View>
        
          {/* About */}
          <Pressable 
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: theme.paddingHorizontal,
              paddingVertical: 16,
              minHeight: 70,
            }} 
            onPress={handleAbout}
          >
            <View style={{
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 16,
            }}>
              <Ionicons name="information-circle-outline" size={24} color={theme.textMuted} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 17,
                fontWeight: '400',
                marginBottom: 2,
                color: theme.text,
              }}>About</Text>
              <Text style={{
                fontSize: 14,
                color: theme.textMuted,
              }}>App info and version details</Text>
            </View>
          </Pressable>

          {/* Thanks */}
          <Pressable 
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: theme.paddingHorizontal,
              paddingVertical: 16,
              minHeight: 70,
            }} 
            onPress={handleThanks}
          >
            <View style={{
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 16,
            }}>
              <Ionicons name="thumbs-up-outline" size={24} color={theme.textMuted} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 17,
                fontWeight: '400',
                marginBottom: 2,
                color: theme.text,
              }}>Thanks</Text>
              <Text style={{
                fontSize: 14,
                color: theme.textMuted,
              }}>Shout outs for contributors</Text>
            </View>
          </Pressable>

          {/* Share */}
          <Pressable 
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: theme.paddingHorizontal,
              paddingVertical: 16,
              minHeight: 70,
            }} 
            onPress={handleShareAppWithFriends}
          >
            <View style={{
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 16,
            }}>
              <Ionicons name="share-outline" size={24} color={theme.textMuted} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 17,
                fontWeight: '400',
                marginBottom: 2,
                color: theme.text,
              }}>Share</Text>
              <Text style={{
                fontSize: 14,
                color: theme.textMuted,
              }}>Tell friends about this app</Text>
            </View>
          </Pressable>

          {/* Auto Play Speech Toggle */}
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: theme.paddingHorizontal,
              paddingVertical: 16,
              minHeight: 70,
            }}
            onPress={handleToggleAutoPlay}
          >
            <View style={{
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 16,
            }}>
              <Ionicons name="volume-high-outline" size={24} color={theme.textMuted} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 17,
                fontWeight: '400',
                marginBottom: 2,
                color: theme.text,
              }}>Auto Play Speech</Text>
              <Text style={{
                fontSize: 14,
                color: theme.textMuted,
              }}>Automatically read translations aloud</Text>
            </View>
            
            {/* Status Box */}
            <View style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: theme.borderRadius,
              borderWidth: 1,
              width: 50,
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: theme.primary,
              backgroundColor: autoPlayAudio ? theme.primary : 'transparent',
            }}>
              <Text style={{
                fontSize: 12,
                fontWeight: '500',
                color: autoPlayAudio ? '#FFFFFF' : theme.primary,
              }}>
                {autoPlayAudio ? 'ON' : 'OFF'}
              </Text>
            </View>
          </Pressable>

          {/* Debug Section - Only show if debug mode unlocked */}
          {debugModeUnlocked && (
            <Pressable 
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: theme.paddingHorizontal,
                paddingVertical: 16,
                minHeight: 70,
                backgroundColor: 'rgba(255, 0, 0, 0.1)', // Subtle red tint for debug
              }} 
              onPress={handleDebug}
            >
              <View style={{
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16,
              }}>
                <Ionicons name="bug-outline" size={24} color="#ff6b6b" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 17,
                  fontWeight: '400',
                  marginBottom: 2,
                  color: theme.text,
                }}>Debug Mode</Text>
                <Text style={{
                  fontSize: 14,
                  color: theme.textMuted,
                }}>Developer testing controls</Text>
              </View>
            </Pressable>
          )}

        </ScrollView>
    </View>
  )
}
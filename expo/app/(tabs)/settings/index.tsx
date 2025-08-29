import APP_CONSTANTS from '@/constants/appConstants';
import { router } from 'expo-router';
import { Pressable, ScrollView, Share, Text, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';import { Ionicons } from '@expo/vector-icons';
;

export default function SettingsScreen() {
  const colorScheme = useColorScheme()
  const theme = colorScheme === 'light' ? Colors.light : Colors.dark
  const insets = useSafeAreaInsets()

  const handleAbout = () => {
    router.push('/settings/about')
  }

  const handleShareAppWithFriends = async () => {
    try {
      await Share.share({
        message: `Bridge the generational communication gap with ${APP_CONSTANTS.APP_NAME} - the AI-powered translator that actually understands Gen Z slang! Translate between Gen Z and standard English in both directions, browse an authentic slang dictionary.\n\n${APP_CONSTANTS.APP_NAME}: ${APP_CONSTANTS.APP_WEBSITE}`,
        url: APP_CONSTANTS.APP_WEBSITE,
        title: `${APP_CONSTANTS.APP_NAME} App`
      });
    } catch (error) {
      logger.log('Error sharing:', error);
    }
  }

  const handleToggleAutoPlay = () => {
    // You'll handle this function
    console.log('Toggle auto play speech')
  }

  return (
    <ScrollView 
      style={[
        { flex: 1, backgroundColor: theme.background }, 
        { paddingTop: insets.top, paddingBottom: insets.bottom }
      ]}
    >
      <View style={{ paddingTop: theme.verticalMargin }}>
      
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
        </Pressable>
      </View>
    </ScrollView>
  )
}
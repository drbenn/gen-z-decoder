import APP_CONSTANTS from '@/constants/appConstants';
import { router } from 'expo-router';
import { Pressable, ScrollView, Share, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from 'react-native/Libraries/NewAppScreen';

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
        message: `🧠 Check out Fallacy Expert - the app that's making critical thinking training as addictive as gaming! Master 200 logical fallacies through interactive quizzes, daily challenges, and weekly gauntlets. Level up your reasoning skills and become a logic champion! 💪 \n\n ${APP_CONSTANTS.APP_NAME}: ${APP_CONSTANTS.APP_WEBSITE}`,
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
    <ScrollView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        
        {/* About */}
        <Pressable style={styles.settingItem} onPress={handleAbout}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>ℹ️</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>About</Text>
            <Text style={styles.description}>App info and version details</Text>
          </View>
        </Pressable>

        {/* Share */}
        <Pressable style={styles.settingItem} onPress={handleShareAppWithFriends}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>📤</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Share</Text>
            <Text style={styles.description}>Tell friends about this app</Text>
          </View>
        </Pressable>

        {/* Auto Play Speech Toggle */}
        <Pressable style={styles.settingItem} onPress={handleToggleAutoPlay}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🔊</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Auto Play Speech</Text>
            <Text style={styles.description}>Automatically read translations aloud</Text>
          </View>
        </Pressable>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 70,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '400',
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
  },
});
import APP_CONSTANTS from '@/constants/appConstants'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React from 'react'
import {
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Pressable,
  View,
  useColorScheme
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Colors } from 'react-native/Libraries/NewAppScreen'


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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.primary, paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={theme.primary} />
          <Text style={[styles.backText, {color: theme.primary}]}>Back</Text>
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContentContainer]}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text style={[styles.title, {color: theme.text}]}>About</Text>
          <Text style={[styles.description, {color: theme.text}]}>
            {APP_CONSTANTS.APP_NAME} is the two-way slang translator that bridges the communication gap between Gen Z and older generations, helping families understand each other better.
            {'\n'}{'\n'}
            Translate Gen Z slang to standard English and vice versa using AI-powered translation that understands context and nuance. Browse an extensive dictionary of authentic slang terms, save your favorites, and keep a history of translations. Whether you&apos;re a parent trying to decode your teen&apos;s texts or a Gen Z user explaining something to family, we&apos;ve got you covered - no cap!
          </Text>
          <Text 
            style={[styles.versionNumber, {color: theme.textMuted}]}
          >
            Version { APP_CONSTANTS.VERSION_NO }
          </Text>
        </View>

        {/* Developer Info */}
        <View>
          <Text style={[styles.sectionTitle, {color: theme.text}]}>Created by { APP_CONSTANTS.DEVELOPER_CO }</Text>
          
          <View style={styles.linksContainer}>
            <Pressable onPress={handleCompanyWebsitePress} style={styles.linkItem}>
              <Text style={[styles.linkIcon, {color: theme.text}]}>Website:</Text>
              <Text style={[styles.linkText, {color: theme.primary}]}>{APP_CONSTANTS.DEVELOPER_WEBSITE}</Text>
            </Pressable>
            <Pressable onPress={handleAppWebsitePress} style={styles.linkItem}>
              <Text style={[styles.linkIcon, {color: theme.text}]}>App Website:</Text>
              <Text style={[styles.linkText, {color: theme.primary}]}>{ APP_CONSTANTS.APP_WEBSITE }</Text>
            </Pressable>
            <Pressable onPress={handleEmailPress} style={styles.linkItem}>
              <Text style={[styles.linkIcon, {color: theme.text}]}>Email:</Text>
              <Text style={[styles.linkText, {color: theme.primary}]}>{ APP_CONSTANTS.DEVELOPER_EMAIL }</Text>
            </Pressable>
            <Pressable onPress={handlePrivacyPolicyPress} style={styles.linkItem}>
              <Text style={[styles.linkIcon, {color: theme.text}]}>Privacy Policy:</Text>
              <Text style={[styles.linkText, {color: theme.primary}]}>{ APP_CONSTANTS.APP_WEBSITE_APP_PRIVACY_POLICY }</Text>
            </Pressable>
            <Pressable onPress={handleTermsOfServicePress} style={styles.linkItem}>
              <Text style={[styles.linkIcon, {color: theme.text}]}>Terms of Service:</Text>
              <Text style={[styles.linkText, {color: theme.primary}]}>{ APP_CONSTANTS.APP_WEBSITE_APP_TERMS_OF_SERVICE }</Text>
            </Pressable>
          </View>
        </View>
        
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 24,
  },
  backText: {
    fontSize: 18,
    marginLeft: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingTop: 10,
    paddingBottom: 80, // Extra bottom padding for better UX
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },
  linkItem: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  linksContainer: {
    marginTop: 0,
  },
  linkIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  linkText: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  versionNumber: {
    fontSize: 12,
    lineHeight: 12,
    marginTop: 18,
    marginRight: 6,
    textAlign: 'right',
  },
  settingsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingsInfo: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingsSubtitle: {
    fontSize: 14,
  }
})
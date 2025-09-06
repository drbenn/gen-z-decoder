import { Colors } from '@/constants/Colors'
import { HeaderTitle } from '@react-navigation/elements'
import { Stack } from 'expo-router'
import { useColorScheme } from 'react-native'

export default function SettingsLayout() {
      const colorScheme = useColorScheme()
    const theme = colorScheme === 'light' ? Colors.light : Colors.dark
  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right',
      }}
    />
    // <Stack>
    //   <Stack.Screen
    //     name="index"
    //     options={{
    //       headerTitle: 'Settings',
    //       headerLargeTitle: true,
    //       headerShadowVisible: true,
    //       headerLargeTitleShadowVisible: true,
    //       headerStyle: { backgroundColor: theme.background}
    //     }}
    //   />
    // </Stack>
  )
}
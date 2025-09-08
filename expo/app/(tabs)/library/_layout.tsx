import { Colors } from '@/constants/Colors';
import { useAppState } from '@/state/useAppState';
import { Stack } from 'expo-router';
import { NativeEventEmitter, useColorScheme } from 'react-native';

export default function LibraryLayout() {
    const colorScheme = useColorScheme()
    const theme = colorScheme === 'light' ? Colors.light : Colors.dark

    const setLibrarySearchTerm = useAppState((state) => state.setLibrarySearchTerm)
    const clearLibrarySearchTerm = useAppState((state) => state.clearLibrarySearchTerm)
    
    // handles both text entry and also when text is cleared with 'x' willl send empty string, which is same result as clearLibrarySearchTerm
    const handleSetLibrarySearchTerm = (e) => {
      const searchTerm: string = e.nativeEvent.text
      setLibrarySearchTerm(searchTerm)
    }

    const handleClearLibrarySearchTerm = () => {
      clearLibrarySearchTerm()
    }    
    
  return (
    // <Stack 
    //   screenOptions={{ 
    //     headerShown: false,
    //     animation: 'slide_from_right',
    //   }}
    // />
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: 'Library',
          headerLargeTitle: true,
          headerShadowVisible: false,
          headerLargeTitleShadowVisible: false,
          headerStyle: { backgroundColor: theme.background},
          headerTitleStyle: { color: theme.text},
          headerSearchBarOptions: {
            textColor: theme.text,
            hintTextColor: theme.textMuted,
            headerIconColor: theme.textMuted,
            placeholder: 'Search Library',
            hideWhenScrolling: false,
            onChangeText(e) {
              handleSetLibrarySearchTerm(e)
            },
            onClose() {
              handleClearLibrarySearchTerm()
            },
          }
        }}
      />
    </Stack>
  );
}
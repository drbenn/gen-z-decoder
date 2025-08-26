import { Stack } from 'expo-router';

export default function TranslateLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" /> {/* Input screen */}
      <Stack.Screen name="result" /> {/* Output screen */}
    </Stack>
  );
}
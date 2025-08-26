import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as Speech from 'expo-speech';

export default function TranslateInputScreen() {
  
  const testTTS = () => {
    Speech.speak("that's bitch made bruh", {
      language: 'en-US',
      pitch: 1.0,
      rate: 0.8,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Translate Input</Text>
      <Text style={styles.subtitle}>Mode toggle, input field, translate button</Text>
      
      <TouchableOpacity onPress={testTTS} style={{ marginTop: 20, padding: 10, backgroundColor: '#ddd' }}>
        <Text>Test TTS</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 8 },
});
import { ScrollView, StyleSheet, Text, Pressable, View } from 'react-native';
import * as Speech from 'expo-speech';
import { useAppState } from '@/state/useAppState';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';


export default function TranslateResultScreen() {
    const insets = useSafeAreaInsets();
  
    // ✅ State values that trigger re-renders
    const isTranslating = useAppState((state) => state.isTranslating);
    const currentTranslation = useAppState((state) => state.currentTranslation);
    const autoPlayAudio = useAppState((state) => state.autoPlayAudio);
    const ttsEnabled = useAppState((state) => state.ttsEnabled);
    
    // ✅ Action functions (stable references)
    const setTranslating = useAppState((state) => state.setTranslating);

    const handleTranslateAgain = () => {
      setTranslating(false);
      router.push('/(tabs)/translate')
    };

    const handleShare = () => {
      // TODO: Share functionality
      console.log('Share pressed');
    };

    const handleTTS = () => {
      // TODO: Text-to-speech functionality
      console.log('TTS pressed');
    };

    const testTTS = () => {
      Speech.speak("that's bitch made bruh", {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.8,
      });
    };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      
      {/* Original Text (Small) */}
      <View style={styles.originalContainer}>
        <Text style={styles.originalLabel}>Original:</Text>
        <Text style={styles.originalText}>
          {currentTranslation?.originalText || "Sample original text here..."}
        </Text>
      </View>

      <Pressable onPress={testTTS} style={{ marginTop: 20, padding: 10, backgroundColor: '#ddd' }}>
        <Text>Test TTS</Text>
      </Pressable>

      {/* Translated Text (Main Focus) */}
      <View style={styles.translatedContainer}>
        {isTranslating ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        ) : (
          <ScrollView style={styles.translatedScroll}>
            <Text style={styles.translatedText}>
              {currentTranslation?.translatedText || "Sample translated text will appear here with typewriter effect..."}
            </Text>
          </ScrollView>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        
        {/* TTS Button */}
        <Pressable 
          style={[styles.actionButton, !ttsEnabled && styles.disabledButton]}
          onPress={handleTTS}
          disabled={!ttsEnabled || isTranslating}
        >
          <Text style={styles.actionButtonText}>
            🔊 {autoPlayAudio ? 'Playing...' : 'Play Audio'}
          </Text>
        </Pressable>

        {/* Share Button */}
        <Pressable 
          style={styles.actionButton}
          onPress={handleShare}
          disabled={isTranslating}
        >
          <Text style={styles.actionButtonText}>📤 Share</Text>
        </Pressable>
      </View>

      {/* Translate Again Button */}
      <Pressable 
        style={styles.translateAgainButton}
        onPress={handleTranslateAgain}
      >
        <Text style={styles.translateAgainText}>TRANSLATE AGAIN</Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  originalContainer: {
    marginBottom: 20,
  },
  originalLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  originalText: {
    fontSize: 14,
    color: '#333',
    fontStyle: 'italic',
  },
  translatedContainer: {
    flex: 1,
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  translatedScroll: {
    flex: 1,
  },
  translatedText: {
    fontSize: 18,
    color: '#000',
    lineHeight: 24,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#ddd',
    padding: 12,
    borderRadius: 5,
    flex: 0.4,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.5,
  },
  actionButtonText: {
    fontSize: 14,
  },
  translateAgainButton: {
    backgroundColor: '#666',
    padding: 15,
    alignItems: 'center',
  },
  translateAgainText: {
    color: '#fff',
    fontSize: 16,
  },
});
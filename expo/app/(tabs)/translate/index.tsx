import { TranslationMode } from '@/types/translate.types';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'


export default function TranslateInputScreen() {
  const insets = useSafeAreaInsets()
  const [mode, setMode] = useState<TranslationMode>(TranslationMode.GENZ_TO_ENGLISH);
  const [inputText, setInputText] = useState('');
  const [autoPlayAudio, setAutoPlayAudio] = useState(false);

  const toggleMode = () => {
    setMode(mode === TranslationMode.GENZ_TO_ENGLISH ? TranslationMode.ENGLISH_TO_GENZ : TranslationMode.GENZ_TO_ENGLISH);
  };

  const handleTranslate = () => {
    console.log('Translate pressed:', { mode, inputText, autoPlayAudio });
    // TODO: Connect to translation flow
  };

  const getPlaceholder = () => {
    return mode === TranslationMode.GENZ_TO_ENGLISH 
      ? 'Enter Gen Z text to translate...' 
      : 'Enter English text to translate...';
  };

  return (
    <View style={styles.container}>
      
      {/* Mode Toggle */}
      <View style={[styles.toggleContainer, {paddingTop: insets.top, paddingBottom: insets.bottom}]}>
        <Pressable 
          style={[styles.toggleButton, mode === TranslationMode.GENZ_TO_ENGLISH && styles.activeToggle]}
          onPress={() => setMode(TranslationMode.GENZ_TO_ENGLISH)}
        >
          <Text>Gen Z → English</Text>
        </Pressable>
        <Pressable 
          style={[styles.toggleButton, mode === TranslationMode.ENGLISH_TO_GENZ && styles.activeToggle]}
          onPress={() => setMode(TranslationMode.ENGLISH_TO_GENZ)}
        >
          <Text>English → Gen Z</Text>
        </Pressable>
      </View>

      {/* Text Input */}
      <TextInput
        style={styles.textInput}
        placeholder={getPlaceholder()}
        value={inputText}
        onChangeText={setInputText}
        multiline
        numberOfLines={6}
      />

      {/* Auto-play Audio Toggle */}
      <View style={styles.audioToggleContainer}>
        <Text>Auto-play audio:</Text>
        <TouchableOpacity 
          style={[styles.audioToggle, autoPlayAudio && styles.audioToggleActive]}
          onPress={() => setAutoPlayAudio(!autoPlayAudio)}
        >
          <Text>{autoPlayAudio ? 'ON' : 'OFF'}</Text>
        </TouchableOpacity>
      </View>

      {/* Translate Button */}
      <TouchableOpacity 
        style={styles.translateButton}
        onPress={handleTranslate}
      >
        <Text style={styles.translateButtonText}>TRANSLATE</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#ddd',
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: '#999',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    minHeight: 120,
    marginBottom: 20,
  },
  audioToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  audioToggle: {
    marginLeft: 10,
    padding: 8,
    backgroundColor: '#ddd',
    alignItems: 'center',
  },
  audioToggleActive: {
    backgroundColor: '#999',
  },
  translateButton: {
    backgroundColor: '#666',
    padding: 15,
    alignItems: 'center',
  },
  translateButtonText: {
    color: '#fff',
  },
});
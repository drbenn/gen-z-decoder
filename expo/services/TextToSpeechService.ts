import * as Speech from 'expo-speech'


export class TextToSpeechService {

  static async handleTTS(speechText: string | null): Promise<void> {
    try {
      const isSpeaking = await Speech.isSpeakingAsync()
  
      if (isSpeaking) return
  
      // const availableVoices = await Speech.getAvailableVoicesAsync()
      // const englishEnhancedVoices = availableVoices.filter((voice: any) => voice.language.includes('en-') && voice.quality === 'Enhanced')
      //   .map((voice: any) => voice.identifier)
      // logger.log('englishEnhancedVoices: ', englishEnhancedVoices)
      
      Speech.speak(speechText ? speechText : 'Something went wrong! The struggle is real...', {
        language: 'en-US',
        pitch: 1.4,
        rate: 0.75,
        // voice: 'en-gb-x-rjs-local'   // if device doesnt have specific voice should fall back to its default, however, better not to rely on fallback and use default voice.
      })
    } catch (error) {
      console.error('Error clearing device ID:', error);
    }

  }

}

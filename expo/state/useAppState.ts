import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { adSlice, AdSlice } from './slices/adSlice';
import { translateSlice, TranslateSlice } from './slices/translateSlice';
import { appControlSlice, AppControlSlice } from './slices/appControlSlice';
// import { librarySlice, LibrarySlice } from './slices/librarySlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AppState = AdSlice & TranslateSlice & AppControlSlice;

export const useAppState = create<AppState>()(
  persist(
    (...a) => ({
      ...adSlice(...a),
      ...translateSlice(...a),
      ...appControlSlice(...a),
      // ...librarySlice(...a),
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage), // ✅ Configure AsyncStorage for React Native
      partialize: (state) => ({
        translationCount: state.translationCount,
        lastInterstitialAt: state.lastInterstitialAt,
        autoPlayAudio: state.autoPlayAudio,
        ttsEnabled: state.ttsEnabled,
        translationHistory: state.translationHistory,
        // dictionaryTerms: state.dictionaryTerms
      }),
    }
  )
);
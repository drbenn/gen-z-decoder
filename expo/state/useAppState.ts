import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { adSlice, AdSlice } from './slices/adSlice';
import { translateSlice, TranslateSlice } from './slices/translateSlice';
import { appControlSlice, AppControlSlice } from './slices/appControlSlice';
import { librarySlice, LibrarySlice } from './slices/librarySlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AppState = AdSlice & TranslateSlice & AppControlSlice & LibrarySlice;

export const useAppState = create<AppState>()(
  persist(
    (...a) => ({
      ...adSlice(...a),
      ...translateSlice(...a),
      ...appControlSlice(...a),
      ...librarySlice(...a)
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => AsyncStorage), // ✅ Configure AsyncStorage for React Native
      partialize: (state) => ({
        // ad slice
        translationCount: state.translationCount,

        // app control slice
        isPremiumMember: state.isPremiumMember,
        debugModeUnlocked: state.debugModeUnlocked,
        debugModeActive: state.debugModeActive,
        autoPlayAudio: state.autoPlayAudio,

        // library slice
        dictionaryTerms: state.dictionaryTerms,
        

        // translate slice
        translationHistory: state.translationHistory,
        usageInfo: state.usageInfo
      }),
    }
  )
);
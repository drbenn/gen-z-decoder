import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { adSlice, AdSlice } from './slices/adSlice';
import { translateSlice, TranslateSlice } from './slices/translateSlice';
import { appControlSlice, AppControlSlice } from './slices/appControlSlice';

export type AppState = AdSlice & TranslateSlice & AppControlSlice;

export const useAppState = create<AppState>()(
  persist(
    (...a) => ({
      ...adSlice(...a),
      ...translateSlice(...a),
      ...appControlSlice(...a),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        translationCount: state.translationCount,
        lastInterstitialAt: state.lastInterstitialAt,
        autoPlayAudio: state.autoPlayAudio,
        ttsEnabled: state.ttsEnabled,
        translationHistory: state.translationHistory,
      }),
    }
  )
);
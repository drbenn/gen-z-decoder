import { StateCreator } from 'zustand';

export interface AdSlice {
  // State
  translationCount: number;
  lastInterstitialAt: number;
  isInterstitialReady: boolean;
  
  // Actions
  incrementTranslationCount: () => void;
  checkInterstitialReady: () => boolean;
  markInterstitialShown: () => void;
  resetAdState: () => void;
}

export const adSlice: StateCreator<
  any, // Full app state - avoid circular dependency
  [],
  [],
  AdSlice
> = (set, get) => ({
  // Initial state
  translationCount: 0,
  lastInterstitialAt: 0,
  isInterstitialReady: false,

  // Actions
  incrementTranslationCount: () => {
    const { translationCount } = get();
    const newCount = translationCount + 1;
    
    set({ 
      translationCount: newCount,
      isInterstitialReady: newCount > 0 && newCount % 2 === 0 // Every 2 translations
    });
  },

  checkInterstitialReady: () => {
    const { translationCount, lastInterstitialAt } = get();
    return translationCount > 0 && 
          translationCount % 2 === 0 && 
          translationCount > lastInterstitialAt;
  },

  markInterstitialShown: () => {
    const { translationCount } = get();
    set({ 
      lastInterstitialAt: translationCount,
      isInterstitialReady: false
    });
  },

  resetAdState: () => {
    set({
      translationCount: 0,
      lastInterstitialAt: 0,
      isInterstitialReady: false
    });
  },
});
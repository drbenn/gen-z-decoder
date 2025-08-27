import { TranslateResponse, TranslationHistoryItem } from '@/types/translate.types';
import { StateCreator } from 'zustand';


export interface TranslateSlice {
  
  // Current Translation State
  isTranslating: boolean;
  currentTranslation: TranslateResponse | null;
  error: string | null;
  
  // History
  translationHistory: TranslationHistoryItem[];
  
  // Usage Info
  usageInfo: {
    translationsUsedToday: number;
    dailyLimit: number;
    remainingTranslations: number;
    isPremium: boolean;
  };

  // Actions
  setTranslating: (translating: boolean) => void;
  setCurrentTranslation: (translation: TranslateResponse | null) => void;
  setError: (error: string | null) => void;
  addToHistory: (item: TranslationHistoryItem) => void;
  toggleFavorite: (id: string) => void;
  clearHistory: () => void;
  updateUsageInfo: (usageInfo: TranslateResponse['usageInfo']) => void;
}

export const translateSlice: StateCreator<
  any, // Full app state - avoid circular dependency  
  [],
  [],
  TranslateSlice
> = (set, get) => ({
  // Initial state
  isTranslating: false,
  currentTranslation: null,
  error: null,
  translationHistory: [],
  usageInfo: {
    translationsUsedToday: 0,
    dailyLimit: 10,
    remainingTranslations: 10,
    isPremium: false,
  },

  // Actions
  setTranslating: (translating: boolean) => {
    set({ isTranslating: translating });
  },

  setCurrentTranslation: (translation: TranslateResponse | null) => {
    set({ currentTranslation: translation });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  addToHistory: (item: TranslationHistoryItem) => {
    const { translationHistory } = get();
    set({ 
      translationHistory: [item, ...translationHistory] // Latest first
    });
  },

  toggleFavorite: (id: string) => {
    const { translationHistory } = get();
    set({
      translationHistory: translationHistory.map((item: TranslationHistoryItem) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    });
  },

  clearHistory: () => {
    set({ translationHistory: [] });
  },

  updateUsageInfo: (usageInfo) => {
    set({ usageInfo });
  },
});
import { TranslateResponse, TranslationHistoryItem } from '@/types/translate.types';
import { StateCreator } from 'zustand';


export interface TranslateSlice {
  
  // Current Translation State
  isTranslating: boolean;
  currentTranslation: TranslateResponse | null;
  translateError: string | null;
  
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
  setTranslateError: (error: string | null) => void;
  addToHistory: (item: TranslationHistoryItem) => void;
  setHistoryFavorite: (id: string, favorite: boolean) => void;
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
  translateError: null,
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

  setTranslateError: (error: string | null) => {
    set({ error });
  },

  addToHistory: (item: TranslationHistoryItem) => {
    const { translationHistory } = get();
    set({ 
      translationHistory: [item, ...translationHistory] // Latest first
    });
  },

  setHistoryFavorite: (id: string, favorite: boolean) => {
    const currentItem: TranslationHistoryItem[] = get().translationHistory
    const updatedItems = currentItem.map((item: TranslationHistoryItem) => {
      return item.id === id ? {...item, isFavorite: favorite} : item
    })
    set({ translationHistory: updatedItems })
  },

  clearHistory: () => {
    set({ translationHistory: [] });
  },

  updateUsageInfo: (usageInfo) => {
    set({ usageInfo });
  },
});
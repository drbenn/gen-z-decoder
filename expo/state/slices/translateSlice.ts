import APP_CONSTANTS from '@/constants/appConstants'
import { TranslateResponse, TranslationHistoryItem } from '@/types/translate.types'
import { StateCreator } from 'zustand'


export interface TranslateSlice {
  
  // Current Translation State
  isTranslating: boolean
  currentTranslation: TranslateResponse | null
  translateError: string | null
  
  // History
  translationHistory: TranslationHistoryItem[]
  
  // Usage Info
  usageInfo: {
    translationsUsedToday: number
    dailyLimit: number
    remainingTranslations: number
    isPremium: boolean
  }

  // Actions
  setTranslating: (translating: boolean) => void
  setCurrentTranslation: (translation: TranslateResponse | null) => void
  setTranslateError: (error: string | null) => void
  addToHistory: (item: TranslationHistoryItem) => void
  clearAllHistory: () => void
  setHistoryFavorite: (id: string, favorite: boolean) => void
  clearHistory: () => void
  removeOneFromHistory: (id: string) => void
  updateUsageInfo: (usageInfo: TranslateResponse['usageInfo']) => void
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
    dailyLimit: APP_CONSTANTS.FREE_MEMBER_DAILY_TRANSLATION_LIMIT,
    remainingTranslations: APP_CONSTANTS.FREE_MEMBER_DAILY_TRANSLATION_LIMIT,
    isPremium: false,
  },

  // Actions
  setTranslating: (translating: boolean) => {
    set({ isTranslating: translating })
  },

  setCurrentTranslation: (translation: TranslateResponse | null) => {
    set({ currentTranslation: translation })
  },

  setTranslateError: (error: string | null) => {
    set({ translateError: error })
  },

  addToHistory: (item: TranslationHistoryItem) => {
    const { translationHistory } = get()    
    set({ 
      translationHistory: [item, ...translationHistory] // Latest first
    })
  },

  clearAllHistory: () => {
    set({ 
      translationHistory: []
    })
  },

  removeOneFromHistory: (id: string) => {
    const { translationHistory } = get()
    set({
      translationHistory: translationHistory.filter((item: TranslationHistoryItem) => item.id !== id)
    })
  },

  setHistoryFavorite: (id: string, favorite: boolean) => {
    const currentItem: TranslationHistoryItem[] = get().translationHistory
    const updatedItems = currentItem.map((item: TranslationHistoryItem) => {
      return item.id === id ? {...item, isFavorite: favorite} : item
    })
    set({ translationHistory: updatedItems })
  },

  clearHistory: () => {
    set({ translationHistory: [] })
  },

  updateUsageInfo: (usageInfo) => {
    set({ usageInfo })
  },
})
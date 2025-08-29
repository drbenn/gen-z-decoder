import { DictionaryEntry } from '@/types/dictionary.types';
import { StateCreator } from 'zustand';

export interface LibrarySlice {
  dictionaryTerms: DictionaryEntry[];
  
  // Actions
  setDictionaryTerms: (enabled: DictionaryEntry[]) => void;
  setDictionaryFavorite: (favorite: boolean) => void;
}

export const appControlSlice: StateCreator<
  any, // Full app state - avoid circular dependency
  [],
  [],
  LibrarySlice
> = (set, get) => ({
  // Initial state
  dictionaryTerms: [],

  // Actions
  setDictionaryTerms: (dictionaryTerms: DictionaryEntry[]) => {
    set({ dictionaryTerms: dictionaryTerms });
  },

  setDictionaryFavorite: (enabled: boolean) => {
    // set({ ttsEnabled: enabled });
  },


});
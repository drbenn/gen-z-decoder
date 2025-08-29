import { DictionaryEntry } from '@/types/dictionary.types'
import { StateCreator } from 'zustand'

export interface LibrarySlice {
  dictionaryTerms: DictionaryEntry[]
  isFavoritesChipActive: boolean
  
  // Actions
  setDictionaryTerms: (enabled: DictionaryEntry[]) => void
  setDictionaryFavorite: (id: string, favorite: boolean) => void
  setIsFavoritesChipActive: (active: boolean) => void
}

export const librarySlice: StateCreator<
  any, // Full app state - avoid circular dependency
  [],
  [],
  LibrarySlice
> = (set, get) => ({
  // Initial state
  dictionaryTerms: [],
  isFavoritesChipActive: false,

  // Actions
  setDictionaryTerms: (dictionaryTerms: DictionaryEntry[]) => {
    set({ dictionaryTerms: dictionaryTerms })
  },

  setDictionaryFavorite: (id: string, favorite: boolean) => {
    const currentTerms: DictionaryEntry[] = get().dictionaryTerms
    const updatedTerms = currentTerms.map((term: DictionaryEntry) => {
      return term.id === id ? {...term, is_favorite: favorite} : term
    })
    set({ dictionaryTerms: updatedTerms })
  },
  setIsFavoritesChipActive: (active: boolean) => {
    set({ isFavoritesChipActive: active })
  },

})

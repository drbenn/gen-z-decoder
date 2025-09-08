import { StateCreator } from 'zustand'

export interface AppControlSlice {
  // General UI State
  isAppLoading: boolean

  // Audio Settings
  autoPlayAudio: boolean

  // Premium Member
  isPremiumMember: boolean
  

  // debug state
  debugModeUnlocked: boolean
  debugModeActive: boolean
  
  // Actions
  setAppLoading: (loading: boolean) => void

  setAutoPlayAudio: (enabled: boolean) => void

  setIsPremiumMember: (premium: boolean) => void

  setDebugModeUnlocked: () => void
  toggleDebugMode: () => void
}

export const appControlSlice: StateCreator<
  any, // Full app state - avoid circular dependency
  [],
  [],
  AppControlSlice
> = (set, get) => ({
  isAppLoading: false,

  // Audio Settings
  autoPlayAudio: true,

  isPremiumMember: false,

  debugModeUnlocked: false,
  debugModeActive: false,

  // Actions
  setAppLoading: (loading: boolean) => {
    set({ isAppLoading: loading })
  },

  setAutoPlayAudio: (enabled: boolean) => {
    set({ autoPlayAudio: enabled })
  },

  setIsPremiumMember: (premium: boolean) => {
    set({ isPremiumMember: premium })
  },

  setDebugModeUnlocked: () => {
    set({ debugModeUnlocked: true })
  },
  
  toggleDebugMode: () => {
    const { debugModeActive } = get()
    set({ debugModeActive: !debugModeActive })
  },
})
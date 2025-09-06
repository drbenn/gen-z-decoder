import { StateCreator } from 'zustand'

export interface AppControlSlice {
  // Audio Settings
  autoPlayAudio: boolean
  ttsEnabled: boolean

  // Premium Member
  isPremiumMember: boolean
  
  // General UI State
  isAppLoading: boolean

  // debug state
  debugModeUnlocked: boolean
  debugModeActive: boolean
  
  // Actions
  setAutoPlayAudio: (enabled: boolean) => void
  setTtsEnabled: (enabled: boolean) => void
  setAppLoading: (loading: boolean) => void

  setDebugModeUnlocked: () => void;
  toggleDebugMode: () => void;
}

export const appControlSlice: StateCreator<
  any, // Full app state - avoid circular dependency
  [],
  [],
  AppControlSlice
> = (set, get) => ({
  // Audio Settings
  autoPlayAudio: true,
  ttsEnabled: true,

  isPremiumMember: false,

  isAppLoading: false,

  debugModeUnlocked: false,
  debugModeActive: false,

  // Actions
  setAutoPlayAudio: (enabled: boolean) => {
    set({ autoPlayAudio: enabled })
  },

  setTtsEnabled: (enabled: boolean) => {
    set({ ttsEnabled: enabled })
  },

  setAppLoading: (loading: boolean) => {
    set({ isAppLoading: loading })
  },

  setDebugModeUnlocked: () => {
    set({ debugModeUnlocked: true });
  },
  toggleDebugMode: () => {
    const { debugModeActive } = get()
    set({ debugModeActive: !debugModeActive });
  },

  setIsPremiumMember: (premium: boolean) => {
    set({ isPremiumMember: premium });
  },
})
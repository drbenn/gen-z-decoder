import { StateCreator } from 'zustand';

export interface AppControlSlice {
  // Audio Settings
  autoPlayAudio: boolean;
  ttsEnabled: boolean;
  
  // General UI State
  isAppLoading: boolean;
  
  // Actions
  setAutoPlayAudio: (enabled: boolean) => void;
  setTtsEnabled: (enabled: boolean) => void;
  setAppLoading: (loading: boolean) => void;
}

export const appControlSlice: StateCreator<
  any, // Full app state - avoid circular dependency
  [],
  [],
  AppControlSlice
> = (set, get) => ({
  // Initial state
  autoPlayAudio: false,
  ttsEnabled: true,
  isAppLoading: false,

  // Actions
  setAutoPlayAudio: (enabled: boolean) => {
    set({ autoPlayAudio: enabled });
  },

  setTtsEnabled: (enabled: boolean) => {
    set({ ttsEnabled: enabled });
  },

  setAppLoading: (loading: boolean) => {
    set({ isAppLoading: loading });
  },
});
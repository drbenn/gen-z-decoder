import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AppControlState {
  // Basic app state
  isLoading: boolean;
  notificationsEnabled: boolean;
  notificationTime: string;

  // 🎮 DEBUG SYSTEM STATE
  debugModeUnlocked: boolean;  // Easter egg unlocks this option
  debugModeActive: boolean;    // User can toggle this once unlocked
  quizCheatsEnabled: boolean;  // Toggle for in-quiz debugging helpers
  
  // Basic actions
  setLoading: (loading: boolean) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setNotificationTime: (time: string) => void;

  // 🎮 DEBUG SYSTEM ACTIONS
  unlockDebugMode: () => void;
  toggleDebugMode: () => void;
  toggleQuizCheats: () => void;
}

const useAppControlState = create<AppControlState>()(
  persist(
    (set) => ({
      // Initial state
      isLoading: false,
      notificationsEnabled: false,
      notificationTime: '09:00',
      debugModeUnlocked: false, // 🎮 EASTER EGG: Hidden by default
      debugModeActive: false,   // 🎮 USER CONTROL: Can toggle once unlocked
      quizCheatsEnabled: false, // 🎮 QUIZ HELPERS: Can toggle once debug mode active
      
      // Actions
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setNotificationsEnabled: (enabled: boolean) => set({ notificationsEnabled: enabled }),
      setNotificationTime: (time: string) => set({ notificationTime: time }),

      // 🎮 EASTER EGG: Unlock debug option in settings
      unlockDebugMode: () => set({ debugModeUnlocked: true }),

      // 🎮 USER CONTROL: Toggle debug mode on/off
      toggleDebugMode: () => set((state) => ({ 
        debugModeActive: !state.debugModeActive,
        // Disable quiz cheats when debug mode is turned off
        quizCheatsEnabled: !state.debugModeActive ? false : state.quizCheatsEnabled
      })),

      // 🎮 QUIZ HELPERS: Toggle quiz cheats on/off
      toggleQuizCheats: () => set((state) => ({ 
        quizCheatsEnabled: !state.quizCheatsEnabled 
      })),
    }),
    {
      name: 'app-control-state',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useAppControlState;
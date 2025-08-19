import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AdState {
  // 🔥 SIMPLE COUNTER (For INTERSTITIAL ads only!)
  quizCompletionCounter: number;
  
  // 🏆 IAP PURCHASE TRACKING
  adsPurchased: boolean;  // Track if user bought ad removal
  
  // 🎯 SIMPLE CONFIGURATION  
  showAdEvery: number;        // Show interstitial every X quiz completions (default: 3)
  
  // 🏆 SIMPLE ACTIONS
  incrementQuizCounter: () => void;
  shouldShowInterstitialAd: () => boolean;
  shouldShowBannerAd: () => boolean;
  recordAdShown: () => void;
  resetCounters: () => void;
  
  // 🔥 IAP ACTIONS
  setAdsPurchased: (purchased: boolean) => void;
  hasAdsPurchased: () => boolean;
  
  // 🔧 OPTIONAL: Easy configuration updates
  updateShowAdEvery: (count: number) => void;
}

const useAdState = create<AdState>()(
  persist(
    (set, get) => ({
      // 🚀 INITIAL STATE
      quizCompletionCounter: 0,
      
      // 🏆 IAP STATE
      adsPurchased: false,  // Default: ads not purchased
      
      // 🏆 CONFIGURATION
      showAdEvery: 3,  // Every 3 quiz completions for INTERSTITIAL
      
      // 🔥 ACTIONS
      incrementQuizCounter: () => {
        set(state => ({
          quizCompletionCounter: state.quizCompletionCounter + 1
        }));
        
        // const newCount = get().quizCompletionCounter;
        // const threshold = get().showAdEvery;
        // logger.log(`🔥 HULKAMANIA: Quiz completion count: ${newCount}/${threshold}`);
      },
      
      // 🎯 INTERSTITIAL AD LOGIC (only checks quiz count and purchase status)
      shouldShowInterstitialAd: () => {
        const state = get();
        
        // 🚨 FIRST CHECK: If user bought ad removal, NEVER show ads!
        if (state.adsPurchased) {
          // logger.log('🏆 HULKAMANIA: Interstitial blocked - ads purchased!');
          return false;
        }
        
        // 🎯 ONLY CHECK: Quiz completion threshold
        if (state.quizCompletionCounter < state.showAdEvery) {
          // const remaining = state.showAdEvery - state.quizCompletionCounter;
          // logger.log(`⏳ HULKAMANIA: Need ${remaining} more quiz completions for interstitial`);
          return false;
        }
        
        // logger.log(`🎯 HULKAMANIA: READY TO SHOW INTERSTITIAL AD!`);
        return true;
      },
      
      // 🔥 BANNER AD LOGIC (always shows unless purchased!)
      shouldShowBannerAd: () => {
        const state = get();
        
        if (state.adsPurchased) {
          // No log here - handled in component
          return false;
        }
        
        // No log here either - handled in component  
        return true;
      },
      
      recordAdShown: () => {
        // Reset quiz counter - ready for next ad cycle!
        set(state => ({
          quizCompletionCounter: 0
        }));
        
        // logger.log(`🏆 HULKAMANIA: INTERSTITIAL AD SHOWN! Counter reset - ready for next cycle!`);
      },

      resetCounters: () => {
        set({ 
          quizCompletionCounter: 0,
        });
        // logger.log('🔄 Quiz counter reset - UNLIMITED REVENUE MODE READY!');
      },
      
      // 🔥 IAP ACTIONS
      setAdsPurchased: (purchased: boolean) => {
        set({ adsPurchased: purchased });
        // logger.log(`🏆 : Ads purchased status set to: ${purchased}`);
      },
      
      hasAdsPurchased: () => {
        const purchased = get().adsPurchased;
        return purchased;
      },
      
      updateShowAdEvery: (count: number) => {
        set({ showAdEvery: count });
        // logger.log(`⚙️ Show ad every ${count} quiz completions - REVENUE MAXIMIZED!`);
      }
    }),
    {
      name: 'ad-state',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        adsPurchased: state.adsPurchased,  // 🔥 PERSIST IAP STATUS
        showAdEvery: state.showAdEvery,
      })
    }
  )
);

export default useAdState;
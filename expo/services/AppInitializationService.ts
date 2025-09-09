import { useAppState } from '@/state/useAppState'
import adInterstitialService from '@/services/ad/AdInterstitialService'
import logger from '@/utils/logger'

class AppInitializationService {
  private static instance: AppInitializationService
  private isInitialized = false
  private isInitializing = false

  static getInstance(): AppInitializationService {
    if (!AppInitializationService.instance) {
      AppInitializationService.instance = new AppInitializationService()
    }
    return AppInitializationService.instance
  }

  async initialize(): Promise<void> {
    console.log('=== APP STARTUP BEGIN ===')
    if (this.isInitialized || this.isInitializing) {
      return
    }

    this.isInitializing = true
    const { setAppLoading } = useAppState.getState()
    
    try {
      setAppLoading(true)
      
      console.log('Zustand rehydration check...')
      // Wait for Zustand to finish rehydrating from AsyncStorage
      await this.waitForRehydration()

      // Initialize all app services in parallel
      await Promise.all([
        this.initializeDictionary(),
        this.initializeAdService(),
        // Add more initialization tasks here as needed
        // this.initializeAnalytics(),
        // this.initializePurchases(),
        // this.checkAppUpdates(),
      ])

      logger.log('🚀 App initialization complete')
      this.isInitialized = true
    } catch (error) {
      logger.error('💥 App initialization failed:', error)
    } finally {
      setAppLoading(false)
      this.isInitializing = false
    }
  }

  private async waitForRehydration(): Promise<void> {
    return new Promise((resolve) => {
      const checkRehydration = () => {
        const state = useAppState.getState()
        
        // If we have any persisted data, rehydration is likely complete
        if (state.isPremiumMember !== undefined && state.translationHistory !== undefined) {
          resolve()
        } else {
          // Wait a bit longer for rehydration
          setTimeout(checkRehydration, 50)
        }
      }

      // Start checking after a small delay
      setTimeout(checkRehydration, 100)
    })
  }

  private async initializeDictionary(): Promise<void> {
    try {
      const { dictionaryTerms, setDictionaryTerms } = useAppState.getState()
      
      if (!dictionaryTerms || dictionaryTerms.length === 0) {
        logger.log('📚 Loading dictionary from JSON file...')
        const dictionaryData = await this.loadDictionaryAsync()
        setDictionaryTerms(dictionaryData)
        logger.log(`📚 Dictionary loaded: ${dictionaryData.length} terms`)
      } else {
        logger.log(`📚 Dictionary already in state: ${dictionaryTerms.length} terms`)
      }
    } catch (error) {
      logger.error('💥 Failed to initialize dictionary:', error)
      useAppState.getState().setDictionaryTerms([])
    }
  }

  private async initializeAdService(): Promise<void> {
    try {
      logger.log('🎯 Initializing ad service...')
      const success = await adInterstitialService.initialize()
      if (success) {
        logger.log('🎯 Ad service initialized successfully')
      } else {
        logger.log('🎯 Ad service initialization skipped (dev mode or unavailable)')
      }
    } catch (error) {
      logger.error('💥 Failed to initialize ad service:', error)
    }
  }

  private async loadDictionaryAsync(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      // Use setTimeout to make the require() call async and not block the main thread
      setTimeout(() => {
        try {
          const dictionaryData = require('@/assets/data/dictionary.json')
          resolve(dictionaryData)
        } catch (error) {
          reject(error)
        }
      }, 0)
    })
  }

  isReady(): boolean {
    return this.isInitialized
  }

  // Add more initialization methods as needed:
  // private async initializeAnalytics(): Promise<void> { ... }
  // private async initializePurchases(): Promise<void> { ... }
  // private async checkAppUpdates(): Promise<void> { ... }
}

const appInitializationService = new AppInitializationService()
export default appInitializationService
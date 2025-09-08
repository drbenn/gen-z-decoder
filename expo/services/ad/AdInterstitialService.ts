import AD_UNIT_IDS from '@/constants/AdMob'
import logger from '@/utils/logger'
// Conditional import to avoid errors in development
let InterstitialAd: any
let AdEventType: any

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const GoogleMobileAds = require('react-native-google-mobile-ads')
  InterstitialAd = GoogleMobileAds.InterstitialAd
  AdEventType = GoogleMobileAds.AdEventType
} catch (error) {
  logger.log('🚨 Google Mobile Ads not available:', error)
}

class AdInterstitialService {
  private static instance: AdInterstitialService
  private interstitial: any = null
  private isLoaded = false
  private isInitialized = false
  private pendingShowPromise: {
    resolve: (success: boolean) => void
    reject: (error: Error) => void
  } | null = null

  static getInstance(): AdInterstitialService {
    if (!AdInterstitialService.instance) {
      AdInterstitialService.instance = new AdInterstitialService()
    }
    return AdInterstitialService.instance
  }

  // 🚀 Initialize the ad service
  async initialize(): Promise<boolean> {
    if (this.isInitialized) {
      return true
    }

    if (!InterstitialAd || !AdEventType) {
      this.isInitialized = true
      return false
    }

    try {
      this.interstitial = InterstitialAd.createForAdRequest(AD_UNIT_IDS.interstitial, {
        requestNonPersonalizedAdsOnly: true,
      })

      this.setupEventListeners()
      await this.loadAd()
      
      this.isInitialized = true
      return true
    } catch (error) {
      logger.error('🚨 Failed to initialize interstitial service:', error)
      this.isInitialized = false
      return false
    }
  }

  // 🎯 Set up event listeners
  private setupEventListeners(): void {
    if (!this.interstitial) return

    this.interstitial.addAdEventListener(AdEventType.LOADED, () => {
      this.isLoaded = true
    })

    this.interstitial.addAdEventListener(AdEventType.ERROR, (error: any) => {
      this.isLoaded = false
      
      // If there's a pending show promise, reject it
      if (this.pendingShowPromise) {
        this.pendingShowPromise.reject(new Error(`Ad failed to load: ${error}`))
        this.pendingShowPromise = null
      }
      
      // Retry loading after a delay
      setTimeout(() => {
        this.loadAd()
      }, 5000)
    })

    this.interstitial.addAdEventListener(AdEventType.OPENED, () => {
      logger.log('💀 Interstitial ad opened!')
    })

    // 🔑 CRITICAL: This is where we resolve the promise when user dismisses ad
    this.interstitial.addAdEventListener(AdEventType.CLOSED, () => {
      logger.log('🔙 Interstitial closed - user dismissed ad!')
      
      // Resolve the pending promise with success
      if (this.pendingShowPromise) {
        this.pendingShowPromise.resolve(true)
        this.pendingShowPromise = null
      }
      
      this.isLoaded = false
      // Load next ad for future use
      this.loadAd()
    })

    this.interstitial.addAdEventListener(AdEventType.CLICKED, () => {
      logger.log('💆 Interstitial clicked! CHA-CHING!')
    })
  }

  // 🔄 Load the interstitial ad
  private async loadAd(): Promise<void> {
    if (!this.interstitial || this.isLoaded) return

    try {
      await this.interstitial.load()
    } catch (error) {
      logger.error('🚨 Error loading interstitial:', error)
    }
  }

  // 🎯 Show interstitial ad (MAIN PUBLIC METHOD - PROPERLY AWAITS USER DISMISSAL!)
  async showAd(): Promise<boolean> {
    // Check if service is ready
    if (!this.isInitialized) {
      logger.log('🚨 Service not initialized')
      return false
    }

    // Check if ad is loaded
    if (!this.isLoaded) {
      logger.log('🚨 Ad not loaded yet')
      return false
    }

    // Prevent multiple simultaneous show attempts
    if (this.pendingShowPromise) {
      logger.log('🚨 Ad already being shown')
      return false
    }

    // Development mode simulation
    if (!this.interstitial) {
      logger.log('🔥 [DEV MODE] Simulating interstitial')
      
      // Simulate a 2-second ad in development
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      logger.log('🏆 [DEV MODE] Simulated ad completed')
      return true
    }

    // Show the real ad and return a promise that resolves when user dismisses it
    return new Promise((resolve, reject) => {
      // Store the promise resolvers
      this.pendingShowPromise = { resolve, reject }

      try {
        logger.log('🏆 Showing interstitial ad now!')
        
        // This starts the ad display but doesn't wait for completion
        this.interstitial.show()
        this.isLoaded = false // Mark as used immediately
        
        // The promise will be resolved in the CLOSED event listener
        
      } catch (error) {
        logger.error('🚨 Failed to show interstitial ad:', error)
        this.pendingShowPromise = null
        reject(error)
      }
    })
  }

  // 🔍 Check if ad is ready to show
  isAdReady(): boolean {
    return this.isInitialized && this.isLoaded
  }

  // 🔄 Force reload ad (for debugging)
  async forceReload(): Promise<void> {
    this.isLoaded = false
    await this.loadAd()
  }

  // 📊 Get service status
  getStatus() {
    return {
      initialized: this.isInitialized,
      loaded: this.isLoaded,
      ready: this.isAdReady(),
      hasPendingShow: !!this.pendingShowPromise
    }
  }

  // 🧹 Cleanup
  destroy(): void {
    // Reject any pending promise
    if (this.pendingShowPromise) {
      this.pendingShowPromise.reject(new Error('Service destroyed'))
      this.pendingShowPromise = null
    }

    if (this.interstitial) {
      this.interstitial.removeAllListeners()
      this.interstitial = null
    }
    
    this.isInitialized = false
    this.isLoaded = false
  }
}

// 🏆 Export singleton instance
const adInterstitialService = AdInterstitialService.getInstance()
export default adInterstitialService
import APP_CONSTANTS from '@/constants/appConstants'
import { DictionaryDownloadResponse, DictionaryVersionResponse } from '@/types/dictionary.types'
import { TranslateRequest, TranslateResponse } from '@/types/translate.types'
import { UsageResponse } from '@/types/usage.types'
import logger from '@/utils/logger'
import { DeviceService } from './DeviceService'

// let API_BASE = APP_CONSTANTS.IS_USING_LOCAL_DEV_API ? APP_CONSTANTS.LOCAL_API_IOS : APP_CONSTANTS.PRODUCTION_WEB_API

// if (__DEV__ && Platform.OS === 'android') {
//   API_BASE = APP_CONSTANTS.LOCAL_API_ANDROID
// }

let API_BASE = APP_CONSTANTS.PRODUCTION_WEB_API


export class HttpClientService {

  //////////////////////////////////////////////////////
  //
  //                 Translate
  //
  //////////////////////////////////////////////////////

  // Send text to ChatGPT for translation (main app function)
  static async translateText(translateRequest: TranslateRequest): Promise<TranslateResponse> {
    try {
      logger.log('🚀 Starting translation request:', {
        text: translateRequest.text?.substring(0, 50) + '...',
        mode: translateRequest.mode,
        apiBase: API_BASE
      })

      // Add artificial delay for better UX (show loading animation)
      await new Promise(resolve => setTimeout(resolve, 500)) // 1.5 second delay
      
      const result = await this.request('/translate', {
        method: 'POST',
        body: JSON.stringify(translateRequest),
      })

      logger.log('✅ Translation successful:', {
        translatedLength: result.translatedText?.length || 0,
        hasResult: !!result.translatedText
      })

      return result
    } catch (error) {
      logger.error('❌ Translation failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        request: translateRequest,
        apiBase: API_BASE
      })
      throw error
    }
  }

  //////////////////////////////////////////////////////
  //
  //                Dictionary
  //
  //////////////////////////////////////////////////////

  // Check if dictionary needs updating (version comparison)
  static async getDictionaryVersion(): Promise<DictionaryVersionResponse> {
    try {
      logger.log('🚀 Checking dictionary version at:', API_BASE)
      
      const result = await this.request('/dictionary/version', { method: 'GET' })
      
      logger.log('✅ Dictionary version check successful:', result)
      return result
    } catch (error) {
      logger.error('❌ Dictionary version check failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        apiBase: API_BASE
      })
      throw error
    }
  }

  // Download dictionary data from server
  static async downloadDictionary(): Promise<DictionaryDownloadResponse> {
    try {
      logger.log('🚀 Downloading dictionary from:', API_BASE)
      
      const result = await this.request('/dictionary/download', { method: 'GET' })
      
      logger.log('✅ Dictionary download successful:', {
        entriesCount: result.entries?.length || 0,
        version: result.version
      })
      return result
    } catch (error) {
      logger.error('❌ Dictionary download failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        apiBase: API_BASE
      })
      throw error
    }
  }

  //////////////////////////////////////////////////////
  //
  //                Usage
  //
  //////////////////////////////////////////////////////

  // Check daily usage limits and premium status for this device
  static async checkUsage(): Promise<UsageResponse> {
    try {
      logger.log('🚀 Checking usage at:', API_BASE)
      
      const result = await this.request('/usage', { method: 'GET' })
      
      logger.log('✅ Usage check successful:', {
        dailyCount: result.dailyCount,
        isPremium: result.isPremium,
        canTranslate: result.canTranslate
      })
      return result
    } catch (error) {
      logger.error('❌ Usage check failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        apiBase: API_BASE
      })
      throw error
    }
  }

  //////////////////////////////////////////////////////
  //
  //                User Management
  //
  //////////////////////////////////////////////////////

  // Get current user info
  static async getUser(): Promise<any> {
    try {
      logger.log('🚀 Getting user info from:', API_BASE)
      
      const result = await this.request('/user', { method: 'GET' })
      
      logger.log('✅ User info retrieved successfully:', {
        hasUser: !!result,
        isPremium: result?.isPremium
      })
      return result
    } catch (error) {
      logger.error('❌ Get user failed:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        apiBase: API_BASE
      })
      throw error
    }
  }

  // COMMENTED OUT: Uncomment when App Store IAP is ready
  // static async upgradeToPremium(purchaseData: {
  //   // Google Play fields
  //   purchaseToken?: string
  //   googleOrderId?: string
  //   // Apple App Store fields
  //   transactionId?: string
  //   appStoreReceiptData?: string
  //   // Common field
  //   productId: string
  // }): Promise<{
  //   status: string
  //   isPremium: boolean
  //   verificationResult: any
  // }> {
  //   try {
  //     logger.log('🚀 Upgrading to premium at:', API_BASE)
  //     
  //     // Detect platform automatically
  //     const platform = Platform.OS === 'ios' ? 'app_store' : 'google_play'
  //     
  //     const upgradeData = {
  //       platform,
  //       ...purchaseData
  //     }
  //     
  //     const result = await this.request('/user/upgrade', {
  //       method: 'POST',
  //       body: JSON.stringify(upgradeData),
  //     })
  //     
  //     logger.log('✅ Premium upgrade successful:', result)
  //     return result
  //   } catch (error) {
  //     logger.error('❌ Premium upgrade failed:', {
  //       error: error instanceof Error ? error.message : 'Unknown error',
  //       purchaseData,
  //       apiBase: API_BASE
  //     })
  //     throw error
  //   }
  // }

  // Internal HTTP wrapper - adds device ID auth header to all requests
  private static async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    try {
      const deviceId = await DeviceService.getDeviceId()
      const fullUrl = `${API_BASE}${endpoint}`
      
      logger.log('🌐 Making HTTP request:', {
        url: fullUrl,
        method: options.method || 'GET',
        hasBody: !!options.body,
        deviceId: deviceId?.substring(0, 8) + '...' // Log partial device ID for debugging
      })

      const response = await fetch(fullUrl, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'X-Device-ID': deviceId,
          ...options.headers,
        },
      })

      logger.log('🌐 HTTP response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: fullUrl
      })

      if (!response.ok) {
        // Try to get error details from response body
        let errorDetails = `HTTP ${response.status}: ${response.statusText}`
        try {
          const errorBody = await response.text()
          if (errorBody) {
            errorDetails += ` - ${errorBody}`
          }
        } catch (bodyError) {
          logger.warn('Could not read error response body:', bodyError)
        }
        
        logger.error('❌ HTTP request failed:', {
          status: response.status,
          statusText: response.statusText,
          url: fullUrl,
          errorDetails
        })
        
        throw new Error(errorDetails)
      }

      const result = await response.json()
      logger.log('✅ HTTP request successful:', {
        url: fullUrl,
        responseType: typeof result,
        hasData: !!result
      })

      return result
    } catch (error) {
      // Enhanced error logging for different types of failures
      if (error instanceof TypeError && error.message.includes('Network request failed')) {
        logger.error('🚫 Network connection failed:', {
          url: `${API_BASE}${endpoint}`,
          message: 'Check internet connection and API server status',
          apiBase: API_BASE,
          error: error.message
        })
      } else if (error instanceof Error && error.message.includes('fetch')) {
        logger.error('🚫 Fetch API error:', {
          url: `${API_BASE}${endpoint}`,
          message: 'Possible CORS or network issue',
          apiBase: API_BASE,
          error: error.message
        })
      } else {
        logger.error('🚫 Unexpected request error:', {
          url: `${API_BASE}${endpoint}`,
          error: error instanceof Error ? error.message : 'Unknown error',
          apiBase: API_BASE
        })
      }
      
      throw error
    }
  }
}
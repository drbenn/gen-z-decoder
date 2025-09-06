import { TranslateRequest, TranslateResponse } from '@/types/translate.types'
import { DeviceService } from './deviceService'
import { DictionaryDownloadResponse, DictionaryVersionResponse } from '@/types/dictionary.types'
import { UsageResponse } from '@/types/usage.types'
import { Platform } from 'react-native'
import APP_CONSTANTS from '@/constants/appConstants'

let API_BASE = APP_CONSTANTS.IS_USING_LOCAL_DEV_API ? APP_CONSTANTS.LOCAL_API_IOS : APP_CONSTANTS.PRODUCTION_WEB_API

if (__DEV__ && Platform.OS === 'android') {
  API_BASE = APP_CONSTANTS.LOCAL_API_ANDROID
}

export class HttpClient {

  //////////////////////////////////////////////////////
  //
  //                 Translate
  //
  //////////////////////////////////////////////////////

  // Send text to ChatGPT for translation (main app function)
  static async translateText(translateRequest: TranslateRequest): Promise<TranslateResponse> {
    // Add artificial delay for better UX (show loading animation)
    await new Promise(resolve => setTimeout(resolve, 1500)) // 1.5 second delay
    
    const result = await this.request('/translate', {
      method: 'POST',
      body: JSON.stringify(translateRequest),
    })
    return result
  }


  //////////////////////////////////////////////////////
  //
  //                Dictionary
  //
  //////////////////////////////////////////////////////

  // Check if dictionary needs updating (version comparison)
  static async getDictionaryVersion(): Promise<DictionaryVersionResponse> {
    return await this.request('/dictionary/version', { method: 'GET' })
  }

  // Download dictionary data from server
  static async downloadDictionary(): Promise<DictionaryDownloadResponse> {
    return await this.request('/dictionary/download', { method: 'GET' })
  }

  //////////////////////////////////////////////////////
  //
  //                Usage
  //
  //////////////////////////////////////////////////////

  // Check daily usage limits and premium status for this device
  static async checkUsage(): Promise<UsageResponse> {
    return await this.request('/usage', { method: 'GET' })
  }


  //////////////////////////////////////////////////////
  //
  //                User Management
  //
  //////////////////////////////////////////////////////

  // Get current user info
  static async getUser(): Promise<any> {
    return await this.request('/user', { method: 'GET' })
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
  //   // Detect platform automatically
  //   const platform = Platform.OS === 'ios' ? 'app_store' : 'google_play'
  //   
  //   const upgradeData = {
  //     platform,
  //     ...purchaseData
  //   }
  //   
  //   return this.request('/user/upgrade', {
  //     method: 'POST',
  //     body: JSON.stringify(upgradeData),
  //   })
  // }


  // Internal HTTP wrapper - adds device ID auth header to all requests
  private static async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const deviceId = await DeviceService.getDeviceId()
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Device-ID': deviceId,
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return response.json()
  }
}
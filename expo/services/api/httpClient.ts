// src/services/api/httpClient.ts
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
  //                TODO: IAP
  //
  //////////////////////////////////////////////////////

  // Verify Google Play purchase and mark device as premium
  // static async upgradeToPremium(data: any): Promise<any> {
  //   return this.request('/upgrade', {
  //     method: 'POST',
  //     body: JSON.stringify(data),
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
// src/services/api/httpClient.ts
import { TranslateRequest, TranslateResponse } from '@/types/translate.types';
import { DeviceService } from './deviceService';
import { DictionaryDownloadResponse, DictionaryVersionResponse } from '@/types/dictionary.types';
import { UsageResponse } from '@/types/usage.types';

const API_BASE = __DEV__ ? 'http://localhost:3000/v1' : 'https://genz.sparkdart.com/v1';

export class HttpClient {

  //////////////////////////////////////////////////////
  //
  //                 Translate
  //
  //////////////////////////////////////////////////////

  // Send text to ChatGPT for translation (main app function)
  static async translateText(translateRequest: TranslateRequest): Promise<TranslateResponse> {
    return this.request('/translate', {
      method: 'POST',
      body: JSON.stringify(translateRequest),
    });
  }

  //////////////////////////////////////////////////////
  //
  //                Dictionary
  //
  //////////////////////////////////////////////////////

  // Check if dictionary needs updating (version comparison)
  static async getDictionaryVersion(): Promise<DictionaryVersionResponse> {
    return this.request('/dictionary/version', { method: 'GET' });
  }

  // Download dictionary data from server
  static async downloadDictionary(): Promise<DictionaryDownloadResponse> {
    return this.request('/dictionary/download', { method: 'GET' });
  }

  //////////////////////////////////////////////////////
  //
  //                Usage
  //
  //////////////////////////////////////////////////////

  // Check daily usage limits and premium status for this device
  static async checkUsage(): Promise<UsageResponse> {
    return this.request('/usage', { method: 'GET' });
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
  //   });
  // }



  // Internal HTTP wrapper - adds device ID auth header to all requests
  private static async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const deviceId = await DeviceService.getDeviceId();
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-Device-ID': deviceId,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }
}
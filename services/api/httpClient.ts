import { DeviceService } from './deviceService';

const API_BASE = __DEV__ ? 'http://localhost:3000/api' : 'https://yoursite.com/api';

export class HttpClient {
  // Check daily usage limits and premium status for this device
  static async checkUsage(): Promise<any> {
    return this.request('/usage', { method: 'GET' });
  }

  // Check if dictionary needs updating (version comparison)
  static async getDictionaryVersion(): Promise<any> {
    return this.request('/dictionary/version', { method: 'GET' });
  }

  // Send text to ChatGPT for translation (main app function)
  static async translateText(data: any): Promise<any> {
    return this.request('/translate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Verify Google Play purchase and mark device as premium
  static async upgradeToPremium(data: any): Promise<any> {
    return this.request('/upgrade', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

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
import { TranslationMode } from '../../types/app.types';
import { HttpClient } from './httpClient';

export class TranslationService {
  // Main translation function - sends text to ChatGPT via your API
  static async translate(text: string, mode: TranslationMode): Promise<any> {
    // Mock for development (remove when real API ready)
    if (__DEV__) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockOutput = mode === TranslationMode.TO_ENGLISH 
        ? text.replace(/no cap/gi, 'no lie').replace(/bet/gi, 'okay').replace(/fr fr/gi, 'for real')
        : text.replace(/really/gi, 'lowkey').replace(/good/gi, 'fire').replace(/okay/gi, 'bet');

      return {
        input: text,
        output: mockOutput,
        mode,
        timestamp: new Date().toISOString(),
      };
    }

    return HttpClient.translateText({ text, mode });
  }

  // Check daily usage limits and premium status
  static async getUsage(): Promise<any> {
    // Mock for development - unlimited testing
    if (__DEV__) {
      return {
        dailyCount: 0,
        dailyLimit: Number.MAX_SAFE_INTEGER,
        isPremium: true,
        resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };
    }

    return HttpClient.checkUsage();
  }

  // Verify Google Play purchase and upgrade device to premium
  static async upgradeToPremium(purchaseToken: string, obfuscatedAccountId?: string): Promise<any> {
    // Mock for development
    if (__DEV__) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    }

    return HttpClient.upgradeToPremium({ 
      purchaseToken, 
      obfuscatedAccountId 
    });
  }

  // Check if dictionary needs updating
  static async getDictionaryVersion(): Promise<any> {
    // Mock for development
    if (__DEV__) {
      return {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        downloadUrl: '/dictionary/download?version=1.0.0'
      };
    }

    return HttpClient.getDictionaryVersion();
  }

  // Download updated dictionary data
  static async downloadDictionary(): Promise<any[]> {
    // Mock for development
    if (__DEV__) {
      return [
        { id: '1', term: 'no cap', definition: 'No lie, telling the truth', examples: ['That movie was amazing, no cap'] },
        { id: '2', term: 'bet', definition: 'Agreement, okay', examples: ['Wanna hang out? Bet!'] },
        { id: '3', term: 'fr fr', definition: 'For real, for real', examples: ['That test was hard fr fr'] },
      ];
    }

    return HttpClient.getDictionaryVersion(); // You'll need to add downloadDictionary to HttpClient
  }
}
// Mobile app types matching API contract
export enum TranslationMode {
  GENZ_TO_ENGLISH = 'genz_to_english',
  ENGLISH_TO_GENZ = 'english_to_genz'
}

export interface TranslateRequest {
  text: string;
  mode: TranslationMode;
}

export interface TranslateResponse {
  translatedText: string;
  originalText: string;
  mode: TranslationMode;
  usageInfo: {
    translationsUsedToday: number;
    dailyLimit: number;
    remainingTranslations: number;
    isPremium: boolean;
  };
}

export interface TranslationHistoryItem {
  id: string;
  originalText: string;
  translatedText: string;
  mode: TranslationMode;
  timestamp: number;
  isFavorite: boolean;
}
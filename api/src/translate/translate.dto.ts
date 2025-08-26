import { IsString, IsEnum, IsNotEmpty, MaxLength } from 'class-validator'

export enum TranslationMode {
  GEN_TO_ENGLISH = 'genz_to_english',
  ENGLISH_TO_GEN = 'english_to_genz'
}

export class TranslateRequestDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000) // Prevent massive API costs
  text: string

  @IsEnum(TranslationMode)
  mode: TranslationMode
}

export class TranslateResponseDto {
  translatedText: string
  originalText: string
  mode: TranslationMode
  
  // Usage tracking info (no content stored)
  usageInfo: {
    translationsUsedToday: number
    dailyLimit: number
    remainingTranslations: number
    isPremium: boolean
  }
}

// For internal service usage tracking (what gets stored in DB)
export interface UsageTrackingData {
  deviceId: string
  mode: TranslationMode
  date: string // YYYY-MM-DD format
  success: boolean
  inputLength: number // Character count - simple cost proxy
}

// For premium status checking
export interface UserUsageStatus {
  deviceId: string
  isPremium: boolean
  translationsUsedToday: number
  dailyLimit: number
  lastActive: Date
}
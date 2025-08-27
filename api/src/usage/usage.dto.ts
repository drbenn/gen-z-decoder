export interface UsageResponseDto {
  device_id: string,
  message: string,
  timestamp: string,
  translationsUsedToday: number,
  dailyLimit: number,
  remainingTranslations: number,
  isPremium: boolean
}
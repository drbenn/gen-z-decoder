import { Injectable, Inject } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import { v4 as uuidv4 } from 'uuid'
import { DatabaseService } from '../database/database.service'
import { TranslationMode } from '../translate/translate.dto'
import { UserService } from 'src/user/user.service'

@Injectable()
export class UsageService {
  constructor(
    private readonly db: DatabaseService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly userService: UserService,
  ) {}

  // Track a successful translation
  async trackUsage(deviceId: string, mode: TranslationMode): Promise<void> {
    const today = new Date().toISOString().split('T')[0]
    const recordId = uuidv4()

    try {
      // Ensure user exists first
      await this.userService.ensureUser(deviceId)

      // Track usage with correct mode counters
      const isGenToEnglish = mode === TranslationMode.GENZ_TO_ENGLISH ? 1 : 0
      const isEnglishToGen = mode === TranslationMode.ENGLISH_TO_GENZ ? 1 : 0

      await this.db.query(`
        INSERT INTO daily_usage (id, device_id, date, translation_count, mode_genz_to_english, mode_english_to_genz)
        VALUES ($1, $2, $3, 1, $4, $5)
        ON CONFLICT (device_id, date) 
        DO UPDATE SET 
          translation_count = daily_usage.translation_count + 1,
          mode_genz_to_english = daily_usage.mode_genz_to_english + $4,
          mode_english_to_genz = daily_usage.mode_english_to_genz + $5
      `, [recordId, deviceId, today, isGenToEnglish, isEnglishToGen])

      this.logger.debug(`Usage tracked for device ${deviceId.substring(0, 8)}...`, {
        mode,
        date: today
      })

    } catch (error) {
      this.logger.error(`Failed to track usage for device ${deviceId}:`, error)
      throw error
    }
  }

  // Get current usage for a device
  async getCurrentUsage(deviceId: string): Promise<{
    translationsUsedToday: number,
    dailyLimit: number,
    remainingTranslations: number,
    isPremium: boolean
  }> {
    const today = new Date().toISOString().split('T')[0]
    
    const result = await this.db.query(`
      SELECT 
        u.premium_status,
        COALESCE(d.translation_count, 0) as translations_used_today
      FROM users u
      LEFT JOIN daily_usage d ON d.device_id = u.device_id AND d.date = $1
      WHERE u.device_id = $2
    `, [today, deviceId])

    if (result.rows.length === 0) {
      // User doesn't exist yet
      return {
        translationsUsedToday: 0,
        dailyLimit: 10, // Free tier
        remainingTranslations: 10,
        isPremium: false
      }
    }

    const isPremium = result.rows[0].premium_status
    const dailyLimit = isPremium ? 200 : 10
    const used = result.rows[0].translations_used_today
    
    return {
      translationsUsedToday: used,
      dailyLimit,
      remainingTranslations: Math.max(0, dailyLimit - used),
      isPremium
    }
  }

    // Test database write - track a fake translation
    async testUsageTracking(deviceId: string): Promise<{ status: string, record: any }> {
      const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
      const recordId = uuidv4() // Generate proper UUID
      
      // First, ensure user exists (create if not exists)
      await this.db.query(`
        INSERT INTO users (device_id, created_at, last_active)
        VALUES ($1, NOW(), NOW())
        ON CONFLICT (device_id) DO NOTHING
      `, [deviceId])
      
      // Then insert usage tracking
      const result = await this.db.query(`
        INSERT INTO daily_usage (id, device_id, date, translation_count, mode_genz_to_english, mode_english_to_genz)
        VALUES ($1, $2, $3, 1, 1, 0)
        ON CONFLICT (device_id, date) 
        DO UPDATE SET 
          translation_count = daily_usage.translation_count + 1,
          mode_genz_to_english = daily_usage.mode_genz_to_english + 1
        RETURNING *
      `, [recordId, deviceId, today])

      return {
        status: 'usage tracked',
        record: result.rows[0]
      }
    }
}
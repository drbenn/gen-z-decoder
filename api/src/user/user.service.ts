import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import { DatabaseService } from '../database/database.service'

@Injectable()
export class UserService {
    constructor(
    private readonly db: DatabaseService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  // Create or update user
  async ensureUser(deviceId: string): Promise<any> {
    try {
      const result = await this.db.query(`
        INSERT INTO users (device_id, created_at, last_active)
        VALUES ($1, NOW(), NOW())
        ON CONFLICT (device_id) 
        DO UPDATE SET last_active = NOW() 
        WHERE users.last_active < NOW() - INTERVAL '1 hour'  -- Only update if >1hr old
        RETURNING *
      `, [deviceId])

      return result.rows[0]
    } catch (error) {
      this.logger.error(`Failed to ensure user exists for device ${deviceId}:`, error)
      throw error
    }
  }

  // Get user info by device ID
  async getUser(deviceId: string): Promise<any> {
    try {
      const result = await this.db.query(`
        SELECT device_id, created_at, last_active, premium_status, total_translations
        FROM users 
        WHERE device_id = $1
      `, [deviceId])

      if (result.rows.length === 0) {
        throw new NotFoundException(`User not found: ${deviceId}`)
      }

      return result.rows[0]
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error
      }
      this.logger.error(`Failed to get user ${deviceId}:`, error)
      throw error
    }
  }
}

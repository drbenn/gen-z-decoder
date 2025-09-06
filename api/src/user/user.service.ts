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

  // COMMENTED OUT: Uncomment when App Store IAP is ready
  // async upgradeToPremium(
  //   deviceId: string, 
  //   upgradeData: {
  //     platform: 'google_play' | 'app_store',
  //     // Google Play fields
  //     purchaseToken?: string,
  //     googleOrderId?: string,
  //     // Apple App Store fields  
  //     transactionId?: string,
  //     appStoreReceiptData?: string,
  //     // Common fields
  //     productId: string
  //   }
  // ): Promise<{ isPremium: boolean, verificationResult: any }> {
  //   try {
  //     // Step 1: Platform-specific verification
  //     let verificationResult;
  //     if (upgradeData.platform === 'google_play') {
  //       verificationResult = await this.verifyGooglePlayPurchase(
  //         upgradeData.purchaseToken!, 
  //         upgradeData.productId
  //       )
  //     } else if (upgradeData.platform === 'app_store') {
  //       verificationResult = await this.verifyAppStorePurchase(
  //         upgradeData.appStoreReceiptData!,
  //         upgradeData.productId
  //       )
  //     } else {
  //       throw new Error('Unsupported platform')
  //     }
  //     
  //     if (!verificationResult.isValid) {
  //       this.logger.warn(`Invalid purchase for device ${deviceId} on ${upgradeData.platform}`)
  //       return { isPremium: false, verificationResult }
  //     }
  //
  //     // Step 2: Update user premium status in database
  //     await this.db.query(`
  //       UPDATE users 
  //       SET premium_status = true, premium_upgraded_at = NOW()
  //       WHERE device_id = $1
  //     `, [deviceId])
  //
  //     // Step 3: Log the purchase for tracking (platform-specific fields)
  //     if (upgradeData.platform === 'google_play') {
  //       await this.db.query(`
  //         INSERT INTO purchases (platform, google_order_id, purchase_token, product_id, device_id, verified)
  //         VALUES ('google_play', $1, $2, $3, $4, true)
  //         ON CONFLICT (purchase_token) DO NOTHING
  //       `, [upgradeData.googleOrderId, upgradeData.purchaseToken, upgradeData.productId, deviceId])
  //     } else {
  //       await this.db.query(`
  //         INSERT INTO purchases (platform, transaction_id, app_store_receipt_data, product_id, device_id, verified)
  //         VALUES ('app_store', $1, $2, $3, $4, true)
  //         ON CONFLICT (transaction_id) DO NOTHING
  //       `, [upgradeData.transactionId, upgradeData.appStoreReceiptData, upgradeData.productId, deviceId])
  //     }
  //
  //     this.logger.info(`Premium upgrade successful for device ${deviceId} on ${upgradeData.platform}`)
  //     
  //     return { isPremium: true, verificationResult }
  //   } catch (error) {
  //     this.logger.error(`Premium upgrade failed for device ${deviceId}:`, error)
  //     throw error
  //   }
  // }

  // COMMENTED OUT: Google Play purchase verification
  // private async verifyGooglePlayPurchase(
  //   purchaseToken: string, 
  //   productId: string
  // ): Promise<{ isValid: boolean, purchaseData?: any }> {
  //   // This would integrate with Google Play Developer API
  //   // to verify the purchase token is legitimate
  //   
  //   // Placeholder implementation - replace with actual Google Play API call
  //   try {
  //     // const googlePlayResponse = await fetch(
  //     //   `https://www.googleapis.com/androidpublisher/v3/applications/${packageName}/purchases/products/${productId}/tokens/${purchaseToken}`,
  //     //   {
  //     //     headers: {
  //     //       'Authorization': `Bearer ${googlePlayAccessToken}`
  //     //     }
  //     //   }
  //     // )
  //     
  //     // For now, return valid for development testing
  //     return { 
  //       isValid: true, 
  //       purchaseData: { token: purchaseToken, productId, verifiedAt: new Date() }
  //     }
  //   } catch (error) {
  //     this.logger.error('Google Play verification failed:', error)
  //     return { isValid: false }
  //   }
  // }
}
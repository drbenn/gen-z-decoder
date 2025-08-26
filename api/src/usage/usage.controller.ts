import { Controller, Get, Inject, Logger, Post, Request, UseGuards } from '@nestjs/common';
import { Request as ExpressRequest } from 'express'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { UsageService } from './usage.service';
import { TranslationMode } from 'src/translate/translate.dto';
import { DeviceAuthGuard } from 'src/guards/device-auth/device-auth.guard';

@Controller('usage')
@UseGuards(DeviceAuthGuard) // Device auth for all endpoints
export class UsageController {

  constructor(
    private readonly usageService: UsageService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  @Get()
  async getCurrentUsage(@Request() req: ExpressRequest & { deviceId: string }) {
    // Basic usage stats endpoint
    const usageStats = await this.usageService.getCurrentUsage(req.deviceId)
    return {
      device_id: req.deviceId,
      message: 'Usage endpoint working',
      timestamp: new Date().toISOString(),
      translationsUsedToday: usageStats.translationsUsedToday,
      dailyLimit: usageStats.dailyLimit,
      remainingTranslations: usageStats.remainingTranslations,
      isPremium: usageStats.isPremium
    }
  }

  @Get('test')
  async testUsageTracking(@Request() req: ExpressRequest & { deviceId: string }) {
    // Test the usage tracking functionality
    await this.usageService.trackUsage(req.deviceId, TranslationMode.GENZ_TO_ENGLISH)
    
    return {
      status: 'usage tracked',
      device_id: req.deviceId,
      test_mode: TranslationMode.GENZ_TO_ENGLISH
    }
  }

  @Post('test-usage')
  async testUsage(@Request() req) {
    return await this.usageService.testUsageTracking(req.deviceId)
  }
}

import { Controller, Get, Inject, Logger, Post, Query, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Request as ExpressRequest } from 'express'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { UsageService } from './usage.service';
import { TranslationMode } from 'src/translate/translate.dto';
import { DeviceAuthGuard } from 'src/guards/device-auth/device-auth.guard';
import { UsageResponseDto } from './usage.dto';
import { ConfigService } from '@nestjs/config';

@Controller('usage')
export class UsageController {

  constructor(
    private readonly usageService: UsageService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @UseGuards(DeviceAuthGuard) // Device auth for specified endpoints
  async getCurrentUsage(@Request() req: ExpressRequest & { deviceId: string }): Promise<UsageResponseDto> {
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
  @UseGuards(DeviceAuthGuard) // Device auth for specified endpoints
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
  @UseGuards(DeviceAuthGuard) // Device auth for specified endpoints
  async testUsage(@Request() req) {
    return await this.usageService.testUsageTracking(req.deviceId)
  }


  @Get('admin/stats')
  async getAdminStats(
    @Query('key') adminKey: string,
    @Query('days') days: string = '5'
  ): Promise<any> {
    // Environment variable auth check
    const expectedKey = this.configService.get<string>('ADMIN_KEY')
    if (!expectedKey || adminKey !== expectedKey) {
      throw new UnauthorizedException('Invalid admin key')
    }

    const daysCount = parseInt(days) || 5
    return await this.usageService.getUsageStats(daysCount)
  }

@Get('admin/devices')
async getDeviceStats(
  @Query('key') adminKey: string,
  @Query('days') days: string = '7'
): Promise<any> {
  const expectedKey = this.configService.get<string>('ADMIN_KEY')
  if (!expectedKey || adminKey !== expectedKey) {
    throw new UnauthorizedException('Invalid admin key')
  }

  const daysCount = parseInt(days) || 7
  return await this.usageService.getDeviceBreakdown(daysCount)
}
}

import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { DeviceAuthGuard } from 'src/guards/device-auth/device-auth.guard'
import { TranslateService } from './translate.service'
import { TranslateRequestDto, TranslateResponseDto } from './translate.dto'

@Controller('translate')
@UseGuards(DeviceAuthGuard) // Device auth for all endpoints
export class TranslateController {
  
  constructor(private readonly translationService: TranslateService) {}
  
  // Expensive ChatGPT calls - 4 requests per minute max
  @Throttle({ default: { limit: 4, ttl: 60000 } }) // 4 per minute
  @Post()
  async translateText(
    @Body() translateRequest: TranslateRequestDto,
    @Request() req
  ): Promise<TranslateResponseDto> {
    return await this.translationService.translateText(
      translateRequest,
      req.deviceId
    )
  }
  
  // Health check endpoint - more generous limit
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 per minute
  @Post('test')
  async testTranslation(@Request() req): Promise<{ status: string, deviceId: string }> {
    return {
      status: 'Translation service is working!',
      deviceId: req.deviceId
    }
  }

  @Get('db-test')
  async testDatabase() {
    return await this.translationService.testDatabase()
  }

  @Post('test-usage')
  async testUsage(@Request() req) {
    return await this.translationService.testUsageTracking(req.deviceId)
  }
}
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { DictionaryVersionResponseDto, DictionaryDownloadResponseDto } from 'src/dictionary/dictionary.dto';
import { DictionaryService } from './dictionary.service';
import { DeviceAuthGuard } from 'src/guards/device-auth/device-auth.guard';
import { Throttle } from '@nestjs/throttler';

@Controller('dictionary')
@UseGuards(DeviceAuthGuard)
export class DictionaryController {

  constructor(private readonly dictionaryService: DictionaryService) {}
  
  // Uses global throttler default (100/minute from AppModule)
  @Get('version')
  async getDictionaryVersion(): Promise<DictionaryVersionResponseDto> {
    return this.dictionaryService.getCurrentVersion()
  }

  @Throttle({ default: { ttl: 3600000, limit: 10 } })
  @Get('download')
  async downloadDictionary(): Promise<DictionaryDownloadResponseDto> {
    return await this.dictionaryService.getDictionaryData()
  }

  // Admin endpoint - insert dictionary data
  @Post('admin/insert')
  async insertDictionary(@Body() body: { version: string, entries: any[] }) {
    const result = await this.dictionaryService.insertDictionary(body.version, body.entries)
    return {
      status: 'dictionary inserted',
      version: body.version,
      entries_count: body.entries.length,
      result
    }
  }
}

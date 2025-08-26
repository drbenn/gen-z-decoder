import { Controller, Get, UseGuards } from '@nestjs/common';
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
  getDictionaryVersion(): DictionaryVersionResponseDto {
    return this.dictionaryService.getCurrentVersion()
  }

  @Throttle({ default: { ttl: 3600000, limit: 10 } })
  @Get('download')
  downloadDictionary(): DictionaryDownloadResponseDto {
    return this.dictionaryService.getDictionaryData()
  }
}

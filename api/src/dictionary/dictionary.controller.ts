import { Controller, Get, UseGuards } from '@nestjs/common';
import { DictionaryVersionResponseDto, DictionaryDownloadResponseDto } from 'typings/dictionary.types';
import { DictionaryService } from './dictionary.service';
import { DeviceAuthGuard } from 'src/guards/device-auth/device-auth.guard';

@Controller('dictionary')
@UseGuards(DeviceAuthGuard)
export class DictionaryController {

  constructor(private readonly dictionaryService: DictionaryService) {}
  
  @Get('version')
  getDictionaryVersion(): DictionaryVersionResponseDto {
    return this.dictionaryService.getCurrentVersion()
  }

  @Get('download')
  downloadDictionary(): DictionaryDownloadResponseDto {
    return this.dictionaryService.getDictionaryData()
  }
}

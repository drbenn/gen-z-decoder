import { Controller, Get } from '@nestjs/common';
import { DictionaryVersionResponseDto, DictionaryDownloadResponseDto } from 'typings/dictionary.types';
import { DictionaryService } from './dictionary.service';

@Controller('dictionary')
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

import { Injectable } from '@nestjs/common';
import { DictionaryVersionResponseDto, DictionaryDownloadResponseDto } from 'src/dictionary/dictionary.dto';

@Injectable()
export class DictionaryService {

  getCurrentVersion(): DictionaryVersionResponseDto {
    return {
      version: '1.0.0',
      releaseDate: '2025-08-25',
      message: 'Dictionary API is working!'
    }
  }

  getDictionaryData(): DictionaryDownloadResponseDto {
    return {
      version: '1.0.0',
      release_date: new Date().toDateString(),
      entries: [
        // {
        //   id: 'uuid-1234-5678-9012',
        //   term: 'no cap',
        //   definition: 'no lie, for real, seriously',
        //   examples: ['That concert was amazing no cap', 'I got an A+ no cap'],
        //   last_updated: '2025-08-25T10:00:00Z'
        // },
        // {
        //   id: 'uuid-2345-6789-0123',
        //   term: 'bet',
        //   definition: 'yes, okay, sounds good',
        //   examples: ['Want to hang out later? Bet!', 'You passing the test? Bet.'],
        //   last_updated: '2025-08-25T10:00:00Z'
        // }
      ],
      totalEntries: 2
    }
  }
}

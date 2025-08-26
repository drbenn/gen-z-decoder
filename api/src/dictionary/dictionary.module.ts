import { Module } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { DictionaryController } from './dictionary.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [DictionaryController],
  providers: [DictionaryService, DatabaseService],
  // exports: [DictionaryService]
})
export class DictionaryModule {}

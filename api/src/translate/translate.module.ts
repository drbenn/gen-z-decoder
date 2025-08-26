import { Module } from '@nestjs/common';
import { TranslateController } from './translate.controller';
import { TranslateService } from './translate.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [TranslateController],
  providers: [TranslateService, DatabaseService]
})
export class TranslateModule {}

import { Module } from '@nestjs/common';
import { TranslateController } from './translate.controller';
import { TranslateService } from './translate.service';
import { DatabaseService } from 'src/database/database.service';
import { UsageService } from 'src/usage/usage.service';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [TranslateController],
  providers: [TranslateService, DatabaseService, UsageService, UserService]
})
export class TranslateModule {}

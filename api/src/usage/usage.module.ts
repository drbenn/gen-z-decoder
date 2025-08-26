import { Module } from '@nestjs/common';
import { UsageController } from './usage.controller';
import { UsageService } from './usage.service';
import { DatabaseService } from 'src/database/database.service';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [UsageController],
  providers: [UsageService, DatabaseService],
  exports: [UsageService, UserService]
})
export class UsageModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DictionaryController } from './dictionary/dictionary.controller';
import { UsageModule } from './usage/usage.module';
import { ConfigModule } from '@nestjs/config';
import { TranslationModule } from './translation/translation.module';
import { DictionaryModule } from './dictionary/dictionary.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DictionaryModule,
    TranslationModule,
    UsageModule
  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

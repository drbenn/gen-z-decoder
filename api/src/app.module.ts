import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsageModule } from './usage/usage.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TranslationModule } from './translation/translation.module';
import { DictionaryModule } from './dictionary/dictionary.module';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import winston from 'winston';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            name: 'default',
            ttl: parseInt(configService.get('THROTTLE_TTL') || '60') * 1000, // Convert to milliseconds
            limit: parseInt(configService.get('THROTTLE_LIMIT') || '100'),
          }
        ],
        skipIf: () => configService.get('THROTTLE_ENABLED') === 'false',
      }),
      inject: [ConfigService],
    }),
    WinstonModule.forRootAsync({
      useFactory: () => ({
        transports: [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp(),
              nestWinstonModuleUtilities.format.nestLike(),
            ),
          }),
          new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
          }),
          new winston.transports.File({ filename: 'logs/combined.log' }),
        ],
      })
    }),
    DictionaryModule,
    TranslationModule,
    UsageModule
  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

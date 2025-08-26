import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsageModule } from './usage/usage.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DictionaryModule } from './dictionary/dictionary.module';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import winston from 'winston';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottleLoggingFilter } from './guards/throttle-logging-filter/throttle-logging-filter.guard';
import { TranslateModule } from './translate/translate.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './env/namecheap.production.env',
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
    TranslateModule,
    UsageModule
  
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      /**
       * Keep the simple built-in guard - needed in provider as the app module import only works on app level,
       * whereas now as a provider can be used at any entrypoint
       */
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: ThrottleLoggingFilter,
    }
  ],
})
export class AppModule {}

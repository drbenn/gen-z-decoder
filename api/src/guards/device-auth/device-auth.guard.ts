import { CanActivate, ExecutionContext, Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Observable } from 'rxjs';

@Injectable()
export class DeviceAuthGuard implements CanActivate {

  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}
  
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Check if auth is disabled via env var
    const authEnabled = this.configService.get<string>('DEVICE_AUTH_ENABLED') !== 'false'
    
    if (!authEnabled) {
      // Skip auth in development
      const request = context.switchToHttp().getRequest()
      request.deviceId = 'dev-device-id' // Mock device ID
      this.logger.debug('Device auth disabled - allowing request')
      return true
    }
    
    const request = context.switchToHttp().getRequest()
    const deviceId = request.headers['x-device-id']
    const ip = request.ip || request.connection.remoteAddress
    
    // Check if device ID exists and looks valid
    if (!deviceId || typeof deviceId !== 'string') {
      this.logger.warn(`Missing device ID from IP: ${ip}`)
      throw new UnauthorizedException('Device ID required')
    }
    
    // Basic format validation (UUID-like)
    if (deviceId.length < 10) {
      this.logger.warn(`Invalid device ID format: ${deviceId} from IP: ${ip}`)
      throw new UnauthorizedException('Invalid device ID format')
    }
    
    // Add device ID to request object for use in controllers
    request.deviceId = deviceId
    this.logger.debug(`Device auth successful for: ${deviceId.substring(0, 8)}...`)
    
    return true
  }
}

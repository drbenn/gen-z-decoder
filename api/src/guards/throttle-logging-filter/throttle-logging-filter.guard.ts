import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Inject } from '@nestjs/common'
import { ThrottlerException } from '@nestjs/throttler'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'

@Catch(ThrottlerException)
export class ThrottleLoggingFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const request = ctx.getRequest()
    const response = ctx.getResponse()

    // Log the violation
    this.logger.warn('Throttle violation detected', {
      ip: request.ip,
      endpoint: request.url,        // Shows "/v1/dictionary/download" 
      method: request.method,       // Shows "GET" vs "POST"
      deviceId: request.headers['x-device-id'],
      userAgent: request.headers['user-agent'],
      timestamp: new Date().toISOString()
    })

    // Send the normal throttle response
    response.status(429).json({
      statusCode: 429,
      message: exception.message,
      error: 'Too Many Requests'
    })
  }
}
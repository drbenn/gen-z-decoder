import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common'
import { Request as ExpressRequest } from 'express'
import { DeviceAuthGuard } from '../guards/device-auth/device-auth.guard'
import { UserService } from './user.service'

@Controller('user')
@UseGuards(DeviceAuthGuard) // Device auth for all endpoints
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Request() req: ExpressRequest & { deviceId: string }) {
    const user = await this.userService.ensureUser(req.deviceId)
    return {
      status: 'user created/updated',
      user
    }
  }

  @Get()
  async getUser(@Request() req: ExpressRequest & { deviceId: string }) {
    const user = await this.userService.getUser(req.deviceId)
    return { user }
  }

  // COMMENTED OUT: Uncomment when App Store IAP is ready
  // @Post('upgrade')
  // async upgradeToPremium(
  //   @Request() req: ExpressRequest & { deviceId: string },
  //   @Body() upgradeData: { purchaseToken: string, productId: string }
  // ) {
  //   const result = await this.userService.upgradeToPremium(
  //     req.deviceId, 
  //     upgradeData.purchaseToken,
  //     upgradeData.productId
  //   )
  //   return {
  //     status: 'upgrade processed',
  //     isPremium: result.isPremium,
  //     verificationResult: result.verificationResult
  //   }
  // }

}

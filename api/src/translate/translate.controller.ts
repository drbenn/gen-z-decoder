import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { DeviceAuthGuard } from 'src/guards/device-auth/device-auth.guard'
import { TranslateService } from './translate.service'
import { TranslateRequestDto, TranslateResponseDto } from './translate.dto'
import { v4 as uuidv4 } from 'uuid'
import { writeFileSync } from 'fs'
import { join } from 'path'

@Controller('translate')
@UseGuards(DeviceAuthGuard) // Device auth for all endpoints
export class TranslateController {
  
  constructor(private readonly translationService: TranslateService) {}
  
  // Expensive ChatGPT calls - 4 requests per minute max
  @Throttle({ default: { limit: 4, ttl: 60000 } }) // 4 per minute
  @Post()
  async translateText(
    @Body() translateRequest: TranslateRequestDto,
    @Request() req
  ): Promise<TranslateResponseDto> {


//   try {
//     // Import the original dictionary
//     const originalDictionary = require('../../assets/dictionary.json')
    
    
//     // Replace each ID with a UUID
//     const updatedDictionary = originalDictionary.map((entry: any) => {
//       const newUuid = uuidv4()
//       return {
//       ...entry,
//       id: newUuid
//     }})
    
//     // Convert to JSON string with nice formatting
//     const jsonString = JSON.stringify(updatedDictionary, null, 2)
    
//     // Log the entire contents so you can copy/paste
//     console.log('=== NEW DICTIONARY WITH UUIDS ===')
//     console.log(jsonString)
//     console.log('=== END OF DICTIONARY ===')
    
//     // Also write to device storage as backup
//     const filePath = join(__dirname, '../../assets/newDictionary.json')
//     writeFileSync(filePath, jsonString, 'utf8')
    
//     console.log('Dictionary logged to console (copy/paste it) and saved to:', filePath)
    
//     return updatedDictionary
    
//   } catch (error) {
//     console.error('Error generating dictionary:', error)
//     throw error
//   }
























    return await this.translationService.translateText(
      translateRequest,
      req.deviceId
    )
  }
  
  // Health check endpoint - more generous limit
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 per minute
  @Post('test')
  async testTranslation(@Request() req): Promise<{ status: string, deviceId: string }> {
    return {
      status: 'Translation service is working!',
      deviceId: req.deviceId
    }
  }

}
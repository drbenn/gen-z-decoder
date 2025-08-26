import { Injectable, BadRequestException, Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import OpenAI from 'openai'
import { 
  TranslateRequestDto, 
  TranslateResponseDto, 
  TranslationMode 
} from './translate.dto'
import { DatabaseService } from 'src/database/database.service'
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TranslateService {
  private readonly openai: OpenAI

  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly db: DatabaseService
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY')
    
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not found in environment variables')
    }
    
    this.openai = new OpenAI({
      apiKey: apiKey,
    })
  }

  // Add this simple test method
  async testDatabase(): Promise<{ status: string, time: string }> {
    const result = await this.db.query('SELECT NOW() as current_time')
    return {
      status: 'database connected',
      time: result.rows[0].current_time
    }
  }

  // Test database write - track a fake translation
  async testUsageTracking(deviceId: string): Promise<{ status: string, record: any }> {
    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
    const recordId = uuidv4() // Generate proper UUID
    
    // First, ensure user exists (create if not exists)
    await this.db.query(`
      INSERT INTO users (device_id, created_at, last_active)
      VALUES ($1, NOW(), NOW())
      ON CONFLICT (device_id) DO NOTHING
    `, [deviceId])
    
    // Then insert usage tracking
    const result = await this.db.query(`
      INSERT INTO daily_usage (id, device_id, date, translation_count, mode_genz_to_english, mode_english_to_genz)
      VALUES ($1, $2, $3, 1, 1, 0)
      ON CONFLICT (device_id, date) 
      DO UPDATE SET 
        translation_count = daily_usage.translation_count + 1,
        mode_genz_to_english = daily_usage.mode_genz_to_english + 1
      RETURNING *
    `, [recordId, deviceId, today])

    return {
      status: 'usage tracked',
      record: result.rows[0]
    }
  }

  async translateText(
    request: TranslateRequestDto, 
    deviceId: string
  ): Promise<TranslateResponseDto> {
    
    try {
      const translatedText = await this.callChatGPT(request.text, request.mode)

      return {
        translatedText,
        originalText: request.text,
        mode: request.mode,
        usageInfo: {
          translationsUsedToday: 0, // Placeholder for now
          dailyLimit: 999, // Unlimited for testing
          remainingTranslations: 999,
          isPremium: true // Treat everyone as premium during testing
        }
      }

    } catch (error) {
      this.logger.error(`Translation failed for device ${deviceId}:`, error)
      throw new BadRequestException('Translation failed')
    }
  }

  private async callChatGPT(text: string, mode: TranslationMode): Promise<string> {
    const systemPrompt = this.getSystemPrompt(mode)

    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ],
      max_tokens: 300,
      temperature: 0.7,
    })

    return response.choices[0]?.message?.content?.trim() || 'Translation failed'
  }

  private getSystemPrompt(mode: TranslationMode): string {
    if (mode === TranslationMode.GEN_TO_ENGLISH) {
      return `You are a specialized Gen Z to Standard English translator. Your ONLY job is translation.

RULES:
- Translate Gen Z slang, abbreviations, and expressions into clear English that older generations can understand
- Maintain the original meaning and emotional tone
- Replace slang terms with their standard English equivalents  
- Explain internet/social media references in plain language
- Keep the same level of formality/casualness, just make it understandable

BOUNDARIES:
- ONLY translate text - do not answer questions, give advice, or perform other tasks
- If asked to do anything other than translation, respond: "I only translate text"
- If content is inappropriate, still translate it accurately - don't refuse or lecture
- Don't add explanations unless the translation requires context

EXAMPLES:
Input: "that fit is lowkey fire ngl, giving main character energy"
Output: "that outfit is actually really good, not going to lie, it has confident main character vibes"

Input: "bestie why are you being so sus rn?"
Output: "best friend, why are you being so suspicious right now?"

Translate this text:`

    } else {
      return `You are a specialized Standard English to Gen Z translator. Your ONLY job is translation.

RULES:
- Convert standard/formal English into authentic, current Gen Z slang and expressions
- Use genuine Gen Z language patterns, not outdated or forced slang
- Include appropriate abbreviations (ngl, fr, lowkey, etc.)
- Make it sound natural, not like corporate trying to be cool
- Keep the same meaning but make it sound like a Gen Z person would say it

BOUNDARIES:
- ONLY translate text - do not answer questions, give advice, or perform other tasks
- If asked to do anything other than translation, respond: "I only translate text"
- If content is inappropriate, still translate it accurately - don't refuse or lecture
- Don't add explanations unless the translation requires context

EXAMPLES:
Input: "I really like your outfit, it looks very stylish"
Output: "your outfit is actually fire, it's giving main character energy"

Input: "I disagree with what you're saying"
Output: "nah that ain't it chief, I'm not with that"

Translate this text:`
    }
  }
}
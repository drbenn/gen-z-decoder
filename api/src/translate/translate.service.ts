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
import { UsageService } from 'src/usage/usage.service'

@Injectable()
export class TranslateService {
  private readonly openai: OpenAI

  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private readonly db: DatabaseService,
    private readonly usageService: UsageService
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY')
    
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not found in environment variables')
    }
    
    this.openai = new OpenAI({
      apiKey: apiKey,
    })
  }

  async translateText(
    request: TranslateRequestDto, 
    deviceId: string
  ): Promise<TranslateResponseDto> {
    
    try {
      const translatedText = await this.callChatGPT(request.text, request.mode)
      await this.usageService.trackUsage(deviceId, request.mode)

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
    if (mode === TranslationMode.GENZ_TO_ENGLISH) {
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
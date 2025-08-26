import { Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { DatabaseService } from 'src/database/database.service';
import { DictionaryVersionResponseDto, DictionaryDownloadResponseDto } from 'src/dictionary/dictionary.dto';
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class DictionaryService {

  constructor(
    private readonly db: DatabaseService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}


  getCurrentVersion(): DictionaryVersionResponseDto {
    return {
      version: '1.0.0',
      releaseDate: '2025-08-25',
      message: 'Dictionary API is working!'
    }
  }

  async getDictionaryData(): Promise<DictionaryDownloadResponseDto> {
    try {
      const result = await this.db.query(`
        SELECT version, release_date, dictionary_content
        FROM dictionary_versions 
        WHERE is_active = true
        ORDER BY created_at DESC
        LIMIT 1
      `)

      if (result.rows.length === 0) {
        return {
          version: 'none',
          release_date: '',
          entries: [],
          totalEntries: 0
        }
      }

      const row = result.rows[0]
      const entries = row.dictionary_content || []

      return {
        version: row.version,
        release_date: row.release_date,
        entries: entries,
        totalEntries: Array.isArray(entries) ? entries.length : 0
      }
    } catch (error) {
      this.logger.error('Failed to get active dictionary:', error)
      throw error
    }
  }

  // Insert dictionary data (admin endpoint)
  async insertDictionary(version: string, entries: any[]): Promise<any> {
    try {
      const newUuid = uuidv4()
      
      // Deactivate any existing active dictionaries
      await this.db.query(`
        UPDATE dictionary_versions SET is_active = false WHERE is_active = true
      `)

      // Insert new dictionary version
      const result = await this.db.query(`
        INSERT INTO dictionary_versions (id, version, release_date, dictionary_content, is_active)
        VALUES ($1, $2, CURRENT_DATE, $3::jsonb, true)
        RETURNING *
      `, [newUuid, version, JSON.stringify(entries)])

      return result.rows[0]
    } catch (error: unknown | any) {
      // Correct way to log an error with Winston
      // Pass the error message first, then the stack trace or the full error object     
      this.logger.error(`Failed to insert dictionary ${version}: ${error.message}`, error.stack);
      throw error;
    }
  }
}

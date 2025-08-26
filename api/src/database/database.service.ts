import { Injectable, OnModuleDestroy, OnModuleInit, Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import { Pool, QueryResult } from 'pg'

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: Pool

  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  async onModuleInit() {
    // Initialize the PostgreSQL connection pool
    this.pool = new Pool({
      host: this.configService.get<string>('DB_HOST', 'localhost'),
      port: this.configService.get<number>('DB_PORT', 5432),
      database: this.configService.get<string>('DB_NAME', 'genz_translator'),
      user: this.configService.get<string>('DB_USER', 'postgres'),
      password: this.configService.get<string>('DB_PASSWORD', 'pass'),
      max: 10, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })

    // Test the connection
    try {
      const client = await this.pool.connect()
      this.logger.info('Database connected successfully')
      client.release()
    } catch (error) {
      this.logger.error('Database connection failed:', error)
      throw error
    }
  }

  async onModuleDestroy() {
    // Clean up database connections when the module shuts down
    if (this.pool) {
      await this.pool.end()
      this.logger.info('Database connection pool closed')
    }
  }

  // Basic query method - use this for all database calls
  async query(text: string, params?: any[]): Promise<QueryResult> {
    try {
      const start = Date.now()
      const result = await this.pool.query(text, params)
      const duration = Date.now() - start
      
      this.logger.debug(`Query executed in ${duration}ms`, {
        query: text.substring(0, 100), // First 100 chars for debugging
        rowCount: result.rowCount,
        duration
      })
      
      return result
    } catch (error) {
      this.logger.error('Database query failed:', {
        query: text.substring(0, 100),
        params: params?.map(p => typeof p === 'string' ? p.substring(0, 50) : p),
        error: error.message
      })
      throw error
    }
  }

  // Health check method 
  async isHealthy(): Promise<boolean> {
    try {
      const result = await this.query('SELECT NOW() as current_time')
      return result.rows.length > 0
    } catch (error) {
      return false
    }
  }
}
import APP_CONSTANTS from '@/constants/appConstants'
import * as SQLite from 'expo-sqlite'

class DatabaseManager {
  private static instance: DatabaseManager
  private db: SQLite.SQLiteDatabase | null = null
  private isInitialized: boolean = false

  private constructor() {}

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager()
    }
    return DatabaseManager.instance
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 🔧 CORE CONNECTION MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════════

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      logger.log('🔄 MEGA POWERS: Initializing LEAN CONSOLIDATED database manager...')
      
      this.db = await SQLite.openDatabaseAsync('fallacy_daily.db')
      logger.log('✅ Database opened successfully')
      
      // Test connection
      const testResult = await this.db.getFirstAsync('SELECT 1 as test')
      logger.log('✅ Database connection test passed:', testResult)
      
      // Run migrations to create LEAN consolidated architecture
      await this.runMigrations()
      
      this.isInitialized = true
      logger.log('✅ : LEAN CONSOLIDATED database manager initialized!')
    } catch (error) {
      logger.error('❌ Error initializing database manager:', error)
      this.isInitialized = false
      throw error
    }
  }

  getDatabase(): SQLite.SQLiteDatabase {
    if (!this.db || !this.isInitialized) {
      throw new Error('Database not initialized. Call initialize() first.')
    }
    return this.db
  }

  isReady(): boolean {
    return this.isInitialized && this.db !== null
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.closeAsync()
      this.db = null
      this.isInitialized = false
      logger.log('📚 Database connection closed - SEE YOU LATER, BROTHER!')
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 🏗️ SCHEMA CREATION & MIGRATIONS
  // ═══════════════════════════════════════════════════════════════════════════════

  private async runMigrations(): Promise<void> {
    logger.log('🔄 MEGA POWERS: Running LEAN CONSOLIDATED migrations...')
    
    // Create all essential tables
    await this.createUserProgressTable()
    
    // Create performance indexes
    await this.createIndexes()
    
    logger.log('✅ RICK RUDE STYLE: LEAN CONSOLIDATED database migrations completed!')
  }

  private async createUserProgressTable(): Promise<void> {
    // User progress table - ULTRA LEAN WITH FAVORITES!
    await this.db!.execAsync(`
      CREATE TABLE IF NOT EXISTS user_progress (
        fallacy_id TEXT PRIMARY KEY,
        is_learned BOOLEAN DEFAULT FALSE,
        is_favorite BOOLEAN DEFAULT FALSE
      );
    `)

    // Handle existing databases - add is_favorite column if missing
    try {
      await this.db!.execAsync(`
        ALTER TABLE user_progress ADD COLUMN is_favorite BOOLEAN DEFAULT FALSE;
      `)
      logger.log('⭐ : Added is_favorite column to existing user_progress table!')
    } catch (alterError) {
      // Column probably already exists - that's fine!
      logger.log('⭐ is_favorite column already exists or table is new - CHAMPIONSHIP READY!')
    }
  }

  private async createIndexes(): Promise<void> {
    // Create CHAMPIONSHIP indexes for ULTRA LEAN performance
    await this.db!.execAsync(`
    `)
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 🚨 DATABASE RESET OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════════

  async reset(): Promise<void> {
    if (APP_CONSTANTS.DEBUG_TOOLS_ACTIVE) {
      try {
        logger.log('🚨  DATABASE RESET INITIATED!')
        
        // STEP 1: Mark as not ready to prevent new database operations
        this.isInitialized = false
        logger.log('🔒 Database marked as not ready - blocking new operations')
        
        // STEP 2: Wait a moment for any ongoing operations to complete
        await new Promise(resolve => setTimeout(resolve, 500))
        logger.log('⏱️ Waited for ongoing operations to complete')
        
        // STEP 3: Close database connection properly
        if (this.db) {
          try {
            await this.db.closeAsync()
            logger.log('📚 Database connection closed successfully')
          } catch (closeError) {
            logger.warn('⚠️ Warning closing database (may already be closed):', closeError)
          }
          this.db = null
        }
        
        // STEP 4: Wait again to ensure file handle is released
        await new Promise(resolve => setTimeout(resolve, 300))
        logger.log('⏱️ Waited for file handle release')
        
        // STEP 5: Delete the database file
        try {
          await SQLite.deleteDatabaseAsync('fallacy_daily.db')
          logger.log('🗑️ Database file deleted - BODY SLAMMED!')
        } catch (deleteError) {
          logger.error('❌ Error deleting database file:', deleteError)
          // If delete fails, we can still continue with reinitialization
          logger.log('🔄 Continuing with reinitialization despite delete error...')
        }
        
        // STEP 6: Wait before reinitializing
        await new Promise(resolve => setTimeout(resolve, 200))
        
        // STEP 7: Reinitialize the database
        logger.log('🔄 Starting reinitialization...')
        await this.initialize()
        
        logger.log('✅ : Database reset and reinitialized - LEAN CONSOLIDATED AND BACK IN ACTION!')
      } catch (error) {
        logger.error('❌ Error resetting database:', error)
        
        // RECOVERY: Try to at least get a working database even if reset failed
        try {
          logger.log('🔄 RECOVERY: Attempting to reinitialize without full reset...')
          this.db = null
          this.isInitialized = false
          await this.initialize()
          logger.log('✅ RECOVERY: Database reinitialized successfully!')
        } catch (error) {
          logger.error('❌ RECOVERY FAILED:', error)
          throw error
        }
      }
    } else {
      logger.warn('⚠️ Database reset only available in development mode, brother!')
    }
  }

}

export default DatabaseManager
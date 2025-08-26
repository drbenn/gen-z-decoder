import APP_CONSTANTS from '@/constants/appConstants'
import DatabaseManager from './DatabaseManager'

class DatabaseService {
  private static instance: DatabaseService
  private dbManager = DatabaseManager.getInstance()

  private constructor() {}

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
    }
    return DatabaseService.instance
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // 🏆 CORE DATABASE OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════════

  async initialize(): Promise<void> {
    await this.dbManager.initialize()
    // logger.log('🎉 CHAMPIONSHIP: DatabaseService fully initialized!')
  }

  isReady(): boolean {
    return this.dbManager.isReady()
  }

  async forceReset(): Promise<void> {
    if (APP_CONSTANTS.DEBUG_TOOLS_ACTIVE) {
      try {
        // logger.log('💥 : Starting CHAMPIONSHIP database reset sequence!')
        
        // STEP 1: Stop all database operations by marking as not ready
        // logger.log('🛑 Stopping all database operations...')
        
        // STEP 2: Reset the database manager with proper timing
        await this.dbManager.reset()
        
        // STEP 3: Verify everything is working
        if (this.dbManager.isReady()) {
          // logger.log('✅ MEGA POWERS: Database reset complete - CONSOLIDATED AND READY!')
          
          // STEP 4: Log the clean state
          await this.logAllTables()
        } else {
          // logger.error('❌ Database reset completed but not ready!')
          throw new Error('Database reset failed - not ready after reset')
        }
        
      } catch (error) {
        // logger.error('❌ Database reset failed:', error)
        
        // RECOVERY ATTEMPT: Try manual reinitialization
        try {
          // logger.log('🔄 RECOVERY: Attempting manual database reinitialization...')
          await this.dbManager.initialize()
          
          if (this.dbManager.isReady()) {
            // logger.log('✅ RECOVERY SUCCESS: Database manually reinitialized!')
          } else {
            throw new Error('Manual reinitialization failed')
          }
        } catch (recoveryError) {
          // logger.error('❌ RECOVERY FAILED:', recoveryError)
          throw new Error(`Database reset failed: ${error}`)
        }
      }
    } else {
      // logger.warn('⚠️ Database reset only available in development mode, brother!')
      throw new Error('Database reset only available in development mode')
    }
  }

  getDatabase() {
    return this.dbManager.getDatabase()
  }

  async close(): Promise<void> {
    await this.dbManager.close()
  }


  // ═══════════════════════════════════════════════════════════════════════════════
  // 🔍 DEBUG & LOGGING OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════════

  async logAllTables(): Promise<void> {
    const db = this.dbManager.getDatabase()
    
    try {
      logger.log('📊 === CHAMPIONSHIP DATABASE TABLES ===')
      
      const tables = await db.getAllAsync(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
      ) as { name: string }[]
      
      logger.log('📝 CHAMPIONSHIP Tables found:', tables.map(t => t.name))
      logger.log(`💪 CONSOLIDATED APPROVED: ${tables.length} essential tables with consolidated quiz_history!`)
      
      for (const table of tables) {
        logger.log(`\n🔍 === TABLE: ${table.name} ===`)
        
        const schema = await db.getAllAsync(`PRAGMA table_info(${table.name})`) as any[]
        logger.log('📐 Schema:')
        schema.forEach(col => {
          logger.log(`  - ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`)
        })
        
        const countResult = await db.getFirstAsync(`SELECT COUNT(*) as count FROM ${table.name}`) as { count: number }
        logger.log(`📊 Total rows: ${countResult.count}`)
      }
      
      logger.log('📊 === END CONSOLIDATED DATABASE TABLES ===')
    } catch (error) {
      logger.error('❌ Error logging tables:', error)
    }
  }

}

// Export the singleton instance - ONE CONSOLIDATED DATABASE SERVICE TO RULE THEM ALL!
const databaseService = DatabaseService.getInstance()
export default databaseService
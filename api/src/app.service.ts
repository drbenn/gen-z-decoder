import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database/database.service';

@Injectable()
export class AppService {

  constructor(
    private readonly db: DatabaseService,
  ) {

    }
  getHello(): string {
    return 'Hello World!';
  }

  async testDatabase(): Promise<{ status: string, time: string }> {
    const result = await this.db.query('SELECT NOW() as current_time')
    return {
      status: 'database connected',
      time: result.rows[0].current_time
    }
  }
}

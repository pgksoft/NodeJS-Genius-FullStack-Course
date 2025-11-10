import { connect, connection } from 'mongoose';
import type { Db } from 'mongodb';
import { config } from 'settings-core/env';
import { logger } from 'storage-migrations/logger';

export abstract class MigrationBase {
  abstract id: string; // 'YYYYMMDD_HHMM_short-description' This usually corresponds to the file name.
  abstract name: string; // full-description
  abstract up(): Promise<void>;
  abstract down(): Promise<void>;

  // factory method for creating an instance
  static init<T extends MigrationBase>(this: new () => T): T {
    return new this();
  }

  // Working Safely with MongoDB: Connecting, Executing, and Closing
  protected async withDb<T>(fn: (db: Db) => Promise<T>): Promise<T> {
    await connect(config.mongoUri, {
      dbName: config.dbName,
    });
    try {
      return await fn(connection.db!);
    } finally {
      await connection.close();
    }
  }

  // Start/end logging + time measurement
  protected async runWithLogging<T>(phase: 'up' | 'down', fn: () => Promise<T>): Promise<T> {
    const start = Date.now();
    logger.info({ id: this.id, name: this.name, phase }, 'Migration started');
    try {
      const result = await fn();
      const ms = Date.now() - start;
      logger.info({ id: this.id, phase, durationMs: ms }, 'Migration finished');
      return result;
    } catch (err) {
      const ms = Date.now() - start;
      logger.error({ id: this.id, phase, durationMs: ms, err }, 'Migration failed');
      throw err;
    }
  }
}

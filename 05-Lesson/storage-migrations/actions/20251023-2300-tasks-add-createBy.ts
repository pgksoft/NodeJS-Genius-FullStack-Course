import { Types } from 'mongoose';
import { logger } from 'storage-migrations/logger';
import { MigrationBase } from '../helpers/migration-base';

class TasksAddCreateByWithIndex extends MigrationBase {
  id = '20251023-2300-tasks-add-createBy';
  name = 'Tasks: add createBy field with index';

  async up(): Promise<void> {
    await this.runWithLogging('up', async () => {
      await this.withDb(async (db) => {
        const tasks = db.collection('tasks');
        const users = db.collection('users');

        // TODO: replace with your actual userId
        const userId = new Types.ObjectId('68ab34e74993602eeb9f3648');

        // (a) Check if user exists
        const user = await users.findOne({ _id: userId });
        if (!user) {
          throw new Error(`[Migration up] User with id=${userId} not found`);
        }

        // (b) Check if field already exists
        const hasField = await tasks.findOne({ createBy: { $exists: true } });
        if (!hasField) {
          logger.info('[Migration up] Adding createBy field to all documents');
          const result = await tasks.updateMany(
            { createBy: { $exists: false } },
            { $set: { createBy: userId } },
          );
          logger.info(`[Migration up] Updated documents: ${result.modifiedCount}`);
        } else {
          logger.info('[Migration up] Field createBy already exists');
        }

        // (c) Check if index exists
        const indexes = await tasks.listIndexes().toArray();
        const hasIndex = indexes.some((idx) => Object.keys(idx.key).includes('createBy'));
        if (!hasIndex) {
          logger.info('[Migration up] Creating index for createBy');
          await tasks.createIndex({ createBy: 1 });
        } else {
          logger.info('[Migration up] Index for createBy already exists');
        }
      });
    });
  }

  async down(): Promise<void> {
    await this.runWithLogging('down', async () => {
      await this.withDb(async (db) => {
        const tasks = db.collection('tasks');

        // (a) Drop index if exists
        const indexes = await tasks.listIndexes().toArray();
        const idx = indexes.find((i) => Object.keys(i.key).includes('createBy'));
        if (idx) {
          logger.info(`[Migration down] Dropping index ${idx.name}`);
          await tasks.dropIndex(idx.name);
        } else {
          logger.warn('[Migration down] Index for createBy not found');
        }

        // (b) Remove field if exists
        const hasField = await tasks.findOne({ createBy: { $exists: true } });
        if (hasField) {
          logger.info('[Migration down] Removing createBy field from documents');
          const result = await tasks.updateMany({}, { $unset: { createBy: '' } });
          logger.info(`[Migration down] Updated documents: ${result.modifiedCount}`);
        } else {
          logger.warn('[Migration down] Field createBy not found');
        }
      });
    });
  }
}

export default TasksAddCreateByWithIndex.init();

import { logger } from 'storage-migrations/logger';
import { MigrationBase } from '../helpers/migration-base';

class TasksRenameIsCompletedToCompleted extends MigrationBase {
  id = '20251023-1220-tasks-rename-isCompleted';
  name = 'Tasks: rename isCompleted to completed';

  async up(): Promise<void> {
    await this.runWithLogging('up', async () => {
      await this.withDb(async (db) => {
        const tasks = db.collection('tasks');

        // 1. Get all indexes
        const indexes = await tasks.listIndexes().toArray();
        const isCompletedIndex = indexes.find((idx) => idx.key && idx.key.isCompleted === 1);

        if (isCompletedIndex) {
          logger.info({ index: isCompletedIndex }, '[Migration up] Found index for isCompleted');
          await tasks.dropIndex(isCompletedIndex.name);
          logger.info(`[Migration up] Index ${isCompletedIndex.name} removed`);
        } else {
          logger.warn('[Migration up] isCompleted index not found');
        }

        // 2. Rename the field text → description
        const result = await tasks.updateMany({}, [
          { $set: { completed: '$isCompleted' } },
          { $unset: 'isCompleted' },
        ]);
        logger.info(`[Migration up] Updated documents: ${result.modifiedCount}`);

        // 3. Recreate the index if there was one
        if (isCompletedIndex) {
          const { key, name, v, ns, ...options } = isCompletedIndex;
          await tasks.createIndex({ completed: 1 }, options);
          logger.info({ options }, '[Migration up] The index has been recreated for completed');
        }
      });
    });
  }

  async down(): Promise<void> {
    await this.runWithLogging('down', async () => {
      await this.withDb(async (db) => {
        const tasks = db.collection('tasks');

        // 1. Get all indexes
        const indexes = await tasks.listIndexes().toArray();
        const descIndex = indexes.find((idx) => idx.key && idx.key.completed === 1);

        if (descIndex) {
          logger.info({ index: descIndex }, '[Migration down] Found index for completed');
          await tasks.dropIndex(descIndex.name);
          logger.info(`[Migration down] Index ${descIndex.name} removed`);
        } else {
          logger.warn('[Migration down] Completed index not found');
        }

        // 2. Rename back description → text
        const result = await tasks.updateMany({}, [
          { $set: { isCompleted: '$completed' } },
          { $unset: 'completed' },
        ]);
        logger.info(`[Migration down] Updated documents: ${result.modifiedCount}`);

        // 3. Recreate the index if there was one
        if (descIndex) {
          const { key, name, v, ns, ...options } = descIndex;
          await tasks.createIndex({ iscCompleted: 1 }, options);
          logger.info(
            { options },
            '[Migration down] The index has been recreated for iscCompleted',
          );
        }
      });
    });
  }
}

export default TasksRenameIsCompletedToCompleted.init();

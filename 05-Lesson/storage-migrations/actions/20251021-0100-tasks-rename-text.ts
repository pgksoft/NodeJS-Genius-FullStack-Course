import { logger } from 'storage-migrations/logger';
import { MigrationBase } from '../helpers/migration-base';

class TasksRenameTextToDescription extends MigrationBase {
  id = '20251021-0100-tasks-rename-text';
  name = 'Tasks: rename text to description';

  async up(): Promise<void> {
    await this.runWithLogging('up', async () => {
      await this.withDb(async (db) => {
        const tasks = db.collection('tasks');

        // 1. Get all indexes
        const indexes = await tasks.listIndexes().toArray();
        const textIndex = indexes.find((idx) => idx.key && idx.key.text === 1);

        if (textIndex) {
          logger.info({ index: textIndex }, '[Migration up] Found index for text');
          await tasks.dropIndex(textIndex.name);
          logger.info(`[Migration up] Index ${textIndex.name} removed`);
        } else {
          logger.warn('[Migration up] Text index not found');
        }

        // 2. Rename the field text → description
        const result = await tasks.updateMany({}, [
          { $set: { description: '$text' } },
          { $unset: 'text' },
        ]);
        logger.info(`[Migration up] Updated documents: ${result.modifiedCount}`);

        // 3. Recreate the index if there was one
        if (textIndex) {
          const { key, name, v, ns, ...options } = textIndex;
          await tasks.createIndex({ description: 1 }, options);
          logger.info({ options }, '[Migration up] The index has been recreated for description');
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
        const descIndex = indexes.find((idx) => idx.key && idx.key.description === 1);

        if (descIndex) {
          logger.info({ index: descIndex }, '[Migration down] Found index for description');
          await tasks.dropIndex(descIndex.name);
          logger.info(`[Migration down] Index ${descIndex.name} removed`);
        } else {
          logger.warn('[Migration down] Description index not found');
        }

        // 2. Rename back description → text
        const result = await tasks.updateMany({}, [
          { $set: { text: '$description' } },
          { $unset: 'description' },
        ]);
        logger.info(`[Migration down] Updated documents: ${result.modifiedCount}`);

        // 3. Recreate the index if there was one
        if (descIndex) {
          const { key, name, v, ns, ...options } = descIndex;
          await tasks.createIndex({ text: 1 }, options);
          logger.info({ options }, '[Migration down] The index has been recreated for text');
        }
      });
    });
  }
}

export default TasksRenameTextToDescription.init();

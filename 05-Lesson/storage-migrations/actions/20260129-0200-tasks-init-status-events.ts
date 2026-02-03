import { Types } from 'mongoose';
import { logger } from 'storage-migrations/logger';
import { MigrationBase } from '../helpers/migration-base';

class TasksInitStatusEvents extends MigrationBase {
  id = '20260129-0200-tasks-init-status-events';
  name = 'Tasks: create initial TaskStatusEvent for each task and link via taskStatusEventId';

  async up(): Promise<void> {
    await this.runWithLogging('up', async () => {
      await this.withDb(async (db) => {
        const tasks = db.collection('tasks');
        const logs = db.collection('task-status-log');

        const defaultStatusId = new Types.ObjectId('696ac2c34618ad252542aecf');
        const systemUserId = new Types.ObjectId('68ab34e74993602eeb9f3648');

        const cursor = tasks.find({
          taskStatusEventId: { $exists: false },
        });

        let processed = 0;

        while (await cursor.hasNext()) {
          const task = await cursor.next();
          if (!task) continue;

          const logDoc = {
            taskId: task._id,
            taskStatusId: defaultStatusId,
            comment: '',
            startDate: new Date(),
            endDate: null,
            createBy: systemUserId,
          };

          const { insertedId } = await logs.insertOne(logDoc);

          await tasks.updateOne({ _id: task._id }, { $set: { taskStatusEventId: insertedId } });

          processed++;
        }

        logger.info(`[Migration up] Initialized status logs for tasks: ${processed}`);
      });
    });
  }

  async down(): Promise<void> {
    await this.runWithLogging('down', async () => {
      await this.withDb(async (db) => {
        const tasks = db.collection('tasks');
        const logs = db.collection('task-status-logs');

        const cursor = tasks.find({
          taskStatusEventId: { $exists: true },
        });

        let processed = 0;

        while (await cursor.hasNext()) {
          const task = await cursor.next();
          if (!task) continue;

          const logId = task.taskStatusEventId;

          await logs.deleteOne({ _id: logId });

          await tasks.updateOne({ _id: task._id }, { $unset: { taskStatusEventId: '' } });

          processed++;
        }

        logger.info(`[Migration down] Removed initial status logs from tasks: ${processed}`);
      });
    });
  }
}

export default TasksInitStatusEvents.init();

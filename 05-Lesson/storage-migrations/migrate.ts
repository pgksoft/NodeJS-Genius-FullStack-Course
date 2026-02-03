import 'dotenv/config';
import path from 'node:path';
import { logger } from './logger';
import { MigrationState } from './state';
import { registry } from './registry';

type Command = 'up' | 'down' | 'down-last' | 'status';

function parseArgs(): { cmd: Command; limit?: number } {
  const [, , cmdRaw, ...rest] = process.argv;
  if (!cmdRaw || !['up', 'down', 'down-last', 'status'].includes(cmdRaw)) {
    return { cmd: 'status' };
  }
  const cmd = cmdRaw as Command;
  const limitArg = rest.find((a) => a.startsWith('--limit='));
  const limit = limitArg ? Number(limitArg.split('=')[1]) : undefined;
  return { cmd, limit };
}

async function main() {
  const { cmd, limit } = parseArgs();
  const state = new MigrationState({ storagePath: path.join(__dirname, '.migrate-state.json') });

  await state.init();
  const executed = await state.getExecutedIds();

  switch (cmd) {
    case 'status': {
      const all = registry.getAll();
      const pending = all.filter((m) => !executed.has(m.id));
      logger.info(
        { total: all.length, done: executed.size, pending: pending.length },
        'Migration status',
      );
      [...executed].forEach((id) => logger.info({ id }, 'Executed'));
      pending.forEach((m) => logger.info({ id: m.id, name: m.name }, 'Pending'));
      break;
    }
    case 'up': {
      const pending = registry.getPending(executed);
      const batch = typeof limit === 'number' ? pending.slice(0, limit) : pending;
      for (const m of batch) {
        try {
          logger.info({ id: m.id, name: m.name }, 'Applying migration');
          await m.up();
          await state.markExecuted(m.id);
          logger.info({ id: m.id }, 'Applied');
        } catch (err) {
          logger.error({ id: m.id, err }, 'Migration failed, stopping batch');
          throw err;
        }
      }
      break;
    }
    case 'down': {
      const batch =
        typeof limit === 'number'
          ? registry.getExecutedOrdered(executed).slice(0, limit)
          : registry.getExecutedOrdered(executed);
      for (const m of batch) {
        logger.info({ id: m.id, name: m.name }, 'Reverting migration');
        await m.down();
        await state.unmarkExecuted(m.id);
        logger.info({ id: m.id }, 'Reverted');
      }
      break;
    }
    case 'down-last': {
      const last = registry.getLastExecuted(executed);
      if (!last) {
        logger.info('Nothing to rollback');
        break;
      }
      logger.info({ id: last.id, name: last.name }, 'Reverting last migration');
      await last.down();
      await state.unmarkExecuted(last.id);
      logger.info({ id: last.id }, 'Reverted last');
      break;
    }
  }
}

main().catch((err) => {
  logger.error({ err }, 'Migration failed');
  process.exitCode = 1;
});

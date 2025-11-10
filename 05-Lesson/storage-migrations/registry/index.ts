import fs from 'fs';
import path from 'path';
import { MigrationBase } from '../helpers/migration-base';
import { logger } from '../logger';

export type Migration = {
  id: string;
  name: string;
  up: () => Promise<void>;
  down: () => Promise<void>;
};

const migrationsActionsDir = path.resolve(__dirname, '../actions');

const migrationFiles = fs
  .readdirSync(migrationsActionsDir)
  .filter((file) => file.endsWith('.ts') || file.endsWith('.js'))
  .sort();

const migrations: Migration[] = [];

for (const file of migrationFiles) {
  const mod = require(path.join(migrationsActionsDir, file));
  const instance: MigrationBase = mod.default;

  if (
    !(instance instanceof MigrationBase) ||
    typeof instance.id !== 'string' ||
    typeof instance.name !== 'string' ||
    typeof instance.up !== 'function' ||
    typeof instance.down !== 'function'
  ) {
    logger.error({ file }, 'Migration does not implement MigrationBase correctly');
    throw new Error(`Invalid migration: ${file}`);
  }

  migrations.push({
    id: instance.id,
    name: instance.name,
    up: instance.up.bind(instance),
    down: instance.down.bind(instance),
  });
}

logger.info({ count: migrations.length, files: migrationFiles }, 'Migrations registry initialized');

export const registry = {
  getAll: () => migrations.slice(),
  getPending: (executed: Set<string>) => migrations.filter((m) => !executed.has(m.id)),
  getExecutedOrdered: (executed: Set<string>) =>
    migrations.filter((m) => executed.has(m.id)).reverse(),
  getLastExecuted: (executed: Set<string>) =>
    migrations.filter((m) => executed.has(m.id)).slice(-1)[0],
};

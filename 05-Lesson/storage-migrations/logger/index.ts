import pino from 'pino';
import { config } from 'settings-core/env';

// Basic, extremely simple logger for migrations
export const logger = pino({
  level: 'info',
  transport:
    config.nodeEnv === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            singleLine: true,
          },
        }
      : undefined,
});

import 'dotenv/config';

function getEnvVar(key: keyof NodeJS.ProcessEnv, required = true): string {
  const value = process.env[key];
  if (required && !value) {
    throw new Error(`❌ Missing required env variable: ${key}`);
  }
  return value!;
}

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  mongoUri: getEnvVar('MONGO_URI'),
  dbName: getEnvVar('DB_NAME'),
  jwtSecret: getEnvVar('JWT_SECRET'),
  nodeEnv: process.env.NODE_ENV || 'development',
};
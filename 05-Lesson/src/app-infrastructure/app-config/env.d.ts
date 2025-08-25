declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string;
    MONGO_URI: string;
    DB_NAME: string;
    JWT_SECRET: string;
    NODE_ENV?: 'development' | 'production' | 'test';
  }
}
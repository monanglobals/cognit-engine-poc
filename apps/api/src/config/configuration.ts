import { NodeEnv, validateEnv } from './env.validation';

export interface OpenAiConfig {
  apiKey: string;
  model: string;
  baseUrl?: string;
}

export interface AppConfig {
  nodeEnv: NodeEnv;
  isProduction: boolean;
  port: number;
  corsOrigins: string[];
  databaseUrl: string;
  openai: OpenAiConfig;
}

/**
 * Shapes the validated environment into the object the app injects through
 * `ConfigService`. Nothing outside this file should read `process.env`.
 */
export const appConfig = (): AppConfig => {
  const env = validateEnv(process.env);

  return {
    nodeEnv: env.NODE_ENV,
    isProduction: env.NODE_ENV === NodeEnv.Production,
    port: env.PORT,
    corsOrigins: env.CORS_ORIGIN.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
    databaseUrl: env.DATABASE_URL,
    openai: {
      apiKey: env.OPENAI_API_KEY,
      model: env.OPENAI_MODEL,
      baseUrl: env.OPENAI_BASE_URL,
    },
  };
};

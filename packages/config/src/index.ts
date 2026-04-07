export interface AppConfig {
  apiPort: number;
  redisUrl: string;
}

export const getConfig = (): AppConfig => ({
  apiPort: Number(process.env.API_PORT ?? 4000),
  redisUrl: process.env.REDIS_URL ?? "redis://localhost:6379"
});

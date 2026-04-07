export interface AppConfig {
  apiPort: number;
}

export const getConfig = (): AppConfig => ({
  apiPort: Number(process.env.API_PORT ?? 4000)
});

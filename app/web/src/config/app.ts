const env = import.meta.env;

export const appConfig = {
  apiBaseUrl: env.VITE_API_URL as string,
};
export type AppConfig = typeof appConfig;

console.log(appConfig);

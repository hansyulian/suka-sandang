const env = import.meta.env;

export const appConfig = {
  apiBaseUrl: env.VITE_API_URL as string,
  exposeApiClient: env.VITE_EXPOSE_API_CLIENT === "true",
};
export type AppConfig = typeof appConfig;

console.log(appConfig);

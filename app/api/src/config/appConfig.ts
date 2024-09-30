const pe = process.env;
export const appConfig = {
  env: pe.NODE_ENV,
  debug: pe.API_DEBUG === "true",
  app: {
    port: pe.API_PORT ? parseInt(pe.API_PORT) : 3000,
    maximumRetrieval: parseInt(pe.MAXIMUM_RETRIEVAL || "100"),
  },
  jwt: {
    secret: pe.JWT_SECRET ?? "supersecretjwtkey",
    expiry: parseInt(pe.JWT_EXPIRY || `${30 * 24 * 3600}`),
    cookieKey: pe.API_JWT_COOKIE_KEY || "auth_token",
  },
};
if (appConfig.debug) {
  console.log(appConfig);
}

const { config } = require("dotenv");
const path = require("path");
const envPath = path.resolve(__dirname, "../../.env.test");
console.log("using env path: ", envPath);
config({ path: envPath });

const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig");
const { execSync } = require("child_process");
execSync("pnpm migrate:reset");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testMatch: ["**/?(*.)+(spec|test).ts"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  maxWorkers: 1,
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], // Path to your setup file
};

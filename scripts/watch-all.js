const concurrently = require("concurrently");

const projects = [
  "core/common",
  "core/api-contract",
  "core/api-contract-client",
  "core/express-api-contract-client",
  "core/react-api-contract-client",
  "app/common",
  "app/engine",
];

const commands = projects.map((project) => ({
  command: `pnpm --filter ./${project} run watch`,
  name: project,
  prefixColor: "bgBlue.bold",
}));

concurrently(commands, {
  prefix: "name",
  killOthers: ["failure", "success"],
  restartTries: 3,
});

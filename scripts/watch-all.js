const concurrently = require("concurrently");

const projects = ["core/common", "app/api", "app/web"];

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

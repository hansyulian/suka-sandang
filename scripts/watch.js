const { spawn } = require("child_process");
const path = require("path");

// List of directories to run the nodemon command in
const folders = [
  "app/engine",
  "app/common",
  "core/express-api-contract",
  "core/react-api-contract",
  "core/api-contract",
  "core/common",
];

// Array to hold the child processes
const childProcesses = [];

// Function to start nodemon in each folder
function runNodemonInFolder(folder) {
  const absolutePath = path.resolve(folder);

  // Spawn nodemon in the folder
  const child = spawn("npx", ["nodemon"], {
    cwd: absolutePath, // Set current working directory
    stdio: "inherit", // Inherit stdout/stderr from parent process (so we see logs)
    shell: true, // Use shell to ensure proper command execution on different platforms
  });

  // Push the child process to the array for later tracking
  childProcesses.push(child);

  // Log in case of any errors
  child.on("error", (err) => {
    console.error(`Error running nodemon in ${folder}:`, err);
  });

  // Log when the process exits
  child.on("exit", (code) => {
    console.log(`Nodemon in ${folder} exited with code ${code}`);
  });
}

// Function to run all nodemon processes with a delay
async function runAllNodemonsWithDelay() {
  for (const folder of folders) {
    runNodemonInFolder(folder);
    await new Promise((resolve) => setTimeout(resolve, 0)); // Wait for 3 seconds
  }
}

// Run nodemon in each folder with a delay
runAllNodemonsWithDelay();

// When the main process is terminated (CTRL+C or otherwise), kill all child processes
process.on("SIGINT", () => {
  console.log("\nTerminating all watchers...");

  childProcesses.forEach((child) => {
    if (child && !child.killed) {
      child.kill("SIGTERM"); // Gracefully kill each child process
    }
  });

  process.exit(); // Exit the main process
});

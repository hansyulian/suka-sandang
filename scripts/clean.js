const fs = require("fs");
const path = require("path");

const deleteDirRecursive = (dirPath) => {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const curPath = path.join(dirPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteDirRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dirPath);
  }
};

const removeDirs = (dirName) => {
  const dirPaths = [];
  const walkDir = (dir) => {
    fs.readdirSync(dir).forEach((file) => {
      const curPath = path.join(dir, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        if (file === dirName) {
          dirPaths.push(curPath);
        } else {
          walkDir(curPath);
        }
      }
    });
  };

  walkDir(".");
  dirPaths.forEach(deleteDirRecursive);
};

removeDirs("node_modules");
removeDirs("dist");

console.log("Cleaned all 'node_modules' and 'dist' directories.");

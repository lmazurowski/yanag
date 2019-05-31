'use strict';

const execSync = require('child_process').execSync;
const path = require('path');
const fs = require('fs');
const os = require('os');

module.exports = {
  isYarnEnable: () => {
    try {
      execSync('yarnpkg --version', { stdio: 'ignore' });
      return true;
    } catch (e) {
      return false;
    }
  },
  getNpmVersion: () => {
    let npmVersion = null;
    try {
      npmVersion = execSync('npm --version')
        .toString()
        .trim();
    } catch (err) {

    }
    return npmVersion;
  },
  writeFile: (rootDir, fileName, content) => {
    fs.writeFileSync(
      path.join(rootDir, fileName),
      JSON.stringify(content, null, 2) + os.EOL
    );
  },
  copyFile: (pathToFile, destPath) => {
    const contents = fs.readFileSync(pathToFile, 'utf8');
    fs.writeFileSync(destPath, contents, 'utf8');
  },
  log: (...args) => {
    args.unshift('[YANAG]');
    console.log.apply(console, args);
  }
};

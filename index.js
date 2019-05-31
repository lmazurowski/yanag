#!/usr/bin/env node

'use strict';

const inquirer = require('inquirer');
const spawn = require('cross-spawn');
const fs = require('fs');
const chalk = require('chalk');
const R = require('ramda');
const semver = require('semver');

const configuration = require('./templates/configuration');
const commonFiles = require('./templates/commonFiles');
const utils = require('./common/utils');

const { getNpmVersion, isYarnEnable, writeFile, copyFile, log } = utils;

const CURR_DIR = process.cwd();

try {
  const QUESTIONS = [
    {
      name: 'project-type',
      type: 'list',
      message: 'What project template would you like to generate?',
      choices: configuration.availableProjects.filter((project) => {
        return !!configuration[project.toLowerCase()]
      })
    },
    {
      name: 'project-middlewares',
      type: 'checkbox',
      message: 'Select middlewares You want to add to the project:',
      choices: configuration.middlewares.map((middleware) => middleware.name)
    },
    {
      name: 'project-name',
      type: 'input',
      message: 'Project name:',
      validate: function (input) {
        if (fs.existsSync(`${CURR_DIR}/${input}`)) {
          return 'Directory already exists. Please, put another name.'
        }
        if (/^([A-Za-z\-_\d])+$/.test(input)) return true;
        else return 'Project name may only include letters, numbers, underscores and hashes.';
      }
    },
    {
      name: 'project-root',
      type: 'input',
      message: 'Project root dir:',
      default: 'src',
      validate: function (input) {
        if (/^([A-Za-z\-_\d])+$/.test(input)) return true;
        else return 'Project root may only include letters, numbers, underscores and hashes.';
      }
    }
  ];

  inquirer.prompt(QUESTIONS)
    .then(answers => {
      const projectType = answers['project-type'].toLowerCase();
      const projectConfig = configuration[answers['project-type'].toLowerCase()];
      const devDependencies = projectConfig.devDependencies;
      let dependencies = projectConfig.dependencies;

      const srcDir = answers['project-root'];
      const appName = answers['project-name'];
      const rootDir = `${CURR_DIR}/${appName}`;

      const selectedMiddlewares = answers['project-middlewares'];
      let middlewareDeps = [];

      selectedMiddlewares.forEach((selected) => {
        middlewareDeps = middlewareDeps.concat(R.map((y) => y.dependencies, R.filter((x) => x.name === selected, configuration.middlewares)));
      });

      if (middlewareDeps.length) {
        dependencies = dependencies.concat([].concat.apply([], middlewareDeps));
      }

      log(chalk.blue('Preparing project structure...'));

      prepareProjectStructure(rootDir, srcDir, appName, projectType);

      log(chalk.blue('Installing project dependencies...'));

      installDependencies(rootDir, dependencies).then(() => {
          log(chalk.blue('Installing project devDependencies...'));
          installDependencies(rootDir, devDependencies, true).then(() => {
            log(chalk.green('Project has been created'));
            process.exit(0);
          })
            .catch((reason) => {
              handleError(chalk.red('Error while installing devDependencies, reason:'), reason.command);
            });
        }
      ).catch((reason) => {
        handleError(chalk.red('Error while installing dependencies, reason: '), reason.command);
      });
    }).catch((reason) => {
    handleError(chalk.red('Error while user prompting, reason: '), reason);
  });

} catch (err) {
  handleError(chalk.red('Error while project creating:'), err.toString());
}

function handleError(...args) {
  log(args);
  process.exit(1);
}

function createDirectoryContents(templatePath, newProjectPath) {
  const filesToCreate = fs.readdirSync(templatePath);

  filesToCreate.forEach(file => {
    const origFilePath = `${templatePath}/${file}`;
    const stats = fs.statSync(origFilePath);

    if (stats.isFile()) {
      const writePath = `${CURR_DIR}/${newProjectPath}/${file}`;
      copyFile(origFilePath, writePath);
    } else if (stats.isDirectory()) {
      fs.mkdirSync(`${CURR_DIR}/${newProjectPath}/${file}`);

      createDirectoryContents(`${templatePath}/${file}`, `${newProjectPath}/${file}`);
    }
  });
}

function installDependencies(rootDir, dependencies = [], asDev = false) {
  return new Promise((resolve, reject) => {
    let command;
    let args;

    if (isYarnEnable()) {
      command = 'yarnpkg';
      args = asDev ? ['add', '--dev'] : ['add'];

      [].push.apply(args, dependencies);
      args.push('--cwd');
      args.push(rootDir);
    } else {
      const npmVersion = getNpmVersion();
      if (semver.gte(npmVersion, '6.0.1')) {
        command = 'npm';
        args = [
          'install',
          asDev ? '--save-dev' : '--save',
          '--loglevel',
          'error',
        ].concat(dependencies);
        args.push('--prefix');
        args.push(rootDir);
      } else {
        log(chalk.red(`The min npm version for this lib is 6.0.1, currently installed in Your system: ${npmVersion}`));
        process.exit(1);
      }
    }

    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('close', code => {
      if (code !== 0) {
        reject({
          command: `${command} ${args.join(' ')}`,
        });
        return;
      }
      resolve();
    })
  })
}

function prepareProjectStructure(rootDir, srcDir, appName, projectType) {
  const templatePath = `${__dirname}/templates/${projectType}`;

  fs.mkdirSync(rootDir);
  fs.mkdirSync(`${rootDir}/${srcDir}`);

  [
    {
      filename: 'package.json',
      content: commonFiles.packageJson(appName, srcDir)
    },
    {
      filename: 'tsconfig.json',
      content: commonFiles.tsconfig(srcDir)
    },
    {
      filename: 'tslint.json',
      content: commonFiles.tslint()
    },
    {
      filename: '.prettierrc',
      content: commonFiles.prettierrc()
    }
  ].forEach((entry) => {
    writeFile(rootDir, entry.filename, entry.content);
  });

  createDirectoryContents(templatePath, `${appName}/${srcDir}`);
}

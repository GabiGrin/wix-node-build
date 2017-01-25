'use strict';

const _ = require('lodash/fp');
const fs = require('fs');
const jest = require('jest-cli');
const config = require('../../config/project').jestConfig();
const {watchMode, inTeamCity} = require('../utils');

module.exports = (gulp, plugins) =>
  gulp.task('jest', done => {
    plugins.util.log('Testing with Jest');

    const watch = watchMode();

    if (inTeamCity()) {
      config.testResultsProcessor = 'node_modules/jest-teamcity-reporter';
      process.argv.push('--teamcity');
    }

    const configDefaults = {
      moduleNameMapper: {
        '\\.(css|less|scss)$': 'identity-obj-proxy'
      },
      testPathIgnorePatterns: [
        '<rootDir>/dist/',
        '<rootDir>/node_modules/'
      ]
    };

    if (fs.existsSync('test/jest-setup.js')) {
      configDefaults.setupTestFrameworkScriptFile = '<rootDir>/test/jest-setup.js';
    }

    jest.runCLI({watch, config: _.merge(configDefaults, config)}, process.cwd(), result => {
      result.success ? done() : done('jest failed');
    });
  });

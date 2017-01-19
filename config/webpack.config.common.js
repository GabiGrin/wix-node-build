'use strict';

const path = require('path');
const context = path.resolve('./src');
const projectConfig = require('./project');

const config = {
  context,

  output: {
    path: path.resolve('./dist'),
    pathinfo: true
  },

  resolve: {
    modules: [context],
    extensions: ['.ts', '.js', '.tsx', '.jsx']
  },

  resolveLoader: {
    modules: [path.join(__dirname, '..', 'node_modules')]
  },

  module: {
    rules: [
      require('../lib/loaders/babel')(projectConfig.isAngularProject()),
      require('../lib/loaders/typescript')(projectConfig.isAngularProject()),
      require('../lib/loaders/images')(),
      require('../lib/loaders/html')(),
      require('../lib/loaders/raw')()
    ]
  },

  devtool: 'source-map',

  externals: projectConfig.externals()
};

module.exports = config;

'use strict';

const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const path = require('path');
const {mergeByConcat, isSingleEntry} = require('../lib/utils');
const webpackConfigCommon = require('./webpack.config.common');
const projectConfig = require('./project');
const DynamicPublicPath = require('../lib/plugins/dynamic-public-path');

const config = ({debug, separateCss = projectConfig.separateCss()} = {}) => {
  const cssModules = projectConfig.cssModules();
  const tpaStyle = projectConfig.tpaStyle();
  const extractCSS = getExtractCss();

  return mergeByConcat(webpackConfigCommon, {
    entry: getEntry(),

    module: {
      rules: [
        require('../lib/loaders/sass')(extractCSS, cssModules, tpaStyle).client
      ]
    },

    plugins: [
      new DynamicPublicPath(),

      new webpack.DefinePlugin({
        'process.env.NODE_ENV': debug ? '"development"' : '"production"'
      }),

      new webpack.LoaderOptionsPlugin({
        options: {
          postcss: [autoprefixer()],
        }
      }),

      ...extractCSS ? [extractCSS] : [],

      ...debug ? [] : [
        new webpack.optimize.UglifyJsPlugin({
          sourceMap: true
        })
      ]
    ],

    output: {
      path: path.resolve('./dist/statics'),
      filename: debug ? '[name].bundle.js' : '[name].bundle.min.js',
      pathinfo: debug
    },

    target: 'web'
  });

  function getExtractCss() {
    if (separateCss) {
      const ExtractTextPlugin = require('extract-text-webpack-plugin');
      return new ExtractTextPlugin({
        filename: debug ? '[name].css' : '[name].min.css'
      });
    }
  }
};

function getEntry() {
  const entry = projectConfig.entry() || projectConfig.defaultEntry();
  return isSingleEntry(entry) ? {app: entry} : entry;
}

module.exports = config;

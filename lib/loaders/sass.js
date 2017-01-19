'use strict';

module.exports = (extractCSS, cssModules, tpaStyle) => {
  const cssLoaderOptions = {
    modules: cssModules,
    camelCase: true,
    sourceMap: !!extractCSS,
    localIdentName: '[path][name]__[local]__[hash:base64:5]'
  };

  const sassLoaderOptions = {
    sourceMap: true,
    includePaths: ['.', 'node_modules']
  };

  return {
    client: {
      test: /\.s?css$/,
      use: clientLoader(extractCSS, 'style-loader', [
        {
          loader: 'css-loader',
          options: cssLoaderOptions
        },
        'postcss-loader',
        ...tpaStyle ? ['wix-tpa-style-loader'] : [],
        {
          loader: 'sass-loader',
          options: sassLoaderOptions
        }
      ])
    },
    specs: {
      test: /\.s?css$/,
      use: [
        {
          loader: 'css-loader/locals',
          options: cssLoaderOptions
        },
        ...tpaStyle ? ['wix-tpa-style-loader'] : [],
        {
          loader: 'sass-loader',
          options: sassLoaderOptions
        }
      ]
    }
  };
};

function clientLoader(extractCSS, l1, l2) {
  return extractCSS ? extractCSS.extract(l1, l2) : [l1].concat(l2).join('!');
}

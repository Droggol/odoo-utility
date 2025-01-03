const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const isFirefox = argv.browser === 'firefox';

  return {
    entry: {
      popup: path.resolve('./src/popup.jsx'),
      background: path.resolve('./src/background.js'),
      pageScript: path.resolve('./src/pageScript.js'),
      options: path.resolve('./src/options.jsx'),
      odooshScript: path.resolve('./src/odooshScript.js'),
      contentScript: path.resolve('./src/contentScript.js'),
    },
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: '[name].js',
    },
    resolve: {
      extensions: ['.jsx', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.(jsx|js)$/,
          use: [{
            loader: "babel-loader",
            options: {
                presets: ['@babel/env', '@babel/preset-react'],
            },
          }],
          exclude: /node_modules/,
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        '__REACT_DEVTOOLS_GLOBAL_HOOK__': '({ isDisabled: true })',
      }),
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
      new HtmlWebpackPlugin({
        filename: 'popup.html',
        template: 'src/popup.html',
        chunks: ['popup'],
      }),
      new HtmlWebpackPlugin({
        filename: 'options.html',
        template: 'src/options.html',
        chunks: ['options'],
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: isFirefox ? 'src/firefox_manifest.json' : 'src/manifest.json', to: 'manifest.json' },
          { from: 'src/media', to: 'media' },
        ],
      }),
    ],
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'inline-source-map',
  };
};

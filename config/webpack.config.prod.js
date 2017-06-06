const path = require('path');
const Webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const baseWebpackConfig = require('./webpack.config.base');

const ExtractSASS = new ExtractTextPlugin('/styles/app.[hash].css');

module.exports = Object.assign({}, baseWebpackConfig, {
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: './scripts/app.[hash].js'
  },
  plugins: baseWebpackConfig.plugins.concat(
    new Webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('production') } }),
    ExtractSASS
  ),
  module: Object.assign({}, baseWebpackConfig.module, {
    rules: baseWebpackConfig.module.rules.concat({
      test: /\.scss$/,
      use: ExtractSASS.extract(['css-loader', 'sass-loader'])
    })
  })
});

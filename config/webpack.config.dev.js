const path = require('path');
const Webpack = require('webpack');
const baseWebpackConfig = require('./webpack.config.base');

module.exports = Object.assign({}, baseWebpackConfig, {
  devServer: {
    contentBase: path.join(__dirname, '../'),
    historyApiFallback: true,
    hot: true,
    inline: true,
    port: 3000
  },
  devtool: 'cheap-module-source-map',
  plugins: baseWebpackConfig.plugins.concat(
    new Webpack.DefinePlugin({ 'process.env': { NODE_ENV: JSON.stringify('development') } })
  ),
  module: Object.assign({}, baseWebpackConfig.module, {
    rules: baseWebpackConfig.module.rules.concat({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader']
    })
  })
});

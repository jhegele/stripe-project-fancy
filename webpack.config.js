const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src'),
  output: {
    filename: 'js/bundle.[contenthash].js',
    path: path.resolve(__dirname, 'public'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    plugins: [new TsConfigPathsPlugin()],
  },
  module: {
    rules: [
      { test: /\.(ts|js)x?$/, loader: 'babel-loader', exclude: /node_modules/ },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: '../views/index.html',
      template: path.resolve(__dirname, 'src/html/index-template.html'),
      publicPath: '',
    }),
  ],
  mode: 'development',
  watch: true,
  devtool: 'source-map',
};

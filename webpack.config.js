const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/js'),
  },
  devtool: 'source-map',
  devServer: {
    publicPath: '/js/',
    contentBase: path.resolve(__dirname, 'public'),
    watchContentBase: true,
  }
};

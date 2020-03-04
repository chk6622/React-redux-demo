const path = require('path');

let devConfig = {
  entry: path.join(__dirname, './components/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['react', 'es2015', 'stage-0']
        }
      }, {
        test: /\.jsx$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['react', 'es2015', 'stage-0']
        }
      }, {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
};
module.exports = devConfig;

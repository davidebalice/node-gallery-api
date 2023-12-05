const path = require('path');

module.exports = {
  mode: 'production', // development', 'production', o 'none'
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        parser: {
          html: false,
        },
      },
      {
        test: /\.(node)$/,
        use: 'ignore-loader',
      },
    ],
  },
};

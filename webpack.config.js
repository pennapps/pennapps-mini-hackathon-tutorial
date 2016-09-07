var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: [
    './components/Main.js'
  ],
  output: {
    path: __dirname,
    filename: "app.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: [/node_modules/,/lib/],
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};

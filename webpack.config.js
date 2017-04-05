var path = require("path")
module.exports = {
  entry: ['./src/main.ts'],
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: [ '.ts', '.js']
  },
  module: {
    loaders: [
      {test: /\.ts(x?)$/, loader: 'ts-loader'},
      {
        include: path.resolve(__dirname, 'node_modules/pixi.js'),
        loader: 'ify-loader',
        enforce: "post"
      }
    ]
  }
};
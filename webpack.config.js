const webpack = require('webpack');
const dotenv = require('dotenv');
const dotenvParsed = dotenv.config().parsed || {};

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(dotenvParsed),
    }),
  ],
};

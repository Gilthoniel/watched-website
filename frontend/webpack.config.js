var path = require('path');
var webpack = require('webpack');
var jquery = require('jquery');

const PATHS = {
  build: path.join(__dirname, 'dist'),
  app_dir: path.join(__dirname, 'app')
};

module.exports = {
  entry: [
    PATHS.app_dir + '/index.jsx',
    'bootstrap-loader'
  ],

  output: {
    path: PATHS.build,
    publicPath: '/assets/',
    filename: 'app-bundle.js'
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      },

      // Style loader
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass']
      },

      {
        test: /\.css/,
        loaders: ['style', 'css']
      },

      {
        test: /\.(jpg|png|svg)$/,
        loader: 'file?name=[path][name].[hash].[ext]'
      },

      {
        test: /\.(svg|woff|woff2|eot|ttf)$/,
        loader: 'url-loader?limit=100000'
      },

      // Bootstrap 3
      { test:/bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/, loader: 'imports?jQuery=jquery' },

      // mCustomScrollbar
      { test: /jquery-mousewheel[\/\\]/, loader: "imports?define=>false&this=>window" },
      {
        test: /malihu-custom-scrollbar-plugin[\/\\]/,
        loader: "imports?define=>false&this=>window",
        exclude: /\.css/
      }
    ]
  },

  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery'
    })
  ]
};
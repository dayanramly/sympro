require('dotenv').config();
const path = require('path');
const Dotenv = require('dotenv-webpack');
const tailwindcss = require('tailwindcss');
const Encore = require('@symfony/webpack-encore');
const HtmlWebpackPlugin = require('html-webpack-plugin');

Encore
  .setOutputPath(`dist/${process.env.TITLE}/assets`)
  .setPublicPath('/')
  .addEntry(`framework-${process.env.TITLE}`, './sources/[title]/javascript/framework.js')
  .addEntry(`apps-${process.env.TITLE}`, './sources/[title]/javascript/apps.js')
  .addEntry(`library-${process.env.TITLE}`, './sources/[title]/javascript/library.js')
  .addStyleEntry(`framework`, './sources/[title]/sass/framework.scss')
  .addStyleEntry(`apps`, './sources/[title]/sass/apps.scss')
  .addStyleEntry(`library`, './sources/[title]/sass/library.scss')
  .enableSingleRuntimeChunk()
  .configureSplitChunks(function(splitChunks) {
    splitChunks.name = 'runtime';
    splitChunks.chunks = 'all';
  })
  .cleanupOutputBeforeBuild()
  .enableSourceMaps(!Encore.isProduction())
  .enableVersioning(Encore.isProduction())
  .enableSassLoader()
  .enablePostCssLoader((options) => {
    options.postcssOptions = {
      plugins: [
        tailwindcss('./tailwind.config.js'),
        require('autoprefixer'),
      ]
    };
  })
  .autoProvidejQuery()
  .addPlugin(new Dotenv({
    path: path.resolve(__dirname, '.env'),
    safe: true,
    systemvars: true,
    silent: true,
    defaults: false
  }))
  .addPlugin(new HtmlWebpackPlugin({
    template: path.resolve(__dirname, 'sources', '[title]', 'index.twig'),
    filename: '../index.html',
    hash: true,
    inject: 'body',
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true,
    }
  }))
  .configureFilenames({
    css: `[name]-${process.env.TITLE}.css`,
    js: `[name].js`,
    assets: 'assets/[name].[hash:8].[ext]',
  })
  .configureImageRule({
    filename: 'assets/[name].[hash:8].[ext]',
    // Add any additional configuration options as needed
  })
  .addEntry('dev-server', `webpack-dev-server/client?http://localhost:8080`, { entryOnly: true })

module.exports = Encore.getWebpackConfig();

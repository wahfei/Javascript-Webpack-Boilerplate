const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const pages = ['about'];

const mainHtmlPage = [
  new HtmlWebpackPlugin({
    template: './src/index.html',
    filename: 'index.html',
    chunks: ['index'],
  }),
];

const htmlPluginEntries = mainHtmlPage.concat(
  pages.map(
    (page) =>
      new HtmlWebpackPlugin({
        template: `./src/${page}/index.html`,
        filename: `./${page}/index.html`,
        chunks: [page],
      }),
  ),
);

const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.js',
    about: './src/about/index.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    assetModuleFilename: 'images/[name][ext]',
  },
  devServer: {
    watchFiles: ['src/*.html', 'src/*/*.html'],
    static: path.resolve(__dirname, './dist'),
    hot: true,
    open: true,
  },
  watchOptions: {
    poll: 1000,
    ignored: '/node_modules/',
  },
  plugins: htmlPluginEntries.concat(
    [
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
    ],
    new ESLintPlugin({
      failOnError: false,
      failOnWarning: false,
      emitWarning: false,
      emitError: false,
    }),
  ),
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/i,
        type: 'asset/resource',
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin()],
  },
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, './src/assets/'),
      '@images': path.resolve(__dirname, './src/assets/images'),
    },
  },
};

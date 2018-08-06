import path from 'path';
import webpack from 'webpack';
import fs from 'fs';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import cssnano from 'cssnano';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import Resolve from './resolve';

const IS_PROD = process.env.NODE_ENV === 'production';

const config = {
  context: path.resolve(__dirname, 'src'),
  mode: process.env.NODE_ENV,
  devtool: IS_PROD ? 'source-map' : false,
  devServer: {
    contentBase: './dist',
    historyApiFallback: true,
    hot: true,
    inline: true,
    index: 'index.html',
    //open: true,
    stats: 'errors-only',
    watchContentBase: true
  },
  entry: './scripts/index.js',
  module: {
    rules: [{
      test: /\.css$/,
      exclude: /node_modules/,
      use: [IS_PROD ? MiniCssExtractPlugin.loader : 'style-loader',
      {
        loader: 'css-loader',
        options: {
          importLoaders: 1
        }
      },
      {
        loader: 'postcss-loader',
        options: {
          plugins: [
            require('postcss-preset-env')({
              stage: 2,
              features: {
                'nesting-rules': true,
                'custom-selectors': true,
              }
            }),
            require('postcss-mixins'),
            require('postcss-each'),
            require('postcss-simple-vars'),
            require('postcss-functions')({
              functions: {
                power: (number, exponent) => Math.pow(number, exponent),
                eval: (expression) => Resolve(expression),
                precision: (number) => {
                  return Math.round(number * 100) / 100
                }
              },
            }),
            require('postcss-math'),
            require('stylelint')
          ]
        }
      }],
    }, {
      test: /\.(png|jpg)$/,
      exclude: /node_modules/,
      use: {
        loader: 'file-loader',
        options: {
          name: 'images/[name].[ext]',
          publicPath: '/'
        }
      }
    }, {
      test: /\.(ttf|eot|woff|woff2)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]',
          publicPath: '../'
        }
      },
    }]
  },
  output: {
    filename: IS_PROD ? 'scripts/[name].[hash:6].js' : 'scripts/[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'initial',
          minSize: 0,
          minChunks: 3
        },
      },
    }
  },
  plugins: [
    new HTMLWebpackPlugin({
      filename: 'index.html',
      title: 'Welcome to starter kit',
      hash: true,
      template: './templates/index.html'
    }),
    new webpack.HotModuleReplacementPlugin({

    })
  ]
};

if (IS_PROD) {
  config.plugins.push(
    // new UglifyJSPlugin(),
    new CleanWebpackPlugin(['dist']),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[hash:6].min.css',
    }),
    new OptimizeCSSAssetsPlugin({
      cssProcessor: cssnano,
      cssProcessorOptions: {
        discardComments: {
          removeAll: true,
        },
        safe: true
      },
      canPrint: false,
    })
  );
}

export default config;

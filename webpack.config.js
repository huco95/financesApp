const webpack = require("webpack");
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    entry: {
      home: './src/home.js',
      login: './src/login.js',
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'public/js'), 
    },
    plugins: [
        // Ignore moment locales except es and en
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /es$|en-gb$/),
        new BundleAnalyzerPlugin({
          analyzerMode: 'disabled',
          generateStatsFile: true,
          statsOptions: { source: false },
          statsFilename: "../../webpackStats.json"
        }),
    ],
    resolve: {
      extensions: ['.js'],
    },
    module: {
      rules: [
        {
          test: /\.(scss)$/,
          use: [
            {
              // Adds CSS to the DOM by injecting a `<style>` tag
              loader: 'style-loader'
            },
            {
              // Interprets `@import` and `url()` like `import/require()` and will resolve them
              loader: 'css-loader'
            },
            {
              // Loader for webpack to process CSS with PostCSS
              loader: 'postcss-loader',
              options: {
                plugins: function () {
                  return [
                    require('autoprefixer')
                  ];
                }
              }
            },
            {
              // Loads a SASS/SCSS file and compiles it to CSS
              loader: 'sass-loader'
            }
          ]
        }
      ]
    },
    externals: {
      moment: "moment",
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            chunks: "all",
          },
        },
      },
     },
  };
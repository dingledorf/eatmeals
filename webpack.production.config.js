/*global __dirname

 */
var path = require('path');
var webpack = require('webpack');
var node_modules_dir = path.join(__dirname, 'node_modules');
var AssetsPlugin = require('assets-webpack-plugin');
var ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
var app_dir = path.join(__dirname, 'app');

var config = {
    entry: {
        vendors: ['lodash', 'angular'],
        app: path.resolve(app_dir, 'app.js')
    },
    output: {
        path: path.resolve(__dirname, 'public', 'build'),
        filename: '[name].[chunkhash].js',
        chunkFilename: '[name].[chunkhash].js'
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            loaders: ['babel'],
            exclude: [node_modules_dir]
        }, {
            test: /\.scss$/,
            loader: 'style!css!sass'
        }, {
            test: /\.less$/,
            loader: 'style!css!less'
        }, {
            test: /\.css$/, // Only .css files
            loader: 'style!css' // Run both loaders
        }, {
            test: /\.csv$/, loader: 'file?name=[path][name].[ext]?[hash]'
        }, {
            test: /\.(png|jpg)$/,
            loader: 'url?limit=25000'
        }, {
            test: /\.gif$/, loader: 'url-loader?mimetype=image/png'
        }, {
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&minetype=application/font-woff'
        }, {
            test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader?name=[name].[ext]'
        }, {
            test: /\.html$/,
            loader: 'raw'
        }],
        noParse: []
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js', Infinity),
        new AssetsPlugin({
            filename: 'webpack-assets.js',
            path: path.resolve(__dirname, 'dist'),
            processOutput: function(assets) {
                return 'window.staticMap = ' + JSON.stringify(assets);
            }
        }),
        new ChunkManifestPlugin({
            filename: "chunk-manifest.json",
            manifestVariable: "webpackManifest"
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': '"production"',
                'PORT': '80'
            },
            '__appSettings': {
                'apiEnv': '"live"'
            },
            __version: JSON.stringify(require(__dirname + '/package.json').version)
        }),
        /*new webpack.ProvidePlugin({
            // to figure out how to code webpack module bundler, see: http://forum.shakacode.com/t/understanding-the-webpack-module-bundler/336
            'fetch': 'imports?this=>global!exports?global.fetch!isomorphic-fetch'
            ,'configureApplicationStore': 'exports?configureStore!' +  app_dir + '/global/redux/ConfigureStore.dev.js'
        }),*/
        new webpack.HotModuleReplacementPlugin()
    ]
};

module.exports = config;
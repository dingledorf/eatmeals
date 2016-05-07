/*global __dirname

 */
var path = require('path');
var webpack = require('webpack');
const node_modules_dir = path.join(__dirname, 'node_modules');
const app_dir = path.join(__dirname, 'app');

const deps = [
    './bower/lib/bin/bower.js'
];

const config = {
    entry: [
        path.resolve(app_dir, 'app.js')
    ],
    resolve: {
        alias: {},
        modulesDirectories: [
            'app',
            'node_modules'
        ],
        extensions: ['', '.json', '.js', '.jsx']
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
        publicPath: '/assets/'
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            include: [app_dir],
            loaders: ['babel']
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
                'NODE_ENV': '"production"'
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

// Run through deps and extract the first part of the path,
// as that is what you use to require the actual node modules
// in your code. Then use the complete path to point to the correct
// file and make sure webpack does not try to parse it
deps.forEach(function (dep) {
    var depPath = path.resolve(node_modules_dir, dep);
    config.resolve.alias[dep.split(path.sep)[0]] = depPath;
    config.module.noParse.push(depPath);
});

export default config;
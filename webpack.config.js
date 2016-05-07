/*global __dirname

 */
import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
const node_modules_dir = path.join(__dirname, 'node_modules');
const app_dir = path.join(__dirname, 'app');

const config = {
    devtool: 'source-map',
    entry: [
        path.resolve(app_dir, 'app.js')
    ],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
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
        }, {
            test: /\.html$/,
            loader: 'raw'
        }],
        noParse: []
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: app_dir + '/index.html',
            inject: 'body'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': '"development"'
            },
            '__appSettings': {
                'apiEnv': '"live"'
            },
            __version: JSON.stringify(require(__dirname + '/package.json').version)
        }),
        new webpack.HotModuleReplacementPlugin()
    ]
};

export default config;
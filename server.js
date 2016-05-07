import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import config from './webpack.config';

const APP_PORT = 8080;
config.entry.unshift(`webpack-dev-server/client?http://localhost:${APP_PORT}`, 'webpack/hot/dev-server');

new WebpackDevServer(webpack(config), {
    contentBase: 'build',
    quiet: false,
    noInfo: true,
    hot: true,
    inline: true,
    lazy: false,
    publicPath: config.output.publicPath,
    headers: {'Access-Control-Allow-Origin': '*'},
    stats: {colors: true},
    historyApiFallback: true
}).listen(APP_PORT, 'localhost', function (err) {
    if (err) {
        console.log(err);
    }

    console.log(`WebpackDevServer now running at localhost:${APP_PORT}`);
});
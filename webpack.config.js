var path = require('path');
var webpack = require('webpack');
var { AureliaPlugin } = require('aurelia-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');

module.exports = {
    entry: ['./src/examples/counters/main.ts'],
    devServer: {
        port: 80,
        hot: true,
        // stats: "minimal"
    },
    devtool: 'cheap-module-eval-source-map',
    output: {
        path: path.resolve('./dist'),
        filename: '[name].js',
        chunkFilename: '[id].js',
        devtoolModuleFilenameTemplate: '[absolute-resource-path]',
        devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
    },
    module: {
        rules: [
            { test: /.ts$/, use: ['ts-loader', 'ts-nameof-loader'] },
            { test: /\.html$/, use: ['html-loader'] }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
        modules: [path.resolve("./src"), "node_modules"]
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({ debug: true }),
        new AureliaPlugin({ aureliaApp: undefined }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/examples/counters/index.html',
            inject: true,
            minify: false
        }),
        new webpack.HotModuleReplacementPlugin(),
        new ProgressBarPlugin({
            clear: true
        })
    ],
    // stats: "minimal"
};
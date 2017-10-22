var path = require('path');
var utils = require('./../utils');
var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './test/main.ts',
    target: 'node',
    devtool: 'source-map',
    output: {
        filename: 'test-bundle.js',
        path: path.resolve('.tmp/test/_compiled'),
        devtoolModuleFilenameTemplate: '[absolute-resource-path]',
        devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]'
    },
    externals: [nodeExternals()],
    plugins: [
        new webpack.LoaderOptionsPlugin({ debug: true })
    ]
};
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/index.ts',
    mode: 'production',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, './dist/'),
        library: { 
            //Name must always be provider package
            name: 'provider-package',
            type: 'umd'
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },

    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: './src/manifest.json' },
                { from: './src/manifest.vendor.json' },
                { from: './src/express.json' }
            ]
        })
    ],
    externals: ['package-sdk']

}
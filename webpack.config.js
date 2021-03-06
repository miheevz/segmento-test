const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require('autoprefixer')

const extractSass = new ExtractTextPlugin({
    filename: "./css/[name].css",
    disable: process.env.NODE_ENV === "development"
});

module.exports = {
    entry: './src/index.js',
    output: {
        filename: './js/bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devtool: "source-map",
    module: {
        rules: [{
            use: {
               loader:'babel-loader',
               options: { presets: ['es2015'] }
            },
            test: /\.js$/,
            exclude: /node_modules/
         }, {
            test: /\.scss$/,
            use: extractSass.extract({
                use: [{
                    loader: "css-loader",
                    options: {
                        sourceMap: true
                    }
                }, {
                    loader: 'postcss-loader',
                    options: {
                        plugins: [
                            autoprefixer({
                                browsers: ['ie >= 9', 'last 4 version']
                            })
                        ],
                        sourceMap: true
                    }
                }, {
                    loader: "sass-loader",
                    options: {
                        sourceMap: true
                    }
                }],
                fallback: "style-loader"
            })
        }, {
            test: /\.(png|svg|jpg|gif)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: '/images/'
                }
            }
            ]
        }
        ]
    },
    plugins: [
        extractSass
    ],
    devServer: {
        contentBase: './dist'
    }
};
const path = require('path') // 引用path模块
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { default: test } = require('node:test')
const { type } = require('os')
module.exports = {  // 这里是common.js语法
    // 入口文件
    entry: {
        homepage: "./src/homepage.js",
        login: "./src/login.js",
        comment: "./src/comment.js",
        "edit-info": "./src/edit-info.js",
        "search-result": "./src/search-result.js",
        recommend: "./src/recommend.js",
        songs: "./src/songs.js",
        user: "./src/user.js",
    },
    // 打包后的出口文件
    output: {
        // 输出的路径  是绝对路径(导入path模块) 这里是用node来做的
        path: path.resolve(__dirname, 'dist'),
        // 输出的文件名称
        filename: '[name].js',
        assetModuleFilename: 'images/[hash][ext][query]',
        clean: true,
    },
    resolveLoader: {
        modules: ["node_modules", path.resolve(__dirname,"loaders")]
    },
    module: {
        rules: [ // rules for css,js and so on
            {
                test: /\.css/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.js/,
                use: ["babel-loader"],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
                generator: {
                    filename: "images/[name].[hash:6][ext]",
                }
              },
              {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: "asset/resource",
                generator: {
                    filename: "fonts/[name].[hash:6][ext]",
                }
              }
        ],
    },
    // 使用开发模式打包
    mode: "development",
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/homepage.html",
            filename: "homepage.html"
        }),
        new HtmlWebpackPlugin({
            template: "./public/login.html",
            filename: "login.html"
        }),
        new HtmlWebpackPlugin({
            template: "./public/comment.html",
            filename: "comment.html"
        }),
        new HtmlWebpackPlugin({
            template: "./public/edit-info.html",
            filename: "edit-info.html"
        }),
        new HtmlWebpackPlugin({
            template: "./public/recommend.html",
            filename: "recommend.html"
        }),
        new HtmlWebpackPlugin({
            template: "./public/search-result.html",
            filename: "search-result.html"
        }),
        new HtmlWebpackPlugin({
            template: "./public/songs.html",
            filename: "songs.html"
        }),
        new HtmlWebpackPlugin({
            template: "./public/user.html",
            filename: "user.html"
        }),
    ],
    // 开发服务器配置
    devServer: {},
    // 压缩和模块分离
    optimization: {},
    // 模块如何解析，路径别名
    resolve: {}
}

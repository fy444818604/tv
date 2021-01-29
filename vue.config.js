const webpack = require("webpack");
const path = require("path");
const GeneraterAssetPlugin = require("generate-asset-webpack-plugin")
const serverConfig = require("./serverConfig.json")
const createJson = function(compilation) {
	return JSON.stringify(serverConfig);
};
module.exports = {
	publicPath:process.env.NODE_ENV === "production" ? "/e" : "./",
	configureWebpack: {
		plugins: [
			new webpack.ProvidePlugin({
				_: "lodash"
			}),
			new GeneraterAssetPlugin({
			  filename: `serverConfig.json`,
			  fn: (compilation, cb) => {
			    cb(null, createJson(compilation))
			  },
			}),
		],
	},
	chainWebpack: (config) => {
		config.resolve.alias
			.set('@', path.resolve(__dirname, './src'));
		// config.module
		// 	.rule("less")
		// 	.test(/\.less$/)
		// 	.use("less-loader")
		// 	.loader("less-loader")
		// 	.tap((options) => {
		// 		options = {
		// 			name: "file/[path][name].[hash:7].[ext]",
		// 		};
		// 		return options;
		// 	}).end()
	},
	lintOnSave: true,
	productionSourceMap: true,
	devServer: {
		compress: true,
		open: true
	},
};
 
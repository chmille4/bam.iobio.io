var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var inProduction = process.env.NODE_ENV === 'production';
const localBackend = process.env.BUILD_ENV_LOCAL_BACKEND === 'true';
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
	entry: {
		app: ['./client/app/routes.js'],
	},
	output: {
		path: __dirname + '/client/dist/',
		publicPath: 'dist/',
		filename: 'build.js',
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					loaders: {},
					// other vue-loader options go here
				},
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.s[ac]ss$/,
				use: inProduction
					? ExtractTextPlugin.extract({
							fallback: 'style-loader',
							use: ['css-loader', 'sass-loader'],
					  })
					: ['style-loader', 'css-loader', 'sass-loader'],
			},
			{
				test: /\.(css|less)$/,
				use: [
					{
						loader: 'style-loader', // creates style nodes from JS strings
					},
					{
						loader: 'css-loader', // translates CSS into CommonJS
					},
				],
			},
			{
				test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 100000,
							name: '[name].[hash].[ext]',
						},
					},
				],
			},
			{
				test: /\.bed$/,
				use: 'raw-loader',
			},
		],
	},
	plugins: [
		new CleanWebpackPlugin(['client/dist'], {}),
		new VueLoaderPlugin(),
		new webpack.DefinePlugin({
			BUILD_ENV_LOCAL_BACKEND: localBackend ? 'true' : 'false',
		}),
	],
	// resolve: {
	//   alias: {
	//     'vue$': 'vue/dist/vue.esm.js'
	//   }
	// },
	performance: {
		hints: false,
	},
	devtool: 'cheap-module-inline-source-map',
};

if (inProduction) {
	module.exports.devtool = '#source-map';
	// http://vue-loader.vuejs.org/en/workflow/production.html
	module.exports.plugins = (module.exports.plugins || []).concat([
		new ExtractTextPlugin('main.css'),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"',
			},
		}),
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: true,
			compress: {
				warnings: false,
			},
		}),
		new webpack.LoaderOptionsPlugin({
			minimize: true,
		}),
	]);
}

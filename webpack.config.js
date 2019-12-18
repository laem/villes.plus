const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loaders: ['babel-loader']
			},
			{
				test: /\.css$/,
				use: [
					{ loader: 'style-loader' },
					{
						loader: 'css-loader'
					}
				]
			}
		]
	},

	entry: {
		javascript: ['react-hot-loader/patch', './index.js']
	},

	output: {
		filename: 'index.js',
		path: __dirname + '/dist',
		publicPath: '/'
	},
	devServer: {
		historyApiFallback: true
	},

	plugins: [
		new HtmlWebpackPlugin({
			title: 'Piétonnes',
			template: 'index.html'
		})
	]
}

/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const webpack = require('webpack');

const prod = process.argv.length === 3 && (process.argv[2] === '-p')

module.exports = {
	entry: {
		Main:'./src/FeatureTest'
	},
	output: {
		filename: './build/[name].js',
		chunkFilename: './build/[id].js',
		sourceMapFilename : '[file].map',
	},
	resolve: {
		modules : ['node_modules', 'src', 'node_modules/tone', './', './third_party/'],
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|Tone\.js)/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015']
				}
			},
			{
				test: /(\.scss)$/,
				loader: 'style-loader!css-loader!autoprefixer-loader!sass-loader'
			},
			{
				test: /(\.css)$/,
				loader: 'style-loader!css-loader!autoprefixer-loader'
			},
			{
				test: /\.(png|gif|svg)$/,
				loader: 'url-loader',
			}
		]
	},
	devtool: prod ? '' : '#eval-source-map'
};
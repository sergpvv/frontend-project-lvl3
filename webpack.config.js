import commonjsVariables from 'commonjs-variables-for-esmodules';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const { __dirname } = commonjsVariables(import.meta);

export default {
  mode: process.env.NODE_ENV || 'development',
  devtool: 'inline-source-map',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
  ],
};

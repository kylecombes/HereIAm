const path = require('path');
const APP_DIR = path.resolve(__dirname, 'webapp', 'src');
const BUILD_DIR = __dirname;
module.exports = {
  devServer: {
    historyApiFallback: true,
    contentBase: path.join(__dirname, 'webapp'),
  },
  entry: path.resolve(APP_DIR, 'index.js'),
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module: {
    rules: [
      { // Bundle JS and JSX files
        test: /\.jsx?/,
        include: APP_DIR,
        use: 'babel-loader',
      },
      { // Bundle SVG files
        test: /\.svg$/,
        use: 'raw-loader',
      },
      { // Bundle CSS files
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        include: APP_DIR,
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
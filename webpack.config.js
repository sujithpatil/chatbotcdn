const path = require('path');

const config = {};

config['entry'] = './src/index.js';
config['output'] = {
    path: path.resolve(__dirname, 'dist'),
    filename : 'app.js'
}

config['module'] = {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env','@babel/preset-react'],
            plugins : ['@babel/plugin-proposal-class-properties','@babel/plugin-transform-async-to-generator']
          }
        }
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [{
          loader: 'style-loader'
        },{
          loader: 'css-loader'
        }]
      }
    ]
  }

module.exports = config;
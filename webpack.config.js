module.exports = {
  mode: 'production',
  entry: './src/js/main.js',
  output: {
    filename: 'assets/js/main.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env"
              ]
            }
          }
        ]
      }
    ]
  }
}
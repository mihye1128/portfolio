module.exports = {
  mode: "production",
  entry: "./src/js/main.js",
  output: {
    filename: "js/[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
      },
    ],
  },
};

const path = require("path");
const webpack = require("webpack");
const memoryfs = require("memory-fs");

module.exports = (fixture, options = {}) => {
  const compiler = webpack({
    context: __dirname,
    entry: `./${fixture}`,
    output: {
      path: path.resolve(__dirname),
      filename: "bundle.js"
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            "style-loader",
            {
              loader: path.resolve(__dirname, "../index.js"),
              options: {
                root: "./test"
              }
            },
            {
              loader: "css-loader",
              options: {
                modules: true,
                localIdentName: "[name]___[local]",
                camelCase: false
              }
            }
          ]
        }
      ]
    }
  });

  compiler.outputFileSystem = new memoryfs();

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err || stats.hasErrors()) reject(err);

      resolve(stats);
    });
  });
};

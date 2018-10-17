const path = require("path");
const webpack = require("webpack");
const memoryfs = require("memory-fs");

/**
 * @param {string} fixture
 * @returns Promise<Webpack.Stats>
 */
module.exports = (fixture, options = {}) => {
  const folderHappening = path.resolve(process.cwd(), "test", "styles");
  const compiler = webpack({
    context: folderHappening,
    entry: `./${fixture}`,
    output: {
      path: folderHappening,
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
                root: folderHappening
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

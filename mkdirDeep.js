const fs = require("fs");
const path = require("path");

/**
 * Create the directory recursively
 * @param {string} dirname
 */
module.exports = function(dirname) {
  dirname = path.normalize(dirname).split(path.sep);
  dirname.forEach((_sdir, index) => {
    const pathInQuestion = dirname.slice(0, index + 1).join(path.sep);
    if (!fs.existsSync(pathInQuestion) && pathInQuestion)
      fs.mkdirSync(pathInQuestion);
  });
};

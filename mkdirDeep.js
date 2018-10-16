const fs = require("fs");
const path = require("path");

module.exports = function(dirname) {
  dirname = path.normalize(dirname).split(path.sep);
  dirname.forEach((_sdir, index) => {
    const pathInQuestion = dirname.slice(0, index + 1).join(path.sep);
    if (!fs.existsSync(pathInQuestion) && pathInQuestion)
      fs.mkdirSync(pathInQuestion);
  });
};

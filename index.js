const fs = require("fs");
const path = require("path");
const loaderUtils = require("loader-utils");
const validateOptions = require("schema-utils");

const mkdirDeep = require("./mkdirDeep");

const schema = {
  type: "object",
  properties: {
    banner: {
      type: "string"
    },
    dest: {
      type: "string"
    },
    root: {
      type: "string"
    }
  }
};

module.exports = function(content, map, meta) {
  const callback = this.async();
  const query = loaderUtils.getOptions(this);
  validateOptions(schema, query, "ts-css-modules-webpack-loader");

  const destination = query.dest || this.context;
  const rootContext = query.root || this.rootContext;
  const banner = query.banner || undefined;

  let cssModulesLine = [];
  let inExports = false;
  for (const line of content.split("\n")) {
    if (line.indexOf("exports.locals") === 0) {
      inExports = true;
    } else if (inExports && line.indexOf("};") === 0) {
      inExports = false;
    } else if (inExports) {
      cssModulesLine.push(line);
    }
  }

  const inFilePrefix = banner ? `${banner}\n` : "";
  const stringDeclarations = cssModulesLine
    .map(v => {
      const cleanValue = /^\t?"(.+)":\s?"(.+)",?/.exec(v);
      if (cleanValue.length === 3)
        return `export const ${cleanValue[1]}: string;`;
      return "";
    })
    .join("\n");
  const tsString = inFilePrefix + stringDeclarations;

  const relativeFile = query.dest
    ? path.relative(rootContext, this.resourcePath)
    : path.basename(this.resourcePath);
  const destFile = path.join(destination, `${relativeFile}.d.ts`);
  mkdirDeep(path.dirname(destFile));

  fs.writeFile(destFile, tsString, err => {
    if (err) {
      callback(err);
      return;
    } else callback(null, content, map, meta);
  });
};

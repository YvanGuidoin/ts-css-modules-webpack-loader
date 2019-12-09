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

/**
 * Extract exports from css-loader output
 * @param {string} content
 * @returns {Array<string>}
 */
function extractLines(content) {
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
  return cssModulesLine;
}

/**
 * Clean exports
 * @param {Array<string>} moduleLines
 * @returns {Array<string>}
 */
function cleanLines(moduleLines) {
  return moduleLines.reduce((acc, v) => {
    const cleanValue = /^\t?"(.+)":\s?"(.+)",?/.exec(v);
    if (cleanValue.length === 3) acc.push(`${cleanValue[1]}`);
    return acc;
  }, []);
}

module.exports = function(content, ...rest) {
  const callback = this.async();
  const query = loaderUtils.getOptions(this);
  validateOptions(schema, query, "ts-css-modules-webpack-loader");

  const destination = query.dest || this.context;
  const rootContext = query.root || this.rootContext;
  const banner = query.banner || undefined;

  console.log(content, ...rest);

  const cssModulesLine = extractLines(content);
  const cleanModules = cleanLines(cssModulesLine);

  const inFilePrefix = banner ? `${banner}\n` : "";
  const stringDeclarations = cleanModules
    .map(v => `export const ${v}: string;`)
    .join("\n");
  const tsString = inFilePrefix + stringDeclarations;

  const relativeFile = query.dest
    ? path.relative(rootContext, this.resourcePath)
    : path.basename(this.resourcePath);
  const destFile = path.join(destination, `${relativeFile}.d.ts`);
  try {
    mkdirDeep(path.dirname(destFile));
  } catch (err) {
    callback(err);
    return;
  }

  fs.writeFile(destFile, tsString, { encoding: "utf-8" }, err => {
    if (err) {
      callback(err);
      return;
    } else callback(null, content, ...rest);
  });
};

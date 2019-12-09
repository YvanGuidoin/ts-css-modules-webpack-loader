const fs = require("fs");
const path = require("path");
const compiler = require("./compiler.js");

const testFilesFolder = path.resolve("test", "styles");

const simpleCssExpected = "export const testClass: string;";
const multipleCssExpected =
  "export const testClass: string;\nexport const secondClass: string;";

/** @param {string} file */
async function cleanFile(file) {
  if (fs.existsSync(file)) await fs.promises.unlink(file);
}

jest.setTimeout(10000);

test("css", async () => {
  const inputFile = "simple.css";
  const outputFile = path.resolve(testFilesFolder, inputFile + ".d.ts");
  await cleanFile(outputFile);
  await compiler(inputFile);
  const buffer = await fs.promises.readFile(outputFile);
  const output = buffer.toString();

  expect(output).toBe(simpleCssExpected);
  await cleanFile(outputFile);
});

test("css multiple", async () => {
  const inputFile = "multiple.css";
  const outputFile = path.resolve(testFilesFolder, inputFile + ".d.ts");
  await cleanFile(outputFile);
  await compiler(inputFile);
  const buffer = await fs.promises.readFile(outputFile);
  const output = buffer.toString();

  expect(output).toBe(multipleCssExpected);
  await cleanFile(outputFile);
});

test("ts", async () => {
  const inputFile = "importStyles.ts";
  const outputFile = path.resolve(testFilesFolder, "multiple.css.d.ts");
  await cleanFile(outputFile);
  await compiler(inputFile);
  const buffer = await fs.promises.readFile(outputFile);
  const output = buffer.toString();

  expect(output).toBe(multipleCssExpected);
  await cleanFile(outputFile);
});

const fs = require("fs");
const path = require("path");
const compiler = require("./compiler.js");

const testFilesFolder = path.resolve(process.cwd(), "test", "styles");

const simpleCssExpected = "export const testClass: string;";
const multipleCssExpected =
  "export const testClass: string;\nexport const secondClass: string;";

test("css", async () => {
  const inputFile = "simple.css";
  const outputFile = path.resolve(testFilesFolder, inputFile + ".d.ts");
  if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
  await compiler(inputFile);
  const buffer = fs.readFileSync(outputFile);
  const output = buffer.toString();

  expect(output).toBe(simpleCssExpected);
  if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
});

test("css multiple", async () => {
  const inputFile = "multiple.css";
  const outputFile = path.resolve(testFilesFolder, inputFile + ".d.ts");
  if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
  await compiler(inputFile);
  const buffer = fs.readFileSync(outputFile);
  const output = buffer.toString();

  expect(output).toBe(multipleCssExpected);
  if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
});

test("ts", async () => {
  const inputFile = "importStyles.ts";
  const outputFile = path.resolve(testFilesFolder, "multiple.css.d.ts");
  if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
  await compiler(inputFile);
  const buffer = fs.readFileSync(outputFile);
  const output = buffer.toString();

  expect(output).toBe(multipleCssExpected);
  if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
});

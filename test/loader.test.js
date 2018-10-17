const fs = require("fs");
const path = require("path");
const compiler = require("./compiler.js");

const testFilesFolder = path.resolve(process.cwd(), "test", "styles");

test("css", async () => {
  const inputFile = "simple.css";
  const outputFile = path.resolve(testFilesFolder, inputFile + ".d.ts");
  if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
  await compiler(inputFile);
  const buffer = fs.readFileSync(outputFile);
  const output = buffer.toString();

  expect(output).toBe("export const testClass: string;");
});

test("css", async () => {
  const inputFile = "multiple.css";
  const outputFile = path.resolve(testFilesFolder, inputFile + ".d.ts");
  if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
  await compiler(inputFile);
  const buffer = fs.readFileSync(outputFile);
  const output = buffer.toString();

  expect(output).toBe(
    "export const testClass: string;\nexport const secondClass: string;"
  );
});

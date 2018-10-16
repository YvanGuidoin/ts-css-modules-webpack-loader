const fs = require("fs");
const compiler = require("./compiler.js");

test("css -> css.d.ts", async () => {
  //   const stats = await compiler("testfile.css");
  //   const output = stats.toJson().modules[0].source;
  const inputFile = "testfile.css";
  const outputFile = inputFile + ".d.ts";
  const outputPath = "./test/" + outputFile;
  if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
  await compiler(inputFile);
  const buffer = fs.readFileSync(outputPath);
  const output = buffer.toString();

  expect(output).toBe("export const testClass: string;");
});

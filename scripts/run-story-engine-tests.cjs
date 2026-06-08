const { execFileSync } = require("node:child_process");
const { rmSync, writeFileSync } = require("node:fs");
const { resolve } = require("node:path");

const outDir = resolve(".test-build");

rmSync(outDir, { force: true, recursive: true });
execFileSync(process.execPath, ["node_modules/typescript/bin/tsc", "-p", "tsconfig.test.json"], {
  stdio: "inherit",
});
writeFileSync(resolve(outDir, "package.json"), JSON.stringify({ type: "commonjs" }));

require(resolve(outDir, "engine", "storyEngine.inventory.test.js"));
require(resolve(outDir, "engine", "inventoryDetails.test.js"));
require(resolve(outDir, "data", "absurdThirtySixAdventure.test.js"));

console.log("3 story engine test files passed.");

import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";

const root = path.resolve(new URL(".", import.meta.url).pathname, "..", "backend");
const files = [];
function walk(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, item.name);
    if (item.isDirectory() && item.name !== "node_modules") walk(p);
    else if (item.isFile() && p.endsWith(".js")) files.push(p);
  }
}
walk(root);
for (const file of files) execFileSync(process.execPath, ["--check", file], { stdio: "inherit" });
console.log(`Backend syntax OK: ${files.length} JavaScript files checked.`);

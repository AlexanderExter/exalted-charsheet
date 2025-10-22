const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const version = pkg.version;

const files = [path.join(root, "README.md"), path.join(root, "public", "content", "about.md")];

const badgePattern = /version-[0-9]+\.[0-9]+\.[0-9]+(?:--[a-z]+)?/g;
const textPattern = /v[0-9]+\.[0-9]+\.[0-9]+(?:-[a-z]+)?/g;

for (const file of files) {
  let content = fs.readFileSync(file, "utf8");
  content = content.replace(badgePattern, `version-${version}`);
  content = content.replace(textPattern, `v${version}`);
  fs.writeFileSync(file, content);
}

console.log(`Synced documentation to version ${version}`);

const path = require("path");
const fs = require("fs");
const dir = path.join(__dirname, "src/typechain");

const isDirectory = (_path) => fs.lstatSync(_path).isDirectory();

const getAllFilesInDirectory = (_path, ext = undefined) => {
  const children = fs.readdirSync(_path);
  const files = [];
  children.forEach((child) => {
    const filePath = path.join(_path, child);
    if (isDirectory(filePath)) {
      const subChildren = getAllFilesInDirectory(filePath, ext).map((file) =>
        path.join(filePath, file)
      );
      files.push(...subChildren);
    } else if (ext === path.extname(filePath)) {
      files.push(filePath);
    }
  });
  return files.map((file) => getRelativePath(_path, file));
};

const getRelativePath = (from, to) => {
  let relative = path.relative(from, to);
  if (!relative.startsWith("../")) relative = `./${relative}`;
  return relative;
};

const getExportedTypes = (file) => {
  const types = [];
  const regex = /export type (\w+(?:Struct|StructOutput)) =/g;
  let match;
  while ((match = regex.exec(file))) {
    types.push(match[1]);
  }
  return types;
};

const typechainFiles = getAllFilesInDirectory(dir, ".ts").filter(
  (fileName) => !fileName.endsWith("index.ts")
);
const extraExports = [];
const allTypes = [];
for (const typechainFile of typechainFiles) {
  const file = fs.readFileSync(path.join(dir, typechainFile), "utf8");
  const types = getExportedTypes(file).filter((typ) => !allTypes.includes(typ));
  allTypes.push(...types);
  if (types.length > 0) {
    const exportStatements = `export type { ${types.join(", ")} } from "${typechainFile.replace(
      ".ts",
      ""
    )}";`;
    extraExports.push(exportStatements);
  }
}

const indexFilePath = path.join(dir, "index.ts");
const indexFile = fs.readFileSync(indexFilePath, "utf8");
if (extraExports.length > 0) {
  const newFile = indexFile + "\n" + extraExports.join("\n\n");
  fs.writeFileSync(indexFilePath, newFile);
}
console.log(allTypes);

console.log(typechainFiles);

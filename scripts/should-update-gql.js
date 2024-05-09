const path = require("path");
const crypto = require("crypto");
const { readFileSync, existsSync } = require("fs");
const generateFileChecksum = (filePath) => {
  return crypto.createHash("md5").update(readFileSync(filePath), "utf8").digest("hex");
};
const cacheFilePath = path.join(__dirname, ".gql-cache");
const graphqlFilePath = path.join(__dirname, "../src/gql/graphql.ts");

if (!existsSync(cacheFilePath)) {
  process.exit(0);
}

const previousChecksums = readFileSync(cacheFilePath, "utf8");

const currentChecksums = [
  generateFileChecksum(path.join(__dirname, "../gql/fragments.graphql")),
  generateFileChecksum(path.join(__dirname, "../gql/queries.graphql")),
  generateFileChecksum(graphqlFilePath)
].join("\n");

if (previousChecksums !== currentChecksums) {
  process.exit(0);
}

console.log(`No GQL changes, skipping codegen`);
process.exit(1);

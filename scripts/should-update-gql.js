const path = require("path");
const crypto = require("crypto");
const { readFileSync, existsSync } = require("fs");
const GRAPHQL_TS_PATH = path.join(__dirname, "../src/gql/graphql.ts");

const cacheFilePath = path.join(__dirname, ".gql-cache");
const graphqlFilePath = path.join(__dirname, "../src/gql/graphql.ts");

if (!existsSync(cacheFilePath)) {
  console.log(`cache does not exist`);
  process.exit(0);
}

const previousChecksums = readFileSync(cacheFilePath, "utf8");

function generateFileChecksum(filePath) {
  return crypto.createHash("md5").update(readFileSync(filePath), "utf8").digest("hex");
}
const currentChecksums = [
  generateFileChecksum(path.join(__dirname, "../gql/fragments.graphql")),
  generateFileChecksum(path.join(__dirname, "../gql/queries.graphql")),
  generateFileChecksum(GRAPHQL_TS_PATH)
].join("\n");

if (previousChecksums !== currentChecksums) {
  console.log(`caches not match`);
  process.exit(0);
}

console.log(`No GQL changes, skipping codegen`);
process.exit(1);

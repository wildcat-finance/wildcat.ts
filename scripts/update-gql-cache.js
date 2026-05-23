const { createHash } = require("crypto");
const { readFileSync, writeFileSync } = require("fs");
const path = require("path");

const GRAPHQL_TS_PATH = path.join(__dirname, "../src/gql/graphql.ts");
const CODEGEN_YML_PATH = path.join(__dirname, "../codegen.yml");
const SCHEMA_JSON_PATH = path.join(__dirname, "schema.json");
const GQL_CACHE_PATH = path.join(__dirname, ".gql-cache");
const GQL_FRAGMENTS_PATH = path.join(__dirname, "../gql/fragments.graphql");
const GQL_QUERIES_PATH = path.join(__dirname, "../gql/queries.graphql");

function generateFileChecksum(filePath) {
  return createHash("md5").update(readFileSync(filePath), "utf8").digest("hex");
}

const currentChecksums = [
  generateFileChecksum(SCHEMA_JSON_PATH),
  generateFileChecksum(CODEGEN_YML_PATH),
  generateFileChecksum(GQL_FRAGMENTS_PATH),
  generateFileChecksum(GQL_QUERIES_PATH),
  generateFileChecksum(GRAPHQL_TS_PATH)
].join("\n");

writeFileSync(GQL_CACHE_PATH, currentChecksums);

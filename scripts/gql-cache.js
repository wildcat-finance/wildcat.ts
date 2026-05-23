const { createHash } = require("crypto");
const { existsSync, readFileSync, writeFileSync } = require("fs");
const path = require("path");
const { getIntrospectionQuery } = require("graphql");

const GRAPHQL_TS_PATH = path.join(__dirname, "../src/gql/graphql.ts");
const CODEGEN_YML_PATH = path.join(__dirname, "../codegen.yml");
const SCHEMA_JSON_PATH = path.join(__dirname, "schema.json");
const GQL_CACHE_PATH = path.join(__dirname, ".gql-cache");
const GQL_FRAGMENTS_PATH = path.join(__dirname, "../gql/fragments.graphql");
const GQL_QUERIES_PATH = path.join(__dirname, "../gql/queries.graphql");

const CACHE_INPUTS = [
  SCHEMA_JSON_PATH,
  CODEGEN_YML_PATH,
  GQL_FRAGMENTS_PATH,
  GQL_QUERIES_PATH,
  GRAPHQL_TS_PATH
];

function getSchemaUrl() {
  const schemaLine = readFileSync(CODEGEN_YML_PATH, "utf8")
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.startsWith("schema:"));

  if (!schemaLine) {
    throw new Error(`No schema entry found in ${CODEGEN_YML_PATH}`);
  }

  return schemaLine.replace(/^schema\s*:\s*/, "").replace(/^['"]|['"]$/g, "");
}

async function fetchSchema() {
  const response = await fetch(getSchemaUrl(), {
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify({ query: getIntrospectionQuery() }),
    method: "POST"
  });

  if (!response.ok) {
    throw new Error(`Schema introspection failed: ${response.status} ${response.statusText}`);
  }

  const schema = await response.json();

  if (schema.errors?.length) {
    throw new Error(`Schema introspection returned errors: ${JSON.stringify(schema.errors)}`);
  }

  writeFileSync(SCHEMA_JSON_PATH, JSON.stringify(schema, null, 2));
  return schema;
}

function generateFileChecksum(filePath) {
  return createHash("md5").update(readFileSync(filePath), "utf8").digest("hex");
}

function getCurrentChecksums() {
  return CACHE_INPUTS.map(generateFileChecksum).join("\n");
}

function readCache() {
  if (!existsSync(GQL_CACHE_PATH)) return null;
  return readFileSync(GQL_CACHE_PATH, "utf8").replace(/\s+$/g, "");
}

function writeCache() {
  writeFileSync(GQL_CACHE_PATH, getCurrentChecksums());
}

module.exports = {
  fetchSchema,
  getCurrentChecksums,
  readCache,
  writeCache
};

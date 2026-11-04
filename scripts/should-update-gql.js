const path = require("path");
const crypto = require("crypto");
const { readFileSync, existsSync, writeFileSync } = require("fs");
const GRAPHQL_TS_PATH = path.join(__dirname, "../src/gql/graphql.ts");

const CODEGEN_YML_PATH = path.join(__dirname, "../codegen.yml");
const SCHEMA_JSON_PATH = path.join(__dirname, "schema.json");
const GQL_CACHE_PATH = path.join(__dirname, ".gql-cache");
const GQL_FRAGMENTS_PATH = path.join(__dirname, "../gql/fragments.graphql");
const GQL_QUERIES_PATH = path.join(__dirname, "../gql/queries.graphql");

if (process.env.FORCE) process.exit(0);

async function getSchema() {
  const schemaUrl = readFileSync(CODEGEN_YML_PATH, "utf8")
    .split("\n")
    .map((x) => x.trim())
    .find((x) => x.startsWith("schema:"))
    .replace(/(schema\s*:\s*)|(\s*['"]\s*)/g, "");
  const schema = await fetch(schemaUrl, {
    headers: {
      "content-type": "application/json"
    },
    body: '{"query":"# Welcome to GraphiQL\\n#\\n# GraphiQL is an in-browser tool for writing, validating, and\\n# testing GraphQL queries.\\n#\\n# Type queries into this side of the screen, and you will see intelligent\\n# typeaheads aware of the current GraphQL type schema and live syntax and\\n# validation errors highlighted within the text.\\n#\\n# GraphQL queries typically start with a \\"{\\" character. Lines that start\\n# with a # are ignored.\\n#\\n# An example GraphQL query might look like:\\n#\\n#     {\\n#       field(arg: \\"value\\") {\\n#         subField\\n#       }\\n#     }\\n#\\n# Keyboard shortcuts:\\n#\\n#   Prettify query:  Shift-Ctrl-P (or press the prettify button)\\n#\\n#  Merge fragments:  Shift-Ctrl-M (or press the merge button)\\n#\\n#        Run Query:  Ctrl-Enter (or press the play button)\\n#\\n#    Auto Complete:  Ctrl-Space (or just start typing)\\n#\\n\\nquery {\\n\\t__schema {\\n\\t  description\\n    types {\\n      __typename\\n      name\\n      description\\n      kind\\n      fields {\\n        __typename\\n        name\\n        description\\n      }\\n    }\\n\\t}\\n}"}',
    method: "POST"
  }).then((res) => res.json());
  writeFileSync(SCHEMA_JSON_PATH, JSON.stringify(schema, null, 2));
}

if (!existsSync(GQL_CACHE_PATH)) {
  console.log(`cache does not exist`);
  process.exit(0);
}

const previousChecksums = readFileSync(GQL_CACHE_PATH, "utf8");

function generateFileChecksum(filePath) {
  return crypto.createHash("md5").update(readFileSync(filePath), "utf8").digest("hex");
}

async function compareChecksums() {
  await getSchema();
  const currentChecksums = [
    generateFileChecksum(SCHEMA_JSON_PATH),
    generateFileChecksum(CODEGEN_YML_PATH),
    generateFileChecksum(GQL_FRAGMENTS_PATH),
    generateFileChecksum(GQL_QUERIES_PATH),
    generateFileChecksum(GRAPHQL_TS_PATH)
  ].join("\n");

  if (previousChecksums !== currentChecksums) {
    console.log(`caches do not match`);
    process.exit(0);
  }

  console.log(`No GQL changes, skipping codegen`);
  process.exit(1);
}

compareChecksums();

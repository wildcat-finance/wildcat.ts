const schema = process.env.WILDCAT_SUBGRAPH_SCHEMA?.trim();

if (!schema) {
  throw new Error(
    "WILDCAT_SUBGRAPH_SCHEMA must point to a deployed Graph API endpoint or a full introspection schema"
  );
}

/** @type {import("@graphql-codegen/cli").CodegenConfig} */
const config = {
  schema,
  overwrite: true,
  documents: ["./gql/queries.graphql", "./gql/fragments.graphql"],
  generates: {
    "./src/gql/graphql.ts": {
      plugins: ["typescript", "typescript-operations", "typescript-react-apollo"],
      config: {
        dedupeFragments: true,
        avoidOptionals: false,
        nonOptionalTypename: true,
        withResultType: true,
        withHooks: false,
        typesPrefix: "Subgraph",
        scalars: {
          BigInt: {
            input: "string | number | bigint",
            output: "string"
          },
          Bytes: {
            input: "string",
            output: "string"
          },
          ID: {
            input: "string",
            output: "string"
          }
        }
      }
    }
  }
};

module.exports = config;

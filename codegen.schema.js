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
  generates: {
    "./gql/v2.5-schema.graphql": {
      plugins: ["schema-ast"],
      config: {
        includeDirectives: true
      }
    }
  }
};

module.exports = config;

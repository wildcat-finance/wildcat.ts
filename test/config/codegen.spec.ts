import { execFileSync, spawnSync } from "child_process";
import { readFileSync } from "fs";
import { expect } from "chai";
import { buildSchema, parse, validate } from "graphql";

const repositoryRoot = process.cwd();
const loadConfig =
  "const config = require('./codegen.js'); process.stdout.write(String(config.schema));";

describe("GraphQL codegen configuration", () => {
  it("uses the checked-in full Graph API schema by default", () => {
    const env = { ...process.env };
    delete env.WILDCAT_SUBGRAPH_SCHEMA;

    const output = execFileSync(process.execPath, ["-e", loadConfig], {
      cwd: repositoryRoot,
      env,
      encoding: "utf8"
    });

    expect(output).to.equal("./gql/v2.5-schema.graphql");
  });

  it("passes an endpoint or introspection path through unchanged", () => {
    const schema = "./fixtures/v2.5-introspection.json";
    const output = execFileSync(process.execPath, ["-e", loadConfig], {
      cwd: repositoryRoot,
      env: { ...process.env, WILDCAT_SUBGRAPH_SCHEMA: `  ${schema}  ` },
      encoding: "utf8"
    });

    expect(output).to.equal(schema);
  });

  it("requires an explicit endpoint when refreshing the checked-in schema", () => {
    const env = { ...process.env };
    delete env.WILDCAT_SUBGRAPH_SCHEMA;

    const result = spawnSync(process.execPath, ["-e", "require('./codegen.schema.js')"], {
      cwd: repositoryRoot,
      env,
      encoding: "utf8"
    });

    expect(result.status).not.to.equal(0);
    expect(result.stderr).to.include(
      "WILDCAT_SUBGRAPH_SCHEMA must point to a deployed Graph API endpoint"
    );
  });

  it("validates every checked-in operation against the V2.5 Graph API schema", () => {
    const schema = buildSchema(readFileSync(`${repositoryRoot}/gql/v2.5-schema.graphql`, "utf8"));
    const document = parse(
      ["fragments.graphql", "queries.graphql"]
        .map((file) => readFileSync(`${repositoryRoot}/gql/${file}`, "utf8"))
        .join("\n")
    );

    expect(validate(schema, document).map(({ message }) => message)).to.deep.equal([]);
  });
});

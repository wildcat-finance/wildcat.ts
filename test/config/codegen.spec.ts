import { execFileSync, spawnSync } from "child_process";
import { expect } from "chai";

const repositoryRoot = process.cwd();
const loadConfig =
  "const config = require('./codegen.js'); process.stdout.write(String(config.schema));";

describe("GraphQL codegen configuration", () => {
  it("requires an explicit full-schema source", () => {
    const env = { ...process.env };
    delete env.WILDCAT_SUBGRAPH_SCHEMA;

    const result = spawnSync(process.execPath, ["-e", "require('./codegen.js')"], {
      cwd: repositoryRoot,
      env,
      encoding: "utf8"
    });

    expect(result.status).not.to.equal(0);
    expect(result.stderr).to.include(
      "WILDCAT_SUBGRAPH_SCHEMA must point to a deployed Graph API endpoint"
    );
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
});

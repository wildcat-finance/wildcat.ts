const { spawnSync } = require("child_process");
const { fetchSchema, getCurrentChecksums, readCache, writeCache } = require("./gql-cache");

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32"
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

async function main() {
  await fetchSchema();

  const previousChecksums = readCache();
  if (!process.env.FORCE && previousChecksums && previousChecksums === getCurrentChecksums()) {
    console.log("No GQL changes, skipping codegen");
    return;
  }

  if (!previousChecksums) {
    console.log("cache does not exist");
  } else if (!process.env.FORCE) {
    console.log("caches do not match");
  }

  run("graphql-codegen", []);
  run("node", ["./scripts/gql-type-cleanup.js"]);
  run("eslint", ["src/gql/", "--ext=ts", "--fix"]);
  writeCache();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

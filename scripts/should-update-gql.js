const { fetchSchema, getCurrentChecksums, readCache } = require("./gql-cache");

const SHOULD_UPDATE = 0;
const ERROR = 1;
const SKIP_UPDATE = 2;

async function shouldUpdateGql() {
  await fetchSchema();

  if (process.env.FORCE) return true;

  const previousChecksums = readCache();
  if (!previousChecksums) {
    console.log("cache does not exist");
    return true;
  }

  if (previousChecksums !== getCurrentChecksums()) {
    console.log("caches do not match");
    return true;
  }

  console.log("No GQL changes, skipping codegen");
  return false;
}

shouldUpdateGql()
  .then((shouldUpdate) => {
    process.exit(shouldUpdate ? SHOULD_UPDATE : SKIP_UPDATE);
  })
  .catch((err) => {
    console.error(err);
    process.exit(ERROR);
  });

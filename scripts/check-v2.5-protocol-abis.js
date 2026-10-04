const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");

const artifacts = process.argv[2];
if (!artifacts)
  throw new Error("Usage: node scripts/check-v2.5-protocol-abis.js <protocol deploy-out>");
const targets = {
  MarketLens: "MarketLensV2_5",
  HooksFactory: "HooksFactoryV2_5",
  HooksFactoryRevolving: "HooksFactoryRevolvingV2_5",
  WildcatMarket: "WildcatMarketV2_5"
};
const parameter = (p) => ({
  name: p.name,
  type: p.type,
  ...(p.indexed === undefined ? {} : { indexed: p.indexed }),
  ...(p.components ? { components: p.components.map(parameter) } : {})
});
const key = (entry) =>
  `${entry.type}:${ethers.utils.Fragment.from(entry).format(ethers.utils.FormatTypes.sighash)}`;
const shape = (entry) =>
  JSON.stringify({
    type: entry.type,
    name: entry.name,
    stateMutability: entry.stateMutability,
    inputs: entry.inputs.map(parameter),
    outputs: entry.outputs?.map(parameter)
  });
let checked = 0;
for (const [source, target] of Object.entries(targets)) {
  const sourceAbi = JSON.parse(
    fs.readFileSync(path.join(artifacts, `${source}.sol`, `${source}.json`))
  ).abi;
  const localAbi = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "..", "artifacts", "contracts", `${target}.sol`, `${target}.json`)
    )
  ).abi;
  const expected = new Map(
    sourceAbi
      .filter((e) => ["function", "event", "error"].includes(e.type))
      .map((e) => [key(e), shape(e)])
  );
  if (expected.size !== localAbi.length) throw new Error(`${target}: entry count differs`);
  for (const entry of localAbi) {
    if (expected.get(key(entry)) !== shape(entry))
      throw new Error(`${target}: incompatible ${key(entry)}`);
    checked++;
  }
}
console.log(`Verified ${checked} ABI entries against the protocol deploy profile`);

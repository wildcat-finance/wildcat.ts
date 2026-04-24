import { expect } from "chai";
import fs from "fs";
import path from "path";
import { encodeFunctionData, getAddress } from "viem";
import * as generatedAbis from "../../src/abi";
import { marketLensV2_5Abi, wildcatArchControllerAbi } from "../../src/abi";

type AbiSpec = {
  exportName?: keyof typeof generatedAbis;
  artifact: string;
  types?: string[];
  names?: string[];
};

const root = path.join(__dirname, "../..");
const specs = JSON.parse(
  fs.readFileSync(path.join(root, "scripts/viem-abi-specs.json"), "utf8")
) as AbiSpec[];

const filterAbi = (abi: any[], spec: AbiSpec): any[] => {
  const types = new Set(spec.types ?? ["function"]);
  const names = spec.names ? new Set(spec.names) : undefined;
  return abi.filter((item) => {
    if (!types.has(item.type)) return false;
    if (names && !names.has(item.name)) return false;
    return true;
  });
};

const getArtifactAbi = (artifactPath: string): any[] => {
  return JSON.parse(fs.readFileSync(path.join(root, artifactPath), "utf8")).abi;
};

describe("generated viem ABIs", () => {
  it("match the configured Hardhat artifact ABI slices", () => {
    for (const spec of specs) {
      if (!spec.exportName) continue;
      expect(generatedAbis[spec.exportName]).to.deep.equal(
        filterAbi(getArtifactAbi(spec.artifact), spec)
      );
    }
  });

  it("can encode key upcoming read calls with viem", () => {
    const account = getAddress("0x0000000000000000000000000000000000000001");
    const market = getAddress("0x0000000000000000000000000000000000000002");

    expect(
      encodeFunctionData({
        abi: marketLensV2_5Abi,
        functionName: "getMarketDataV2",
        args: [market]
      })
    ).to.match(/^0x[0-9a-f]+$/);

    expect(
      encodeFunctionData({
        abi: wildcatArchControllerAbi,
        functionName: "isRegisteredBorrower",
        args: [account]
      })
    ).to.match(/^0x[0-9a-f]+$/);
  });
});

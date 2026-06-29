import { defaultAbiCoder } from "ethers/lib/utils";
import { assert } from "../utils";

export const REVOLVING_MARKET_DATA_VERSION = 1;
export const MAX_REVOLVING_COMMITMENT_FEE_BIPS = 10_000;

export type RevolvingMarketData = {
  commitmentFeeBips: number;
};

export const encodeRevolvingMarketData = ({ commitmentFeeBips }: RevolvingMarketData): string => {
  assert(Number.isInteger(commitmentFeeBips), "commitmentFeeBips must be an integer");
  assert(commitmentFeeBips >= 0, "commitmentFeeBips must be non-negative");
  assert(
    commitmentFeeBips <= MAX_REVOLVING_COMMITMENT_FEE_BIPS,
    `commitmentFeeBips must be <= ${MAX_REVOLVING_COMMITMENT_FEE_BIPS}`
  );
  return defaultAbiCoder.encode(
    ["uint8", "uint16"],
    [REVOLVING_MARKET_DATA_VERSION, commitmentFeeBips]
  );
};

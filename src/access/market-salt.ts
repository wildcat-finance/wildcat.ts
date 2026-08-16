import {
  concatHex,
  getAddress,
  isAddress,
  isHex,
  size,
  sliceHex,
  zeroAddress,
  type Address,
  type Hex
} from "viem";

const MarketSaltSize = 32;
const MarketSaltNonceSize = 12;

/**
 * Encode the CREATE2 salt expected by the v2.5 market factories.
 *
 * `factoryCaller` is the address that calls the hooks factory. For a borrower
 * account, use the account contract, not its principal or transaction signer.
 */
export const encodeMarketSalt = (factoryCaller: string, nonce: string): Hex => {
  if (!isAddress(factoryCaller)) {
    throw new Error("Market salt factory caller must be a valid address");
  }
  const normalizedFactoryCaller = getAddress(factoryCaller);
  if (normalizedFactoryCaller.toLowerCase() === zeroAddress) {
    throw new Error("Market salt factory caller must not be the zero address");
  }
  if (!isHex(nonce, { strict: true }) || size(nonce) !== MarketSaltNonceSize) {
    throw new Error("Market salt nonce must be exactly 12 bytes");
  }
  return concatHex([normalizedFactoryCaller, nonce]);
};

/** Return the immediate factory caller encoded in a valid market salt. */
export const getMarketSaltFactoryCaller = (salt: string): Address => {
  if (!isHex(salt, { strict: true }) || size(salt) !== MarketSaltSize) {
    throw new Error("Market salt must be exactly 32 bytes");
  }
  const factoryCaller = getAddress(sliceHex(salt, 0, 20));
  if (factoryCaller.toLowerCase() === zeroAddress) {
    throw new Error("Market salt must include a non-zero factory caller");
  }
  return factoryCaller;
};

/**
 * Check the salt shape and non-zero caller prefix. Use
 * `isMarketSaltForFactoryCaller` when the immediate caller is known.
 */
export const isMarketSaltFormatValid = (salt: string): boolean => {
  try {
    getMarketSaltFactoryCaller(salt);
    return true;
  } catch {
    return false;
  }
};

/**
 * Check a market salt against the address that will call the hooks factory.
 * This caller may differ from the wallet signing the outer transaction.
 */
export const isMarketSaltForFactoryCaller = (salt: string, factoryCaller: string): boolean => {
  if (!isAddress(factoryCaller)) return false;
  try {
    return getMarketSaltFactoryCaller(salt).toLowerCase() === factoryCaller.toLowerCase();
  } catch {
    return false;
  }
};

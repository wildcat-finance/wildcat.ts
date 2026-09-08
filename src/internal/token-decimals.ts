/** Bound decimal-driven allocations to the ERC-20 uint8 range. */
export const assertTokenDecimals = (decimals: number): void => {
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 255) {
    throw new Error("Token decimals must be an integer from 0 to 255");
  }
};

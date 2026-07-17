export enum SupportedChainId {
  Mainnet = 1,
  Sepolia = 11155111,
  PlasmaTestnet = 9746,
  PlasmaMainnet = 9745
}

export const SupportedChainIds = [
  SupportedChainId.Mainnet,
  SupportedChainId.Sepolia,
  SupportedChainId.PlasmaTestnet,
  SupportedChainId.PlasmaMainnet
] as const;

export const isSupportedChainId = (chainId: number): chainId is SupportedChainId =>
  SupportedChainIds.includes(chainId as SupportedChainId);

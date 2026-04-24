import {
  ContractWrapper,
  PartialTransaction,
  Signer,
  SignerOrProvider,
  SubmittedDeployment
} from "./types";
import { Token } from "./token";
import { SupportedChainId, getDeploymentAddress } from "./constants";
import { assert, prepareTransaction } from "./utils";
import { mockERC20FactoryAbi } from "./abi";
import { submitPreparedTransactionAndWait } from "./internal/viem-write";
import { parseEventLogs } from "viem";
import { getViemPublicClientFromEthers } from "./internal/ethers-viem";
import { readViemContract } from "./internal/viem-read";

export class TokenFactory extends ContractWrapper {
  constructor(
    public chainId: SupportedChainId,
    public address: string,
    provider: SignerOrProvider
  ) {
    super(provider);
  }

  static getFactory(chainId: SupportedChainId, providerOrSigner: SignerOrProvider): TokenFactory {
    assert(providerOrSigner !== undefined, `Signer does not have a provider`);
    return new TokenFactory(
      chainId,
      getDeploymentAddress(chainId, "MockERC20Factory"),
      providerOrSigner
    );
  }

  static async getNextTokenAddress(
    chainId: SupportedChainId,
    providerOrSigner: SignerOrProvider,
    address: string
  ): Promise<string> {
    const factory = TokenFactory.getFactory(chainId, providerOrSigner);
    return factory.getNextTokenAddress(address);
  }

  static async deployToken(
    chainId: SupportedChainId,
    signer: Signer,
    name: string,
    symbol: string
  ): Promise<SubmittedDeployment<Token>> {
    const factory = TokenFactory.getFactory(chainId, signer);
    return factory.deployToken(name, symbol);
  }

  static populateDeployToken(
    chainId: SupportedChainId,
    signer: Signer,
    name: string,
    symbol: string
  ): PartialTransaction {
    const factory = TokenFactory.getFactory(chainId, signer);
    return factory.populateDeployToken(name, symbol);
  }

  async deployToken(name: string, symbol: string): Promise<SubmittedDeployment<Token>> {
    const { hash, receipt } = await submitPreparedTransactionAndWait(
      this.provider,
      this.signer,
      this.populateDeployToken(name, symbol)
    );

    const event = parseEventLogs({
      abi: mockERC20FactoryAbi,
      eventName: "NewTokenDeployed",
      logs: receipt.logs
    })[0];
    assert(event !== undefined, "No NewTokenDeployed event found");

    const token = new Token(
      this.chainId,
      event.args.token,
      name,
      symbol,
      event.args.decimals,
      true,
      this.provider
    );
    return { hash, receipt, result: token };
  }

  populateDeployToken(name: string, symbol: string): PartialTransaction {
    return prepareTransaction({
      to: this.address,
      abi: mockERC20FactoryAbi,
      functionName: "deployMockERC20",
      args: [name, symbol]
    });
  }

  async getNextTokenAddress(address: string): Promise<string> {
    return readViemContract<string>(
      getViemPublicClientFromEthers(this.provider),
      this.address,
      mockERC20FactoryAbi,
      "getNextTokenAddress",
      [address]
    );
  }
}

import { ContractWrapper, PartialTransaction, Signer, SignerOrProvider } from "./types";
import { MockERC20Factory, MockERC20Factory__factory } from "./typechain";
import { NewTokenDeployedEvent } from "./typechain/MockERC20Factory";
import { Token } from "./token";
import { SupportedChainId, getDeploymentAddress } from "./constants";
import { assert, prepareTransaction } from "./utils";
import { ContractReceipt, ContractTransaction } from "ethers";
import { mockERC20FactoryAbi } from "./abi";

export class TokenFactory extends ContractWrapper<MockERC20Factory> {
  readonly contractFactory = MockERC20Factory__factory;
  protected get _contractAddress(): string {
    return this.address;
  }
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
  ): Promise<{ token: Token; receipt: ContractReceipt }> {
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

  async deployToken(
    name: string,
    symbol: string
  ): Promise<{
    token: Token;
    receipt: ContractReceipt;
    transaction: ContractTransaction;
  }> {
    const transaction = await this.contract.deployMockERC20(name, symbol);
    const receipt = await transaction.wait();

    const {
      args: { token: tokenAddress, decimals }
    } = receipt.events!.find((e) => e.event === "NewTokenDeployed")! as NewTokenDeployedEvent;

    const token = new Token(
      this.chainId,
      tokenAddress,
      name,
      symbol,
      decimals,
      true,
      this.provider
    );
    return { token, transaction, receipt };
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
    return this.contract.getNextTokenAddress(address);
  }
}

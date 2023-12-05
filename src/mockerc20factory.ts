import { ContractWrapper, PartialTransaction, Provider, Signer, SignerOrProvider } from "./types";
import { MockERC20Factory, MockERC20Factory__factory } from "./typechain";
import { NewTokenDeployedEvent } from "./typechain/MockERC20Factory";
import { Token } from "./token";
import { SupportedChainId, getDeploymentAddress } from "./constants";
import { assert, removeUnusedTxFields } from "./utils";

export class TokenFactory extends ContractWrapper<MockERC20Factory> {
  readonly contractFactory = MockERC20Factory__factory;

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
  ): Promise<Token> {
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

  async deployToken(name: string, symbol: string): Promise<Token> {
    const receipt = await this.contract.deployMockERC20(name, symbol).then((r) => r.wait());

    const {
      args: { token, decimals }
    } = receipt.events!.find((e) => e.event === "NewTokenDeployed")! as NewTokenDeployedEvent;

    return new Token(this.chainId, token, name, symbol, decimals, true, this.provider);
  }

  populateDeployToken(name: string, symbol: string): PartialTransaction {
    return {
      to: this.address,
      data: this.contract.interface.encodeFunctionData("deployMockERC20", [name, symbol]),
      value: "0"
    };
  }

  async getNextTokenAddress(address: string): Promise<string> {
    return this.contract.getNextTokenAddress(address);
  }
}

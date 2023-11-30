import { ContractWrapper, Provider, Signer, SignerOrProvider } from "./types";
import { MockERC20Factory, MockERC20Factory__factory } from "./typechain";
import { NewTokenDeployedEvent } from "./typechain/MockERC20Factory";
import { Token } from "./token";
import { SupportedChainId, getDeploymentAddress } from "./constants";
import { assert } from "./utils";

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
    const provider =
      providerOrSigner instanceof Provider ? providerOrSigner : providerOrSigner.provider;
    assert(provider !== undefined, `Signer does not have a provider`);
    return new TokenFactory(chainId, getDeploymentAddress(chainId, "MockERC20Factory"), provider);
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

  async deployToken(name: string, symbol: string): Promise<Token> {
    const receipt = await this.contract.deploy(name, symbol).then((r) => r.wait());

    const {
      args: { token, decimals }
    } = receipt.events!.find((e) => e.event === "NewTokenDeployed")! as NewTokenDeployedEvent;

    return new Token(this.chainId, token, name, symbol, decimals, true, this.provider);
  }
}

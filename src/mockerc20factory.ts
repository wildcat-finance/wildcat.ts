import { ContractWrapper, SignerOrProvider } from "./types";
import { MockERC20Factory, MockERC20Factory__factory } from "./typechain";
import { NewTokenDeployedEvent } from "./typechain/mock/MockERC20Factory";
import { Token } from "./token";
import { MockERC20FactoryAddress } from "./constants";

export class TokenFactory extends ContractWrapper<MockERC20Factory> {
  readonly contractFactory = MockERC20Factory__factory;

  constructor(public address: string, provider: SignerOrProvider) {
    super(provider);
  }

  static getFactory(provider: SignerOrProvider): TokenFactory {
    return new TokenFactory(MockERC20FactoryAddress, provider);
  }

  async deployToken(name: string, symbol: string): Promise<Token> {
    const receipt = await this.contract.deploy(name, symbol).then((r) => r.wait());

    const {
      args: { token, decimals }
    } = receipt.events!.find((e) => e.event === "NewTokenDeployed")! as NewTokenDeployedEvent;

    return new Token(token, name, symbol, decimals, true, this.provider);
  }
}

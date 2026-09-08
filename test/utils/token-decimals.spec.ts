import { expect } from "chai";
import { BigNumber, providers } from "ethers";
import { SupportedChainId } from "../../src/constants";
import type { SubgraphMarketDataFragment } from "../../src/gql/graphql";
import { Token } from "../../src/token";
import { formatBnFixed, formatFixedBigint, parseFixedBigint } from "../../src/utils";

const provider = new providers.JsonRpcProvider();
const chainId = SupportedChainId.Sepolia;
const address = "0x0000000000000000000000000000000000000001";
const name = "Test Token";
const symbol = "TEST";
const decimalsError = "Token decimals must be an integer from 0 to 255";

const createToken = (decimals: number): Token =>
  new Token(chainId, address, name, symbol, decimals, false, provider);

const factories: Array<[string, (decimals: number) => Token]> = [
  ["constructor", createToken],
  [
    "subgraph token",
    (decimals) =>
      Token.fromSubgraphToken(
        chainId,
        { __typename: "Token", id: address, address, name, symbol, decimals, isMock: false },
        provider
      )
  ],
  [
    "subgraph market token",
    (decimals) =>
      Token.fromSubgraphMarketData(
        chainId,
        {
          __typename: "Market",
          id: address,
          address,
          name,
          symbol,
          decimals
        } as SubgraphMarketDataFragment,
        provider
      )
  ],
  [
    "legacy lens metadata",
    (decimals) =>
      Token.fromTokenMetadata(
        chainId,
        { token: address, name, symbol, decimals: BigNumber.from(decimals), isMock: false },
        provider
      )
  ],
  [
    "viem metadata object",
    (decimals) =>
      Token.fromViemTokenMetadata(
        chainId,
        { token: address, name, symbol, decimals: BigInt(decimals), isMock: false },
        provider
      )
  ],
  [
    "viem metadata tuple",
    (decimals) =>
      Token.fromViemTokenMetadata(
        chainId,
        [address, name, symbol, BigInt(decimals), false],
        provider
      )
  ]
];

describe("token decimal bounds", () => {
  for (const [label, factory] of factories) {
    it(`preserves ordinary decimals and both uint8 boundaries through ${label}`, () => {
      for (const decimals of [0, 6, 18, 255]) {
        const token = factory(decimals);
        const amount = token.parseAmount("1");

        expect(token.decimals).to.equal(decimals);
        expect(amount.raw).to.equal(10n ** BigInt(decimals));
        expect(amount.format()).to.equal("1");
      }
    });

    it(`rejects decimals outside uint8 through ${label}`, () => {
      for (const decimals of [-1, 256]) {
        expect(() => factory(decimals)).to.throw(decimalsError);
      }
    });
  }

  it("rejects fractional, non-finite, and non-numeric decimals during construction", () => {
    for (const decimals of [0.5, NaN, Infinity, -Infinity, undefined, null, "18", 18n]) {
      expect(() => createToken(decimals as number)).to.throw(decimalsError);
    }
  });

  it("checks decimal metadata again when parsing or formatting an existing token", () => {
    const token = createToken(18);
    const amount = token.getAmount(1n);
    token.decimals = 256;

    expect(() => token.parseAmount("1")).to.throw(decimalsError);
    expect(() => amount.toFixed(2)).to.throw(decimalsError);
    expect(() => amount.format()).to.throw(decimalsError);
  });
});

describe("fixed-point decimal bounds", () => {
  const helpers: Array<[string, (decimals: number) => unknown]> = [
    ["parseFixedBigint", (decimals) => parseFixedBigint("1", decimals)],
    ["formatFixedBigint", (decimals) => formatFixedBigint(1n, decimals)],
    ["formatBnFixed", (decimals) => formatBnFixed(BigNumber.from(1), decimals)]
  ];

  for (const [label, helper] of helpers) {
    it(`rejects invalid decimals in direct ${label} calls`, () => {
      for (const decimals of [-1, 256, 0.5, NaN, Infinity, -Infinity, null, "18", 18n]) {
        expect(() => helper(decimals as number)).to.throw(decimalsError);
      }
    });
  }

  it("preserves exact parsing and formatting at token and protocol scales", () => {
    for (const decimals of [0, 6, 18, 25, 27, 255]) {
      const unit = decimals === 0 ? "1" : `0.${"0".repeat(decimals - 1)}1`;

      expect(parseFixedBigint(unit, decimals)).to.equal(1n);
      expect(parseFixedBigint(`-${unit}`, decimals)).to.equal(-1n);
      expect(formatFixedBigint(1n, decimals)).to.equal(unit);
      expect(formatFixedBigint(-1n, decimals)).to.equal(`-${unit}`);
      expect(formatFixedBigint(0n, decimals)).to.equal("0");
      expect(formatBnFixed(BigNumber.from(1), decimals)).to.equal(unit);
      expect(formatBnFixed(BigNumber.from(-1), decimals)).to.equal(`-${unit}`);
    }
  });

  it("preserves default decimals and legacy formatting precision", () => {
    const amount = BigNumber.from("123456700");

    expect(parseFixedBigint("1")).to.equal(10n ** 18n);
    expect(formatFixedBigint(10n ** 18n)).to.equal("1");
    expect(formatBnFixed(BigNumber.from("1000000000000000000"))).to.equal("1");
    expect(formatBnFixed(amount, 6, 2)).to.equal("123.45");
    expect(formatBnFixed(amount, 6, 1_000)).to.equal("123.4567");
  });
});

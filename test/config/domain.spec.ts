import { expect } from "chai";
import {
  DeployableMarketKinds,
  HooksKind,
  MarketKinds,
  isDeployableMarketKind,
  isMarketKind,
  parseFactoryLifecycle,
  parseHookedMarketAbiKind,
  parseHooksKind,
  parseMarketKind,
  parseMarketOriginKind,
  parseProtocolEventGeneration,
  parseProtocolMarketVersion,
  parsePricingMode,
  parseSnapshotSource
} from "../../src/domain";

describe("SDK domain normalization", () => {
  it("keeps unknown market kinds distinct from deployable kinds", () => {
    expect(MarketKinds).to.deep.equal(["standard", "revolving", "unknown"]);
    expect(DeployableMarketKinds).to.deep.equal(["standard", "revolving"]);
    expect(isMarketKind("unknown")).to.equal(true);
    expect(isDeployableMarketKind("unknown")).to.equal(false);
  });

  it("normalizes current and transitional market-kind spellings", () => {
    expect(parseMarketKind("STANDARD")).to.equal("standard");
    expect(parseMarketKind("legacy")).to.equal("standard");
    expect(parseMarketKind("REVOLVING")).to.equal("revolving");
    expect(parseMarketKind("future-kind")).to.equal("unknown");
    expect(parseMarketKind(undefined)).to.equal("unknown");
    expect(parseProtocolMarketVersion("V2")).to.equal("v2");
    expect(parseProtocolMarketVersion("future-version")).to.equal("unknown");
    expect(parseProtocolEventGeneration("LEGACY")).to.equal("legacy");
    expect(parseProtocolEventGeneration("V2_5")).to.equal("v2.5");
    expect(parseProtocolEventGeneration("future-generation")).to.equal("unknown");
  });

  it("normalizes subgraph metadata without silently accepting unknown values", () => {
    expect(parseHooksKind("PeriodicTerm")).to.equal(HooksKind.PeriodicTerm);
    expect(parseHooksKind("OpenTermHooks")).to.equal(HooksKind.OpenTerm);
    expect(parseHooksKind("FixedTermHooks")).to.equal(HooksKind.FixedTerm);
    expect(parseHooksKind("PeriodicTermHooks")).to.equal(HooksKind.PeriodicTerm);
    expect(parseHooksKind("future-hooks")).to.equal(HooksKind.Unknown);
    expect(parseFactoryLifecycle("HISTORICAL")).to.equal("historical");
    expect(parseFactoryLifecycle("future-lifecycle")).to.equal("unknown");
    expect(parseHookedMarketAbiKind("FORCE_BUYBACK")).to.equal("force-buyback");
    expect(parseHookedMarketAbiKind("future-abi")).to.equal("unknown");
    expect(parsePricingMode("SYNTHETIC_TESTNET")).to.equal("synthetic-testnet");
    expect(parsePricingMode("NONE")).to.equal("none");
    expect(parsePricingMode("future-pricing")).to.equal("unknown");
    expect(parseMarketOriginKind("HOOKS")).to.equal("hooks");
    expect(parseMarketOriginKind("future-origin")).to.equal("unknown");
    expect(parseSnapshotSource("EVENT_PROJECTION")).to.equal("event-projection");
    expect(parseSnapshotSource("EVENT_AND_CONTRACT_CALL")).to.equal("event-and-contract-call");
    expect(parseSnapshotSource("future-source")).to.equal("unknown");
  });
});

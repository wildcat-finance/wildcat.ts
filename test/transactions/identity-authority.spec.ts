import { expect } from "chai";
import { decodeAbiParameters, decodeFunctionData, getAddress, padHex, toHex } from "viem";
import {
  accessListRoleProviderAbi,
  borrowerIdentityRegistryAbi,
  iOpenTermHooksAbi,
  wildcatMarketV2Abi
} from "../../src/abi";
import {
  encodeAccessListRoleProviderDeploymentInputs,
  prepareAddAccessListMembers,
  prepareAddHookRoleProvider,
  prepareCreateAndAddAccessListRoleProvider,
  prepareRequestHookAdministratorTransfer,
  prepareRequestRoleProviderAdministratorTransfer
} from "../../src/authority";
import {
  prepareAcceptMarketBorrowerTransfer,
  prepareRequestBorrowerAccountPrincipalTransfer,
  prepareRequestMarketBorrowerTransfer
} from "../../src/identity";

const makeAddress = (suffix: number): `0x${string}` =>
  getAddress(`0x${suffix.toString(16).padStart(40, "0")}`);

describe("v2.5 identity and authority transaction preparation", () => {
  it("keeps market borrower and account principal transfers as separate calls", () => {
    const market = makeAddress(1);
    const account = makeAddress(2);
    const registry = makeAddress(3);
    const principal = makeAddress(4);

    const marketRequest = prepareRequestMarketBorrowerTransfer(market, account);
    const marketAccept = prepareAcceptMarketBorrowerTransfer(market);
    const principalRequest = prepareRequestBorrowerAccountPrincipalTransfer(
      registry,
      account,
      principal
    );

    expect(marketRequest.to).to.equal(market);
    expect(
      decodeFunctionData({ abi: wildcatMarketV2Abi, data: marketRequest.data as `0x${string}` })
    ).to.deep.equal({ functionName: "requestBorrowerTransfer", args: [account] });
    expect(
      decodeFunctionData({ abi: wildcatMarketV2Abi, data: marketAccept.data as `0x${string}` })
        .functionName
    ).to.equal("acceptBorrowerTransfer");
    expect(principalRequest.to).to.equal(registry);
    expect(
      decodeFunctionData({
        abi: borrowerIdentityRegistryAbi,
        data: principalRequest.data as `0x${string}`
      })
    ).to.deep.equal({
      functionName: "requestBorrowerAccountPrincipalTransfer",
      args: [account, principal]
    });
  });

  it("keeps hook and provider administration independent", () => {
    const hooks = makeAddress(10);
    const provider = makeAddress(11);
    const nextAdministrator = makeAddress(12);

    const hooksRequest = prepareRequestHookAdministratorTransfer(hooks, nextAdministrator);
    const providerRequest = prepareRequestRoleProviderAdministratorTransfer(
      provider,
      nextAdministrator
    );

    expect(
      decodeFunctionData({ abi: iOpenTermHooksAbi, data: hooksRequest.data as `0x${string}` })
    ).to.deep.equal({
      functionName: "requestAdministratorTransfer",
      args: [nextAdministrator]
    });
    expect(
      decodeFunctionData({
        abi: accessListRoleProviderAbi,
        data: providerRequest.data as `0x${string}`
      })
    ).to.deep.equal({
      functionName: "requestAdministratorTransfer",
      args: [nextAdministrator]
    });
  });

  it("targets the selected provider when changing reusable whitelist membership", () => {
    const provider = makeAddress(20);
    const memberA = makeAddress(21);
    const memberB = makeAddress(22);

    const single = prepareAddAccessListMembers(provider, [memberA]);
    const batch = prepareAddAccessListMembers(provider, [memberA, memberB]);

    expect(single.to).to.equal(provider);
    expect(
      decodeFunctionData({ abi: accessListRoleProviderAbi, data: single.data as `0x${string}` })
    ).to.deep.equal({ functionName: "addMember", args: [memberA] });
    expect(
      decodeFunctionData({ abi: accessListRoleProviderAbi, data: batch.data as `0x${string}` })
    ).to.deep.equal({ functionName: "addMembers", args: [[memberA, memberB]] });
  });

  it("encodes provider creation separately from hook attachment policy", () => {
    const hooks = makeAddress(30);
    const providerFactory = makeAddress(31);
    const administrator = makeAddress(32);
    const member = makeAddress(33);
    const salt = padHex(toHex(34), { size: 32 });
    const inputs = { administrator, initialMembers: [member], salt };

    const encodedInputs = encodeAccessListRoleProviderDeploymentInputs(inputs);
    const [decodedInputs] = decodeAbiParameters(
      [
        {
          type: "tuple",
          components: [
            { name: "administrator", type: "address" },
            { name: "initialMembers", type: "address[]" },
            { name: "salt", type: "bytes32" }
          ]
        }
      ],
      encodedInputs as `0x${string}`
    );
    expect(decodedInputs).to.deep.equal({ administrator, initialMembers: [member], salt });

    const createAndAdd = prepareCreateAndAddAccessListRoleProvider(
      hooks,
      providerFactory,
      0,
      inputs
    );
    expect(
      decodeFunctionData({ abi: iOpenTermHooksAbi, data: createAndAdd.data as `0x${string}` })
    ).to.deep.equal({
      functionName: "createRoleProvider",
      args: [providerFactory, 0, encodedInputs]
    });

    const existingProvider = makeAddress(35);
    const addExisting = prepareAddHookRoleProvider(hooks, existingProvider, 3600);
    expect(
      decodeFunctionData({ abi: iOpenTermHooksAbi, data: addExisting.data as `0x${string}` })
    ).to.deep.equal({
      functionName: "addRoleProvider",
      args: [existingProvider, 3600]
    });
  });
});

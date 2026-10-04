// Run after `yarn build` against an Anvil Sepolia fork at/after block 11831272.
// All writes are local and are reverted to a snapshot before exit.
const assert = require("assert/strict");
const { ethers } = require("ethers");
const sdk = require("../dist");

async function main() {
  const endpoint = process.env.V2_5_FORK_RPC_URL;
  if (!endpoint || !["127.0.0.1", "localhost", "[::1]"].includes(new URL(endpoint).hostname)) {
    throw new Error("V2_5_FORK_RPC_URL must be an explicitly selected loopback Anvil endpoint");
  }
  const provider = new ethers.providers.JsonRpcProvider(endpoint);
  assert.match(await provider.send("web3_clientVersion", []), /anvil/i);
  assert.equal((await provider.getNetwork()).chainId, sdk.SupportedChainId.Sepolia);
  provider.pollingInterval = 50;
  const snapshot = await provider.send("evm_snapshot", []);
  const chainId = sdk.SupportedChainId.Sepolia;
  let owner;
  const results = [];
  try {
    const signer = provider.getSigner(0);
    // Time travel changes accrued-state gas between estimation and mining on a local fork.
    const sendTransaction = signer.sendTransaction.bind(signer);
    signer.sendTransaction = (tx) => sendTransaction({ ...tx, gasLimit: 15_000_000 });
    const borrower = await signer.getAddress();
    const arch = new ethers.Contract(
      sdk.getDeploymentAddress(chainId, "WildcatArchController"),
      sdk.wildcatArchControllerAbi,
      provider
    );
    owner = await arch.owner();
    await provider.send("anvil_impersonateAccount", [owner]);
    await provider.send("anvil_setBalance", [
      owner,
      ethers.utils.hexValue(ethers.utils.parseEther("100"))
    ]);
    if (!(await arch.isRegisteredBorrower(borrower))) {
      await (await arch.connect(provider.getSigner(owner)).registerBorrower(borrower)).wait();
    }
    const tokenFactory = new ethers.Contract(
      sdk.getDeploymentAddress(chainId, "MockERC20Factory"),
      sdk.mockERC20FactoryAbi,
      signer
    );
    const tokenAddress = await tokenFactory.getNextTokenAddress(borrower);
    await (await tokenFactory.deployMockERC20("SDK fork asset", "SDK")).wait();
    const token = new ethers.Contract(
      tokenAddress,
      [
        "function faucet()",
        "function approve(address,uint256) returns(bool)",
        "function transfer(address,uint256) returns(bool)"
      ],
      signer
    );
    for (let i = 0; i < 10; i++) await (await token.faucet()).wait();
    const asset = await sdk.Token.getTokenData(chainId, tokenAddress, signer);
    const client = sdk.createSubgraphClient(
      chainId,
      "https://graph.hinterlight.net/sepolia/v2.5.13"
    );
    const registrations = await sdk.getHooksTemplateRegistrations(client, {
      fetchPolicy: "network-only"
    });
    const lens = new ethers.Contract(
      sdk.getDeploymentAddress(chainId, "MarketLensV2_5"),
      sdk.marketLensV2_5Abi,
      provider
    );
    let nonce = 1;
    for (const marketKind of ["standard", "revolving"]) {
      const factory = sdk.getHooksFactoryAddress(chainId, marketKind);
      const data = await lens["getHooksDataForBorrower(address,address)"](factory, borrower);
      for (const entry of data.hooksTemplates) {
        const registration = registrations.find(
          (r) =>
            r.hooksFactory.address.toLowerCase() === factory.toLowerCase() &&
            r.hooksTemplate.address.toLowerCase() === entry.hooksTemplate.toLowerCase()
        );
        assert.ok(registration);
        assert.equal(entry.initCodeHash.isPresent, true);
        assert.equal(
          entry.initCodeHash.value.toLowerCase(),
          registration.initCodeHash.toLowerCase()
        );
        const Class = {
          OpenTermHooks: sdk.OpenTermHooksTemplate,
          FixedTermHooks: sdk.FixedTermHooksTemplate,
          PeriodicTermHooks: sdk.PeriodicTermHooksTemplate
        }[entry.name];
        assert.ok(Class, `Unexpected template ${entry.name}`);
        const template = Class.fromLensData(chainId, signer, entry, {
          hooksFactory: factory,
          signerAddress: borrower,
          isRegisteredBorrower: true,
          isRegisteredHooksFactory: true,
          registration
        });
        const timestamp = (await provider.getBlock("latest")).timestamp;
        const terms = { repaymentDate: timestamp + 7200, repaymentPeriod: 600 };
        const args = {
          marketKind,
          ...(marketKind === "revolving" ? { commitmentFeeBips: 200 } : {}),
          asset,
          namePrefix: "Fork ",
          symbolPrefix: "F-",
          maxTotalSupply: asset.parseAmount("10000"),
          annualInterestBips: 1000,
          delinquencyFeeBips: 200,
          delinquencyGracePeriod: 86400,
          withdrawalBatchDuration: 600,
          reserveRatioBips: 2000,
          salt: sdk.encodeMarketSalt(borrower, `0x${(nonce++).toString(16).padStart(24, "0")}`),
          hooksInstanceName: "SDK integration",
          existingProviders: [],
          newProviderInputs: [],
          depositAccess: sdk.DepositAccess.Open,
          transferAccess: sdk.TransferAccess.Open,
          withdrawalAccess: sdk.WithdrawalAccess.Open,
          ...terms,
          fixedTermEndTime: timestamp + 600,
          allowClosureBeforeTerm: true,
          allowTermReduction: true,
          firstWithdrawalWindowStart: timestamp + 300,
          periodDuration: 3600,
          withdrawalWindowDuration: 600
        };
        console.log(`Checking ${marketKind} ${entry.name}`);
        const preview = template.previewDeployMarket(args);
        assert.equal(preview.status, sdk.DeployMarketStatus.Ready, `${entry.name} preview`);
        const factoryContract = new ethers.Contract(
          factory,
          sdk.getHooksFactoryDeploymentAbi(chainId, marketKind),
          signer
        );
        const address = await factoryContract.computeMarketAddress(args.salt);
        const hash = await template.deployMarket(args);
        await hash.wait();
        const market = await sdk.Market.getMarketV2(chainId, address, signer);
        assert.equal(market.repaymentDate, terms.repaymentDate);
        assert.equal(market.repaymentPeriod, terms.repaymentPeriod);
        assert.equal(market.hasRecordedDefault, false);
        assert.equal(market.marketKind, marketKind);
        const raw = new ethers.Contract(address, sdk.wildcatMarketV2_5Abi, signer);
        assert.equal(market.totalDebts.raw.toString(), (await raw.totalDebts()).toString());
        await (await token.approve(address, ethers.constants.MaxUint256)).wait();
        await (await raw.deposit(asset.parseAmount("100").raw)).wait();
        await (await raw.borrow(asset.parseAmount("50").raw)).wait();
        await provider.send("evm_setNextBlockTimestamp", [terms.repaymentDate]);
        await provider.send("evm_mine", []);
        await market.update();
        assert.equal(market.isInRepayment, true);
        assert.equal(market.maximumDeposit.raw, 0n);
        assert.equal(market.borrowableAssets.raw, 0n);
        assert.equal(market.isIncurringPenalties, true);
        assert.ok(market.timeDelinquent <= market.delinquencyGracePeriod);
        let account = await sdk.MarketAccount.getMarketAccountV2(
          chainId,
          signer,
          borrower,
          address
        );
        assert.equal(account.depositAvailability, sdk.DepositStatus.MarketInRepayment);
        assert.equal(account.withdrawalAvailability, sdk.QueueWithdrawalStatus.Ready);
        await (await raw.queueWithdrawal(asset.parseAmount("1").raw)).wait();
        await provider.send("evm_setNextBlockTimestamp", [
          terms.repaymentDate + terms.repaymentPeriod + 1
        ]);
        await provider.send("evm_mine", []);
        await (await raw.updateState()).wait();
        await market.update();
        assert.equal(market.defaultedAt, terms.repaymentDate + terms.repaymentPeriod);
        // A direct donation can close the accrued view before a state-writing transaction.
        await (await token.transfer(address, asset.parseAmount("60").raw)).wait();
        await sdk.Market.refreshMarketsV2LiveData(chainId, [market], signer);
        assert.equal(market.isClosed, true);
        assert.equal(market.isInRepayment, false);
        assert.equal(market.hasRecordedDefault, true);
        assert.equal(market.isIncurringPenalties, false);
        assert.ok(market.recoverableUnderlying.raw > 0n);
        if (entry.name === "PeriodicTermHooks") {
          assert.equal(market.periodicHooksConfig.periodicTermClosed, true);
          assert.equal(market.periodicHooksConfig.pendingAprChangeProposalTimestamp, 0);
        }
        account = await sdk.MarketAccount.getMarketAccountV2(chainId, signer, borrower, address);
        assert.equal(account.previewRecoverUnderlying().status, sdk.RecoverUnderlyingStatus.Ready);
        await (await account.recoverUnderlying()).wait();
        await market.update();
        assert.equal(market.recoverableUnderlying.raw, 0n);
        results.push({
          marketKind,
          hooks: entry.name,
          address,
          repayment: true,
          default: true,
          automaticClosure: true,
          recovery: true
        });
      }
    }
    console.log(JSON.stringify({ chainId, localForkOnly: true, results }, null, 2));
  } finally {
    if (owner) await provider.send("anvil_stopImpersonatingAccount", [owner]);
    await provider.send("evm_revert", [snapshot]);
  }
}

main().catch((error) => {
  console.error(error.stack ?? error.message);
  process.exitCode = 1;
});

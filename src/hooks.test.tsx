import "dotenv/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { useGetSubgraphStatusQuery } from "./gql/graphql";
import { JsonRpcProvider } from "@ethersproject/providers";
import { SupportedChainId, getSubgraphClient } from "./constants";
import {
  useAccountsWhereLenderAuthorizedOrActive,
  useAllPendingWithdrawalBatchesForMarket,
  useMarket,
  useMarketsForBorrower
} from "./hooks";

const apolloClient = getSubgraphClient(SupportedChainId.Sepolia);
const provider = new JsonRpcProvider(
  `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
  "sepolia"
);

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: any }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
const waitMS = (ms: number) => act(() => new Promise((resolve) => setTimeout(resolve, ms)));

jest.setTimeout(15_000);
describe("test", () => {
  it("useGetSubgraphStatusQuery", async () => {
    const { result: subgraphStatus } = renderHook(useGetSubgraphStatusQuery, {
      initialProps: { client: apolloClient },
      wrapper
    });
    await waitMS(1000);
    console.log(`Last subgraph update block: ${subgraphStatus.current.data?._meta?.block.number}`);
  });

  it.skip("useAllPendingWithdrawalBatchesForMarket", async () => {
    const { result: marketResult } = renderHook(useMarket, {
      initialProps: {
        chainId: SupportedChainId.Sepolia,
        address: "0xe9336021b96150e12e200fce95caed6dd05b8484",
        provider,
        enabled: true
      },
      wrapper
    });
    expect(marketResult.current.isLoadingInitial).toBe(true);
    await waitMS(1000);
    await waitFor(() => expect(marketResult.current.isLoadingInitial).toBe(false));
    expect(marketResult.current.isLoadingInitial).toBe(false);
    const market = marketResult.current.data!;
    const { result: batchResult } = renderHook(useAllPendingWithdrawalBatchesForMarket, {
      initialProps: {
        chainId: SupportedChainId.Sepolia,
        market,
        enabled: true
      },
      wrapper
    });
    expect(batchResult.current.isLoadingInitial).toBe(true);
    expect(batchResult.current.isPendingUpdate).toBe(true);
    await waitFor(() => expect(batchResult.current.isLoadingInitial).toBe(false));
    expect(batchResult.current.isLoadingInitial).toBe(false);
    await waitFor(() => expect(batchResult.current.isPendingUpdate).toBe(false));
    expect(batchResult.current.isPendingUpdate).toBe(false);

    await waitFor(() => expect(batchResult.current.isLoadingUpdate).toBe(false));
    expect(batchResult.current.isLoadingUpdate).toBe(false);
  });

  it("useAccountsWhereLenderAuthorizedOrActive", async () => {
    const { result: batchResult } = renderHook(
      () =>
        useAccountsWhereLenderAuthorizedOrActive({
          chainId: SupportedChainId.Sepolia,
          lender: "0x5F55005B15B9E00Ec52528fe672eb30f450151F5".toLowerCase(),
          provider,
          enabled: true
        }),
      {
        wrapper
      }
    );
    expect(batchResult.current.isLoadingInitial).toBe(true);
    // expect(batchResult.current.isPendingUpdate).toBe(true);
    await waitMS(1000);
    // await waitFor(() => expect(batchResult.current.isPendingUpdate).toBe(false));
    await waitMS(1000);
    // expect(batchResult.current.isPendingUpdate).toBe(false);
    // await waitFor(() => expect(batchResult.current.isLoadingInitial).toBe(false));
    expect(batchResult.current.isLoadingInitial).toBe(false);
    await waitMS(1000);

    // await waitFor(() => expect(batchResult.current.isLoadingUpdate).toBe(false));
    expect(batchResult.current.isLoadingUpdate).toBe(false);
    console.log(batchResult.current.data?.map((d) => d.market.address));
  });

  it.skip("useMarketsForBorrower", async () => {
    const { result: batchResult } = renderHook(
      () =>
        useMarketsForBorrower({
          chainId: SupportedChainId.Sepolia,
          borrower: "0x1717503EE3f56e644cf8b1058e3F83F03a71b2E1".toLowerCase(),
          provider,
          enabled: true
        }),
      {
        wrapper
      }
    );
    expect(batchResult.current.isLoadingInitial).toBe(true);
    expect(batchResult.current.isPendingUpdate).toBe(true);
    await waitMS(1000);
    await waitFor(() => expect(batchResult.current.isPendingUpdate).toBe(false));
    await waitMS(1000);
    expect(batchResult.current.isPendingUpdate).toBe(false);
    await waitFor(() => expect(batchResult.current.isLoadingInitial).toBe(false));
    expect(batchResult.current.isLoadingInitial).toBe(false);
    await waitFor(() => expect(batchResult.current.isLoadingUpdate).toBe(false));
    expect(batchResult.current.isLoadingUpdate).toBe(false);
    console.log(`Markets for borrower: ${batchResult.current.data?.length}`);
    console.log(`First market deposits: ${batchResult.current.data?.[0]?.depositRecords?.length}`);
    for (const deposit of batchResult.current.data?.[0]?.depositRecords ?? []) {
      console.log(
        `Deposit: ${deposit.transactionHash} | ${deposit.amount.format(2, true)} | ${
          deposit.blockTimestamp
        }`
      );
    }
  });
});

import { useQuery } from "@tanstack/react-query";
import { Market } from "../market";
import { SignerOrProvider } from "../types";

export function useMarket({ address, provider }: { provider: SignerOrProvider; address: string }): {
  data: Market | undefined;
  isLoading: boolean;
} {
  return useQuery({
    queryKey: ["getMarket", address],
    queryFn: () => {
      return Market.getMarket(address, provider);
    },
    enabled: !!address,
    refetchOnMount: false
  });
}

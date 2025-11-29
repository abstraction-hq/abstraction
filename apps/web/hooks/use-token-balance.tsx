import useSWR from "swr";
import { Address } from "viem";

const BUNGEE_API_BASE_URL = "https://public-backend.bungee.exchange";

export enum TokenType {
  ERC20 = "ERC20",
  ERC721 = "ERC721",
  ERC1155 = "ERC1155",
}

export type TokenBalance = {
  address: Address
  type: TokenType
  balance?: bigint
  tokenId?: bigint
  balanceInUsd?: number
  decimals: number
  name: string
  symbol: string
  logoURI?: string
}

const fetchTokenBalances = async (address: Address): Promise<TokenBalance[]> => {
  const url = `${BUNGEE_API_BASE_URL}/api/v1/tokens/list`;
  const params = {
    userAddress: address,
    chainIds: "1"
  };

  const queryParams = new URLSearchParams(params as Record<string, string>).toString();
  const response = await fetch(`${url}?${queryParams}`);
  const { result } = await response.json();

  const balances: TokenBalance[] = result["1"]
    .filter((token: any) => token.balance != "0")
    .map((token: any) => ({
      address: token.address as Address,
      type: TokenType.ERC20,
      balance: BigInt(token.balance),
      balanceInUsd: parseFloat(token.balanceInUsd),
      decimals: token.decimals,
      name: token.name,
      symbol: token.symbol,
      logoURI: token.logoURI,
    }));

  return balances;
};

export const useTokenBalances = (address: Address | undefined) => {
  address = "0x4fff0f708c768a46050f9b96c46c265729d1a62f"
  const { data, error, isLoading, mutate } = useSWR(
    address ? `token-balances-${address}` : null,
    () => fetchTokenBalances(address!),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    balances: data || [],
    isLoading,
    error,
    refetch: mutate,
  };
};

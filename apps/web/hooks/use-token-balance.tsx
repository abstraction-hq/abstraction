import { useCallback, useEffect } from "react";
import { Address, zeroAddress } from "viem";
import { create } from "zustand";

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

export type TokenBalanceStore = {
  balances: TokenBalance[];
  loading: boolean;
  setBalances: (balances: TokenBalance[]) => void;
}

export const useTokenBalanceStore = create<TokenBalanceStore>()(
  (set) => ({
    balances: [],
    loading: true,
    setBalances: (balances: TokenBalance[]) => set({ balances }),
  })
)

export const useTokenBalances = (address: Address | undefined) => {
  const setBalances = useTokenBalanceStore(s => s.setBalances);
  const balances = useTokenBalanceStore(s => s.balances);
  const loading = useTokenBalanceStore(s => s.loading);

  const fetchBalances = useCallback(async () => {
    const url = `${BUNGEE_API_BASE_URL}/api/v1/tokens/list`;
    const params = {
      userAddress: address,
      // cover many chains; you can fine-tune
      chainIds: "1"
    };

    const queryParams = new URLSearchParams(params as Record<string, string>).toString();
    const response = await fetch(`${url}?${queryParams}`);
    const { result } = await response.json();

    const balances: TokenBalance[] = result["1"].filter((token: any) => token.balance != "0").map((token: any) => ({
      address: token.address as Address,
      type: TokenType.ERC20,
      balance: BigInt(token.balance),
      balanceInUsd: parseFloat(token.balanceInUsd),
      decimals: token.decimals,
      name: token.name,
      symbol: token.symbol,
      logoURI: token.logoURI,
    }))

    setBalances(balances);
  }, [address, setBalances]);

  useEffect(() => {
    if (!address) return
    fetchBalances()
  }, [address, fetchBalances]);


  const fetchBalance = (address: Address) => {
  }

  return {
    balances,
    loading,
    fetchBalances,
    fetchBalance,
  }
}

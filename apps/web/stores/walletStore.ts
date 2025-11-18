import { Address } from "viem";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface IWallet {
  address: Address;
  x: string;
  y: string;
  passkeyCredentialId: string;
}

interface IWalletStore {
  wallet: IWallet | null;
  loading: boolean;
  setWallet: (wallet: IWallet) => void;
  clearWallet: () => void;
}

export const useWalletStore = create<IWalletStore>()(
  persist(
    (set) => ({
      wallet: null,
      loading: true,
      setWallet: (wallet: IWallet) => set({ wallet }),
      clearWallet: () => set({ wallet: null }),
    }),
    {
      name: "wallet-storage",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: (
        _: IWalletStore // eslint-disable-line @typescript-eslint/no-unused-vars
      ) => {
        return (state: IWalletStore | undefined, error: unknown) => {
          if (error) {
            console.log(state)
            console.error("Failed to rehydrate state", error);
          }

          if (state) {
            state.loading = false
          }
        }
      },

    }
  )
);

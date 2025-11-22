import { Hex } from "viem";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ICredential = {
  id: string;
  publicKey: Hex;
}

interface ICredentialStore {
  credential: ICredential | null;
  loading: boolean;
  setCredential: (cred: ICredential | null) => void;
}

export const useCredentialStore = create<ICredentialStore>()(
  persist(
    (set) => ({
      credential: null,
      loading: true,
      setCredential: (cred: ICredential | null) => set({ credential: cred }),
    }),
    {
      name: "credential-storage",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: (
        _: ICredentialStore // eslint-disable-line @typescript-eslint/no-unused-vars
      ) => {
        return (state: ICredentialStore | undefined, error: unknown) => {
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

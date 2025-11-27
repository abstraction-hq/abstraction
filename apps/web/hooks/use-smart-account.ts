import { useCallback, useEffect, useState } from "react"
import { Address, Call, createPublicClient, hashMessage, Hex, http, PublicClient } from "viem"
import { BundlerClient, createBundlerClient, createWebAuthnCredential, SmartAccount, toWebAuthnAccount } from "viem/account-abstraction"
import { ICredential, useCredentialStore } from "../stores/use-credential-store"
import { getChain } from "@openpass/utils";
import { PublicKey, serializePublicKey, toAbstractionSmartAccount, WalletAbi } from "@openpass/onchain"
import { WebAuthnP256 } from "ox"
import { readContract } from "viem/actions"
import { create } from "zustand"

type Config = {
  account: SmartAccount,
  client: PublicClient,
  bundlerClient: BundlerClient
}

const initConfig = async (credential: ICredential): Promise<Config> => {
  const chain: any = getChain()
  const client = createPublicClient({
    chain,
    transport: http()
  })

  const signer = toWebAuthnAccount({
    credential,
  })

  const abstractionSmartAccount = await toAbstractionSmartAccount({
    client: client as any,
    signer: signer as any,
    keyId: hashMessage(credential.id),
  })

  const bundlerClient = createBundlerClient({
    account: abstractionSmartAccount as any,
    client: client as any,
    transport: http("https://api.candide.dev/public/v3/84532"),
  })

  return {
    account: abstractionSmartAccount as any,
    client: client as any,
    bundlerClient: bundlerClient as any
  }
}

type ConfigStore = {
  config: Config | null;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setConfig: (config: Config | null) => void;
}

const useConfigStore = create<ConfigStore>()(
  (set) => ({
    config: null,
    loading: true,
    setConfig: (config: Config | null) => set({ config }),
    setLoading: (loading: boolean) => set({ loading }),
  })
)

export const useSmartAccount = () => {
  const credential = useCredentialStore(s => s.credential)
  const setCredential = useCredentialStore(s => s.setCredential)
  const loading = useCredentialStore(s => s.loading)
  const config = useConfigStore(s => s.config)
  const configLoading = useConfigStore(s => s.loading)
  const setConfigLoading = useConfigStore(s => s.setLoading)
  const setConfig = useConfigStore(s => s.setConfig)

  useEffect(() => {
    if (!loading && credential && !config) {
      initConfig(credential).then((cfg) => {
        setConfig(cfg)
      }).finally(() => setConfigLoading(false))
    } else if (!loading && !credential) {
      setConfigLoading(false)
    }
  }, [credential, loading])

  const createSmartAccount = useCallback(async (name: string) => {
    const credential: ICredential = await createWebAuthnCredential({
      name
    })
    setCredential(credential)
  }, [setCredential])


  const loginSmartAccount = useCallback(async () => {
    const res = await WebAuthnP256.sign({
      challenge: "0x1",
    })
    const walletId = hashMessage(res.raw.id)
    
    // Call backend API to get wallet by keyId
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${apiUrl}/wallets/by-key/${walletId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Wallet not found");
      }
      throw new Error("Failed to fetch wallet data");
    }
    
    const data = await response.json();
    
    // Check if the keyId is the main key
    if (!data.keyStatus?.isMainKey) {
      throw new Error("This key is not authorized for this wallet");
    }
    
    const walletAddress = data.wallet.address as Address;
    
    // Get the signer public key from the wallet contract
    const chain: any = getChain()
    const client = createPublicClient({
      chain,
      transport: http()
    })

    const signerKey = await readContract(client, {
      abi: WalletAbi,
      address: walletAddress,
      functionName: "getSigner",
      args: [],
    }) as [bigint, bigint]

    const publicKey: PublicKey = {
      x: signerKey[0],
      y: signerKey[1],
    }

    const credential: ICredential = {
      id: res.raw.id,
      publicKey: serializePublicKey(publicKey),
    }
    setCredential(credential)
  }, [setCredential])

  const estimateTransaction = useCallback(async (calls: Call[]) => {
    if (!config) {
      throw new Error("Smart account not initialized")
    }

    const estimation = await config.bundlerClient.estimateUserOperationGas({
      calls
    })
    return estimation
  }, [config])

  const sendTransaction = useCallback(async (calls: Call[], maxFeePerGas?: bigint, maxPriorityFeePerGas?: bigint): Promise<Hex> => {
    if (!config) {
      throw new Error("Smart account not initialized")
    }

    const hash = await config.bundlerClient.sendUserOperation({
      calls,
      maxFeePerGas,
      maxPriorityFeePerGas
    })

    return hash
  }, [config])

  const logout = useCallback(() => {
    setCredential(null)
    setConfig(null)
    // Note: SWR cache will be automatically cleared when credential/config changes
    // since the cache key depends on the wallet address
  }, [setCredential, setConfig])

  return {
    createSmartAccount,
    loginSmartAccount,
    loading: loading || configLoading,
    config,
    logout
  }
}

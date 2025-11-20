import { useCallback, useEffect, useState } from "react"
import { Address, Call, createPublicClient, hashMessage, Hex, http, PublicClient, zeroAddress } from "viem"
import { BundlerClient, createBundlerClient, createWebAuthnCredential, SmartAccount, toWebAuthnAccount } from "viem/account-abstraction"
import { ICredential, useCredentialStore } from "../stores/useCredentialStore"
import { baseSepolia } from "viem/chains"
import { FactoryAbi, factoryAddress, PublicKey, serializePublicKey, toAbstractionSmartAccount, WalletAbi } from "@abstraction/onchain"
import { WebAuthnP256 } from "ox"
import { readContract } from "viem/actions"

type Config = {
  account: SmartAccount,
  client: PublicClient,
  bundlerClient: BundlerClient
}

const initConfig = async (credential: ICredential): Promise<Config> => {
  const client = createPublicClient({
    chain: baseSepolia,
    transport: http()
  }) as PublicClient

  const signer = toWebAuthnAccount({
    credential,
  })

  const abstractionSmartAccount = await toAbstractionSmartAccount({
    client,
    signer,
    keyId: hashMessage(credential.id),
  })

  const bundlerClient = createBundlerClient({
    account: abstractionSmartAccount,
    client,
    transport: http("https://api.candide.dev/public/v3/84532"),
  })

  return {
    account: abstractionSmartAccount,
    client,
    bundlerClient
  }
}

const useSmartAccount = () => {
  const { credential, loading, setCredential } = useCredentialStore()
  const [configLoading , setConfigLoading] = useState<boolean>(true)
  const [config, setConfig] = useState<Config | null>(null)

  useEffect(() => {
    if (!loading && credential) {
      setConfigLoading(true)
      initConfig(credential).then((cfg) => {
        setConfig(cfg)
        setConfigLoading(false)
      })
    }
  }, [loading, credential])

  const createSmartAccount = useCallback(async (name: string) => {
    const credential: ICredential = await createWebAuthnCredential({
      name
    })
    setCredential(credential)
    const cfg = await initConfig(credential)
    setConfig(cfg)
  }, [setCredential])

  const loginSmartAccount = useCallback(async () => {
    const res = await WebAuthnP256.sign({
      challenge: "0x1",
    })
    const walletId = hashMessage(res.raw.id)
    const client = createPublicClient({
      chain: baseSepolia,
      transport: http()
    }) as PublicClient

    const walletAddress = await readContract(client, {
      abi: FactoryAbi,
      address: factoryAddress,
      functionName: "wallets",
      args: [walletId],
    }) as Address

    if (walletAddress == zeroAddress) {
      throw new Error("Wallet not found")
    }

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
    const cfg = await initConfig(credential)
    setConfig(cfg)
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

  return {
    loading: loading || configLoading,
    estimateTransaction,
    sendTransaction,
    config,
    createSmartAccount,
    loginSmartAccount
  }
}

export default useSmartAccount


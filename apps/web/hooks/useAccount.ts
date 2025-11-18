import { client, parsers } from "@passwordless-id/webauthn";
import { getXYCoordinates } from "@abstraction/utils";
import { factoryAddress, walletInitCodeHash } from "@abstraction/onchain";
import { IWallet, useWalletStore } from "../stores/walletStore";
import { Address, encodePacked, getContractAddress, Hex, keccak256 } from "viem";

const useAccount = () => {
  const { loading, wallet, setWallet } = useWalletStore();

  const test = async () => {
    const salt = keccak256(encodePacked(["uint256", "uint256"], [1n, 1n]))
    const walletAddress = getContractAddress({
      opcode: "CREATE2",
      from: factoryAddress,
      salt,
      bytecodeHash: walletInitCodeHash
    })

    console.log("Test Wallet Address:", walletAddress)
  }

  const createAccount = async (username: string): Promise<Address> => {
    const challenge = Math.random().toString(36).substring(2, 15)
    const res = await client.register({
      challenge,
      user: username
    })

    const parsedData = parsers.parseRegistration(res)
    const passkey = getXYCoordinates(parsedData.credential.publicKey)

    const salt = keccak256(encodePacked(["uint256", "uint256"], [passkey.x as bigint, passkey.y as bigint]))

    const newWalletAddress = getContractAddress({
      opcode: "CREATE2",
      from: factoryAddress,
      salt,
      bytecodeHash: walletInitCodeHash
    })

    const wallet: IWallet = {
      address: newWalletAddress,
      x: passkey.x.toString(),
      y: passkey.y.toString(),
      passkeyCredentialId: parsedData.credential.id,
    }

    setWallet(wallet)
    return newWalletAddress
  }

  const login = async () => {
  }

  const signAndSendTransaction = async (): Promise<Hex> => {
    window.focus()
    if (!wallet) {
      throw new Error("No wallet found")
    }

    return "0x"
  }

  return {
    loading,
    createAccount,
    login,
    wallet,
    signAndSendTransaction,
    test,
  }
}

export default useAccount;

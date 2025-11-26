import { bytesToHex, hexToBytes, type Hex } from "viem"

export type PublicKey = {
  prefix?: number
  x: bigint
  y: bigint
}

export const parsePublicKey = (publicKey: Hex | Uint8Array): PublicKey => {
  const bytes =
    typeof publicKey === 'string' ? hexToBytes(publicKey) : publicKey
  const offset = bytes.length === 65 ? 1 : 0
  const x = bytes.slice(offset, 32 + offset)
  const y = bytes.slice(32 + offset, 64 + offset)
  return {
    prefix: bytes.length === 65 ? bytes[0] : undefined,
    x: BigInt(bytesToHex(x)),
    y: BigInt(bytesToHex(y)),
  }
}

export { getChain, getChainId, getChainName, getFactoryAddress } from "./chain-config"

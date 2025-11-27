import type { Chain } from "viem/chains";
import { mainnet, baseSepolia } from "viem/chains";

/**
 * Get the blockchain chain configuration based on the environment.
 * - Production (NODE_ENV=production): mainnet
 * - Development/Test: baseSepolia
 */
export function getChain(): Chain {
  const isProduction = process.env.NODE_ENV === "production";
  return isProduction ? mainnet : baseSepolia;
}

/**
 * Get the chain ID for the current environment.
 */
export function getChainId(): number {
  return getChain().id;
}

/**
 * Get the chain name for the current environment.
 */
export function getChainName(): string {
  return getChain().name;
}

/**
 * Get the factory contract address for the current environment.
 * Currently uses the same factory address for all chains.
 */
export function getFactoryAddress(): `0x${string}` {
  // For now, using the same factory address for all chains
  // This can be extended to support different addresses per chain if needed
  return "0xcC061936A53524b5579908B1C3CFbAb04D0610C4";
}

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

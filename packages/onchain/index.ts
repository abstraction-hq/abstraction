import type { Address, Hex } from "viem";
import FactoryAbi from "./Factory.abi.json";
import WalletAbi from "./Wallet.abi.json";

export const factoryAddress: Address = "0xF521e609e61353F3228c0682A36B0113dB1470f4"
export const walletInitCodeHash: Hex = "0x49d8491be29cd0620fff3a5e73b3717c8c260446f6fedba9f088f9beb7f0c9de"

export {
  FactoryAbi,
  WalletAbi
}


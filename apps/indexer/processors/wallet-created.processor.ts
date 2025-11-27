import { parseAbiItem } from "viem";
import mongoose from "mongoose";
import { WalletSchema } from "@openpass/database";

const Wallet = mongoose.models.Wallet || mongoose.model("Wallet", WalletSchema);

export const walletCreatedEvent = parseAbiItem('event WalletCreated(bytes32 indexed keyId, address walletAddress)');


export const processWalletCreated = async (log: any, chainId: number) => {
  const { keyId, walletAddress } = log.args;
  if (keyId && walletAddress) {
    try {
      await Wallet.create({
        address: walletAddress,
        keyId: keyId,
        chainId: chainId,
      });
      console.log(`Wallet saved to DB: ${walletAddress}`);
    } catch (err: any) {
      if (err.code !== 11000) {
        console.error("Error saving wallet:", err);
      }
    }
  }
};



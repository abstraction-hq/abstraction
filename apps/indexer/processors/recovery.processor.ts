import { parseAbiItem } from "viem";
import mongoose from "mongoose";
import { WalletSchema } from "@openpass/database";

const Wallet = mongoose.models.Wallet || mongoose.model("Wallet", WalletSchema);

export const recoverCompletedEvent = parseAbiItem('event RecoverCompleted(bytes32 indexed keyId, uint256 newX, uint256 newY)');

export const processRecoverCompleted = async (log: any, chainId: number) => {
  const { keyId } = log.args;
  if (keyId) {
    try {
      const wallet = await Wallet.findOne({ keyId, chainId });
      if (wallet) {
        console.log(`Recovery completed for wallet: ${wallet.address}`);
        // Logic to update wallet if needed (e.g. clear pendingKeyId)
      } else {
        console.log(`Recovery event for unknown wallet keyId: ${keyId}`);
      }
    } catch (err: any) {
      console.error("Error processing recovery:", err);
    }
  }
};

export const requestRecoveryEvent = parseAbiItem('event RequestRecovery(bytes32 keyId, uint256 newX, uint256 newY, uint256 timestamp)');

export const processRequestRecovery = async (log: any, chainId: number) => {
  const { keyId } = log.args;
  const walletAddress = log.address;
  
  if (keyId && walletAddress) {
    try {
      const wallet = await Wallet.findOne({ address: walletAddress, chainId });
      if (wallet) {
        wallet.pendingKeyId = keyId;
        await wallet.save();
        console.log(`Recovery requested for wallet: ${walletAddress}, pendingKeyId: ${keyId}`);
      } else {
        console.log(`RequestRecovery event for unknown wallet address: ${walletAddress}`);
      }
    } catch (err: any) {
      console.error("Error processing request recovery:", err);
    }
  }
};

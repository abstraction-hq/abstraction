import { parseAbiItem } from "viem";
import mongoose from "mongoose";
import { TransactionSchema, WalletSchema } from "@openpass/database";

const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);
const Wallet = mongoose.models.Wallet || mongoose.model("Wallet", WalletSchema);

export const userOperationEvent = parseAbiItem('event UserOperationEvent(bytes32 indexed userOpHash, address indexed sender, address indexed paymaster, uint256 nonce, bool success, uint256 actualGasCost, uint256 actualGasUsed)');

export const processUserOperation = async (log: any, chainId: number) => {
  const { userOpHash, sender, paymaster, nonce, success, actualGasCost, actualGasUsed } = log.args;
  if (userOpHash && sender) {
    try {
      const wallet = await Wallet.findOne({ address: sender, chainId });
      if (!wallet) {
        return;
      }

      await Transaction.create({
        hash: userOpHash,
        walletAddress: sender,
        chainId: chainId,
        type: "user_operation",
        metadata: {
          paymaster,
          nonce: nonce?.toString(),
          actualGasCost: actualGasCost?.toString(),
          actualGasUsed: actualGasUsed?.toString(),
        },
        status: success ? "success" : "failed",
        value: "0",
        timestamp: new Date(),
      });
      console.log(`Transaction (UserOp) saved: ${userOpHash}`);
    } catch (err: any) {
      if (err.code !== 11000) {
        console.error("Error saving transaction:", err);
      }
    }
  }
};

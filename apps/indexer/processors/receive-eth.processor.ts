import { parseAbiItem, zeroAddress } from "viem";
import mongoose from "mongoose";
import { PositionSchema, WalletSchema } from "@openpass/database";

const Position = mongoose.models.Position || mongoose.model("Position", PositionSchema);
const Wallet = mongoose.models.Wallet || mongoose.model("Wallet", WalletSchema);

export const receiveEthEvent = parseAbiItem('event ReceiveETH(address sender, uint256 amount)');

const ETH_ADDRESS = zeroAddress;

export const processReceiveEth = async (log: any, chainId: number) => {
  const { sender, amount } = log.args;
  const walletAddress = log.address; // Emitted by the wallet itself

  if (sender && amount && walletAddress) {
    try {
      // Check if wallet exists
      const wallet = await Wallet.findOne({ address: walletAddress, chainId });
      if (!wallet) {
        // console.log(`ReceiveETH event for unknown wallet: ${walletAddress}`);
        return;
      }

      await updateEthPosition(walletAddress, amount, chainId);
    } catch (err: any) {
      console.error("Error processing ReceiveETH:", err);
    }
  }
};

async function updateEthPosition(
  walletAddress: string,
  amount: bigint,
  chainId: number
) {
  let position = await Position.findOne({ walletAddress, tokenAddress: ETH_ADDRESS, chainId });

  if (!position) {
    position = new Position({
      walletAddress,
      tokenAddress: ETH_ADDRESS,
      chainId,
      balance: "0",
      averageBuyPrice: 0,
      realizedPnl: 0,
    });
  }

  const currentBalance = BigInt(position.balance);
  const newBalance = currentBalance + amount;

  position.balance = newBalance.toString();
  await position.save();
  console.log(`Updated ETH position for ${walletAddress}: +${amount} = ${newBalance}`);
}

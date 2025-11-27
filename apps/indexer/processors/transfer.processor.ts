import { parseAbiItem, type PublicClient, formatUnits } from "viem";
import mongoose from "mongoose";
import { PositionSchema, WalletSchema, type Wallet } from "@openpass/database";

const Position = mongoose.models.Position || mongoose.model("Position", PositionSchema);
const Wallet = mongoose.models.Wallet || mongoose.model("Wallet", WalletSchema);

export const processTransfers = async (
  client: PublicClient,
  fromBlock: bigint,
  toBlock: bigint,
  chainId: number
) => {
  const BATCH_SIZE = 50;
  let batch: `0x${string}`[] = [];
  
  // Use cursor to stream wallets
  const cursor = Wallet.find({ chainId }).select("address").cursor();

  for await (const wallet of cursor) {
    batch.push(wallet.address.toLowerCase() as `0x${string}`);

    if (batch.length >= BATCH_SIZE) {
      await processBatch(client, batch, fromBlock, toBlock, chainId);
      batch = []; // Reset batch
    }
  }

  // Process remaining items
  if (batch.length > 0) {
    await processBatch(client, batch, fromBlock, toBlock, chainId);
  }
};

const processBatch = async (
  client: PublicClient,
  batch: `0x${string}`[],
  fromBlock: bigint,
  toBlock: bigint,
  chainId: number
) => {
  console.log(`Processing batch of ${batch.length} wallets...`);
  
  // Fetch 'Incoming' transfers (to == tracked)
  const incomingLogs = await client.getLogs({
    event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)'),
    args: {
      to: batch
    },
    fromBlock,
    toBlock,
  });

  // Fetch 'Outgoing' transfers (from == tracked)
  const outgoingLogs = await client.getLogs({
    event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 value)'),
    args: {
      from: batch
    },
    fromBlock,
    toBlock,
  });

  const allLogs = [...incomingLogs, ...outgoingLogs];
  const trackedSet = new Set(batch);

  for (const log of allLogs) {
    const { from, to, value } = log.args;
    const tokenAddress = log.address;

    if (!from || !to || !value) continue;

    // Update Position for 'to' (Receiver)
    if (trackedSet.has(to.toLowerCase() as `0x${string}`)) {
      await updatePosition(to, tokenAddress, value, true, chainId);
    }

    // Update Position for 'from' (Sender)
    if (trackedSet.has(from.toLowerCase() as `0x${string}`)) {
      await updatePosition(from, tokenAddress, value, false, chainId);
    }
  }
};

async function updatePosition(
  walletAddress: string, 
  tokenAddress: string, 
  amount: bigint, 
  isIncoming: boolean,
  chainId: number
) {
  let position = await Position.findOne({ walletAddress, tokenAddress, chainId });
  
  if (!position) {
    position = new Position({
      walletAddress,
      tokenAddress,
      chainId,
      balance: "0",
      averageBuyPrice: 0,
      realizedPnl: 0,
    });
  }

  const currentBalance = BigInt(position.balance);
  const newBalance = isIncoming ? currentBalance + amount : currentBalance - amount;
  
  position.balance = newBalance.toString();
  await position.save();
  console.log(`Updated position for ${walletAddress}: ${tokenAddress} = ${newBalance}`);
}

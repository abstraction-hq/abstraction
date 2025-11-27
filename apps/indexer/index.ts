import { createPublicClient, http, type Chain, type PublicClient } from "viem";
import { getChain } from "@openpass/utils";
import mongoose from "mongoose";
import { WalletSchema, IndexerStateSchema } from "@openpass/database";
import "dotenv/config";
import { processWalletCreated, walletCreatedEvent } from "./processors/wallet-created.processor";
import { processRecoverCompleted, recoverCompletedEvent, processRequestRecovery, requestRecoveryEvent } from "./processors/recovery.processor";
import { processReceiveEth, receiveEthEvent } from "./processors/receive-eth.processor";
import { processUserOperation, userOperationEvent } from "./processors/user-op.processor";
import { processTransfers } from "./processors/transfer.processor";

const Wallet = mongoose.models.Wallet || mongoose.model("Wallet", WalletSchema);
const IndexerState = mongoose.models.IndexerState || mongoose.model("IndexerState", IndexerStateSchema);

class Indexer {
  client: PublicClient;
  chainId: number;
  isProcessing: boolean = false;
  
  constructor(chain: Chain) {
    this.client = createPublicClient({
      chain: chain,
      transport: http(),
    });
    this.chainId = chain.id;
    console.log(`Indexer initialized for chain: ${chain.name} (${this.chainId})`);
  }

  init = async () => {
    try {
      const dbUri = process.env.DATABASE_URI || "mongodb://localhost:27017/abstraction";
      await mongoose.connect(dbUri);
      console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      process.exit(1);
    }
  }

  start = async () => {
    console.log("Indexer started polling every 2 seconds...");
    
    setInterval(async () => {
      if (this.isProcessing) return;
      this.isProcessing = true;
      try {
        await this.crawl();
      } catch (error) {
        console.error("Error during crawl:", error);
      } finally {
        this.isProcessing = false;
      }
    }, 2000);
  }

  crawl = async () => {
    const factoryAddress = process.env.FACTORY_ADDRESS as `0x${string}`;
    const entryPointAddress = process.env.ENTRYPOINT_ADDRESS as `0x${string}`;
    
    if (!factoryAddress) {
      console.error("FACTORY_ADDRESS env variable is not set");
      return;
    }

    // Get last crawled block
    let state = await IndexerState.findOne({ chainId: this.chainId });
    if (!state) {
      state = await IndexerState.create({ chainId: this.chainId, lastCrawledBlock: 0 });
      const currentBlock = await this.client.getBlockNumber();
      state.lastCrawledBlock = Number(currentBlock) - 1;
      await state.save();
      console.log(`Initialized IndexerState to block ${state.lastCrawledBlock}`);
    }

    const lastCrawledBlock = BigInt(state.lastCrawledBlock);
    const currentBlock = await this.client.getBlockNumber();

    if (lastCrawledBlock >= currentBlock) {
      return;
    }

    const fromBlock = lastCrawledBlock + 1n;
    const maxRange = 100n;
    let toBlock = currentBlock;
    if (toBlock - fromBlock > maxRange) {
      toBlock = fromBlock + maxRange;
    }

    console.log(`Crawling blocks ${fromBlock} to ${toBlock}...`);

    try {
      // 1. Fetch Combined Logs (WalletCreated + UserOperationEvent + RecoverCompleted)
      // Note: We can only combine if we pass multiple events.
      // Viem getLogs supports 'events' array.
      
      const events: any[] = [walletCreatedEvent, recoverCompletedEvent, requestRecoveryEvent, receiveEthEvent];
      if (entryPointAddress) {
        events.push(userOperationEvent as any);
      }

      const logs = await this.client.getLogs({
        events: events,
        fromBlock: fromBlock,
        toBlock: toBlock,
      });

      for (const log of logs) {
        if (log.eventName === 'WalletCreated') {
          await processWalletCreated(log, this.chainId);
        } else if (log.eventName === 'UserOperationEvent') {
          await processUserOperation(log, this.chainId, entryPointAddress);
        } else if (log.eventName === 'RecoverCompleted') {
          await processRecoverCompleted(log, this.chainId);
        } else if (log.eventName === 'RequestRecovery') {
          await processRequestRecovery(log, this.chainId);
        } else if (log.eventName === 'ReceiveETH') {
          await processReceiveEth(log, this.chainId);
        }
      }

      // 2. Process Transfers (Separate due to specific filtering)
      await processTransfers(this.client, fromBlock, toBlock, this.chainId);

      state.lastCrawledBlock = Number(toBlock);
      await state.save();
      console.log(`Updated lastCrawledBlock to ${toBlock}`);

    } catch (error) {
      console.error("Error processing blocks:", error);
    }
  }
}

const main = async () => {
  const indexer = new Indexer(getChain());
  await indexer.init();
  await indexer.start();
  
  // Keep process alive
  process.stdin.resume();
}

main().catch((error) => {
  console.error("Indexer failed:", error);
  process.exit(1);
})

import { Schema, Document } from "mongoose";
import type { Address, Hex } from "viem";

export interface Transaction extends Document {
  hash: Hex;
  walletAddress: Address;
  chainId: number;
  type: string;
  metadata: any;
  status: "pending" | "success" | "failed";
  timestamp: Date;
  value: string;
  to: Address;
  from: Address;
}

export const TransactionSchema = new Schema<Transaction>({
  hash: { type: String, required: true, unique: true },
  walletAddress: { type: String, required: true },
  chainId: { type: Number, required: true },
  type: { type: String, required: true },
  metadata: { type: Schema.Types.Mixed, required: false },
  status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
  timestamp: { type: Date, default: Date.now },
  value: { type: String, required: true },
  to: { type: String, required: false },
  from: { type: String, required: false },
});

TransactionSchema.index({ walletAddress: 1 });
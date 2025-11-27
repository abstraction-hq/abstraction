import { Hono } from 'hono';
import { cors } from 'hono/cors';
import mongoose, { Model } from 'mongoose';
import type { 
  Wallet as WalletType,
  Transaction as TransactionType,
  Position as PositionType,
} from '@openpass/database';
import { 
  WalletSchema, 
  TransactionSchema, 
  PositionSchema 
} from '@openpass/database';
import 'dotenv/config';

const Wallet = (mongoose.models.Wallet || mongoose.model('Wallet', WalletSchema)) as Model<WalletType>;
const Transaction = (mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema)) as Model<TransactionType>;
const Position = (mongoose.models.Position || mongoose.model('Position', PositionSchema)) as Model<PositionType>;

const app = new Hono();

// Enable CORS for all routes
app.use('/*', cors());

// Health check
app.get('/', (c) => {
  return c.json({ message: 'Abstraction API' });
});

// Get wallet details
app.get('/wallets/:address', async (c) => {
  try {
    const address = c.req.param('address');
    const wallet = await Wallet.findOne({ address: address.toLowerCase() });
    
    if (!wallet) {
      return c.json({ error: 'Wallet not found' }, 404);
    }
    
    return c.json(wallet);
  } catch (error) {
    console.error('Error fetching wallet:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get wallet by keyId
app.get('/wallets/by-key/:keyId', async (c) => {
  try {
    const keyId = c.req.param('keyId').toLowerCase();
    
    // Search for wallet where keyId matches either main keyId or pendingKeyId
    const wallet = await Wallet.findOne({
      $or: [
        { keyId: keyId },
        { pendingKeyId: keyId }
      ]
    });
    
    if (!wallet) {
      return c.json({ error: 'Wallet not found for the provided keyId' }, 404);
    }
    
    // Determine if this is the main keyId or pending keyId
    const isMainKey = wallet.keyId.toLowerCase() === keyId;
    const isPendingKey = wallet.pendingKeyId?.toLowerCase() === keyId;
    
    return c.json({
      wallet,
      keyStatus: {
        isMainKey,
        isPendingKey,
        keyType: isMainKey ? 'main' : 'pending'
      }
    });
  } catch (error) {
    console.error('Error fetching wallet by keyId:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get wallet transactions
app.get('/wallets/:address/transactions', async (c) => {
  try {
    const address = c.req.param('address');
    const limit = parseInt(c.req.query('limit') || '50');
    const offset = parseInt(c.req.query('offset') || '0');
    
    const transactions = await Transaction.find({ 
      walletAddress: address.toLowerCase() 
    })
      .sort({ timestamp: -1 })
      .skip(offset)
      .limit(limit);
    
    const total = await Transaction.countDocuments({ 
      walletAddress: address.toLowerCase() 
    });
    
    return c.json({
      transactions,
      total,
      limit,
      offset
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get wallet positions
app.get('/wallets/:address/positions', async (c) => {
  try {
    const address = c.req.param('address');
    
    const positions = await Position.find({ 
      walletAddress: address.toLowerCase() 
    });
    
    return c.json({ positions });
  } catch (error) {
    console.error('Error fetching positions:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get stats
app.get('/stats', async (c) => {
  try {
    const totalWallets = await Wallet.countDocuments();
    const totalTransactions = await Transaction.countDocuments();
    
    return c.json({
      totalWallets,
      totalTransactions
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Connect to MongoDB and start server
// const dbUri = process.env.DATABASE_URI || 'mongodb://localhost:27017/abstraction';
// await mongoose.connect(dbUri);
console.log('Connected to MongoDB');

const port = parseInt(process.env.PORT || '3000');
console.log(`API server running on http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
};

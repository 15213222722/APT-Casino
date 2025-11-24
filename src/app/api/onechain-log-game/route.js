import { NextResponse } from 'next/server';
import { Transaction } from '@mysten/sui/transactions';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { SuiClient } from '@mysten/sui/client';
import { bcs } from '@mysten/sui/bcs';

/**
 * OneChain Game Logging API
 * Signs and executes game logging transactions using treasury wallet
 * This keeps the treasury private key secure on the server
 */

// Initialize Sui client for OneChain
const suiClient = new SuiClient({
  url: process.env.NEXT_PUBLIC_ONECHAIN_RPC_URL || 'https://rpc-testnet.onelabs.cc'
});

/**
 * POST /api/onechain-log-game
 * Log game result to OneChain using treasury wallet
 * 
 * Body: {
 *   packageId: string,
 *   module: string,
 *   function: string,
 *   arguments: any[],
 *   typeArguments: string[]
 * }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { packageId, module, functionName, arguments: args, typeArguments = [] } = body;

    console.log('🎮 ONE CHAIN API: Logging game result...');
    console.log('📦 Package:', packageId);
    console.log('🔧 Function:', `${module}::${functionName}`);

    // Validate required fields
    if (!packageId || !module || !functionName || !args) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: packageId, module, functionName, arguments'
      }, { status: 400 });
    }

    // Get treasury private key from environment
    const treasuryPrivateKey = process.env.ONECHAIN_TREASURY_PRIVATE_KEY;
    if (!treasuryPrivateKey) {
      console.error('❌ ONE CHAIN API: Treasury private key not configured');
      return NextResponse.json({
        success: false,
        error: 'Treasury wallet not configured. Please set ONECHAIN_TREASURY_PRIVATE_KEY in .env'
      }, { status: 500 });
    }

    // Create keypair from private key (base64 encoded)
    // OneChain uses Ed25519 keypairs like Sui
    const keypair = Ed25519Keypair.fromSecretKey(
      Buffer.from(treasuryPrivateKey, 'base64')
    );
    const treasuryAddress = keypair.getPublicKey().toSuiAddress();
    
    console.log('🏦 Treasury address:', treasuryAddress);

    // Build transaction
    const tx = new Transaction();
    
    // Convert arguments to proper format
    const txArguments = args.map((arg, index) => {
      // Last argument is Clock object (0x6)
      if (index === args.length - 1 && arg === '0x6') {
        return tx.object(arg);
      }
      
      // First argument is player address
      if (index === 0 && typeof arg === 'string' && arg.startsWith('0x')) {
        return tx.pure(bcs.Address.serialize(arg).toBytes());
      }
      
      // For vector<u8> (byte arrays)
      if (Array.isArray(arg)) {
        return tx.pure(bcs.vector(bcs.U8).serialize(arg).toBytes());
      }
      
      // For u64 numbers (bet_amount, payout_amount)
      if (typeof arg === 'string' && /^\d+$/.test(arg)) {
        return tx.pure(bcs.U64.serialize(arg).toBytes());
      }
      
      // For other types
      return tx.pure(arg);
    });

    tx.moveCall({
      target: `${packageId}::${module}::${functionName}`,
      arguments: txArguments,
      typeArguments: typeArguments
    });

    // Set gas budget
    tx.setGasBudget(10000000); // 0.01 OCT

    console.log('🔐 ONE CHAIN API: Signing transaction with treasury...');

    // Sign and execute transaction
    const result = await suiClient.signAndExecuteTransaction({
      transaction: tx,
      signer: keypair,
      options: {
        showEffects: true,
        showEvents: true,
        showObjectChanges: true
      }
    });

    console.log('✅ ONE CHAIN API: Transaction executed:', result.digest);

    // Check if transaction was successful
    if (result.effects?.status?.status !== 'success') {
      console.error('❌ ONE CHAIN API: Transaction failed:', result.effects?.status);
      return NextResponse.json({
        success: false,
        error: 'Transaction execution failed',
        details: result.effects?.status
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      transactionDigest: result.digest,
      effects: result.effects,
      events: result.events,
      objectChanges: result.objectChanges
    });

  } catch (error) {
    console.error('❌ ONE CHAIN API: Error logging game:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

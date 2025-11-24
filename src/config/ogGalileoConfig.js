/**
 * One Chain Testnet Testnet Configuration
 * Configuration for One Chain Testnet testnet with OCT token
 */

// One Chain Testnet Chain Configuration
export const ONECHAIN_TESTNET_CONFIG = {
  chainId: 16602,
  name: 'onechain-testnet-Testnet',
  network: 'onechain-testnet-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'OCT',
    symbol: 'OCT',
  },
  rpcUrls: {
    default: {
      http: [
        process.env.NEXT_PUBLIC_0G_GALILEO_RPC || 'https://testnet-rpc.onechain.xyz',
        process.env.NEXT_PUBLIC_0G_GALILEO_RPC_FALLBACK || 'https://evm-rpc-galileo.0g.ai'
      ],
    },
    public: {
      http: [
        'https://testnet-rpc.onechain.xyz',
        'https://evm-rpc-galileo.0g.ai'
      ],
    },
  },
  blockExplorers: {
    default: {
      name: 'One Chain Testnet Explorer',
      url: process.env.NEXT_PUBLIC_0G_GALILEO_EXPLORER || 'https://testnet.onescan.com',
    },
  },
  testnet: true,
};

// One Chain Testnet Tokens
export const ONECHAIN_TESTNET_TOKENS = {
  OCT: {
    symbol: 'OCT',
    name: 'OCT token',
    decimals: 18,
    address: '0x0000000000000000000000000000000000000000',
    isNative: true,
    icon: '🔮',
    faucet: 'https://faucet.0g.ai'
  }
};

// Casino configuration for One Chain Testnet
export const ONECHAIN_TESTNET_CASINO_CONFIG = {
  // Deposit/Withdraw settings
  minDeposit: '0.001', // 0.001 OCT
  maxDeposit: '100',   // 100 OCT
  minWithdraw: '0.001', // 0.001 OCT
  maxWithdraw: '100',   // 100 OCT
  
  // Game settings (same as Arbitrum for consistency)
  games: {
    MINES: {
      minBet: '0.001',
      maxBet: '1.0',
      minMines: 1,
      maxMines: 24,
      defaultMines: 3,
      gridSize: 25
    },
    ROULETTE: {
      minBet: '0.001',
      maxBet: '1.0',
      houseEdge: 0.027
    },
    PLINKO: {
      minBet: '0.001',
      maxBet: '1.0',
      rows: [8, 12, 16],
      defaultRows: 12
    },
    WHEEL: {
      minBet: '0.001',
      maxBet: '1.0',
      segments: [2, 10, 20, 40, 50]
    }
  }
};

// Network switching helper for One Chain Testnet
export const switchToOGGalileo = async () => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask not found');
  }

  try {
    // Try to switch to One Chain Testnet
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x40da' }], // 16602 in hex
    });
  } catch (switchError) {
    // If network doesn't exist, add it
    if (switchError.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x40da',
          chainName: 'onechain-testnet-Testnet',
          nativeCurrency: {
            name: 'OCT',
            symbol: 'OCT',
            decimals: 18,
          },
          rpcUrls: ['https://testnet-rpc.onechain.xyz'],
          blockExplorerUrls: ['https://testnet.onescan.com'],
        }],
      });
    } else {
      throw switchError;
    }
  }
};

export default ONECHAIN_TESTNET_CONFIG;
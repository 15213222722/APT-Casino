// One Chain Testnet Configuration
export const oneChainTestnetConfig = {
  id: 41454,
  name: 'One Chain Testnet',
  network: 'onechain-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'OCT',
    symbol: 'OCT',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.onechain.xyz'],
    },
    public: {
      http: ['https://testnet-rpc.onechain.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'One Chain Testnet Explorer',
      url: 'https://testnet-explorer.onechain.xyz',
    },
  },
  testnet: true,
};

export const oneChainTestnetTokens = {
  OCT: {
    address: 'native',
    decimals: 18,
    symbol: 'OCT',
    name: 'One Chain',
    isNative: true,
  },
};

export default oneChainTestnetConfig;
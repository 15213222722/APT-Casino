# APT Casino - One Chain Testnet

A decentralized casino platform built on One Chain Testnet with Pyth Entropy for provably fair gaming and MetaMask Smart Accounts integration.

## 🎮 Features

- **Provably Fair Gaming**: Powered by Pyth Entropy on Arbitrum Sepolia
- **Multiple Games**: Wheel, Roulette, Plinko, and Mines
- **MetaMask Smart Accounts**: Enhanced wallet experience with batch transactions
- **OCT Token**: Native currency for One Chain Testnet
- **Real-time Gaming**: Instant deposits and withdrawals
- **Advanced Betting**: Batch transactions and automated strategies

## 🌐 Networks

- **Gaming Network**: One Chain Testnet (Chain ID: 10143)
- **Entropy Network**: Arbitrum Sepolia (Chain ID: 421614)
- **Currency**: OCT (One Chain Token)

## 🚀 Getting Started

1. **Connect Wallet**: Connect your MetaMask wallet to One Chain Testnet
2. **Get Tokens**: Get OCT tokens from the One Chain testnet faucet
3. **Deposit**: Deposit OCT to your house balance
4. **Play**: Start playing provably fair games!

### Network Configuration

Add One Chain Testnet to MetaMask:
- **Network Name**: One Chain Testnet
- **RPC URL**: `https://testnet-rpc.onechain.xyz`
- **Chain ID**: `10143`
- **Currency Symbol**: `OCT`
- **Block Explorer**: `https://testnet.onescan.com`

## 🔷 Smart Accounts

This casino supports MetaMask Smart Accounts for enhanced gaming:

### Benefits:
- **Batch Transactions**: Multiple bets in one transaction
- **Lower Gas Costs**: Optimized for frequent players
- **Advanced Strategies**: Automated betting patterns
- **Enhanced Security**: Smart contract-based accounts

### Usage:
```javascript
// Check if Smart Account is active
const { isSmartAccount, batchTransactions } = useSmartAccount();

// Execute multiple bets at once
if (isSmartAccount) {
  await batchTransactions([bet1, bet2, bet3]);
}
```

## 🎯 Games

### 1. **Wheel of Fortune**
- Classic spinning wheel game
- Multiple risk levels
- Batch betting support

### 2. **Roulette**
- European roulette with single zero
- Multiple betting options
- Smart Account batch bets

### 3. **Plinko**
- Physics-based ball drop game
- Adjustable rows and risk levels
- Auto-betting features

### 4. **Mines**
- Strategic mine-sweeping game
- Customizable mine count
- Progressive betting strategies

## 🛠 Development

### Prerequisites
- Node.js 18+
- MetaMask wallet
- One Chain Testnet OCT tokens

### Installation
```bash
# Clone the repository
git clone https://github.com/your-repo/apt-casino-onechain

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Deploy to One Chain Testnet
```bash
npm run deploy:onechain
```

## 🏗 Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │  One Chain Testnet  │    │ Arbitrum Sepolia│
│   (Next.js)     │◄──►│   (Gaming)      │    │   (Entropy)     │
│                 │    │                 │    │                 │
│ • React UI      │    │ • OCT Token     │    │ • Pyth Entropy  │
│ • Smart Accounts│    │ • Deposits      │    │ • Randomness    │
│ • Wagmi/Viem    │    │ • Withdrawals   │    │ • Proof Gen     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔐 Security

- **Provably Fair**: All randomness verified on-chain via Pyth Entropy
- **Smart Contracts**: Audited and secure contract implementations
- **Non-custodial**: Users maintain full control of their funds
- **Transparent**: All game logic and outcomes are verifiable

## 📊 Smart Account Analytics

The application tracks Smart Account usage:
- Account type detection (EOA vs Smart Account)
- Feature utilization metrics
- Gas optimization statistics
- Batch transaction success rates

## 🔗 Links

- **Live Demo**: [https://apt-casino-onechain.vercel.app](https://apt-casino-onechain.vercel.app)
- **One Chain Testnet**: [https://docs.onechain.xyz](https://docs.onechain.xyz)
- **Pyth Entropy**: [https://docs.pyth.network/entropy](https://docs.pyth.network/entropy)
- **MetaMask Smart Accounts**: [METAMASK_SMART_ACCOUNTS.md](./METAMASK_SMART_ACCOUNTS.md)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

- **Documentation**: Check the docs folder
- **Issues**: Create an issue on GitHub
- **Community**: Join our Discord server
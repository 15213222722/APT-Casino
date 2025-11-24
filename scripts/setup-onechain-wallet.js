/**
 * Setup One Chain Wallet for Casino Operations
 * 
 * This script:
 * 1. Creates a new wallet for One Chain testnet
 * 2. Saves the wallet credentials securely
 * 3. Provides instructions for getting test OCT from faucet
 * 4. This wallet will be used for:
 *    - Game result logging (backend operations)
 *    - Withdraw/Deposit operations
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const crypto = require('crypto');

async function setupWallet() {
  console.log('🔐 Setting up One Chain Wallet for Casino Operations\n');
  console.log('=' .repeat(60));

  try {
    // Check if Sui CLI is installed
    console.log('\n📋 Step 1: Checking Sui CLI installation...');
    try {
      const version = execSync('sui --version', { encoding: 'utf-8' });
      console.log(`✅ Sui CLI installed: ${version.trim()}`);
    } catch (error) {
      console.error('❌ Sui CLI not found!');
      console.error('\n💡 Please install Sui CLI first:');
      console.error('   https://docs.sui.io/build/install');
      console.error('\n   Or use: cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui\n');
      process.exit(1);
    }

    // Create new wallet
    console.log('\n📋 Step 2: Creating new wallet...');
    let walletOutput;
    try {
      walletOutput = execSync('sui client new-address ed25519', { encoding: 'utf-8' });
      console.log(walletOutput);
    } catch (error) {
      console.error('❌ Failed to create wallet');
      throw error;
    }

    // Parse wallet info (try multiple formats)
    let addressMatch = walletOutput.match(/│ address\s+│\s+(0x[a-fA-F0-9]+)/);
    if (!addressMatch) {
      addressMatch = walletOutput.match(/Address: (0x[a-fA-F0-9]+)/);
    }
    
    let mnemonicMatch = walletOutput.match(/│ recoveryPhrase\s+│\s+(.+?)\s+│/);
    if (!mnemonicMatch) {
      mnemonicMatch = walletOutput.match(/Secret Recovery Phrase : \[(.*?)\]/);
    }
    
    if (!addressMatch) {
      console.error('❌ Could not parse wallet address');
      console.log('\n📋 Please check the output above and manually save the address\n');
      
      // Try to extract manually from output
      const manualMatch = walletOutput.match(/0x[a-fA-F0-9]{64}/);
      if (manualMatch) {
        console.log(`\n💡 Found address: ${manualMatch[0]}`);
        console.log('   Please add this to your .env file manually as:');
        console.log(`   ONECHAIN_CASINO_WALLET_ADDRESS=${manualMatch[0]}\n`);
      }
      return;
    }

    const address = addressMatch[1];
    const mnemonic = mnemonicMatch ? mnemonicMatch[1].trim() : 'NOT_FOUND';

    console.log('\n✅ Wallet created successfully!');
    console.log(`📍 Address: ${address}\n`);

    // Save wallet info to .env
    console.log('📋 Step 3: Saving wallet configuration...');
    const envPath = path.join(__dirname, '../.env');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf-8');
    }

    // Add wallet configuration
    const walletConfig = `
# One Chain Casino Wallet (for game logging and operations)
ONECHAIN_CASINO_WALLET_ADDRESS=${address}
# IMPORTANT: Keep the private key/mnemonic secure!
# The mnemonic is stored in Sui keystore at: ~/.sui/sui_config/sui.keystore
`;

    if (envContent.includes('ONECHAIN_CASINO_WALLET_ADDRESS=')) {
      envContent = envContent.replace(
        /ONECHAIN_CASINO_WALLET_ADDRESS=.*/,
        `ONECHAIN_CASINO_WALLET_ADDRESS=${address}`
      );
    } else {
      envContent += walletConfig;
    }

    fs.writeFileSync(envPath, envContent);
    console.log('✅ Wallet address saved to .env\n');

    // Save wallet info to a secure file
    const walletInfo = {
      address,
      network: 'onechain-testnet',
      createdAt: new Date().toISOString(),
      purpose: 'Casino game logging and operations',
      keystoreLocation: '~/.sui/sui_config/sui.keystore',
      note: 'Private keys are stored in Sui keystore. Keep them secure!'
    };

    const walletDir = path.join(__dirname, '../.wallet-info');
    if (!fs.existsSync(walletDir)) {
      fs.mkdirSync(walletDir, { recursive: true });
    }

    const walletFile = path.join(walletDir, 'onechain-casino-wallet.json');
    fs.writeFileSync(walletFile, JSON.stringify(walletInfo, null, 2));
    console.log(`✅ Wallet info saved to: ${walletFile}\n`);

    // Add to .gitignore
    const gitignorePath = path.join(__dirname, '../.gitignore');
    let gitignoreContent = '';
    if (fs.existsSync(gitignorePath)) {
      gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
    }
    
    if (!gitignoreContent.includes('.wallet-info')) {
      gitignoreContent += '\n# Wallet information\n.wallet-info/\n';
      fs.writeFileSync(gitignorePath, gitignoreContent);
      console.log('✅ Added .wallet-info to .gitignore\n');
    }

    // Configure One Chain testnet
    console.log('📋 Step 4: Configuring One Chain testnet...');
    console.log('\n⚠️  Manual configuration required:');
    console.log('\n   Run the following commands:\n');
    console.log('   1. Add One Chain testnet to Sui CLI:');
    console.log('      sui client new-env --alias onechain-testnet --rpc https://rpc-testnet.onelabs.cc:443\n');
    console.log('   2. Switch to One Chain testnet:');
    console.log('      sui client switch --env onechain-testnet\n');
    console.log('   3. Verify active address:');
    console.log('      sui client active-address\n');

    // Faucet instructions
    console.log('\n📋 Step 5: Get test OCT tokens from faucet\n');
    console.log('=' .repeat(60));
    console.log('\n🚰 Faucet URL: https://faucet-testnet.onelabs.cc\n');
    console.log('📍 Your wallet address:');
    console.log(`   ${address}\n`);
    console.log('💡 Instructions:');
    console.log('   1. Visit the faucet URL above');
    console.log('   2. Paste your wallet address');
    console.log('   3. Request test OCT tokens');
    console.log('   4. Wait for confirmation (usually takes 1-2 minutes)\n');
    console.log('🔍 Check balance with:');
    console.log('   sui client gas\n');
    console.log('=' .repeat(60));

    // Next steps
    console.log('\n📝 Next Steps:\n');
    console.log('1. ✅ Wallet created and saved');
    console.log('2. ⏳ Configure One Chain testnet (see commands above)');
    console.log('3. ⏳ Get test OCT from faucet');
    console.log('4. ⏳ Deploy game logger contract: npm run deploy:game-logger');
    console.log('5. ⏳ Test the setup\n');

    console.log('🎉 Wallet setup complete!\n');
    console.log('⚠️  IMPORTANT SECURITY NOTES:');
    console.log('   - Private keys are stored in: ~/.sui/sui_config/sui.keystore');
    console.log('   - NEVER share your private keys or mnemonic');
    console.log('   - NEVER commit wallet files to git');
    console.log('   - Keep backups of your keystore file\n');

    console.log('📚 Useful Commands:\n');
    console.log('   Check balance:     sui client gas');
    console.log('   View address:      sui client active-address');
    console.log('   List addresses:    sui client addresses');
    console.log('   Switch address:    sui client switch --address <ADDRESS>');
    console.log('   View objects:      sui client objects\n');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Ensure Sui CLI is installed');
    console.error('   2. Check network connectivity');
    console.error('   3. Try running the commands manually\n');
    process.exit(1);
  }
}

// Run setup
setupWallet().catch(console.error);

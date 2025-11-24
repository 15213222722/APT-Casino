/**
 * One Chain Testnet: Request Faucet Tokens and Deploy Contract
 * 
 * This script:
 * 1. Requests OCT tokens from the faucet
 * 2. Checks balance
 * 3. Deploys the game logger contract
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const WALLET_ADDRESS = process.env.ONECHAIN_CASINO_WALLET_ADDRESS;
const FAUCET_URL = process.env.NEXT_PUBLIC_ONECHAIN_FAUCET_URL || 'https://faucet-testnet.onelabs.cc';

console.log('🎮 One Chain Casino Setup\n');
console.log('=' .repeat(60));

async function checkBalance() {
  console.log('\n💰 Checking current balance...');
  try {
    const output = execSync('sui client gas', { encoding: 'utf-8' });
    console.log(output);
    return true;
  } catch (error) {
    console.error('❌ Failed to check balance:', error.message);
    return false;
  }
}

async function requestFaucetTokens() {
  console.log('\n🚰 Requesting tokens from faucet...');
  console.log(`   Wallet: ${WALLET_ADDRESS}`);
  console.log(`   Faucet: ${FAUCET_URL}\n`);

  try {
    // Use Sui CLI to request tokens
    const output = execSync('sui client faucet', { encoding: 'utf-8' });
    console.log(output);
    
    if (output.includes('Request successful') || output.includes('Transfer successful')) {
      console.log('✅ Faucet request successful!');
      return true;
    } else {
      console.log('⚠️  Faucet request may have failed. Check output above.');
      return false;
    }
  } catch (error) {
    console.error('❌ Faucet request failed:', error.message);
    console.log('\n💡 Manual faucet request:');
    console.log(`   1. Visit: ${FAUCET_URL}`);
    console.log(`   2. Enter wallet address: ${WALLET_ADDRESS}`);
    console.log(`   3. Request tokens\n`);
    return false;
  }
}

async function deployGameLogger() {
  console.log('\n🚀 Deploying Game Logger Contract...\n');

  try {
    // Check if Move.toml exists
    const moveTomlPath = path.join(__dirname, '../move-contracts/game-logger/Move.toml');
    if (!fs.existsSync(moveTomlPath)) {
      throw new Error('Move.toml not found. Please ensure the game-logger contract exists.');
    }

    console.log('📦 Building Move package...');
    
    // Build the Move package
    try {
      execSync('sui move build', {
        cwd: path.join(__dirname, '../move-contracts/game-logger'),
        stdio: 'inherit'
      });
      console.log('✅ Move package built successfully\n');
    } catch (error) {
      console.error('❌ Failed to build Move package');
      throw error;
    }

    console.log('📤 Publishing to One Chain testnet...');

    // Publish the package
    let publishOutput;
    try {
      publishOutput = execSync('sui client publish --gas-budget 100000000 --skip-dependency-verification', {
        cwd: path.join(__dirname, '../move-contracts/game-logger'),
        encoding: 'utf-8'
      });
      console.log(publishOutput);
    } catch (error) {
      console.error('❌ Failed to publish package');
      console.error(error.message);
      throw error;
    }

    // Parse package ID from output
    const packageIdMatch = publishOutput.match(/PackageID:\s*(0x[a-fA-F0-9]+)/i);
    
    if (!packageIdMatch) {
      console.error('❌ Could not parse package ID from output');
      console.log('\n📋 Please manually extract the package ID from the output above');
      console.log('   and add it to your .env file as:');
      console.log('   NEXT_PUBLIC_GAME_LOGGER_PACKAGE_ID=0x...\n');
      return null;
    }

    const packageId = packageIdMatch[1];
    console.log('\n✅ Game Logger deployed successfully!');
    console.log(`📦 Package ID: ${packageId}\n`);

    // Update .env file
    const envPath = path.join(__dirname, '../.env');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf-8');
    }

    // Check if GAME_LOGGER_PACKAGE_ID already exists
    if (envContent.includes('NEXT_PUBLIC_GAME_LOGGER_PACKAGE_ID=')) {
      // Replace existing value
      envContent = envContent.replace(
        /NEXT_PUBLIC_GAME_LOGGER_PACKAGE_ID=.*/,
        `NEXT_PUBLIC_GAME_LOGGER_PACKAGE_ID=${packageId}`
      );
    } else {
      // Add new value
      envContent = envContent.replace(
        /# Game Logger Contract \(Deployed on One Chain\)\n# NEXT_PUBLIC_GAME_LOGGER_PACKAGE_ID=/,
        `# Game Logger Contract (Deployed on One Chain)\nNEXT_PUBLIC_GAME_LOGGER_PACKAGE_ID=${packageId}`
      );
    }

    fs.writeFileSync(envPath, envContent);
    console.log('✅ Updated .env file with package ID\n');

    // Save deployment info
    const deploymentInfo = {
      packageId,
      network: 'onechain-testnet',
      deployedAt: new Date().toISOString(),
      contractName: 'game_logger',
      walletAddress: WALLET_ADDRESS,
      functions: [
        'log_roulette_game',
        'log_mines_game',
        'log_plinko_game',
        'log_wheel_game'
      ]
    };

    const deploymentsDir = path.join(__dirname, '../deployments');
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }

    const deploymentFile = path.join(
      deploymentsDir,
      `game-logger-onechain-testnet-${Date.now()}.json`
    );
    
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
    console.log(`✅ Deployment info saved to: ${deploymentFile}\n`);

    return packageId;

  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    return null;
  }
}

async function main() {
  console.log(`\n📍 Wallet Address: ${WALLET_ADDRESS}\n`);

  // Step 1: Check initial balance
  console.log('Step 1: Check Initial Balance');
  console.log('-'.repeat(60));
  await checkBalance();

  // Step 2: Request faucet tokens
  console.log('\nStep 2: Request Faucet Tokens');
  console.log('-'.repeat(60));
  const faucetSuccess = await requestFaucetTokens();

  if (faucetSuccess) {
    // Wait a bit for tokens to arrive
    console.log('\n⏳ Waiting 10 seconds for tokens to arrive...');
    await new Promise(resolve => setTimeout(resolve, 10000));

    // Step 3: Check balance again
    console.log('\nStep 3: Verify Balance After Faucet');
    console.log('-'.repeat(60));
    await checkBalance();
  }

  // Step 4: Deploy contract
  console.log('\nStep 4: Deploy Game Logger Contract');
  console.log('-'.repeat(60));
  const packageId = await deployGameLogger();

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📋 SETUP SUMMARY');
  console.log('='.repeat(60));
  console.log(`\n✅ Wallet Address: ${WALLET_ADDRESS}`);
  
  if (faucetSuccess) {
    console.log('✅ Faucet tokens requested');
  } else {
    console.log('⚠️  Faucet tokens may need manual request');
  }

  if (packageId) {
    console.log(`✅ Contract deployed: ${packageId}`);
    console.log(`\n🔗 View on Explorer:`);
    console.log(`   https://onescan.cc/testnet/object/${packageId}`);
  } else {
    console.log('❌ Contract deployment failed');
  }

  console.log('\n📝 Next Steps:');
  console.log('   1. Verify balance: sui client gas');
  console.log('   2. Check contract on explorer');
  console.log('   3. Test game logging functionality');
  console.log('   4. Restart development server\n');
}

main().catch(error => {
  console.error('\n❌ Setup failed:', error);
  process.exit(1);
});

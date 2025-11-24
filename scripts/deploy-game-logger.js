/**
 * Deploy Game Logger Contract to One Chain Testnet
 * 
 * This script deploys the game_logger Move module to One Chain testnet
 * and saves the package ID for use in the application.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function deployGameLogger() {
  console.log('🚀 Deploying Game Logger to One Chain Testnet...\n');

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
    console.log('⚠️  Please ensure you have:');
    console.log('   1. Sui CLI installed and configured');
    console.log('   2. One Chain testnet configured in Sui CLI');
    console.log('   3. Sufficient OCT balance for gas fees\n');

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
    const packageIdMatch = publishOutput.match(/Published Objects:[\s\S]*?PackageID: (0x[a-fA-F0-9]+)/);
    
    if (!packageIdMatch) {
      console.error('❌ Could not parse package ID from output');
      console.log('\n📋 Please manually extract the package ID from the output above');
      console.log('   and add it to your .env file as:');
      console.log('   NEXT_PUBLIC_GAME_LOGGER_PACKAGE_ID=0x...\n');
      return;
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
      envContent += `\n# Game Logger Contract\nNEXT_PUBLIC_GAME_LOGGER_PACKAGE_ID=${packageId}\n`;
    }

    fs.writeFileSync(envPath, envContent);
    console.log('✅ Updated .env file with package ID\n');

    // Save deployment info
    const deploymentInfo = {
      packageId,
      network: 'onechain-testnet',
      deployedAt: new Date().toISOString(),
      contractName: 'game_logger',
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

    console.log('🎉 Deployment complete!\n');
    console.log('📝 Next steps:');
    console.log('   1. Restart your development server to load the new package ID');
    console.log('   2. Test game logging with the deployed contract');
    console.log('   3. Verify transactions on One Chain explorer\n');

    console.log('🔗 One Chain Explorer:');
    console.log(`   https://onescan.cc/testnet/object/${packageId}\n`);

  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Ensure Sui CLI is installed: https://docs.sui.io/build/install');
    console.error('   2. Configure One Chain testnet in Sui CLI');
    console.error('   3. Check your OCT balance for gas fees');
    console.error('   4. Verify network connectivity\n');
    process.exit(1);
  }
}

// Run deployment
deployGameLogger().catch(console.error);

/**
 * Request Test OCT Tokens from One Chain Faucet
 * 
 * This script helps request test tokens from the One Chain faucet
 */

const { execSync } = require('child_process');

async function requestFaucetTokens() {
  console.log('🚰 Requesting test OCT tokens from One Chain faucet...\n');

  try {
    // Get active address
    console.log('📍 Getting active wallet address...');
    const address = execSync('sui client active-address', { encoding: 'utf-8' }).trim();
    
    // Remove warning lines
    const cleanAddress = address.split('\n').filter(line => line.startsWith('0x'))[0];
    
    if (!cleanAddress) {
      console.error('❌ Could not get active address');
      console.error('   Please run: sui client active-address');
      process.exit(1);
    }

    console.log(`✅ Active address: ${cleanAddress}\n`);

    // Request tokens from faucet
    console.log('💰 Requesting tokens from faucet...');
    console.log('   This may take 1-2 minutes...\n');

    // Try method 1: one client faucet (One Chain CLI)
    console.log('📋 Method 1: Using One Chain CLI...');
    try {
      const faucetOutput = execSync(`one client faucet --address ${cleanAddress}`, {
        encoding: 'utf-8',
        timeout: 120000 // 2 minutes timeout
      });
      console.log(faucetOutput);
      console.log('\n✅ Faucet request completed!\n');
    } catch (error) {
      console.log('⚠️  One Chain CLI not available, trying alternative method...\n');
      
      // Try method 2: cURL to faucet API
      console.log('📋 Method 2: Using cURL to faucet API...');
      try {
        const curlCommand = `curl --location --request POST "https://faucet-testnet.onelabs.cc/v1/gas" --header "Content-Type: application/json" --data-raw "{\\"FixedAmountRequest\\":{\\"recipient\\":\\"${cleanAddress}\\"}}"`;
        const curlOutput = execSync(curlCommand, {
          encoding: 'utf-8',
          timeout: 120000,
          shell: true
        });
        console.log(curlOutput);
        console.log('\n✅ Faucet request sent via API!\n');
      } catch (curlError) {
        console.log('⚠️  API request failed, trying sui client faucet...\n');
        
        // Try method 3: sui client faucet (fallback)
        try {
          const suiFaucetOutput = execSync(`sui client faucet --address ${cleanAddress}`, {
            encoding: 'utf-8',
            timeout: 120000
          });
          console.log(suiFaucetOutput);
          console.log('\n✅ Faucet request completed!\n');
        } catch (suiError) {
          console.log('⏳ All automatic methods failed, but tokens may still be on the way...');
          console.log('   Check your balance in a minute with: sui client gas\n');
        }
      }
    }

    // Check balance
    console.log('💼 Checking balance...\n');
    try {
      const gasOutput = execSync('sui client gas', { encoding: 'utf-8' });
      console.log(gasOutput);
    } catch (error) {
      console.log('⚠️  Could not check balance automatically');
      console.log('   Please run: sui client gas\n');
    }

    console.log('\n🎉 Faucet request complete!\n');
    console.log('📝 Next steps:');
    console.log('   1. Verify you have OCT balance: sui client gas');
    console.log('   2. Deploy game logger contract: npm run deploy:game-logger');
    console.log('   3. Start testing the casino\n');

    console.log('🔗 Useful links:');
    console.log(`   Explorer: https://onescan.cc/testnet/account/${cleanAddress}`);
    console.log('   Faucet: https://faucet-testnet.onelabs.cc\n');

  } catch (error) {
    console.error('\n❌ Faucet request failed:', error.message);
    console.error('\n💡 Alternative methods:');
    console.error('   1. Visit faucet website: https://faucet-testnet.onelabs.cc');
    console.error('   2. Paste your address and request tokens manually');
    console.error('   3. Join One Chain Discord for help\n');
    process.exit(1);
  }
}

// Run faucet request
requestFaucetTokens().catch(console.error);

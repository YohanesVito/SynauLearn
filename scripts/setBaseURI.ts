/**
 * Set BaseURI Script - Helper to set the contract's baseURI
 *
 * This script helps you set the baseURI on your deployed contract.
 * You must be the contract owner to run this.
 *
 * Usage: npx tsx scripts/setBaseURI.ts "ipfs://QmYourFolderCID/"
 */

// Load environment variables from .env file
import { config } from 'dotenv';
config();

import { BadgeContract } from '../lib/badgeContract';

async function main() {
  // Check for OWNER_PRIVATE_KEY
  if (!process.env.OWNER_PRIVATE_KEY) {
    console.log('❌ Error: OWNER_PRIVATE_KEY not found in .env file\n');
    console.log('📝 Setup Instructions:');
    console.log('   1. Export your private key from your wallet (the contract owner wallet)');
    console.log('   2. Add it to your .env file:');
    console.log('      OWNER_PRIVATE_KEY=0xYourPrivateKeyHere');
    console.log('   3. ⚠️  IMPORTANT: Never commit your .env file to git!\n');
    console.log('💡 Tip: Make sure you are using the wallet address that deployed the contract\n');
    process.exit(1);
  }

  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('❌ Error: No baseURI provided\n');
    console.log('Usage: npx tsx scripts/setBaseURI.ts "ipfs://QmYourFolderCID/"\n');
    console.log('Example:');
    console.log('  npx tsx scripts/setBaseURI.ts "ipfs://QmXyZ123abc.../"\n');
    process.exit(1);
  }

  const newBaseURI = args[0];

  console.log('🔗 Setting Contract BaseURI\n');
  console.log('📍 Contract Address:', '0x086ac79f0354B4102d6156bdf2BC1D49a2f893aD');
  console.log('🌐 Network: Base Sepolia\n');

  // Validate format
  if (!newBaseURI.startsWith('ipfs://')) {
    console.log('⚠️  Warning: BaseURI should start with "ipfs://"');
    console.log('   Current value:', newBaseURI);
    console.log('   Expected format: ipfs://QmHash.../\n');
  }

  if (!newBaseURI.endsWith('/')) {
    console.log('⚠️  Warning: BaseURI should end with "/"');
    console.log('   Current value:', newBaseURI);
    console.log('   Contract will append: "{courseId}.json"');
    console.log('   Result: ' + newBaseURI + '1.json\n');
  }

  // Get current baseURI
  console.log('📖 Reading current baseURI from contract...');
  const currentBaseURI = await BadgeContract.getBaseURI();
  console.log('   Current: ' + (currentBaseURI || '(empty)') + '\n');

  if (currentBaseURI === newBaseURI) {
    console.log('✅ BaseURI is already set to this value!');
    console.log('   No transaction needed.\n');
    process.exit(0);
  }

  // Confirm change
  console.log('📝 Proposed Change:');
  console.log('   From: ' + (currentBaseURI || '(empty)'));
  console.log('   To:   ' + newBaseURI + '\n');

  console.log('⚠️  IMPORTANT: Make sure you are connected as the contract owner!\n');
  console.log('🔄 Sending transaction...\n');

  // Set new baseURI
  const result = await BadgeContract.setBaseURI(newBaseURI, (status) => {
    console.log('   📊', status);
  });

  if (result.success && result.txHash) {
    console.log('\n✅ Transaction sent successfully!');
    console.log('   Transaction Hash:', result.txHash);
    console.log('   View on BaseScan: https://sepolia.basescan.org/tx/' + result.txHash + '\n');

    console.log('⏳ Waiting for confirmation...');
    console.log('   (This may take 5-10 seconds)\n');

    // Wait a bit for confirmation
    await new Promise(resolve => setTimeout(resolve, 10000));

    // Verify
    console.log('🔍 Verifying new baseURI...');
    const verifiedBaseURI = await BadgeContract.getBaseURI();

    if (verifiedBaseURI === newBaseURI) {
      console.log('   ✅ BaseURI updated successfully!\n');
      console.log('📊 Final State:');
      console.log('   BaseURI: ' + verifiedBaseURI + '\n');
      console.log('💡 Example TokenURIs:');
      console.log('   Course 1: ' + verifiedBaseURI + '1.json');
      console.log('   Course 5: ' + verifiedBaseURI + '5.json\n');
      console.log('🎉 Setup complete! Users can now mint badges.');
    } else {
      console.log('   ⚠️  BaseURI verification mismatch');
      console.log('   Expected: ' + newBaseURI);
      console.log('   Got: ' + verifiedBaseURI);
      console.log('   Transaction may still be pending...\n');
    }
  } else {
    console.log('\n❌ Transaction failed:',result.error);
    console.log('\nPossible reasons:');
    console.log('   • You are not the contract owner');
    console.log('   • Transaction was rejected in wallet');
    console.log('   • Insufficient gas fees');
    console.log('   • Network connection issue\n');
    process.exit(1);
  }
}

main()
  .then(() => {
    console.log('✅ Script completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    console.error('\nError details:', error.message);
    process.exit(1);
  });

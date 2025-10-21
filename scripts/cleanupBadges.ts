/**
 * Cleanup Minted Badges Script
 *
 * This script helps you clean up test badge records from the database.
 * Note: This only deletes database records, NOT on-chain NFTs.
 *
 * Usage:
 *   npx tsx scripts/cleanupBadges.ts <wallet_address>
 *
 * Example:
 *   npx tsx scripts/cleanupBadges.ts 0x1234567890abcdef1234567890abcdef12345678
 */

import { config } from 'dotenv';
config();

import { API } from '../lib/api';

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('❌ Error: No wallet address provided\n');
    console.log('Usage: npx tsx scripts/cleanupBadges.ts <wallet_address>\n');
    console.log('Example:');
    console.log('  npx tsx scripts/cleanupBadges.ts 0x1234567890abcdef1234567890abcdef12345678\n');
    console.log('⚠️  This will delete ALL minted badge records for this wallet from the database.');
    console.log('   (On-chain NFTs will NOT be affected)\n');
    process.exit(1);
  }

  const walletAddress = args[0];

  console.log('🔍 Cleanup Minted Badges\n');
  console.log('📍 Wallet Address:', walletAddress);
  console.log('');

  // Validate address format
  if (!walletAddress.startsWith('0x') || walletAddress.length !== 42) {
    console.log('❌ Invalid wallet address format');
    console.log('   Expected: 0x followed by 40 hex characters');
    console.log('   Example: 0x1234567890abcdef1234567890abcdef12345678\n');
    process.exit(1);
  }

  try {
    // Get existing badges
    console.log('📖 Fetching minted badges for this wallet...');
    const badges = await API.getMintedBadgesByWallet(walletAddress);

    if (badges.length === 0) {
      console.log('✅ No minted badges found in database for this wallet.\n');
      process.exit(0);
    }

    console.log(`   Found ${badges.length} badge(s):\n`);

    badges.forEach((badge, index) => {
      console.log(`   ${index + 1}. Course ID: ${badge.course_id}`);
      console.log(`      Token ID: ${badge.token_id}`);
      console.log(`      Tx Hash: ${badge.tx_hash}`);
      console.log(`      Minted At: ${badge.minted_at}`);
      console.log('');
    });

    // Delete all badges
    console.log('🗑️  Deleting all badge records from database...');
    await API.deleteAllMintedBadgesForWallet(walletAddress);

    console.log('✅ All badge records deleted successfully!\n');
    console.log('📝 Note: This only removed database records.');
    console.log('   Your on-chain NFTs are still in your wallet.');
    console.log('   You can view them on BaseScan or NFT marketplaces.\n');

  } catch (error) {
    console.error('\n❌ Error:', error);
    if (error instanceof Error) {
      console.error('   Details:', error.message);
    }
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

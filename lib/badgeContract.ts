import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { writeContract, waitForTransactionReceipt, switchChain } from '@wagmi/core';
import { config } from '@/app/rootProvider';

export const BADGE_CONTRACT_ADDRESS = '0x086ac79f0354B4102d6156bdf2BC1D49a2f893aD' as const;

export const BADGE_CONTRACT_ABI = [
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'string', name: 'courseId', type: 'string' },
      { internalType: 'string', name: 'tokenURI', type: 'string' }
    ],
    name: 'mintBadge',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'string', name: 'courseId', type: 'string' }
    ],
    name: 'hasBadge',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'string', name: 'courseId', type: 'string' }
    ],
    name: 'getUserBadge',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
] as const;

// Public client for reading
export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http()
});

export const BadgeContract = {
  // Check if user has badge
  async hasBadge(userAddress: `0x${string}`, courseId: string): Promise<boolean> {
    try {
      const result = await publicClient.readContract({
        address: BADGE_CONTRACT_ADDRESS,
        abi: BADGE_CONTRACT_ABI,
        functionName: 'hasBadge',
        args: [userAddress, courseId]
      });
      return result;
    } catch (error) {
      console.error('Error checking badge:', error);
      return false;
    }
  },

  // Get user's badge token ID
  async getUserBadge(userAddress: `0x${string}`, courseId: string): Promise<bigint> {
    try {
      const result = await publicClient.readContract({
        address: BADGE_CONTRACT_ADDRESS,
        abi: BADGE_CONTRACT_ABI,
        functionName: 'getUserBadge',
        args: [userAddress, courseId]
      });
      return result;
    } catch (error) {
      console.error('Error getting badge:', error);
      return BigInt(0);
    }
  },

  // Mint badge - This will trigger wallet popup
  async mintBadge(
    userAddress: `0x${string}`,
    courseId: string,
    courseTitle: string,
    courseEmoji: string
  ): Promise<{ success: boolean; txHash?: `0x${string}`; error?: string }> {
    try {
      console.log('🎯 Step 1: Checking existing badge...');
      const hasBadge = await this.hasBadge(userAddress, courseId);
      if (hasBadge) {
        return { success: false, error: 'You already have this badge!' };
      }

      console.log('🎯 Step 2: Switching to Base Sepolia...');
      try {
        await switchChain(config, { chainId: baseSepolia.id });
        console.log('✅ Network switched');
      } catch (err) {
        console.error('❌ Network switch failed:', err);
        return { success: false, error: 'Please switch to Base Sepolia network' };
      }

      console.log('🎯 Step 3: Creating metadata...');
      const metadata = {
        name: `${courseTitle} Badge`,
        description: `Completion badge for ${courseTitle} course on SynauLearn`,
        image: `https://api.dicebear.com/7.x/shapes/svg?seed=${courseId}`,
        attributes: [
          { trait_type: 'Course', value: courseTitle },
          { trait_type: 'Course ID', value: courseId },
          { trait_type: 'Emoji', value: courseEmoji },
          { trait_type: 'Platform', value: 'SynauLearn' }
        ]
      };

      const metadataJson = JSON.stringify(metadata);
      const base64 = btoa(
        encodeURIComponent(metadataJson).replace(
          /%([0-9A-F]{2})/g,
          (_match, p1) => String.fromCharCode(parseInt(p1, 16))
        )
      );
      const tokenURI = `data:application/json;base64,${base64}`;

      console.log('🎯 Step 4: Sending transaction (wallet will popup)...');
      // This will automatically trigger wallet popup
      const hash = await writeContract(config, {
        address: BADGE_CONTRACT_ADDRESS,
        abi: BADGE_CONTRACT_ABI,
        functionName: 'mintBadge',
        args: [userAddress, courseId, tokenURI],
        chainId: baseSepolia.id,
      });

      console.log('✅ Transaction sent:', hash);
      console.log('🎯 Step 5: Waiting for confirmation...');

      const receipt = await waitForTransactionReceipt(config, {
        hash,
        chainId: baseSepolia.id,
      });

      if (receipt.status === 'reverted') {
        throw new Error('Transaction reverted');
      }

      console.log('🎉 Success!');
      return { success: true, txHash: hash };

    } catch (error: unknown) {
      console.error('❌ Mint failed:', error);
      
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
        
        if (errorMessage.includes('User rejected') || errorMessage.includes('User denied')) {
          errorMessage = 'Transaction rejected. Please approve in your wallet.';
        } else if (errorMessage.includes('insufficient funds')) {
          errorMessage = 'Insufficient funds. Get Base Sepolia ETH from faucet.';
        }
      }

      return { success: false, error: errorMessage };
    }
  }
};
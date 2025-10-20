import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { writeContract, switchChain } from '@wagmi/core';
import { wagmiConfig } from '@/app/rootProvider';

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

  // Mint badge - SIMPLIFIED VERSION for debugging
  async mintBadge(
    userAddress: `0x${string}`,
    courseId: string,
    courseTitle: string,
    courseEmoji: string,
    onStatusUpdate?: (status: string) => void
  ): Promise<{ success: boolean; txHash?: `0x${string}`; error?: string }> {
    try {
      console.log('🎯 Step 1: Switching to Base Sepolia...');
      onStatusUpdate?.('Switching to Base Sepolia network...');

      try {
        await switchChain(wagmiConfig, { chainId: baseSepolia.id });
        console.log('✅ Network switched to Base Sepolia');
      } catch (switchError) {
        console.error('❌ Network switch failed:', switchError);
        const errMessage = switchError instanceof Error ? switchError.message : String(switchError);

        // Check if user rejected network switch
        if (errMessage.includes('User rejected') || errMessage.includes('User denied')) {
          return { success: false, error: 'Network switch cancelled. Please switch to Base Sepolia and try again.' };
        }
        return { success: false, error: 'Failed to switch to Base Sepolia network. Please switch manually in your wallet.' };
      }

      console.log('🎯 Step 2: Preparing transaction...');
      onStatusUpdate?.('Preparing transaction...');

      // Simple tokenURI - no complex encoding
      const simpleTokenURI = `ipfs://badge-${courseId}`;

      console.log('🎯 Step 3: Sending transaction...');
      onStatusUpdate?.('Please approve in your wallet...');

      // MINIMAL writeContract call
      const hash = await writeContract(wagmiConfig, {
        address: BADGE_CONTRACT_ADDRESS,
        abi: BADGE_CONTRACT_ABI,
        functionName: 'mintBadge',
        args: [userAddress, courseId, simpleTokenURI],
        chainId: baseSepolia.id,
      });

      console.log('✅ Transaction hash received:', hash);
      onStatusUpdate?.('Transaction submitted!');

      // Return immediately - don't wait for confirmation
      return { success: true, txHash: hash };

    } catch (error: unknown) {
      console.error('❌ Mint failed:', error);

      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
        console.error('Full error:', error);

        // Handle specific error cases
        if (errorMessage.includes('User rejected') ||
            errorMessage.includes('User denied') ||
            errorMessage.includes('rejected') ||
            errorMessage.includes('denied transaction')) {
          errorMessage = 'Transaction rejected. Please approve in your wallet.';
        } else if (errorMessage.includes('insufficient funds')) {
          errorMessage = 'Insufficient funds. Get Base Sepolia ETH from faucet.';
        }
      }

      return { success: false, error: errorMessage };
    }
  }
};
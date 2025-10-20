import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';
import { writeContract, waitForTransactionReceipt, switchChain } from '@wagmi/core';
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

  // Mint badge - This will trigger wallet popup
  async mintBadge(
    userAddress: `0x${string}`,
    courseId: string,
    courseTitle: string,
    courseEmoji: string,
    onStatusUpdate?: (status: string) => void
  ): Promise<{ success: boolean; txHash?: `0x${string}`; error?: string }> {
    try {
      console.log('🎯 Step 1: Checking existing badge...');
      onStatusUpdate?.('Checking if badge already exists...');

      const hasBadge = await this.hasBadge(userAddress, courseId);
      if (hasBadge) {
        return { success: false, error: 'You already have this badge!' };
      }

      console.log('🎯 Step 2: Switching to Base Sepolia...');
      onStatusUpdate?.('Switching to Base Sepolia network...');

      try {
        await switchChain(wagmiConfig, { chainId: baseSepolia.id });
        console.log('✅ Network switched');
      } catch (err) {
        console.error('❌ Network switch failed:', err);
        const errMessage = err instanceof Error ? err.message : String(err);

        // Check if user rejected network switch
        if (errMessage.includes('User rejected') || errMessage.includes('User denied')) {
          return { success: false, error: 'Network switch cancelled. Please switch to Base Sepolia and try again.' };
        }
        return { success: false, error: 'Please switch to Base Sepolia network in your wallet' };
      }

      console.log('🎯 Step 3: Creating metadata...');
      onStatusUpdate?.('Preparing badge metadata...');

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
      onStatusUpdate?.('Approve transaction in your wallet...');

      let hash: `0x${string}`;
      try {
        // This will automatically trigger wallet popup
        hash = await writeContract(wagmiConfig, {
          address: BADGE_CONTRACT_ADDRESS,
          abi: BADGE_CONTRACT_ABI,
          functionName: 'mintBadge',
          args: [userAddress, courseId, tokenURI],
          chainId: baseSepolia.id,
        });

        console.log('✅ Transaction sent:', hash);
      } catch (writeError) {
        const errMessage = writeError instanceof Error ? writeError.message : String(writeError);
        console.error('❌ Transaction write failed:', errMessage);

        // Handle specific rejection scenarios
        if (errMessage.includes('User rejected') ||
            errMessage.includes('User denied') ||
            errMessage.includes('rejected') ||
            errMessage.includes('denied transaction')) {
          return { success: false, error: 'Transaction rejected. Please approve in your wallet.' };
        } else if (errMessage.includes('insufficient funds')) {
          return { success: false, error: 'Insufficient funds. Get Base Sepolia ETH from faucet.' };
        }

        return { success: false, error: `Transaction failed: ${errMessage}` };
      }

      console.log('🎯 Step 5: Waiting for confirmation...');
      onStatusUpdate?.('Transaction sent! Waiting for confirmation...');

      try {
        const receipt = await waitForTransactionReceipt(wagmiConfig, {
          hash,
          chainId: baseSepolia.id,
          timeout: 120_000, // 2 minutes timeout
        });

        if (receipt.status === 'reverted') {
          console.error('❌ Transaction reverted');
          return {
            success: false,
            txHash: hash,
            error: 'Transaction reverted. The contract rejected the transaction.'
          };
        }

        console.log('🎉 Success! Receipt:', receipt);
        onStatusUpdate?.('Badge minted successfully!');
        return { success: true, txHash: hash };

      } catch (receiptError) {
        const errMessage = receiptError instanceof Error ? receiptError.message : String(receiptError);
        console.error('❌ Receipt wait failed:', errMessage);

        // Transaction was sent but confirmation timed out
        if (errMessage.includes('timeout') || errMessage.includes('timed out')) {
          return {
            success: false,
            txHash: hash,
            error: 'Transaction confirmation timeout. Check block explorer to see if transaction succeeded.'
          };
        }

        // Transaction was sent but something went wrong
        return {
          success: false,
          txHash: hash,
          error: `Confirmation failed: ${errMessage}`
        };
      }

    } catch (error: unknown) {
      console.error('❌ Mint failed:', error);

      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;

        // Final catch for any unhandled rejection scenarios
        if (errorMessage.includes('User rejected') ||
            errorMessage.includes('User denied') ||
            errorMessage.includes('rejected') ||
            errorMessage.includes('denied transaction')) {
          errorMessage = 'Transaction rejected. Please approve in your wallet.';
        } else if (errorMessage.includes('insufficient funds')) {
          errorMessage = 'Insufficient funds. Get Base Sepolia ETH from faucet.';
        } else if (errorMessage.includes('network')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        }
      }

      return { success: false, error: errorMessage };
    }
  }
};
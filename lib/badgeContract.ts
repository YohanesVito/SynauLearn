import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { baseSepolia } from 'viem/chains';

export const BADGE_CONTRACT_ADDRESS = '0x086ac79f0354B4102d6156bdf2BC1D49a2f893aD' as const;

// ABI for the SynauLearnBadge contract
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
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'tokensOfOwner',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'tokenToCourse',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'courseId', type: 'string' }
    ],
    name: 'BadgeMinted',
    type: 'event'
  }
] as const;

// Create public client for reading contract data
export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http()
});

// Helper function to create wallet client
export const getWalletClient = () => {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('No wallet found');
  }

  return createWalletClient({
    chain: baseSepolia,
    transport: custom(window.ethereum)
  });
};

// Contract interaction functions
export const BadgeContract = {
  // Check if user has a badge for a course
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

  // Get user's badge token ID for a course
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
      console.error('Error getting user badge:', error);
      return BigInt(0);
    }
  },

  // Get all token IDs owned by user
  async tokensOfOwner(ownerAddress: `0x${string}`): Promise<bigint[]> {
    try {
      const result = await publicClient.readContract({
        address: BADGE_CONTRACT_ADDRESS,
        abi: BADGE_CONTRACT_ABI,
        functionName: 'tokensOfOwner',
        args: [ownerAddress],
      });

      return [...result]; // ✅ spread to make a mutable copy
    } catch (error) {
      console.error('Error getting tokens:', error);
      return [];
    }
  },

  // Get token URI (metadata)
  async getTokenURI(tokenId: bigint): Promise<string> {
    try {
      const result = await publicClient.readContract({
        address: BADGE_CONTRACT_ADDRESS,
        abi: BADGE_CONTRACT_ABI,
        functionName: 'tokenURI',
        args: [tokenId]
      });
      return result;
    } catch (error) {
      console.error('Error getting token URI:', error);
      return '';
    }
  },

  // Get course ID from token ID
  async getCourseFromToken(tokenId: bigint): Promise<string> {
    try {
      const result = await publicClient.readContract({
        address: BADGE_CONTRACT_ADDRESS,
        abi: BADGE_CONTRACT_ABI,
        functionName: 'tokenToCourse',
        args: [tokenId]
      });
      return result;
    } catch (error) {
      console.error('Error getting course from token:', error);
      return '';
    }
  },

  // Request badge minting (user signs transaction)
  async requestMint(
    userAddress: `0x${string}`,
    courseId: string,
    courseTitle: string,
    courseEmoji: string
  ): Promise<{ success: boolean; txHash?: `0x${string}`; error?: string }> {
    try {
      // First check if user already has this badge
      const hasBadge = await this.hasBadge(userAddress, courseId);
      if (hasBadge) {
        return { success: false, error: 'You already have this badge!' };
      }

      // Create metadata for the badge
      const metadata = {
        name: `${courseTitle} Badge`,
        description: `Completion badge for ${courseTitle} course on SynauLearn`,
        image: `https://api.dicebear.com/7.x/shapes/svg?seed=${courseId}`, // Placeholder
        attributes: [
          { trait_type: 'Course', value: courseTitle },
          { trait_type: 'Course ID', value: courseId },
          { trait_type: 'Emoji', value: courseEmoji },
          { trait_type: 'Platform', value: 'SynauLearn' }
        ]
      };

      // Browser-compatible base64 encoding that supports Unicode/emojis
      const metadataJson = JSON.stringify(metadata);

      // Encode to base64 with Unicode support
      const base64 = btoa(
        encodeURIComponent(metadataJson).replace(
          /%([0-9A-F]{2})/g,
          (match, p1) => String.fromCharCode(parseInt(p1, 16))
        )
      );

      const tokenURI = `data:application/json;base64,${base64}`;

      // Get wallet client
      const walletClient = getWalletClient();

      // Simulate the transaction first to catch errors
      const { request } = await publicClient.simulateContract({
        account: userAddress,
        address: BADGE_CONTRACT_ADDRESS,
        abi: BADGE_CONTRACT_ABI,
        functionName: 'mintBadge',
        args: [userAddress, courseId, tokenURI]
      });

      // Execute the transaction
      const txHash = await walletClient.writeContract(request);

      // Wait for transaction confirmation
      await publicClient.waitForTransactionReceipt({ hash: txHash });

      return { success: true, txHash };
    } catch (error: unknown) {
      console.error('Error minting badge:', error);

      let errorMessage = 'Failed to mint badge. Please try again.';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }
};
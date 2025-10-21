/**
 * Node.js compatible Wagmi config
 *
 * This config is for use in Node.js scripts (like setBaseURI.ts)
 * It doesn't import any browser-only dependencies or CSS files
 */

import { createConfig, http } from 'wagmi';
import { defineChain } from 'viem';
import { coinbaseWallet } from 'wagmi/connectors';

export const baseSepolia = defineChain({
  id: 84532,
  name: "Base Sepolia",
  testnet: true,
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ["https://sepolia.base.org"],
    },
  },
  blockExplorers: {
    default: {
      name: "Base Sepolia Explorer",
      url: "https://base-sepolia.blockscout.com",
    },
  },
});

export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: 'SynauLearn',
      preference: 'smartWalletOnly',
      version: '4',
    }),
  ],
  transports: {
    [baseSepolia.id]: http(),
  },
});

"use client";
import { ReactNode } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { coinbaseWallet } from "wagmi/connectors";
import { base } from "wagmi/chains";
import "@coinbase/onchainkit/styles.css";
import { defineChain } from "viem";
// import { AuthKitProvider } from '@farcaster/auth-client';

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
  iconUrl: "https://avatars.githubusercontent.com/u/108554348?s=200&v=4",
});


// export const wagmiConfig = createConfig({
//   chains: [baseSepolia, base],
//   connectors: [
//     coinbaseWallet({
//       appName: 'SynauLearn',
//       preference: 'smartWalletOnly',
//     }),
//   ],
//   transports: {
//     [baseSepolia.id]: http(),
//   },
// });


//dari github
export const wagmiConfig = createConfig({
  chains: [baseSepolia, base],
  connectors: [
    coinbaseWallet({
      appName: "SynauLearn",
    }),
  ],
  ssr: true,
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
});

// const config = {
//   rpcUrl: 'https://mainnet.optimism.io',
//   domain:  process.env.DOMAIN || 'localhost:3000',
//   siweUri: 'https://example.com/login',
// };

export function RootProvider({ children }: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={baseSepolia}
      config={{
        appearance: {
          mode: "light",
          theme: "cyberpunk",
        },
        wallet: {
          display: "modal",
          preference: "all",
        },
      }}
      miniKit={{
        enabled: true,
        autoConnect: true,
        notificationProxyUrl: undefined,
      }}
    >
      {/* <AuthKitProvider config={config}>{children}</AuthKitProvider> */}
      <WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
    </OnchainKitProvider>
  );
}

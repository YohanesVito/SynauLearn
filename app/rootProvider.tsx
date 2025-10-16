"use client";
import { ReactNode } from "react";
import { baseSepolia } from "wagmi/chains";
// import { createConfig, http } from "wagmi";
import { OnchainKitProvider } from "@coinbase/onchainkit";
// import { coinbaseWallet } from "wagmi/connectors";
import "@coinbase/onchainkit/styles.css";
// import { AuthKitProvider } from '@farcaster/auth-client';

// const wagmiConfig = createConfig({
//   chains: [baseSepolia],
//   connectors: [
//     coinbaseWallet({
//       appName: "OnchainKit Demo",
//     }),
//   ],
//   ssr: true,
//   transports: {
//     [baseSepolia.id]: http(),
//   },
// });

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
      {children}
    </OnchainKitProvider>
  );
}

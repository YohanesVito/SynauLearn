"use client";

import { useEffect } from "react";
import { ConnectWallet } from "@coinbase/onchainkit/wallet";
import { useAccount, useBalance } from "wagmi";
import { formatEther } from "viem";
import { baseSepolia } from "viem/chains";
import { SafeArea } from "@coinbase/onchainkit/minikit";

interface ProfileProps {
    onBack: () => void;
}

export default function MyBalance({onBack}: ProfileProps) {
  const { address, isConnected } = useAccount();

  // fetch native balance (ETH) for connected wallet on Base Sepolia
  const { data: balanceData, isLoading, error, refetch } = useBalance({
    address: address as `0x${string}` | undefined,
    chainId: baseSepolia.id, // 84532
    watch: true, // auto update balance
  });

  // optional: refetch on connect
  useEffect(() => {
    if (isConnected) refetch();
  }, [isConnected, refetch]);

  return (
    <SafeArea>
      <main className="text-white min-h-screen flex flex-col items-center justify-center p-6 space-y-6">
        <h1 className="text-2xl font-semibold">Base Sepolia — Connected Wallet Balance</h1>

        <div className="space-y-2">
          <ConnectWallet /> {/* OnchainKit's ConnectButton */}
        </div>

        {!isConnected ? (
          <p className="text-sm text-muted-foreground">Connect your wallet to view balance.</p>
        ) : (
          <div className="p-4 border rounded max-w-md w-full">
            <p className="text-sm break-words">
              <strong>Address:</strong> {address}
            </p>

            {isLoading && <p className="mt-2">Loading balance…</p>}

            {error && (
              <p className="mt-2 text-red-500">
                Error fetching balance: {(error as Error).message}
              </p>
            )}

            {balanceData && (
              <p className="mt-2 text-lg">
                <strong>Balance:</strong> {formatEther(balanceData.value)} ETH
              </p>
            )}
          </div>
        )}
      </main>
    </SafeArea>
  );
}

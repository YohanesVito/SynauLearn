import React, { useState, useEffect, useCallback } from 'react';
import { X, Lock, Check, ExternalLink } from 'lucide-react';
import { useAccount } from 'wagmi';
import { API } from '@/lib/api';
import { BadgeContract } from '@/lib/badgeContract';
import { useMiniKit } from '@coinbase/onchainkit/minikit';

interface MintBadgeProps {
  onClose: () => void;
}

interface Course {
  id: string;
  title: string;
  description: string;
  emoji: string;
  completed: boolean;
  minted: boolean;
  tokenId?: string;
}

export default function MintBadge({ onClose }: MintBadgeProps) {
  const { context } = useMiniKit();
  const { address, isConnected } = useAccount();
  const [courses, setCourses] = useState<Course[]>([]);
  const [mintingCourseId, setMintingCourseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [txHash, setTxHash] = useState<string | null>(null);
  const {isFrameReady, setFrameReady } = useMiniKit();

  const loadCourses = useCallback(async () => {
    try {
      setLoading(true);

      if (!context?.user?.fid) return;

      // Get or create user
      const user = await API.getUserOrCreate(
        context.user.fid,
        context.user.username,
        context.user.displayName
      );

      // Get all courses
      const allCourses = await API.getCourses();

      // Check completion & minted status
      const coursesWithStatus = await Promise.all(
        allCourses.map(async (course) => {
          const progress = await API.getCourseProgressPercentage(user.id, course.id);
          const completed = progress === 100;

          let minted = false;
          let tokenId: string | undefined;

          // On-chain check
          if (address && completed) {
            try {
              minted = await BadgeContract.hasBadge(address as `0x${string}`, course.id);
              if (minted) {
                const tokenIdBigInt = await BadgeContract.getUserBadge(
                  address as `0x${string}`,
                  course.id
                );
                tokenId = tokenIdBigInt.toString();
              }
            } catch (error) {
              console.error('Error checking minted status:', error);
            }
          }

          // Database check
          if (!minted && completed) {
            const dbBadge = await API.getMintedBadge(user.id, course.id);
            if (dbBadge) {
              minted = true;
              tokenId = dbBadge.token_id;
            }
          }

          return {
            id: course.id,
            title: course.title,
            description: course.description,
            emoji: course.emoji,
            completed,
            minted,
            tokenId,
          };
        })
      );

      setCourses(coursesWithStatus);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  }, [context, address]); // ✅ include dependencies used inside the function

  // ✅ useEffect now depends on the memoized callback
  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const handleMintBadge = async (course: Course) => {
    if (!course.completed || course.minted || mintingCourseId) return;

    if (!isConnected || !address) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      setMintingCourseId(course.id);
      setTxHash(null);

      // Call the smart contract to mint the badge
      const result = await BadgeContract.requestMint(
        address as `0x${string}`,
        course.id,
        course.title,
        course.emoji
      );

      if (result.success && result.txHash) {
        setTxHash(result.txHash);

        // Get the token ID from the contract
        const tokenId = await BadgeContract.getUserBadge(
          address as `0x${string}`,
          course.id
        );

        // Save to database
        try {
          const user = await API.getUserOrCreate(
            context!.user!.fid,
            context!.user!.username,
            context!.user!.displayName
          );

          await API.saveMintedBadge(
            user.id,
            course.id,
            address,
            tokenId.toString(),
            result.txHash
          );

          console.log('Badge saved to database successfully');
        } catch (dbError) {
          console.error('Error saving to database:', dbError);
          // Don't fail the whole process if DB save fails
        }

        // Update the UI
        setCourses(prevCourses =>
          prevCourses.map(c =>
            c.id === course.id ? { ...c, minted: true, tokenId: tokenId.toString() } : c
          )
        );

        alert(`✅ Badge minted successfully!\n\nTransaction: ${result.txHash.slice(0, 10)}...${result.txHash.slice(-8)}\nToken ID: #${tokenId.toString()}`);

        // Reload courses to get updated data
        await loadCourses();
      } else {
        alert(`❌ Minting failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Minting error:', error.message);
        alert(`Failed to mint badge: ${error.message}`);
      } else {
        console.error('Minting error:', error);
        alert('Failed to mint badge: Unknown error');
      }
    } finally {
      setMintingCourseId(null);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-slate-900 rounded-2xl p-8 text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (

    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
      <div className="bg-slate-900 w-full sm:max-w-2xl sm:rounded-2xl rounded-t-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <h2 className="text-2xl font-bold text-white">Mint Badge</h2>
            {isConnected && address && (
              <p className="text-xs text-gray-400 mt-1">
                {address.slice(0, 6)}...{address.slice(-4)}
              </p>
            )}
            <p className="text-xs text-blue-400 mt-1">
              Contract: 0x086a...93aD
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            disabled={!!mintingCourseId}
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!isConnected && (
            <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
              <p className="text-yellow-400 text-sm">
                ⚠️ Please connect your wallet to mint badges
                
              </p>
            </div>
          )}

          {txHash && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
              <p className="text-green-400 text-sm mb-2">
                ✅ Transaction successful!
              </p>
              <a
                href={`https://sepolia.basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 text-xs flex items-center gap-1 hover:underline"
              >
                View on BaseScan <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
          <h3 className="text-lg font-semibold text-white mb-4">
            Select a completed course to mint a badge
          </h3>

          <div className="space-y-4">
            {courses.map((course) => {
              const isMinting = mintingCourseId === course.id;

              return (
                <div
                  key={course.id}
                  className={`relative rounded-2xl border-2 p-5 transition-all ${!course.completed
                      ? 'border-slate-800 bg-slate-900/30 opacity-60 cursor-not-allowed'
                      : course.minted
                        ? 'border-green-500/50 bg-green-500/10'
                        : isMinting
                          ? 'border-blue-500 bg-slate-800/70 cursor-wait'
                          : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 cursor-pointer'
                    } ${mintingCourseId && !isMinting ? 'pointer-events-none opacity-50' : ''}`}
                >
                  <div className="flex gap-4">
                    {/* Badge Icon */}
                    <div
                      className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 ${course.minted
                          ? 'bg-gradient-to-br from-green-400 to-green-600'
                          : course.completed
                            ? 'bg-gradient-to-br from-orange-400 to-orange-600'
                            : 'bg-slate-800 border-2 border-slate-700'
                        }`}
                    >
                      {isMinting ? (
                        <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
                      ) : course.minted ? (
                        <Check className="w-10 h-10 text-white" />
                      ) : course.completed ? (
                        course.emoji
                      ) : (
                        <Lock className="w-8 h-8 text-gray-600" />
                      )}
                    </div>

                    {/* Course Info */}
                    <div className="flex-1">
                      {course.completed && !course.minted && (
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-md mb-2">
                          <Check className="w-3 h-3" />
                          Ready to Mint
                        </div>
                      )}
                      {course.minted && (
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-md mb-2">
                          <Check className="w-3 h-3" />
                          Minted {course.tokenId && `#${course.tokenId}`}
                        </div>
                      )}
                      {!course.completed && (
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-slate-800 text-gray-500 text-xs font-medium rounded-md mb-2">
                          <Lock className="w-3 h-3" />
                          Locked
                        </div>
                      )}
                      <h4 className="text-lg font-semibold text-white mb-2">
                        {course.title}
                      </h4>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {course.description}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  {course.completed && !course.minted && !isMinting && !mintingCourseId && isConnected && (
                    <button
                      onClick={() => handleMintBadge(course)}
                      className="mt-4 w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      Mint Badge (Free)
                    </button>
                  )}

                  {/* Minting State */}
                  {isMinting && (
                    <div className="mt-4 w-full py-3 px-4 bg-blue-500/20 text-blue-400 font-semibold rounded-lg flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                      Minting on Base Sepolia...
                    </div>
                  )}

                  {/* Already Minted */}
                  {course.minted && (
                    <div className="mt-4 w-full py-3 px-4 bg-green-500/10 border border-green-500/30 text-green-400 font-semibold rounded-lg text-center">
                      ✅ Badge Minted Successfully
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
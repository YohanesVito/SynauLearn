import React, { useState, useEffect, useCallback } from 'react';
import { X, Lock, Check, ExternalLink } from 'lucide-react';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
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
    const { address, isConnected } = useAccount();
    const [courses, setCourses] = useState<Course[]>([]);
    const [mintingCourseId, setMintingCourseId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [mintingStatus, setMintingStatus] = useState<string>('');
    const { context } = useMiniKit();

    const loadCourses = useCallback(async () => {
        try {
            setLoading(true);

            // For demo, create mock user. In production, get from your auth
            const mockFid = 12345;
            const user = await API.getUserOrCreate(
                context?.user?.fid || mockFid,                // unique user ID
                context?.user?.username || address,
                context?.user?.displayName || 'Wallet User'
            );

            const allCourses = await API.getCourses();

            const coursesWithStatus = await Promise.all(
                allCourses.map(async (course) => {
                    const progress = await API.getCourseProgressPercentage(user.id, course.id);
                    const completed = progress === 100;

                    let minted = false;
                    let tokenId: string | undefined;

                    if (address && completed) {
                        try {
                            // TEMPORARY: Use static courseId = 5 since course IDs are UUIDs
                            // TODO: Create proper mapping from UUID to numeric courseId
                            const courseIdNum = 5;

                            minted = await BadgeContract.hasBadge(address as `0x${string}`, courseIdNum);
                            if (minted) {
                                const tokenIdBigInt = await BadgeContract.getUserBadgeForCourse(
                                    address as `0x${string}`,
                                    courseIdNum
                                );
                                tokenId = tokenIdBigInt.toString();
                            }
                        } catch (error) {
                            console.error('Error checking minted status:', error);
                        }
                    }

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
    }, [address, context?.user?.fid, context?.user?.username, context?.user?.displayName]);

    useEffect(() => {
        loadCourses();
    }, [loadCourses]);

    const handleMintBadge = async (course: Course) => {
        if (!course.completed || course.minted || mintingCourseId) return;

        if (!isConnected || !address) {
            alert('⚠️ Please connect your wallet first');
            return;
        }

        try {
            setMintingCourseId(course.id);
            setTxHash(null);
            setMintingStatus('Preparing to mint...');

            console.log('🚀 Starting mint process for:', course.title);
            console.log('🔍 Course ID (UUID):', course.id);

            // TEMPORARY: Use static courseId = 5 since course IDs are UUIDs
            // TODO: Create proper mapping from UUID to numeric courseId
            const courseIdNum = 5;
            console.log('🔢 Using static course ID:', courseIdNum);

            // Call mint function with status callback - NEW ABI takes only courseId
            const result = await BadgeContract.mintBadge(
                courseIdNum,
                (status: string) => {
                    setMintingStatus(status);
                    console.log('📊 Status:', status);
                }
            );

            // Show transaction hash immediately if available, even on failure
            if (result.txHash) {
                setTxHash(result.txHash);
                setMintingStatus('Transaction sent! Confirming...');
            }

            if (result.success && result.txHash) {
                setMintingStatus('Getting badge information...');

                // Wait a bit for the transaction to be indexed
                await new Promise(resolve => setTimeout(resolve, 2000));

                // TEMPORARY: Use static courseId = 5 since course IDs are UUIDs
                const courseIdNum = 5;

                const tokenId = await BadgeContract.getUserBadgeForCourse(
                    address as `0x${string}`,
                    courseIdNum
                );

                // Save to database
                try {
                    setMintingStatus('Saving to database...');
                    const user = await API.getUserOrCreate(
                        context?.user?.fid || 12345,
                        context?.user?.username,
                        context?.user?.displayName);

                    await API.saveMintedBadge(
                        user.id,
                        course.id,
                        address,
                        tokenId.toString(),
                        result.txHash
                    );

                    console.log('✅ Badge saved to database');
                } catch (dbError) {
                    console.error('❌ Database error:', dbError);
                    // Continue even if database save fails
                }

                // Update UI
                setCourses(prevCourses =>
                    prevCourses.map(c =>
                        c.id === course.id ? { ...c, minted: true, tokenId: tokenId.toString() } : c
                    )
                );

                setMintingStatus('Badge minted successfully!');
                alert(`✅ Badge minted!\n\nTx: ${result.txHash.slice(0, 10)}...${result.txHash.slice(-8)}\nToken #${tokenId.toString()}`);

                await loadCourses();
            } else {
                // Handle failure cases
                const errorMsg = result.error || 'Unknown error';
                console.error('❌ Mint failed:', errorMsg);

                if (result.txHash) {
                    // Transaction was sent but failed/timed out
                    alert(`⚠️ ${errorMsg}\n\nTransaction: ${result.txHash.slice(0, 10)}...${result.txHash.slice(-8)}\n\nCheck BaseScan to see the status.`);
                } else {
                    // Transaction was never sent
                    alert(`❌ Mint failed: ${errorMsg}`);
                }
                setMintingStatus('');
            }
        } catch (error: unknown) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            console.error('❌ Mint error:', errorMsg);
            alert(`❌ Failed: ${errorMsg}`);
            setMintingStatus('');
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
                        <p className="text-xs text-blue-400 mt-1">Base Sepolia</p>
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
                    {/* RainbowKit Connect Button */}
                    <div className="mb-6 p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white font-semibold mb-1">
                                    {isConnected ? '✅ Wallet Connected' : '🔗 Connect Your Wallet'}
                                </p>
                                <p className="text-gray-300 text-sm">
                                    {isConnected
                                        ? 'Ready to mint your badges'
                                        : 'Connect to mint badges as NFTs on Base Sepolia'}
                                </p>
                            </div>
                            <ConnectButton
                                chainStatus="icon"
                                showBalance={false}
                            />
                        </div>
                    </div>

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
                        Select a completed course to mint
                    </h3>

                    <div className="space-y-4">
                        {courses.map((course) => {
                            const isMinting = mintingCourseId === course.id;

                            return (
                                <div
                                    key={course.id}
                                    className={`rounded-2xl border-2 p-5 transition-all ${!course.completed
                                        ? 'border-slate-800 bg-slate-900/30 opacity-60'
                                        : course.minted
                                            ? 'border-green-500/50 bg-green-500/10'
                                            : isMinting
                                                ? 'border-blue-500 bg-slate-800/70'
                                                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                                        }`}
                                >
                                    <div className="flex gap-4">
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

                                        <div className="flex-1">
                                            {course.completed && !course.minted && (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-md mb-2">
                                                    <Check className="w-3 h-3" />
                                                    Ready to Mint
                                                </span>
                                            )}
                                            {course.minted && (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-md mb-2">
                                                    <Check className="w-3 h-3" />
                                                    Minted #{course.tokenId}
                                                </span>
                                            )}
                                            {!course.completed && (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-800 text-gray-500 text-xs font-medium rounded-md mb-2">
                                                    <Lock className="w-3 h-3" />
                                                    Complete Course First
                                                </span>
                                            )}
                                            <h4 className="text-lg font-semibold text-white mb-2">
                                                {course.title}
                                            </h4>
                                            <p className="text-sm text-gray-400">
                                                {course.description}
                                            </p>
                                        </div>
                                    </div>

                                    {course.completed && !course.minted && !isMinting && (
                                        <button
                                            onClick={() => handleMintBadge(course)}
                                            disabled={!isConnected}
                                            className={`mt-4 w-full py-3 px-4 font-semibold rounded-lg transition-colors ${isConnected
                                                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                                }`}
                                        >
                                            {isConnected ? 'Mint Badge (Free)' : '🔒 Connect Wallet First'}
                                        </button>
                                    )}

                                    {isMinting && (
                                        <div className="mt-4 w-full py-3 px-4 bg-blue-500/20 text-blue-400 font-semibold rounded-lg flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                                            {mintingStatus || 'Minting on Base Sepolia...'}
                                        </div>
                                    )}

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
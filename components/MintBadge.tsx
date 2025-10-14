import React, { useState } from 'react';
import { X, Lock, Check } from 'lucide-react';
import { useAccount } from 'wagmi';

interface MintBadgeProps {
  onClose: () => void;
}

interface Course {
  id: string;
  title: string;
  description: string;
  badge: string;
  completed: boolean;
}

const coursesData: Course[] = [
  {
    id: '1',
    title: 'Blockchain Basics',
    description: 'Learn the fundamentals of blockchain technology, including its structure, security, and applications.',
    badge: '🔶',
    completed: true,
  },
  {
    id: '2',
    title: 'Cryptocurrency Trading',
    description: 'Master the art of trading cryptocurrencies, from market analysis to risk management.',
    badge: '📈',
    completed: true,
  },
  {
    id: '3',
    title: 'Decentralized Finance (DeFi)',
    description: 'Explore the world of DeFi, including lending, borrowing, and decentralized exchanges.',
    badge: '💼',
    completed: false,
  },
  {
    id: '4',
    title: 'NFT Fundamentals',
    description: 'Understand non-fungible tokens, their use cases, and how to create and trade them.',
    badge: '🖼️',
    completed: false,
  },
  {
    id: '5',
    title: 'Smart Contracts',
    description: 'Learn to write and deploy smart contracts on various blockchain platforms.',
    badge: '📄',
    completed: false,
  },
];

export default function MintBadge({ onClose }: MintBadgeProps) {
  const [courses] = useState<Course[]>(coursesData);
  const [mintingCourseId, setMintingCourseId] = useState<string | null>(null);
  
  const { address, isConnected } = useAccount();

  const handleSelectCourse = async (courseId: string, completed: boolean) => {
    // Can't select if not completed or already minting
    if (!completed || mintingCourseId) return;

    // Check if wallet is connected
    if (!isConnected || !address) {
      alert('Please make sure your wallet is connected');
      return;
    }

    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    try {
      setMintingCourseId(courseId);

      // TODO: Implement actual minting logic
      // Example:
      // 1. Call your backend API to prepare mint transaction
      // 2. Sign transaction with wallet
      // 3. Wait for transaction confirmation
      // 4. Update user's badge collection

      // Simulated minting process
      await new Promise(resolve => setTimeout(resolve, 2000));

      alert(`Successfully minted badge for: ${course.title}\nWallet: ${address}`);
      
      // Close modal after successful mint
      onClose();
    } catch (error) {
      console.error('Minting error:', error);
      alert('Failed to mint badge. Please try again.');
      setMintingCourseId(null);
    }
  };

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
          <h3 className="text-lg font-semibold text-white mb-4">
            Select a course to mint a badge
          </h3>

          <div className="space-y-4">
            {courses.map((course) => {
              const isMinting = mintingCourseId === course.id;
              
              return (
                <div
                  key={course.id}
                  onClick={() => handleSelectCourse(course.id, course.completed)}
                  className={`relative rounded-2xl border-2 p-5 transition-all ${
                    !course.completed
                      ? 'border-slate-800 bg-slate-900/30 opacity-60 cursor-not-allowed'
                      : isMinting
                      ? 'border-blue-500 bg-slate-800/70 cursor-wait'
                      : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 cursor-pointer'
                  } ${mintingCourseId && !isMinting ? 'pointer-events-none opacity-50' : ''}`}
                >
                  <div className="flex gap-4">
                    {/* Badge Icon */}
                    <div
                      className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0 ${
                        course.completed
                          ? 'bg-gradient-to-br from-orange-400 to-orange-600'
                          : 'bg-slate-800 border-2 border-slate-700'
                      }`}
                    >
                      {isMinting ? (
                        <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
                      ) : course.completed ? (
                        course.badge
                      ) : (
                        <Lock className="w-8 h-8 text-gray-600" />
                      )}
                    </div>

                    {/* Course Info */}
                    <div className="flex-1">
                      {course.completed && (
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-md mb-2">
                          <Check className="w-3 h-3" />
                          Completed
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

                  {/* Mint Button */}
                  {course.completed && !isMinting && !mintingCourseId && (
                    <button
                      className="mt-4 w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                    >
                      Mint Badge
                    </button>
                  )}

                  {/* Minting State */}
                  {isMinting && (
                    <div className="mt-4 w-full py-3 px-4 bg-blue-500/20 text-blue-400 font-semibold rounded-lg flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                      Minting...
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
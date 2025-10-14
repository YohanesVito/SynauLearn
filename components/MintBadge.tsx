import React, { useState } from 'react';
import { X, Lock, Check } from 'lucide-react';
import { Wallet } from '@coinbase/onchainkit/wallet';

interface MintBadgeProps {
  onClose: () => void;
}

interface Course {
  id: string;
  title: string;
  description: string;
  badge: string;
  completed: boolean;
  selected?: boolean;
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
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const handleSelectCourse = (courseId: string, completed: boolean) => {
    if (completed) {
      setSelectedCourse(selectedCourse === courseId ? null : courseId);
    }
  };

  const handleMintBadge = () => {
    if (selectedCourse) {
      // Here you would implement the actual minting logic
      // alert(`Minting badge for course: ${courses.find(c => c.id === selectedCourse)?.title}`);
      <Wallet />
    }
  };

  const hasSelection = selectedCourse !== null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
      <div className="bg-slate-900 w-full sm:max-w-2xl sm:rounded-2xl rounded-t-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-2xl font-bold text-white">Mint Badge</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
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
            {courses.map((course) => (
              <div
                key={course.id}
                onClick={() => handleSelectCourse(course.id, course.completed)}
                className={`relative rounded-2xl border-2 p-5 transition-all ${
                  !course.completed
                    ? 'border-slate-800 bg-slate-900/30 opacity-60 cursor-not-allowed'
                    : selectedCourse === course.id
                    ? 'border-blue-500 bg-slate-800/70 cursor-pointer'
                    : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 cursor-pointer'
                }`}
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
                    {course.completed ? (
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

                  {/* Selection Indicator */}
                  {course.completed && selectedCourse === course.id && (
                    <div className="absolute top-5 right-5">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Select to Mint Button (for completed courses) */}
                {course.completed && selectedCourse !== course.id && (
                  <button
                    className="mt-4 w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-sm"
                  >
                    Select to Mint
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer with Mint Button */}
        <div className="p-6 border-t border-slate-800">
          <button
            onClick={handleMintBadge}
            disabled={!hasSelection}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
              hasSelection
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-slate-800 text-gray-500 cursor-not-allowed'
            }`}
          >
            Mint Badge
          </button>
        </div>
      </div>
    </div>
  );
}
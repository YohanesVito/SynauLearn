import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Categories from '@/components/Categories';
import Courses from '@/components/Courses';

interface CoursesViewProps {
  onBack: () => void;
}

export default function CoursesView({ onBack }: CoursesViewProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold">All Courses</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <Categories />
        <Courses />
      </div>
    </div>
  );
}
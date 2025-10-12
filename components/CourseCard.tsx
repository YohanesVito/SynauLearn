"use client";

interface CourseCardProps {
  id: number;
  title: string;
  description: string;
  progress: number;
  image: string;
  bgColor: string;
  onClick?: (id: number) => void;
}

export default function CourseCard({
  id,
  title,
  description,
  progress,
  image,
  bgColor,
  onClick,
}: CourseCardProps) {
  return (
    <div 
      onClick={() => onClick?.(id)}
      className="bg-[#252841] rounded-3xl p-6 hover:bg-[#2a2d46] transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        </div>
        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${bgColor} flex items-center justify-center text-4xl ml-4 flex-shrink-0`}>
          {image}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Progress</span>
          <span className="text-blue-500 font-bold">{progress}%</span>
        </div>
        <div className="w-full bg-[#1a1d2e] rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
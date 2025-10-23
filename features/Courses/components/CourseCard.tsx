import { Progress } from "@/components/ui/progress";

type CourseCardProps = {
  id: number;
  title: string;
  description: string;
  progress: number;
  image: string;
  onClick?: (id: number) => void;
};

const CourseCard = ({
  id,
  title,
  description,
  progress,
  image,
  onClick,
}: CourseCardProps) => {
  return (
    <div
      onClick={() => onClick?.(id)}
      className="bg-[#252841] rounded-3xl p-4 hover:bg-[#2a2d46] transition-all cursor-pointer"
    >
      <div className="flex items-center justify-between gap-4">
        <div
          className={`w-20 h-20 rounded-2xl bg-primary-foreground flex items-center justify-center text-4xl flex-shrink-0`}
        >
          {image}
        </div>
        <div className="w-full flex flex-col">
          <h3 className="text-lg font-bold text-white">{title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        </div>
      </div>

      <div className="space-y-2 mt-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Progress</span>
          <span className="text-blue-500 font-bold">{progress}%</span>
        </div>
        <div>
          <Progress value={progress} className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default CourseCard;

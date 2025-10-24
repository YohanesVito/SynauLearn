import { useEffect, useState } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { API, Course } from "@/lib/api";
import Categories from "./components/Categories";
import CourseCard from "./components/CourseCard";
import LessonPage from "./components/LessonPage";
import LanguageFilter from "./components/LanguageFilter";

interface CourseWithProgress extends Course {
  progress: number;
}

interface CoursesPageProps {
  setIsLessonStart: React.Dispatch<React.SetStateAction<boolean>>;
}

const CoursesPage: React.FC<CoursesPageProps> = ({ setIsLessonStart }) => {
  const { context } = useMiniKit();
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<{
    courseId: string;
    lessonId: string;
    courseTitle: string;
  } | null>(null);

  // Auto-detect browser language on first load
  const [languageFilter, setLanguageFilter] = useState<'en' | 'id' | 'all'>(() => {
    if (typeof window !== 'undefined') {
      const browserLang = navigator.language.toLowerCase();
      return browserLang.startsWith('id') ? 'id' : 'en';
    }
    return 'en';
  });

  // Load courses and progress from Supabase
  useEffect(() => {
    async function loadCoursesWithProgress() {
      try {
        setLoading(true);

        // Get or create user
        let currentUserId = null;
        if (context?.user?.fid) {
          const user = await API.getUserOrCreate(
            context.user.fid,
            context.user.username,
            context.user.displayName
          );
          currentUserId = user.id;
          setUserId(user.id);
        }

        // Fetch courses
        const fetchedCourses = await API.getCourses();

        // Get progress for each course
        const coursesWithProgress = await Promise.all(
          fetchedCourses.map(async (course) => {
            let progress = 0;

            if (currentUserId) {
              progress = await API.getCourseProgressPercentage(
                currentUserId,
                course.id
              );
            }

            return {
              ...course,
              progress,
            };
          })
        );

        setCourses(coursesWithProgress);
      } catch (error) {
        console.error("Error loading courses:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCoursesWithProgress();
  }, [context]);

  const handleCourseClick = async (courseId: string) => {
    try {
      // Get first lesson for this course
      const lessons = await API.getLessonsForCourse(courseId);

      if (lessons.length > 0) {
        const course = courses.find((c) => c.id === courseId);
        setSelectedCourse({
          courseId,
          lessonId: lessons[0].id,
          courseTitle: course?.title || "Course",
        });
        setIsLessonStart(true);
      } else {
        alert("No lessons available for this course yet.");
      }
    } catch (error) {
      console.error("Error loading lessons:", error);
      alert("Failed to load lesson. Please try again.");
    }
  };

  const handleBack = async () => {
    setSelectedCourse(null);
    setIsLessonStart(false);

    // Reload courses to update progress
    if (userId) {
      try {
        const fetchedCourses = await API.getCourses();

        const coursesWithProgress = await Promise.all(
          fetchedCourses.map(async (course) => {
            const progress = await API.getCourseProgressPercentage(
              userId,
              course.id
            );
            return {
              ...course,
              progress,
            };
          })
        );

        setCourses(coursesWithProgress);
      } catch (error) {
        console.error("Error reloading courses:", error);
      }
    }
  };

  const handleLessonComplete = async () => {
    alert("Lesson completed! +100 XP total");
    setIsLessonStart(false);

    // Reload courses to update progress
    await handleBack();
  };

  // Show CardView when course is selected
  if (selectedCourse) {
    return (
      <LessonPage
        lessonId={selectedCourse.lessonId}
        courseTitle={selectedCourse.courseTitle}
        onBack={handleBack}
        onComplete={handleLessonComplete}
      />
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading courses...</p>
      </div>
    );
  }

  // Filter courses based on selected language
  const filteredCourses = courses.filter(course => {
    if (languageFilter === 'all') return true;
    return course.language === languageFilter;
  });

  return (
    <div className="flex flex-col p-4 gap-6">
      <h1 className="text-3xl font-bold text-white">Courses</h1>

      {/* Language Filter */}
      <LanguageFilter
        selected={languageFilter}
        onChange={setLanguageFilter}
      />

      <Categories />

      <div className="space-y-4">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">
              {languageFilter === 'id'
                ? 'Belum ada kursus dalam Bahasa Indonesia. Silakan pilih "Semua" atau "English".'
                : 'No courses available in this language. Please select "All" or another language.'}
            </p>
          </div>
        ) : (
          filteredCourses.map((course, index) => {
            return (
              <CourseCard
                key={course.id}
                id={index + 1}
                title={course.title}
                description={course.description}
                progress={course.progress}
                image={course.emoji}
                onClick={() => handleCourseClick(course.id)}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default CoursesPage;

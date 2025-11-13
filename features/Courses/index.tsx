import { useEffect, useState } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { API, Course, Category } from "@/lib/api";
import { DifficultyLevel } from "@/lib/supabase";
import Categories from "./components/Categories";
import CourseCard from "./components/CourseCard";
import LessonPage from "./components/LessonPage";
import LanguageFilter from "./components/LanguageFilter";
import CategoryAccordion from "./components/CategoryAccordion";
import { useLocale } from '@/lib/LocaleContext';
import { List, Grid3x3, Search, X } from 'lucide-react';

interface CourseWithProgress extends Course {
  progress: number;
}

interface CoursesPageProps {
  setIsLessonStart: React.Dispatch<React.SetStateAction<boolean>>;
}

const CoursesPage: React.FC<CoursesPageProps> = ({ setIsLessonStart }) => {
  const { t } = useLocale();
  const { context } = useMiniKit();
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
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

  // Category/Difficulty filter
  const [categoryFilter, setCategoryFilter] = useState<DifficultyLevel>('Basic');

  // View mode: 'list' or 'category'
  const [viewMode, setViewMode] = useState<'list' | 'category'>('category');

  // Search query
  const [searchQuery, setSearchQuery] = useState<string>('');

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

        // Fetch categories
        const fetchedCategories = await API.getCategories();
        setCategories(fetchedCategories);

        // Fetch courses with category data
        const fetchedCourses = await API.getCoursesWithCategories();

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
        alert(t('courses.noLessonsAvailable'));
      }
    } catch (error) {
      console.error("Error loading lessons:", error);
      alert(t('courses.failedToLoad'));
    }
  };

  const handleBack = async () => {
    setSelectedCourse(null);
    setIsLessonStart(false);

    // Reload courses to update progress
    if (userId) {
      try {
        const fetchedCourses = await API.getCoursesWithCategories();

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
        <p className="text-gray-400">{t('courses.loading')}</p>
      </div>
    );
  }

  // Filter courses based on selected language, difficulty, and search query
  const filteredCourses = courses.filter(course => {
    // Filter by language
    const matchesLanguage = languageFilter === 'all' || course.language === languageFilter;

    // Filter by difficulty
    const matchesDifficulty = course.difficulty === categoryFilter;

    // Filter by search query (searches in title and description)
    const matchesSearch = searchQuery.trim() === '' ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesLanguage && matchesDifficulty && matchesSearch;
  });

  return (
    <div className="flex flex-col p-4 gap-6">
      <h1 className="text-3xl font-bold text-white dark:text-gray-100">{t('courses.title')}</h1>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('courses.searchPlaceholder')}
          className="w-full pl-10 pr-10 py-3 bg-slate-800 dark:bg-slate-800 border border-slate-700 dark:border-slate-600 rounded-xl text-white dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-gray-300 transition-colors" />
          </button>
        )}
      </div>

      {/* Language Filter */}
      <LanguageFilter
        selected={languageFilter}
        onChange={setLanguageFilter}
      />

      {/* Difficulty Category Filter (only in list view) */}
      {viewMode === 'list' && (
        <Categories
          selected={categoryFilter}
          onSelect={setCategoryFilter}
        />
      )}

      {/* View Mode Toggle */}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setViewMode('category')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            viewMode === 'category'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
          }`}
        >
          <Grid3x3 className="w-4 h-4" />
          {t('courses.viewByCategory')}
        </button>
        <button
          onClick={() => setViewMode('list')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            viewMode === 'list'
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
          }`}
        >
          <List className="w-4 h-4" />
          {t('courses.viewAsList')}
        </button>
      </div>

      <div className="space-y-4">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">
              {languageFilter === 'id'
                ? t('courses.noCoursesIndonesian')
                : t('courses.noCoursesEnglish')}
            </p>
          </div>
        ) : viewMode === 'category' ? (
          <CategoryAccordion
            categories={categories}
            courses={filteredCourses.map(c => ({
              ...c,
              progressPercentage: c.progress
            }))}
            onCourseClick={handleCourseClick}
          />
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

"use client";

import { useState, useEffect } from "react";
import CourseCard from "./CourseCard";
import CardView from "./CardView";
import { API, Course } from "@/lib/api";

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<{
    courseId: string;
    lessonId: string;
    courseTitle: string;
  } | null>(null);

  // Load courses from Supabase
  useEffect(() => {
    async function loadCourses() {
      try {
        setLoading(true);
        const fetchedCourses = await API.getCourses();
        setCourses(fetchedCourses);
      } catch (error) {
        console.error("Error loading courses:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  const handleCourseClick = async (courseId: string) => {
    try {
      // Get first lesson for this course
      const lessons = await API.getLessonsForCourse(courseId);
      
      if (lessons.length > 0) {
        const course = courses.find(c => c.id === courseId);
        setSelectedCourse({
          courseId,
          lessonId: lessons[0].id,
          courseTitle: course?.title || "Course",
        });
      } else {
        alert("No lessons available for this course yet.");
      }
    } catch (error) {
      console.error("Error loading lessons:", error);
      alert("Failed to load lesson. Please try again.");
    }
  };

  const handleBack = () => {
    setSelectedCourse(null);
  };

  const handleLessonComplete = async () => {
    // TODO: Update course progress
    alert("Lesson completed! +100 XP total");
    setSelectedCourse(null);
  };

  // Show CardView when course is selected
  if (selectedCourse) {
    return (
      <CardView
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

  // Show course list
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Courses</h2>

      <div className="relative mb-6">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search for a course..."
          className="w-full bg-[#2a2d42] text-white placeholder-gray-500 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
        />
      </div>

      <div className="space-y-4">
        {courses.map((course, index) => {
          // Color gradients for courses
          const gradients = [
            "from-orange-500 to-yellow-600",
            "from-yellow-500 to-orange-600",
            "from-green-400 to-blue-500",
          ];

          return (
            <CourseCard
              key={course.id}
              id={index + 1}
              title={course.title}
              description={course.description}
              progress={0} // TODO: Calculate real progress
              image={course.emoji}
              bgColor={gradients[index % gradients.length]}
              onClick={() => handleCourseClick(course.id)}
            />
          );
        })}
      </div>
    </div>
  );
}
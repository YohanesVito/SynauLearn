"use client";

import { useState } from "react";
import CourseCard from "./CourseCard";
import CardView from "./CardView";

const courses = [
  {
    id: 1,
    title: "Blockchain Basics",
    description: "Understand the core concepts of blockchain technology.",
    progress: 75,
    image: "🔗",
    bgColor: "from-orange-500 to-yellow-600",
  },
  {
    id: 2,
    title: "Cryptocurrency Fundamentals",
    description: "Learn about Bitcoin, Ethereum, and other cryptocurrencies.",
    progress: 50,
    image: "₿",
    bgColor: "from-yellow-500 to-orange-600",
  },
  {
    id: 3,
    title: "Introduction to NFTs",
    description: "Discover non-fungible tokens and their use cases.",
    progress: 10,
    image: "🌱",
    bgColor: "from-gray-300 to-gray-100",
  },
];

export default function Courses() {
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);

  const handleCourseClick = (courseId: number) => {
    setSelectedCourse(courseId);
  };

  const handleBack = () => {
    setSelectedCourse(null);
  };

  const handleLessonComplete = () => {
    // TODO: Save progress to backend
    alert("Lesson completed! +100 XP total");
    setSelectedCourse(null);
  };

  // Show CardView when course is selected
  if (selectedCourse) {
    const course = courses.find((c) => c.id === selectedCourse);
    return (
      <CardView
        courseTitle={course?.title || "Course"}
        onBack={handleBack}
        onComplete={handleLessonComplete}
      />
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
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            {...course}
            onClick={handleCourseClick}
          />
        ))}
      </div>
    </div>
  );
}
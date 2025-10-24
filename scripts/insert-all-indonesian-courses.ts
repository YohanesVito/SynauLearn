/**
 * Script to insert ALL Indonesian courses (Basic, Advanced, Professional) into Supabase
 *
 * Usage:
 * 1. Make sure you have .env file with SUPABASE_URL and SUPABASE_ANON_KEY
 * 2. Run migration_add_difficulty.sql first!
 * 3. Run: npm run insert-all-indonesian-courses
 */

import { supabase } from '../lib/supabase';
import coursesData from '../database/indonesian_courses_all_levels.json';

async function insertAllIndonesianCourses() {
  try {
    console.log('🚀 Starting insertion of ALL Indonesian courses...\n');
    console.log(`📦 Total courses to insert: ${coursesData.courses.length}`);
    console.log('');

    let totalLessons = 0;
    let totalCards = 0;

    for (const courseData of coursesData.courses) {
      console.log('═══════════════════════════════════════════════════════════');
      console.log(`📚 Course: ${courseData.title}`);
      console.log(`   Difficulty: ${courseData.difficulty}`);
      console.log(`   Language: ${courseData.language}`);
      console.log('═══════════════════════════════════════════════════════════');
      console.log('');

      // Step 1: Insert Course
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .insert({
          title: courseData.title,
          description: courseData.description,
          emoji: courseData.emoji,
          language: courseData.language,
          difficulty: courseData.difficulty,
          total_lessons: courseData.lessons.length,
        })
        .select()
        .single();

      if (courseError) {
        throw new Error(`Failed to insert course "${courseData.title}": ${courseError.message}`);
      }

      console.log(`✅ Course inserted with ID: ${course.id}`);
      console.log('');

      // Step 2: Insert Lessons
      for (const lessonData of courseData.lessons) {
        console.log(`   📖 Lesson ${lessonData.lesson_number}: ${lessonData.title}`);

        const { data: lesson, error: lessonError } = await supabase
          .from('lessons')
          .insert({
            course_id: course.id,
            lesson_number: lessonData.lesson_number,
            title: lessonData.title,
            total_cards: lessonData.cards.length,
          })
          .select()
          .single();

        if (lessonError) {
          throw new Error(`Failed to insert lesson: ${lessonError.message}`);
        }

        console.log(`      ✅ Lesson inserted with ID: ${lesson.id}`);
        totalLessons++;

        // Step 3: Insert Cards for this lesson
        for (const cardData of lessonData.cards) {
          const { error: cardError } = await supabase
            .from('cards')
            .insert({
              lesson_id: lesson.id,
              card_number: cardData.card_number,
              flashcard_question: cardData.flashcard_question,
              flashcard_answer: cardData.flashcard_answer,
              quiz_question: cardData.quiz_question,
              quiz_option_a: cardData.quiz_option_a,
              quiz_option_b: cardData.quiz_option_b,
              quiz_option_c: cardData.quiz_option_c,
              quiz_option_d: cardData.quiz_option_d,
              quiz_correct_answer: cardData.quiz_correct_answer,
            });

          if (cardError) {
            throw new Error(`Failed to insert card: ${cardError.message}`);
          }

          totalCards++;
        }

        console.log(`      ✅ ${lessonData.cards.length} cards inserted`);
        console.log('');
      }

      console.log(`✅ Course "${courseData.title}" completed!`);
      console.log('');
    }

    console.log('');
    console.log('🎉🎉🎉 SUCCESS! ALL Indonesian courses inserted! 🎉🎉🎉');
    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 SUMMARY');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`   Total Courses: ${coursesData.courses.length}`);
    console.log(`   Total Lessons: ${totalLessons}`);
    console.log(`   Total Cards: ${totalCards}`);
    console.log('');
    console.log('📚 Courses by Difficulty:');
    console.log(`   ✓ Basic: Pengenalan Blockchain`);
    console.log(`   ✓ Advanced: DeFi dan Smart Contract`);
    console.log(`   ✓ Professional: Arsitektur Blockchain Profesional`);
    console.log('');
    console.log('🌐 Ready to view in your app!');
    console.log('   1. Make sure difficulty migration ran successfully');
    console.log('   2. Start app: npm run dev');
    console.log('   3. Filter by: 🇮🇩 Bahasa Indonesia');
    console.log('   4. Switch categories: Basic / Advanced / Professional');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    console.error('');
    console.error('💡 Troubleshooting:');
    console.error('   1. Make sure you ran migration_add_difficulty.sql first');
    console.error('   2. Check your .env file has correct Supabase credentials');
    console.error('   3. Verify database connection');
    process.exit(1);
  }
}

// Run the script
insertAllIndonesianCourses();

/**
 * Script to insert Indonesian course content into Supabase
 *
 * Usage:
 * 1. Make sure you have .env file with SUPABASE_URL and SUPABASE_ANON_KEY
 * 2. Run: npx tsx scripts/insert-indonesian-course.ts
 */

import { supabase } from '../lib/supabase';
import courseData from '../database/indonesian_course_example.json';

async function insertIndonesianCourse() {
  try {
    console.log('🚀 Starting Indonesian course insertion...\n');

    // Step 1: Insert Course
    console.log('📚 Inserting course:', courseData.course.title);
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .insert({
        title: courseData.course.title,
        description: courseData.course.description,
        emoji: courseData.course.emoji,
        language: courseData.course.language,
        total_lessons: courseData.course.lessons.length,
      })
      .select()
      .single();

    if (courseError) {
      throw new Error(`Failed to insert course: ${courseError.message}`);
    }

    console.log('✅ Course inserted with ID:', course.id);
    console.log('');

    // Step 2: Insert Lessons
    for (const lessonData of courseData.course.lessons) {
      console.log(`📖 Inserting Lesson ${lessonData.lesson_number}: ${lessonData.title}`);

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

      console.log(`   ✅ Lesson inserted with ID: ${lesson.id}`);

      // Step 3: Insert Cards for this lesson
      for (const cardData of lessonData.cards) {
        console.log(`   🃏 Inserting Card ${cardData.card_number}...`);

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

        console.log(`      ✅ Card ${cardData.card_number} inserted`);
      }

      console.log('');
    }

    console.log('🎉 SUCCESS! Indonesian course has been inserted successfully!');
    console.log('');
    console.log('📊 Summary:');
    console.log(`   Course: ${courseData.course.title}`);
    console.log(`   Lessons: ${courseData.course.lessons.length}`);
    console.log(`   Total Cards: ${courseData.course.lessons.reduce((sum, l) => sum + l.cards.length, 0)}`);
    console.log('');
    console.log('🌐 You can now view this course in your app!');
    console.log('   Filter by: 🇮🇩 Bahasa Indonesia');

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run the script
insertIndonesianCourse();

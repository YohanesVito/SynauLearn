-- ============================================
-- Delete Course and All Related Data
-- ============================================
-- Course ID: eb21ad07-7183-470d-8888-7f41796de1c7
--
-- ⚠️ WARNING: This will permanently delete:
-- - The course
-- - All lessons in this course
-- - All cards in those lessons
-- - All user progress for those cards
-- - All user course progress
-- - All minted badges for this course
--
-- ⚠️ BACKUP FIRST: Export data before running this!
-- ============================================

-- Step 1: Get course info (for verification)
SELECT
  id,
  title,
  description,
  language,
  difficulty,
  total_lessons,
  created_at
FROM courses
WHERE id = 'eb21ad07-7183-470d-8888-7f41796de1c7';

-- Step 2: Get lessons count (for verification)
SELECT COUNT(*) as lesson_count
FROM lessons
WHERE course_id = 'eb21ad07-7183-470d-8888-7f41796de1c7';

-- Step 3: Get cards count (for verification)
SELECT COUNT(*) as card_count
FROM cards
WHERE lesson_id IN (
  SELECT id FROM lessons
  WHERE course_id = 'eb21ad07-7183-470d-8888-7f41796de1c7'
);

-- ============================================
-- DELETION STARTS HERE
-- ============================================

-- Step 4: Delete user card progress
-- (Progress for cards in lessons of this course)
DELETE FROM user_card_progress
WHERE card_id IN (
  SELECT c.id
  FROM cards c
  JOIN lessons l ON c.lesson_id = l.id
  WHERE l.course_id = 'eb21ad07-7183-470d-8888-7f41796de1c7'
);

-- Step 5: Delete user course progress
DELETE FROM user_course_progress
WHERE course_id = 'eb21ad07-7183-470d-8888-7f41796de1c7';

-- Step 6: Delete minted badges for this course
DELETE FROM minted_badges
WHERE course_id = 'eb21ad07-7183-470d-8888-7f41796de1c7';

-- Step 7: Delete all cards in lessons of this course
DELETE FROM cards
WHERE lesson_id IN (
  SELECT id FROM lessons
  WHERE course_id = 'eb21ad07-7183-470d-8888-7f41796de1c7'
);

-- Step 8: Delete all lessons in this course
DELETE FROM lessons
WHERE course_id = 'eb21ad07-7183-470d-8888-7f41796de1c7';

-- Step 9: Delete the course itself
DELETE FROM courses
WHERE id = 'eb21ad07-7183-470d-8888-7f41796de1c7';

-- ============================================
-- VERIFICATION
-- ============================================

-- Verify course is deleted
SELECT COUNT(*) as remaining_courses_with_this_id
FROM courses
WHERE id = 'eb21ad07-7183-470d-8888-7f41796de1c7';
-- Expected: 0

-- Verify lessons are deleted
SELECT COUNT(*) as remaining_lessons_for_this_course
FROM lessons
WHERE course_id = 'eb21ad07-7183-470d-8888-7f41796de1c7';
-- Expected: 0

-- Verify cards are deleted
SELECT COUNT(*) as remaining_cards_for_this_course
FROM cards
WHERE lesson_id IN (
  SELECT id FROM lessons
  WHERE course_id = 'eb21ad07-7183-470d-8888-7f41796de1c7'
);
-- Expected: 0

-- Show remaining courses
SELECT
  id,
  title,
  language,
  difficulty,
  total_lessons
FROM courses
ORDER BY language, difficulty, created_at;

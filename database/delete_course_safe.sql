-- ============================================
-- SAFE DELETE: Course e7020156-f1ec-4fa2-afd3-2660da6b6719
-- ============================================
-- This version uses a transaction with rollback capability
-- ============================================

BEGIN;

-- Show what will be deleted
SELECT 'Course to be deleted:' as info;
SELECT id, title, description, language, difficulty
FROM courses
WHERE id = 'e7020156-f1ec-4fa2-afd3-2660da6b6719';

SELECT 'Lessons to be deleted:' as info;
SELECT id, lesson_number, title, total_cards
FROM lessons
WHERE course_id = 'e7020156-f1ec-4fa2-afd3-2660da6b6719';

SELECT 'Cards to be deleted:' as info;
SELECT COUNT(*) as total_cards
FROM cards
WHERE lesson_id IN (
  SELECT id FROM lessons
  WHERE course_id = 'e7020156-f1ec-4fa2-afd3-2660da6b6719'
);

-- Deletion with CASCADE (if foreign keys are set up)
-- If you have foreign key constraints with ON DELETE CASCADE, this is simpler:

DELETE FROM courses
WHERE id = 'e7020156-f1ec-4fa2-afd3-2660da6b6719';

-- If foreign keys NOT set up with CASCADE, use the detailed version:
-- Uncomment the section below and comment out the single DELETE above

/*
DELETE FROM user_card_progress
WHERE card_id IN (
  SELECT c.id FROM cards c
  JOIN lessons l ON c.lesson_id = l.id
  WHERE l.course_id = 'e7020156-f1ec-4fa2-afd3-2660da6b6719'
);

DELETE FROM user_course_progress
WHERE course_id = 'e7020156-f1ec-4fa2-afd3-2660da6b6719';

DELETE FROM minted_badges
WHERE course_id = 'e7020156-f1ec-4fa2-afd3-2660da6b6719';

DELETE FROM cards
WHERE lesson_id IN (
  SELECT id FROM lessons
  WHERE course_id = 'e7020156-f1ec-4fa2-afd3-2660da6b6719'
);

DELETE FROM lessons
WHERE course_id = 'e7020156-f1ec-4fa2-afd3-2660da6b6719';

DELETE FROM courses
WHERE id = 'e7020156-f1ec-4fa2-afd3-2660da6b6719';
*/

-- Verification
SELECT 'Verification - Course deleted:' as info;
SELECT COUNT(*) as should_be_zero
FROM courses
WHERE id = 'e7020156-f1ec-4fa2-afd3-2660da6b6719';

-- ============================================
-- DECISION POINT:
-- Run COMMIT to apply changes
-- Run ROLLBACK to undo everything
-- ============================================

-- To apply the deletion:
-- COMMIT;

-- To cancel and undo:
-- ROLLBACK;

-- ⚠️ IMPORTANT:
-- Review the output above, then uncomment either COMMIT or ROLLBACK

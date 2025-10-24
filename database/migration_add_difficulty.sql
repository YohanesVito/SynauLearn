-- ============================================
-- Migration: Add difficulty level to courses
-- ============================================

-- Step 1: Add difficulty column to courses table
ALTER TABLE courses
ADD COLUMN difficulty VARCHAR(20) DEFAULT 'Basic';

-- Step 2: Add check constraint to ensure only valid difficulty levels
ALTER TABLE courses
ADD CONSTRAINT courses_difficulty_check
CHECK (difficulty IN ('Basic', 'Advanced', 'Professional'));

-- Step 3: Create index for faster difficulty filtering
CREATE INDEX idx_courses_difficulty ON courses(difficulty);

-- Step 4: Update existing courses to have 'Basic' difficulty (if not already set)
UPDATE courses
SET difficulty = 'Basic'
WHERE difficulty IS NULL;

-- Step 5: Make difficulty column NOT NULL
ALTER TABLE courses
ALTER COLUMN difficulty SET NOT NULL;

-- Step 6: Create composite index for language + difficulty filtering (performance optimization)
CREATE INDEX idx_courses_language_difficulty ON courses(language, difficulty);

-- ============================================
-- Verification Query
-- ============================================
-- Run this to verify the migration succeeded:
-- SELECT id, title, language, difficulty FROM courses;

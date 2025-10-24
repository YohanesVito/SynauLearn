-- ============================================
-- Migration: Add language support to courses
-- ============================================

-- Step 1: Add language column to courses table
ALTER TABLE courses
ADD COLUMN language VARCHAR(5) DEFAULT 'en';

-- Step 2: Add check constraint to ensure only valid languages
ALTER TABLE courses
ADD CONSTRAINT courses_language_check
CHECK (language IN ('en', 'id'));

-- Step 3: Create index for faster language filtering
CREATE INDEX idx_courses_language ON courses(language);

-- Step 4: Update existing courses to have 'en' language (if not already set)
UPDATE courses
SET language = 'en'
WHERE language IS NULL;

-- Step 5: Make language column NOT NULL
ALTER TABLE courses
ALTER COLUMN language SET NOT NULL;

-- ============================================
-- Verification Query
-- ============================================
-- Run this to verify the migration succeeded:
-- SELECT id, title, language FROM courses;

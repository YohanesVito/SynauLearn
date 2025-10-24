-- ============================================
-- Migration: Convert UUID to Numeric IDs
-- ============================================
-- This migration converts all primary keys from UUID to SERIAL (auto-increment integers)
-- This eliminates the need for courseMapping.ts and simplifies smart contract integration
--
-- ⚠️ WARNING: This is a destructive migration that will:
-- 1. Drop and recreate all tables
-- 2. Preserve existing data with new numeric IDs
-- 3. Update all foreign key references
--
-- BACKUP YOUR DATA BEFORE RUNNING THIS!
--
-- Recommended approach:
-- 1. Export existing data first
-- 2. Run this migration
-- 3. Verify all data is intact
-- ============================================

BEGIN;

-- ============================================
-- STEP 1: Create temporary backup tables
-- ============================================

-- Backup users
CREATE TABLE users_backup AS SELECT * FROM users;

-- Backup categories
CREATE TABLE categories_backup AS SELECT * FROM categories;

-- Backup courses
CREATE TABLE courses_backup AS SELECT * FROM courses;

-- Backup lessons
CREATE TABLE lessons_backup AS SELECT * FROM lessons;

-- Backup cards
CREATE TABLE cards_backup AS SELECT * FROM cards;

-- Backup user_card_progress
CREATE TABLE user_card_progress_backup AS SELECT * FROM user_card_progress;

-- Backup user_course_progress
CREATE TABLE user_course_progress_backup AS SELECT * FROM user_course_progress;

-- Backup minted_badges
CREATE TABLE minted_badges_backup AS SELECT * FROM minted_badges;

-- ============================================
-- STEP 2: Drop existing tables (cascading)
-- ============================================

DROP TABLE IF EXISTS minted_badges CASCADE;
DROP TABLE IF EXISTS user_course_progress CASCADE;
DROP TABLE IF EXISTS user_card_progress CASCADE;
DROP TABLE IF EXISTS cards CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================
-- STEP 3: Recreate tables with numeric IDs
-- ============================================

-- Users table (numeric ID)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  fid INTEGER UNIQUE NOT NULL,
  username VARCHAR(255),
  display_name VARCHAR(255),
  total_xp INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Categories table (numeric ID)
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  name_id VARCHAR(255) NOT NULL,
  description TEXT,
  description_id TEXT,
  emoji VARCHAR(10),
  slug VARCHAR(100) UNIQUE NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Courses table (numeric ID)
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  emoji VARCHAR(10),
  language VARCHAR(2) DEFAULT 'en',
  difficulty VARCHAR(50) DEFAULT 'Basic',
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  total_lessons INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Lessons table (numeric ID)
CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  lesson_number INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(course_id, lesson_number)
);

-- Cards table (numeric ID)
CREATE TABLE cards (
  id SERIAL PRIMARY KEY,
  lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  card_number INTEGER NOT NULL,
  flashcard_question TEXT,
  flashcard_answer TEXT,
  quiz_question TEXT,
  quiz_option_a TEXT,
  quiz_option_b TEXT,
  quiz_option_c TEXT,
  quiz_option_d TEXT,
  quiz_correct_answer VARCHAR(1),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(lesson_id, card_number)
);

-- User card progress (numeric IDs)
CREATE TABLE user_card_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  card_id INTEGER REFERENCES cards(id) ON DELETE CASCADE,
  flashcard_viewed BOOLEAN DEFAULT FALSE,
  quiz_completed BOOLEAN DEFAULT FALSE,
  quiz_correct BOOLEAN DEFAULT FALSE,
  xp_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, card_id)
);

-- User course progress (numeric IDs)
CREATE TABLE user_course_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  cards_completed INTEGER DEFAULT 0,
  total_xp_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Minted badges (numeric IDs)
CREATE TABLE minted_badges (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  wallet_address VARCHAR(42) NOT NULL,
  token_id VARCHAR(255) NOT NULL,
  tx_hash VARCHAR(66) NOT NULL,
  minted_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- ============================================
-- STEP 4: Create UUID to numeric ID mapping tables
-- ============================================

CREATE TABLE uuid_mapping_users (
  old_uuid UUID,
  new_id INTEGER,
  PRIMARY KEY (old_uuid)
);

CREATE TABLE uuid_mapping_categories (
  old_uuid UUID,
  new_id INTEGER,
  PRIMARY KEY (old_uuid)
);

CREATE TABLE uuid_mapping_courses (
  old_uuid UUID,
  new_id INTEGER,
  PRIMARY KEY (old_uuid)
);

CREATE TABLE uuid_mapping_lessons (
  old_uuid UUID,
  new_id INTEGER,
  PRIMARY KEY (old_uuid)
);

CREATE TABLE uuid_mapping_cards (
  old_uuid UUID,
  new_id INTEGER,
  PRIMARY KEY (old_uuid)
);

-- ============================================
-- STEP 5: Restore data with new numeric IDs
-- ============================================

-- Restore users and create mapping
-- Handle case where updated_at might not exist in old schema
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_name = 'users_backup' AND column_name = 'updated_at'
  ) THEN
    INSERT INTO users (fid, username, display_name, total_xp, created_at, updated_at)
    SELECT fid, username, display_name, total_xp, created_at, updated_at
    FROM users_backup
    ORDER BY created_at;
  ELSE
    INSERT INTO users (fid, username, display_name, total_xp, created_at)
    SELECT fid, username, display_name, total_xp, created_at
    FROM users_backup
    ORDER BY created_at;
  END IF;
END $$;

-- Create user UUID mapping
INSERT INTO uuid_mapping_users (old_uuid, new_id)
SELECT ub.id, u.id
FROM users_backup ub
JOIN users u ON u.fid = ub.fid;

-- Restore categories and create mapping (if exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'categories_backup') THEN
    INSERT INTO categories (name, name_id, description, description_id, emoji, slug, order_index, created_at, updated_at)
    SELECT name, name_id, description, description_id, emoji, slug, order_index, created_at, updated_at
    FROM categories_backup
    ORDER BY order_index, created_at;

    -- Create category UUID mapping
    INSERT INTO uuid_mapping_categories (old_uuid, new_id)
    SELECT cb.id, c.id
    FROM categories_backup cb
    JOIN categories c ON c.slug = cb.slug;
  END IF;
END $$;

-- Restore courses and create mapping
-- Handle case where updated_at might not exist in old schema
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_name = 'courses_backup' AND column_name = 'updated_at'
  ) THEN
    INSERT INTO courses (title, description, emoji, language, difficulty, category_id, total_lessons, created_at, updated_at)
    SELECT
      cb.title,
      cb.description,
      cb.emoji,
      cb.language,
      cb.difficulty,
      CASE
        WHEN cb.category_id IS NOT NULL THEN (SELECT new_id FROM uuid_mapping_categories WHERE old_uuid = cb.category_id)
        ELSE NULL
      END as category_id,
      cb.total_lessons,
      cb.created_at,
      cb.updated_at
    FROM courses_backup cb
    ORDER BY cb.created_at;
  ELSE
    INSERT INTO courses (title, description, emoji, language, difficulty, category_id, total_lessons, created_at)
    SELECT
      cb.title,
      cb.description,
      cb.emoji,
      cb.language,
      cb.difficulty,
      CASE
        WHEN cb.category_id IS NOT NULL THEN (SELECT new_id FROM uuid_mapping_categories WHERE old_uuid = cb.category_id)
        ELSE NULL
      END as category_id,
      cb.total_lessons,
      cb.created_at
    FROM courses_backup cb
    ORDER BY cb.created_at;
  END IF;
END $$;

-- Create course UUID mapping
INSERT INTO uuid_mapping_courses (old_uuid, new_id)
SELECT cb.id, c.id
FROM courses_backup cb
JOIN courses c ON c.title = cb.title AND c.created_at = cb.created_at;

-- Restore lessons and create mapping
-- Handle case where updated_at might not exist in old schema
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_name = 'lessons_backup' AND column_name = 'updated_at'
  ) THEN
    INSERT INTO lessons (course_id, title, lesson_number, created_at, updated_at)
    SELECT
      (SELECT new_id FROM uuid_mapping_courses WHERE old_uuid = lb.course_id),
      lb.title,
      lb.lesson_number,
      lb.created_at,
      lb.updated_at
    FROM lessons_backup lb
    ORDER BY lb.created_at;
  ELSE
    INSERT INTO lessons (course_id, title, lesson_number, created_at)
    SELECT
      (SELECT new_id FROM uuid_mapping_courses WHERE old_uuid = lb.course_id),
      lb.title,
      lb.lesson_number,
      lb.created_at
    FROM lessons_backup lb
    ORDER BY lb.created_at;
  END IF;
END $$;

-- Create lesson UUID mapping
INSERT INTO uuid_mapping_lessons (old_uuid, new_id)
SELECT lb.id, l.id
FROM lessons_backup lb
JOIN lessons l ON
  l.course_id = (SELECT new_id FROM uuid_mapping_courses WHERE old_uuid = lb.course_id)
  AND l.lesson_number = lb.lesson_number;

-- Restore cards and create mapping
-- Handle case where updated_at might not exist in old schema
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_name = 'cards_backup' AND column_name = 'updated_at'
  ) THEN
    INSERT INTO cards (
      lesson_id, card_number, flashcard_question, flashcard_answer,
      quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d,
      quiz_correct_answer, created_at, updated_at
    )
    SELECT
      (SELECT new_id FROM uuid_mapping_lessons WHERE old_uuid = cb.lesson_id),
      cb.card_number,
      cb.flashcard_question,
      cb.flashcard_answer,
      cb.quiz_question,
      cb.quiz_option_a,
      cb.quiz_option_b,
      cb.quiz_option_c,
      cb.quiz_option_d,
      cb.quiz_correct_answer,
      cb.created_at,
      cb.updated_at
    FROM cards_backup cb
    ORDER BY cb.created_at;
  ELSE
    INSERT INTO cards (
      lesson_id, card_number, flashcard_question, flashcard_answer,
      quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d,
      quiz_correct_answer, created_at
    )
    SELECT
      (SELECT new_id FROM uuid_mapping_lessons WHERE old_uuid = cb.lesson_id),
      cb.card_number,
      cb.flashcard_question,
      cb.flashcard_answer,
      cb.quiz_question,
      cb.quiz_option_a,
      cb.quiz_option_b,
      cb.quiz_option_c,
      cb.quiz_option_d,
      cb.quiz_correct_answer,
      cb.created_at
    FROM cards_backup cb
    ORDER BY cb.created_at;
  END IF;
END $$;

-- Create card UUID mapping
INSERT INTO uuid_mapping_cards (old_uuid, new_id)
SELECT cb.id, c.id
FROM cards_backup cb
JOIN cards c ON
  c.lesson_id = (SELECT new_id FROM uuid_mapping_lessons WHERE old_uuid = cb.lesson_id)
  AND c.card_number = cb.card_number;

-- Restore user_card_progress
-- Handle case where updated_at might not exist in old schema
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_name = 'user_card_progress_backup' AND column_name = 'updated_at'
  ) THEN
    INSERT INTO user_card_progress (
      user_id, card_id, flashcard_viewed, quiz_completed, quiz_correct,
      xp_earned, completed_at, created_at, updated_at
    )
    SELECT
      (SELECT new_id FROM uuid_mapping_users WHERE old_uuid = ucp.user_id),
      (SELECT new_id FROM uuid_mapping_cards WHERE old_uuid = ucp.card_id),
      ucp.flashcard_viewed,
      ucp.quiz_completed,
      ucp.quiz_correct,
      ucp.xp_earned,
      ucp.completed_at,
      ucp.created_at,
      ucp.updated_at
    FROM user_card_progress_backup ucp
    WHERE EXISTS (SELECT 1 FROM uuid_mapping_users WHERE old_uuid = ucp.user_id)
      AND EXISTS (SELECT 1 FROM uuid_mapping_cards WHERE old_uuid = ucp.card_id);
  ELSE
    INSERT INTO user_card_progress (
      user_id, card_id, flashcard_viewed, quiz_completed, quiz_correct,
      xp_earned, completed_at, created_at
    )
    SELECT
      (SELECT new_id FROM uuid_mapping_users WHERE old_uuid = ucp.user_id),
      (SELECT new_id FROM uuid_mapping_cards WHERE old_uuid = ucp.card_id),
      ucp.flashcard_viewed,
      ucp.quiz_completed,
      ucp.quiz_correct,
      ucp.xp_earned,
      ucp.completed_at,
      ucp.created_at
    FROM user_card_progress_backup ucp
    WHERE EXISTS (SELECT 1 FROM uuid_mapping_users WHERE old_uuid = ucp.user_id)
      AND EXISTS (SELECT 1 FROM uuid_mapping_cards WHERE old_uuid = ucp.card_id);
  END IF;
END $$;

-- Restore user_course_progress
-- Handle case where updated_at might not exist in old schema
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_name = 'user_course_progress_backup' AND column_name = 'updated_at'
  ) THEN
    INSERT INTO user_course_progress (
      user_id, course_id, cards_completed, total_xp_earned, completed_at,
      created_at, updated_at
    )
    SELECT
      (SELECT new_id FROM uuid_mapping_users WHERE old_uuid = ucp.user_id),
      (SELECT new_id FROM uuid_mapping_courses WHERE old_uuid = ucp.course_id),
      ucp.cards_completed,
      ucp.total_xp_earned,
      ucp.completed_at,
      ucp.created_at,
      ucp.updated_at
    FROM user_course_progress_backup ucp
    WHERE EXISTS (SELECT 1 FROM uuid_mapping_users WHERE old_uuid = ucp.user_id)
      AND EXISTS (SELECT 1 FROM uuid_mapping_courses WHERE old_uuid = ucp.course_id);
  ELSE
    INSERT INTO user_course_progress (
      user_id, course_id, cards_completed, total_xp_earned, completed_at,
      created_at
    )
    SELECT
      (SELECT new_id FROM uuid_mapping_users WHERE old_uuid = ucp.user_id),
      (SELECT new_id FROM uuid_mapping_courses WHERE old_uuid = ucp.course_id),
      ucp.cards_completed,
      ucp.total_xp_earned,
      ucp.completed_at,
      ucp.created_at
    FROM user_course_progress_backup ucp
    WHERE EXISTS (SELECT 1 FROM uuid_mapping_users WHERE old_uuid = ucp.user_id)
      AND EXISTS (SELECT 1 FROM uuid_mapping_courses WHERE old_uuid = ucp.course_id);
  END IF;
END $$;

-- Restore minted_badges
INSERT INTO minted_badges (
  user_id, course_id, wallet_address, token_id, tx_hash, minted_at, created_at
)
SELECT
  (SELECT new_id FROM uuid_mapping_users WHERE old_uuid = mb.user_id),
  (SELECT new_id FROM uuid_mapping_courses WHERE old_uuid = mb.course_id),
  mb.wallet_address,
  mb.token_id,
  mb.tx_hash,
  mb.minted_at,
  mb.created_at
FROM minted_badges_backup mb
WHERE EXISTS (SELECT 1 FROM uuid_mapping_users WHERE old_uuid = mb.user_id)
  AND EXISTS (SELECT 1 FROM uuid_mapping_courses WHERE old_uuid = mb.course_id);

-- ============================================
-- STEP 6: Create indexes for performance
-- ============================================

CREATE INDEX idx_courses_language ON courses(language);
CREATE INDEX idx_courses_difficulty ON courses(difficulty);
CREATE INDEX idx_courses_category_id ON courses(category_id);
CREATE INDEX idx_lessons_course_id ON lessons(course_id);
CREATE INDEX idx_cards_lesson_id ON cards(lesson_id);
CREATE INDEX idx_user_card_progress_user_id ON user_card_progress(user_id);
CREATE INDEX idx_user_card_progress_card_id ON user_card_progress(card_id);
CREATE INDEX idx_user_course_progress_user_id ON user_course_progress(user_id);
CREATE INDEX idx_user_course_progress_course_id ON user_course_progress(course_id);
CREATE INDEX idx_minted_badges_user_id ON minted_badges(user_id);
CREATE INDEX idx_minted_badges_course_id ON minted_badges(course_id);
CREATE INDEX idx_minted_badges_wallet ON minted_badges(wallet_address);

-- ============================================
-- STEP 7: Verification queries
-- ============================================

-- Show course ID mapping (old UUID to new numeric ID)
DO $$
DECLARE
  rec RECORD;
BEGIN
  RAISE NOTICE '=== Course ID Mapping (UUID → Numeric) ===';
  FOR rec IN
    SELECT
      cb.title,
      cb.id as old_uuid,
      um.new_id as new_numeric_id
    FROM courses_backup cb
    JOIN uuid_mapping_courses um ON um.old_uuid = cb.id
    ORDER BY um.new_id
  LOOP
    RAISE NOTICE 'Course: % | Old UUID: % | New ID: %', rec.title, rec.old_uuid, rec.new_numeric_id;
  END LOOP;
END $$;

-- Verification counts
SELECT
  'users' as table_name,
  (SELECT COUNT(*) FROM users_backup) as backup_count,
  (SELECT COUNT(*) FROM users) as new_count;

SELECT
  'courses' as table_name,
  (SELECT COUNT(*) FROM courses_backup) as backup_count,
  (SELECT COUNT(*) FROM courses) as new_count;

SELECT
  'lessons' as table_name,
  (SELECT COUNT(*) FROM lessons_backup) as backup_count,
  (SELECT COUNT(*) FROM lessons) as new_count;

SELECT
  'cards' as table_name,
  (SELECT COUNT(*) FROM cards_backup) as backup_count,
  (SELECT COUNT(*) FROM cards) as new_count;

-- ============================================
-- STEP 8: Optional - Drop backup tables
-- ============================================
-- Uncomment these lines ONLY after verifying data is correct!
-- DROP TABLE users_backup;
-- DROP TABLE categories_backup;
-- DROP TABLE courses_backup;
-- DROP TABLE lessons_backup;
-- DROP TABLE cards_backup;
-- DROP TABLE user_card_progress_backup;
-- DROP TABLE user_course_progress_backup;
-- DROP TABLE minted_badges_backup;

-- Keep UUID mapping tables for reference
-- You can drop these later if not needed:
-- DROP TABLE uuid_mapping_users;
-- DROP TABLE uuid_mapping_categories;
-- DROP TABLE uuid_mapping_courses;
-- DROP TABLE uuid_mapping_lessons;
-- DROP TABLE uuid_mapping_cards;

COMMIT;

-- ============================================
-- Post-Migration Notes
-- ============================================
-- 1. Course IDs are now simple integers (1, 2, 3, etc.)
-- 2. You can delete lib/courseMapping.ts - no longer needed!
-- 3. Update your TypeScript interfaces to use number instead of string for IDs
-- 4. Smart contract integration is now simpler with numeric IDs
-- 5. The uuid_mapping_* tables preserve the old UUID → new numeric ID mapping
-- ============================================

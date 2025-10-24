# How to Insert Base Course - Step by Step Guide

## 📚 Course Overview

**Course Name:** Pengenalan Base
**Language:** Indonesian (id)
**Difficulty:** Basic
**Category:** Blockchain Fundamentals
**Total Tiers (Lessons):** 3
**Total Cards:** 30 (10 per tier)

---

## 🎯 Quick Start (Easiest Method)

### **Option A: Using Supabase UI** (Recommended for beginners)

1. **Open Supabase Dashboard** → Go to your project
2. **Navigate to SQL Editor**
3. **Copy the ENTIRE contents** of `database/insert_base_course.sql`
4. **Paste into SQL Editor**
5. **Execute Step by Step** (see below)

---

## 📝 Step-by-Step Execution

### **Step 1: Insert Course**

```sql
-- Execute this first
INSERT INTO courses (id, title, description, emoji, language, difficulty, category_id, total_lessons, created_at)
VALUES (
  gen_random_uuid(),
  'Pengenalan Base',
  'Pelajari Base - blockchain Layer-2 yang dibangun oleh Coinbase. Dari konsep dasar hingga arsitektur lanjutan.',
  '⛓️',
  'id',
  'Basic',
  (SELECT id FROM categories WHERE slug = 'blockchain-fundamentals' LIMIT 1),
  3,
  NOW()
)
RETURNING id;
```

**Expected Result:**
```
id
--------------------
a1b2c3d4-e5f6-...
```

**✅ COPY THIS COURSE ID!** You'll need it for the next steps.

---

### **Step 2: Insert Lessons (Tiers)**

Replace `<COURSE_ID>` with the ID from Step 1, then execute:

```sql
-- Tier 1
INSERT INTO lessons (id, course_id, title, lesson_number, created_at)
VALUES (
  gen_random_uuid(),
  '<COURSE_ID>', -- REPLACE THIS!
  'Introduction to Base',
  1,
  NOW()
)
RETURNING id;
```

**✅ COPY THIS LESSON 1 ID!**

```sql
-- Tier 2
INSERT INTO lessons (id, course_id, title, lesson_number, created_at)
VALUES (
  gen_random_uuid(),
  '<COURSE_ID>', -- REPLACE THIS!
  'Ekosistem & Base Tools',
  2,
  NOW()
)
RETURNING id;
```

**✅ COPY THIS LESSON 2 ID!**

```sql
-- Tier 3
INSERT INTO lessons (id, course_id, title, lesson_number, created_at)
VALUES (
  gen_random_uuid(),
  '<COURSE_ID>', -- REPLACE THIS!
  'Konsep Lanjutan tentang Base',
  3,
  NOW()
)
RETURNING id;
```

**✅ COPY THIS LESSON 3 ID!**

---

### **Step 3: Insert Cards for Each Tier**

Now open `database/insert_base_course.sql` and:

1. **Find all `<LESSON_1_ID>`** → Replace with Lesson 1 ID from Step 2
2. **Find all `<LESSON_2_ID>`** → Replace with Lesson 2 ID from Step 2
3. **Find all `<LESSON_3_ID>`** → Replace with Lesson 3 ID from Step 2

**Quick Replace (in text editor):**
- Find: `<LESSON_1_ID>` → Replace with: `your-actual-lesson-1-id`
- Find: `<LESSON_2_ID>` → Replace with: `your-actual-lesson-2-id`
- Find: `<LESSON_3_ID>` → Replace with: `your-actual-lesson-3-id`

Then execute the cards insertion SQL.

---

## 🚀 Alternative: All-in-One Script

If you want to insert everything at once, use this approach:

### **Step 1: Prepare the Script**

```sql
DO $$
DECLARE
  v_course_id UUID;
  v_lesson_1_id UUID;
  v_lesson_2_id UUID;
  v_lesson_3_id UUID;
BEGIN
  -- Insert Course
  INSERT INTO courses (id, title, description, emoji, language, difficulty, category_id, total_lessons, created_at)
  VALUES (
    gen_random_uuid(),
    'Pengenalan Base',
    'Pelajari Base - blockchain Layer-2 yang dibangun oleh Coinbase. Dari konsep dasar hingga arsitektur lanjutan.',
    '⛓️',
    'id',
    'Basic',
    (SELECT id FROM categories WHERE slug = 'blockchain-fundamentals' LIMIT 1),
    3,
    NOW()
  )
  RETURNING id INTO v_course_id;

  -- Insert Lessons
  INSERT INTO lessons (id, course_id, title, lesson_number, created_at)
  VALUES (gen_random_uuid(), v_course_id, 'Introduction to Base', 1, NOW())
  RETURNING id INTO v_lesson_1_id;

  INSERT INTO lessons (id, course_id, title, lesson_number, created_at)
  VALUES (gen_random_uuid(), v_course_id, 'Ekosistem & Base Tools', 2, NOW())
  RETURNING id INTO v_lesson_2_id;

  INSERT INTO lessons (id, course_id, title, lesson_number, created_at)
  VALUES (gen_random_uuid(), v_course_id, 'Konsep Lanjutan tentang Base', 3, NOW())
  RETURNING id INTO v_lesson_3_id;

  -- Then copy all the card insertions here, using v_lesson_1_id, v_lesson_2_id, v_lesson_3_id

  RAISE NOTICE 'Course created successfully!';
  RAISE NOTICE 'Course ID: %', v_course_id;
  RAISE NOTICE 'Lesson 1 ID: %', v_lesson_1_id;
  RAISE NOTICE 'Lesson 2 ID: %', v_lesson_2_id;
  RAISE NOTICE 'Lesson 3 ID: %', v_lesson_3_id;
END $$;
```

---

## ✅ Verification

After insertion, verify everything was created:

```sql
-- Check course
SELECT id, title, language, difficulty, total_lessons
FROM courses
WHERE title = 'Pengenalan Base';

-- Check lessons
SELECT l.id, l.lesson_number, l.title
FROM lessons l
JOIN courses c ON l.course_id = c.id
WHERE c.title = 'Pengenalan Base'
ORDER BY l.lesson_number;

-- Check cards count per lesson
SELECT
  l.lesson_number,
  l.title,
  COUNT(ca.id) as card_count
FROM lessons l
LEFT JOIN cards ca ON ca.lesson_id = l.id
JOIN courses c ON l.course_id = c.id
WHERE c.title = 'Pengenalan Base'
GROUP BY l.lesson_number, l.title
ORDER BY l.lesson_number;
```

**Expected Result:**
```
lesson_number | title                           | card_count
--------------+---------------------------------+-----------
1             | Introduction to Base            | 10
2             | Ekosistem & Base Tools          | 10
3             | Konsep Lanjutan tentang Base    | 10
```

---

## 📊 Course Structure

```
Pengenalan Base (Course)
├── Tier 1: Introduction to Base (10 cards)
│   ├── Card 1: Apa itu Base dan Layer 2
│   ├── Card 2: Visi Base — "Base for Everyone"
│   ├── Card 3: Mengapa Base Penting
│   ├── Card 4: Visi Base
│   ├── Card 5: Motto Base
│   ├── Card 6: Aksesibilitas Base
│   ├── Card 7: Teknologi Base
│   ├── Card 8: Aplikasi di Base
│   ├── Card 9: Onchain Summer
│   └── Card 10: Keamanan Base
│
├── Tier 2: Ekosistem & Base Tools (10 cards)
│   ├── Card 1: Memulai di Base
│   ├── Card 2: Wallet untuk Base
│   ├── Card 3: Base Bridge
│   ├── Card 4: Bridging ETH
│   ├── Card 5: Aktivitas di Base
│   ├── Card 6: Farcaster di Base
│   ├── Card 7: Mengapa Membangun di Base
│   ├── Card 8: Keamanan: Wallet Draining
│   ├── Card 9: Menjaga Keamanan Wallet
│   └── Card 10: Best Practices Keamanan
│
└── Tier 3: Konsep Lanjutan tentang Base (10 cards)
    ├── Card 1: Cara Kerja Base: OP Stack
    ├── Card 2: Optimistic Rollup
    ├── Card 3: Keuntungan Rollup
    ├── Card 4: Peran Sequencer
    ├── Card 5: Pentingnya Sequencer
    ├── Card 6: Superchain
    ├── Card 7: Open Source Base
    ├── Card 8: Skalabilitas Base
    ├── Card 9: Masa Depan Sequencer
    └── Card 10: Peran Base dalam Ekosistem Ethereum
```

---

## 🎨 Card Format

Each card includes:

**Flashcard:**
- ✅ Question (learning material title)
- ✅ Answer (detailed explanation)

**Quiz:**
- ✅ Question
- ✅ 4 Multiple choice options (A, B, C, D)
- ✅ Correct answer

---

## ⚠️ Important Notes

### **Before Inserting:**

1. **Check if category exists:**
   ```sql
   SELECT id, name FROM categories WHERE slug = 'blockchain-fundamentals';
   ```
   - If not found, either:
     - Run `database/migration_add_categories.sql` first
     - OR set `category_id` to `NULL` in the course insertion

2. **Backup your database** (recommended before large insertions)

### **After Inserting:**

1. ✅ Verify course appears in UI
2. ✅ Check all 3 tiers/lessons are visible
3. ✅ Test opening a card and completing the quiz
4. ✅ Verify progress tracking works

---

## 🚨 Troubleshooting

### **Error: "Foreign key violation on category_id"**

**Fix:** Category doesn't exist. Either:
```sql
-- Option 1: Set category_id to NULL
category_id, -- Remove this line
NULL, -- Or change to NULL

-- Option 2: Create the category first
-- Run migration_add_categories.sql
```

### **Error: "Duplicate key violates unique constraint"**

**Fix:** Course/lesson already exists. Check existing data:
```sql
SELECT * FROM courses WHERE title = 'Pengenalan Base';
```

### **Cards not showing in UI**

**Fix:** Check lesson_id references:
```sql
SELECT l.id as lesson_id, COUNT(c.id) as card_count
FROM lessons l
LEFT JOIN cards c ON c.lesson_id = l.id
WHERE l.course_id = '<your_course_id>'
GROUP BY l.id;
```

---

## ✨ Success!

Once completed, you'll have:
- ✅ 1 Complete Indonesian Course on Base blockchain
- ✅ 3 Progressive Tiers (Basic → Tools → Advanced)
- ✅ 30 Interactive Learning Cards
- ✅ Flashcards for learning
- ✅ Quizzes for testing knowledge

Users can now learn about Base blockchain in Bahasa Indonesia! 🎉

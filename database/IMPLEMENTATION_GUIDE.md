# Indonesian Localization Implementation Guide

## ✅ What's Been Done (Code Implementation)

The code has been fully implemented with the following changes:

1. **Updated TypeScript Interfaces**
   - Added `language: 'en' | 'id'` field to Course interface in [lib/supabase.ts](../lib/supabase.ts)

2. **Created LanguageFilter Component**
   - New component: [features/Courses/components/LanguageFilter.tsx](../features/Courses/components/LanguageFilter.tsx)
   - Displays language filter buttons: 🌍 Semua/All | 🇮🇩 Bahasa Indonesia | 🇪🇳 English

3. **Updated CoursesPage**
   - Added auto-detection of browser language
   - Integrated LanguageFilter component
   - Added client-side filtering logic
   - Shows appropriate empty state messages in both languages

4. **Enhanced API Methods**
   - Updated `API.getCourses()` to support optional language parameter
   - Allows server-side filtering if needed in the future

---

## 🚀 What YOU Need to Do (Database Setup)

### Step 1: Run Database Migration

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/project/YOUR_PROJECT_ID
   - Navigate to: **SQL Editor**

2. **Copy and paste this SQL:**

```sql
-- Add language column to courses table
ALTER TABLE courses
ADD COLUMN language VARCHAR(5) DEFAULT 'en';

-- Add check constraint to ensure only valid languages
ALTER TABLE courses
ADD CONSTRAINT courses_language_check
CHECK (language IN ('en', 'id'));

-- Create index for faster language filtering
CREATE INDEX idx_courses_language ON courses(language);

-- Update existing courses to have 'en' language
UPDATE courses
SET language = 'en'
WHERE language IS NULL;

-- Make language column NOT NULL
ALTER TABLE courses
ALTER COLUMN language SET NOT NULL;
```

3. **Click "Run"**

4. **Verify migration succeeded:**

```sql
SELECT id, title, language FROM courses;
```

All existing courses should now show `language = 'en'`.

---

### Step 2: Insert Indonesian Course Content

You have two options:

#### **Option A: Manual Insert via Supabase Dashboard**

1. Go to **Table Editor** → **courses** table
2. Click **Insert** → **Insert row**
3. Fill in the data from `indonesian_course_example.json`

#### **Option B: Using SQL (Recommended)**

1. Go to **SQL Editor**
2. Use this script to insert the sample Indonesian course:

```sql
-- Insert Indonesian Course
INSERT INTO courses (title, description, emoji, language, total_lessons)
VALUES (
  'Pengenalan Blockchain',
  'Pelajari dasar-dasar teknologi blockchain dari awal dengan cara yang mudah dipahami',
  '📚',
  'id',
  2
) RETURNING id;

-- Save the returned course ID from above, then use it below
-- Replace 'YOUR_COURSE_ID' with the actual UUID returned

-- Insert Lesson 1
INSERT INTO lessons (course_id, lesson_number, title, total_cards)
VALUES (
  'YOUR_COURSE_ID',
  1,
  'Apa itu Blockchain?',
  3
) RETURNING id;

-- Save the lesson ID, then insert cards for Lesson 1
-- Replace 'YOUR_LESSON_ID' with the actual UUID

-- Card 1
INSERT INTO cards (
  lesson_id, card_number,
  flashcard_question, flashcard_answer,
  quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d,
  quiz_correct_answer
) VALUES (
  'YOUR_LESSON_ID', 1,
  'Apa definisi Blockchain?',
  'Blockchain adalah buku besar digital terdesentralisasi yang mencatat transaksi di banyak komputer sehingga catatan tidak dapat diubah secara retroaktif tanpa mengubah semua blok berikutnya.',
  'Karakteristik utama blockchain adalah?',
  'Tersentralisasi dan dapat diubah',
  'Terdesentralisasi dan tidak dapat diubah',
  'Hanya untuk cryptocurrency',
  'Disimpan di satu server',
  'B'
);

-- Repeat for other cards...
```

#### **Option C: Using a Script (Easiest)**

I can create a Node.js script for you that will automatically insert the Indonesian course. Would you like me to create this script?

---

### Step 3: Test the Implementation

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Open the app in your browser**

3. **Test language detection:**
   - If browser language is Indonesian (id-ID), you should see Indonesian courses by default
   - If browser language is English, you should see English courses by default

4. **Test language filter:**
   - Click on each filter button (Semua/All, Bahasa Indonesia, English)
   - Verify courses are filtered correctly

5. **Test empty state:**
   - If no Indonesian courses exist yet, you should see:
     > "Belum ada kursus dalam Bahasa Indonesia. Silakan pilih "Semua" atau "English"."

---

## 📊 User Flow Summary

### Indonesian User (browser: id-ID)
```
1. Opens app
2. Auto-detects: Indonesian language
3. Sees: 🇮🇩 Bahasa Indonesia filter active by default
4. Views: Only Indonesian courses
5. Can switch to: English or All courses anytime
```

### English User (browser: en-US)
```
1. Opens app
2. Auto-detects: English language
3. Sees: 🇪🇳 English filter active by default
4. Views: Only English courses
5. Can switch to: Bahasa Indonesia or All courses anytime
```

---

## 📝 Next Steps (Future Enhancements)

### Phase 1 Completed ✅
- ✅ Language field in database
- ✅ Language filter UI
- ✅ Auto-detection logic
- ✅ Course filtering

### Phase 2 (Optional - UI Localization)
- Add UI translation for buttons, labels, navigation
- Implement messages/id.json for UI strings
- Add language switcher in Settings

### Phase 3 (Optional - Advanced)
- Store user language preference in profile
- Server-side language filtering
- Multi-language course tags/categories

---

## 🐛 Troubleshooting

### Issue: TypeScript errors about 'language' field
**Solution:** Restart your TypeScript server or VS Code

### Issue: Courses not filtering
**Solution:**
1. Verify migration ran successfully
2. Check existing courses have `language` set
3. Clear browser cache and reload

### Issue: Auto-detection not working
**Solution:**
1. Check browser language settings (chrome://settings/languages)
2. Ensure browser language code starts with 'id' for Indonesian

---

## 📚 Reference Files

- Migration SQL: [migration_add_language.sql](./migration_add_language.sql)
- Indonesian Course Sample: [indonesian_course_example.json](./indonesian_course_example.json)
- Language Filter Component: [features/Courses/components/LanguageFilter.tsx](../features/Courses/components/LanguageFilter.tsx)
- Updated Course Interface: [lib/supabase.ts](../lib/supabase.ts)
- Updated Courses Page: [features/Courses/index.tsx](../features/Courses/index.tsx)

---

## 🎯 Success Criteria

You'll know the implementation is successful when:

1. ✅ No TypeScript errors
2. ✅ Language filter buttons appear on Courses page
3. ✅ Clicking each filter shows only courses in that language
4. ✅ Browser language auto-detection works
5. ✅ Indonesian course content displays correctly
6. ✅ Users can seamlessly switch between languages

---

## 💡 Tips

- Start with 1-2 Indonesian courses to test the system
- You can always add more courses later
- Consider translating your most popular courses first
- Get feedback from Indonesian users on the translations

---

Need help? Check the console for errors or review the implementation files listed above.

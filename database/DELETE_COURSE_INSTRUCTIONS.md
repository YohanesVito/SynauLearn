# 🗑️ Delete Duplicate Course

## Course to Delete
**ID:** `e7020156-f1ec-4fa2-afd3-2660da6b6719`

---

## ⚠️ WARNING

This will **permanently delete**:
- ✅ The course
- ✅ All lessons in this course
- ✅ All cards in those lessons
- ✅ All user progress for those cards
- ✅ All user course progress records
- ✅ All minted badges for this course

**There is no undo!** Make sure you're deleting the right course.

---

## 🔍 Step 1: Verify Which Course to Delete

Before deleting, check which course this is:

```sql
SELECT
  id,
  title,
  description,
  language,
  difficulty,
  total_lessons,
  created_at
FROM courses
WHERE id = 'e7020156-f1ec-4fa2-afd3-2660da6b6719';
```

**Make sure this is the duplicate you want to remove!**

---

## 📋 Two Options for Deletion

### **Option 1: Safe Delete with Transaction (Recommended)**

Use this if you want the ability to rollback:

**File:** `database/delete_course_safe.sql`

**Steps:**
1. Open Supabase Dashboard → SQL Editor
2. Copy content from `delete_course_safe.sql`
3. Run it
4. **Review the output carefully**
5. If correct, run: `COMMIT;`
6. If wrong, run: `ROLLBACK;`

---

### **Option 2: Direct Delete (Permanent)**

Use this if you're 100% sure:

**File:** `database/delete_course.sql`

**Steps:**
1. Open Supabase Dashboard → SQL Editor
2. Copy content from `delete_course.sql`
3. Run it
4. Check verification queries at the end

---

## 🚀 Quick Delete (Copy-Paste)

If you're absolutely sure and want to delete now:

```sql
-- Delete all related data in correct order
BEGIN;

-- 1. Delete user card progress
DELETE FROM user_card_progress
WHERE card_id IN (
  SELECT c.id FROM cards c
  JOIN lessons l ON c.lesson_id = l.id
  WHERE l.course_id = 'e7020156-f1ec-4fa2-afd3-2660da6b6719'
);

-- 2. Delete user course progress
DELETE FROM user_course_progress
WHERE course_id = 'e7020156-f1ec-4fa2-afd3-2660da6b6719';

-- 3. Delete minted badges
DELETE FROM minted_badges
WHERE course_id = 'e7020156-f1ec-4fa2-afd3-2660da6b6719';

-- 4. Delete cards
DELETE FROM cards
WHERE lesson_id IN (
  SELECT id FROM lessons
  WHERE course_id = 'e7020156-f1ec-4fa2-afd3-2660da6b6719'
);

-- 5. Delete lessons
DELETE FROM lessons
WHERE course_id = 'e7020156-f1ec-4fa2-afd3-2660da6b6719';

-- 6. Delete course
DELETE FROM courses
WHERE id = 'e7020156-f1ec-4fa2-afd3-2660da6b6719';

-- Verify deletion
SELECT COUNT(*) as should_be_zero
FROM courses
WHERE id = 'e7020156-f1ec-4fa2-afd3-2660da6b6719';

COMMIT;
```

---

## ✅ Verification After Deletion

Run these queries to verify everything is deleted:

```sql
-- Should return 0
SELECT COUNT(*) FROM courses
WHERE id = 'e7020156-f1ec-4fa2-afd3-2660da6b6719';

-- Should return 0
SELECT COUNT(*) FROM lessons
WHERE course_id = 'e7020156-f1ec-4fa2-afd3-2660da6b6719';

-- Show remaining courses
SELECT id, title, language, difficulty
FROM courses
ORDER BY language, difficulty;
```

---

## 🔄 Deletion Order (Important!)

The order matters due to foreign key constraints:

1. **user_card_progress** (references cards)
2. **user_course_progress** (references course)
3. **minted_badges** (references course)
4. **cards** (references lessons)
5. **lessons** (references course)
6. **courses** (the course itself)

---

## 💡 Finding Duplicates

To find other duplicate courses in the future:

```sql
-- Find duplicate course titles
SELECT
  title,
  language,
  difficulty,
  COUNT(*) as count,
  array_agg(id) as course_ids
FROM courses
GROUP BY title, language, difficulty
HAVING COUNT(*) > 1;
```

---

## 🛡️ Backup Before Deletion (Recommended)

Export the course data before deleting:

```sql
-- Export course
SELECT * FROM courses
WHERE id = 'e7020156-f1ec-4fa2-afd3-2660da6b6719';

-- Export lessons
SELECT * FROM lessons
WHERE course_id = 'e7020156-f1ec-4fa2-afd3-2660da6b6719';

-- Export cards
SELECT c.* FROM cards c
JOIN lessons l ON c.lesson_id = l.id
WHERE l.course_id = 'e7020156-f1ec-4fa2-afd3-2660da6b6719';
```

Copy the results to a text file before deletion.

---

## 🚨 If You Delete the Wrong Course

If you accidentally delete the wrong course:

1. **Stop immediately** - Don't run more queries
2. **Contact Supabase support** - They may have backups
3. **Check your backups** - Restore from backup if available
4. **Re-insert data** - If you exported before deletion

---

## 📞 Need Help?

Before deleting, verify:
- ✅ This is definitely a duplicate
- ✅ You know which one to keep
- ✅ You've backed up the data (optional but recommended)
- ✅ You've checked there are no users actively using this course

---

**Ready to delete? Use one of the SQL scripts above!**

**Be careful! 🗑️⚠️**

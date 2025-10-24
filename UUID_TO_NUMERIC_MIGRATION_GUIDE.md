# UUID to Numeric IDs Migration Guide

## 🎯 Purpose

This migration converts all database primary keys from **UUID** to **numeric (SERIAL)** auto-increment IDs. This eliminates the need for the `courseMapping.ts` file and simplifies smart contract integration.

---

## ✅ What Has Been Completed

### 1. **Database Migration SQL** ✅
**File:** `database/migration_uuid_to_numeric_ids.sql`

- Creates backup tables for all existing data
- Drops and recreates tables with SERIAL (auto-increment) IDs
- Restores all data with new numeric IDs
- Creates UUID mapping tables for reference
- Adds performance indexes

### 2. **TypeScript Interfaces Updated** ✅
**File:** `lib/supabase.ts`

All interfaces now use `number` instead of `string` for IDs:
- ✅ `Category.id`: string → **number**
- ✅ `Course.id`: string → **number**
- ✅ `Course.category_id`: string | null → **number | null**
- ✅ `Lesson.id`: string → **number**
- ✅ `Lesson.course_id`: string → **number**
- ✅ `Card.id`: string → **number**
- ✅ `Card.lesson_id`: string → **number**
- ✅ `UserCardProgress.id`: string → **number**
- ✅ `UserCardProgress.user_id`: string → **number**
- ✅ `UserCardProgress.card_id`: string → **number**
- ✅ `UserCourseProgress.id`: string → **number**
- ✅ `UserCourseProgress.user_id`: string → **number**
- ✅ `UserCourseProgress.course_id`: string → **number**

### 3. **API Methods Updated** ✅
**File:** `lib/api.ts`

All API methods now accept and return numeric IDs:
- ✅ `getCourse(courseId: number)`
- ✅ `getLessonsForCourse(courseId: number)`
- ✅ `getLesson(lessonId: number)`
- ✅ `getCardsForLesson(lessonId: number)`
- ✅ `getUser(userId: number)`
- ✅ `saveCardProgress(userId: number, cardId: number, ...)`
- ✅ `updateUserXP(userId: number, ...)`
- ✅ `getUserProgress(userId: number, lessonId: number)`
- ✅ `getCourseProgress(userId: number, courseId: number)`
- ✅ `updateCourseProgress(userId: number, courseId: number, ...)`
- ✅ `saveMintedBadge(userId: number, courseId: number, ...)`
- ✅ `getMintedBadge(userId: number, courseId: number)`
- ✅ `deleteMintedBadge(userId: number, courseId: number)`
- ✅ `getUserMintedBadges(userId: number)`
- ✅ `hasMintedBadge(userId: number, courseId: number)`
- ✅ `getUserStats(userId: number)`
- ✅ `getCourseProgressPercentage(userId: number, courseId: number)`

**MintedBadge interface also updated:**
```typescript
export interface MintedBadge {
  id: number;
  user_id: number;
  course_id: number;
  wallet_address: string;
  token_id: string;
  tx_hash: string;
  minted_at: string;
}
```

---

## 📋 Migration Steps

### **Step 1: Backup Your Data** ⚠️

**CRITICAL: Do this BEFORE running the migration!**

```sql
-- In Supabase SQL Editor, export all tables
-- OR use pg_dump if you have database access
```

Recommended: Use Supabase Dashboard → Table Editor → Export as CSV for each table.

---

### **Step 2: Run the Migration**

1. **Open Supabase SQL Editor**
2. **Copy the entire contents** of `database/migration_uuid_to_numeric_ids.sql`
3. **Paste and Execute** the migration
4. **Wait for completion** (may take a few minutes depending on data size)

The migration will:
- ✅ Create backup tables (users_backup, courses_backup, etc.)
- ✅ Drop existing tables
- ✅ Recreate with SERIAL IDs
- ✅ Restore all data with new numeric IDs
- ✅ Create UUID mapping tables for reference
- ✅ Add performance indexes

---

### **Step 3: Verify Migration Success**

After the migration completes, check the verification queries output:

```sql
-- Should show matching counts
SELECT * FROM (
  SELECT 'users' as table_name,
    (SELECT COUNT(*) FROM users_backup) as backup_count,
    (SELECT COUNT(*) FROM users) as new_count
) counts;

-- Check course ID mapping
SELECT
  cb.title,
  cb.id as old_uuid,
  um.new_id as new_numeric_id
FROM courses_backup cb
JOIN uuid_mapping_courses um ON um.old_uuid = cb.id
ORDER BY um.new_id;
```

**Expected Result:** All counts should match (backup_count = new_count)

---

### **Step 4: Test the Application**

1. **Restart your dev server:**
   ```bash
   npm run dev
   ```

2. **Test key features:**
   - ✅ Load courses page
   - ✅ Click a course to view lessons
   - ✅ Complete a card/quiz
   - ✅ Check user progress
   - ✅ View leaderboard

3. **Check browser console** for any errors

---

### **Step 5: Update Smart Contracts (if applicable)**

If you have smart contracts that reference course IDs:

**Before (with UUIDs):**
```solidity
// Had to use mapping from courseMapping.ts
// Course ID 1 = "9bea6cc1-8a0f-4aad-9d10-2984bf70368f"
```

**After (with numeric IDs):**
```solidity
// Direct numeric IDs!
// Course ID 1 = 1
// Course ID 2 = 2
// etc.
```

You can now use course IDs directly without any mapping! 🎉

---

### **Step 6: Clean Up (Optional)**

After confirming everything works correctly:

```sql
-- Drop backup tables
DROP TABLE users_backup;
DROP TABLE categories_backup;
DROP TABLE courses_backup;
DROP TABLE lessons_backup;
DROP TABLE cards_backup;
DROP TABLE user_card_progress_backup;
DROP TABLE user_course_progress_backup;
DROP TABLE minted_badges_backup;

-- Optionally keep UUID mapping tables for reference
-- Or drop them if not needed:
-- DROP TABLE uuid_mapping_users;
-- DROP TABLE uuid_mapping_categories;
-- DROP TABLE uuid_mapping_courses;
-- DROP TABLE uuid_mapping_lessons;
-- DROP TABLE uuid_mapping_cards;
```

---

### **Step 7: Delete courseMapping.ts**

The `lib/courseMapping.ts` file is **no longer needed**!

**You can safely delete it:**
```bash
rm lib/courseMapping.ts
```

Or move it to a backup folder if you want to keep it for reference.

---

## 🔄 ID Mapping Reference

After migration, you can view the old UUID → new numeric ID mapping:

```sql
-- View course ID mapping
SELECT
  c.id as new_id,
  c.title,
  um.old_uuid
FROM courses c
JOIN uuid_mapping_courses um ON um.new_id = c.id
ORDER BY c.id;
```

This is useful if you need to update external references (smart contracts, APIs, etc.)

---

## 📊 Before vs After

### **Before (UUID IDs):**

```typescript
// Course ID
"9bea6cc1-8a0f-4aad-9d10-2984bf70368f"

// API call
API.getCourse("9bea6cc1-8a0f-4aad-9d10-2984bf70368f")

// Smart contract integration
const courseNumber = getCourseNumber(courseId) // Need mapping!
```

### **After (Numeric IDs):**

```typescript
// Course ID
1

// API call
API.getCourse(1)

// Smart contract integration
const courseNumber = courseId // Direct use! No mapping needed!
```

---

## 🎯 Benefits of Numeric IDs

1. **✅ No more courseMapping.ts** - One less file to maintain
2. **✅ Simpler smart contract integration** - Direct numeric IDs
3. **✅ Better database performance** - Smaller index sizes
4. **✅ Easier debugging** - IDs like 1, 2, 3 vs long UUIDs
5. **✅ Auto-increment** - No need to generate UUIDs manually
6. **✅ URL friendly** - `/course/1` vs `/course/9bea6cc1-...`

---

## ⚠️ Important Notes

### **Database Schema Changes:**

| Table | Old ID Type | New ID Type |
|-------|-------------|-------------|
| users | UUID | SERIAL (integer) |
| categories | UUID | SERIAL (integer) |
| courses | UUID | SERIAL (integer) |
| lessons | UUID | SERIAL (integer) |
| cards | UUID | SERIAL (integer) |
| user_card_progress | UUID | SERIAL (integer) |
| user_course_progress | UUID | SERIAL (integer) |
| minted_badges | UUID | SERIAL (integer) |

### **Foreign Key Updates:**

All foreign keys have been updated to use numeric IDs:
- `courses.category_id` → references `categories(id)`
- `lessons.course_id` → references `courses(id)`
- `cards.lesson_id` → references `lessons(id)`
- `user_card_progress.user_id` → references `users(id)`
- `user_card_progress.card_id` → references `cards(id)`
- etc.

### **Data Preservation:**

The migration preserves **ALL existing data**:
- ✅ User accounts and XP
- ✅ Courses and lessons
- ✅ Cards and quizzes
- ✅ User progress
- ✅ Minted badges
- ✅ All timestamps and metadata

### **ID Assignment:**

New numeric IDs are assigned based on `created_at` timestamp:
- First created course → ID 1
- Second created course → ID 2
- etc.

This ensures consistent ordering and predictable IDs.

---

## 🚨 Troubleshooting

### **Issue: Migration fails with "relation does not exist"**

**Cause:** Tables already exist with the new schema

**Solution:**
1. Drop all tables manually
2. Re-run the migration
3. Or create a fresh database

---

### **Issue: Data counts don't match after migration**

**Cause:** Foreign key references might be invalid

**Solution:**
```sql
-- Check which records failed to migrate
SELECT * FROM courses_backup cb
WHERE cb.category_id IS NOT NULL
AND cb.category_id NOT IN (SELECT old_uuid FROM uuid_mapping_categories);
```

---

### **Issue: Application shows type errors**

**Cause:** Some components still expect string IDs

**Solution:**
- Check component props
- Update any hardcoded course IDs
- Ensure all API calls use numeric IDs

---

## ✅ Final Checklist

Before considering the migration complete:

- [ ] Backed up all database data
- [ ] Ran migration successfully in Supabase
- [ ] Verified data counts match
- [ ] Tested application features
- [ ] Checked browser console for errors
- [ ] Updated smart contracts (if applicable)
- [ ] Deleted/backed up courseMapping.ts
- [ ] Dropped backup tables (after verification)
- [ ] Updated any external API integrations

---

## 📚 Files Modified

| File | Status | Description |
|------|--------|-------------|
| `database/migration_uuid_to_numeric_ids.sql` | ✅ Created | Complete migration SQL |
| `lib/supabase.ts` | ✅ Updated | All interfaces use numeric IDs |
| `lib/api.ts` | ✅ Updated | All methods use numeric IDs |
| `lib/courseMapping.ts` | ⚠️ Deprecated | Can be deleted after migration |

---

## 🎉 Success!

Once completed, you'll have:
- ✅ Simple numeric IDs (1, 2, 3, ...)
- ✅ No need for course ID mapping
- ✅ Direct smart contract integration
- ✅ All existing data preserved
- ✅ Better performance and debugging

**Happy coding!** 🚀

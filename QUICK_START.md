# 🚀 Quick Start: Indonesian Courses with 3 Levels

## ⚡ Super Fast Setup (5 Minutes)

### Step 1: Update Database (2 minutes)

Open Supabase Dashboard → SQL Editor, run this:

```sql
-- Add difficulty column
ALTER TABLE courses ADD COLUMN difficulty VARCHAR(20) DEFAULT 'Basic';
ALTER TABLE courses ADD CONSTRAINT courses_difficulty_check CHECK (difficulty IN ('Basic', 'Advanced', 'Professional'));
CREATE INDEX idx_courses_difficulty ON courses(difficulty);
UPDATE courses SET difficulty = 'Basic' WHERE difficulty IS NULL;
ALTER TABLE courses ALTER COLUMN difficulty SET NOT NULL;
CREATE INDEX idx_courses_language_difficulty ON courses(language, difficulty);
```

**Verify:** Run `SELECT id, title, language, difficulty FROM courses;`

---

### Step 2: Insert Indonesian Courses (1 minute)

```bash
npm run insert-all-indonesian-courses
```

**Expected output:**
```
🎉 SUCCESS! ALL Indonesian courses inserted!
   Total Courses: 3
   Total Lessons: 9
   Total Cards: 26
```

---

### Step 3: Test (2 minutes)

```bash
npm run dev
```

**Test checklist:**
1. ✅ See language filter: 🌍 All | 🇮🇩 Bahasa | 🇪🇳 English
2. ✅ See category filter: Basic | Advanced | Professional
3. ✅ Click "🇮🇩 Bahasa Indonesia" → See 1 course
4. ✅ Switch categories → See different courses
5. ✅ Click course → Opens lesson

---

## 📚 What You Get

### 3 Complete Courses:

1. **📚 Basic: Pengenalan Blockchain**
   - 3 lessons, 9 cards
   - Topics: Blockchain basics, mining, cryptocurrency

2. **💰 Advanced: DeFi dan Smart Contract**
   - 3 lessons, 8 cards
   - Topics: DeFi, Solidity, DEX/AMM

3. **🏗️ Professional: Arsitektur Blockchain Profesional**
   - 3 lessons, 9 cards
   - Topics: Layer 2, security, advanced architecture

---

## 🎯 How It Works

### User Flow:
```
User opens app
    ↓
Auto-detects language (Indonesian = id, English = en)
    ↓
Shows courses in detected language
    ↓
Default category: Basic
    ↓
User can switch:
  - Language: All | Bahasa | English
  - Category: Basic | Advanced | Professional
    ↓
Courses filtered by BOTH selections
```

### Filter Logic:
```typescript
// Shows courses that match BOTH language AND difficulty
Language: Indonesian + Category: Basic = "Pengenalan Blockchain"
Language: Indonesian + Category: Advanced = "DeFi dan Smart Contract"
Language: Indonesian + Category: Professional = "Arsitektur Blockchain"
```

---

## 🛠️ Troubleshooting

**Problem:** Script fails
- **Fix:** Make sure Step 1 (migration) ran first

**Problem:** No courses showing
- **Fix:** Check Supabase has data: `SELECT * FROM courses WHERE language = 'id';`

**Problem:** TypeScript errors
- **Fix:** Restart VS Code or run: `Ctrl+Shift+P` → "Restart TS Server"

**Problem:** Filters not working
- **Fix:** Clear browser cache, reload page

---

## 📖 Full Documentation

For detailed info, see:
- **Complete Guide:** [INDONESIAN_COURSES_3_LEVELS.md](./INDONESIAN_COURSES_3_LEVELS.md)
- **Original Setup:** [INDONESIAN_LOCALIZATION_SUMMARY.md](./INDONESIAN_LOCALIZATION_SUMMARY.md)

---

## ✨ That's it!

You're ready to offer Indonesian blockchain education at 3 difficulty levels! 🎉

**Questions?** Check the full documentation above.

**Selamat belajar!** 🇮🇩

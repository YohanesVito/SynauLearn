# 🌐 Phase 2: UI Localization - Implementation Guide

## ✅ What's Been Completed

### 1. **Locale System Setup**
- ✅ Created `LocaleContext` with React Context API
- ✅ Auto-detect browser language on first load
- ✅ Persist user language preference in localStorage
- ✅ Translation function with nested key support (`t('welcome.title')`)

### 2. **Translation Files Created**
- ✅ `messages/en.json` - English translations
- ✅ `messages/id.json` - Indonesian translations
- ✅ Complete coverage of all UI strings

### 3. **Components Already Translated**
- ✅ **WelcomeModal** - Fully translated with `useLocale()` hook

### 4. **LocaleProvider Added**
- ✅ Wrapped app in `LocaleProvider` in `app/page.tsx`

---

## 🚀 Next Steps: Translate Remaining Components

You need to update these components to use translations:

### **Files to Update:**

1. **components/BottomNav.tsx**
2. **components/Drawer.tsx**
3. **features/Courses/index.tsx**
4. **features/Courses/components/LanguageFilter.tsx**
5. **features/Courses/components/Categories.tsx** (optional - translate button labels)

---

## 📝 How to Translate Each Component

### **Pattern to Follow:**

1. Add import:
```typescript
import { useLocale } from '@/lib/LocaleContext';
```

2. Use hook in component:
```typescript
const { t } = useLocale();
```

3. Replace hardcoded strings:
```typescript
// Before
<span>Home</span>

// After
<span>{t('navigation.home')}</span>
```

---

## 🔧 Component Updates Needed

### **1. components/BottomNav.tsx**

**Current code (lines 10-54):**
```typescript
const navItems = [
  {
    id: "home" as const,
    label: "Home",
    // ...
  },
  {
    id: "courses" as const,
    label: "Courses",
    // ...
  },
  {
    id: "profile" as const,
    label: "Profile",
    // ...
  },
];
```

**Update to:**
```typescript
'use client';
import { useLocale } from '@/lib/LocaleContext';

export default function BottomNav({ currentView, onNavigate }: BottomNavProps) {
  const { t } = useLocale();

  const navItems = [
    {
      id: "home" as const,
      label: t('navigation.home'),
      icon: (/* ... */)
    },
    {
      id: "courses" as const,
      label: t('navigation.courses'),
      icon: (/* ... */)
    },
    {
      id: "profile" as const,
      label: t('navigation.profile'),
      icon: (/* ... */)
    },
  ];

  // ... rest of component
}
```

---

### **2. components/Drawer.tsx**

**Strings to translate (examples):**
- Line 52: `label: 'Home'` → `label: t('drawer.home')`
- Line 53: `label: 'Courses'` → `label: t('drawer.courses')`
- Line 54: `label: 'Profile'` → `label: t('drawer.profile')`
- Line 55: `label: 'Leaderboard'` → `label: t('drawer.leaderboard')`
- Line 106: `"View Profile"` → `{t('drawer.viewProfile')}`
- Line 122: `"Total XP"` → `{t('drawer.totalXP')}`
- Line 126: `"Badges"` → `{t('drawer.badges')}`
- Line 158: `"Mint Badge"` → `{t('drawer.mintBadge')}`
- Line 168: `"Night Mode"` → `{t('drawer.nightMode')}`
- Line 185: `"Settings"` → `{t('drawer.settings')}`
- Line 191: `"Help & Support"` → `{t('drawer.helpSupport')}`

**Add to top of component:**
```typescript
import { useLocale } from '@/lib/LocaleContext';

export default function Drawer({...}: DrawerProps) {
  const { t } = useLocale();
  // ... rest
```

---

### **3. features/Courses/index.tsx**

**Strings to translate:**
- Line 154: `"Loading courses..."` → `{t('courses.loading')}`
- Line 161: `"Courses"` → `{t('courses.title')}`
- Line 192-193: Error messages → Use `t('courses.noCoursesIndonesian')` and `t('courses.noCoursesEnglish')`
- Line 92: `"No lessons available..."` → `{t('courses.noLessonsAvailable')}`
- Line 96: `"Failed to load lesson..."` → `{t('courses.failedToLoad')}`

---

### **4. features/Courses/components/LanguageFilter.tsx**

**Update lines 12-14:**
```typescript
import { useLocale } from '@/lib/LocaleContext';

const LanguageFilter: React.FC<LanguageFilterProps> = ({ selected, onChange }) => {
  const { t } = useLocale();

  const filters = [
    { id: 'all', label: t('language.all'), emoji: '🌍' },
    { id: 'id', label: t('language.indonesian'), emoji: '🇮🇩' },
    { id: 'en', label: t('language.english'), emoji: '🇪🇳' },
  ] as const;

  // ... rest
}
```

---

### **5. features/Courses/components/Categories.tsx** (Optional)

**Update lines 10:**
```typescript
import { useLocale } from '@/lib/LocaleContext';

const Categories = ({ selected, onSelect }: CategoriesProps) => {
  const { t } = useLocale();

  const categories: { value: DifficultyLevel; label: string }[] = [
    { value: 'Basic', label: t('difficulty.basic') },
    { value: 'Advanced', label: t('difficulty.advanced') },
    { value: 'Professional', label: t('difficulty.professional') },
  ];

  return (
    <SafeArea>
      <div className="flex justify-center gap-2">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => onSelect(category.value)}
            className={`px-6 py-2 rounded-full text-small transition-all ${
              selected === category.value
                ? "bg-blue-600 text-white"
                : "bg-[#2a2d42] text-gray-400 hover:bg-[#333649]"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </SafeArea>
  );
};
```

---

## 🎨 Add Language Switcher to Drawer

Add this to **components/Drawer.tsx** (after Settings button, before Help & Support):

```typescript
{/* Language Switcher */}
<div className="px-4 py-2 border-b border-slate-800">
  <div className="text-xs text-gray-400 mb-2 px-2">Language / Bahasa</div>
  <div className="flex gap-2">
    <button
      onClick={() => setLocale('en')}
      className={`flex-1 px-4 py-2 rounded-lg text-sm transition-all ${
        locale === 'en'
          ? 'bg-blue-600 text-white'
          : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
      }`}
    >
      🇪🇳 English
    </button>
    <button
      onClick={() => setLocale('id')}
      className={`flex-1 px-4 py-2 rounded-lg text-sm transition-all ${
        locale === 'id'
          ? 'bg-blue-600 text-white'
          : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
      }`}
    >
      🇮🇩 Bahasa
    </button>
  </div>
</div>
```

**At the top of Drawer component:**
```typescript
import { useLocale } from '@/lib/LocaleContext';

export default function Drawer({...}: DrawerProps) {
  const { t, locale, setLocale } = useLocale();
  // ... rest
}
```

---

## 🧪 Testing Checklist

After implementing all translations:

- [ ] Open app → Should detect browser language
- [ ] Welcome modal shows in correct language
- [ ] Bottom navigation shows in correct language
- [ ] Drawer menu items show in correct language
- [ ] Courses page title shows in correct language
- [ ] Language filter labels show correctly
- [ ] Category labels show correctly (Dasar/Lanjutan/Profesional in ID)
- [ ] Language switcher in Drawer works
- [ ] Switching language updates ALL UI elements
- [ ] Language preference persists after page reload
- [ ] No console errors

---

## 📊 Translation Coverage

| Component | English Keys | Indonesian Keys | Status |
|-----------|-------------|-----------------|--------|
| WelcomeModal | ✅ 7 keys | ✅ 7 keys | ✅ Complete |
| BottomNav | ✅ 3 keys | ✅ 3 keys | ⏳ Pending |
| Drawer | ✅ 8 keys | ✅ 8 keys | ⏳ Pending |
| CoursesPage | ✅ 5 keys | ✅ 5 keys | ⏳ Pending |
| LanguageFilter | ✅ 3 keys | ✅ 3 keys | ⏳ Pending |
| Categories | ✅ 3 keys | ✅ 3 keys | ⏳ Pending |

**Total:** 29 translation keys across 6 components

---

## 🎯 Implementation Order

Do them in this order for best results:

1. **BottomNav** (3 keys) - Easy, visible immediately
2. **Drawer** (8 keys) - Important, includes language switcher
3. **LanguageFilter** (3 keys) - Quick win
4. **Categories** (3 keys) - Quick win
5. **CoursesPage** (5 keys) - Slightly more complex

**Total time:** ~30-45 minutes for all components

---

## 💡 Pro Tips

1. **Test as you go** - Update one component, test, then move to next
2. **Use browser DevTools** - Change `localStorage.setItem('locale', 'id')` to test
3. **Check translation keys** - If you see the key instead of text, the key is wrong
4. **Missing translations** - The `t()` function returns the key if translation not found

---

## 🐛 Common Issues

### Issue: Seeing translation keys instead of text
**Fix:** Check the key path matches the JSON structure exactly

### Issue: Language doesn't change
**Fix:** Make sure you're using `setLocale('id')` not just changing state

### Issue: Translations don't persist
**Fix:** Check localStorage is working (not in incognito mode)

### Issue: Some components don't update
**Fix:** Make sure component is inside `<LocaleProvider>` wrapper

---

## 📚 Reference Files

- **Locale Context:** [lib/LocaleContext.tsx](lib/LocaleContext.tsx)
- **English Translations:** [messages/en.json](messages/en.json)
- **Indonesian Translations:** [messages/id.json](messages/id.json)
- **Example (WelcomeModal):** [components/WelcomeModal.tsx](components/WelcomeModal.tsx)

---

## ✨ After Completion

Once all components are translated, you'll have:

- ✅ Complete bilingual UI (English + Indonesian)
- ✅ Auto-detection of user language
- ✅ Manual language switcher in Drawer
- ✅ Persistent language preference
- ✅ Fully localized user experience

**Ready to serve Indonesian users! 🇮🇩**

---

**Need help?** Check the WelcomeModal component for a complete example of how to use the `useLocale()` hook!

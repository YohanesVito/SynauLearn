-- ============================================
-- Migration: Add Categories to Course Hierarchy
-- ============================================
-- This implements the Hybrid approach:
-- Language → Category → Course → Difficulty → Lessons → Cards
-- ============================================

-- Step 1: Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL, -- English name
  name_id VARCHAR(255) NOT NULL, -- Indonesian name
  description TEXT, -- English description
  description_id TEXT, -- Indonesian description
  emoji VARCHAR(10),
  slug VARCHAR(100) UNIQUE NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Step 2: Create index for faster queries
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_order ON categories(order_index);

-- Step 3: Add category_id to courses table
ALTER TABLE courses
ADD COLUMN category_id UUID REFERENCES categories(id) ON DELETE SET NULL;

-- Step 4: Create index for courses.category_id
CREATE INDEX idx_courses_category_id ON courses(category_id);

-- Step 5: Insert initial categories
INSERT INTO categories (name, name_id, description, description_id, emoji, slug, order_index) VALUES
(
  'Blockchain Fundamentals',
  'Dasar-Dasar Blockchain',
  'Learn the core concepts of blockchain technology, from basic principles to advanced architecture',
  'Pelajari konsep inti teknologi blockchain, dari prinsip dasar hingga arsitektur lanjutan',
  '🔗',
  'blockchain-fundamentals',
  1
),
(
  'Web3 Development',
  'Pengembangan Web3',
  'Master Web3 development from basics to building full-stack decentralized applications',
  'Kuasai pengembangan Web3 dari dasar hingga membangun aplikasi terdesentralisasi full-stack',
  '🌐',
  'web3-development',
  2
),
(
  'DeFi & Smart Contracts',
  'DeFi & Smart Contract',
  'Explore decentralized finance protocols and smart contract development',
  'Jelajahi protokol keuangan terdesentralisasi dan pengembangan smart contract',
  '💰',
  'defi-smart-contracts',
  3
),
(
  'NFT & Digital Assets',
  'NFT & Aset Digital',
  'Understand NFTs, digital ownership, and building NFT applications',
  'Pahami NFT, kepemilikan digital, dan membangun aplikasi NFT',
  '🎨',
  'nft-digital-assets',
  4
),
(
  'Security & Cryptography',
  'Keamanan & Kriptografi',
  'Learn blockchain security, cryptography, and best practices for safe development',
  'Pelajari keamanan blockchain, kriptografi, dan praktik terbaik untuk pengembangan yang aman',
  '🔐',
  'security-cryptography',
  5
);

-- Step 6: Update existing courses with categories
-- This assigns categories based on course titles

-- Blockchain Fundamentals category
UPDATE courses
SET category_id = (SELECT id FROM categories WHERE slug = 'blockchain-fundamentals')
WHERE title LIKE '%Blockchain%'
   OR title LIKE '%blockchain%'
   OR title LIKE '%Pengenalan Blockchain%';

-- DeFi & Smart Contracts category
UPDATE courses
SET category_id = (SELECT id FROM categories WHERE slug = 'defi-smart-contracts')
WHERE title LIKE '%DeFi%'
   OR title LIKE '%Smart Contract%'
   OR title LIKE '%Arsitektur%';

-- Step 7: Verification queries
SELECT 'Categories created:' as info;
SELECT id, name, name_id, emoji, slug, order_index
FROM categories
ORDER BY order_index;

SELECT '' as info;
SELECT 'Courses with categories:' as info;
SELECT
  c.id,
  c.title,
  c.language,
  c.difficulty,
  cat.name as category_en,
  cat.name_id as category_id
FROM courses c
LEFT JOIN categories cat ON c.category_id = cat.id
ORDER BY cat.order_index, c.language, c.difficulty;

SELECT '' as info;
SELECT 'Courses without categories (need manual assignment):' as info;
SELECT id, title, language, difficulty
FROM courses
WHERE category_id IS NULL;

-- ============================================
-- Notes for manual assignment:
-- ============================================
-- If any courses don't have categories assigned automatically,
-- you can manually assign them using:
--
-- UPDATE courses
-- SET category_id = (SELECT id FROM categories WHERE slug = 'CATEGORY_SLUG')
-- WHERE id = 'COURSE_ID';
--
-- Available category slugs:
-- - blockchain-fundamentals
-- - web3-development
-- - defi-smart-contracts
-- - nft-digital-assets
-- - security-cryptography
-- ============================================

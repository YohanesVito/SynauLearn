-- ============================================
-- Insert Web3 & Blockchain Courses - 3 Separate Courses
-- ============================================
-- Language: Indonesian (id)
-- Category: Introduction to Web3 & Blockchain (new category)
-- 3 Courses with different difficulty levels:
--   1. Introduction to Web3 & Blockchain (Basic) - 5 cards
--   2. Wallet, Safety, & Best Practices (Advanced) - 5 cards
--   3. DeFi, NFT, & Onchain Identity (Professional) - 5 cards
-- ============================================

DO $$
DECLARE
  v_category_id UUID;
  v_course_1_id UUID;
  v_course_2_id UUID;
  v_course_3_id UUID;
  v_lesson_1_id UUID;
  v_lesson_2_id UUID;
  v_lesson_3_id UUID;
BEGIN
  RAISE NOTICE '=== Starting Web3 & Blockchain Courses Insertion ===';

  -- ============================================
  -- Step 1: Create "Introduction to Web3 & Blockchain" Category
  -- ============================================

  INSERT INTO categories (id, name, name_id, description, description_id, emoji, slug, order_index, created_at, updated_at)
  VALUES (
    gen_random_uuid(),
    'Introduction to Web3 & Blockchain',
    'Pengenalan Web3 & Blockchain',
    'Learn the fundamentals of Web3, blockchain technology, and decentralized applications',
    'Pelajari dasar-dasar Web3, teknologi blockchain, dan aplikasi terdesentralisasi',
    '🌐',
    'intro-web3-blockchain',
    1,
    NOW(),
    NOW()
  )
  RETURNING id INTO v_category_id;

  RAISE NOTICE 'Category "Introduction to Web3 & Blockchain" created with ID: %', v_category_id;

  -- ============================================
  -- Step 2: Create Course 1 - Introduction to Web3 & Blockchain (Basic)
  -- ============================================

  INSERT INTO courses (id, title, description, emoji, language, difficulty, category_id, total_lessons, created_at)
  VALUES (
    gen_random_uuid(),
    'Introduction to Web3 & Blockchain',
    'Pelajari evolusi internet dari Web1 ke Web3, teknologi blockchain, dan aplikasi terdesentralisasi (dApps). Pahami mengapa Web3 penting untuk masa depan.',
    '🟦',
    'id',
    'Basic',
    v_category_id,
    1,
    NOW()
  )
  RETURNING id INTO v_course_1_id;

  RAISE NOTICE 'Course 1 (Basic) created with ID: %', v_course_1_id;

  -- Create lesson for Course 1
  INSERT INTO lessons (id, course_id, title, lesson_number, total_cards, created_at)
  VALUES (gen_random_uuid(), v_course_1_id, 'Introduction to Web3 & Blockchain', 1, 5, NOW())
  RETURNING id INTO v_lesson_1_id;

  -- ============================================
  -- Step 3: Create Course 2 - Wallet, Safety, & Best Practices (Advanced)
  -- ============================================

  INSERT INTO courses (id, title, description, emoji, language, difficulty, category_id, total_lessons, created_at)
  VALUES (
    gen_random_uuid(),
    'Wallet, Safety, & Best Practices',
    'Pelajari cara menggunakan wallet Web3, melindungi private key dan seed phrase, serta mencegah wallet drain dan scam. Keamanan adalah prioritas utama!',
    '🟩',
    'id',
    'Advanced',
    v_category_id,
    1,
    NOW()
  )
  RETURNING id INTO v_course_2_id;

  RAISE NOTICE 'Course 2 (Advanced) created with ID: %', v_course_2_id;

  -- Create lesson for Course 2
  INSERT INTO lessons (id, course_id, title, lesson_number, total_cards, created_at)
  VALUES (gen_random_uuid(), v_course_2_id, 'Wallet, Safety, & Best Practices', 1, 5, NOW())
  RETURNING id INTO v_lesson_2_id;

  -- ============================================
  -- Step 4: Create Course 3 - DeFi, NFT, & Onchain Identity (Professional)
  -- ============================================

  INSERT INTO courses (id, title, description, emoji, language, difficulty, category_id, total_lessons, created_at)
  VALUES (
    gen_random_uuid(),
    'DeFi, NFT, & Onchain Identity',
    'Pahami DeFi (keuangan terdesentralisasi), NFT, dan onchain identity. Pelajari cara berinteraksi dengan dApps secara aman dan membangun reputasi digital.',
    '🟥',
    'id',
    'Professional',
    v_category_id,
    1,
    NOW()
  )
  RETURNING id INTO v_course_3_id;

  RAISE NOTICE 'Course 3 (Professional) created with ID: %', v_course_3_id;

  -- Create lesson for Course 3
  INSERT INTO lessons (id, course_id, title, lesson_number, total_cards, created_at)
  VALUES (gen_random_uuid(), v_course_3_id, 'DeFi, NFT, & Onchain Identity', 1, 5, NOW())
  RETURNING id INTO v_lesson_3_id;

  -- ============================================
  -- Step 5: Insert Cards for Course 1 (Basic - 5 cards)
  -- ============================================

  RAISE NOTICE 'Inserting cards for Course 1 (Basic)...';

  -- Card 1
  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_1_id, 1,
    'Apa itu Web3?',
    'Web3 adalah evolusi dari internet (Web1 → Web2 → Web3) di mana pengguna memiliki kendali penuh atas data, identitas, dan aset digital mereka. Jika Web2 dikuasai oleh platform besar seperti Google dan Meta, Web3 menggunakan blockchain untuk menciptakan sistem yang terbuka dan tanpa perantara. Tujuan utamanya adalah menciptakan internet yang transparan, aman, dan dimiliki oleh penggunanya sendiri.',
    'Apa yang membedakan Web3 dari Web2?',
    'Web3 dikontrol oleh satu perusahaan',
    'Web3 memungkinkan kepemilikan data oleh pengguna',
    'Web3 tidak bisa diakses publik',
    'Web3 tidak menggunakan internet',
    'B',
    NOW()
  );

  -- Card 2
  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_1_id, 2,
    'Apa itu Blockchain?',
    'Blockchain adalah teknologi penyimpanan data yang terdesentralisasi dan tersusun dalam rantai blok yang saling terhubung. Setiap blok berisi transaksi yang telah diverifikasi dan tidak bisa diubah setelah tercatat. Teknologi ini memastikan transparansi dan keamanan tanpa perlu mempercayai satu otoritas pusat.',
    'Apa yang dimaksud dengan blockchain?',
    'Database biasa yang tersimpan di satu server',
    'Teknologi yang menyimpan data dalam blok terhubung',
    'Sistem file offline',
    'Jaringan sosial',
    'B',
    NOW()
  );

  -- Card 3
  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_1_id, 3,
    'Kenapa Web3 penting?',
    'Web3 memberi pengguna kontrol penuh terhadap aset digital, membuat transaksi lebih transparan, dan menghapus ketergantungan pada perantara. Ia membuka peluang ekonomi baru berbasis komunitas, seperti DAO, NFT, dan DeFi. Dengan Web3, pengguna bukan sekadar "produk", tapi pemilik dari data dan aset mereka sendiri.',
    'Teknologi utama yang digunakan Web3 adalah…',
    'AI',
    'Cloud Computing',
    'Blockchain',
    'Database SQL',
    'C',
    NOW()
  );

  -- Card 4
  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_1_id, 4,
    'Contoh aplikasi Web3 (dApps)',
    'Aplikasi terdesentralisasi (dApps) berjalan di atas blockchain dan tidak dikontrol oleh satu entitas tunggal. Contohnya termasuk OpenSea (NFT marketplace), Uniswap (DeFi exchange), dan Lens Protocol (sosial media Web3). Semua aktivitas di dApps terekam secara publik dan bisa diverifikasi oleh siapa pun.',
    'Contoh aplikasi Web3 adalah…',
    'Instagram',
    'OpenSea',
    'YouTube',
    'WhatsApp',
    'B',
    NOW()
  );

  -- Card 5
  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_1_id, 5,
    'Keamanan Blockchain',
    'Blockchain dianggap aman karena data diverifikasi oleh banyak node (komputer) dalam jaringan, bukan hanya satu server pusat. Setiap transaksi harus dikonfirmasi oleh mayoritas node sebelum ditambahkan ke blockchain. Ini membuat blockchain sangat sulit untuk diretas atau dimanipulasi.',
    'Kenapa blockchain dianggap aman?',
    'Karena semua data bisa dihapus',
    'Karena diverifikasi oleh banyak node',
    'Karena disimpan offline',
    'Karena terenkripsi tanpa verifikasi',
    'B',
    NOW()
  );

  -- ============================================
  -- Step 6: Insert Cards for Course 2 (Advanced - 5 cards)
  -- ============================================

  RAISE NOTICE 'Inserting cards for Course 2 (Advanced)...';

  -- Card 1
  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_2_id, 1,
    'Apa itu Wallet Web3?',
    'Wallet Web3 adalah alat untuk menyimpan, mengirim, dan menerima aset digital seperti token dan NFT. Wallet juga berfungsi sebagai "identitas" untuk berinteraksi dengan dApps. Contohnya: MetaMask, Trust Wallet, dan Coinbase Wallet.',
    'Apa fungsi utama wallet Web3?',
    'Menyimpan foto',
    'Menyimpan dan mengelola aset digital',
    'Mengirim email',
    'Mengatur data sosial',
    'B',
    NOW()
  );

  -- Card 2
  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_2_id, 2,
    'Private Key & Seed Phrase',
    'Private key adalah kunci rahasia yang membuktikan kepemilikan aset di blockchain. Seed phrase adalah kumpulan 12–24 kata yang dapat digunakan untuk memulihkan wallet. Siapa pun yang tahu seed phrase-mu bisa mengakses semua asetmu — jadi jangan pernah bagikan!',
    'Apa itu seed phrase?',
    'Kumpulan kata untuk memulihkan wallet',
    'Nomor kartu kredit',
    'Kode OTP',
    'ID blockchain',
    'A',
    NOW()
  );

  -- Card 3
  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_2_id, 3,
    'Wallet Drain & Scam',
    'Wallet drain adalah pencurian aset karena pengguna memberi izin berbahaya tanpa sadar. Biasanya terjadi lewat link palsu, situs phishing, atau dApps tidak terpercaya. Begitu akses diberikan, hacker bisa menarik semua aset tanpa izin.',
    'Apa itu wallet drain?',
    'Wallet penuh',
    'Kehilangan aset karena izin berbahaya',
    'Wallet error',
    'Token hilang otomatis',
    'B',
    NOW()
  );

  -- Card 4
  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_2_id, 4,
    'Cara Mencegah Wallet Drain',
    'Jangan pernah sign transaksi dari situs asing atau mencurigakan. Gunakan hardware wallet untuk keamanan tambahan dan pisahkan wallet utama dengan wallet aktif. Secara berkala, cek izin akses dApps di situs seperti revoke.cash.',
    'Cara mencegah wallet drain?',
    'Klik semua link airdrop',
    'Gunakan hardware wallet',
    'Simpan seed phrase di browser',
    'Gunakan WiFi publik',
    'B',
    NOW()
  );

  -- Card 5
  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_2_id, 5,
    'Keamanan Seed Phrase',
    'Seed phrase adalah kunci master untuk mengakses wallet-mu. Jika seseorang meminta seed phrase di DM atau pesan pribadi, itu adalah penipuan 100%. Tim resmi dari wallet atau platform kripto tidak pernah meminta seed phrase. Laporkan dan blok segera!',
    'Jika seseorang minta seed phrase di DM, kamu harus…',
    'Kirim segera',
    'Laporkan dan blok',
    'Simpan saja',
    'Ubah jadi password',
    'B',
    NOW()
  );

  -- ============================================
  -- Step 7: Insert Cards for Course 3 (Professional - 5 cards)
  -- ============================================

  RAISE NOTICE 'Inserting cards for Course 3 (Professional)...';

  -- Card 1
  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_3_id, 1,
    'Apa itu DeFi (Decentralized Finance)?',
    'DeFi adalah sistem keuangan tanpa perantara, di mana semua aktivitas seperti pinjam, simpan, dan trading dilakukan langsung di blockchain. Tidak perlu bank atau otoritas pusat — semua transparan dan otomatis lewat smart contract. Contoh: Aave, Compound, dan Uniswap.',
    'DeFi adalah singkatan dari…',
    'Digital Finance',
    'Decentralized Finance',
    'Default File',
    'Defined Fund',
    'B',
    NOW()
  );

  -- Card 2
  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_3_id, 2,
    'NFT dan Fungsinya',
    'NFT (Non-Fungible Token) adalah aset digital unik yang disimpan di blockchain dan tidak dapat ditukar satu sama lain. Biasanya digunakan untuk karya seni, sertifikat, tiket event, hingga identitas digital. Kepemilikan NFT diverifikasi publik dan tidak bisa dipalsukan.',
    'NFT digunakan untuk…',
    'Aset digital unik',
    'Token yang bisa ditukar bebas',
    'File biasa',
    'Data privat',
    'A',
    NOW()
  );

  -- Card 3
  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_3_id, 3,
    'Onchain Identity',
    'Onchain identity adalah profil digital yang merepresentasikan aktivitas dan reputasi pengguna di blockchain. Misalnya, riwayat transaksi, kepemilikan NFT, atau partisipasi DAO. Konsep ini memungkinkan identitas yang portabel dan transparan tanpa menyerahkan data pribadi ke pihak ketiga.',
    'Onchain identity digunakan untuk…',
    'Menyembunyikan transaksi',
    'Membangun reputasi digital',
    'Menghapus data wallet',
    'Mengirim pesan',
    'B',
    NOW()
  );

  -- Card 4
  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_3_id, 4,
    'Interaksi dengan dApps',
    'Saat kamu connect wallet ke dApps, sebenarnya kamu sedang "login" tanpa perlu akun tradisional. Semua data tersimpan di wallet, bukan di server aplikasi. Karena itu, pastikan kamu hanya terhubung ke dApps yang terpercaya dan diverifikasi.',
    'Saat menggunakan dApps, wallet berfungsi sebagai…',
    'Alat login dan tanda tangan transaksi',
    'Chat tool',
    'Penyimpan data pribadi',
    'Browser',
    'A',
    NOW()
  );

  -- Card 5
  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_3_id, 5,
    'Keunikan NFT',
    'NFT berbeda dengan token kripto biasa (seperti Bitcoin atau Ethereum) karena setiap NFT memiliki identitas unik dan tidak bisa ditukar satu sama lain dengan nilai yang sama. Misalnya, NFT karya seni #1 dan #2 mungkin berbeda nilai dan karakteristiknya, sedangkan 1 ETH selalu sama dengan 1 ETH.',
    'NFT berbeda dengan token biasa karena…',
    'Memiliki identitas unik',
    'Bisa ditukar',
    'Nilainya selalu sama',
    'Tidak bisa dilihat',
    'A',
    NOW()
  );

  -- ============================================
  -- Final Summary
  -- ============================================

  RAISE NOTICE '=== Web3 & Blockchain Courses Insertion Complete! ===';
  RAISE NOTICE 'Category ID: %', v_category_id;
  RAISE NOTICE '';
  RAISE NOTICE 'Course 1 (Basic) ID: %', v_course_1_id;
  RAISE NOTICE 'Course 2 (Advanced) ID: %', v_course_2_id;
  RAISE NOTICE 'Course 3 (Professional) ID: %', v_course_3_id;
  RAISE NOTICE '';
  RAISE NOTICE 'Total Courses Created: 3';
  RAISE NOTICE 'Total Cards Inserted: 15 (5 per course)';
  RAISE NOTICE '✅ All done! Check your courses page.';
  RAISE NOTICE '';
  RAISE NOTICE 'Structure:';
  RAISE NOTICE '  Language: Indonesian (id)';
  RAISE NOTICE '    Category: Introduction to Web3 & Blockchain';
  RAISE NOTICE '      Course 1: Introduction to Web3 & Blockchain (Basic)';
  RAISE NOTICE '      Course 2: Wallet, Safety, & Best Practices (Advanced)';
  RAISE NOTICE '      Course 3: DeFi, NFT, & Onchain Identity (Professional)';

END $$;

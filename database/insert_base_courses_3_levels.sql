-- ============================================
-- Insert Base Courses - 3 Separate Courses
-- ============================================
-- Language: Indonesian (id)
-- Category: Base (new category)
-- 3 Courses with different difficulty levels:
--   1. Introduction to Base (Basic) - 10 cards
--   2. Ekosistem & Base Tools (Advanced) - 10 cards
--   3. Konsep Lanjutan tentang Base (Professional) - 10 cards
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
  RAISE NOTICE '=== Starting Base Courses Insertion ===';

  -- ============================================
  -- Step 1: Create "Base" Category
  -- ============================================

  INSERT INTO categories (id, name, name_id, description, description_id, emoji, slug, order_index, created_at, updated_at)
  VALUES (
    gen_random_uuid(),
    'Base Blockchain',
    'Blockchain Base',
    'Learn about Base - Coinbase Layer-2 blockchain built on Ethereum',
    'Pelajari Base - blockchain Layer-2 Coinbase yang dibangun di atas Ethereum',
    '⛓️',
    'base-blockchain',
    10,
    NOW(),
    NOW()
  )
  RETURNING id INTO v_category_id;

  RAISE NOTICE 'Category "Base" created with ID: %', v_category_id;

  -- ============================================
  -- Step 2: Create Course 1 - Introduction to Base (Basic)
  -- ============================================

  INSERT INTO courses (id, title, description, emoji, language, difficulty, category_id, total_lessons, created_at)
  VALUES (
    gen_random_uuid(),
    'Introduction to Base',
    'Pelajari dasar-dasar Base dan teknologi Layer-2. Pahami visi "Base for Everyone" dan mengapa Base penting dalam ekosistem blockchain.',
    '🔵',
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
  VALUES (gen_random_uuid(), v_course_1_id, 'Introduction to Base', 1, 10, NOW())
  RETURNING id INTO v_lesson_1_id;

  -- ============================================
  -- Step 3: Create Course 2 - Ekosistem & Base Tools (Advanced)
  -- ============================================

  INSERT INTO courses (id, title, description, emoji, language, difficulty, category_id, total_lessons, created_at)
  VALUES (
    gen_random_uuid(),
    'Ekosistem & Base Tools',
    'Pelajari cara menggunakan wallet, Base Bridge, dan berinteraksi dengan ekosistem Base. Pahami keamanan dan best practices.',
    '🛠️',
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
  VALUES (gen_random_uuid(), v_course_2_id, 'Ekosistem & Base Tools', 1, 10, NOW())
  RETURNING id INTO v_lesson_2_id;

  -- ============================================
  -- Step 4: Create Course 3 - Konsep Lanjutan (Professional)
  -- ============================================

  INSERT INTO courses (id, title, description, emoji, language, difficulty, category_id, total_lessons, created_at)
  VALUES (
    gen_random_uuid(),
    'Konsep Lanjutan tentang Base',
    'Pahami arsitektur teknis Base: Optimistic Rollup, Sequencer, OP Stack, dan konsep Superchain. Level profesional untuk developer.',
    '🏗️',
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
  VALUES (gen_random_uuid(), v_course_3_id, 'Konsep Lanjutan tentang Base', 1, 10, NOW())
  RETURNING id INTO v_lesson_3_id;

  -- ============================================
  -- Step 5: Insert Cards for Course 1 (Basic - 10 cards)
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
    'Apa itu Base dan Layer 2?',
    'Base adalah blockchain Layer-2 yang dibangun oleh Coinbase di atas Ethereum. Layer-2 adalah jaringan yang berjalan di atas blockchain lain (Layer-1) untuk membuat transaksi lebih cepat dan murah. Alih-alih mencatat setiap transaksi langsung di Ethereum, Base memproses transaksi off-chain dan mengirimkan ringkasannya ke Ethereum — menjaga keamanan sekaligus mengurangi kemacetan dan biaya gas.',
    'Apa itu Base?',
    'Blockchain Layer-1',
    'Blockchain Layer-2 yang dibangun oleh Coinbase',
    'Dompet kripto baru',
    'Standar token',
    'B',
    NOW()
  );

  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_1_id, 2,
    'Visi Base — "Base for Everyone"',
    'Base percaya bahwa setiap orang berhak untuk berada di dunia onchain, bukan hanya developer atau ahli kripto. Dengan biaya rendah, proses onboarding yang mudah, dan integrasi dengan produk Coinbase, Base membuat blockchain menjadi lebih mudah diakses oleh siapa pun — baik pengguna biasa maupun kreator. Motonya, "Base for Everyone," mewakili masa depan onchain yang terbuka dan inklusif.',
    'Apa fungsi blockchain Layer-2?',
    'Menggantikan Layer-1 sepenuhnya',
    'Memproses transaksi di luar rantai (off-chain) agar lebih cepat dan murah',
    'Meningkatkan biaya gas',
    'Menonaktifkan smart contract',
    'B',
    NOW()
  );

  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_1_id, 3,
    'Mengapa Base Penting',
    'Dengan menggunakan Optimism OP Stack, Base menggabungkan keamanan Ethereum dengan kinerja yang lebih cepat. Developer dapat meluncurkan aplikasi DeFi, NFT, game, dan komunitas, sementara pengguna bisa menikmati pengalaman onchain yang mulus. Melalui inisiatif seperti Onchain Summer, Base mendorong miliaran pengguna berikutnya untuk menjelajahi blockchain.',
    'Blockchain apa yang menjadi dasar Base?',
    'Solana',
    'Polygon',
    'Ethereum',
    'Bitcoin',
    'C',
    NOW()
  );

  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_1_id, 4,
    'Visi Base',
    'Base memiliki visi untuk membuat blockchain dapat diakses oleh semua orang, bukan hanya developer atau ahli kripto. Dengan moto "Base for Everyone", Base mewakili masa depan onchain yang terbuka dan inklusif.',
    'Apa visi dari Base?',
    'Menciptakan blockchain privat',
    'Membuat blockchain dapat diakses oleh semua orang',
    'Hanya berfokus pada developer',
    'Menggantikan Ethereum',
    'B',
    NOW()
  );

  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_1_id, 5,
    'Motto Base',
    'Frasa "Base for Everyone" mewakili visi Base untuk membawa semua orang ke dunia onchain. Ini bukan hanya tentang teknologi, tapi tentang inklusivitas dan aksesibilitas untuk semua pengguna.',
    'Frasa apa yang mewakili visi Base?',
    'Base Revolution',
    'Build the Base',
    'Base for Everyone',
    'Coinbase Chain',
    'C',
    NOW()
  );

  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_1_id, 6,
    'Aksesibilitas Base',
    'Base membuat blockchain lebih mudah diakses dengan menurunkan biaya gas dan menyederhanakan proses onboarding. Dengan integrasi produk Coinbase dan pengalaman pengguna yang mulus, siapa pun dapat mulai menggunakan blockchain.',
    'Bagaimana Base membuat blockchain lebih mudah diakses?',
    'Dengan menghapus wallet',
    'Dengan menurunkan biaya gas dan menyederhanakan onboarding',
    'Dengan menaikkan biaya',
    'Dengan membatasi akses pengguna',
    'B',
    NOW()
  );

  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_1_id, 7,
    'Teknologi Base',
    'Base dibangun menggunakan Optimism OP Stack, yaitu kerangka modular yang digunakan oleh banyak blockchain Layer-2. Ini memberikan Base keamanan Ethereum dengan kinerja yang lebih cepat dan biaya yang lebih rendah.',
    'Teknologi apa yang digunakan Base?',
    'Binance Chain',
    'Optimism OP Stack',
    'Cosmos SDK',
    'Solana runtime',
    'B',
    NOW()
  );

  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_1_id, 8,
    'Aplikasi di Base',
    'Developer dapat membangun berbagai jenis aplikasi di Base, termasuk aplikasi DeFi (keuangan terdesentralisasi), koleksi NFT, game blockchain, dan platform sosial. Base memberikan infrastruktur untuk semua jenis aplikasi onchain.',
    'Aplikasi apa yang bisa dibuat developer di Base?',
    'Hanya game',
    'Hanya koleksi NFT',
    'Aplikasi DeFi, NFT, game, dan platform sosial',
    'Tidak bisa, Base hanya untuk pengguna',
    'C',
    NOW()
  );

  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_1_id, 9,
    'Onchain Summer',
    'Onchain Summer adalah inisiatif yang dilakukan Base untuk mendorong kreator dan developer membangun di ekosistem Base. Program ini membantu membawa miliaran pengguna berikutnya untuk menjelajahi blockchain dan dunia onchain.',
    'Inisiatif apa yang mendorong kreator untuk membangun di Base?',
    'Onchain Summer',
    'Winter of DeFi',
    'Base Connect',
    'Coinbase Dev Week',
    'A',
    NOW()
  );

  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_1_id, 10,
    'Keamanan Base',
    'Base tetap aman meskipun merupakan Layer-2 karena Base mewarisi keamanan dari Ethereum. Transaksi yang diproses di Base pada akhirnya diselesaikan dan diverifikasi di Ethereum, sehingga mendapat perlindungan dari jaringan Ethereum yang terdesentralisasi.',
    'Apa yang membuat Base tetap aman meski merupakan Layer-2?',
    'Base mewarisi keamanan Ethereum',
    'Base menggunakan penambangnya sendiri',
    'Base tidak memverifikasi transaksi',
    'Base berjalan di server privat',
    'A',
    NOW()
  );

  -- ============================================
  -- Step 6: Insert Cards for Course 2 (Advanced - 10 cards)
  -- ============================================

  RAISE NOTICE 'Inserting cards for Course 2 (Advanced)...';

  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_2_id, 1,
    'Memulai di Base',
    'Untuk mulai menggunakan Base, kamu memerlukan wallet yang kompatibel dengan Ethereum seperti Coinbase Wallet, MetaMask, atau Rainbow. Wallet ini memungkinkan kamu terhubung ke Base seperti ke jaringan Ethereum lainnya. Kamu dapat menjembatani (bridge) ETH dari Ethereum mainnet ke Base menggunakan Base Bridge.',
    'Apa yang kamu butuhkan untuk mulai menggunakan Base?',
    'Hanya akun Coinbase',
    'Wallet yang kompatibel dengan Ethereum',
    'Perangkat keras khusus',
    'Token khusus Base',
    'B',
    NOW()
  );

  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_2_id, 2,
    'Wallet untuk Base',
    'Base kompatibel dengan wallet Ethereum populer seperti MetaMask, Coinbase Wallet, dan Rainbow. Kamu bisa menggunakan wallet yang sama untuk mengakses Ethereum dan Base, cukup dengan menambahkan Base sebagai jaringan baru di wallet-mu.',
    'Wallet mana yang bisa terhubung ke Base?',
    'Hanya Coinbase Wallet',
    'MetaMask, Coinbase Wallet, atau Rainbow',
    'Hanya Trust Wallet',
    'Phantom Wallet',
    'B',
    NOW()
  );

  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_2_id, 3,
    'Base Bridge',
    'Base Bridge adalah alat yang digunakan untuk mengirim ETH dari Ethereum mainnet ke jaringan Base. Bridge ini mengonversi ETH-mu agar bisa digunakan di Base untuk membayar biaya gas dan melakukan transaksi — dengan biaya yang jauh lebih murah dibanding di Ethereum.',
    'Untuk apa Base Bridge digunakan?',
    'Menghubungkan ke Solana',
    'Mengirim ETH dari Ethereum ke Base',
    'Mengonversi token ke fiat',
    'Membeli NFT secara langsung',
    'B',
    NOW()
  );

  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_2_id, 4,
    'Bridging ETH',
    'Saat kamu menjembatani (bridge) ETH ke Base, ETH-mu akan tersedia di jaringan Base dan bisa digunakan untuk membayar biaya gas serta berinteraksi dengan aplikasi di Base. Proses ini memindahkan nilai dari Ethereum ke Base dengan aman.',
    'Apa yang terjadi saat kamu menjembatani ETH ke Base?',
    'ETH-mu hilang',
    'ETH bisa digunakan untuk biaya gas di Base',
    'ETH berubah menjadi BTC',
    'ETH menghilang sampai ditarik kembali',
    'B',
    NOW()
  );

  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_2_id, 5,
    'Aktivitas di Base',
    'Base memungkinkan pengguna untuk melakukan berbagai aktivitas onchain seperti mint NFT, bergabung dengan platform sosial seperti Farcaster, berinteraksi dengan aplikasi DeFi, dan banyak lagi. Ekosistemnya yang terbuka memberikan pengalaman onchain yang lengkap.',
    'Apa yang bisa dilakukan pengguna di Base?',
    'Hanya trading kripto',
    'Membangun website',
    'Mint NFT, menggunakan aplikasi DeFi, dan bergabung dengan dApp sosial',
    'Menambang Bitcoin',
    'C',
    NOW()
  );

  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_2_id, 6,
    'Farcaster di Base',
    'Farcaster adalah platform sosial terdesentralisasi yang berjalan di Base. Ini adalah salah satu contoh bagaimana Base mendukung aplikasi sosial Web3, memungkinkan pengguna untuk berinteraksi dalam lingkungan onchain yang terdesentralisasi.',
    'Platform sosial mana yang berjalan di Base?',
    'Farcaster',
    'Instagram',
    'Reddit',
    'TikTok',
    'A',
    NOW()
  );

  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_2_id, 7,
    'Mengapa Membangun di Base',
    'Banyak proyek memilih untuk membangun di Base karena transaksi yang cepat, biaya gas yang rendah, dan ekosistem yang kuat dengan jumlah pengguna yang terus bertumbuh. Base juga memiliki dukungan yang baik untuk developer dan infrastruktur yang solid.',
    'Mengapa banyak proyek memilih untuk membangun di Base?',
    'Karena biaya gas tinggi',
    'Karena jumlah pengguna kecil',
    'Karena transaksi cepat dan ekosistem kuat',
    'Karena tidak ada dukungan developer',
    'C',
    NOW()
  );

  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_2_id, 8,
    'Keamanan: Wallet Draining',
    'Wallet-draining adalah jenis penipuan di mana penipu mencoba mengosongkan wallet-mu dengan meminta tanda tangan transaksi yang mencurigakan. Selalu periksa kembali transaksi yang kamu tandatangani dan jangan pernah menandatangani sesuatu yang tidak kamu pahami.',
    'Jenis penipuan apa yang umum dan harus dihindari pengguna?',
    'Airdrop resmi Base',
    'Transaksi wallet-draining',
    'Koleksi NFT terverifikasi',
    'Pengumuman dari Coinbase',
    'B',
    NOW()
  );

  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_2_id, 9,
    'Menjaga Keamanan Wallet',
    'Untuk tetap aman, jangan pernah membagikan seed phrase atau private key wallet-mu kepada siapa pun. Seed phrase adalah kunci master untuk mengakses semua aset di wallet-mu, dan siapa pun yang memilikinya dapat mengambil semua aset-mu.',
    'Apa yang tidak boleh kamu bagikan agar tetap aman?',
    'Alamat wallet',
    'Seed phrase atau private key',
    'Hash transaksi',
    'Gambar NFT',
    'B',
    NOW()
  );

  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_2_id, 10,
    'Best Practices Keamanan',
    'Cara terbaik untuk tetap aman di Base adalah dengan selalu memeriksa ulang tautan website sebelum menghubungkan wallet, belajar tentang keamanan wallet, dan tidak pernah menandatangani transaksi atau pop-up yang mencurigakan. Pendidikan dan kesadaran adalah kunci keamanan onchain.',
    'Cara terbaik untuk tetap aman di Base adalah?',
    'Selalu menandatangani pop-up acak',
    'Memeriksa ulang tautan dan belajar tentang keamanan wallet',
    'Menonaktifkan autentikasi dua faktor',
    'Menggunakan dApp yang tidak terverifikasi',
    'B',
    NOW()
  );

  -- ============================================
  -- Step 7: Insert Cards for Course 3 (Professional - 10 cards)
  -- ============================================

  RAISE NOTICE 'Inserting cards for Course 3 (Professional)...';

  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_3_id, 1,
    'Cara Kerja Base: OP Stack',
    'Base dibangun menggunakan Optimism OP Stack, yaitu kerangka modular yang digunakan oleh banyak blockchain Layer-2. Ini adalah teknologi yang membuat Base kompatibel dengan ekosistem Layer-2 lainnya dan memungkinkan skalabilitas yang tinggi.',
    'Teknologi apa yang digunakan oleh Base?',
    'Polygon SDK',
    'Optimism OP Stack',
    'Cosmos SDK',
    'Solana runtime',
    'B',
    NOW()
  );

  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_3_id, 2,
    'Optimistic Rollup',
    'Base beroperasi sebagai Optimistic Rollup, yang berarti transaksi diproses off-chain lalu digabungkan (atau "rolled up") menjadi satu paket dan dikirim kembali ke Ethereum. Dengan cara ini, Base menjadi lebih skalabel — ribuan transaksi dapat diselesaikan hanya dengan satu transaksi di Ethereum.',
    'Jenis rollup apa yang digunakan oleh Base?',
    'Zero-Knowledge Rollup',
    'Optimistic Rollup',
    'Plasma Chain',
    'Sidechain',
    'B',
    NOW()
  );

  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_3_id, 3,
    'Keuntungan Rollup',
    'Tujuan utama penggunaan rollup adalah untuk meningkatkan skalabilitas dan menurunkan biaya gas. Dengan memproses banyak transaksi off-chain dan hanya mengirim ringkasannya ke Ethereum, Base bisa memberikan pengalaman yang lebih cepat dan murah.',
    'Tujuan utama penggunaan rollup adalah…',
    'Memperlambat transaksi',
    'Meningkatkan skalabilitas dan menurunkan biaya gas',
    'Menambang token',
    'Menonaktifkan smart contract',
    'B',
    NOW()
  );

  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_3_id, 4,
    'Peran Sequencer',
    'Sequencer adalah komponen penting dalam sistem Base. Tugasnya adalah mengurutkan transaksi dan mengirimkannya ke Ethereum. Dengan melakukan ini secara off-chain, sequencer membantu Base mencapai kecepatan tinggi dan biaya rendah.',
    'Apa yang dilakukan sequencer di Base?',
    'Mengurutkan transaksi dan mengirimkannya ke Ethereum',
    'Membuat token baru',
    'Menambang blok',
    'Mengontrol wallet',
    'A',
    NOW()
  );

  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_3_id, 5,
    'Pentingnya Sequencer',
    'Sequencer penting bagi blockchain Layer-2 karena mengurutkan dan memproses transaksi dengan cepat sebelum dikirim ke Layer-1. Ini adalah komponen kunci yang membuat Layer-2 seperti Base bisa memberikan transaksi yang cepat dan murah.',
    'Mengapa sequencer penting bagi blockchain Layer-2?',
    'Karena mengamankan blockchain dengan proof-of-work',
    'Karena mengurutkan dan memproses transaksi dengan cepat',
    'Karena menyimpan NFT',
    'Karena membakar token',
    'B',
    NOW()
  );

  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_3_id, 6,
    'Superchain',
    'Superchain adalah sekelompok blockchain berbasis OP Stack yang berbagi infrastruktur yang sama. Ide ini memungkinkan berbagai Layer-2 untuk terhubung, berbagi keamanan, dan berkomunikasi satu sama lain — menciptakan jaringan blockchain yang lebih kuat dan saling terhubung.',
    'Apa itu "Superchain"?',
    'Sekelompok blockchain berbasis OP Stack yang berbagi infrastruktur yang sama',
    'Jaringan khusus Base',
    'Jaringan Coinbase yang tersentralisasi',
    'Jenis marketplace NFT',
    'A',
    NOW()
  );

  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_3_id, 7,
    'Open Source Base',
    'Base dianggap open-source karena kodenya bisa diakses dan digunakan siapa saja. Siapa pun dapat mempelajari, menyalin (fork), atau membuat blockchain baru menggunakan teknologi yang sama. Ini mendorong inovasi dan kolaborasi di seluruh ekosistem.',
    'Mengapa Base dianggap open-source?',
    'Karena kodenya bisa diakses dan digunakan siapa saja',
    'Karena hanya terbuka untuk pengguna Coinbase',
    'Karena gratis tapi tidak open-source',
    'Karena tidak menggunakan smart contract',
    'A',
    NOW()
  );

  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_3_id, 8,
    'Skalabilitas Base',
    'Base mencapai skalabilitas dengan menggulung (roll up) banyak transaksi menjadi satu batch yang dikirim ke Ethereum. Alih-alih mencatat setiap transaksi individual di Ethereum, Base menggabungkan ribuan transaksi menjadi satu — membuat proses lebih efisien.',
    'Bagaimana Base mencapai skalabilitas?',
    'Dengan memproses semua transaksi di Ethereum',
    'Dengan menggulung (roll up) banyak transaksi menjadi satu',
    'Dengan menggunakan banyak blockchain sekaligus',
    'Dengan menghapus gas sepenuhnya',
    'B',
    NOW()
  );

  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_3_id, 9,
    'Masa Depan Sequencer',
    'Di masa depan, sequencer Base mungkin akan menjadi terdesentralisasi. Ini berarti banyak pihak dapat berkontribusi terhadap keamanan dan keadilan jaringan, bukan hanya satu entitas yang mengontrol urutan transaksi. Desentralisasi sequencer akan meningkatkan keamanan dan ketahanan Base.',
    'Apa yang mungkin terjadi pada sequencer Base di masa depan?',
    'Mungkin akan menjadi terdesentralisasi',
    'Akan dihapus',
    'Akan berhenti memvalidasi transaksi',
    'Akan berubah menjadi token DAO',
    'A',
    NOW()
  );

  INSERT INTO cards (
    id, lesson_id, card_number,
    flashcard_question, flashcard_answer,
    quiz_question, quiz_option_a, quiz_option_b, quiz_option_c, quiz_option_d, quiz_correct_answer,
    created_at
  ) VALUES (
    gen_random_uuid(), v_lesson_3_id, 10,
    'Peran Base dalam Ekosistem Ethereum',
    'Base membantu Ethereum berkembang dan membawa lebih banyak pengguna onchain. Base tidak bersaing dengan Ethereum, melainkan memperluas kapabilitasnya dengan memberikan solusi Layer-2 yang skalabel. Base adalah bagian dari upaya kolektif untuk membuat Ethereum lebih mudah diakses oleh semua orang.',
    'Apa peran Base dalam ekosistem Ethereum secara keseluruhan?',
    'Bersaing dengan Ethereum',
    'Membantu Ethereum berkembang dan membawa lebih banyak pengguna onchain',
    'Menggantikan semua Layer-2 lainnya',
    'Berjalan secara independen dari Ethereum',
    'B',
    NOW()
  );

  -- ============================================
  -- Final Summary
  -- ============================================

  RAISE NOTICE '=== Base Courses Insertion Complete! ===';
  RAISE NOTICE 'Category ID: %', v_category_id;
  RAISE NOTICE '';
  RAISE NOTICE 'Course 1 (Basic) ID: %', v_course_1_id;
  RAISE NOTICE 'Course 2 (Advanced) ID: %', v_course_2_id;
  RAISE NOTICE 'Course 3 (Professional) ID: %', v_course_3_id;
  RAISE NOTICE '';
  RAISE NOTICE 'Total Courses Created: 3';
  RAISE NOTICE 'Total Cards Inserted: 30 (10 per course)';
  RAISE NOTICE '✅ All done! Check your courses page.';
  RAISE NOTICE '';
  RAISE NOTICE 'Structure:';
  RAISE NOTICE '  Language: Indonesian (id)';
  RAISE NOTICE '    Category: Base Blockchain';
  RAISE NOTICE '      Course 1: Introduction to Base (Basic)';
  RAISE NOTICE '      Course 2: Ekosistem & Base Tools (Advanced)';
  RAISE NOTICE '      Course 3: Konsep Lanjutan tentang Base (Professional)';

END $$;

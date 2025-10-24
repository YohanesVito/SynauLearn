import { supabase, Course, Lesson, Card, UserCardProgress, UserCourseProgress, Category } from './supabase';

export interface MintedBadge {
  id: string;
  user_id: string;
  course_id: string;
  wallet_address: string;
  token_id: string;
  tx_hash: string;
  minted_at: string;
}

export interface MintedBadge {
  id: string;
  user_id: string;
  course_id: string;
  wallet_address: string;
  token_id: string;
  tx_hash: string;
  minted_at: string;
}

export class API {
  // ============ COURSES ============
  static async getCourses(language?: 'en' | 'id'): Promise<Course[]> {
    let query = supabase
      .from('courses')
      .select('*');

    // Filter by language if specified
    if (language) {
      query = query.eq('language', language);
    }

    const { data, error } = await query.order('created_at');

    if (error) throw error;
    return data || [];
  }

  static async getCourse(courseId: string): Promise<Course | null> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();

    if (error) throw error;
    return data;
  }

  static async getCoursesWithCategories(language?: 'en' | 'id'): Promise<Course[]> {
    let query = supabase
      .from('courses')
      .select(`
        *,
        category:categories(*)
      `);

    if (language) {
      query = query.eq('language', language);
    }

    const { data, error } = await query.order('created_at');

    if (error) throw error;
    return data || [];
  }

  // ============ CATEGORIES ============
  static async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('order_index');

    if (error) throw error;
    return data || [];
  }

  // ============ LESSONS ============
  static async getLessonsForCourse(courseId: string): Promise<Lesson[]> {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('lesson_number');

    if (error) throw error;
    return data || [];
  }

  static async getLesson(lessonId: string): Promise<Lesson | null> {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .single();

    if (error) throw error;
    return data;
  }

  // ============ CARDS ============
  static async getCardsForLesson(lessonId: string): Promise<Card[]> {
    const { data, error } = await supabase
      .from('cards')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('card_number');

    if (error) throw error;
    return data || [];
  }

  // ============ USER MANAGEMENT ============
  static async getUserOrCreate(fid: number, username?: string, displayName?: string) {
    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('fid', fid)
      .single();

    if (existingUser) return existingUser;

    // Create new user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        fid,
        username,
        display_name: displayName,
        total_xp: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return newUser;
  }

  static async getUser(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  static async getUserByFid(fid: number) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('fid', fid)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  // ============ USER PROGRESS ============
  static async saveCardProgress(
    userId: string,
    cardId: string,
    quizCorrect: boolean
  ): Promise<void> {
    const xpEarned = quizCorrect ? 15 : 5;

    const { error } = await supabase
      .from('user_card_progress')
      .upsert({
        user_id: userId,
        card_id: cardId,
        flashcard_viewed: true,
        quiz_completed: true,
        quiz_correct: quizCorrect,
        xp_earned: xpEarned,
        completed_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,card_id'
      });

    if (error) throw error;

    await this.updateUserXP(userId, xpEarned);
  }

  static async updateUserXP(userId: string, xpToAdd: number): Promise<void> {
    const { data: user } = await supabase
      .from('users')
      .select('total_xp')
      .eq('id', userId)
      .single();

    if (user) {
      const newXP = (user.total_xp || 0) + xpToAdd;
      
      const { error } = await supabase
        .from('users')
        .update({ total_xp: newXP })
        .eq('id', userId);

      if (error) throw error;
    }
  }

  static async getUserProgress(userId: string, lessonId: string): Promise<UserCardProgress[]> {
    const { data: cards } = await supabase
      .from('cards')
      .select('id')
      .eq('lesson_id', lessonId);

    if (!cards || cards.length === 0) return [];

    const cardIds = cards.map(card => card.id);

    const { data, error } = await supabase
      .from('user_card_progress')
      .select('*')
      .eq('user_id', userId)
      .in('card_id', cardIds);

    if (error) throw error;
    return data || [];
  }

  static async getCourseProgress(userId: string, courseId: string): Promise<UserCourseProgress | null> {
    const { data, error } = await supabase
      .from('user_course_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async updateCourseProgress(
    userId: string,
    courseId: string,
    cardsCompleted: number,
    xpEarned: number,
    isComplete: boolean = false
  ): Promise<void> {
    const { error } = await supabase
      .from('user_course_progress')
      .upsert({
        user_id: userId,
        course_id: courseId,
        cards_completed: cardsCompleted,
        total_xp_earned: xpEarned,
        completed_at: isComplete ? new Date().toISOString() : null,
      }, {
        onConflict: 'user_id,course_id'
      });

    if (error) throw error;
  }

  // ============ BADGE MINTING ============
  static async saveMintedBadge(
    userId: string,
    courseId: string,
    walletAddress: string,
    tokenId: string,
    txHash: string
  ): Promise<void> {
    const { error } = await supabase
      .from('minted_badges')
      .insert({
        user_id: userId,
        course_id: courseId,
        wallet_address: walletAddress,
        token_id: tokenId,
        tx_hash: txHash,
      });

    if (error) throw error;
  }

  static async getMintedBadge(userId: string, courseId: string): Promise<MintedBadge | null> {
    const { data, error } = await supabase
      .from('minted_badges')
      .select('*')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async getMintedBadgesByWallet(walletAddress: string): Promise<MintedBadge[]> {
    const { data, error } = await supabase
      .from('minted_badges')
      .select('*')
      .eq('wallet_address', walletAddress)
      .order('minted_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async deleteMintedBadge(userId: string, courseId: string): Promise<void> {
    const { error } = await supabase
      .from('minted_badges')
      .delete()
      .eq('user_id', userId)
      .eq('course_id', courseId);

    if (error) throw error;
  }

  static async deleteAllMintedBadgesForWallet(walletAddress: string): Promise<void> {
    const { error } = await supabase
      .from('minted_badges')
      .delete()
      .eq('wallet_address', walletAddress);

    if (error) throw error;
  }

  static async getUserMintedBadges(userId: string): Promise<MintedBadge[]> {
    const { data, error } = await supabase
      .from('minted_badges')
      .select('*')
      .eq('user_id', userId)
      .order('minted_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async hasMintedBadge(userId: string, courseId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('minted_badges')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();

    if (error && error.code !== 'PGRST116') return false;
    return !!data;
  }

  // ============ LEADERBOARD ============
  static async getLeaderboard(limit: number = 10) {
    const { data, error } = await supabase
      .from('users')
      .select('id, fid, username, display_name, total_xp')
      .order('total_xp', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  // ============ STATS ============
  static async getUserStats(userId: string) {
    // Get total cards completed
    const { data: cardProgress } = await supabase
      .from('user_card_progress')
      .select('quiz_correct')
      .eq('user_id', userId);

    const totalCardsCompleted = cardProgress?.length || 0;
    const correctAnswers = cardProgress?.filter(p => p.quiz_correct).length || 0;

    // Get courses completed
    const { data: courseProgress } = await supabase
      .from('user_course_progress')
      .select('*')
      .eq('user_id', userId)
      .not('completed_at', 'is', null);

    const coursesCompleted = courseProgress?.length || 0;

    // Get minted badges count
    const { data: mintedBadges } = await supabase
      .from('minted_badges')
      .select('id')
      .eq('user_id', userId);

    const badgesMinted = mintedBadges?.length || 0;

    // Get total XP
    const { data: user } = await supabase
      .from('users')
      .select('total_xp')
      .eq('id', userId)
      .single();

    return {
      totalXP: user?.total_xp || 0,
      cardsCompleted: totalCardsCompleted,
      correctAnswers,
      coursesCompleted,
      badgesMinted,
      accuracy: totalCardsCompleted > 0 ? Math.round((correctAnswers / totalCardsCompleted) * 100) : 0,
    };
  }

  // ============ COURSE STATS ============
  static async getCourseProgressPercentage(userId: string, courseId: string): Promise<number> {
    // Get total cards in course
    const { data: lessons } = await supabase
      .from('lessons')
      .select('id')
      .eq('course_id', courseId);

    if (!lessons || lessons.length === 0) return 0;

    const lessonIds = lessons.map(l => l.id);

    const { data: allCards } = await supabase
      .from('cards')
      .select('id')
      .in('lesson_id', lessonIds);

    const totalCards = allCards?.length || 0;
    if (totalCards === 0) return 0;

    // Get completed cards
    const cardIds = allCards?.map(c => c.id) || [];

    const { data: completedCards } = await supabase
      .from('user_card_progress')
      .select('id')
      .eq('user_id', userId)
      .in('card_id', cardIds)
      .eq('quiz_completed', true);

    const completedCount = completedCards?.length || 0;

    return Math.round((completedCount / totalCards) * 100);
  }
}

// Re-export types for convenience
export type { Course, Lesson, Card, UserCardProgress, UserCourseProgress, Category };
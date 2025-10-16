import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Course {
  id: string;
  title: string;
  description: string;
  emoji: string;
  total_lessons: number;
  created_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  lesson_number: number;
  title: string;
  total_cards: number;
  created_at: string;
}

export interface Card {
  id: string;
  lesson_id: string;
  card_number: number;
  flashcard_question: string;
  flashcard_answer: string;
  quiz_question: string;
  quiz_option_a: string;
  quiz_option_b: string;
  quiz_option_c: string;
  quiz_option_d: string;
  quiz_correct_answer: 'A' | 'B' | 'C' | 'D';
  created_at: string;
}

export interface UserCardProgress {
  id: string;
  user_id: string;
  card_id: string;
  flashcard_viewed: boolean;
  quiz_completed: boolean;
  quiz_correct: boolean;
  xp_earned: number;
  completed_at: string;
}

export interface UserCourseProgress {
  id: string;
  user_id: string;
  course_id: string;
  cards_completed: number;
  total_xp_earned: number;
  completed_at: string | null;
}
// Load .env file in Node.js environments (for scripts)
if (typeof window === 'undefined') {
  try {
    require('dotenv').config();
  } catch (e) {
    // dotenv not available or already loaded, that's ok
  }
}

import { createClient } from '@supabase/supabase-js';

// Support both browser (NEXT_PUBLIC_*) and Node.js environments
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key are required. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env file');
}

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
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getCourses() {
  const { data, error } = await supabase
    .from('courses')
    .select('*');
  return { data, error };
}

export async function getCardsForLesson(lessonId: string) {
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('card_number');
  return { data, error };
}

export async function saveCardProgress(
  userId: string,
  cardId: string,
  quizCorrect: boolean
) {
  const { data, error } = await supabase
    .from('user_card_progress')
    .upsert({
      user_id: userId,
      card_id: cardId,
      flashcard_viewed: true,
      quiz_completed: true,
      quiz_correct: quizCorrect,
      xp_earned: quizCorrect ? 15 : 5,
      completed_at: new Date().toISOString(),
    });
  return { data, error };
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  source?: string;
  created_at?: string;
  updated_at?: string;
}

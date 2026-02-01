import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface QuizSession {
  id: number;
  application: string;
  difficulty: string | null;
  score: number;
  total_questions: number;
  correct_answers: number;
  started_at: string;
  completed_at: string | null;
}

interface QuizAnswer {
  shortcut_id: number;
  was_correct: boolean;
}

export const useQuizProgress = () => {
  const { user } = useAuth();
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Start a new quiz session
   */
  const startQuizSession = useCallback(
    async (application: string, difficulty?: string | null) => {
      if (!user) {
        console.log('User not logged in, skipping quiz session creation');
        return null;
      }

      setSaving(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('quiz_sessions')
          .insert({
            user_id: user.id,
            application,
            difficulty: difficulty || null,
            score: 0,
            total_questions: 0,
            correct_answers: 0
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating quiz session:', error);
          setError(error);
          return null;
        }

        setCurrentSessionId(data.id);
        return data.id;
      } catch (err) {
        console.error('Error creating quiz session:', err);
        setError(err as Error);
        return null;
      } finally {
        setSaving(false);
      }
    },
    [user]
  );

  /**
   * Record a quiz answer
   */
  const recordAnswer = useCallback(
    async (shortcutId: number, wasCorrect: boolean) => {
      if (!user || !currentSessionId) {
        return;
      }

      try {
        // Insert answer into quiz_history
        const { error: historyError } = await supabase.from('quiz_history').insert({
          user_id: user.id,
          session_id: currentSessionId,
          shortcut_id: shortcutId,
          was_correct: wasCorrect
        });

        if (historyError) {
          console.error('Error recording quiz answer:', historyError);
        }
      } catch (err) {
        console.error('Error recording quiz answer:', err);
      }
    },
    [user, currentSessionId]
  );

  /**
   * Complete the current quiz session
   */
  const completeQuizSession = useCallback(
    async (score: number, totalQuestions: number, correctAnswers: number) => {
      if (!user || !currentSessionId) {
        console.log('No active session to complete');
        return;
      }

      setSaving(true);
      setError(null);

      try {
        const { error } = await supabase
          .from('quiz_sessions')
          .update({
            score,
            total_questions: totalQuestions,
            correct_answers: correctAnswers,
            completed_at: new Date().toISOString()
          })
          .eq('id', currentSessionId);

        if (error) {
          console.error('Error completing quiz session:', error);
          setError(error);
        } else {
          setCurrentSessionId(null);
        }
      } catch (err) {
        console.error('Error completing quiz session:', err);
        setError(err as Error);
      } finally {
        setSaving(false);
      }
    },
    [user, currentSessionId]
  );

  /**
   * Get user's quiz statistics for a specific application
   */
  const getQuizStats = useCallback(
    async (application: string) => {
      if (!user) {
        return null;
      }

      try {
        const { data, error } = await supabase
          .from('user_quiz_stats')
          .select('*')
          .eq('user_id', user.id)
          .eq('application', application)
          .single();

        if (error && error.code !== 'PGRST116') {
          // PGRST116 is "not found" error
          console.error('Error fetching quiz stats:', error);
          return null;
        }

        return data;
      } catch (err) {
        console.error('Error fetching quiz stats:', err);
        return null;
      }
    },
    [user]
  );

  /**
   * Get user's recent quiz sessions
   */
  const getRecentSessions = useCallback(
    async (limit = 10) => {
      if (!user) {
        return [];
      }

      try {
        const { data, error } = await supabase
          .from('quiz_sessions')
          .select('*')
          .eq('user_id', user.id)
          .not('completed_at', 'is', null)
          .order('completed_at', { ascending: false })
          .limit(limit);

        if (error) {
          console.error('Error fetching recent sessions:', error);
          return [];
        }

        return data as QuizSession[];
      } catch (err) {
        console.error('Error fetching recent sessions:', err);
        return [];
      }
    },
    [user]
  );

  return {
    currentSessionId,
    saving,
    error,
    startQuizSession,
    recordAnswer,
    completeQuizSession,
    getQuizStats,
    getRecentSessions
  };
};

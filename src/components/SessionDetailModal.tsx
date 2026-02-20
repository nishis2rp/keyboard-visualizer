import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';
import './SessionDetailModal.css';

interface QuizAnswer {
  id: number;
  shortcut_id: number;
  was_correct: boolean;
  answered_at: string;
  shortcuts: {
    keys: string;
    description: string;
    description_en?: string | null;
    application: string;
  };
}

interface SessionDetailModalProps {
  sessionId: number;
  onClose: () => void;
}

const SessionDetailModal: React.FC<SessionDetailModalProps> = ({ sessionId, onClose }) => {
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, language } = useLanguage();

  useEffect(() => {
    const fetchSessionDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from('quiz_history')
          .select(`
            id,
            shortcut_id,
            was_correct,
            answered_at,
            shortcuts (
              keys,
              description,
              description_en,
              application
            )
          `)
          .eq('session_id', sessionId)
          .order('answered_at', { ascending: true });

        if (fetchError) {
          throw fetchError;
        }

        setAnswers(data as unknown as QuizAnswer[]);
      } catch (err: unknown) {
        console.error('Error fetching session details:', err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(t.sessionDetail.failedToFetch + errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionDetails();
  }, [sessionId, t.sessionDetail.failedToFetch]);

  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">{t.common.loading}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="alert alert-error">{error}</div>
          <button className="form-button" onClick={onClose}>{t.common.close}</button>
        </div>
      </div>
    );
  }

  const correctCount = answers.filter(a => a.was_correct).length;
  const totalCount = answers.length;
  const accuracy = totalCount > 0 ? ((correctCount / totalCount) * 100).toFixed(1) : '0.0';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content session-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t.sessionDetail.title}</h2>
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="session-summary">
          <div className="summary-item">
            <span className="summary-label">{t.sessionDetail.accuracy}</span>
            <span className="summary-value">{accuracy}%</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">{t.sessionDetail.correctAnswers}</span>
            <span className="summary-value">{correctCount} / {totalCount}</span>
          </div>
        </div>

        <div className="answers-list">
          <h3>{t.sessionDetail.history}</h3>
          {answers.length === 0 ? (
            <p className="empty-state-text">{t.sessionDetail.noHistory}</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{t.sessionDetail.table.shortcut}</th>
                  <th>{t.sessionDetail.table.description}</th>
                  <th>{t.sessionDetail.table.result}</th>
                  <th>{t.sessionDetail.table.time}</th>
                </tr>
              </thead>
              <tbody>
                {answers.map((answer, index) => (
                  <tr key={answer.id} className={answer.was_correct ? 'correct-row' : 'incorrect-row'}>
                    <td>{index + 1}</td>
                    <td className="shortcut-cell">{answer.shortcuts.keys}</td>
                    <td>
                      {language === 'en' && answer.shortcuts.description_en
                        ? answer.shortcuts.description_en
                        : answer.shortcuts.description}
                    </td>
                    <td>
                      <span className={`result-badge ${answer.was_correct ? 'correct' : 'incorrect'}`}>
                        {answer.was_correct ? t.sessionDetail.resultCorrect : t.sessionDetail.resultIncorrect}
                      </span>
                    </td>
                    <td>{new Date(answer.answered_at).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="modal-footer">
          <button className="form-button" onClick={onClose}>{t.common.close}</button>
        </div>
      </div>
    </div>
  );
};

export default SessionDetailModal;

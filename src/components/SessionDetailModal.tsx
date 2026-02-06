import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './SessionDetailModal.css';

interface QuizAnswer {
  id: number;
  shortcut_id: number;
  was_correct: boolean;
  answered_at: string;
  shortcuts: {
    keys: string;
    description: string;
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
              application
            )
          `)
          .eq('session_id', sessionId)
          .order('answered_at', { ascending: true });

        if (fetchError) {
          throw fetchError;
        }

        setAnswers(data as unknown as QuizAnswer[]);
      } catch (err: any) {
        console.error('Error fetching session details:', err);
        setError('セッション詳細の取得に失敗しました: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionDetails();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">読み込み中...</p>
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
          <button className="form-button" onClick={onClose}>閉じる</button>
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
          <h2>クイズセッション詳細</h2>
          <button className="modal-close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="session-summary">
          <div className="summary-item">
            <span className="summary-label">正解率:</span>
            <span className="summary-value">{accuracy}%</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">正解数:</span>
            <span className="summary-value">{correctCount} / {totalCount}</span>
          </div>
        </div>

        <div className="answers-list">
          <h3>回答履歴</h3>
          {answers.length === 0 ? (
            <p className="empty-state-text">回答履歴がありません</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>ショートカット</th>
                  <th>説明</th>
                  <th>結果</th>
                  <th>回答時刻</th>
                </tr>
              </thead>
              <tbody>
                {answers.map((answer, index) => (
                  <tr key={answer.id} className={answer.was_correct ? 'correct-row' : 'incorrect-row'}>
                    <td>{index + 1}</td>
                    <td className="shortcut-cell">{answer.shortcuts.keys}</td>
                    <td>{answer.shortcuts.description}</td>
                    <td>
                      <span className={`result-badge ${answer.was_correct ? 'correct' : 'incorrect'}`}>
                        {answer.was_correct ? '✓ 正解' : '✗ 不正解'}
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
          <button className="form-button" onClick={onClose}>閉じる</button>
        </div>
      </div>
    </div>
  );
};

export default SessionDetailModal;

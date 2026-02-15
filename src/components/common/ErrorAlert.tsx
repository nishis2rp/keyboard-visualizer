import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './ErrorAlert.css';

interface ErrorAlertProps {
  /** エラーメッセージ */
  message: string;
  /** リトライ可能な場合のコールバック */
  onRetry?: () => void;
  /** エラーを閉じるコールバック */
  onDismiss?: () => void;
  /** エラーの種類（表示スタイルの切り替え用） */
  variant?: 'error' | 'warning' | 'info';
}

/**
 * エラー表示用の汎用コンポーネント
 *
 * エラーメッセージの表示、リトライ、閉じる機能を提供します。
 * データ取得エラー、ネットワークエラー、バリデーションエラーなど、
 * あらゆる種類のエラーに対応できます。
 */
export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  onRetry,
  onDismiss,
  variant = 'error',
}) => {
  const { t } = useLanguage();

  const getIcon = () => {
    switch (variant) {
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '❌';
    }
  };

  return (
    <div className={`error-alert error-alert--${variant}`} role="alert">
      <div className="error-alert__content">
        <span className="error-alert__icon">{getIcon()}</span>
        <p className="error-alert__message">{message}</p>
      </div>
      <div className="error-alert__actions">
        {onRetry && (
          <button
            className="error-alert__button error-alert__button--retry"
            onClick={onRetry}
            type="button"
          >
            {t.common?.retry || 'Retry'}
          </button>
        )}
        {onDismiss && (
          <button
            className="error-alert__button error-alert__button--dismiss"
            onClick={onDismiss}
            type="button"
            aria-label={t.common?.close || 'Close'}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

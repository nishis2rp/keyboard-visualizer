import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import {
  checkPasswordStrength,
  getPasswordStrengthLabel,
  getPasswordStrengthColor,
  getPasswordStrengthBarColor,
  isValidEmail,
} from '../../utils/validation';

interface AccountSettingsProps {
  newEmail: string;
  setNewEmail: (email: string) => void;
  handleEmailUpdate: (e: React.FormEvent) => Promise<void>;
  emailUpdateLoading: boolean;
  showDeleteConfirm: boolean;
  setShowDeleteConfirm: (show: boolean) => void;
  handleDeleteAccount: () => Promise<void>;
  deleting: boolean;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({
  newEmail,
  setNewEmail,
  handleEmailUpdate,
  emailUpdateLoading,
  showDeleteConfirm,
  setShowDeleteConfirm,
  handleDeleteAccount,
  deleting,
}) => {
  const { t } = useLanguage();
  const { user, updatePassword } = useAuth();

  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordUpdateLoading, setPasswordUpdateLoading] = useState(false);
  const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Email validation
  const [emailError, setEmailError] = useState<string | null>(null);

  const passwordStrength = newPassword ? checkPasswordStrength(newPassword) : null;

  if (!user) return null;

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordUpdateSuccess(false);

    if (!passwordStrength || !passwordStrength.isValid) {
      setPasswordError('パスワードは6文字以上で入力してください');
      return;
    }

    setPasswordUpdateLoading(true);

    try {
      const { error } = await updatePassword(newPassword);
      if (error) {
        setPasswordError(error.message || 'パスワードの更新に失敗しました');
      } else {
        setPasswordUpdateSuccess(true);
        setNewPassword('');
        setShowPassword(false);
        setTimeout(() => {
          setShowPasswordForm(false);
          setPasswordUpdateSuccess(false);
        }, 3000);
      }
    } catch (err) {
      setPasswordError('予期しないエラーが発生しました');
    } finally {
      setPasswordUpdateLoading(false);
    }
  };

  const handleEmailBlur = () => {
    if (newEmail && !isValidEmail(newEmail)) {
      setEmailError('有効なメールアドレスを入力してください');
    } else {
      setEmailError(null);
    }
  };

  return (
    <section className="bg-white rounded-apple-xl p-8 shadow-apple-md border border-gray-100 transition-all hover:shadow-apple-lg">
      <h2 className="text-lg font-bold text-sf-primary mb-6 flex items-center gap-2 tracking-tight border-b border-gray-100 pb-2">
        {t.myPage.settingsTitle}
      </h2>
      
      <div className="mb-6">
        <h3 className="text-[11px] font-bold text-sf-gray uppercase tracking-wider mb-2">{t.myPage.changeEmail}</h3>
        <p className="text-[10px] text-sf-gray mb-2">現在: {user.email}</p>
        <form onSubmit={handleEmailUpdate} className="space-y-2">
          <div className="flex gap-1.5">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => {
                setNewEmail(e.target.value);
                setEmailError(null);
              }}
              onBlur={handleEmailBlur}
              className={`apple-input py-1.5 text-xs ${emailError ? 'border-red-400' : ''}`}
              placeholder={t.myPage.newEmailPlaceholder}
              aria-invalid={emailError ? 'true' : 'false'}
              aria-describedby={emailError ? 'email-update-error' : undefined}
            />
            <button
              type="submit"
              disabled={emailUpdateLoading || newEmail === user.email || !!emailError || !newEmail}
              className="px-3 py-1.5 bg-sf-blue text-white rounded-apple-sm text-[10px] font-bold disabled:opacity-50 disabled:cursor-not-allowed shrink-0 transition-opacity"
            >
              {emailUpdateLoading ? (
                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                t.myPage.changeButton
              )}
            </button>
          </div>
          {emailError && (
            <p id="email-update-error" className="text-xs text-red-600 font-medium" role="alert">
              {emailError}
            </p>
          )}
          <p className="text-[9px] text-sf-gray/70">
            ⚠️ メールアドレス変更後、新しいメールアドレスに確認メールが送信されます
          </p>
        </form>
      </div>

      <div className="h-[1px] bg-gray-100 my-6"></div>

      <div className="mb-6">
        <h3 className="text-[11px] font-bold text-sf-gray uppercase tracking-wider mb-2">{t.myPage.passwordTitle}</h3>

        {!showPasswordForm ? (
          <button
            onClick={() => setShowPasswordForm(true)}
            className="text-xs text-sf-blue font-bold bg-transparent border-none p-0 cursor-pointer hover:underline"
          >
            パスワードを変更する
          </button>
        ) : (
          <form onSubmit={handlePasswordUpdate} className="space-y-3 mt-3 p-4 bg-gray-50 rounded-apple-md border border-gray-100">
            {passwordUpdateSuccess && (
              <div className="p-2 bg-green-50 border border-green-100 rounded-apple-sm text-green-600 text-xs font-bold" role="status">
                ✓ パスワードを更新しました
              </div>
            )}

            {passwordError && (
              <div className="p-2 bg-red-50 border border-red-100 rounded-apple-sm text-red-600 text-xs font-bold" role="alert">
                ⚠️ {passwordError}
              </div>
            )}

            <div>
              <label className="text-[10px] font-bold text-sf-gray mb-1.5 block">新しいパスワード</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordError(null);
                  }}
                  className="apple-input py-1.5 text-xs pr-8 w-full"
                  placeholder="新しいパスワードを入力"
                  minLength={6}
                  required
                  aria-invalid={passwordError ? 'true' : 'false'}
                  aria-describedby="password-strength-info"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sf-gray hover:text-sf-primary transition-colors p-1"
                  aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Password strength indicator */}
              {newPassword && passwordStrength && (
                <div id="password-strength-info" className="mt-2 space-y-2" role="status" aria-live="polite">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${getPasswordStrengthBarColor(passwordStrength.score)}`}
                        style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                      />
                    </div>
                    <span className={`text-[10px] font-bold ${getPasswordStrengthColor(passwordStrength.score)}`}>
                      {getPasswordStrengthLabel(passwordStrength.score)}
                    </span>
                  </div>
                  {passwordStrength.feedback.length > 0 && (
                    <ul className="space-y-0.5">
                      {passwordStrength.feedback.map((feedback, index) => (
                        <li key={index} className="text-[9px] text-sf-gray font-medium flex items-start gap-1">
                          <span className="mt-0.5">{feedback.startsWith('✓') ? '✓' : '•'}</span>
                          <span>{feedback.replace('✓ ', '')}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={passwordUpdateLoading || (passwordStrength && !passwordStrength.isValid)}
                className="px-3 py-1.5 bg-sf-blue text-white rounded-apple-sm text-[10px] font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                {passwordUpdateLoading ? (
                  <span className="flex items-center gap-1.5">
                    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    更新中...
                  </span>
                ) : (
                  'パスワードを更新'
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPasswordForm(false);
                  setNewPassword('');
                  setPasswordError(null);
                  setShowPassword(false);
                }}
                disabled={passwordUpdateLoading}
                className="px-3 py-1.5 bg-white text-sf-gray rounded-apple-sm text-[10px] font-bold border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                キャンセル
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="h-[1px] bg-gray-100 my-6"></div>

      <div>
        <h3 className="text-[11px] font-bold text-sf-gray uppercase tracking-wider mb-2 text-sf-red">{t.myPage.dangerZoneTitle}</h3>
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-xs text-sf-red font-bold bg-transparent border-none p-0 cursor-pointer hover:underline"
            aria-label={t.myPage.deleteAccountButton}
          >
            {t.myPage.deleteAccountButton}
          </button>
        ) : (
          <div className="bg-red-50 p-4 rounded-apple-md text-center mt-2 border border-red-100" role="alertdialog" aria-labelledby="delete-confirm-title">
            <p id="delete-confirm-title" className="text-[11px] text-sf-red-dark font-bold mb-3">{t.myPage.deleteConfirmText}</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="px-4 py-2 bg-sf-red text-white text-[10px] font-bold rounded cursor-pointer border-none shadow-sm hover:bg-sf-red-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={t.myPage.deleteConfirmButton}
              >
                {deleting ? (
                  <span className="flex items-center gap-1.5">
                    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    削除中...
                  </span>
                ) : (
                  t.myPage.deleteConfirmButton
                )}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="px-4 py-2 bg-white text-sf-gray text-[10px] font-bold rounded cursor-pointer border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={t.myPage.deleteCancelButton}
              >
                {t.myPage.deleteCancelButton}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AccountSettings;

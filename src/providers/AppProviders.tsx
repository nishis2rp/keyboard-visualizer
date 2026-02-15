import React, { ReactNode } from 'react';
import {
  LanguageProvider,
  AuthProvider,
  SettingsProvider,
  UIProvider,
  ShortcutProvider,
  QuizProvider,
} from '../context';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * アプリケーション全体のContextプロバイダーを統合した複合コンポーネント
 *
 * プロバイダーの順序は依存関係に基づいて設定されています：
 * 1. LanguageProvider - 言語設定（他のプロバイダーで使用される可能性があるため最上位）
 * 2. AuthProvider - 認証状態（多くの機能で使用される）
 * 3. SettingsProvider - アプリケーション設定
 * 4. UIProvider - UI状態管理
 * 5. ShortcutProvider - ショートカットデータ（UIProviderの状態に依存）
 * 6. QuizProvider - クイズ機能（ShortcutProviderのデータに依存）
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <SettingsProvider>
          <UIProvider>
            <ShortcutProvider>
              <QuizProvider>
                {children}
              </QuizProvider>
            </ShortcutProvider>
          </UIProvider>
        </SettingsProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

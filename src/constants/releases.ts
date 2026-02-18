export interface ReleaseChange {
  category: 'feature' | 'improvement' | 'fix' | 'breaking';
  descriptionKey: string;
  descriptionEn: string;
  descriptionJa: string;
}

export interface Release {
  version: string;
  date: string;
  titleKey: string;
  titleEn: string;
  titleJa: string;
  changes: ReleaseChange[];
}

export const releases: Release[] = [
  {
    version: '2.7.0',
    date: '2026-02-18',
    titleKey: 'v2.7.0',
    titleEn: 'Social Proof & High-Resolution Optimization',
    titleJa: 'ソーシャルプルーフと高解像度最適化',
    changes: [
      {
        category: 'feature',
        descriptionKey: 'v2.7.0-testimonials',
        descriptionEn: 'Added "User Testimonials" section to Landing Page to showcase real-world benefits',
        descriptionJa: 'LPに「お客様の声」セクションを追加：実際の利用メリットを視覚化'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.7.0-responsive-scaling',
        descriptionEn: 'Implemented advanced responsive layout scaling for high-resolution displays (up to 1500px height)',
        descriptionJa: '高解像度ディスプレイ（高さ1500pxまで）向けの高度なレスポンシブスケーリングを実装'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.7.0-color-theme',
        descriptionEn: 'Unified color palette to a sleek gray/black theme for a more professional and modern look',
        descriptionJa: 'カラーパレットをグレー/ブラックに統一：よりプロフェッショナルでモダンな外観に'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.7.0-particles',
        descriptionEn: 'Optimized particle background animation density and speed scaling for better performance',
        descriptionJa: 'パーティクル背景の密度と速度スケーリングを最適化し、パフォーマンスを向上'
      },
      {
        category: 'fix',
        descriptionKey: 'v2.7.0-ctrl-cv-fix',
        descriptionEn: 'Resolved display issue for Ctrl+C and Ctrl+V shortcuts on Windows 11 platform',
        descriptionJa: 'Windows 11プラットフォームにおけるCtrl+CおよびCtrl+Vの表示問題を修正'
      }
    ]
  },
  {
    version: '2.6.0',
    date: '2026-02-17',
    titleKey: 'v2.6.0',
    titleEn: 'SEO Enhancement & International Optimization',
    titleJa: 'SEO強化と国際化最適化',
    changes: [
      {
        category: 'feature',
        descriptionKey: 'v2.6.0-seo-component',
        descriptionEn: 'Added dynamic SEO component for automatic meta tag management across all pages',
        descriptionJa: '全ページに動的SEOコンポーネントを追加：メタタグの自動管理を実現'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.6.0-english-meta',
        descriptionEn: 'Localized all meta tags to English for international reach with Open Graph locale support',
        descriptionJa: 'メタタグを英語化して国際的なリーチを向上：Open Graph locale対応'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.6.0-sitemap',
        descriptionEn: 'Expanded sitemap.xml with app, mypage, and release-notes pages for better SEO indexing',
        descriptionJa: 'サイトマップを拡充：app、mypage、release-notesページを追加してSEOインデックス改善'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.6.0-manifest',
        descriptionEn: 'Updated PWA manifest to English (short_name: "KB Visualizer") for global audience',
        descriptionJa: 'PWAマニフェストを英語化（short_name: "KB Visualizer"）してグローバル対応'
      },
      {
        category: 'fix',
        descriptionKey: 'v2.6.0-history-refactor',
        descriptionEn: 'Refactored useShortcutHistory hook to use comboText instead of combo for consistency',
        descriptionJa: 'useShortcutHistoryフックをリファクタリング：comboをcomboTextに統一'
      }
    ]
  },
  {
    version: '2.5.0',
    date: '2026-02-17',
    titleKey: 'v2.5.0',
    titleEn: 'UI/UX Refinement & Layout Optimization',
    titleJa: 'UI/UX改善とレイアウト最適化',
    changes: [
      {
        category: 'improvement',
        descriptionKey: 'v2.5.0-header-buttons',
        descriptionEn: 'Unified header button color scheme to dark gray theme (#2d3748) with refined hover effects',
        descriptionJa: 'ヘッダーボタンのカラーをダークグレーテーマ（#2d3748）に統一し、ホバーエフェクトを洗練化'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.5.0-language-selector',
        descriptionEn: 'Redesigned language selector (JA/EN) with improved spacing, shadows, and hover animations',
        descriptionJa: '言語セレクター（JA/EN）を再設計：間隔、影、ホバーアニメーションを改善'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.5.0-layout-width',
        descriptionEn: 'Expanded selector and indicator areas to 1400px width to match keyboard layout for visual consistency',
        descriptionJa: 'セレクターとインジケーターエリアを1400pxに拡大：キーボードレイアウトと幅を統一'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.5.0-button-sizing',
        descriptionEn: 'Optimized button sizes and spacing (gap: 10px, padding: 8px 16px) for better UX',
        descriptionJa: 'ボタンサイズと間隔を最適化（gap: 10px、padding: 8px 16px）してUX向上'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.5.0-csv-button',
        descriptionEn: 'Refined CSV download button from square (44x44px) to rectangular with improved typography',
        descriptionJa: 'CSVダウンロードボタンを正方形（44x44px）から長方形に変更し、タイポグラフィを改善'
      },
      {
        category: 'fix',
        descriptionKey: 'v2.5.0-string-literal',
        descriptionEn: 'Fixed unterminated string literal bug in Key.tsx for proper newline escaping',
        descriptionJa: 'Key.tsxの改行エスケープ不足によるビルドエラーを修正'
      }
    ]
  },
  {
    version: '2.4.0',
    date: '2026-02-16',
    titleKey: 'v2.4.0',
    titleEn: 'Dynamic Landing Page & Enhanced Visuals',
    titleJa: 'LPの動的更新とビジュアル強化',
    changes: [
      {
        category: 'feature',
        descriptionKey: 'v2.4.0-dynamic-lp',
        descriptionEn: 'Automated Landing Page release notes to stay in sync with database/release constants',
        descriptionJa: 'LPのリリースノートを自動化：リリース定義ファイルとの完全同期を実現'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.4.0-lp-layout',
        descriptionEn: 'Reordered Landing Page sections to prioritize latest updates for returning users',
        descriptionJa: 'LPレイアウトを最適化：最新情報をヒーローセクション直後に移動し視認性を向上'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.4.0-constellation',
        descriptionEn: 'Enhanced "Constellation" background with thicker geometric lines and mouse interactivity',
        descriptionJa: '幾何学的な「星座」背景の強化：太い接続線とマウスインタラクションの追加'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.4.0-version-badge',
        descriptionEn: 'Implemented dynamic version badge in Hero section to automatically show latest release',
        descriptionJa: 'ヒーローセクションのバージョンバッジを動的化：常に最新の版数を表示'
      }
    ]
  },
  {
    version: '2.3.0',
    date: '2026-02-13',
    titleKey: 'v2.3.0',
    titleEn: 'Enhanced Authentication & Quiz Improvements',
    titleJa: '認証システム強化とクイズ改善',
    changes: [
      {
        category: 'feature',
        descriptionKey: 'v2.3.0-password-strength',
        descriptionEn: 'Added OWASP-compliant password strength validation with real-time 5-level scoring and feedback',
        descriptionJa: 'OWASP準拠のパスワード強度検証を追加：リアルタイム5段階評価とフィードバック機能'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.3.0-auth-ux',
        descriptionEn: 'Enhanced authentication UX with password visibility toggle, loading spinners, and improved error messages',
        descriptionJa: '認証UX改善：パスワード表示切替、ローディングスピナー、エラーメッセージ改善'
      },
      {
        category: 'feature',
        descriptionKey: 'v2.3.0-account-settings',
        descriptionEn: 'Added in-app password change form in Account Settings (previously link-only)',
        descriptionJa: 'アカウント設定にパスワード変更フォームを追加（以前はリンクのみ）'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.3.0-accessibility',
        descriptionEn: 'Improved accessibility with ARIA attributes, keyboard navigation, and screen reader support',
        descriptionJa: 'ARIA属性、キーボードナビゲーション、スクリーンリーダー対応でアクセシビリティ向上'
      },
      {
        category: 'feature',
        descriptionKey: 'v2.3.0-alternative-shortcuts',
        descriptionEn: 'Added Backspace and Alt+← as alternative shortcuts for "Go back" action in quiz mode',
        descriptionJa: 'クイズモードで「戻る」アクションにBackspaceとAlt+←を代替ショートカットとして追加'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.3.0-vscode-filter',
        descriptionEn: 'VS Code now hides Cmd+ shortcuts on Windows/Linux, showing only relevant shortcuts for the platform',
        descriptionJa: 'VS CodeでWindows/Linux環境時にCmd+ショートカットを非表示化（プラットフォーム関連のみ表示）'
      },
      {
        category: 'fix',
        descriptionKey: 'v2.3.0-modal-position',
        descriptionEn: 'Fixed authentication modal positioning using React Portal - now centers on viewport instead of header',
        descriptionJa: 'React Portalを使用して認証モーダルの配置を修正：ヘッダーではなくビューポート中央に表示'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.3.0-readme',
        descriptionEn: 'Updated README.md with comprehensive 200+ line directory structure documentation',
        descriptionJa: 'README.mdに200行以上の包括的なディレクトリ構造ドキュメントを追加'
      }
    ]
  },
  {
    version: '2.2.0',
    date: '2026-02-12',
    titleKey: 'v2.2.0',
    titleEn: 'Internationalization & SEO Optimization',
    titleJa: '多言語対応とSEO最適化',
    changes: [
      {
        category: 'feature',
        descriptionKey: 'v2.2.0-i18n',
        descriptionEn: 'Full internationalization support with English/Japanese UI across all components',
        descriptionJa: '全コンポーネントで英語・日本語の完全な多言語対応を実現'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.2.0-seo',
        descriptionEn: 'Enhanced SEO with canonical URLs, structured data (JSON-LD), and optimized meta tags',
        descriptionJa: '検索エンジン最適化（SEO）を強化：Canonical URL、構造化データ、メタタグ最適化'
      },
      {
        category: 'feature',
        descriptionKey: 'v2.2.0-windows-us',
        descriptionEn: 'Implemented Windows US keyboard layout with correct key mappings (Win key instead of Cmd)',
        descriptionJa: 'Windows US配列キーボードレイアウトを新規実装（CommandキーをWindowsキーに修正）'
      },
      {
        category: 'fix',
        descriptionKey: 'v2.2.0-mac-us',
        descriptionEn: 'Fixed Mac US keyboard layout alignment and key width issues for consistent rendering',
        descriptionJa: 'Mac US配列キーボードの配置崩れとキー幅の問題を修正'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.2.0-refactor',
        descriptionEn: 'Code optimization: Removed 111 lines of redundant code and simplified component logic',
        descriptionJa: 'コード最適化：冗長なコード111行を削減し、コンポーネントロジックを簡略化'
      }
    ]
  },
  {
    version: '2.1.0',
    date: '2026-02-11',
    titleKey: 'v2.1.0',
    titleEn: 'Tailwind CSS v4 Migration & Landing Page Improvements',
    titleJa: 'Tailwind CSS v4移行とランディングページ改善',
    changes: [
      {
        category: 'feature',
        descriptionKey: 'v2.1.0-tailwind',
        descriptionEn: 'Migrated to Tailwind CSS v4 with modern @theme directive and CSS variables',
        descriptionJa: 'Tailwind CSS v4に移行：@theme ディレクティブとCSS変数を導入'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.1.0-icons',
        descriptionEn: 'Improved application logo visibility on Landing Page with full-color icons',
        descriptionJa: 'ランディングページのアプリケーションロゴをフルカラーアイコンに改善'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.1.0-scroll',
        descriptionEn: 'Enhanced PageDown/PageUp navigation with smooth scrolling on Landing Page',
        descriptionJa: 'PageDown/PageUpナビゲーションにスムーズスクロールを追加'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.1.0-css',
        descriptionEn: 'Refactored CSS modules to Tailwind utility classes for authentication components',
        descriptionJa: '認証コンポーネントのCSSモジュールをTailwindユーティリティクラスにリファクタリング'
      },
      {
        category: 'fix',
        descriptionKey: 'v2.1.0-auth-fix',
        descriptionEn: 'Fixed duplicate export issue in AuthModal component',
        descriptionJa: 'AuthModalコンポーネントの重複エクスポート問題を修正'
      }
    ]
  },
  {
    version: '2.0.0',
    date: '2026-02-10',
    titleKey: 'v2.0.0',
    titleEn: 'User Authentication & Database-Driven Configuration',
    titleJa: 'ユーザー認証とデータベース駆動設定',
    changes: [
      {
        category: 'feature',
        descriptionKey: 'v2.0.0-auth',
        descriptionEn: 'Added user authentication with Google, GitHub, and Email/Password sign-in',
        descriptionJa: 'Google、GitHub、メール/パスワード認証によるユーザー認証を追加'
      },
      {
        category: 'feature',
        descriptionKey: 'v2.0.0-progress',
        descriptionEn: 'Implemented quiz progress tracking and session history for logged-in users',
        descriptionJa: 'ログインユーザー向けクイズ進捗追跡とセッション履歴機能を実装'
      },
      {
        category: 'feature',
        descriptionKey: 'v2.0.0-profile',
        descriptionEn: 'Created user profile management with AuthContext, AuthModal, and UserMenu components',
        descriptionJa: 'AuthContext、AuthModal、UserMenuコンポーネントによるプロフィール管理機能を作成'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.0.0-db-config',
        descriptionEn: 'Migrated app configuration from hardcoded files to database-driven applications table',
        descriptionJa: 'アプリ設定をハードコードファイルからデータベース駆動のapplicationsテーブルに移行'
      },
      {
        category: 'breaking',
        descriptionKey: 'v2.0.0-breaking',
        descriptionEn: 'Removed hardcoded apps.ts and shortcutDifficulty.ts files in favor of database queries',
        descriptionJa: 'ハードコードされたapps.tsとshortcutDifficulty.tsファイルを削除し、データベースクエリに移行'
      }
    ]
  },
  {
    version: '1.5.0',
    date: '2026-01-25',
    titleKey: 'v1.5.0',
    titleEn: 'Microsoft Office Support & Data Quality Improvements',
    titleJa: 'Microsoft Office対応とデータ品質改善',
    changes: [
      {
        category: 'feature',
        descriptionKey: 'v1.5.0-word',
        descriptionEn: 'Added Microsoft Word shortcuts with full protection level support',
        descriptionJa: 'Microsoft Wordのショートカットを追加（保護レベル完全対応）'
      },
      {
        category: 'feature',
        descriptionKey: 'v1.5.0-ppt',
        descriptionEn: 'Added Microsoft PowerPoint shortcuts with full protection level support',
        descriptionJa: 'Microsoft PowerPointのショートカットを追加（保護レベル完全対応）'
      },
      {
        category: 'improvement',
        descriptionKey: 'v1.5.0-pagekeys',
        descriptionEn: 'Normalized PageUp/PageDown key names across the entire database',
        descriptionJa: 'データベース全体でPageUp/PageDownキー名を正規化'
      },
      {
        category: 'improvement',
        descriptionKey: 'v1.5.0-rich',
        descriptionEn: 'Introduced RichShortcut type for detailed shortcut metadata',
        descriptionJa: 'ショートカット詳細メタデータ用のRichShortcut型を導入'
      },
      {
        category: 'improvement',
        descriptionKey: 'v1.5.0-scripts',
        descriptionEn: 'Separated read-only scripts (Supabase client) from write scripts (PostgreSQL client with -pg suffix)',
        descriptionJa: '読み取り専用スクリプト（Supabase）と書き込みスクリプト（PostgreSQL）を分離'
      }
    ]
  },
  {
    version: '1.0.0',
    date: '2025-12-01',
    titleKey: 'v1.0.0',
    titleEn: 'Full TypeScript Migration & Protection Levels',
    titleJa: '完全TypeScript移行と保護レベル機能',
    changes: [
      {
        category: 'feature',
        descriptionKey: 'v1.0.0-ts',
        descriptionEn: 'Converted entire codebase from JavaScript to TypeScript',
        descriptionJa: 'コードベース全体をJavaScriptからTypeScriptに変換'
      },
      {
        category: 'feature',
        descriptionKey: 'v1.0.0-protection',
        descriptionEn: 'Implemented database-driven protection levels with OS-specific support',
        descriptionJa: 'データベース駆動の保護レベル機能を実装（OS別対応）'
      },
      {
        category: 'improvement',
        descriptionKey: 'v1.0.0-visual',
        descriptionEn: 'Added visual indicators (blue borders for preventable_fullscreen, red for always-protected)',
        descriptionJa: '視覚的インジケーターを追加（青枠：全画面で防止可、赤枠：常時保護）'
      },
      {
        category: 'improvement',
        descriptionKey: 'v1.0.0-css',
        descriptionEn: 'Refactored CSS to remove duplicate styles and consolidate to components.css',
        descriptionJa: 'CSS重複スタイルを削除しcomponents.cssに集約'
      }
    ]
  }
];

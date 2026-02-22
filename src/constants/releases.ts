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
    version: '3.25.0',
    date: '2026-02-22',
    titleKey: 'v3.25.0',
    titleEn: 'Release Notes Sorting Improvement & LP Display Flexibility',
    titleJa: 'リリースノートのソート改善とLP表示の柔軟化',
    changes: [
      {
        category: 'improvement',
        descriptionKey: 'v3.25.0-semantic-sort',
        descriptionEn: 'Improved release notes version sorting to support semantic versioning, ensuring the latest release is always correctly displayed.',
        descriptionJa: 'リリースノートのバージョン順ソートを意味的バージョン付けに対応させ、最新リリースが常に正しく表示されるように改善'
      },
      {
        category: 'feature',
        descriptionKey: 'v3.25.0-lp-version-override',
        descriptionEn: 'Added functionality to explicitly display a specific release version (v3.7.0) on the Landing Page.',
        descriptionJa: 'ランディングページで特定のリリースバージョン（v3.7.0）を明示的に表示する機能を追加'
      }
    ]
  },
  {
    version: '3.24.0',
    date: '2026-02-22',
    titleKey: 'v3.24.0',
    titleEn: 'Performance Optimization & Architecture Improvements',
    titleJa: 'パフォーマンス最適化とアーキテクチャ改善',
    changes: [
      {
        category: 'improvement',
        descriptionKey: 'v3.24.0-context-optimization',
        descriptionEn: 'Optimized all Context providers with useMemo and useCallback to prevent unnecessary re-renders',
        descriptionJa: '全ContextプロバイダーをuseMemoとuseCallbackで最適化し、不要な再レンダリングを防止'
      },
      {
        category: 'improvement',
        descriptionKey: 'v3.24.0-stable-references',
        descriptionEn: 'Ensured stable function references across LanguageContext, AuthContext, SettingsContext, UIContext, ShortcutContext, and QuizContext',
        descriptionJa: 'LanguageContext、AuthContext、SettingsContext、UIContext、ShortcutContext、QuizContextで安定した関数参照を保証'
      },
      {
        category: 'improvement',
        descriptionKey: 'v3.24.0-test-separation',
        descriptionEn: 'Separated unit tests and E2E tests: Vitest for unit tests, Playwright for E2E tests',
        descriptionJa: 'ユニットテストとE2Eテストを分離：Vitestでユニットテスト、PlaywrightでE2Eテスト'
      },
      {
        category: 'improvement',
        descriptionKey: 'v3.24.0-documentation',
        descriptionEn: 'Enhanced CLAUDE.md with 470+ lines of documentation covering CMS tables, routing, i18n architecture, and custom hooks',
        descriptionJa: 'CLAUDE.mdを470行以上のドキュメントで強化：CMSテーブル、ルーティング、i18nアーキテクチャ、カスタムフックをカバー'
      },
      {
        category: 'fix',
        descriptionKey: 'v3.24.0-migration-numbering',
        descriptionEn: 'Fixed critical migration numbering conflict by renaming CMS migrations from 046-050 to 059-063',
        descriptionJa: 'CMSマイグレーションを046-050から059-063に変更し、重大なマイグレーション番号の競合を修正'
      },
      {
        category: 'improvement',
        descriptionKey: 'v3.24.0-performance-impact',
        descriptionEn: 'Performance improvements: Eliminated infinite loop risks and reduced unnecessary component updates',
        descriptionJa: 'パフォーマンス向上：無限ループのリスクを排除し、不要なコンポーネント更新を削減'
      }
    ]
  },
  {
    version: '3.7.0',
    date: '2026-02-21',
    titleKey: 'v3.7.0',
    titleEn: 'Learning Enhancement Features',
    titleJa: '学習強化機能の追加',
    changes: [
      {
        category: 'feature',
        descriptionKey: 'v3.7.0-weakness-drill',
        descriptionEn: 'Added Weakness Drill mode for focused practice on user\'s weak shortcuts',
        descriptionJa: '苦手克服ドリル機能を追加：間違えたショートカットに特化した集中練習モード'
      },
      {
        category: 'feature',
        descriptionKey: 'v3.7.0-detailed-feedback',
        descriptionEn: 'Implemented detailed feedback visualization with color-coded key comparison (correct/extra/missing)',
        descriptionJa: '入力ミスの可視化機能を追加：キーごとに正誤を色分けして表示（一致/余計/不足）'
      },
      {
        category: 'feature',
        descriptionKey: 'v3.7.0-bookmarks',
        descriptionEn: 'Added bookmark feature to save favorite shortcuts and practice them separately',
        descriptionJa: 'ブックマーク機能を追加：お気に入りショートカットを保存して個別に練習可能'
      },
      {
        category: 'improvement',
        descriptionKey: 'v3.7.0-custom-ids',
        descriptionEn: 'Enhanced quiz engine to support custom shortcut ID lists for targeted practice',
        descriptionJa: 'クイズエンジンを拡張：カスタムショートカットIDリストによる的を絞った練習に対応'
      },
      {
        category: 'fix',
        descriptionKey: 'v3.7.0-typescript-fixes',
        descriptionEn: 'Fixed TypeScript type errors in BookmarkedShortcuts, WeakShortcuts, and ShortcutCard components',
        descriptionJa: 'BookmarkedShortcuts、WeakShortcuts、ShortcutCardコンポーネントのTypeScript型エラーを修正'
      }
    ]
  },
  {
    version: '3.6.0',
    date: '2026-02-20',
    titleKey: 'v3.6.0',
    titleEn: 'Codebase Refactoring & Performance Optimization',
    titleJa: 'コードベースのリファクタリングとパフォーマンス最適化',
    changes: [
      {
        category: 'improvement',
        descriptionKey: 'v3.6.0-refactor',
        descriptionEn: 'Major refactoring: Removed 200+ lines of redundant code and unified event listener logic',
        descriptionJa: '大規模リファクタリング：200行以上の冗長なコードを削減し、イベントリスナーロジックを統一'
      },
      {
        category: 'improvement',
        descriptionKey: 'v3.6.0-i18n-logic',
        descriptionEn: 'Unified localization logic across components using a centralized utility function',
        descriptionJa: 'コンポーネント間のローカライゼーションロジックを統一ユーティリティ関数に集約'
      },
      {
        category: 'improvement',
        descriptionKey: 'v3.6.0-os-detect',
        descriptionEn: 'Optimized OS detection and keyboard sorting algorithms for better runtime performance',
        descriptionJa: 'OS判定とキーボードソートアルゴリズムを最適化し、実行時のパフォーマンスを向上'
      },
      {
        category: 'improvement',
        descriptionKey: 'v3.6.0-type-safety',
        descriptionEn: 'Strengthened type safety by unifying ShortcutDifficulty and ProtectionLevel types',
        descriptionJa: 'ShortcutDifficultyとProtectionLevel型の統一により型安全性を強化'
      }
    ]
  },
  {
    version: '3.5.0',
    date: '2026-02-19',
    titleKey: 'v3.5.0',
    titleEn: 'Dashboard Enhancements & Browser Conflict Detection',
    titleJa: 'ダッシュボード強化とブラウザ競合検出機能',
    changes: [
      {
        category: 'feature',
        descriptionKey: 'v3.5.0-dashboard',
        descriptionEn: 'Completely redesigned MyPage with visual statistics, performance charts, and weak shortcut analysis',
        descriptionJa: 'マイページを刷新：統計の視覚化、パフォーマンスチャート、苦手なショートカット分析を追加'
      },
      {
        category: 'feature',
        descriptionKey: 'v3.5.0-conflict-detect',
        descriptionEn: 'Added automatic browser shortcut conflict detection with visual warning indicators',
        descriptionJa: 'ブラウザのショートカット競合を自動検出する機能と視覚的な警告表示を追加'
      },
      {
        category: 'fix',
        descriptionKey: 'v3.5.0-macos-fix',
        descriptionEn: 'Resolved macOS modifier key mapping issues for consistent cross-platform experience',
        descriptionJa: 'macOSの修飾キーマッピングの問題を修正し、プラットフォーム間の一貫性を向上'
      },
      {
        category: 'improvement',
        descriptionKey: 'v3.5.0-performance-viz',
        descriptionEn: 'Implemented data-driven progress bars and charts for intuitive learning progress tracking',
        descriptionJa: 'データ駆動のプログレスバーとチャートを実装し、直感的な学習進捗の把握が可能に'
      }
    ]
  },
  {
    version: '3.4.0',
    date: '2026-02-19',
    titleKey: 'v3.4.0',
    titleEn: 'OG Image & Documentation Updates',
    titleJa: 'OGイメージとドキュメント更新',
    changes: [
      {
        category: 'feature',
        descriptionKey: 'v3.4.0-og-image',
        descriptionEn: 'Added custom OG image (1200x630px) for enhanced social media sharing with preview tool',
        descriptionJa: 'ソーシャルメディア共有用のカスタムOGイメージ（1200x630px）とプレビューツールを追加'
      },
      {
        category: 'improvement',
        descriptionKey: 'v3.4.0-icon-hover',
        descriptionEn: 'Updated app icon hover effect from opacity to color inversion for better visual feedback',
        descriptionJa: 'アプリアイコンのホバーエフェクトを不透明度から色反転に変更し、視覚フィードバックを改善'
      },
      {
        category: 'improvement',
        descriptionKey: 'v3.4.0-icon-color',
        descriptionEn: 'Unified all application icons to white color scheme for consistent visual appearance',
        descriptionJa: '全アプリケーションアイコンを白色に統一し、一貫性のある外観を実現'
      },
      {
        category: 'improvement',
        descriptionKey: 'v3.4.0-readme',
        descriptionEn: 'Enhanced README.md with version badge, structured feature list, and latest capabilities',
        descriptionJa: 'README.mdにバージョンバッジ、構造化された機能リスト、最新機能を追加'
      }
    ]
  },
  {
    version: '3.3.0',
    date: '2026-02-18',
    titleKey: 'v3.3.0',
    titleEn: 'Social Proof & High-Resolution Optimization',
    titleJa: 'ソーシャルプルーフと高解像度最適化',
    changes: [
      {
        category: 'feature',
        descriptionKey: 'v3.3.0-testimonials',
        descriptionEn: 'Added "User Testimonials" section to Landing Page to showcase real-world benefits',
        descriptionJa: 'LPに「お客様の声」セクションを追加：実際の利用メリットを視覚化'
      },
      {
        category: 'improvement',
        descriptionKey: 'v3.3.0-responsive-scaling',
        descriptionEn: 'Implemented advanced responsive layout scaling for high-resolution displays (up to 1500px height)',
        descriptionJa: '高解像度ディスプレイ（高さ1500pxまで）向けの高度なレスポンシブスケーリングを実装'
      },
      {
        category: 'improvement',
        descriptionKey: 'v3.3.0-color-theme',
        descriptionEn: 'Unified color palette to a sleek gray/black theme for a more professional and modern look',
        descriptionJa: 'カラーパレットをグレー/ブラックに統一：よりプロフェッショナルでモダンな外観に'
      },
      {
        category: 'improvement',
        descriptionKey: 'v3.3.0-particles',
        descriptionEn: 'Optimized particle background animation density and speed scaling for better performance',
        descriptionJa: 'パーティクル背景の密度と速度スケーリングを最適化し、パフォーマンスを向上'
      },
      {
        category: 'fix',
        descriptionKey: 'v3.3.0-ctrl-cv-fix',
        descriptionEn: 'Resolved display issue for Ctrl+C and Ctrl+V shortcuts on Windows 11 platform',
        descriptionJa: 'Windows 11プラットフォームにおけるCtrl+CおよびCtrl+Vの表示問題を修正'
      }
    ]
  },
  {
    version: '3.2.0',
    date: '2026-02-17',
    titleKey: 'v3.2.0',
    titleEn: 'SEO Enhancement & International Optimization',
    titleJa: 'SEO強化と国際化最適化',
    changes: [
      {
        category: 'feature',
        descriptionKey: 'v3.2.0-seo-component',
        descriptionEn: 'Added dynamic SEO component for automatic meta tag management across all pages',
        descriptionJa: '全ページに動的SEOコンポーネントを追加：メタタグの自動管理を実現'
      },
      {
        category: 'improvement',
        descriptionKey: 'v3.2.0-english-meta',
        descriptionEn: 'Localized all meta tags to English for international reach with Open Graph locale support',
        descriptionJa: 'メタタグを英語化して国際的なリーチを向上：Open Graph locale対応'
      },
      {
        category: 'improvement',
        descriptionKey: 'v3.2.0-sitemap',
        descriptionEn: 'Expanded sitemap.xml with app, mypage, and release-notes pages for better SEO indexing',
        descriptionJa: 'サイトマップを拡充：app、mypage、release-notesページを追加してSEOインデックス改善'
      },
      {
        category: 'improvement',
        descriptionKey: 'v3.2.0-manifest',
        descriptionEn: 'Updated PWA manifest to English (short_name: "KB Visualizer") for global audience',
        descriptionJa: 'PWAマニフェストを英語化（short_name: "KB Visualizer"）してグローバル対応'
      },
      {
        category: 'fix',
        descriptionKey: 'v3.2.0-history-refactor',
        descriptionEn: 'Refactored useShortcutHistory hook to use comboText instead of combo for consistency',
        descriptionJa: 'useShortcutHistoryフックをリファクタリング：comboをcomboTextに統一'
      }
    ]
  },
  {
    version: '3.1.0',
    date: '2026-02-17',
    titleKey: 'v3.1.0',
    titleEn: 'UI/UX Refinement & Layout Optimization',
    titleJa: 'UI/UX改善とレイアウト最適化',
    changes: [
      {
        category: 'improvement',
        descriptionKey: 'v3.1.0-header-buttons',
        descriptionEn: 'Unified header button color scheme to dark gray theme (#2d3748) with refined hover effects',
        descriptionJa: 'ヘッダーボタンのカラーをダークグレーテーマ（#2d3748）に統一し、ホバーエフェクトを洗練化'
      },
      {
        category: 'improvement',
        descriptionKey: 'v3.1.0-language-selector',
        descriptionEn: 'Redesigned language selector (JA/EN) with improved spacing, shadows, and hover animations',
        descriptionJa: '言語セレクター（JA/EN）を再設計：間隔、影、ホバーアニメーションを改善'
      },
      {
        category: 'improvement',
        descriptionKey: 'v3.1.0-layout-width',
        descriptionEn: 'Expanded selector and indicator areas to 1400px width to match keyboard layout for visual consistency',
        descriptionJa: 'セレクターとインジケーターエリアを1400pxに拡大：キーボードレイアウトと幅を統一'
      },
      {
        category: 'improvement',
        descriptionKey: 'v3.1.0-button-sizing',
        descriptionEn: 'Optimized button sizes and spacing (gap: 10px, padding: 8px 16px) for better UX',
        descriptionJa: 'ボタンサイズと間隔を最適化（gap: 10px、padding: 8px 16px）してUX向上'
      },
      {
        category: 'improvement',
        descriptionKey: 'v3.1.0-csv-button',
        descriptionEn: 'Refined CSV download button from square (44x44px) to rectangular with improved typography',
        descriptionJa: 'CSVダウンロードボタンを正方形（44x44px）から長方形に変更し、タイポグラフィを改善'
      },
      {
        category: 'fix',
        descriptionKey: 'v3.1.0-string-literal',
        descriptionEn: 'Fixed unterminated string literal bug in Key.tsx for proper newline escaping',
        descriptionJa: 'Key.tsxの改行エスケープ不足によるビルドエラーを修正'
      }
    ]
  },
  {
    version: '3.0.0',
    date: '2026-02-16',
    titleKey: 'v3.0.0',
    titleEn: 'Landing Page Implementation',
    titleJa: 'ランディングページ実装',
    changes: [
      {
        category: 'feature',
        descriptionKey: 'v3.0.0-landing-page',
        descriptionEn: 'Implemented comprehensive landing page with dynamic release notes',
        descriptionJa: '動的リリースノート機能を備えた包括的なランディングページを実装'
      },
      {
        category: 'improvement',
        descriptionKey: 'v3.0.0-lp-layout',
        descriptionEn: 'Reordered Landing Page sections to prioritize latest updates for returning users',
        descriptionJa: 'LPレイアウトを最適化：最新情報をヒーローセクション直後に移動し視認性を向上'
      },
      {
        category: 'improvement',
        descriptionKey: 'v3.0.0-constellation',
        descriptionEn: 'Enhanced "Constellation" background with thicker geometric lines and mouse interactivity',
        descriptionJa: '幾何学的な「星座」背景の強化：太い接続線とマウスインタラクションの追加'
      },
      {
        category: 'improvement',
        descriptionKey: 'v3.0.0-version-badge',
        descriptionEn: 'Implemented dynamic version badge in Hero section to automatically show latest release',
        descriptionJa: 'ヒーローセクションのバージョンバッジを動的化：常に最新の版数を表示'
      }
    ]
  },
  {
    version: '2.15.0',
    date: '2026-02-13',
    titleKey: 'v2.15.0',
    titleEn: 'Enhanced Authentication & Quiz Improvements',
    titleJa: '認証システム強化とクイズ改善',
    changes: [
      {
        category: 'feature',
        descriptionKey: 'v2.15.0-password-strength',
        descriptionEn: 'Added OWASP-compliant password strength validation with real-time 5-level scoring and feedback',
        descriptionJa: 'OWASP準拠のパスワード強度検証を追加：リアルタイム5段階評価とフィードバック機能'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.15.0-auth-ux',
        descriptionEn: 'Enhanced authentication UX with password visibility toggle, loading spinners, and improved error messages',
        descriptionJa: '認証UX改善：パスワード表示切替、ローディングスピナー、エラーメッセージ改善'
      },
      {
        category: 'feature',
        descriptionKey: 'v2.15.0-account-settings',
        descriptionEn: 'Added in-app password change form in Account Settings (previously link-only)',
        descriptionJa: 'アカウント設定にパスワード変更フォームを追加（以前はリンクのみ）'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.15.0-accessibility',
        descriptionEn: 'Improved accessibility with ARIA attributes, keyboard navigation, and screen reader support',
        descriptionJa: 'ARIA属性、キーボードナビゲーション、スクリーンリーダー対応でアクセシビリティ向上'
      },
      {
        category: 'feature',
        descriptionKey: 'v2.15.0-alternative-shortcuts',
        descriptionEn: 'Added Backspace and Alt+← as alternative shortcuts for "Go back" action in quiz mode',
        descriptionJa: 'クイズモードで「戻る」アクションにBackspaceとAlt+←を代替ショートカットとして追加'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.15.0-vscode-filter',
        descriptionEn: 'VS Code now hides Cmd+ shortcuts on Windows/Linux, showing only relevant shortcuts for the platform',
        descriptionJa: 'VS CodeでWindows/Linux環境時にCmd+ショートカットを非表示化（プラットフォーム関連のみ表示）'
      },
      {
        category: 'fix',
        descriptionKey: 'v2.15.0-modal-position',
        descriptionEn: 'Fixed authentication modal positioning using React Portal - now centers on viewport instead of header',
        descriptionJa: 'React Portalを使用して認証モーダルの配置を修正：ヘッダーではなくビューポート中央に表示'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.15.0-readme',
        descriptionEn: 'Updated README.md with comprehensive 200+ line directory structure documentation',
        descriptionJa: 'README.mdに200行以上の包括的なディレクトリ構造ドキュメントを追加'
      }
    ]
  },
  {
    version: '2.14.0',
    date: '2026-02-12',
    titleKey: 'v2.14.0',
    titleEn: 'Internationalization & SEO Optimization',
    titleJa: '多言語対応とSEO最適化',
    changes: [
      {
        category: 'feature',
        descriptionKey: 'v2.14.0-i18n',
        descriptionEn: 'Full internationalization support with English/Japanese UI across all components',
        descriptionJa: '全コンポーネントで英語・日本語の完全な多言語対応を実現'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.14.0-seo',
        descriptionEn: 'Enhanced SEO with canonical URLs, structured data (JSON-LD), and optimized meta tags',
        descriptionJa: '検索エンジン最適化（SEO）を強化：Canonical URL、構造化データ、メタタグ最適化'
      },
      {
        category: 'feature',
        descriptionKey: 'v2.14.0-windows-us',
        descriptionEn: 'Implemented Windows US keyboard layout with correct key mappings (Win key instead of Cmd)',
        descriptionJa: 'Windows US配列キーボードレイアウトを新規実装（CommandキーをWindowsキーに修正）'
      },
      {
        category: 'fix',
        descriptionKey: 'v2.14.0-mac-us',
        descriptionEn: 'Fixed Mac US keyboard layout alignment and key width issues for consistent rendering',
        descriptionJa: 'Mac US配列キーボードの配置崩れとキー幅の問題を修正'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.14.0-refactor',
        descriptionEn: 'Code optimization: Removed 111 lines of redundant code and simplified component logic',
        descriptionJa: 'コード最適化：冗長なコード111行を削減し、コンポーネントロジックを簡略化'
      }
    ]
  },
  {
    version: '2.13.0',
    date: '2026-02-11',
    titleKey: 'v2.13.0',
    titleEn: 'Tailwind CSS v4 Migration & Landing Page Improvements',
    titleJa: 'Tailwind CSS v4移行とランディングページ改善',
    changes: [
      {
        category: 'feature',
        descriptionKey: 'v2.13.0-tailwind',
        descriptionEn: 'Migrated to Tailwind CSS v4 with modern @theme directive and CSS variables',
        descriptionJa: 'Tailwind CSS v4に移行：@theme ディレクティブとCSS変数を導入'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.13.0-icons',
        descriptionEn: 'Improved application logo visibility on Landing Page with full-color icons',
        descriptionJa: 'ランディングページのアプリケーションロゴをフルカラーアイコンに改善'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.13.0-scroll',
        descriptionEn: 'Enhanced PageDown/PageUp navigation with smooth scrolling on Landing Page',
        descriptionJa: 'PageDown/PageUpナビゲーションにスムーズスクロールを追加'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.13.0-css',
        descriptionEn: 'Refactored CSS modules to Tailwind utility classes for authentication components',
        descriptionJa: '認証コンポーネントのCSSモジュールをTailwindユーティリティクラスにリファクタリング'
      },
      {
        category: 'fix',
        descriptionKey: 'v2.13.0-auth-fix',
        descriptionEn: 'Fixed duplicate export issue in AuthModal component',
        descriptionJa: 'AuthModalコンポーネントの重複エクスポート問題を修正'
      }
    ]
  },
  {
    version: '2.12.0',
    date: '2026-02-10',
    titleKey: 'v2.12.0',
    titleEn: 'User Authentication & Database-Driven Configuration',
    titleJa: 'ユーザー認証とデータベース駆動設定',
    changes: [
      {
        category: 'feature',
        descriptionKey: 'v2.12.0-auth',
        descriptionEn: 'Added user authentication with Google, GitHub, and Email/Password sign-in',
        descriptionJa: 'Google、GitHub、メール/パスワード認証によるユーザー認証を追加'
      },
      {
        category: 'feature',
        descriptionKey: 'v2.12.0-progress',
        descriptionEn: 'Implemented quiz progress tracking and session history for logged-in users',
        descriptionJa: 'ログインユーザー向けクイズ進捗追跡とセッション履歴機能を実装'
      },
      {
        category: 'feature',
        descriptionKey: 'v2.12.0-profile',
        descriptionEn: 'Created user profile management with AuthContext, AuthModal, and UserMenu components',
        descriptionJa: 'AuthContext、AuthModal、UserMenuコンポーネントによるプロフィール管理機能を作成'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.12.0-db-config',
        descriptionEn: 'Migrated app configuration from hardcoded files to database-driven applications table',
        descriptionJa: 'アプリ設定をハードコードファイルからデータベース駆動のapplicationsテーブルに移行'
      },
      {
        category: 'breaking',
        descriptionKey: 'v2.12.0-breaking',
        descriptionEn: 'Removed hardcoded apps.ts and shortcutDifficulty.ts files in favor of database queries',
        descriptionJa: 'ハードコードされたapps.tsとshortcutDifficulty.tsファイルを削除し、データベースクエリに移行'
      }
    ]
  },
  {
    version: '2.11.0',
    date: '2026-02-03',
    titleKey: 'v2.11.0',
    titleEn: 'Quiz Mode Enhancement & Gmail Support',
    titleJa: 'クイズモード強化とGmail対応',
    changes: [
      {
        category: 'feature',
        descriptionKey: 'v2.11.0-gmail',
        descriptionEn: 'Added comprehensive Gmail keyboard shortcuts (66 new shortcuts)',
        descriptionJa: 'Gmailキーボードショートカットを包括的に追加（66個の新規ショートカット）'
      },
      {
        category: 'feature',
        descriptionKey: 'v2.11.0-difficulty-filter',
        descriptionEn: 'Added difficulty filter to visualizer mode for targeted learning',
        descriptionJa: 'ビジュアライザーモードに難易度フィルターを追加：的を絞った学習が可能に'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.11.0-madmax',
        descriptionEn: 'Promoted minor shortcuts to "madmax" difficulty for better distribution',
        descriptionJa: 'マイナーショートカットを"madmax"難易度に昇格：分布を改善'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.11.0-labels',
        descriptionEn: 'Changed all difficulty labels from Japanese to English for consistency',
        descriptionJa: '全難易度ラベルを日本語から英語に変更：一貫性の向上'
      }
    ]
  },
  {
    version: '2.10.0',
    date: '2026-01-25',
    titleKey: 'v2.10.0',
    titleEn: 'Microsoft Office Support & Data Quality Improvements',
    titleJa: 'Microsoft Office対応とデータ品質改善',
    changes: [
      {
        category: 'feature',
        descriptionKey: 'v2.10.0-word',
        descriptionEn: 'Added Microsoft Word shortcuts with full protection level support',
        descriptionJa: 'Microsoft Wordのショートカットを追加（保護レベル完全対応）'
      },
      {
        category: 'feature',
        descriptionKey: 'v2.10.0-ppt',
        descriptionEn: 'Added Microsoft PowerPoint shortcuts with full protection level support',
        descriptionJa: 'Microsoft PowerPointのショートカットを追加（保護レベル完全対応）'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.10.0-pagekeys',
        descriptionEn: 'Normalized PageUp/PageDown key names across the entire database',
        descriptionJa: 'データベース全体でPageUp/PageDownキー名を正規化'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.10.0-rich',
        descriptionEn: 'Introduced RichShortcut type for detailed shortcut metadata',
        descriptionJa: 'ショートカット詳細メタデータ用のRichShortcut型を導入'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.10.0-scripts',
        descriptionEn: 'Separated read-only scripts (Supabase client) from write scripts (PostgreSQL client with -pg suffix)',
        descriptionJa: '読み取り専用スクリプト（Supabase）と書き込みスクリプト（PostgreSQL）を分離'
      }
    ]
  },
  {
    version: '2.9.0',
    date: '2026-01-23',
    titleKey: 'v2.9.0',
    titleEn: 'Supabase Migration & Database-Driven Architecture',
    titleJa: 'Supabase移行とデータベース駆動アーキテクチャ',
    changes: [
      {
        category: 'feature',
        descriptionKey: 'v2.9.0-supabase',
        descriptionEn: 'Migrated from Railway to Supabase PostgreSQL for robust shortcut data storage',
        descriptionJa: 'RailwayからSupabase PostgreSQLに移行：堅牢なショートカットデータストレージ'
      },
      {
        category: 'feature',
        descriptionKey: 'v2.9.0-vscode',
        descriptionEn: 'Added VS Code shortcuts with platform-specific key support',
        descriptionJa: 'VS Codeショートカットを追加（プラットフォーム固有キー対応）'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.9.0-difficulty',
        descriptionEn: 'Rebalanced difficulty levels across all applications for better learning progression',
        descriptionJa: '全アプリケーションの難易度レベルを再調整：学習進行を改善'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.9.0-sequential',
        descriptionEn: 'Improved sequential shortcut detection for Windows 11 and macOS',
        descriptionJa: 'Windows 11とmacOSの順押しショートカット検出を改善'
      }
    ]
  },
  {
    version: '2.8.0',
    date: '2026-01-20',
    titleKey: 'v2.8.0',
    titleEn: 'Excel Advanced Shortcuts & Sequential Input',
    titleJa: 'Excel高度ショートカットと順押し入力',
    changes: [
      {
        category: 'feature',
        descriptionKey: 'v2.8.0-excel',
        descriptionEn: 'Added Excel ribbon shortcuts with sequential key support (e.g., Alt + H + O + I)',
        descriptionJa: 'Excelリボンショートカットを追加：順押しキー対応（例：Alt + H + O + I）'
      },
      {
        category: 'feature',
        descriptionKey: 'v2.8.0-sequential-ui',
        descriptionEn: 'Implemented visual distinction between simultaneous and sequential shortcuts',
        descriptionJa: '同時押しと順押しショートカットの視覚的区別を実装'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.8.0-kbd-layout',
        descriptionEn: 'Reorganized keyboard layouts to match physical keyboard arrangements',
        descriptionJa: 'キーボードレイアウトを物理キーボード配置に合わせて再編成'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.8.0-nav-keys',
        descriptionEn: 'Added navigation keys (Home, End, PageUp, PageDown) to all layouts',
        descriptionJa: 'ナビゲーションキー（Home、End、PageUp、PageDown）を全レイアウトに追加'
      }
    ]
  },
  {
    version: '2.0.0',
    date: '2026-01-08',
    titleKey: 'v2.0.0',
    titleEn: 'Quiz Mode Complete Implementation',
    titleJa: 'クイズモード完全実装',
    changes: [
      {
        category: 'feature',
        descriptionKey: 'v2.0.0-quiz',
        descriptionEn: 'Implemented comprehensive quiz mode with 4-tier difficulty system (Basic, Standard, Hard, Madmax)',
        descriptionJa: '4段階難易度システム（Basic、Standard、Hard、Madmax）を持つ包括的なクイズモードを実装'
      },
      {
        category: 'feature',
        descriptionKey: 'v2.0.0-alternatives',
        descriptionEn: 'Added alternative shortcut support (e.g., Ctrl+C = Ctrl+Insert)',
        descriptionJa: '代替ショートカット対応を追加（例：Ctrl+C = Ctrl+Insert）'
      },
      {
        category: 'improvement',
        descriptionKey: 'v2.0.0-sequential',
        descriptionEn: 'Enhanced sequential shortcut visualization with progress indicators',
        descriptionJa: '順押しショートカットの視覚化を強化：進捗インジケーターを追加'
      },
      {
        category: 'feature',
        descriptionKey: 'v2.0.0-pwa',
        descriptionEn: 'Implemented Progressive Web App (PWA) support with offline capabilities',
        descriptionJa: 'プログレッシブWebアプリ（PWA）対応を実装：オフライン機能を追加'
      }
    ]
  },
  {
    version: '1.6.0',
    date: '2025-12-26',
    titleKey: 'v1.6.0',
    titleEn: 'macOS Support & Multi-Platform Expansion',
    titleJa: 'macOS対応とマルチプラットフォーム拡張',
    changes: [
      {
        category: 'feature',
        descriptionKey: 'v1.6.0-macos',
        descriptionEn: 'Added macOS keyboard layouts (JIS/US) with Command key support',
        descriptionJa: 'macOSキーボードレイアウト（JIS/US）を追加：Commandキー対応'
      },
      {
        category: 'feature',
        descriptionKey: 'v1.6.0-macos-shortcuts',
        descriptionEn: 'Implemented macOS-specific shortcuts for Windows 11, Chrome, Excel, and Slack',
        descriptionJa: 'Windows 11、Chrome、Excel、SlackのmacOS固有ショートカットを実装'
      },
      {
        category: 'improvement',
        descriptionKey: 'v1.6.0-protection',
        descriptionEn: 'Enhanced system-protected shortcut classification with 3-tier color coding',
        descriptionJa: 'システム保護ショートカットの分類を強化：3段階の色分けを実装'
      },
      {
        category: 'fix',
        descriptionKey: 'v1.6.0-key-stuck',
        descriptionEn: 'Fixed persistent key state issue when releasing modifier keys',
        descriptionJa: '修飾キー解放時のキー状態残存問題を修正'
      }
    ]
  },
  {
    version: '1.5.0',
    date: '2025-12-26',
    titleKey: 'v1.5.0',
    titleEn: 'Setup Screen & Fullscreen Mode',
    titleJa: 'セットアップ画面と全画面モード',
    changes: [
      {
        category: 'feature',
        descriptionKey: 'v1.5.0-setup',
        descriptionEn: 'Added initial setup screen with app selection and keyboard layout configuration',
        descriptionJa: '初回セットアップ画面を追加：アプリ選択とキーボードレイアウト設定'
      },
      {
        category: 'feature',
        descriptionKey: 'v1.5.0-fullscreen',
        descriptionEn: 'Implemented fullscreen mode for enhanced keyboard shortcut capture',
        descriptionJa: 'キーボードショートカットキャプチャ強化のための全画面モードを実装'
      },
      {
        category: 'improvement',
        descriptionKey: 'v1.5.0-key-clear',
        descriptionEn: 'Improved key release detection with faster response time',
        descriptionJa: 'キー解放検出を改善：レスポンス時間を高速化'
      },
      {
        category: 'improvement',
        descriptionKey: 'v1.5.0-cursor',
        descriptionEn: 'Added arrow keys to keyboard layout for better navigation',
        descriptionJa: 'ナビゲーション改善のため矢印キーをキーボードレイアウトに追加'
      }
    ]
  },
  {
    version: '1.4.0',
    date: '2025-12-25',
    titleKey: 'v1.4.0',
    titleEn: 'UI Redesign & Multi-Application Support',
    titleJa: 'UI再設計と複数アプリケーション対応',
    changes: [
      {
        category: 'feature',
        descriptionKey: 'v1.4.0-multi-app',
        descriptionEn: 'Added support for Chrome, Excel, and Slack shortcuts',
        descriptionJa: 'Chrome、Excel、Slackのショートカットサポートを追加'
      },
      {
        category: 'improvement',
        descriptionKey: 'v1.4.0-ui',
        descriptionEn: 'Redesigned UI with modern Apple-inspired aesthetic and gradient styling',
        descriptionJa: 'モダンなApple風デザインとグラデーションスタイリングでUIを再設計'
      },
      {
        category: 'improvement',
        descriptionKey: 'v1.4.0-favicon',
        descriptionEn: 'Added custom favicon and improved HTML metadata',
        descriptionJa: 'カスタムファビコンを追加しHTMLメタデータを改善'
      },
      {
        category: 'feature',
        descriptionKey: 'v1.4.0-app-selector',
        descriptionEn: 'Implemented single-line app selector with horizontal scroll',
        descriptionJa: '横スクロール対応の1行アプリセレクターを実装'
      }
    ]
  },
  {
    version: '1.3.0',
    date: '2025-12-24',
    titleKey: 'v1.3.0',
    titleEn: 'Windows Key Support & Shortcut Expansion',
    titleJa: 'Windowsキー対応とショートカット拡張',
    changes: [
      {
        category: 'feature',
        descriptionKey: 'v1.3.0-win-key',
        descriptionEn: 'Added Windows key (Win+) shortcut support for Windows 11',
        descriptionJa: 'Windows 11のWindowsキー（Win+）ショートカット対応を追加'
      },
      {
        category: 'feature',
        descriptionKey: 'v1.3.0-protection-visual',
        descriptionEn: 'Implemented visual indication for system-protected shortcuts',
        descriptionJa: 'システム保護ショートカットの視覚的表示を実装'
      },
      {
        category: 'improvement',
        descriptionKey: 'v1.3.0-modifier-sort',
        descriptionEn: 'Added modifier key count-based sorting for better shortcut organization',
        descriptionJa: '修飾キー数に基づくソートを追加：ショートカット整理を改善'
      },
      {
        category: 'improvement',
        descriptionKey: 'v1.3.0-component',
        descriptionEn: 'Refactored React components for better code organization',
        descriptionJa: 'Reactコンポーネントをリファクタリング：コード整理を改善'
      }
    ]
  },
  {
    version: '1.1.0',
    date: '2025-12-01',
    titleKey: 'v1.1.0',
    titleEn: 'Full TypeScript Migration & Protection Levels',
    titleJa: '完全TypeScript移行と保護レベル機能',
    changes: [
      {
        category: 'feature',
        descriptionKey: 'v1.1.0-ts',
        descriptionEn: 'Converted entire codebase from JavaScript to TypeScript',
        descriptionJa: 'コードベース全体をJavaScriptからTypeScriptに変換'
      },
      {
        category: 'feature',
        descriptionKey: 'v1.1.0-protection',
        descriptionEn: 'Implemented database-driven protection levels with OS-specific support',
        descriptionJa: 'データベース駆動の保護レベル機能を実装（OS別対応）'
      },
      {
        category: 'improvement',
        descriptionKey: 'v1.1.0-visual',
        descriptionEn: 'Added visual indicators (blue borders for preventable_fullscreen, red for always-protected)',
        descriptionJa: '視覚的インジケーターを追加（青枠：全画面で防止可、赤枠：常時保護）'
      },
      {
        category: 'improvement',
        descriptionKey: 'v1.1.0-css',
        descriptionEn: 'Refactored CSS to remove duplicate styles and consolidate to components.css',
        descriptionJa: 'CSS重複スタイルを削除しcomponents.cssに集約'
      }
    ]
  },
  {
    version: '1.0.0',
    date: '2025-12-24',
    titleKey: 'v1.0.0',
    titleEn: 'Initial Release - Windows 11 Keyboard Visualizer',
    titleJa: '初回リリース - Windows 11キーボードビジュアライザー',
    changes: [
      {
        category: 'feature',
        descriptionKey: 'v1.0.0-core',
        descriptionEn: 'Core keyboard visualization functionality with real-time key press detection',
        descriptionJa: 'リアルタイムのキー押下検出を備えたコアキーボード可視化機能'
      },
      {
        category: 'feature',
        descriptionKey: 'v1.0.0-windows11',
        descriptionEn: 'Initial Windows 11 shortcut database with basic shortcuts',
        descriptionJa: '基本ショートカットを含む初期Windows 11ショートカットデータベース'
      },
      {
        category: 'feature',
        descriptionKey: 'v1.0.0-fullscreen',
        descriptionEn: 'Fullscreen mode with browser shortcut capture support',
        descriptionJa: 'ブラウザショートカットキャプチャ対応の全画面モード'
      },
      {
        category: 'feature',
        descriptionKey: 'v1.0.0-gmail-single',
        descriptionEn: 'Gmail single-key shortcut support (g, i, etc.)',
        descriptionJa: 'Gmail単一キーショートカット対応（g、iなど）'
      },
      {
        category: 'feature',
        descriptionKey: 'v1.0.0-ci-cd',
        descriptionEn: 'GitHub Actions workflow for automated deployment to GitHub Pages',
        descriptionJa: 'GitHub Pagesへの自動デプロイ用GitHub Actionsワークフロー'
      }
    ]
  }
];

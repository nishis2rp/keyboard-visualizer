/**
 * Japanese translations
 */
import { Translations } from './en';

export const ja: Translations = {
  // Landing Page
  landing: {
    badge: 'NEW VERSION 2.1',
    title: 'KEYBOARD VISUALIZER',
    subtitle: 'Work at the speed of thought.',
    description: '1,300以上のショートカットをリアルタイムで可視化する学習プラットフォーム。ツールを使いこなし、創造的な時間を最大化しましょう。',
    ctaButton: '無料で今すぐはじめる',

    stats: {
      shortcuts: 'ショートカット',
      apps: '対応アプリ',
      levels: '難易度レベル',
    },

    whyTitle: 'なぜKeyboard Visualizerなのか',

    features: {
      visualFeedback: {
        title: 'Visual Feedback',
        description: '入力したすべてのキーが美しく可視化されます。システムの挙動を直感的に理解しましょう。',
      },
      quizMode: {
        title: 'Active Learning',
        description: 'クイズ形式の反復練習により、記憶に定着。苦手な操作も自然と体が覚えます。',
      },
      multiPlatform: {
        title: 'Master Every App',
        description: 'VS CodeからExcel、Slackまで。日常的に使うあらゆるプロツールの達人へ。',
      },
    },

    appsTitle: '対応アプリケーション',
    appsDescription: '日常的に使うプロフェッショナルツールのショートカットを網羅',

    benefitsTitle: '得られるメリット',
    benefits: {
      productivity: {
        number: '01',
        title: '生産性の劇的な向上',
        description: 'マウス操作からキーボード操作へ移行することで、作業速度が平均30-50%向上します。',
      },
      flow: {
        number: '02',
        title: 'フロー状態の維持',
        description: 'マウスとキーボードの切り替えによる集中力の途切れを防ぎ、深い集中状態を保てます。',
      },
      skill: {
        number: '03',
        title: 'プロフェッショナルなスキル',
        description: 'ショートカットを使いこなす姿は、周囲から見ても圧倒的にプロフェッショナルです。',
      },
      ergonomics: {
        number: '04',
        title: '身体的な負担軽減',
        description: 'マウス操作の減少により、肩や手首への負担が軽減され、長時間の作業も快適になります。',
      },
    },

    howItWorksTitle: '使い方はシンプル',
    steps: {
      step1: {
        number: 'STEP 1',
        title: 'アプリを選択',
        description: '学習したいアプリケーションとレベルを選びます',
      },
      step2: {
        number: 'STEP 2',
        title: 'キーを押す',
        description: '実際にキーボードでショートカットを入力します',
      },
      step3: {
        number: 'STEP 3',
        title: '即座にフィードバック',
        description: '正解・不正解が瞬時に表示され、理解が深まります',
      },
    },

    releaseNotesTitle: '最新アップデート',
    releaseNotesDescription: 'Keyboard Visualizerの最新機能と改善履歴',
    releaseNotesVersion: 'v2.1.1',
    releaseNotesDate: '2026-02-11',
    releaseNotesSubtitle: 'Performance Optimization & Smooth Experience',
    releaseNotesList: [
      '🚀 レンダリングパフォーマンスを最適化し、スクロールをスムーズに',
      '🔋 低スペックデバイス向けのアダプティブ・パフォーマンス機能をLPに適用',
      '🖼️ 画像の遅延読み込みとサイズ指定でレイアウトシフト（CLS）を防止',
    ],
    viewAllReleases: 'すべてのリリースノートを見る →',

    finalCtaTitle: '今すぐ始めて、生産性を最大化しましょう',
    finalCtaDescription: '完全無料・登録不要で、すぐに使い始められます',
    finalCtaButton: '無料で今すぐはじめる',

    footer: {
      copyright: 'Keyboard Visualizer. All rights reserved.',
    },
  },

  // App Header
  header: {
    title: 'Keyboard Visualizer',
    login: 'ログイン',
    logout: 'ログアウト',
    profile: 'プロフィール',
    settings: '設定',
    releaseNotes: 'リリースノート',
    backToHome: 'ホームに戻る',
    quizMode: 'Quiz Mode',
    visualizer: 'Visualizer',
    fullscreen: '全画面',
    exitFullscreen: '全画面終了',
    csvDownload: 'CSVダウンロード',
    noShortcutsToDownload: 'ダウンロードするショートカットがありません',
    returnToVisualizer: 'ビジュアライザーに戻ります',
    startQuizMode: 'クイズモードを開始します',
  },

  // Setup Screen
  setup: {
    title: 'キーボードビジュアライザー',
    subtitle: 'ショートカット学習ツール',
    welcome: 'ようこそ！',
    welcomeMessage: '1,300種類以上のショートカットを可視化・練習しましょう',
    loginButton: 'ログイン',
    loginTooltip: 'ログインしてクイズの進捗を保存',
    selectDisplayMode: '表示モードを選択してください',
    selectKeyboardLayout: 'キーボードレイアウトを選択してください',
    selectMode: 'モードを選択してください',
    selectApplication: 'アプリケーションを選択してください（複数選択可）',
    selectQuizApplication: 'クイズ用アプリを選択してください',
    selectDifficulty: '難易度を選択してください',
    confirmButton: '確定',
    randomApp: 'ランダム',
    pleaseSelectDisplayMode: '表示モードを選択してください',
    pleaseSelectLayout: 'キーボードレイアウトを選択してください',
    pleaseSelectMode: 'モードを選択してください',
    pleaseSelectApp: 'アプリケーションを選択してください',
    pleaseSelectDifficulty: '難易度を選択してください',
    pleaseSelectQuizApp: '出題するアプリケーションを選択してください',
    canChangeInSettings: '後で設定から変更できます',
    modes: {
      visualize: 'ビジュアライズモード',
      visualizeDesc: 'キー入力をリアルタイムで可視化',
      quiz: 'クイズモード',
      quizDesc: 'インタラクティブなクイズで知識をテスト',
    },
    difficulty: '難易度',
    difficultyLevels: {
      basic: '基本',
      standard: '標準',
      hard: '上級',
      madmax: 'マッドマックス',
    },
    start: 'スタート',
    back: '戻る',
  },

  // Quiz
  quiz: {
    title: 'クイズモード',
    question: '問題',
    score: 'スコア',
    progress: '進捗',
    inputShortcut: 'この操作のショートカットを入力してください',
    correct: '正解！',
    incorrect: '不正解',
    skip: 'スキップ',
    next: '次へ',
    finish: '終了',
    results: {
      title: 'クイズ結果',
      yourScore: 'あなたのスコア',
      correctAnswers: '正解数',
      totalQuestions: '総問題数',
      accuracy: '正答率',
      tryAgain: 'もう一度挑戦',
      backToSetup: 'セットアップに戻る',
    },
  },

  // Normal Mode (Visualization)
  normalMode: {
    title: 'ビジュアライズモード',
    pressKeys: 'キーボードショートカットを入力してください',
    noMatch: '一致するショートカットがありません',
    protectedShortcut: 'これはシステムで保護されたショートカットです',
    fullscreenHint: 'F11キーを押してフルスクリーンモードにすると、より多くのショートカットをキャプチャできます',
  },

  // Shortcut Card
  shortcutCard: {
    basic: '基本',
    standard: '標準',
    hard: '上級',
    madmax: 'マッドマックス',
    windows: 'Windows',
    mac: 'macOS',
    crossPlatform: 'クロスプラットフォーム',
    protected: 'システム保護',
    preventableInFullscreen: 'フルスクリーンで防止可能',
  },

  // Authentication
  auth: {
    signIn: 'ログイン',
    signUp: '新規登録',
    signOut: 'ログアウト',
    email: 'メールアドレス',
    password: 'パスワード',
    confirmPassword: 'パスワード（確認）',
    forgotPassword: 'パスワードをお忘れですか？',
    noAccount: 'アカウントをお持ちでないですか？',
    haveAccount: 'すでにアカウントをお持ちですか？',
    signInWith: 'ログイン',
    google: 'Google',
    github: 'GitHub',
    or: 'または',
    emailSignIn: 'メールアドレスでログイン',
    loading: '読み込み中...',
    error: {
      invalidEmail: '無効なメールアドレスです',
      weakPassword: 'パスワードは6文字以上である必要があります',
      passwordMismatch: 'パスワードが一致しません',
      userNotFound: 'ユーザーが見つかりません',
      wrongPassword: 'パスワードが正しくありません',
      emailInUse: 'このメールアドレスは既に使用されています',
      unknownError: 'エラーが発生しました。もう一度お試しください。',
    },
  },

  // User Menu
  user: {
    welcome: 'ようこそ',
    myProfile: 'マイプロフィール',
    quizHistory: 'クイズ履歴',
    statistics: '統計',
    settings: '設定',
    signOut: 'ログアウト',
  },

  // Statistics
  stats: {
    totalSessions: '総セッション数',
    averageScore: '平均スコア',
    totalCorrect: '総正解数',
    totalQuestions: '総問題数',
    overallAccuracy: '総合正答率',
    lastQuiz: '最終クイズ',
    noData: 'クイズ履歴がありません',
  },

  // Common
  common: {
    loading: '読み込み中...',
    error: 'エラー',
    success: '成功',
    cancel: 'キャンセル',
    confirm: '確認',
    save: '保存',
    delete: '削除',
    edit: '編集',
    close: '閉じる',
    back: '戻る',
    next: '次へ',
    previous: '前へ',
    search: '検索',
    filter: 'フィルター',
    sort: '並び替え',
    all: 'すべて',
    none: 'なし',
    yes: 'はい',
    no: 'いいえ',
    ok: 'OK',
  },

  // Errors
  errors: {
    notFound: 'ページが見つかりません',
    serverError: 'サーバーエラー',
    networkError: 'ネットワークエラー',
    unknownError: '不明なエラー',
    tryAgain: 'もう一度お試しください',
  },
};

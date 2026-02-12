/**
 * English translations
 */
export const en = {
  // Landing Page
  landing: {
    badge: 'NEW VERSION 2.1',
    title: 'KEYBOARD VISUALIZER',
    subtitle: 'Work at the speed of thought.',
    description: 'A learning platform that visualizes 1,300+ shortcuts in real-time. Master your tools and maximize your creative time.',
    ctaButton: 'Get Started for Free',

    stats: {
      shortcuts: 'Shortcuts',
      apps: 'Supported Apps',
      levels: 'Difficulty Levels',
    },

    whyTitle: 'Why Keyboard Visualizer?',

    features: {
      visualFeedback: {
        title: 'Visual Feedback',
        description: 'Every key you press is beautifully visualized. Intuitively understand how the system behaves.',
      },
      quizMode: {
        title: 'Interactive Quiz',
        description: 'Retain knowledge through quiz-based practice. Your body naturally remembers the operations.',
      },
      multiPlatform: {
        title: 'Master Every App',
        description: 'From VS Code to Excel and Slack. Become a master of all the professional tools you use daily.',
      },
    },

    appsTitle: 'Supported Applications',
    appsDescription: 'Comprehensive shortcuts for the professional tools you use daily',

    benefitsTitle: 'Benefits You\'ll Gain',
    benefits: {
      productivity: {
        number: '01',
        title: 'Dramatically Boost Productivity',
        description: 'Switching from mouse to keyboard operations increases work speed by an average of 30-50%.',
      },
      flow: {
        number: '02',
        title: 'Maintain Flow State',
        description: 'Prevent concentration breaks from switching between mouse and keyboard, maintaining deep focus.',
      },
      skill: {
        number: '03',
        title: 'Professional Skills',
        description: 'Mastering shortcuts is visibly professional and impressive to others.',
      },
      ergonomics: {
        number: '04',
        title: 'Reduce Physical Strain',
        description: 'Reduced mouse usage lessens shoulder and wrist strain, making long work sessions comfortable.',
      },
    },

    howItWorksTitle: 'Simple to Use',
    steps: {
      step1: {
        number: 'STEP 1',
        title: 'Select Application',
        description: 'Choose the application and level you want to learn',
      },
      step2: {
        number: 'STEP 2',
        title: 'Press Keys',
        description: 'Input shortcuts with your keyboard',
      },
      step3: {
        number: 'STEP 3',
        title: 'Instant Feedback',
        description: 'Correct/incorrect answers are displayed instantly, deepening your understanding',
      },
    },

    releaseNotesTitle: 'Latest Updates',
    releaseNotesDescription: 'Latest features and improvements for Keyboard Visualizer',
    releaseNotesVersion: 'v2.1.1',
    releaseNotesDate: '2026-02-11',
    releaseNotesSubtitle: 'Performance Optimization & Smooth Experience',
    releaseNotesList: [
      '🚀 Optimized rendering performance for smooth scrolling',
      '🔋 Applied adaptive performance features for low-spec devices to LP',
      '🖼️ Prevented layout shift (CLS) with lazy image loading and size specification',
    ],
    viewAllReleases: 'View All Release Notes →',

    finalCtaTitle: 'Start now and maximize your productivity',
    finalCtaDescription: 'Completely free, no registration required. Start using immediately',
    finalCtaButton: 'Get Started for Free',

    footer: {
      copyright: 'Keyboard Visualizer. All rights reserved.',
    },
  },

  // App Header
  header: {
    title: 'Keyboard Visualizer',
    login: 'Log In',
    logout: 'Log Out',
    profile: 'Profile',
    settings: 'Settings',
    releaseNotes: 'Release Notes',
    backToHome: 'Back to Home',
    quizMode: 'Quiz Mode',
    visualizer: 'Visualizer',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit Fullscreen',
    csvDownload: 'Download CSV',
    noShortcutsToDownload: 'No shortcuts to download',
    returnToVisualizer: 'Return to visualizer',
    startQuizMode: 'Start quiz mode',
  },

  // Setup Screen
  setup: {
    title: 'Keyboard Visualizer',
    subtitle: 'Shortcut Learning Tool',
    welcome: 'Welcome!',
    welcomeMessage: 'Visualize and practice over 1,300 shortcuts',
    loginButton: 'Log In',
    loginTooltip: 'Log in to save quiz progress',
    selectDisplayMode: 'Select Display Mode',
    selectKeyboardLayout: 'Select Keyboard Layout',
    selectMode: 'Select Mode',
    selectApplication: 'Select Application (Multiple selection allowed)',
    selectQuizApplication: 'Select Application for Quiz',
    selectDifficulty: 'Select Difficulty Level',
    confirmButton: 'Confirm',
    randomApp: 'Random',
    pleaseSelectDisplayMode: 'Please select display mode',
    pleaseSelectLayout: 'Please select keyboard layout',
    pleaseSelectMode: 'Please select mode',
    pleaseSelectApp: 'Please select application',
    pleaseSelectDifficulty: 'Please select difficulty',
    pleaseSelectQuizApp: 'Please select application for quiz',
    canChangeInSettings: 'You can change these settings later',
    modes: {
      visualize: 'Visualization Mode',
      visualizeDesc: 'See shortcuts in real-time as you type',
      quiz: 'Quiz Mode',
      quizDesc: 'Test your knowledge with interactive quizzes',
    },
    difficulty: 'Difficulty Level',
    difficultyLevels: {
      basic: 'Basic',
      standard: 'Standard',
      hard: 'Hard',
      madmax: 'Mad Max',
    },
    start: 'Start',
    back: 'Back',
  },

  // Quiz
  quiz: {
    title: 'Quiz Mode',
    question: 'Question',
    score: 'Score',
    progress: 'Progress',
    inputShortcut: 'Input the shortcut for this action',
    correct: 'Correct!',
    incorrect: 'Incorrect',
    skip: 'Skip',
    next: 'Next',
    finish: 'Finish',
    results: {
      title: 'Quiz Results',
      yourScore: 'Your Score',
      correctAnswers: 'Correct Answers',
      totalQuestions: 'Total Questions',
      accuracy: 'Accuracy',
      tryAgain: 'Try Again',
      backToSetup: 'Back to Setup',
    },
  },

  // Normal Mode (Visualization)
  normalMode: {
    title: 'Visualization Mode',
    pressKeys: 'Press any keyboard shortcut',
    noMatch: 'No matching shortcut',
    protectedShortcut: 'This is a system-protected shortcut',
    fullscreenHint: 'Press F11 to enable fullscreen mode and capture more shortcuts',
  },

  // Shortcut Card
  shortcutCard: {
    basic: 'Basic',
    standard: 'Standard',
    hard: 'Hard',
    madmax: 'Mad Max',
    windows: 'Windows',
    mac: 'macOS',
    crossPlatform: 'Cross-Platform',
    protected: 'System Protected',
    preventableInFullscreen: 'Preventable in Fullscreen',
  },

  // Authentication
  auth: {
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot Password?',
    noAccount: 'Don\'t have an account?',
    haveAccount: 'Already have an account?',
    signInWith: 'Sign in with',
    google: 'Google',
    github: 'GitHub',
    or: 'or',
    emailSignIn: 'Sign in with Email',
    loading: 'Loading...',
    error: {
      invalidEmail: 'Invalid email address',
      weakPassword: 'Password must be at least 6 characters',
      passwordMismatch: 'Passwords do not match',
      userNotFound: 'User not found',
      wrongPassword: 'Incorrect password',
      emailInUse: 'Email already in use',
      unknownError: 'An error occurred. Please try again.',
    },
  },

  // User Menu
  user: {
    welcome: 'Welcome',
    myProfile: 'My Profile',
    quizHistory: 'Quiz History',
    statistics: 'Statistics',
    settings: 'Settings',
    signOut: 'Sign Out',
  },

  // Statistics
  stats: {
    totalSessions: 'Total Sessions',
    averageScore: 'Average Score',
    totalCorrect: 'Total Correct',
    totalQuestions: 'Total Questions',
    overallAccuracy: 'Overall Accuracy',
    lastQuiz: 'Last Quiz',
    noData: 'No quiz history yet',
  },

  // Common
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    all: 'All',
    none: 'None',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
  },

  // Errors
  errors: {
    notFound: 'Page not found',
    serverError: 'Server error',
    networkError: 'Network error',
    unknownError: 'Unknown error',
    tryAgain: 'Please try again',
  },
};

export type Translations = typeof en;

/**
 * Google Tag Manager / GA4 Analytics Utility
 */

type AnalyticsEvent = {
  event: string;
  category?: string;
  action?: string;
  label?: string;
  value?: number;
  [key: string]: any;
};

const isProd = import.meta.env.PROD;
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

/**
 * Send a custom event to Google Tag Manager dataLayer
 */
export const trackEvent = (payload: AnalyticsEvent) => {
  // Only track in production and not on localhost
  if (!isProd || isLocalhost) {
    if (!isProd) {
      console.log('[Analytics Preview]:', payload);
    }
    return;
  }

  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    (window as any).dataLayer.push({
      ...payload,
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Track page views (GTM handles this usually, but useful for SPAs)
 */
export const trackPageView = (path: string) => {
  trackEvent({
    event: 'page_view',
    page_path: path,
  });
};

/**
 * Specialized tracking functions for Keyboard Visualizer
 */
export const analytics = {
  quizStarted: (app: string, difficulty: string) => {
    trackEvent({
      event: 'quiz_start',
      quiz_app: app,
      quiz_difficulty: difficulty,
    });
  },
  quizCompleted: (app: string, score: number, accuracy: number) => {
    trackEvent({
      event: 'quiz_complete',
      quiz_app: app,
      quiz_score: score,
      quiz_accuracy: accuracy,
    });
  },
  appSelected: (appId: string) => {
    trackEvent({
      event: 'app_selection',
      app_id: appId,
    });
  },
  shortcutMastered: (shortcutKeys: string) => {
    trackEvent({
      event: 'shortcut_mastered',
      shortcut: shortcutKeys,
    });
  }
};

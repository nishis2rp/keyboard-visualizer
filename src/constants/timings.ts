/**
 * タイミング関連の定数
 * アプリケーション全体で使用されるタイムアウト、インターバル、遅延などの値を一元管理
 */

export const TIMINGS = {
  /**
   * クイズ入力のクールダウン時間（ミリ秒）
   * ユーザーの連続入力を防ぐための待機時間
   */
  QUIZ_INPUT_COOLDOWN_MS: 300,

  /**
   * クイズタイマーの更新間隔（ミリ秒）
   * タイマー表示を更新する頻度
   */
  QUIZ_TIMER_INTERVAL_MS: 100,

  /**
   * アニメーション遅延（ミリ秒）
   * UI要素のアニメーション開始までの待機時間
   */
  ANIMATION_DELAY_MS: 100,

  /**
   * IntersectionObserverのしきい値
   * 要素の可視性を判定するための閾値（0.0 - 1.0）
   */
  INTERSECTION_THRESHOLD: 0.1,

  /**
   * デフォルトのクイズ制限時間（秒）
   * 1問あたりの回答時間の上限
   */
  DEFAULT_TIME_LIMIT_S: 10,
} as const;

/**
 * タイミング定数の型
 */
export type TimingConstants = typeof TIMINGS;

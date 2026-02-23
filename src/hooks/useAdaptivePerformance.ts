import { useState, useEffect, useRef } from 'react';

/**
 * デバイスの描画能力を監視し、最適なUI設定を返すAIオプティマイザー
 */
export const useAdaptivePerformance = () => {
  const [qualityLevel, setQualityLevel] = useState<'high' | 'medium' | 'low'>('high');
  const frameTimes = useRef<number[]>([]);
  const lastTime = useRef<number>(performance.now());
  const startTime = useRef<number>(performance.now());

  useEffect(() => {
    // Ref で常に最新の frameId を追跡し、クリーンアップ時に確実にキャンセルできるようにする
    const frameIdRef = { current: 0 };
    let cancelled = false;

    const measure = (time: number) => {
      if (cancelled) return;

      const delta = time - lastTime.current;
      lastTime.current = time;

      // Ignore the first 3 seconds to allow for page load/rendering stabilization
      if (time - startTime.current < 3000) {
        frameIdRef.current = requestAnimationFrame(measure);
        return;
      }

      if (delta > 0) {
        frameTimes.current.push(delta);
        // Increase window to 180 frames (~3 seconds) for more stable average
        if (frameTimes.current.length > 180) {
          frameTimes.current.shift();

          // 平均FPSを計算
          const avgDelta = frameTimes.current.reduce((a, b) => a + b, 0) / frameTimes.current.length;

          // 閾値判定 (AI Optimization logic) - Much more lenient thresholds
          // If the average delta is > 50ms (less than 20fps), then drop to low
          if (avgDelta > 50) {
            setQualityLevel('low');
          } else if (avgDelta > 33) { // < 30fps
            setQualityLevel('medium');
          } else {
            setQualityLevel('high');
          }
        }
      }
      frameIdRef.current = requestAnimationFrame(measure);
    };

    frameIdRef.current = requestAnimationFrame(measure);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frameIdRef.current);
    };
  }, []);

  // クオリティに応じたCSS変数の値を定義
  const performanceStyles = {
    '--glass-blur': qualityLevel === 'high' ? '20px' : qualityLevel === 'medium' ? '10px' : '0px',
    '--animation-speed': '0.3s', // Keep consistent to avoid transition glitches
    '--shadow-opacity': qualityLevel === 'high' ? '0.1' : '0.02',
  } as React.CSSProperties;

  return { qualityLevel, performanceStyles };
};

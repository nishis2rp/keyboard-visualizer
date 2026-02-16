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
    let animationFrameId: number;

    const measure = (time: number) => {
      const delta = time - lastTime.current;
      lastTime.current = time;

      // Ignore the first 2 seconds to allow for page load/rendering stabilization
      if (time - startTime.current < 2000) {
        animationFrameId = requestAnimationFrame(measure);
        return;
      }

      if (delta > 0) {
        frameTimes.current.push(delta);
        // Increase window to 120 frames (~2 seconds) for more stable average
        if (frameTimes.current.length > 120) {
          frameTimes.current.shift();
          
          // 平均FPSを計算
          const avgDelta = frameTimes.current.reduce((a, b) => a + b, 0) / frameTimes.current.length;
          
          // 閾値判定 (AI Optimization logic) - Slightly more lenient thresholds
          if (avgDelta > 40) { // < 25fps (More lenient than 30fps)
            setQualityLevel('low');
          } else if (avgDelta > 25) { // < 40fps
            setQualityLevel('medium');
          } else {
            setQualityLevel('high');
          }
        }
      }
      animationFrameId = requestAnimationFrame(measure);
    };

    animationFrameId = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // クオリティに応じたCSS変数の値を定義
  const performanceStyles = {
    '--glass-blur': qualityLevel === 'high' ? '20px' : qualityLevel === 'medium' ? '10px' : '0px',
    '--animation-speed': qualityLevel === 'low' ? '0s' : '0.3s',
    '--shadow-opacity': qualityLevel === 'high' ? '0.1' : '0.02',
  } as React.CSSProperties;

  return { qualityLevel, performanceStyles };
};

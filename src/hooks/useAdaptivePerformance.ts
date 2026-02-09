import { useState, useEffect, useRef } from 'react';

/**
 * デバイスの描画能力を監視し、最適なUI設定を返すAIオプティマイザー
 */
export const useAdaptivePerformance = () => {
  const [qualityLevel, setQualityLevel] = useState<'high' | 'medium' | 'low'>('high');
  const frameTimes = useRef<number[]>([]);
  const lastTime = useRef<number>(performance.now());

  useEffect(() => {
    let animationFrameId: number;

    const measure = (time: number) => {
      const delta = time - lastTime.current;
      lastTime.current = time;

      if (delta > 0) {
        frameTimes.current.push(delta);
        if (frameTimes.current.length > 60) {
          frameTimes.current.shift();
          
          // 平均FPSを計算
          const avgDelta = frameTimes.current.reduce((a, b) => a + b, 0) / frameTimes.current.length;
          
          // 閾値判定 (AI Optimization logic)
          if (avgDelta > 32) { // < 30fps
            setQualityLevel('low');
          } else if (avgDelta > 20) { // < 50fps
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

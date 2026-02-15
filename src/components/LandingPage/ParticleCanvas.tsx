import React, { useRef, useEffect, useState } from 'react';
import styles from '../../pages/LandingPage.module.css';
import { useParticleAnimation } from '../../hooks/useParticleAnimation';
import { useAdaptivePerformance } from '../../hooks';

const ParticleCanvas: React.FC = () => {
  const { qualityLevel } = useAdaptivePerformance();
  const [isCanvasVisible, setIsCanvasVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Use the custom hook for animation logic
  const canvasRef = useParticleAnimation({ 
    qualityLevel, 
    isCanvasVisible 
  });

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      setIsCanvasVisible(entries[0].isIntersecting);
    }, { threshold: 0 });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      <canvas 
        className={styles.particleCanvas} 
        id="particleCanvas" 
        ref={canvasRef}
      />
    </div>
  );
};

export default ParticleCanvas;

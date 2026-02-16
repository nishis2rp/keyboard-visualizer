import React from 'react';
import styles from '../../pages/LandingPage.module.css';
import { useParticleAnimation } from '../../hooks/useParticleAnimation';
import { useAdaptivePerformance } from '../../hooks';

const ParticleCanvas: React.FC = () => {
  const { qualityLevel } = useAdaptivePerformance();

  // Canvas is always visible since it's fixed to viewport
  // Use the custom hook for animation logic
  const canvasRef = useParticleAnimation({
    qualityLevel,
    isCanvasVisible: true
  });

  return (
    <canvas
      className={styles.particleCanvas}
      id="particleCanvas"
      ref={canvasRef}
    />
  );
};

export default ParticleCanvas;

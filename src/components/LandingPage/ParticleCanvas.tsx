import React from 'react';
import styles from '../../pages/LandingPage.module.css';
import { useParticleAnimation } from '../../hooks/useParticleAnimation';
import { useAdaptivePerformance } from '../../hooks';

const ParticleCanvas: React.FC = () => {
  const { qualityLevel } = useAdaptivePerformance();

  // Force isCanvasVisible to true for Landing Page as requested "Infinite"
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

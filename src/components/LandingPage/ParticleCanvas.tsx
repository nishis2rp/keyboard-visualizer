import React from 'react';
import styles from '../../pages/LandingPage.module.css';
import { useParticleAnimation } from '../../hooks/useParticleAnimation';
import { useAdaptivePerformance } from '../../hooks';
import { useUI } from '../../context/UIContext';

const ParticleCanvas: React.FC = () => {
  const { qualityLevel } = useAdaptivePerformance();
  const { showLandingVisualizer } = useUI();

  // Canvas visibility is managed by UIContext
  const canvasRef = useParticleAnimation({
    qualityLevel,
    isCanvasVisible: showLandingVisualizer
  });

  if (!showLandingVisualizer) return null;

  return (
    <canvas
      className={styles.particleCanvas}
      id="particleCanvas"
      ref={canvasRef}
    />
  );
};

export default ParticleCanvas;

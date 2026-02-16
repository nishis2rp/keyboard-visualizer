import React from 'react';
import styles from '../../pages/LandingPage.module.css';
import { useParticleAnimation } from '../../hooks/useParticleAnimation';
import { useAdaptivePerformance } from '../../hooks';
import { useUI } from '../../context/UIContext';

const ParticleCanvas: React.FC = () => {
  const { qualityLevel } = useAdaptivePerformance();
  const { showLandingVisualizer } = useUI();

  // Canvas visibility is managed by logic inside the hook, 
  // but we keep the canvas element rendered to avoid re-mounting
  const canvasRef = useParticleAnimation({
    qualityLevel,
    isCanvasVisible: showLandingVisualizer
  });

  return (
    <canvas
      className={styles.particleCanvas}
      id="particleCanvas"
      ref={canvasRef}
      style={{ 
        display: showLandingVisualizer ? 'block' : 'none',
        opacity: showLandingVisualizer ? 0.7 : 0 
      }}
    />
  );
};

export default ParticleCanvas;

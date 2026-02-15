import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface UseParticleAnimationProps {
  qualityLevel: 'low' | 'medium' | 'high';
  isCanvasVisible: boolean;
}

export const useParticleAnimation = ({ qualityLevel, isCanvasVisible }: UseParticleAnimationProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let rect = canvas.getBoundingClientRect();
    const particles: Particle[] = [];

    const initParticles = () => {
      const isMobile = window.innerWidth < 768;
      let particleCount = isMobile ? 30 : 50;

      // Adjust count based on performance level
      if (qualityLevel === 'medium') particleCount = Math.floor(particleCount * 0.6);
      if (qualityLevel === 'low') particleCount = Math.floor(particleCount * 0.4);

      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 1.5 + 0.5,
        });
      }
    };

    // Canvas size setup with device pixel ratio for crisp rendering
    const setCanvasSize = () => {
      if (!canvas) return;
      rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.resetTransform(); // Reset transform before scaling
      ctx.scale(dpr, dpr);

      // Update CSS size (optional if handled by CSS)
      // canvas.style.width = rect.width + 'px';
      // canvas.style.height = rect.height + 'px';
      
      initParticles();
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    const connectionDistance = window.innerWidth < 768 ? 80 : 120;

    // Throttle animation to reduce CPU usage
    let lastFrameTime = 0;
    const frameInterval = 1000 / 30; // 30 FPS for smooth performance

    // Animation loop
    const animate = (currentTime: number) => {
      animationFrameRef.current = requestAnimationFrame(animate);

      if (!isCanvasVisible) {
        return;
      }

      // Throttle to 30 FPS
      const deltaTime = currentTime - lastFrameTime;
      if (deltaTime < frameInterval) {
        return;
      }
      lastFrameTime = currentTime - (deltaTime % frameInterval);

      ctx.clearRect(0, 0, rect.width, rect.height);

      // Update and draw particles
      const pCount = particles.length;
      for (let i = 0; i < pCount; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > rect.width) p.vx *= -1;
        if (p.y < 0 || p.y > rect.height) p.vy *= -1;

        // Draw particle (simple, no glow for performance)
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fill();

        // Connections (only for higher quality)
        if (qualityLevel !== 'low') {
          for (let j = i + 1; j < pCount; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < connectionDistance * connectionDistance) {
              const distance = Math.sqrt(distSq);
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              const opacity = (1 - distance / connectionDistance) * 0.4;
              ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [qualityLevel, isCanvasVisible]);

  return canvasRef;
};

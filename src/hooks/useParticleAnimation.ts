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
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let rect = canvas.getBoundingClientRect();
    const particles: Particle[] = [];

    const initParticles = () => {
      const isMobile = window.innerWidth < 768;
      // Drastically increase particle count for dense geometric effect
      let particleCount = isMobile ? 80 : 200;

      // Adjust count based on performance level
      if (qualityLevel === 'medium') particleCount = Math.floor(particleCount * 0.8);
      if (qualityLevel === 'low') particleCount = Math.floor(particleCount * 0.4);

      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          radius: Math.random() * 1.5 + 0.5,
        });
      }
    };

    const setCanvasSize = () => {
      if (!canvas) return;
      rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.resetTransform();
      ctx.scale(dpr, dpr);
      
      initParticles();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const canvasRect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - canvasRect.left,
        y: e.clientY - canvasRect.top
      };
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    window.addEventListener('mousemove', handleMouseMove);

    // Increase connection distance significantly
    const connectionDistance = window.innerWidth < 768 ? 120 : 250;
    const mouseDistance = 150;

    let lastFrameTime = 0;
    const frameInterval = 1000 / 45; // Slightly higher FPS for smoother lines

    const animate = (currentTime: number) => {
      animationFrameRef.current = requestAnimationFrame(animate);

      if (!isCanvasVisible) return;

      const deltaTime = currentTime - lastFrameTime;
      if (deltaTime < frameInterval) return;
      lastFrameTime = currentTime - (deltaTime % frameInterval);

      ctx.clearRect(0, 0, rect.width, rect.height);

      const pCount = particles.length;
      
      // First pass: Update positions
      for (let i = 0; i < pCount; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > rect.width) p.vx *= -1;
        if (p.y < 0 || p.y > rect.height) p.vy *= -1;

        // Mouse interaction: push/pull effect (subtle)
        const dxm = p.x - mouseRef.current.x;
        const dym = p.y - mouseRef.current.y;
        const dMouse = Math.sqrt(dxm * dxm + dym * dym);
        if (dMouse < mouseDistance) {
          const force = (mouseDistance - dMouse) / mouseDistance;
          p.x += (dxm / dMouse) * force * 2;
          p.y += (dym / dMouse) * force * 2;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fill();
      }

      // Second pass: Draw connections
      if (qualityLevel !== 'low') {
        ctx.lineWidth = 1.2; // Increased from 0.5 for better visibility
        for (let i = 0; i < pCount; i++) {
          const p = particles[i];
          for (let j = i + 1; j < pCount; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < connectionDistance * connectionDistance) {
              const distance = Math.sqrt(distSq);
              const opacity = (1 - distance / connectionDistance) * 0.5; // Increased opacity
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
              ctx.stroke();
            }
          }
        }
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [qualityLevel, isCanvasVisible]);

  return canvasRef;
};

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [qualityLevel, isCanvasVisible]);

  return canvasRef;
};

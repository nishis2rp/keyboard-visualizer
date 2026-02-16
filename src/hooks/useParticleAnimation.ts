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
  const qualityLevelRef = useRef(qualityLevel);
  const isCanvasVisibleRef = useRef(isCanvasVisible);

  // Update refs when props change without restarting animation
  useEffect(() => {
    qualityLevelRef.current = qualityLevel;
    isCanvasVisibleRef.current = isCanvasVisible;
  }, [qualityLevel, isCanvasVisible]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let rect = canvas.getBoundingClientRect();
    const particles: Particle[] = [];

    const initParticles = () => {
      const isMobile = window.innerWidth < 768;
      // Drastically increase particle count for dense geometric effect and persistent connections
      let particleCount = isMobile ? 120 : 300; // Further increased to ensure always-visible connections

      // Adjust count based on performance level
      if (qualityLevelRef.current === 'medium') particleCount = Math.floor(particleCount * 0.8);
      if (qualityLevelRef.current === 'low') particleCount = Math.floor(particleCount * 0.4);

      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          vx: (Math.random() - 0.5) * 0.15, // Further reduced to 0.15 for very slow movement
          vy: (Math.random() - 0.5) * 0.15, // Further reduced to 0.15 for very slow movement
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

    // Significantly large connection distance to ensure persistent connections
    // Use percentage of screen size for responsive behavior
    const connectionDistance = window.innerWidth < 768 ? 200 : 450; // Further increased
    const mouseDistance = 200;

    let lastFrameTime = 0;
    const frameInterval = 1000 / 45; // Slightly higher FPS for smoother lines

    const animate = (currentTime: number) => {
      animationFrameRef.current = requestAnimationFrame(animate);

      if (!isCanvasVisibleRef.current) return;

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

        // Mouse interaction: push/pull effect (subtle)
        const dxm = p.x - mouseRef.current.x;
        const dym = p.y - mouseRef.current.y;
        const dMouse = Math.sqrt(dxm * dxm + dym * dym);
        if (dMouse < mouseDistance && dMouse > 0) {
          const force = (mouseDistance - dMouse) / mouseDistance;
          p.x += (dxm / dMouse) * force * 2;
          p.y += (dym / dMouse) * force * 2;
        }

        // Bounce off edges and clamp position to prevent particles from going off-screen
        // Apply bounds check AFTER mouse interaction to ensure particles stay visible
        if (p.x < 0) {
          p.x = 0;
          p.vx *= -1;
        } else if (p.x > rect.width) {
          p.x = rect.width;
          p.vx *= -1;
        }

        if (p.y < 0) {
          p.y = 0;
          p.vy *= -1;
        } else if (p.y > rect.height) {
          p.y = rect.height;
          p.vy *= -1;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fill();
      }

      // Second pass: Draw connections
      const currentQuality = qualityLevelRef.current;
      const opacityMultiplier = currentQuality === 'low' ? 0.2 : 0.5;
      const effectiveDistance = currentQuality === 'low' ? connectionDistance * 0.7 : connectionDistance;
      const effectiveDistanceSq = effectiveDistance * effectiveDistance;

      ctx.lineWidth = currentQuality === 'low' ? 0.8 : 1.2;
      for (let i = 0; i < pCount; i++) {
        // Optimization: In low quality, only check connections for every 2nd particle
        // This reduces the O(N^2) loop complexity significantly
        if (currentQuality === 'low' && i % 2 !== 0) continue;
        
        const p = particles[i];
        for (let j = i + 1; j < pCount; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < effectiveDistanceSq) {
            const distance = Math.sqrt(distSq);
            const opacity = (1 - distance / effectiveDistance) * opacityMultiplier;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.stroke();
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
  }, []); // Empty deps - animation runs once and uses refs for dynamic values

  return canvasRef;
};

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
  const particlesRef = useRef<Particle[]>([]);
  const dimensionsRef = useRef({ width: 0, height: 0 });

  // Update refs when props change
  useEffect(() => {
    qualityLevelRef.current = qualityLevel;
    isCanvasVisibleRef.current = isCanvasVisible;
  }, [qualityLevel, isCanvasVisible]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const initParticles = (width: number, height: number) => {
      const isMobile = window.innerWidth < 768;
      // Reduced particle count for better legibility
      let particleCount = isMobile ? 60 : 150; 

      // Less aggressive reduction
      if (qualityLevelRef.current === 'medium') particleCount = Math.floor(particleCount * 0.9);
      if (qualityLevelRef.current === 'low') particleCount = Math.floor(particleCount * 0.8);

      const newParticles: Particle[] = [];
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.12, // Slower movement
          vy: (Math.random() - 0.5) * 0.12,
          radius: Math.random() * 1.0 + 0.5,
        });
      }
      particlesRef.current = newParticles;
    };

    const setCanvasSize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      dimensionsRef.current = { width: rect.width, height: rect.height };
      initParticles(rect.width, rect.height);
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

    const connectionDistance = 350;
    const mouseDistance = 150;

    let lastFrameTime = 0;
    const frameInterval = 1000 / 40; // 40 FPS target for stability

    const animate = (currentTime: number) => {
      animationFrameRef.current = requestAnimationFrame(animate);

      const deltaTime = currentTime - lastFrameTime;
      if (deltaTime < frameInterval) return;
      lastFrameTime = currentTime - (deltaTime % frameInterval);

      const particles = particlesRef.current;
      const { width, height } = dimensionsRef.current;

      if (particles.length === 0 || width === 0) return;

      ctx.clearRect(0, 0, width, height);
      
      const pCount = particles.length;
      const currentQuality = qualityLevelRef.current;
      
      // Update and Draw Particles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      for (let i = 0; i < pCount; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Mouse interaction
        const dxm = p.x - mouseRef.current.x;
        const dym = p.y - mouseRef.current.y;
        const dMouseSq = dxm * dxm + dym * dym;
        if (dMouseSq < mouseDistance * mouseDistance) {
          const dMouse = Math.sqrt(dMouseSq);
          const force = (mouseDistance - dMouse) / mouseDistance;
          p.x += (dxm / dMouse) * force * 1.5;
          p.y += (dym / dMouse) * force * 1.5;
        }

        // Wrap around instead of bounce for more "infinite" feel
        if (p.x < 0) p.x = width;
        else if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        else if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw connections
      const opacityMultiplier = currentQuality === 'low' ? 0.15 : 0.25;
      const effectiveDistSq = connectionDistance * connectionDistance;

      ctx.lineWidth = 0.6;
      for (let i = 0; i < pCount; i++) {
        if (currentQuality === 'low' && i % 2 !== 0) continue;
        
        const p = particles[i];
        for (let j = i + 1; j < pCount; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < effectiveDistSq) {
            const distance = Math.sqrt(distSq);
            const opacity = (1 - distance / connectionDistance) * opacityMultiplier;
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
  }, []); 

  return canvasRef;
};

import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';
import { useAdaptivePerformance } from '../hooks';
import { useLanguage } from '../context/LanguageContext';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

const LandingPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const animationFrameRef = useRef<number>(0);
  const isCanvasVisible = useRef<boolean>(true);
  const { qualityLevel, performanceStyles } = useAdaptivePerformance();
  const { t } = useLanguage();

  useEffect(() => {
    // Remove body padding for landing page (add it back on cleanup)
    const originalPadding = document.body.style.padding;
    const originalBackground = document.body.style.background;
    document.body.style.padding = '0';
    document.body.style.background = '#050505';

    // Scroll reveal animation
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.isVisible);
        }
      });
    }, { threshold: 0.1 });

    const sections = document.querySelectorAll('section');
    sections.forEach(section => observerRef.current?.observe(section));

    // Canvas visibility observer
    const canvasObserver = new IntersectionObserver((entries) => {
      isCanvasVisible.current = entries[0].isIntersecting;
    }, { threshold: 0 });

    const canvas = document.getElementById('particleCanvas');
    if (canvas) canvasObserver.observe(canvas);

    return () => {
      // Restore original body styles
      document.body.style.padding = originalPadding;
      document.body.style.background = originalBackground;
      observerRef.current?.disconnect();
      canvasObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let rect = canvas.getBoundingClientRect();
    
    // Canvas size setup with device pixel ratio for crisp rendering
    const setCanvasSize = () => {
      rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.scale(dpr, dpr);

      // Update CSS size
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      
      initParticles();
    };

    // Particle system
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

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    const connectionDistance = window.innerWidth < 768 ? 80 : 120;

    // Throttle animation to reduce CPU usage
    let lastFrameTime = 0;
    const frameInterval = 1000 / 30; // 30 FPS for smooth performance

    // Animation loop
    const animate = (currentTime: number) => {
      animationFrameRef.current = requestAnimationFrame(animate);

      if (!isCanvasVisible.current) {
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
  }, [qualityLevel]);

  return (
    <div className={styles.landingWrapper} style={performanceStyles}>
      <canvas className={styles.particleCanvas} id="particleCanvas" ref={canvasRef}></canvas>
      <main className={styles.landingContainer}>
        <section className={`${styles.heroSection} ${styles.isVisible}`}>
          <div className={styles.badge}>{t.landing.badge}</div>
          <h1 className={styles.title}>{t.landing.title}</h1>
          <p className={styles.subtitle}>
            {t.landing.subtitle}
          </p>
          <p className={styles.description}>
            {t.landing.description}
          </p>
          <div className={styles.ctaButtonContainer}>
            <Link to="/app" className={styles.ctaButton}>
              {t.landing.ctaButton}
              <svg className={styles.ctaIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </section>

        {/* Stats Section */}
        <section className={styles.statsSection}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>1,300+</div>
              <div className={styles.statLabel}>{t.landing.stats.shortcuts}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>9</div>
              <div className={styles.statLabel}>{t.landing.stats.apps}</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>4</div>
              <div className={styles.statLabel}>{t.landing.stats.levels}</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.featuresSection}>
          <h2 className={styles.sectionTitle}>{t.landing.whyTitle}</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.iconWrapper}>
                <img
                  src={`${import.meta.env.BASE_URL}icons/visualizer.svg`}
                  alt="Visualizer"
                  className={styles.featureIcon}
                  loading="lazy"
                  width="32"
                  height="32"
                />
              </div>
              <h3>{t.landing.features.visualFeedback.title}</h3>
              <p>{t.landing.features.visualFeedback.description}</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.iconWrapper}>
                <img
                  src={`${import.meta.env.BASE_URL}icons/quiz.svg`}
                  alt="Quiz"
                  className={styles.featureIcon}
                  loading="lazy"
                  width="32"
                  height="32"
                />
              </div>
              <h3>{t.landing.features.quizMode.title}</h3>
              <p>{t.landing.features.quizMode.description}</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.iconWrapper}>
                <img
                  src={`${import.meta.env.BASE_URL}icons/allrange.svg`}
                  alt="Apps"
                  className={styles.featureIcon}
                  loading="lazy"
                  width="32"
                  height="32"
                />
              </div>
              <h3>{t.landing.features.multiPlatform.title}</h3>
              <p>{t.landing.features.multiPlatform.description}</p>
            </div>
          </div>
        </section>

        {/* Supported Apps Section */}
        <section className={styles.appsSection}>
          <h2 className={styles.sectionTitle}>{t.landing.appsTitle}</h2>
          <p className={styles.sectionSubtitle}>
            {t.landing.appsDescription}
          </p>
          <div className={styles.appsGrid}>
            {[
              { id: 'windows', name: 'Windows 11', icon: 'windows.svg' },
              { id: 'macos', name: 'macOS', icon: 'macos.svg' },
              { id: 'chrome', name: 'Chrome', icon: 'chrome.svg' },
              { id: 'vscode', name: 'VS Code', icon: 'vscode.svg' },
              { id: 'excel', name: 'Excel', icon: 'excel.svg' },
              { id: 'word', name: 'Word', icon: 'word.svg' },
              { id: 'powerpoint', name: 'PowerPoint', icon: 'powerpoint.svg' },
              { id: 'slack', name: 'Slack', icon: 'slack.svg' },
              { id: 'gmail', name: 'Gmail', icon: 'gmail.svg' }
            ].map(app => (
              <div key={app.id} className={styles.appCard}>
                <img 
                  src={`${import.meta.env.BASE_URL}icons/${app.icon}`} 
                  alt={app.name} 
                  className={styles.appIcon} 
                  loading="lazy" 
                  width="44" 
                  height="44" 
                />
                <div className={styles.appName}>{app.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className={styles.benefitsSection}>
          <h2 className={styles.sectionTitle}>{t.landing.benefitsTitle}</h2>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <div className={styles.benefitNumber}>{t.landing.benefits.productivity.number}</div>
              <h3 className={styles.benefitTitle}>{t.landing.benefits.productivity.title}</h3>
              <p className={styles.benefitDescription}>
                {t.landing.benefits.productivity.description}
              </p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitNumber}>{t.landing.benefits.flow.number}</div>
              <h3 className={styles.benefitTitle}>{t.landing.benefits.flow.title}</h3>
              <p className={styles.benefitDescription}>
                {t.landing.benefits.flow.description}
              </p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitNumber}>{t.landing.benefits.skill.number}</div>
              <h3 className={styles.benefitTitle}>{t.landing.benefits.skill.title}</h3>
              <p className={styles.benefitDescription}>
                {t.landing.benefits.skill.description}
              </p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitNumber}>{t.landing.benefits.ergonomics.number}</div>
              <h3 className={styles.benefitTitle}>{t.landing.benefits.ergonomics.title}</h3>
              <p className={styles.benefitDescription}>
                {t.landing.benefits.ergonomics.description}
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className={styles.howItWorksSection}>
          <h2 className={styles.sectionTitle}>{t.landing.howItWorksTitle}</h2>
          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>{t.landing.steps.step1.number}</div>
              <h3 className={styles.stepTitle}>{t.landing.steps.step1.title}</h3>
              <p className={styles.stepDescription}>{t.landing.steps.step1.description}</p>
            </div>
            <div className={styles.stepArrow}>→</div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>{t.landing.steps.step2.number}</div>
              <h3 className={styles.stepTitle}>{t.landing.steps.step2.title}</h3>
              <p className={styles.stepDescription}>{t.landing.steps.step2.description}</p>
            </div>
            <div className={styles.stepArrow}>→</div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>{t.landing.steps.step3.number}</div>
              <h3 className={styles.stepTitle}>{t.landing.steps.step3.title}</h3>
              <p className={styles.stepDescription}>{t.landing.steps.step3.description}</p>
            </div>
          </div>
        </section>

        {/* Release Notes Section */}
        <section className={styles.releaseNotesSection}>
          <h2 className={styles.sectionTitle}>{t.landing.releaseNotesTitle}</h2>
          <p className={styles.sectionSubtitle}>
            {t.landing.releaseNotesDescription}
          </p>
          <div className={styles.releaseNotesCard}>
            <div className={styles.releaseNotesHeader}>
              <span className={styles.releaseVersion}>{t.landing.releaseNotesVersion}</span>
              <span className={styles.releaseDate}>{t.landing.releaseNotesDate}</span>
            </div>
            <h3 className={styles.releaseNotesTitle}>{t.landing.releaseNotesSubtitle}</h3>
            <ul className={styles.releaseNotesList}>
              {t.landing.releaseNotesList.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
            <Link to="/release-notes" className={styles.releaseNotesLink}>
              {t.landing.viewAllReleases}
            </Link>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className={styles.finalCtaSection}>
          <h2 className={styles.finalCtaTitle}>{t.landing.finalCtaTitle}</h2>
          <p className={styles.finalCtaDescription}>
            {t.landing.finalCtaDescription}
          </p>
          <Link to="/app" className={styles.finalCtaButton}>
            {t.landing.finalCtaButton}
            <svg className={styles.ctaIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </section>

        <footer className={styles.footer}>
          <p>&copy; {new Date().getFullYear()} {t.landing.footer.copyright}</p>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;

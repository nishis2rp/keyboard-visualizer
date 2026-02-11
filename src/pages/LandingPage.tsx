import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';
import { useAdaptivePerformance } from '../hooks';

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
      let particleCount = isMobile ? 50 : 100;

      // Adjust count based on performance level
      if (qualityLevel === 'medium') particleCount = Math.floor(particleCount * 0.7);
      if (qualityLevel === 'low') particleCount = Math.floor(particleCount * 0.3);

      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          radius: Math.random() * 2 + 0.8,
        });
      }
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    const connectionDistance = window.innerWidth < 768 ? 100 : 150;

    // Animation loop
    const animate = () => {
      if (!isCanvasVisible.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

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

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();

        // Add glow effect to particles
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        ctx.fill();
        ctx.shadowBlur = 0;

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
              const opacity = (1 - distance / connectionDistance) * 0.5;
              ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
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
          <div className={styles.badge}>NEW VERSION 2.1</div>
          <h1 className={styles.title}>KEYBOARD VISUALIZER</h1>
          <p className={styles.subtitle}>
            Work at the speed of thought.
          </p>
          <p className={styles.description}>
            1,300以上のショートカットをリアルタイムで可視化する学習プラットフォーム。
            ツールを使いこなし、創造的な時間を最大化しましょう。
          </p>
          <div className={styles.ctaButtonContainer}>
            <Link to="/app" className={styles.ctaButton}>
              無料で今すぐはじめる
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
              <div className={styles.statLabel}>ショートカット</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>9</div>
              <div className={styles.statLabel}>対応アプリ</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>4</div>
              <div className={styles.statLabel}>難易度レベル</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.featuresSection}>
          <h2 className={styles.sectionTitle}>なぜKeyboard Visualizerなのか</h2>
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
              <h3>Visual Feedback</h3>
              <p>入力したすべてのキーが美しく可視化されます。システムの挙動を直感的に理解しましょう。</p>
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
              <h3>Active Learning</h3>
              <p>クイズ形式の反復練習により、記憶に定着。苦手な操作も自然と体が覚えます。</p>
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
              <h3>Master Every App</h3>
              <p>VS CodeからExcel、Slackまで。日常的に使うあらゆるプロツールの達人へ。</p>
            </div>
          </div>
        </section>

        {/* Supported Apps Section */}
        <section className={styles.appsSection}>
          <h2 className={styles.sectionTitle}>対応アプリケーション</h2>
          <p className={styles.sectionSubtitle}>
            日常的に使うプロフェッショナルツールのショートカットを網羅
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
          <h2 className={styles.sectionTitle}>得られるメリット</h2>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <div className={styles.benefitNumber}>01</div>
              <h3 className={styles.benefitTitle}>生産性の劇的な向上</h3>
              <p className={styles.benefitDescription}>
                マウス操作からキーボード操作へ移行することで、作業速度が平均30-50%向上します。
              </p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitNumber}>02</div>
              <h3 className={styles.benefitTitle}>フロー状態の維持</h3>
              <p className={styles.benefitDescription}>
                マウスとキーボードの切り替えによる集中力の途切れを防ぎ、深い集中状態を保てます。
              </p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitNumber}>03</div>
              <h3 className={styles.benefitTitle}>プロフェッショナルなスキル</h3>
              <p className={styles.benefitDescription}>
                ショートカットを使いこなす姿は、周囲から見ても圧倒的にプロフェッショナルです。
              </p>
            </div>
            <div className={styles.benefitCard}>
              <div className={styles.benefitNumber}>04</div>
              <h3 className={styles.benefitTitle}>身体的な負担軽減</h3>
              <p className={styles.benefitDescription}>
                マウス操作の減少により、肩や手首への負担が軽減され、長時間の作業も快適になります。
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className={styles.howItWorksSection}>
          <h2 className={styles.sectionTitle}>使い方はシンプル</h2>
          <div className={styles.stepsGrid}>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>STEP 1</div>
              <h3 className={styles.stepTitle}>アプリを選択</h3>
              <p className={styles.stepDescription}>学習したいアプリケーションとレベルを選びます</p>
            </div>
            <div className={styles.stepArrow}>→</div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>STEP 2</div>
              <h3 className={styles.stepTitle}>キーを押す</h3>
              <p className={styles.stepDescription}>実際にキーボードでショートカットを入力します</p>
            </div>
            <div className={styles.stepArrow}>→</div>
            <div className={styles.stepCard}>
              <div className={styles.stepNumber}>STEP 3</div>
              <h3 className={styles.stepTitle}>即座にフィードバック</h3>
              <p className={styles.stepDescription}>正解・不正解が瞬時に表示され、理解が深まります</p>
            </div>
          </div>
        </section>

        {/* Release Notes Section */}
        <section className={styles.releaseNotesSection}>
          <h2 className={styles.sectionTitle}>最新アップデート</h2>
          <p className={styles.sectionSubtitle}>
            Keyboard Visualizerの最新機能と改善履歴
          </p>
          <div className={styles.releaseNotesCard}>
            <div className={styles.releaseNotesHeader}>
              <span className={styles.releaseVersion}>v2.1.1</span>
              <span className={styles.releaseDate}>2026-02-11</span>
            </div>
            <h3 className={styles.releaseNotesTitle}>Performance Optimization & Smooth Experience</h3>
            <ul className={styles.releaseNotesList}>
              <li>🚀 レンダリングパフォーマンスを最適化し、スクロールをスムーズに</li>
              <li>🔋 低スペックデバイス向けのアダプティブ・パフォーマンス機能をLPに適用</li>
              <li>🖼️ 画像の遅延読み込みとサイズ指定でレイアウトシフト（CLS）を防止</li>
            </ul>
            <Link to="/release-notes" className={styles.releaseNotesLink}>
              すべてのリリースノートを見る →
            </Link>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className={styles.finalCtaSection}>
          <h2 className={styles.finalCtaTitle}>今すぐ始めて、生産性を最大化しましょう</h2>
          <p className={styles.finalCtaDescription}>
            完全無料・登録不要で、すぐに使い始められます
          </p>
          <Link to="/app" className={styles.finalCtaButton}>
            無料で今すぐはじめる
            <svg className={styles.ctaIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </section>

        <footer className={styles.footer}>
          <p>&copy; {new Date().getFullYear()} Keyboard Visualizer. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;

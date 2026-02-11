import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';

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

  useEffect(() => {
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

    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => {
    const canvas = document.getElementById('particleCanvas') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas size setup with device pixel ratio for crisp rendering
    const setCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.scale(dpr, dpr);

      // Update CSS size
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Particle system
    const particles: Particle[] = [];
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 40 : 80;
    const connectionDistance = isMobile ? 100 : 150;

    // Create particles (use CSS size, not canvas internal size)
    const initParticles = () => {
      particles.length = 0;
      const rect = canvas.getBoundingClientRect();
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
        });
      }
    };
    initParticles();

    // Animation loop
    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Update and draw particles
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges (use CSS size)
        if (particle.x < 0 || particle.x > rect.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > rect.height) particle.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const opacity = (1 - distance / connectionDistance) * 0.5;
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  return (
    <div className={styles.landingWrapper}>
      <main className={styles.landingContainer}>
        <section className={`${styles.heroSection} ${styles.isVisible}`}>
          <div className={styles.badge}>NEW VERSION 2.0</div>
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
        <canvas className={styles.particleCanvas} id="particleCanvas"></canvas>

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
                <img src={`${import.meta.env.BASE_URL}icons/visualizer.svg`} alt="Visualizer" className={styles.featureIcon} />
              </div>
              <h3>Visual Feedback</h3>
              <p>入力したすべてのキーが美しく可視化されます。システムの挙動を直感的に理解しましょう。</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.iconWrapper}>
                <img src={`${import.meta.env.BASE_URL}icons/quiz.svg`} alt="Quiz" className={styles.featureIcon} />
              </div>
              <h3>Active Learning</h3>
              <p>クイズ形式の反復練習により、記憶に定着。苦手な操作も自然と体が覚えます。</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.iconWrapper}>
                <img src={`${import.meta.env.BASE_URL}icons/allrange.svg`} alt="Apps" className={styles.featureIcon} />
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
            <div className={styles.appCard}>
              <img src={`${import.meta.env.BASE_URL}icons/windows.svg`} alt="Windows 11" className={styles.appIcon} />
              <div className={styles.appName}>Windows 11</div>
            </div>
            <div className={styles.appCard}>
              <img src={`${import.meta.env.BASE_URL}icons/macos.svg`} alt="macOS" className={styles.appIcon} />
              <div className={styles.appName}>macOS</div>
            </div>
            <div className={styles.appCard}>
              <img src={`${import.meta.env.BASE_URL}icons/chrome.svg`} alt="Chrome" className={styles.appIcon} />
              <div className={styles.appName}>Chrome</div>
            </div>
            <div className={styles.appCard}>
              <img src={`${import.meta.env.BASE_URL}icons/vscode.svg`} alt="VS Code" className={styles.appIcon} />
              <div className={styles.appName}>VS Code</div>
            </div>
            <div className={styles.appCard}>
              <img src={`${import.meta.env.BASE_URL}icons/excel.svg`} alt="Excel" className={styles.appIcon} />
              <div className={styles.appName}>Excel</div>
            </div>
            <div className={styles.appCard}>
              <img src={`${import.meta.env.BASE_URL}icons/word.svg`} alt="Word" className={styles.appIcon} />
              <div className={styles.appName}>Word</div>
            </div>
            <div className={styles.appCard}>
              <img src={`${import.meta.env.BASE_URL}icons/powerpoint.svg`} alt="PowerPoint" className={styles.appIcon} />
              <div className={styles.appName}>PowerPoint</div>
            </div>
            <div className={styles.appCard}>
              <img src={`${import.meta.env.BASE_URL}icons/slack.svg`} alt="Slack" className={styles.appIcon} />
              <div className={styles.appName}>Slack</div>
            </div>
            <div className={styles.appCard}>
              <img src={`${import.meta.env.BASE_URL}icons/gmail.svg`} alt="Gmail" className={styles.appIcon} />
              <div className={styles.appName}>Gmail</div>
            </div>
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
              <span className={styles.releaseVersion}>v2.1.0</span>
              <span className={styles.releaseDate}>2026-02-11</span>
            </div>
            <h3 className={styles.releaseNotesTitle}>Tailwind CSS v4 & Landing Page Improvements</h3>
            <ul className={styles.releaseNotesList}>
              <li>✨ Tailwind CSS v4への移行で最新のスタイリング技術を採用</li>
              <li>🚀 アプリケーションロゴの視認性を改善</li>
              <li>🎯 スムーススクロールでページ操作性を向上</li>
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

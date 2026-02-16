import React, { useEffect, useRef } from 'react';
import styles from './LandingPage.module.css';
import { useAdaptivePerformance } from '../hooks';
import { TIMINGS } from '../constants/timings';

// Components
import ParticleCanvas from '../components/LandingPage/ParticleCanvas';
import LandingHeader from '../components/LandingPage/LandingHeader';
import HeroSection from '../components/LandingPage/HeroSection';
import StatsSection from '../components/LandingPage/StatsSection';
import FeaturesSection from '../components/LandingPage/FeaturesSection';
import AppsSection from '../components/LandingPage/AppsSection';
import BenefitsSection from '../components/LandingPage/BenefitsSection';
import HowItWorksSection from '../components/LandingPage/HowItWorksSection';
import TargetSection from '../components/LandingPage/TargetSection';
import FaqSection from '../components/LandingPage/FaqSection';
import ReleaseNotesSection from '../components/LandingPage/ReleaseNotesSection';
import FinalCtaSection from '../components/LandingPage/FinalCtaSection';
import Footer from '../components/LandingPage/Footer';

const LandingPage: React.FC = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const { performanceStyles } = useAdaptivePerformance();

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
    }, { threshold: TIMINGS.INTERSECTION_THRESHOLD });

    // Wait for components to mount before observing
    setTimeout(() => {
      const sections = document.querySelectorAll('section');
      sections.forEach(section => observerRef.current?.observe(section));
    }, TIMINGS.ANIMATION_DELAY_MS);

    return () => {
      // Restore original body styles
      document.body.style.padding = originalPadding;
      document.body.style.background = originalBackground;
      observerRef.current?.disconnect();
    };
  }, []);

  return (
    <div className={styles.landingWrapper} style={performanceStyles}>
      <ParticleCanvas />
      
      <LandingHeader />

      <main className={styles.landingContainer}>
        <HeroSection />
        <ReleaseNotesSection />
        <StatsSection />
        <FeaturesSection />
        <TargetSection />
        <AppsSection />
        <BenefitsSection />
        <HowItWorksSection />
        <FaqSection />
        <FinalCtaSection />
        <Footer />
      </main>
    </div>
  );
};

export default LandingPage;

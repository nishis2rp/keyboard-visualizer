import React, { useEffect, useRef } from 'react';
import styles from './LandingPage.module.css';
import { useAdaptivePerformance } from '../hooks';
import { TIMINGS } from '../constants/timings';
import { useUI } from '../context';

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
import TestimonialsSection from '../components/LandingPage/TestimonialsSection';
import FaqSection from '../components/LandingPage/FaqSection';
import ReleaseNotesSection from '../components/LandingPage/ReleaseNotesSection';
import FinalCtaSection from '../components/LandingPage/FinalCtaSection';
import Footer from '../components/LandingPage/Footer';
import FAQStructuredData from '../components/common/FAQStructuredData';

const LandingPage: React.FC = () => {
  const { performanceStyles } = useAdaptivePerformance();
  const { setShowLandingVisualizer } = useUI();

  useEffect(() => {
    // Ensure visualizer is shown on mount
    setShowLandingVisualizer(true);

    // Remove body padding for landing page (add it back on cleanup)
    const originalPadding = document.body.style.padding;
    const originalBackground = document.body.style.background;
    document.body.style.padding = '0';
    document.body.style.background = '#050505';

    return () => {
      // Restore original body styles
      document.body.style.padding = originalPadding;
      document.body.style.background = originalBackground;
    };
  }, [setShowLandingVisualizer]);

  return (
    <div className={styles.landingWrapper} style={performanceStyles}>
      <FAQStructuredData />
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
        <TestimonialsSection />
        <FaqSection />
        <FinalCtaSection />
        <Footer />
      </main>
    </div>
  );
};

export default LandingPage;

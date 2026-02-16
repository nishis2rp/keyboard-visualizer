import React, { ReactNode } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from '../../pages/LandingPage.module.css';

interface LandingSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

const LandingSection: React.FC<LandingSectionProps> = ({ children, className = '', id }) => {
  const { elementRef, isVisible } = useScrollReveal();

  return (
    <section
      ref={elementRef as React.RefObject<HTMLElement>}
      id={id}
      className={`${className} ${isVisible ? styles.isVisible : ''}`}
    >
      {children}
    </section>
  );
};

export default LandingSection;

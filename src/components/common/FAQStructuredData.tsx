import { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

/**
 * FAQPage structured data component
 * Adds JSON-LD schema for FAQ section to improve SEO
 */
const FAQStructuredData: React.FC = () => {
  const { language, t } = useLanguage();

  useEffect(() => {
    // Remove existing FAQ structured data if present
    const existingScript = document.querySelector('script[data-schema="faq"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Create FAQ structured data from translations
    const faqData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": t.landing.faqs.map((faq) => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
      }))
    };

    // Create and append script tag
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema', 'faq');
    script.textContent = JSON.stringify(faqData, null, 2);
    document.head.appendChild(script);

    // Cleanup on unmount
    return () => {
      const scriptToRemove = document.querySelector('script[data-schema="faq"]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [language, t.landing.faqs]);

  return null;
};

export default FAQStructuredData;

import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, keywords }) => {
  const { language, t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    // Update HTML lang attribute
    document.documentElement.lang = language;

    // Build title
    const baseTitle = 'Keyboard Visualizer';
    const localizedTitle = language === 'ja' 
      ? 'キーボードビジュアライザー' 
      : 'Keyboard Visualizer';
    
    const pageTitle = title || t.landing.title;
    document.title = `${pageTitle} | ${localizedTitle}`;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description || t.landing.description);
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      const defaultKeywords = language === 'ja'
        ? 'キーボード, ショートカット, 可視化, 学習, クイズ'
        : 'keyboard, shortcuts, visualizer, learning, quiz';
      metaKeywords.setAttribute('content', keywords || defaultKeywords);
    }

    // Update OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', pageTitle);
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description || t.landing.description);
    }

    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) {
      ogLocale.setAttribute('content', language === 'ja' ? 'ja_JP' : 'en_US');
    }

  }, [language, location.pathname, title, description, keywords, t]);

  return null;
};

export default SEO;

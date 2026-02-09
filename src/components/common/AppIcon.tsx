import React from 'react';

interface AppIconProps {
  appId: string;
  size?: number;
  className?: string;
  fallbackIcon?: string;
}

/**
 * アプリケーションごとのモダンなSVGアイコンを表示するコンポーネント
 */
export const AppIcon: React.FC<AppIconProps> = ({ appId, size = 24, className = '', fallbackIcon }) => {
  const iconStyle = {
    width: size,
    height: size,
    display: 'inline-block',
    verticalAlign: 'middle',
  };

  // アプリケーションIDに基づいたSVGアイコンの定義
  const renderIcon = () => {
    switch (appId) {
      case 'windows11':
        return (
          <svg viewBox="0 0 24 24" style={iconStyle} className={className} fill="currentColor">
            <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.549h-13.051zM0 12.75h9.75v9.451L0 20.851m10.949-8.101H24V24l-13.051-1.849z" />
          </svg>
        );
      case 'macos':
      case 'mac-jis':
      case 'mac-us':
        return (
          <svg viewBox="0 0 24 24" style={iconStyle} className={className} fill="currentColor">
            <path d="M17.057 12.763c.067 2.104 1.812 2.865 1.857 2.887-.028.093-.299.99-.927 2.041-.538.885-1.095 1.765-2.015 1.783-.903.015-1.196-.58-2.228-.58-1.03 0-1.353.564-2.21.581-.856.017-1.49-.945-2.033-1.827-1.106-1.794-1.953-5.072-.814-6.703.566-.81 1.391-1.324 2.29-1.34.856-.015 1.657.63 2.18.63.522 0 1.54-.787 2.598-.675.44.019 1.677.19 2.474 1.442-.066.04-.1.06-.1.06zM12.022 1.66c-.456.556-.763 1.33-.675 2.102.77.06 1.544-.42 2.001-.976.456-.556.763-1.33.675-2.102-.77-.06-1.544.42-2.001.976z" />
          </svg>
        );
      case 'chrome':
        return (
          <svg viewBox="0 0 24 24" style={iconStyle} className={className} fill="currentColor">
            <path d="M12 0C8.21 0 4.83 1.7 2.5 4.33L5.55 9.54C6.45 6.46 9.32 4.2 12.68 4.2H21.06C19.14 1.66 16.07 0 12 0ZM12 15.78C10.19 15.78 8.22 13.81 8.22 11.41V12H4.22C4.22 16.42 7.71 20 12.13 20C13.43 20 14.63 19.65 15.67 19.04L19.82 26.15C18.09 26.81 16.22 27.17 14.27 27.17C8.35 27.17 3.31 23.13 1.8 17.63L4.85 12.42C5.75 15.5 8.62 17.76 11.98 17.76H20.36C18.44 20.3 15.37 21.96 11.3 21.96H12V15.78ZM12 8.22C14.1 8.22 15.78 10.19 15.78 12.29C15.78 14.39 14.1 16.36 12 16.36C9.9 16.36 8.22 14.39 8.22 12.29C8.22 10.19 9.9 8.22 12 8.22Z" />
            <path d="M12 18.5c3.59 0 6.5-2.91 6.5-6.5s-2.91-6.5-6.5-6.5-6.5 2.91-6.5 6.5 2.91 6.5 6.5 6.5z" opacity="0.2" />
          </svg>
        );
      case 'excel':
        return (
          <svg viewBox="0 0 24 24" style={iconStyle} className={className} fill="currentColor">
            <path d="M16.2 0H7.8C6.8 0 6 0.8 6 1.8V4.2H1.8C0.8 4.2 0 5 0 6V18C0 19 0.8 19.8 1.8 19.8H6V22.2C6 23.2 6.8 24 7.8 24H16.2C17.2 24 18 23.2 18 22.2V19.8H22.2C23.2 19.8 24 19 24 18V6C24 5 23.2 4.2 22.2 4.2H18V1.8C18 0.8 17.2 0 16.2 0ZM11.4 16.8L9 12L6.6 16.8H4.2L7.8 10.2L4.5 4.8H6.9L9 8.7L11.1 4.8H13.5L10.2 10.2L13.8 16.8H11.4Z" />
          </svg>
        );
      case 'word':
        return (
          <svg viewBox="0 0 24 24" style={iconStyle} className={className} fill="currentColor">
            <path d="M16.2 0H7.8C6.8 0 6 0.8 6 1.8V4.2H1.8C0.8 4.2 0 5 0 6V18C0 19 0.8 19.8 1.8 19.8H6V22.2C6 23.2 6.8 24 7.8 24H16.2C17.2 24 18 23.2 18 22.2V19.8H22.2C23.2 19.8 24 19 24 18V6C24 5 23.2 4.2 22.2 4.2H18V1.8C18 0.8 17.2 0 16.2 0ZM13.8 16.8L12 9.6L10.2 16.8H7.8L5.4 4.8H7.8L9.3 12.6L11.1 5.4H12.9L14.7 12.6L16.2 4.8H18.6L16.2 16.8H13.8Z" />
          </svg>
        );
      case 'powerpoint':
        return (
          <svg viewBox="0 0 24 24" style={iconStyle} className={className} fill="currentColor">
            <path d="M16.2 0H7.8C6.8 0 6 0.8 6 1.8V4.2H1.8C0.8 4.2 0 5 0 6V18C0 19 0.8 19.8 1.8 19.8H6V22.2C6 23.2 6.8 24 7.8 24H16.2C17.2 24 18 23.2 18 22.2V19.8H22.2C23.2 19.8 24 19 24 18V6C24 5 23.2 4.2 22.2 4.2H18V1.8C18 0.8 17.2 0 16.2 0ZM9 16.8V7.2H12.6C14.1 7.2 15.3 8.4 15.3 9.9C15.3 11.4 14.1 12.6 12.6 12.6H10.8V16.8H9ZM10.8 10.8H12.6C13.1 10.8 13.5 10.4 13.5 9.9C13.5 9.4 13.1 9 12.6 9H10.8V10.8Z" />
          </svg>
        );
      case 'slack':
        return (
          <svg viewBox="0 0 24 24" style={iconStyle} className={className} fill="currentColor">
            <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.528 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.528 0 0 1 2.521-2.52 2.527 2.528 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52h-2.521zM8.834 6.313a2.527 2.528 0 0 1 2.521 2.521 2.527 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.958 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.527 2.528 0 0 1-2.52 2.521h-2.522v-2.521zM17.687 8.834a2.527 2.528 0 0 1-2.521 2.521 2.527 2.528 0 0 1-2.521-2.521V2.522A2.528 2.528 0 0 1 15.166 0a2.528 2.528 0 0 1 2.521 2.522v6.312zM15.166 18.958a2.528 2.528 0 0 1 2.521 2.522A2.528 2.528 0 0 1 15.166 24a2.528 2.528 0 0 1-2.521-2.522v-2.52h2.521zM15.166 17.687a2.527 2.528 0 0 1-2.521-2.521 2.527 2.528 0 0 1 2.521-2.521h6.312A2.528 2.528 0 0 1 24 15.166a2.528 2.528 0 0 1-2.522 2.521h-6.312z" />
          </svg>
        );
      case 'gmail':
        return (
          <svg viewBox="0 0 24 24" style={iconStyle} className={className} fill="currentColor">
            <path d="M24 4.5v15c0 .85-.65 1.5-1.5 1.5H21V7.38l-9 6.75-9-6.75V21H1.5C.65 21 0 20.35 0 19.5v-15c0-.4.15-.75.45-1.05.3-.3.65-.45 1.05-.45H3l9 6.75 9-6.75h1.5c.4 0 .75.15 1.05.45.3.3.45.65.45 1.05z" />
          </svg>
        );
      case 'vscode':
        return (
          <svg viewBox="0 0 24 24" style={iconStyle} className={className} fill="currentColor">
            <path d="M18.15 2.58l-5.53-2.58L11.56.75l-5.81 4.75L2.86 6.53l-2.06.58V16.9l2.06.58 2.89 1.03 5.81 4.75 1.06.75 5.53-2.58.85-.33V2.91l-.85-.33zM17.45 18.87l-4.96-3.3 4.96-3.3v6.6zM3.12 11.32l1.96-1.45 1.96 1.45-1.96 1.45-1.96-1.45z" />
          </svg>
        );
      case 'terminal':
        return (
          <svg viewBox="0 0 24 24" style={iconStyle} className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 17 10 11 4 5" />
            <line x1="12" y1="19" x2="20" y2="19" />
          </svg>
        );
      case 'xcode':
        return (
          <svg viewBox="0 0 24 24" style={iconStyle} className={className} fill="currentColor">
            <path d="M23.5 15.5l-3-3 3-3-1.5-1.5-3 3-3-3-1.5 1.5 3 3-3 3 1.5 1.5 3-3 3 3zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          </svg>
        );
      case 'random':
      case 'allrange':
        return (
          <svg viewBox="0 0 24 24" style={iconStyle} className={className} fill="currentColor">
            <rect x="2" y="2" width="20" height="20" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="7" cy="7" r="1.5" />
            <circle cx="17" cy="17" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="17" cy="7" r="1.5" />
            <circle cx="7" cy="17" r="1.5" />
          </svg>
        );
      case 'fullscreen':
        return (
          <svg viewBox="0 0 24 24" style={iconStyle} className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="2" />
            <rect x="6" y="6" width="12" height="12" rx="1" fill="currentColor" opacity="0.2" />
          </svg>
        );
      case 'windowed':
        return (
          <svg viewBox="0 0 24 24" style={iconStyle} className={className} fill="currentColor">
            <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.549h-13.051zM0 12.75h9.75v9.451L0 20.851m10.949-8.101H24V24l-13.051-1.849z" />
          </svg>
        );
      case 'windows-jis':
        return (
          <svg viewBox="0 0 24 24" style={iconStyle} className={className} fill="currentColor">
            <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.549h-13.051zM0 12.75h9.75v9.451L0 20.851m10.949-8.101H24V24l-13.051-1.849z" />
          </svg>
        );
      case 'mac-jis':
        return (
          <svg viewBox="0 0 24 24" style={iconStyle} className={className} fill="currentColor">
            <path d="M17.057 12.763c.067 2.104 1.812 2.865 1.857 2.887-.028.093-.299.99-.927 2.041-.538.885-1.095 1.765-2.015 1.783-.903.015-1.196-.58-2.228-.58-1.03 0-1.353.564-2.21.581-.856.017-1.49-.945-2.033-1.827-1.106-1.794-1.953-5.072-.814-6.703.566-.81 1.391-1.324 2.29-1.34.856-.015 1.657.63 2.18.63.522 0 1.54-.787 2.598-.675.44.019 1.677.19 2.474 1.442-.066.04-.1.06-.1.06zM12.022 1.66c-.456.556-.763 1.33-.675 2.102.77.06 1.544-.42 2.001-.976.456-.556.763-1.33.675-2.102-.77-.06-1.544.42-2.001.976z" />
          </svg>
        );
      case 'mac-us':
        return (
          <svg viewBox="0 0 24 24" style={iconStyle} className={className} fill="currentColor">
            <path d="M17.057 12.763c.067 2.104 1.812 2.865 1.857 2.887-.028.093-.299.99-.927 2.041-.538.885-1.095 1.765-2.015 1.783-.903.015-1.196-.58-2.228-.58-1.03 0-1.353.564-2.21.581-.856.017-1.49-.945-2.033-1.827-1.106-1.794-1.953-5.072-.814-6.703.566-.81 1.391-1.324 2.29-1.34.856-.015 1.657.63 2.18.63.522 0 1.54-.787 2.598-.675.44.019 1.677.19 2.474 1.442-.066.04-.1.06-.1.06zM12.022 1.66c-.456.556-.763 1.33-.675 2.102.77.06 1.544-.42 2.001-.976.456-.556.763-1.33.675-2.102-.77-.06-1.544.42-2.001.976z" />
          </svg>
        );
      case 'visualizer':
        return (
          <svg viewBox="0 0 24 24" style={iconStyle} className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M6 8h.01M10 8h.01M14 8h.01" strokeWidth="3" />
            <path d="M6 12h12" />
            <path d="M8 16h8" />
          </svg>
        );
      case 'quiz':
        return (
          <svg viewBox="0 0 24 24" style={iconStyle} className={className} fill="currentColor">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2 L14 8 L12 12 L10 8 Z" />
            <path d="M22 12 L16 14 L12 12 L16 10 Z" />
            <path d="M12 22 L10 16 L12 12 L14 16 Z" />
            <path d="M2 12 L8 10 L12 12 L8 14 Z" />
          </svg>
        );
      case 'basic':
        return (
          <svg viewBox="0 0 24 24" style={iconStyle} className={className} fill="currentColor">
            <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z" />
          </svg>
        );
      case 'standard':
        return (
          <svg viewBox="0 0 24 24" style={iconStyle} className={className} fill="currentColor">
            <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
          </svg>
        );
      case 'hard':
        return (
          <svg viewBox="0 0 24 24" style={iconStyle} className={className} fill="currentColor">
            <path d="M12 2c-1.5 0-2.7 1.2-2.7 2.7 0 .8.3 1.5.8 2L6.5 10c-.5-.2-1.1-.3-1.7-.3C3.2 9.7 2 10.9 2 12.5S3.2 15.3 4.8 15.3c.6 0 1.2-.1 1.7-.4l3.6 3.3c-.5.5-.8 1.2-.8 2 0 1.5 1.2 2.7 2.7 2.7s2.7-1.2 2.7-2.7c0-.8-.3-1.5-.8-2l3.6-3.3c.5.2 1.1.4 1.7.4 1.6 0 2.8-1.2 2.8-2.8S20.8 9.7 19.2 9.7c-.6 0-1.2.1-1.7.3l-3.6-3.3c.5-.5.8-1.2.8-2C14.7 3.2 13.5 2 12 2z" />
          </svg>
        );
      case 'madmax':
        return (
          <svg viewBox="0 0 24 24" style={iconStyle} className={className} fill="currentColor">
            <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm8 7c-.8 0-1.6.3-2.2.9l-1.9-1.9c.1-.3.1-.7.1-1 0-1.7-1.3-3-3-3s-3 1.3-3 3c0 .3 0 .7.1 1L8.2 9.9C7.6 9.3 6.8 9 6 9c-2.2 0-4 1.8-4 4s1.8 4 4 4c.8 0 1.6-.3 2.2-.9l1.9 1.9c-.1.3-.1.7-.1 1 0 1.7 1.3 3 3 3s3-1.3 3-3c0-.3 0-.7-.1-1l1.9-1.9c.6.6 1.4.9 2.2.9 2.2 0 4-1.8 4-4s-1.8-4-4-4zm0 6c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zM6 15c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" />
          </svg>
        );
      default:
        return <span>{fallbackIcon || '❓'}</span>;
    }
  };

  return renderIcon();
};

export default AppIcon;

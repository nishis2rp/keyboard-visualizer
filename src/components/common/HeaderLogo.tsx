import React from 'react';

interface HeaderLogoProps {
  size?: number;
  className?: string;
}

/**
 * アプリケーションのメインロゴコンポーネント
 * キーキャップとビジュアライザー（波形）を融合させたデザイン
 */
export const HeaderLogo: React.FC<HeaderLogoProps> = ({ size = 48, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logo_base_grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#A78BFA" />
        </linearGradient>
        <filter id="logo_shadow" x="-4" y="0" width="108" height="108" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#6366F1" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Main Container (Keycap shape) */}
      <g filter="url(#logo_shadow)">
        <rect
          x="10"
          y="10"
          width="80"
          height="80"
          rx="20"
          fill="url(#logo_base_grad)"
        />
        {/* Top Highlight for 3D effect */}
        <path
          d="M12 30C12 19.5 19.5 12 30 12H70C80.5 12 88 19.5 88 30V32C88 21.5 80.5 14 70 14H30C19.5 14 12 21.5 12 32V30Z"
          fill="white"
          fillOpacity="0.2"
        />
      </g>

      {/* Visualizer Bars */}
      <g transform="translate(50, 50)">
        {/* Left Bar */}
        <rect
          x="-20"
          y="-10"
          width="8"
          height="20"
          rx="4"
          fill="white"
          className="logo-bar-1"
        >
          <animate attributeName="height" values="20;30;20" dur="2s" repeatCount="indefinite" />
          <animate attributeName="y" values="-10;-15;-10" dur="2s" repeatCount="indefinite" />
        </rect>
        
        {/* Center Bar (Tallest) */}
        <rect
          x="-4"
          y="-20"
          width="8"
          height="40"
          rx="4"
          fill="white"
          className="logo-bar-2"
        >
          <animate attributeName="height" values="40;24;40" dur="2s" repeatCount="indefinite" begin="0.3s" />
          <animate attributeName="y" values="-20;-12;-20" dur="2s" repeatCount="indefinite" begin="0.3s" />
        </rect>

        {/* Right Bar */}
        <rect
          x="12"
          y="-14"
          width="8"
          height="28"
          rx="4"
          fill="white"
          className="logo-bar-3"
        >
          <animate attributeName="height" values="28;16;28" dur="2s" repeatCount="indefinite" begin="0.6s" />
          <animate attributeName="y" values="-14;-8;-14" dur="2s" repeatCount="indefinite" begin="0.6s" />
        </rect>
      </g>
    </svg>
  );
};

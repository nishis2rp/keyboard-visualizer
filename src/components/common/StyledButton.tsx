import { useState, CSSProperties } from 'react';

interface StyledButtonProps {
  onClick: () => void;
  backgroundColor?: string;
  hoverBackgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  padding?: string;
  fontSize?: string;
  fontWeight?: string | number;
  children: React.ReactNode;
  title?: string;
  variant?: 'shadow' | 'color' | 'success' | 'primary' | 'secondary' | 'danger' | 'info';
}

export const StyledButton = ({
  onClick,
  backgroundColor,
  hoverBackgroundColor,
  borderColor,
  textColor,
  padding = '10px 20px',
  fontSize = '14px',
  fontWeight = '600',
  children,
  title,
  variant = 'shadow',
}: StyledButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // variantに応じたデフォルトの背景色とホバー色を定義
  const defaultColors = {
    success: { bg: '#10b981', hoverBg: '#059669' }, // Tailwind green-600, green-700
    primary: { bg: '#4a5568', hoverBg: '#2d3748' }, // Gray-600, gray-700
    info:    { bg: '#4a5568', hoverBg: '#2d3748' }, // Gray-600, gray-700
    secondary: { bg: '#6b7280', hoverBg: '#4b5563' }, // Tailwind gray-500, gray-600
    danger:  { bg: '#ef4444', hoverBg: '#dc2626' }, // Tailwind red-500, red-600
    // 'color' variantはbackgroundColor/hoverBackgroundColorを直接使用
  };

  const effectiveBackgroundColor = backgroundColor || (variant !== 'shadow' && variant !== 'color' ? defaultColors[variant]?.bg : undefined) || '#000000'; // Fallback to black if no color is specified
  const effectiveHoverBackgroundColor = hoverBackgroundColor || (variant !== 'shadow' && variant !== 'color' ? defaultColors[variant]?.hoverBg : undefined) || effectiveBackgroundColor;


  const buttonStyle: CSSProperties = {
    padding,
    fontSize,
    fontWeight,
    borderRadius: '12px',
    border: borderColor ? `1px solid ${borderColor}` : '1px solid rgba(255, 255, 255, 0.4)',
    background: isHovered
      ? 'linear-gradient(135deg, rgba(74, 85, 104, 0.95) 0%, rgba(45, 55, 72, 0.95) 100%)'
      : backgroundColor || 'linear-gradient(135deg, rgba(74, 85, 104, 0.9) 0%, rgba(45, 55, 72, 0.9) 100%)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    color: textColor || '#FFFFFF',
    cursor: 'pointer',
    boxShadow: isHovered
      ? '0 8px 16px rgba(45, 55, 72, 0.3), 0 4px 8px rgba(45, 55, 72, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
      : '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
    transform: isHovered ? 'translateY(-3px) scale(1.02)' : 'translateY(0)',
    transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={buttonStyle}
      title={title}
    >
      {children}
    </button>
  );
};

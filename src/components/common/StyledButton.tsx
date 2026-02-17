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
    padding: padding || '8px 16px',
    fontSize,
    fontWeight,
    borderRadius: '10px',
    border: borderColor ? `1px solid ${borderColor}` : 'none',
    background: backgroundColor || '#2d3748',
    color: textColor || '#FFFFFF',
    cursor: 'pointer',
    boxShadow: isHovered
      ? '0 4px 12px rgba(45, 55, 72, 0.15), 0 2px 6px rgba(45, 55, 72, 0.1)'
      : '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
    transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
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

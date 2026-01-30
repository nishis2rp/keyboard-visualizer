import { useState, CSSProperties } from 'react';

interface StyledButtonProps {
  onClick: () => void;
  backgroundColor: string;
  hoverBackgroundColor?: string;
  borderColor?: string;
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
  padding = '12px 24px',
  fontSize = '15px',
  fontWeight = '600',
  children,
  title,
  variant = 'shadow',
}: StyledButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // variantに応じたデフォルトの背景色とホバー色を定義
  const defaultColors = {
    success: { bg: '#10b981', hoverBg: '#059669' }, // Tailwind green-600, green-700
    primary: { bg: '#3b82f6', hoverBg: '#2563eb' }, // Tailwind blue-500, blue-600
    info:    { bg: '#0ea5e9', hoverBg: '#0284c7' }, // Tailwind sky-500, sky-600
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
    borderRadius: variant === 'color' ? '8px' : '12px',
    border: variant === 'color' ? 'none' : `1px solid ${borderColor || effectiveBackgroundColor}`,
    background: isHovered ? effectiveHoverBackgroundColor : effectiveBackgroundColor,
    color: '#FFFFFF',
    cursor: 'pointer',
    boxShadow: variant === 'shadow'
      ? (isHovered ? '0 4px 12px rgba(0, 0, 0, 0.16)' : '0 2px 8px rgba(0, 0, 0, 0.12)')
      : undefined,
    transform: variant === 'shadow' && isHovered ? 'translateY(-1px)' : 'translateY(0)',
    transition: variant === 'color' ? 'all 0.3s ease' : 'all 0.2s ease',
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

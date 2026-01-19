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
  variant?: 'shadow' | 'color';
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

  const buttonStyle: CSSProperties = {
    padding,
    fontSize,
    fontWeight,
    borderRadius: variant === 'color' ? '8px' : '12px',
    border: variant === 'color' ? 'none' : `1px solid ${borderColor || backgroundColor}`,
    background: isHovered && hoverBackgroundColor ? hoverBackgroundColor : backgroundColor,
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

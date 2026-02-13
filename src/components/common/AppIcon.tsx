import React from 'react';
import { ICON_MAPPING } from '../../constants/icons';

interface AppIconProps {
  appId: string;
  size?: number;
  className?: string;
  fallbackIcon?: string;
}

/**
 * 外部SVGファイルを参照して表示するコンポーネント
 * mask-imageを使用してcurrentColorによる色変更を可能にしています
 */
export const AppIcon: React.FC<AppIconProps> = ({ appId, size = 24, className = '', fallbackIcon }) => {
  // アプリケーションIDとファイル名のマッピング
  const filename = ICON_MAPPING[appId] || null;

  if (!filename) {
    return <span>{fallbackIcon || '❓'}</span>;
  }

  // Viteのベースパスを考慮したパスを生成
  const iconPath = `${import.meta.env.BASE_URL}icons/${filename}`;

  // mask-imageを使用してcurrentColorを適用するためのスタイル
  // これにより外部SVGでもCSSのcolorプロパティで色を変えることができます
  const maskStyle: React.CSSProperties = {
    width: size,
    height: size,
    backgroundColor: 'currentColor',
    WebkitMaskImage: `url(${iconPath})`,
    maskImage: `url(${iconPath})`,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
    display: 'inline-block',
    verticalAlign: 'middle',
  };

  return (
    <div 
      style={maskStyle} 
      className={className} 
      role="img" 
      aria-label={`${appId} icon`}
    />
  );
};

export default AppIcon;

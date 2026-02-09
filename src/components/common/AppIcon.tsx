import React from 'react';

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
  const getIconFilename = (id: string): string | null => {
    switch (id) {
      case 'windows11':
      case 'windowed':
      case 'windows-jis':
        return 'windows.svg';
      case 'macos':
      case 'mac-jis':
      case 'mac-us':
        return 'macos.svg';
      case 'chrome':
        return 'chrome.svg';
      case 'excel':
        return 'excel.svg';
      case 'word':
        return 'word.svg';
      case 'powerpoint':
        return 'powerpoint.svg';
      case 'slack':
        return 'slack.svg';
      case 'gmail':
        return 'gmail.svg';
      case 'vscode':
        return 'vscode.svg';
      case 'terminal':
        return 'terminal.svg';
      case 'xcode':
        return 'xcode.svg';
      case 'random':
      case 'allrange':
        return 'allrange.svg';
      case 'fullscreen':
        return 'fullscreen.svg';
      case 'visualizer':
        return 'visualizer.svg';
      case 'quiz':
        return 'quiz.svg';
      case 'basic':
        return 'basic.svg';
      case 'standard':
        return 'standard.svg';
      case 'hard':
        return 'hard.svg';
      case 'madmax':
        return 'madmax.svg';
      default:
        return null;
    }
  };

  const filename = getIconFilename(appId);

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

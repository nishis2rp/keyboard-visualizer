import React from 'react';
import { SetupOption as SetupOptionType } from '../../types';
import { AppIcon } from '../common/AppIcon';

interface SetupOptionProps {
  option: SetupOptionType;
  isSelected: boolean;
  onSelect: (option: any) => void;
  className?: string;
  showRecommendation?: boolean;
  recommendationText?: string;
}

const SetupOption: React.FC<SetupOptionProps> = ({
  option,
  isSelected,
  onSelect,
  className = '',
  showRecommendation = false,
  recommendationText
}) => {
  return (
    <div
      className={`setup-option ${isSelected ? 'selected' : ''} ${className}`}
      onClick={() => onSelect(option)}
    >
      <div className="option-icon">
        <AppIcon appId={option.id} fallbackIcon={option.icon} size={28} />
      </div>
      <div className="option-content">
        <h3>{option.title || option.name}</h3>
        {showRecommendation && option.id === 'fullscreen' && recommendationText && (
          <p className="setup-recommendation">{recommendationText}</p>
        )}
      </div>
      <div className="option-check">
        {isSelected && '✓'}
      </div>
    </div>
  );
};

export default SetupOption;

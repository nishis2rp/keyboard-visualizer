import React from 'react';
import { SetupOption as SetupOptionType, App } from '../../types';
import { AppIcon } from '../common/AppIcon';

type SelectableOption = SetupOptionType | App | (App & { title: string });

interface SetupOptionProps {
  option: SelectableOption;
  isSelected: boolean;
  onSelect: (option: SelectableOption) => void;
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
        <h3>{'title' in option ? option.title : option.name}</h3>
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

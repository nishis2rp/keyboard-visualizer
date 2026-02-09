import React, { useMemo } from 'react';
import { analyzeShortcutComplexity } from '../../utils/aiOptimization';
import { RichShortcut } from '../../types';

interface SmartHintProps {
  target: RichShortcut;
  allShortcuts: RichShortcut[];
}

const SmartHint: React.FC<SmartHintProps> = ({ target, allShortcuts }) => {
  const analysis = useMemo(() => 
    analyzeShortcutComplexity(target, allShortcuts), 
    [target, allShortcuts]
  );

  return (
    <div className="ai-hint-container" style={{
      marginTop: '15px',
      padding: '12px',
      background: 'rgba(99, 102, 241, 0.05)',
      borderRadius: '12px',
      borderLeft: '4px solid #6366f1',
      fontSize: '13px',
      animation: 'fadeIn 0.5s ease-out'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <span style={{ fontSize: '16px' }}>🤖</span>
        <strong style={{ color: '#4f46e5' }}>AI Analysis</strong>
        <span style={{ 
          fontSize: '10px', 
          background: '#6366f1', 
          color: 'white', 
          padding: '2px 6px', 
          borderRadius: '10px' 
        }}>
          Complexity: {analysis.complexityScore}
        </span>
      </div>
      <p style={{ color: '#475569', margin: 0, lineHeight: '1.4' }}>
        {analysis.hint}
      </p>
    </div>
  );
};

export default SmartHint;

import React from 'react';

interface SetupSectionProps {
  title: string;
  children: React.ReactNode;
  divider?: boolean;
}

const SetupSection: React.FC<SetupSectionProps> = ({ title, children, divider = true }) => {
  return (
    <>
      {divider && <div className="setup-divider">
        <h3>{title}</h3>
      </div>}
      {children}
    </>
  );
};

export default SetupSection;

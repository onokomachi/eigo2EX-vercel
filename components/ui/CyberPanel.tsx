import React from 'react';

interface CyberPanelProps {
  children: React.ReactNode;
  className?: string;
}

const CyberPanel: React.FC<CyberPanelProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-black/50 backdrop-blur-sm border border-orange-500/50 rounded-lg shadow-[0_0_15px_rgba(255,152,0,0.2)] p-6 transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
};

export default CyberPanel;
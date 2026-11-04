import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export const Alert = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  const iconMap = {
    success: <CheckCircle size={18} />,
    danger: <AlertCircle size={18} />,
    warning: <AlertCircle size={18} />,
    info: <Info size={18} />,
  };

  return (
    <div className={`alert alert-${type}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
        {iconMap[type]}
        <span>{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} style={{ color: 'inherit', padding: '0.2rem' }}>
          <X size={16} />
        </button>
      )}
    </div>
  );
};

import React from 'react';

export const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem' }}>
      <div style={{
        width: '38px',
        height: '38px',
        border: '3px solid #e2e8f0',
        borderTop: '3px solid #25528c',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      {text && <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#64748b' }}>{text}</p>}
    </div>
  );
};

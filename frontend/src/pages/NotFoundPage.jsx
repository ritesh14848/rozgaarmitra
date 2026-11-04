import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '6rem 1rem' }}>
      <div style={{
        width: '72px',
        height: '72px',
        background: 'var(--accent-orange-light)',
        color: 'var(--accent-orange)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1.5rem',
      }}>
        <AlertTriangle size={36} />
      </div>
      <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', color: 'var(--slate-900)' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--slate-700)' }}>Page Not Found</h2>
      <p style={{ maxWidth: '480px', margin: '0 auto 2rem', color: 'var(--slate-500)' }}>
        The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
      </p>
      <Link to="/" className="btn btn-primary btn-lg">
        <Home size={18} /> Return to Homepage
      </Link>
    </div>
  );
};

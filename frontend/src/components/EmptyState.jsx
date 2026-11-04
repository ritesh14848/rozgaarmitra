import React from 'react';
import { Briefcase, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  icon: Icon = Briefcase,
  title = 'No records found',
  message = 'There are no items to display at this moment.',
  actionText,
  actionLink,
  onAction,
}) => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '3.5rem 1.5rem',
      background: '#ffffff',
      borderRadius: 'var(--radius-lg)',
      border: '1px dashed var(--slate-300)',
    }}>
      <div style={{
        width: '56px',
        height: '56px',
        background: 'var(--slate-100)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1.25rem',
        color: 'var(--slate-500)',
      }}>
        <Icon size={28} />
      </div>
      <h3 style={{ marginBottom: '0.5rem', color: 'var(--slate-800)' }}>{title}</h3>
      <p style={{ maxWidth: '420px', margin: '0 auto 1.5rem', color: 'var(--slate-500)', fontSize: '0.95rem' }}>
        {message}
      </p>

      {actionText && actionLink && (
        <Link to={actionLink} className="btn btn-primary">
          {actionText} <ArrowRight size={16} />
        </Link>
      )}

      {actionText && onAction && !actionLink && (
        <button onClick={onAction} className="btn btn-primary">
          {actionText}
        </button>
      )}
    </div>
  );
};

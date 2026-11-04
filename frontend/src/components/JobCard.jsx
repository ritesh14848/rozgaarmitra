import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Calendar, Users, ArrowRight } from 'lucide-react';
import { formatSalary, formatDate } from '../utils/formatters';
import { JOB_STATUS } from '../utils/constants';

export const JobCard = ({ job, showEmployerActions = false, onToggleStatus, onEdit }) => {
  const isClosed = job.status === 'CLOSED';
  const statusInfo = JOB_STATUS[job.status] || JOB_STATUS.OPEN;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '0.5rem' }}>
        <span className="badge-trade">{job.jobCategory}</span>
        <span className={`badge ${statusInfo.color}`}>{statusInfo.label}</span>
      </div>

      <h3 style={{ fontSize: '1.2rem', marginBottom: '0.35rem', color: 'var(--slate-900)' }}>
        {job.jobTitle}
      </h3>

      <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', marginBottom: '1rem', fontWeight: 500 }}>
        {job.companyName ? `${job.companyName} (${job.employerName})` : job.employerName}
      </p>

      <p style={{
        fontSize: '0.875rem',
        color: 'var(--slate-500)',
        marginBottom: '1.25rem',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        flex: 1
      }}>
        {job.description}
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0.75rem',
        padding: '0.85rem 0',
        borderTop: '1px solid var(--slate-100)',
        borderBottom: '1px solid var(--slate-100)',
        marginBottom: '1.25rem',
        fontSize: '0.875rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--slate-700)' }}>
          <span style={{ fontWeight: 700, color: 'var(--accent-teal-dark)', fontSize: '1.05rem' }}>
            {formatSalary(job.salary)}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>/mo</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--slate-600)' }}>
          <MapPin size={16} color="var(--slate-400)" />
          <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{job.location}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--slate-600)' }}>
          <Briefcase size={16} color="var(--slate-400)" />
          <span>{job.experienceRequired} yrs min</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--slate-600)' }}>
          <Users size={16} color="var(--slate-400)" />
          <span>{job.vacancyCount} openings</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--slate-500)', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Calendar size={14} />
          <span>Deadline: {formatDate(job.lastDateToApply)}</span>
        </div>
        {job.applicationCount !== undefined && (
          <span style={{ fontWeight: 600, color: 'var(--primary-700)' }}>
            {job.applicationCount} applied
          </span>
        )}
      </div>

      {showEmployerActions ? (
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
          <Link to={`/employer/jobs/${job.jobId}/applicants`} className="btn btn-outline btn-sm" style={{ flex: 1 }}>
            Applicants ({job.applicationCount || 0})
          </Link>
          <button
            onClick={() => onToggleStatus(job.jobId, isClosed ? 'OPEN' : 'CLOSED')}
            className={`btn btn-sm ${isClosed ? 'btn-accent' : 'btn-outline'}`}
          >
            {isClosed ? 'Reopen' : 'Close'}
          </button>
        </div>
      ) : (
        <div style={{ marginTop: 'auto' }}>
          <Link
            to={`/jobs/${job.jobId}`}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            View & Apply <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
};

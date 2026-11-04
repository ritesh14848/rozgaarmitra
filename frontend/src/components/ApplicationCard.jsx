import React from 'react';
import { Calendar, MapPin, Phone, Mail, Award, Clock } from 'lucide-react';
import { formatDate, formatSalary } from '../utils/formatters';
import { APPLICATION_STATUS } from '../utils/constants';

export const ApplicationCard = ({
  application,
  isEmployer = false,
  onUpdateStatus,
}) => {
  const statusInfo = APPLICATION_STATUS[application.status] || APPLICATION_STATUS.PENDING;

  return (
    <div className="card" style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <span className="badge-trade">{application.jobCategory || application.trade}</span>
            <span className={`badge ${statusInfo.color}`}>{statusInfo.label}</span>
          </div>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--slate-900)' }}>
            {application.jobTitle}
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)' }}>
            {isEmployer
              ? `Applicant: ${application.workerName}`
              : `Employer: ${application.companyName || application.employerName}`}
          </p>
        </div>

        <div style={{ textAlign: 'right', minWidth: '140px' }}>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-teal-dark)' }}>
            {formatSalary(application.salary)}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--slate-400)', display: 'flex', alignItems: 'center', gap: '0.3rem', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
            <Calendar size={13} />
            <span>Applied: {formatDate(application.applyDate)}</span>
          </div>
        </div>
      </div>

      {isEmployer && (
        <div style={{
          background: 'var(--slate-50)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          margin: '1rem 0',
          fontSize: '0.875rem',
          border: '1px solid var(--slate-200)',
        }}>
          <h4 style={{ fontSize: '0.9rem', color: 'var(--slate-800)', marginBottom: '0.5rem' }}>
            Worker Qualifications & Contact
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--slate-700)' }}>
              <Award size={16} color="var(--accent-teal)" />
              <span><strong>Trade:</strong> {application.trade}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--slate-700)' }}>
              <Clock size={16} color="var(--accent-teal)" />
              <span><strong>Experience:</strong> {application.experience} years</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--slate-700)' }}>
              <Phone size={16} color="var(--accent-teal)" />
              <span><strong>Phone:</strong> {application.workerPhone}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--slate-700)' }}>
              <Mail size={16} color="var(--accent-teal)" />
              <span><strong>Email:</strong> {application.workerEmail}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--slate-700)' }}>
              <MapPin size={16} color="var(--accent-teal)" />
              <span><strong>Location:</strong> {application.workerLocation}</span>
            </div>
            <div>
              <span><strong>Availability:</strong> {application.availability}</span>
            </div>
          </div>
        </div>
      )}

      {isEmployer && onUpdateStatus && (
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '0.5rem',
          marginTop: '1rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--slate-100)',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--slate-600)', fontWeight: 600 }}>Update Status:</span>
          {application.status !== 'SHORTLISTED' && (
            <button
              onClick={() => onUpdateStatus(application.applicationId, 'SHORTLISTED')}
              className="btn btn-outline btn-sm"
              style={{ color: '#1e40af', borderColor: '#bfdbfe' }}
            >
              Shortlist
            </button>
          )}
          {application.status !== 'ACCEPTED' && (
            <button
              onClick={() => onUpdateStatus(application.applicationId, 'ACCEPTED')}
              className="btn btn-primary btn-sm"
            >
              Accept / Hire
            </button>
          )}
          {application.status !== 'REJECTED' && (
            <button
              onClick={() => onUpdateStatus(application.applicationId, 'REJECTED')}
              className="btn btn-outline btn-sm"
              style={{ color: '#dc2626', borderColor: '#fecaca' }}
            >
              Reject
            </button>
          )}
        </div>
      )}
    </div>
  );
};

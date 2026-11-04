import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { jobService } from '../../services/jobService';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Alert } from '../../components/Alert';
import { Modal } from '../../components/Modal';
import { formatSalary, formatDate } from '../../utils/formatters';
import { JOB_STATUS } from '../../utils/constants';
import {
  MapPin, Briefcase, Calendar, Users, DollarSign,
  Building, Phone, ArrowLeft, CheckCircle, AlertTriangle, ShieldCheck
} from 'lucide-react';

export const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isWorker, isAuthenticated } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const data = await jobService.getJobById(id);
        setJob(data);
      } catch (err) {
        setMessage({
          type: 'danger',
          text: err.response?.data?.message || 'Failed to load job details.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApplyConfirm = async () => {
    try {
      setApplying(true);
      await jobService.applyForJob(job.jobId);
      setModalOpen(false);
      setMessage({
        type: 'success',
        text: 'Your application has been submitted successfully! The employer can now review your profile.',
      });
    } catch (err) {
      setModalOpen(false);
      setMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to submit application.',
      });
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Fetching job details..." />;
  }

  if (!job) {
    return (
      <div className="container" style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
        {message && <Alert type={message.type} message={message.text} />}
        <Link to="/jobs" className="btn btn-outline" style={{ marginTop: '1rem' }}>
          <ArrowLeft size={16} /> Back to Job Listings
        </Link>
      </div>
    );
  }

  const isClosed = job.status === 'CLOSED';
  const isExpired = new Date(job.lastDateToApply) < new Date().setHours(0, 0, 0, 0);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <button
        onClick={() => navigate(-1)}
        className="btn btn-outline btn-sm"
        style={{ marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      {message && (
        <Alert
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}

      {/* Change 6: 2-column wide desktop layout */}
      <div className="wide-form-layout">
        {/* Main Job Details Card */}
        <div className="card" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                <span className="badge-trade">{job.jobCategory}</span>
                <span className={`badge ${JOB_STATUS[job.status]?.color || 'badge-success'}`}>
                  {JOB_STATUS[job.status]?.label || job.status}
                </span>
              </div>
              <h1 style={{ fontSize: '2.25rem', color: 'var(--slate-900)', marginBottom: '0.35rem' }}>
                {job.jobTitle}
              </h1>
              <p style={{ fontSize: '1.1rem', color: 'var(--slate-600)', fontWeight: 500 }}>
                {job.companyName ? `${job.companyName} (${job.employerName})` : `Employer: ${job.employerName}`}
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--accent-teal-dark)' }}>
                {formatSalary(job.salary)}
              </div>
              <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: 600 }}>Monthly Compensation</span>
            </div>
          </div>

          {/* Quick Highlights Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '1rem',
            padding: '1.5rem',
            background: 'var(--slate-50)',
            borderRadius: 'var(--radius-md)',
            margin: '1.5rem 0 2rem',
            border: '1px solid var(--slate-200)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <MapPin size={20} color="var(--primary-700)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 700 }}>City</div>
                <div style={{ fontWeight: 700, color: 'var(--slate-800)' }}>{job.location}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Briefcase size={20} color="var(--primary-700)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 700 }}>Experience</div>
                <div style={{ fontWeight: 700, color: 'var(--slate-800)' }}>{job.experienceRequired}+ Years Min</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Users size={20} color="var(--primary-700)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 700 }}>Vacancies</div>
                <div style={{ fontWeight: 700, color: 'var(--slate-800)' }}>{job.vacancyCount} Openings</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Calendar size={20} color="var(--primary-700)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: 700 }}>Deadline</div>
                <div style={{ fontWeight: 700, color: isExpired ? '#dc2626' : 'var(--slate-800)' }}>
                  {formatDate(job.lastDateToApply)}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Job Description */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.85rem' }}>Work Scope & Requirements</h3>
            <div style={{
              fontSize: '1rem',
              color: 'var(--slate-700)',
              lineHeight: 1.7,
              whiteSpace: 'pre-line',
              background: '#ffffff',
              padding: '1.5rem',
              border: '1.5px solid var(--slate-100)',
              borderRadius: 'var(--radius-md)'
            }}>
              {job.description}
            </div>
          </div>

          {/* Action Button Section */}
          <div style={{ borderTop: '1px solid var(--slate-200)', paddingTop: '1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--slate-500)' }}>
              Posted on {formatDate(job.postedDate)} • {job.applicationCount || 0} applicants so far
            </div>

            {isClosed ? (
              <div className="badge badge-secondary" style={{ padding: '0.65rem 1.35rem', fontSize: '0.9rem' }}>
                This job is closed
              </div>
            ) : isExpired ? (
              <div className="badge badge-danger" style={{ padding: '0.65rem 1.35rem', fontSize: '0.9rem' }}>
                Application Deadline has passed
              </div>
            ) : isAuthenticated && isWorker ? (
              <button
                onClick={() => setModalOpen(true)}
                className="btn btn-primary btn-lg"
              >
                Apply for this Job Now
              </button>
            ) : isAuthenticated && !isWorker ? (
              <div style={{ color: 'var(--slate-500)', fontSize: '0.9rem' }}>
                You are logged in as an Employer. Only worker accounts can apply.
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--slate-600)' }}>Looking to apply?</span>
                <Link to="/login" className="btn btn-primary">
                  Login as Worker
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Employer Information Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="sidebar-info-card">
            <h3>Employer Information</h3>
            <ul>
              <li>
                <Building size={18} color="var(--primary-700)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Organization:</strong> {job.companyName || 'Private Individual / Contractor'}</span>
              </li>
              <li>
                <Users size={18} color="var(--primary-700)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Contact Person:</strong> {job.employerName}</span>
              </li>
              <li>
                <Phone size={18} color="var(--primary-700)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Phone Contact:</strong> {job.employerPhone}</span>
              </li>
              <li>
                <MapPin size={18} color="var(--primary-700)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Location:</strong> {job.location}</span>
              </li>
            </ul>
          </div>

          <div className="sidebar-info-card" style={{ background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.08) 0%, rgba(37, 84, 148, 0.04) 100%)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={20} color="var(--accent-teal)" />
              Safe Applying
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
              Your profile will be directly sent to this employer. They will review your experience and trade qualifications and call you directly.
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirm Job Application"
      >
        <p style={{ marginBottom: '1rem', color: 'var(--slate-600)' }}>
          You are about to submit your skilled trade profile for <strong>{job.jobTitle}</strong> at <strong>{job.location}</strong>.
        </p>
        <p style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: 'var(--slate-500)' }}>
          The employer will be able to view your qualification, experience, phone number, and trade details to contact you directly.
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setModalOpen(false)}
            className="btn btn-outline"
            disabled={applying}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApplyConfirm}
            className="btn btn-primary"
            disabled={applying}
          >
            {applying ? 'Submitting...' : 'Confirm & Apply'}
          </button>
        </div>
      </Modal>
    </div>
  );
};

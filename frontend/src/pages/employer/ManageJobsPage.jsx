import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { employerService } from '../../services/employerService';
import { jobService } from '../../services/jobService';
import { JobCard } from '../../components/JobCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { Alert } from '../../components/Alert';
import { Modal } from '../../components/Modal';
import { PlusCircle, Briefcase } from 'lucide-react';

export const ManageJobsPage = () => {
  const location = useLocation();
  const createdNotification = new URLSearchParams(location.search).get('created') === 'true';

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(createdNotification ? 'Job opening published successfully!' : '');

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await employerService.getMyJobs();
      setJobs(data);
    } catch (err) {
      setError('Failed to fetch your jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggleStatus = async (jobId, newStatus) => {
    try {
      await jobService.updateJobStatus(jobId, newStatus);
      setSuccess(`Job marked as ${newStatus}.`);
      fetchJobs();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update job status.');
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.35rem' }}>Manage Your Job Openings</h1>
          <p style={{ color: 'var(--slate-600)' }}>
            Track active positions, close filled vacancies, and review skilled applicants
          </p>
        </div>

        <Link to="/employer/post-job" className="btn btn-orange">
          <PlusCircle size={18} /> Post Another Job
        </Link>
      </div>

      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
      {error && <Alert type="danger" message={error} onClose={() => setError('')} />}

      {loading ? (
        <LoadingSpinner text="Loading your posted jobs..." />
      ) : jobs.length > 0 ? (
        <div className="grid-cols-3">
          {jobs.map((job) => (
            <JobCard
              key={job.jobId}
              job={job}
              showEmployerActions={true}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Briefcase}
          title="No jobs posted yet"
          message="You have not created any job listings. Post an opening to receive applications from verified electricians, carpenters, plumbers, and more."
          actionText="Create First Job"
          actionLink="/employer/post-job"
        />
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { employerService } from '../../services/employerService';
import { jobService } from '../../services/jobService';
import { ApplicationCard } from '../../components/ApplicationCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { Alert } from '../../components/Alert';
import { ArrowLeft, Users, Briefcase, MapPin, Calendar, DollarSign, Award } from 'lucide-react';
import { formatSalary, formatDate } from '../../utils/formatters';

export const JobApplicantsPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusSuccess, setStatusSuccess] = useState('');

  const fetchJobAndApplicants = async () => {
    try {
      setLoading(true);
      const [jobData, appsData] = await Promise.all([
        jobService.getJobById(jobId),
        employerService.getJobApplications(jobId),
      ]);
      setJob(jobData);
      setApplications(appsData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load applicants for this job.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobAndApplicants();
  }, [jobId]);

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      await employerService.updateApplicationStatus(appId, newStatus);
      setStatusSuccess(`Application updated to ${newStatus}.`);
      fetchJobAndApplicants();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update application status.');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving job applicants..." />;
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <button
        onClick={() => navigate('/employer/jobs')}
        className="btn btn-outline btn-sm"
        style={{ marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={16} /> Back to My Jobs
      </button>

      <div className="page-header">
        <span className="badge-trade" style={{ marginBottom: '0.65rem', display: 'inline-block' }}>
          {job?.jobCategory}
        </span>
        <h1>Applicants for {job?.jobTitle}</h1>
        <p>
          {applications.length} candidate{applications.length === 1 ? '' : 's'} applied for this position in {job?.location}
        </p>
      </div>

      {statusSuccess && <Alert type="success" message={statusSuccess} onClose={() => setStatusSuccess('')} />}
      {error && <Alert type="danger" message={error} onClose={() => setError('')} />}

      {/* Change 6: Wide responsive desktop layout */}
      <div className="wide-form-layout">
        <div>
          {applications.length > 0 ? (
            <div>
              {applications.map((app) => (
                <ApplicationCard
                  key={app.applicationId}
                  application={app}
                  isEmployer={true}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="No applicants yet"
              message="No workers have applied to this opening yet. Once workers in this city review your job, their profiles will appear here."
              actionText="View All My Jobs"
              actionLink="/employer/jobs"
            />
          )}
        </div>

        {/* Sidebar Job Overview Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="sidebar-info-card">
            <h3>Job Details</h3>
            <ul>
              <li>
                <MapPin size={18} color="var(--primary-700)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>City:</strong> {job?.location}</span>
              </li>
              <li>
                <Award size={18} color="var(--primary-700)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Salary:</strong> {formatSalary(job?.salary)}/mo</span>
              </li>
              <li>
                <Users size={18} color="var(--primary-700)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Vacancies:</strong> {job?.vacancyCount} Openings</span>
              </li>
              <li>
                <Calendar size={18} color="var(--primary-700)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Deadline:</strong> {formatDate(job?.lastDateToApply)}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

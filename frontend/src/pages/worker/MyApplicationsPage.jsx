import React, { useState, useEffect } from 'react';
import { jobService } from '../../services/jobService';
import { ApplicationCard } from '../../components/ApplicationCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { Alert } from '../../components/Alert';
import { Send, FileText, CheckCircle2, Clock } from 'lucide-react';

export const MyApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const data = await jobService.getMyApplications();
        setApplications(data);
      } catch (err) {
        setError('Failed to fetch your applications. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div className="page-header">
        <h1>My Job Applications</h1>
        <p>
          Track the status of all skilled positions you have applied for across Indian cities
        </p>
      </div>

      {error && <Alert type="danger" message={error} onClose={() => setError('')} />}

      {/* Change 6: Wide responsive desktop layout */}
      <div className="wide-form-layout">
        <div>
          {loading ? (
            <LoadingSpinner text="Retrieving your submitted applications..." />
          ) : applications.length > 0 ? (
            <div>
              {applications.map((app) => (
                <ApplicationCard key={app.applicationId} application={app} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Send}
              title="No applications yet"
              message="You haven't applied to any skilled trade jobs yet. Browse open jobs and find an opportunity matching your trade."
              actionText="Browse Open Jobs"
              actionLink="/jobs"
            />
          )}
        </div>

        {/* Sidebar Info Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="sidebar-info-card">
            <h3>Application Stages</h3>
            <ul>
              <li>
                <Clock size={18} color="var(--accent-orange)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Pending Review:</strong> The employer has received your profile and will review it soon.</span>
              </li>
              <li>
                <CheckCircle2 size={18} color="var(--primary-700)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Shortlisted:</strong> Your experience matched the site needs; expect a phone call for interview/site visit.</span>
              </li>
              <li>
                <CheckCircle2 size={18} color="var(--accent-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Accepted / Hired:</strong> Final confirmation of job selection.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

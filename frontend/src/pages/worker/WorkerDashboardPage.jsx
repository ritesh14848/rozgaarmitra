import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { workerService } from '../../services/workerService';
import { jobService } from '../../services/jobService';
import { JobCard } from '../../components/JobCard';
import { ApplicationCard } from '../../components/ApplicationCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Alert } from '../../components/Alert';
import { Briefcase, Send, CheckCircle, Clock, ArrowRight, User } from 'lucide-react';

export const WorkerDashboardPage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [profileData, appsData, jobsData] = await Promise.all([
          workerService.getProfile(),
          jobService.getMyApplications(),
          jobService.getJobs(),
        ]);

        setProfile(profileData);
        setApplications(appsData);

        // Filter recommended jobs matching the worker's trade
        const matched = jobsData.filter(
          (j) => j.status === 'OPEN' && (
            j.jobCategory?.toUpperCase() === profileData.trade?.toUpperCase() ||
            j.jobTitle?.toLowerCase().includes(profileData.trade?.toLowerCase())
          )
        );
        setRecommendedJobs(matched.length > 0 ? matched.slice(0, 4) : jobsData.slice(0, 4));
      } catch (err) {
        setError('Failed to load dashboard data. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Loading your worker dashboard..." />;
  }

  const shortlistedCount = applications.filter((a) => a.status === 'SHORTLISTED').length;
  const acceptedCount = applications.filter((a) => a.status === 'ACCEPTED').length;

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-900) 0%, var(--primary-800) 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem 2.5rem',
        color: '#ffffff',
        marginBottom: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem',
      }}>
        <div>
          <div style={{ display: 'inline-block', background: 'var(--accent-teal)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            {profile?.trade} SPECIALIST
          </div>
          <h1 style={{ color: '#ffffff', fontSize: '2rem' }}>Welcome, {profile?.name}</h1>
          <p style={{ color: 'var(--slate-300)', marginTop: '0.25rem' }}>
            {profile?.location} • {profile?.experience} Years Experience • {profile?.hoursWork?.replace('_', ' ')}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/jobs" className="btn btn-accent">
            <Briefcase size={16} /> Browse New Jobs
          </Link>
          <Link to="/worker/profile" className="btn btn-outline" style={{ background: '#fff', color: 'var(--slate-800)' }}>
            <User size={16} /> View Profile
          </Link>
        </div>
      </div>

      {error && <Alert type="danger" message={error} onClose={() => setError('')} />}

      {/* Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--info-bg)', color: 'var(--info-text)' }}>
            <Send size={24} />
          </div>
          <div>
            <div className="stat-number">{applications.length}</div>
            <div className="stat-label">Applications Sent</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--warning-bg)', color: 'var(--warning-text)' }}>
            <Clock size={24} />
          </div>
          <div>
            <div className="stat-number">{shortlistedCount}</div>
            <div className="stat-label">Shortlisted</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--success-bg)', color: 'var(--success-text)' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div className="stat-number">{acceptedCount}</div>
            <div className="stat-label">Hired / Accepted</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Recommended Jobs & Recent Applications */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
        {/* Recommended Jobs */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.35rem' }}>Jobs Matching Your Trade</h2>
            <Link to="/jobs" style={{ fontSize: '0.875rem', color: 'var(--primary-700)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {recommendedJobs.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {recommendedJobs.map((job) => (
                <JobCard key={job.jobId} job={job} />
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <p>No open jobs matching your trade right now.</p>
              <Link to="/jobs" className="btn btn-outline btn-sm" style={{ marginTop: '0.75rem' }}>
                Explore all open jobs
              </Link>
            </div>
          )}
        </div>

        {/* Recent Applications */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.35rem' }}>Recent Applications</h2>
            <Link to="/worker/applications" style={{ fontSize: '0.875rem', color: 'var(--primary-700)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              All applications <ArrowRight size={14} />
            </Link>
          </div>

          {applications.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {applications.slice(0, 3).map((app) => (
                <ApplicationCard key={app.applicationId} application={app} />
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
              <Send size={32} color="var(--slate-400)" style={{ margin: '0 auto 0.75rem' }} />
              <p style={{ color: 'var(--slate-600)', marginBottom: '1rem' }}>You haven't submitted any job applications yet.</p>
              <Link to="/jobs" className="btn btn-primary btn-sm">
                Search & Apply for Jobs
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employerService } from '../../services/employerService';
import { JobCard } from '../../components/JobCard';
import { ApplicationCard } from '../../components/ApplicationCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Alert } from '../../components/Alert';
import { PlusCircle, Briefcase, Users, Clock, ArrowRight, Building2 } from 'lucide-react';

export const EmployerDashboardPage = () => {
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const [profileData, jobsData, appsData] = await Promise.all([
          employerService.getProfile(),
          employerService.getMyJobs(),
          employerService.getAllApplications(),
        ]);
        setProfile(profileData);
        setJobs(jobsData);
        setApplications(appsData);
      } catch (err) {
        setError('Failed to load employer dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleToggleStatus = async (jobId, newStatus) => {
    try {
      const updated = await employerService.getMyJobs();
      setJobs(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateAppStatus = async (appId, status) => {
    try {
      await employerService.updateApplicationStatus(appId, status);
      const apps = await employerService.getAllApplications();
      setApplications(apps);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading employer dashboard..." />;
  }

  const activeJobsCount = jobs.filter((j) => j.status === 'OPEN').length;
  const pendingReviewsCount = applications.filter((a) => a.status === 'PENDING').length;

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
          <div style={{ display: 'inline-block', background: 'var(--accent-orange)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            EMPLOYER PORTAL
          </div>
          <h1 style={{ color: '#ffffff', fontSize: '2rem' }}>
            {profile?.companyName ? profile.companyName : profile?.name}
          </h1>
          <p style={{ color: 'var(--slate-300)', marginTop: '0.25rem' }}>
            {profile?.industryType} • {profile?.address}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/employer/post-job" className="btn btn-orange">
            <PlusCircle size={18} /> Post a New Job
          </Link>
          <Link to="/employer/jobs" className="btn btn-outline" style={{ background: '#fff', color: 'var(--slate-800)' }}>
            <Briefcase size={16} /> Manage All Jobs
          </Link>
        </div>
      </div>

      {error && <Alert type="danger" message={error} onClose={() => setError('')} />}

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--info-bg)', color: 'var(--info-text)' }}>
            <Briefcase size={24} />
          </div>
          <div>
            <div className="stat-number">{activeJobsCount}</div>
            <div className="stat-label">Active Jobs Open</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--accent-teal-light)', color: 'var(--accent-teal-dark)' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="stat-number">{applications.length}</div>
            <div className="stat-label">Total Applicants</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--warning-bg)', color: 'var(--warning-text)' }}>
            <Clock size={24} />
          </div>
          <div>
            <div className="stat-number">{pendingReviewsCount}</div>
            <div className="stat-label">Pending Review</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Posted Jobs & Recent Applicants */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
        {/* Posted Jobs */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.35rem' }}>Your Posted Openings</h2>
            <Link to="/employer/jobs" style={{ fontSize: '0.875rem', color: 'var(--primary-700)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View all ({jobs.length}) <ArrowRight size={14} />
            </Link>
          </div>

          {jobs.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {jobs.slice(0, 3).map((job) => (
                <JobCard
                  key={job.jobId}
                  job={job}
                  showEmployerActions={true}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
              <p style={{ color: 'var(--slate-600)', marginBottom: '1rem' }}>You haven't posted any jobs yet.</p>
              <Link to="/employer/post-job" className="btn btn-primary btn-sm">
                <PlusCircle size={16} /> Post Your First Job
              </Link>
            </div>
          )}
        </div>

        {/* Recent Applicants */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.35rem' }}>Recent Trade Applicants</h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
              {applications.length} Total
            </span>
          </div>

          {applications.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {applications.slice(0, 3).map((app) => (
                <ApplicationCard
                  key={app.applicationId}
                  application={app}
                  isEmployer={true}
                  onUpdateStatus={handleUpdateAppStatus}
                />
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
              <Users size={32} color="var(--slate-400)" style={{ margin: '0 auto 0.75rem' }} />
              <p style={{ color: 'var(--slate-600)' }}>
                No workers have applied to your openings yet. Once you post jobs, verified applicants will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

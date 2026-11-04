import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { JobCard } from '../../components/JobCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { TRADES, CITIES } from '../../utils/constants';
import { Search, MapPin, Filter, X, Briefcase } from 'lucide-react';

export const BrowseJobsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialLocation = searchParams.get('location') || '';

  const [category, setCategory] = useState(initialCategory);
  const [location, setLocation] = useState(initialLocation);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async (cat, loc) => {
    try {
      setLoading(true);
      const params = {};
      if (cat) params.category = cat;
      if (loc) params.location = loc;
      const data = await jobService.getJobs(params);
      setJobs(data);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs(initialCategory, initialLocation);
  }, [initialCategory, initialLocation]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const newParams = {};
    if (category) newParams.category = category;
    if (location) newParams.location = location;
    setSearchParams(newParams);
    fetchJobs(category, location);
  };

  const handleClearFilters = () => {
    setCategory('');
    setLocation('');
    setSearchParams({});
    fetchJobs('', '');
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div className="page-header">
        <h1>Explore Skilled Trade Opportunities</h1>
        <p>
          Browse genuine openings for electricians, plumbers, carpenters, welders, and technicians across India
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
        <form onSubmit={handleFilterSubmit} style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 240px', minWidth: '220px' }}>
            <label className="form-label">Trade / Specialty</label>
            <select
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Trades</option>
              {TRADES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Change 2: City Dropdown */}
          <div style={{ flex: '1 1 240px', minWidth: '220px' }}>
            <label className="form-label">City / Location</label>
            <select
              className="form-control"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">All Cities</option>
              {CITIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem' }}>
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
              <Search size={16} /> Filter
            </button>
            {(category || location) && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="btn btn-outline"
                title="Clear filters"
              >
                <X size={16} /> Reset
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--slate-800)' }}>
          {loading ? 'Searching openings...' : `${jobs.length} Open Jobs Available`}
        </h3>
        {(category || location) && (
          <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
            Filtering by: {category && <span className="badge badge-secondary" style={{ marginRight: '0.4rem' }}>Trade: {category}</span>}
            {location && <span className="badge badge-secondary">Location: {location}</span>}
          </div>
        )}
      </div>

      {/* Job Grid */}
      {loading ? (
        <LoadingSpinner text="Loading jobs..." />
      ) : jobs.length > 0 ? (
        <div className="grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.jobId} job={job} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Briefcase}
          title="No jobs found matching your criteria"
          message="Try broadening your search or clearing city/trade filters to see all available opportunities."
          actionText="Clear All Filters"
          onAction={handleClearFilters}
        />
      )}
    </div>
  );
};

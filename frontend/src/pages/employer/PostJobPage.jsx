import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { Alert } from '../../components/Alert';
import { TRADES, CITIES } from '../../utils/constants';
import { PlusCircle, ArrowLeft, CheckCircle2, ShieldCheck, MapPin, Calendar, Clock, DollarSign } from 'lucide-react';

export const PostJobPage = () => {
  const navigate = useNavigate();

  // default last date to apply is 15 days from now
  const defaultDeadline = new Date();
  defaultDeadline.setDate(defaultDeadline.getDate() + 15);
  const formattedDefaultDeadline = defaultDeadline.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    jobTitle: '',
    jobCategory: 'ELECTRICIAN',
    description: '',
    salary: 20000,
    location: 'Mumbai', // Default to Mumbai dropdown
    experienceRequired: 1,
    vacancyCount: 1,
    lastDateToApply: formattedDefaultDeadline,
  });

  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        salary: Number(formData.salary),
        experienceRequired: Number(formData.experienceRequired),
        vacancyCount: Number(formData.vacancyCount),
      };

      await jobService.createJob(payload);
      navigate('/employer/jobs?created=true');
    } catch (err) {
      if (err.response?.data?.validationErrors) {
        setFieldErrors(err.response.data.validationErrors);
        setError('Please check the highlighted fields below.');
      } else {
        setError(err.response?.data?.message || 'Failed to post job. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <button
        onClick={() => navigate(-1)}
        className="btn btn-outline btn-sm"
        style={{ marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="page-header">
        <h1>Post a Skilled Trade Job Opening</h1>
        <p>
          Publish project vacancies, set pay rates, choose your city, and connect directly with verified tradespeople
        </p>
      </div>

      {error && <Alert type="danger" message={error} onClose={() => setError('')} />}

      <div className="wide-form-layout">
        {/* Main Form Card */}
        <div className="card" style={{ padding: '2.5rem' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Job Title *</label>
              <input
                type="text"
                required
                name="jobTitle"
                className="form-control"
                placeholder="e.g. Lead Residential Electrician for 3BHK Renovation"
                value={formData.jobTitle}
                onChange={handleChange}
              />
              {fieldErrors.jobTitle && <div className="form-error">{fieldErrors.jobTitle}</div>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Trade / Category *</label>
                <select
                  name="jobCategory"
                  className="form-control"
                  value={formData.jobCategory}
                  onChange={handleChange}
                >
                  {TRADES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Change 2: Job location dropdown with 5 cities */}
              <div className="form-group">
                <label className="form-label">Job City / Location *</label>
                <select
                  required
                  name="location"
                  className="form-control"
                  value={formData.location}
                  onChange={handleChange}
                >
                  {CITIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                {fieldErrors.location && <div className="form-error">{fieldErrors.location}</div>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Monthly Salary (₹ INR) *</label>
                <input
                  type="number"
                  min="1000"
                  step="500"
                  required
                  name="salary"
                  className="form-control"
                  value={formData.salary}
                  onChange={handleChange}
                />
                {fieldErrors.salary && <div className="form-error">{fieldErrors.salary}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Minimum Experience (Years) *</label>
                <input
                  type="number"
                  min="0"
                  max="40"
                  required
                  name="experienceRequired"
                  className="form-control"
                  value={formData.experienceRequired}
                  onChange={handleChange}
                />
                {fieldErrors.experienceRequired && <div className="form-error">{fieldErrors.experienceRequired}</div>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Number of Vacancies *</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  name="vacancyCount"
                  className="form-control"
                  value={formData.vacancyCount}
                  onChange={handleChange}
                />
                {fieldErrors.vacancyCount && <div className="form-error">{fieldErrors.vacancyCount}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Last Date to Apply (Deadline) *</label>
                <input
                  type="date"
                  required
                  name="lastDateToApply"
                  className="form-control"
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.lastDateToApply}
                  onChange={handleChange}
                />
                {fieldErrors.lastDateToApply && <div className="form-error">{fieldErrors.lastDateToApply}</div>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Detailed Description of Work & Site Requirements *</label>
              <textarea
                required
                rows={5}
                name="description"
                className="form-control"
                placeholder="Outline specific responsibilities, tools required, daily timings, exact site address, and any trade skills needed..."
                value={formData.description}
                onChange={handleChange}
              />
              {fieldErrors.description && <div className="form-error">{fieldErrors.description}</div>}
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => navigate('/employer/dashboard')}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-orange btn-lg"
              >
                <PlusCircle size={18} /> {submitting ? 'Publishing Opening...' : 'Publish Job Opening'}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Info Card (Change 6: Screen space utilization) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="sidebar-info-card">
            <h3>Posting Guidelines</h3>
            <ul>
              <li>
                <CheckCircle2 size={18} color="var(--accent-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Accurate Cities:</strong> Choosing the right city helps local workers locate your job immediately.</span>
              </li>
              <li>
                <CheckCircle2 size={18} color="var(--accent-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Competitive Pay:</strong> Transparent monthly pay receives significantly more verified applicants.</span>
              </li>
              <li>
                <CheckCircle2 size={18} color="var(--accent-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Realistic Deadlines:</strong> Give candidates at least 7 to 15 days to review and apply.</span>
              </li>
            </ul>
          </div>

          <div className="sidebar-info-card" style={{ background: 'linear-gradient(135deg, rgba(37, 84, 148, 0.05) 0%, rgba(13, 148, 136, 0.05) 100%)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={20} color="var(--primary-700)" />
              Direct Hiring Guarantee
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
              All applications come directly from registered trade workers with their contact details, qualifications, and experience level. You can shortlist or hire with zero platform commission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

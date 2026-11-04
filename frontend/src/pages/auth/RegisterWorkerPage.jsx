import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { Alert } from '../../components/Alert';
import { TRADES, HOURS_WORK, CITIES, AVAILABILITY_OPTIONS } from '../../utils/constants';
import { Award, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export const RegisterWorkerPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNo: '',
    qualification: '',
    experience: 1,
    availability: 'Immediate', // Change 4: Dropdown
    location: 'Mumbai', // Change 4: Dropdown
    hoursWork: 'FULL_TIME',
    trade: 'ELECTRICIAN',
  });

  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

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
      setLoading(true);
      const payload = {
        ...formData,
        experience: Number(formData.experience),
      };
      const authData = await authService.registerWorker(payload);
      login(authData);
      navigate('/worker/dashboard');
    } catch (err) {
      if (err.response?.data?.validationErrors) {
        setFieldErrors(err.response.data.validationErrors);
        setError('Please correct the highlighted errors in the form.');
      } else {
        setError(err.response?.data?.message || 'Worker registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div className="page-header">
        <h1>Register as a Skilled Tradesperson</h1>
        <p>
          Create your verified craft profile and receive job applications directly from homeowners and contractors
        </p>
      </div>

      {error && <Alert type="danger" message={error} onClose={() => setError('')} />}

      {/* Change 6: 2-column wide layout utilizing the full screen space */}
      <div className="wide-form-layout">
        <div className="card" style={{ padding: '2.5rem' }}>
          <form onSubmit={handleSubmit}>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-900)', marginBottom: '1.25rem', borderBottom: '1.5px solid var(--slate-100)', paddingBottom: '0.6rem' }}>
              1. Account & Contact Details
            </h4>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  name="name"
                  className="form-control"
                  placeholder="e.g. Ramesh Sharma"
                  value={formData.name}
                  onChange={handleChange}
                />
                {fieldErrors.name && <div className="form-error">{fieldErrors.name}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  required
                  name="email"
                  className="form-control"
                  placeholder="ramesh@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {fieldErrors.email && <div className="form-error">{fieldErrors.email}</div>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Password * (min 6 characters)</label>
                <input
                  type="password"
                  required
                  name="password"
                  minLength={6}
                  className="form-control"
                  placeholder="Choose a secure password"
                  value={formData.password}
                  onChange={handleChange}
                />
                {fieldErrors.password && <div className="form-error">{fieldErrors.password}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  required
                  name="phoneNo"
                  className="form-control"
                  placeholder="e.g. 9876543210"
                  value={formData.phoneNo}
                  onChange={handleChange}
                />
                {fieldErrors.phoneNo && <div className="form-error">{fieldErrors.phoneNo}</div>}
              </div>
            </div>

            <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-900)', margin: '2rem 0 1.25rem', borderBottom: '1.5px solid var(--slate-100)', paddingBottom: '0.6rem' }}>
              2. Trade & Skill Profile
            </h4>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Primary Trade / Craft *</label>
                <select
                  name="trade"
                  className="form-control"
                  value={formData.trade}
                  onChange={handleChange}
                >
                  {TRADES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Experience (Years) *</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  required
                  name="experience"
                  className="form-control"
                  value={formData.experience}
                  onChange={handleChange}
                />
                {fieldErrors.experience && <div className="form-error">{fieldErrors.experience}</div>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Qualification / Certifications *</label>
                <input
                  type="text"
                  required
                  name="qualification"
                  className="form-control"
                  placeholder="e.g. ITI Certified, Apprenticeship, Diploma"
                  value={formData.qualification}
                  onChange={handleChange}
                />
                {fieldErrors.qualification && <div className="form-error">{fieldErrors.qualification}</div>}
              </div>

              {/* Change 4: Work City Dropdown */}
              <div className="form-group">
                <label className="form-label">Work City / Location *</label>
                <select
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
              {/* Change 4: Availability Dropdown (3 options) */}
              <div className="form-group">
                <label className="form-label">Availability *</label>
                <select
                  name="availability"
                  className="form-control"
                  value={formData.availability}
                  onChange={handleChange}
                >
                  {AVAILABILITY_OPTIONS.map((a) => (
                    <option key={a.value} value={a.value}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Hours of Work *</label>
                <select
                  name="hoursWork"
                  className="form-control"
                  value={formData.hoursWork}
                  onChange={handleChange}
                >
                  {HOURS_WORK.map((h) => (
                    <option key={h.value} value={h.value}>
                      {h.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '1.5rem' }}
            >
              {loading ? 'Creating Worker Profile...' : 'Complete Worker Registration'} <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--slate-600)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary-700)', fontWeight: 700 }}>
              Sign In here
            </Link>
          </div>
        </div>

        {/* Sidebar Info Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="sidebar-info-card">
            <h3>Why Join RozgaarMitra?</h3>
            <ul>
              <li>
                <CheckCircle2 size={18} color="var(--accent-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Direct Calling:</strong> Employers call your phone number directly. No agents or commission cuts.</span>
              </li>
              <li>
                <CheckCircle2 size={18} color="var(--accent-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Instant 1-Click Apply:</strong> Browse open jobs in your city and submit your profile in 1 click.</span>
              </li>
              <li>
                <CheckCircle2 size={18} color="var(--accent-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Real Trade Recognition:</strong> Clear qualification tags for your trade certificates and years of field experience.</span>
              </li>
            </ul>
          </div>

          <div className="sidebar-info-card" style={{ background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.08) 0%, rgba(37, 84, 148, 0.04) 100%)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={20} color="var(--accent-teal)" />
              Privacy & Verification
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
              Your phone number and qualifications are only shared with employers whose jobs you specifically choose to apply for.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

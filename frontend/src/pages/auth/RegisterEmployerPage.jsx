import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { Alert } from '../../components/Alert';
import { INDUSTRY_OPTIONS } from '../../utils/constants';
import { Building2, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export const RegisterEmployerPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phoneNo: '',
    companyName: '',
    industryType: 'Residential & Home Services', // Change 4: Dropdown
    address: '',
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
      const authData = await authService.registerEmployer(formData);
      login(authData);
      navigate('/employer/dashboard');
    } catch (err) {
      if (err.response?.data?.validationErrors) {
        setFieldErrors(err.response.data.validationErrors);
        setError('Please correct the highlighted errors in the form.');
      } else {
        setError(err.response?.data?.message || 'Employer registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div className="page-header">
        <h1>Register as an Employer</h1>
        <p>
          Hire skilled tradespeople for homes, sites, workshops, or commercial projects across major Indian cities
        </p>
      </div>

      {error && <Alert type="danger" message={error} onClose={() => setError('')} />}

      {/* Change 6: 2-column wide layout utilizing the full screen space */}
      <div className="wide-form-layout">
        <div className="card" style={{ padding: '2.5rem' }}>
          <form onSubmit={handleSubmit}>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-900)', marginBottom: '1.25rem', borderBottom: '1.5px solid var(--slate-100)', paddingBottom: '0.6rem' }}>
              1. Contact Person Details
            </h4>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Contact / Employer Name *</label>
                <input
                  type="text"
                  required
                  name="name"
                  className="form-control"
                  placeholder="e.g. Anil Kumar or Sharma"
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
                  placeholder="employer@example.com"
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
                  placeholder="e.g. 9812345678"
                  value={formData.phoneNo}
                  onChange={handleChange}
                />
                {fieldErrors.phoneNo && <div className="form-error">{fieldErrors.phoneNo}</div>}
              </div>
            </div>

            <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-900)', margin: '2rem 0 1.25rem', borderBottom: '1.5px solid var(--slate-100)', paddingBottom: '0.6rem' }}>
              2. Organization or Household Details
            </h4>

            <div className="form-group">
              <label className="form-label">
                Company / Business Name <span style={{ color: 'var(--slate-400)', fontWeight: 400 }}>(Optional for homeowners/individuals)</span>
              </label>
              <input
                type="text"
                name="companyName"
                className="form-control"
                placeholder="e.g. Apex Constructions, Home Interior Solutions (Leave blank if individual)"
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>

            {/* Change 4: Industry Type Dropdown */}
            <div className="form-group">
              <label className="form-label">Industry Type *</label>
              <select
                required
                name="industryType"
                className="form-control"
                value={formData.industryType}
                onChange={handleChange}
              >
                {INDUSTRY_OPTIONS.map((ind) => (
                  <option key={ind.value} value={ind.value}>
                    {ind.label}
                  </option>
                ))}
              </select>
              {fieldErrors.industryType && <div className="form-error">{fieldErrors.industryType}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Office / Site Address *</label>
              <textarea
                required
                rows={3}
                name="address"
                className="form-control"
                placeholder="Enter full physical address or site location..."
                value={formData.address}
                onChange={handleChange}
              />
              {fieldErrors.address && <div className="form-error">{fieldErrors.address}</div>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-orange btn-lg"
              style={{ width: '100%', marginTop: '1.5rem' }}
            >
              {loading ? 'Creating Employer Account...' : 'Complete Employer Registration'} <ArrowRight size={18} />
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--slate-600)' }}>
            Already registered?{' '}
            <Link to="/login" style={{ color: 'var(--accent-orange)', fontWeight: 700 }}>
              Sign In here
            </Link>
          </div>
        </div>

        {/* Sidebar Info Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="sidebar-info-card">
            <h3>Hiring Made Simple</h3>
            <ul>
              <li>
                <CheckCircle2 size={18} color="var(--accent-orange)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>No Intermediaries:</strong> Post requirements directly and receive applications from verified workers.</span>
              </li>
              <li>
                <CheckCircle2 size={18} color="var(--accent-orange)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Contractors & Homeowners:</strong> Whether hiring 1 plumber for home or 10 electricians for a commercial site.</span>
              </li>
              <li>
                <CheckCircle2 size={18} color="var(--accent-orange)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Manage Applicants:</strong> Review experience, short-list top candidates, or hire in real-time.</span>
              </li>
            </ul>
          </div>

          <div className="sidebar-info-card" style={{ background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.08) 0%, rgba(37, 84, 148, 0.04) 100%)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={20} color="var(--accent-orange)" />
              Safe & Transparent
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
              You maintain full control over opening and closing your job vacancies whenever positions are filled.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

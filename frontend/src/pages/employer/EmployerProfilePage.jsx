import React, { useState, useEffect } from 'react';
import { employerService } from '../../services/employerService';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Alert } from '../../components/Alert';
import { INDUSTRY_OPTIONS } from '../../utils/constants';
import { Building2, ShieldCheck, CheckCircle2, User, Phone, MapPin } from 'lucide-react';

export const EmployerProfilePage = () => {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phoneNo: '',
    companyName: '',
    industryType: 'Residential & Home Services', // Change 4: Dropdown
    address: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await employerService.getProfile();
        setProfile(data);
        setFormData({
          name: data.name || '',
          phoneNo: data.phoneNo || '',
          companyName: data.companyName || '',
          industryType: data.industryType || 'Residential & Home Services',
          address: data.address || '',
        });
      } catch (err) {
        setStatusMessage({
          type: 'danger',
          text: 'Failed to load employer profile.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage(null);

    try {
      setSaving(true);
      const updated = await employerService.updateProfile(formData);
      setProfile(updated);
      updateUser({ name: updated.name });
      setStatusMessage({
        type: 'success',
        text: 'Employer profile updated successfully!',
      });
    } catch (err) {
      setStatusMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to update profile.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading employer profile..." />;
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div className="page-header">
        <h1>Employer & Organization Profile</h1>
        <p>
          Manage your contact credentials, organization industry type, and site location
        </p>
      </div>

      {statusMessage && (
        <Alert
          type={statusMessage.type}
          message={statusMessage.text}
          onClose={() => setStatusMessage(null)}
        />
      )}

      {/* Change 6: Wide responsive 2-column layout */}
      <div className="wide-form-layout">
        <div className="card" style={{ padding: '2.5rem' }}>
          <form onSubmit={handleSubmit}>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-900)', marginBottom: '1.25rem', borderBottom: '1.5px solid var(--slate-100)', paddingBottom: '0.6rem' }}>
              Contact Representative Details
            </h4>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Contact Person / Name *</label>
                <input
                  type="text"
                  required
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Registered Email</label>
                <input
                  type="email"
                  disabled
                  className="form-control"
                  value={profile?.email || ''}
                  style={{ background: 'var(--slate-100)', cursor: 'not-allowed', color: 'var(--slate-500)' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                required
                name="phoneNo"
                className="form-control"
                value={formData.phoneNo}
                onChange={handleChange}
              />
            </div>

            <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-900)', margin: '2rem 0 1.25rem', borderBottom: '1.5px solid var(--slate-100)', paddingBottom: '0.6rem' }}>
              Company & Address Information
            </h4>

            <div className="form-group">
              <label className="form-label">
                Company Name <span style={{ color: 'var(--slate-400)', fontWeight: 400 }}>(Optional for individual homeowners)</span>
              </label>
              <input
                type="text"
                name="companyName"
                className="form-control"
                placeholder="e.g. Apex Enterprises"
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
            </div>

            <div className="form-group">
              <label className="form-label">Office / Site Address *</label>
              <textarea
                required
                rows={3}
                name="address"
                className="form-control"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-orange btn-lg"
              >
                {saving ? 'Saving changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Info Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="sidebar-info-card">
            <h3>Profile Summary</h3>
            <ul>
              <li>
                <User size={18} color="var(--accent-orange)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Account Type:</strong> Employer / Contractor</span>
              </li>
              <li>
                <Phone size={18} color="var(--accent-orange)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Phone Contact:</strong> {profile?.phoneNo}</span>
              </li>
              <li>
                <MapPin size={18} color="var(--accent-orange)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Base Address:</strong> {profile?.address}</span>
              </li>
            </ul>
          </div>

          <div className="sidebar-info-card" style={{ background: 'linear-gradient(135deg, rgba(234, 88, 12, 0.08) 0%, rgba(37, 84, 148, 0.04) 100%)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={20} color="var(--accent-orange)" />
              Verified Employer
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
              Keeping your address and phone number accurate allows shortlisted tradespeople to reach your site without delays.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { workerService } from '../../services/workerService';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Alert } from '../../components/Alert';
import { TRADES, HOURS_WORK, CITIES, AVAILABILITY_OPTIONS } from '../../utils/constants';
import { User, Award, CheckCircle, ShieldCheck, MapPin, Clock } from 'lucide-react';

export const WorkerProfilePage = () => {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phoneNo: '',
    qualification: '',
    experience: 0,
    availability: 'Immediate', // Change 4: Dropdown
    location: 'Mumbai', // Change 4: Dropdown
    hoursWork: 'FULL_TIME',
    trade: 'ELECTRICIAN',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await workerService.getProfile();
        setProfile(data);
        setFormData({
          name: data.name || '',
          phoneNo: data.phoneNo || '',
          qualification: data.qualification || '',
          experience: data.experience || 0,
          availability: data.availability || 'Immediate',
          location: data.location || 'Mumbai',
          hoursWork: data.hoursWork || 'FULL_TIME',
          trade: data.trade || 'ELECTRICIAN',
        });
      } catch (err) {
        setStatusMessage({
          type: 'danger',
          text: 'Failed to load profile details.',
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
      const payload = {
        ...formData,
        experience: Number(formData.experience),
      };
      const updated = await workerService.updateProfile(payload);
      setProfile(updated);
      updateUser({ name: updated.name });
      setStatusMessage({
        type: 'success',
        text: 'Your worker profile has been updated successfully!',
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
    return <LoadingSpinner text="Loading profile details..." />;
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <div className="page-header">
        <h1>Worker Profile & Trade Skills</h1>
        <p>
          Keep your skills, active trade certifications, city, and availability up to date
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
              Personal & Contact Information
            </h4>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name</label>
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

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  required
                  name="phoneNo"
                  className="form-control"
                  value={formData.phoneNo}
                  onChange={handleChange}
                />
              </div>

              {/* Change 4: City Dropdown */}
              <div className="form-group">
                <label className="form-label">Work City / Location</label>
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
              </div>
            </div>

            <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-900)', margin: '2rem 0 1.25rem', borderBottom: '1.5px solid var(--slate-100)', paddingBottom: '0.6rem' }}>
              Trade Experience & Availability
            </h4>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Primary Trade</label>
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
                <label className="form-label">Experience (Years)</label>
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
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Qualifications / Certifications</label>
                <input
                  type="text"
                  required
                  name="qualification"
                  className="form-control"
                  value={formData.qualification}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Hours of Work</label>
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

            {/* Change 4: Availability Dropdown (3 options) */}
            <div className="form-group">
              <label className="form-label">Current Availability</label>
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

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary btn-lg"
              >
                {saving ? 'Saving changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Info Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="sidebar-info-card">
            <h3>Profile Status</h3>
            <ul>
              <li>
                <Award size={18} color="var(--accent-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Specialty:</strong> {profile?.trade}</span>
              </li>
              <li>
                <Clock size={18} color="var(--accent-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Experience:</strong> {profile?.experience} Years in Trade</span>
              </li>
              <li>
                <MapPin size={18} color="var(--accent-teal)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Active City:</strong> {profile?.location}</span>
              </li>
            </ul>
          </div>

          <div className="sidebar-info-card" style={{ background: 'linear-gradient(135deg, rgba(13, 148, 136, 0.08) 0%, rgba(37, 84, 148, 0.04) 100%)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={20} color="var(--accent-teal)" />
              Profile Tip
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
              Keeping your current availability status accurate allows employers to contact you for projects that align with your schedule.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

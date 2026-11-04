import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Wrench, Shield, CheckCircle, ArrowRight, Zap, Award, Building2 } from 'lucide-react';
import { CITIES } from '../utils/constants';

export const HomePage = () => {
  const [searchCategory, setSearchCategory] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchCategory) query.set('category', searchCategory);
    if (searchLocation) query.set('location', searchLocation);
    navigate(`/jobs?${query.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(8px)',
          }}>
            <Zap size={16} color="var(--accent-orange)" />
            <span>Direct Skilled Work Platform for India</span>
          </div>

          <h1>Connecting Skilled Trades With Honest Work</h1>
          <p>
            Whether you are an electrician, plumber, carpenter, welder, or an employer looking for verified craftspeople—RozgaarMitra brings dignity and speed to skilled hiring.
          </p>

          {/* Quick Search Form */}
          <form
            onSubmit={handleSearch}
            style={{
              background: '#ffffff',
              padding: '0.75rem',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '760px',
              margin: '0 auto',
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap',
              boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.35)',
              alignItems: 'center',
            }}
          >
            <div style={{ flex: '1 1 220px', display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.4rem 0.75rem' }}>
              <Wrench size={18} color="var(--slate-400)" />
              <input
                type="text"
                placeholder="Trade (e.g. Electrician, Plumber)"
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                style={{ width: '100%', border: 'none', outline: 'none', fontSize: '0.95rem', color: 'var(--slate-800)' }}
              />
            </div>

            <div style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.4rem 0.75rem', borderLeft: '1px solid var(--slate-200)' }}>
              <MapPin size={18} color="var(--slate-400)" />
              <select
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                style={{ width: '100%', border: 'none', outline: 'none', fontSize: '0.95rem', color: searchLocation ? 'var(--slate-800)' : 'var(--slate-400)', background: 'transparent' }}
              >
                <option value="">All Cities</option>
                {CITIES.map((c) => (
                  <option key={c.value} value={c.value} style={{ color: 'var(--slate-800)' }}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
              <Search size={18} /> Search Jobs
            </button>
          </form>

          {/* Big Action Registration Cards (Change 3) */}
          <div className="hero-cta-grid">
            <Link to="/register/worker" className="cta-card worker">
              <div className="cta-card-icon">
                <Award size={34} />
              </div>
              <div style={{ display: 'inline-block', background: 'var(--accent-teal-light)', color: 'var(--accent-teal-dark)', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', marginBottom: '0.6rem', width: 'fit-content' }}>
                FOR ARTISANS & TRADESPEOPLE
              </div>
              <h2>Register as Worker</h2>
              <p>
                Create your professional craft profile. Choose your trade, set your availability, and start receiving job offers directly from local contractors and homeowners with zero commission fees.
              </p>
              <div className="cta-card-btn">
                <span>Create Worker Profile</span>
                <ArrowRight size={20} />
              </div>
            </Link>

            <Link to="/register/employer" className="cta-card employer">
              <div className="cta-card-icon">
                <Building2 size={34} />
              </div>
              <div style={{ display: 'inline-block', background: 'var(--accent-orange-light)', color: 'var(--accent-orange-dark)', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', marginBottom: '0.6rem', width: 'fit-content' }}>
                FOR HOMEOWNERS & BUSINESSES
              </div>
              <h2>Register as Employer</h2>
              <p>
                Hire verified tradespeople for construction projects, renovations, site work, or emergency maintenance. Post vacancies in minutes and review skilled applicants immediately.
              </p>
              <div className="cta-card-btn">
                <span>Start Hiring Workers</span>
                <ArrowRight size={20} />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section style={{ padding: '5rem 0', background: '#ffffff', borderTop: '1px solid var(--slate-200)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2.1rem' }}>How RozgaarMitra Works</h2>
            <p style={{ fontSize: '1.05rem', maxWidth: '600px', margin: '0.5rem auto 0' }}>
              Simple, reliable 3-step process designed for practical skilled trade hiring across India
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 2rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, var(--primary-800) 0%, var(--primary-950) 100%)',
                color: '#fff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '1.5rem',
                fontWeight: 800,
                boxShadow: '0 8px 18px rgba(16, 42, 76, 0.25)',
              }}>
                1
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.65rem' }}>Create Profile</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
                Register as a skilled worker with your craft and experience, or register as an employer with your site address.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 2rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, var(--accent-teal) 0%, var(--accent-teal-dark) 100%)',
                color: '#fff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '1.5rem',
                fontWeight: 800,
                boxShadow: '0 8px 18px var(--accent-teal-glow)',
              }}>
                2
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.65rem' }}>Post or Browse Jobs</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
                Employers post vacancies with set salary and city locations. Workers search by trade and view immediate requirements.
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center', padding: '2.5rem 2rem' }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, var(--accent-orange) 0%, var(--accent-orange-dark) 100%)',
                color: '#fff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                fontSize: '1.5rem',
                fontWeight: 800,
                boxShadow: '0 8px 18px var(--accent-orange-glow)',
              }}>
                3
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.65rem' }}>Apply & Connect</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
                Workers apply in 1-click. Employers review trade experience and contact or hire directly without middlemen.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

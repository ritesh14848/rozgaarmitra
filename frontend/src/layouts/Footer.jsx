import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Wrench, Shield, CheckCircle } from 'lucide-react';
import { TRADES } from '../utils/constants';

export const Footer = () => {
  const location = useLocation();

  // Change 5: Only show footer on the home page and both dashboards
  const allowedPaths = ['/', '/worker/dashboard', '/employer/dashboard'];
  const showFooter = allowedPaths.includes(location.pathname);

  if (!showFooter) {
    return null;
  }

  return (
    <footer className="footer">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#fff', fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>
              <div style={{ background: 'var(--accent-orange)', padding: '0.45rem', borderRadius: '8px', display: 'flex' }}>
                <Wrench size={18} color="#fff" />
              </div>
              <span>RozgaarMitra</span>
            </div>
            <p style={{ color: 'var(--slate-400)', fontSize: '0.9rem', lineHeight: 1.65 }}>
              Connecting verified, skilled tradespeople—electricians, plumbers, carpenters, welders, and technicians—directly with local homeowners and businesses.
            </p>
          </div>

          <div>
            <h4>Popular Trades</h4>
            <ul className="footer-links">
              {TRADES.slice(0, 5).map(trade => (
                <li key={trade.value}>
                  <Link to={`/jobs?category=${encodeURIComponent(trade.value)}`}>
                    {trade.label} Jobs
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/jobs">Search Open Jobs</Link></li>
              <li><Link to="/register/worker">Join as a Skilled Worker</Link></li>
              <li><Link to="/register/employer">Post Job as Employer</Link></li>
              <li><Link to="/login">Account Login</Link></li>
            </ul>
          </div>

          <div>
            <h4>Trust & Verification</h4>
            <ul style={{ listStyle: 'none', color: 'var(--slate-400)', fontSize: '0.875rem', lineHeight: 1.8 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={15} color="var(--accent-teal)" />
                Direct local hiring
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={15} color="var(--accent-teal)" />
                Role-based security
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={15} color="var(--accent-teal)" />
                Transparent pay & terms
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} RozgaarMitra. Built for skilled trades, artisans, and Indian industry.</p>
        </div>
      </div>
    </footer>
  );
};

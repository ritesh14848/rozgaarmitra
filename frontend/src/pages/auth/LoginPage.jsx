import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { Alert } from '../../components/Alert';
import { Lock, Mail, ArrowRight, UserCheck, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isExpired = new URLSearchParams(location.search).get('expired') === 'true';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide both email address and password.');
      return;
    }

    try {
      setLoading(true);
      const authData = await authService.login({ email, password });
      const user = login(authData);

      if (user.role === 'WORKER') {
        navigate('/worker/dashboard');
      } else if (user.role === 'EMPLOYER') {
        navigate('/employer/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem', maxWidth: '540px' }}>
      <div className="card" style={{ padding: '3rem 2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'linear-gradient(135deg, rgba(37, 84, 148, 0.1) 0%, rgba(16, 42, 76, 0.15) 100%)',
            color: 'var(--primary-800)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}>
            <UserCheck size={28} />
          </div>
          <h2 style={{ fontSize: '1.85rem', color: 'var(--slate-900)' }}>Account Sign In</h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--slate-500)', marginTop: '0.35rem' }}>
            Access your RozgaarMitra dashboard to manage jobs or trade applications
          </p>
        </div>

        {isExpired && (
          <Alert type="warning" message="Your session has expired. Please log in again." />
        )}

        {error && (
          <Alert type="danger" message={error} onClose={() => setError('')} />
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                className="form-control"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '1rem' }}
          >
            {loading ? 'Signing in...' : 'Sign In'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{
          marginTop: '2.5rem',
          paddingTop: '1.75rem',
          borderTop: '1px solid var(--slate-100)',
          textAlign: 'center',
          fontSize: '0.925rem',
          color: 'var(--slate-600)'
        }}>
          <p style={{ marginBottom: '0.85rem' }}>Don't have an account yet?</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/register/worker" style={{ color: 'var(--primary-700)', fontWeight: 700 }}>
              Join as Worker
            </Link>
            <span style={{ color: 'var(--slate-300)' }}>•</span>
            <Link to="/register/employer" style={{ color: 'var(--accent-orange)', fontWeight: 700 }}>
              Register as Employer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

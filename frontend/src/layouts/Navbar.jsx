import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Wrench, User, LogOut, Menu, X, PlusCircle, Briefcase, FileText, LayoutDashboard, Search } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated, isWorker, isEmployer, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar">
      <div className="container nav-container">
        <Link to="/" className="nav-brand" onClick={closeMenu}>
          <div className="nav-brand-logo">
            <Wrench size={20} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--primary-900)' }}>
              Rozgaar<span style={{ color: 'var(--accent-orange)' }}>Mitra</span>
            </span>
            <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--slate-500)', letterSpacing: '0.04em' }}>
              SKILLED TRADES PLATFORM
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="nav-links">
          <NavLink to="/jobs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Search size={16} /> Browse Jobs
          </NavLink>

          {isAuthenticated ? (
            <>
              {isWorker && (
                <>
                  <NavLink to="/worker/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <LayoutDashboard size={16} /> Dashboard
                  </NavLink>
                  <NavLink to="/worker/applications" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <FileText size={16} /> My Applications
                  </NavLink>
                  <NavLink to="/worker/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <User size={16} /> Profile
                  </NavLink>
                </>
              )}

              {isEmployer && (
                <>
                  <NavLink to="/employer/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <LayoutDashboard size={16} /> Dashboard
                  </NavLink>
                  <NavLink to="/employer/jobs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <Briefcase size={16} /> Manage Jobs
                  </NavLink>
                  <NavLink to="/employer/post-job" className="btn btn-orange btn-sm" style={{ margin: '0 0.35rem' }}>
                    <PlusCircle size={16} /> Post a Job
                  </NavLink>
                  <NavLink to="/employer/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <User size={16} /> Profile
                  </NavLink>
                </>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem', borderLeft: '1px solid var(--slate-200)', paddingLeft: '0.9rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--slate-700)' }}>
                  Hi, {user?.name?.split(' ')[0]}
                </span>
                <button onClick={handleLogout} className="btn btn-outline btn-sm" title="Log out">
                  <LogOut size={15} /> Logout
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/register/worker" className="btn btn-primary btn-sm">
                Join as Worker
              </Link>
              <Link to="/register/employer" className="btn btn-orange btn-sm">
                Hire Workers
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ display: 'none', padding: '0.5rem' }}
          className="mobile-toggle"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          background: '#ffffff',
          padding: '1.25rem',
          borderBottom: '1px solid var(--slate-200)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <Link to="/jobs" onClick={closeMenu} className="nav-link">Browse Jobs</Link>
          {isAuthenticated ? (
            <>
              {isWorker && (
                <>
                  <Link to="/worker/dashboard" onClick={closeMenu} className="nav-link">Dashboard</Link>
                  <Link to="/worker/applications" onClick={closeMenu} className="nav-link">My Applications</Link>
                  <Link to="/worker/profile" onClick={closeMenu} className="nav-link">Profile</Link>
                </>
              )}
              {isEmployer && (
                <>
                  <Link to="/employer/dashboard" onClick={closeMenu} className="nav-link">Dashboard</Link>
                  <Link to="/employer/jobs" onClick={closeMenu} className="nav-link">Manage Jobs</Link>
                  <Link to="/employer/post-job" onClick={closeMenu} className="nav-link">Post a Job</Link>
                  <Link to="/employer/profile" onClick={closeMenu} className="nav-link">Profile</Link>
                </>
              )}
              <button onClick={() => { closeMenu(); handleLogout(); }} className="btn btn-outline btn-sm">
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={closeMenu} className="btn btn-outline">Login</Link>
              <Link to="/register/worker" onClick={closeMenu} className="btn btn-primary">Join as Worker</Link>
              <Link to="/register/employer" onClick={closeMenu} className="btn btn-orange">Hire Workers</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

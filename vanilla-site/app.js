// RozgaarMitra Application Controller (app.js)

const TRADES = [
  { value: 'ELECTRICIAN', label: 'Electrician' },
  { value: 'PLUMBER', label: 'Plumber' },
  { value: 'CARPENTER', label: 'Carpenter' },
  { value: 'PAINTER', label: 'Painter' },
  { value: 'WELDER', label: 'Welder' },
  { value: 'AC_TECHNICIAN', label: 'AC & Refrigeration Tech' },
  { value: 'MECHANIC', label: 'Mechanic' },
  { value: 'MASON', label: 'Mason / Bricklayer' },
  { value: 'OTHER', label: 'Other Skilled Trade' }
];

const CITIES = ['Mumbai', 'Pune', 'Delhi', 'Kolkata', 'Chennai'];

const AVAILABILITY_OPTIONS = [
  'Immediate',
  'Within 1 Week',
  'Part-Time / Weekends Only'
];

const INDUSTRY_OPTIONS = [
  'Residential & Home Services',
  'Construction & Real Estate',
  'Commercial & Retail Facilities',
  'Manufacturing & Industrial',
  'Automotive & Mechanical Works'
];

// Utility: Toast notification
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Router & State Management
class AppRouter {
  constructor() {
    this.currentRoute = '';
    window.addEventListener('hashchange', () => this.handleRoute());
  }

  init() {
    this.renderNavbar();
    this.handleRoute();
  }

  getRoute() {
    const hash = window.location.hash.slice(1);
    return hash || 'home';
  }

  navigate(route) {
    window.location.hash = route;
  }

  handleRoute() {
    const rawRoute = this.getRoute();
    const [path, param] = rawRoute.split('/');
    this.currentRoute = path;

    // Update Navbar active states
    this.renderNavbar();

    // Render Page View
    const mainEl = document.getElementById('app-main');
    const footerEl = document.getElementById('app-footer');

    // Rule: Show footer ONLY on home, worker-dashboard, and employer-dashboard
    const showFooter = ['home', 'worker-dashboard', 'employer-dashboard'].includes(path);
    footerEl.style.display = showFooter ? 'block' : 'none';

    window.scrollTo(0, 0);

    const session = Store.getSession();

    switch (path) {
      case 'home':
        this.renderHome(mainEl);
        break;
      case 'browse':
        this.renderBrowse(mainEl);
        break;
      case 'job':
        this.renderJobDetails(mainEl, param);
        break;
      case 'login':
        if (session) return this.redirectByRole(session);
        this.renderLogin(mainEl);
        break;
      case 'register-worker':
        if (session) return this.redirectByRole(session);
        this.renderRegisterWorker(mainEl);
        break;
      case 'register-employer':
        if (session) return this.redirectByRole(session);
        this.renderRegisterEmployer(mainEl);
        break;
      case 'worker-dashboard':
        if (!session || session.role !== 'WORKER') return this.navigate('login');
        this.renderWorkerDashboard(mainEl);
        break;
      case 'my-applications':
        if (!session || session.role !== 'WORKER') return this.navigate('login');
        this.renderMyApplications(mainEl);
        break;
      case 'worker-profile':
        if (!session || session.role !== 'WORKER') return this.navigate('login');
        this.renderWorkerProfile(mainEl);
        break;
      case 'employer-dashboard':
        if (!session || session.role !== 'EMPLOYER') return this.navigate('login');
        this.renderEmployerDashboard(mainEl);
        break;
      case 'post-job':
        if (!session || session.role !== 'EMPLOYER') return this.navigate('login');
        this.renderPostJob(mainEl);
        break;
      case 'manage-jobs':
        if (!session || session.role !== 'EMPLOYER') return this.navigate('login');
        this.renderManageJobs(mainEl);
        break;
      case 'employer-profile':
        if (!session || session.role !== 'EMPLOYER') return this.navigate('login');
        this.renderEmployerProfile(mainEl);
        break;
      default:
        this.renderHome(mainEl);
    }
  }

  redirectByRole(session) {
    if (session.role === 'WORKER') this.navigate('worker-dashboard');
    else if (session.role === 'EMPLOYER') this.navigate('employer-dashboard');
    else this.navigate('home');
  }

  renderNavbar() {
    const navEl = document.getElementById('app-navbar');
    const session = Store.getSession();
    const route = this.currentRoute;

    let linksHtml = '';

    if (!session) {
      // Guest
      linksHtml = `
        <a href="#home" class="nav-tab ${route === 'home' ? 'active' : ''}">Home</a>
        <a href="#browse" class="nav-tab ${route === 'browse' ? 'active' : ''}">Browse Jobs</a>
        <a href="#login" class="nav-tab ${route === 'login' ? 'active' : ''}">Login</a>
        <a href="#register-worker" class="btn btn-teal">Join as Worker</a>
        <a href="#register-employer" class="btn btn-primary">Hire Trades</a>
      `;
    } else if (session.role === 'WORKER') {
      // Worker
      linksHtml = `
        <a href="#worker-dashboard" class="nav-tab ${route === 'worker-dashboard' ? 'active' : ''}">Dashboard</a>
        <a href="#browse" class="nav-tab ${route === 'browse' ? 'active' : ''}">Browse Jobs</a>
        <a href="#my-applications" class="nav-tab ${route === 'my-applications' ? 'active' : ''}">My Applications</a>
        <a href="#worker-profile" class="nav-tab ${route === 'worker-profile' ? 'active' : ''}">Profile</a>
        <div class="user-badge">👷 ${escapeHtml(session.name)}</div>
        <button onclick="App.logout()" class="nav-tab" style="background:none;">Logout ↪</button>
      `;
    } else if (session.role === 'EMPLOYER') {
      // Employer
      linksHtml = `
        <a href="#employer-dashboard" class="nav-tab ${route === 'employer-dashboard' ? 'active' : ''}">Dashboard</a>
        <a href="#manage-jobs" class="nav-tab ${route === 'manage-jobs' ? 'active' : ''}">Manage Jobs & Applicants</a>
        <a href="#post-job" class="nav-tab btn-post-job">➕ Post a Job</a>
        <a href="#employer-profile" class="nav-tab ${route === 'employer-profile' ? 'active' : ''}">Profile</a>
        <div class="user-badge">🏢 ${escapeHtml(session.name)}</div>
        <button onclick="App.logout()" class="nav-tab" style="background:none;">Logout ↪</button>
      `;
    }

    navEl.innerHTML = `
      <div class="wide-container nav-container">
        <a href="#home" class="brand">
          <div class="brand-icon">🔧</div>
          <div>
            <div class="brand-title">RozgaarMitra</div>
          </div>
          <span class="brand-badge">Skilled Trades</span>
        </a>
        <div class="nav-links">${linksHtml}</div>
      </div>
    `;
  }

  // ==================== PAGE: HOME ====================
  renderHome(container) {
    container.innerHTML = `
      <section class="hero">
        <div class="wide-container hero-content">
          <div class="hero-pill">⚡ India's Dedicated Skilled Trades Platform</div>
          <h1 class="hero-title">Connecting Skilled Trades <span>With Honest Work</span></h1>
          <p class="hero-desc">
            Directly connect verified electricians, plumbers, carpenters, welders, and technicians 
            with local contractors, businesses, and households. Transparent terms, zero middlemen.
          </p>

          <!-- Search Bar with City Dropdown -->
          <div class="search-box-card">
            <div class="search-input-group" style="flex: 1.5;">
              <span>🔍</span>
              <input type="text" id="home-search-keyword" placeholder="Search trade e.g. Electrician, AC Repair, Plumbing..." />
            </div>
            <div class="search-input-group">
              <span>📍</span>
              <select id="home-search-city">
                <option value="">All Cities</option>
                ${CITIES.map(c => `<option value="${c}">${c}</option>`).join('')}
              </select>
            </div>
            <button onclick="App.handleHomeSearch()" class="btn btn-primary" style="padding: 12px 28px;">
              Find Jobs
            </button>
          </div>

          <!-- Large Prominent Registration CTA Cards -->
          <div class="hero-cta-grid">
            <div class="cta-card cta-card-worker" onclick="App.navigate('register-worker')">
              <div>
                <div class="cta-icon-box cta-icon-worker">👷</div>
                <div class="cta-badge" style="color: #2dd4bf;">For Tradespeople & Technicians</div>
                <h3 class="cta-title">Register as a Worker</h3>
                <p class="cta-desc">
                  Create your verified trades profile. Select your trade, city, and daily availability.
                  Apply for high-paying vacancies directly with verified employers.
                </p>
              </div>
              <span class="btn btn-teal btn-block">Join as Skilled Worker ➔</span>
            </div>

            <div class="cta-card cta-card-employer" onclick="App.navigate('register-employer')">
              <div>
                <div class="cta-icon-box cta-icon-employer">🏢</div>
                <div class="cta-badge" style="color: #fb923c;">For Contractors & Businesses</div>
                <h3 class="cta-title">Register as an Employer</h3>
                <p class="cta-desc">
                  Hire verified skilled tradespeople across 5 major metro cities. Post job vacancies in minutes,
                  review candidate credentials, and manage applications transparently.
                </p>
              </div>
              <span class="btn btn-primary btn-block">Register as Employer ➔</span>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // ==================== PAGE: BROWSE JOBS ====================
  renderBrowse(container) {
    const jobs = Store.getJobs({ status: 'OPEN' });

    container.innerHTML = `
      <div class="wide-container" style="padding: 40px 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <div>
            <h1 style="font-size: 28px; font-weight: 800;">Browse Open Skilled Vacancies</h1>
            <p style="color: var(--slate-500); font-size: 14px;">Explore active job listings verified by employers across India</p>
          </div>
        </div>

        <!-- Filter Bar -->
        <div style="background: white; padding: 20px; border-radius: var(--radius-lg); border: 1px solid var(--slate-200); margin-bottom: 32px; display: flex; gap: 16px; flex-wrap: wrap;">
          <input type="text" id="filter-search" class="form-control" style="flex: 2; min-width: 240px;" placeholder="Search keywords..." oninput="App.applyFilters()" />
          <select id="filter-trade" class="form-control" style="flex: 1; min-width: 180px;" onchange="App.applyFilters()">
            <option value="">All Trades</option>
            ${TRADES.map(t => `<option value="${t.value}">${t.label}</option>`).join('')}
          </select>
          <select id="filter-city" class="form-control" style="flex: 1; min-width: 160px;" onchange="App.applyFilters()">
            <option value="">All Cities</option>
            ${CITIES.map(c => `<option value="${c}">${c}</option>`).join('')}
          </select>
          <button onclick="App.resetFilters()" class="btn btn-outline">Reset</button>
        </div>

        <!-- Jobs Grid -->
        <div id="browse-jobs-list" class="jobs-grid">
          ${this.renderJobCardsHtml(jobs)}
        </div>
      </div>
    `;
  }

  renderJobCardsHtml(jobs) {
    if (!jobs || jobs.length === 0) {
      return `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: white; border-radius: var(--radius-lg); border: 1px dashed var(--slate-300);">
          <div style="font-size: 40px; margin-bottom: 12px;">🔍</div>
          <h3 style="font-size: 18px; font-weight: 700; color: var(--slate-800);">No jobs matching your filter</h3>
          <p style="color: var(--slate-500); font-size: 14px; margin-top: 6px;">Try resetting filters or searching a different city or trade.</p>
        </div>
      `;
    }

    return jobs.map(job => `
      <div class="job-card">
        <div>
          <div class="job-header">
            <h3 class="job-title">${escapeHtml(job.jobTitle)}</h3>
            <span class="status-pill status-accepted">Open</span>
          </div>
          <div class="job-company">🏢 ${escapeHtml(job.employer.companyName || 'Verified Employer')}</div>
          <div class="job-tags">
            <span class="tag-badge">🛠️ ${formatTrade(job.jobCategory)}</span>
            <span class="tag-badge tag-city">📍 ${escapeHtml(job.location)}</span>
            <span class="tag-badge tag-salary">💰 ${escapeHtml(job.salary)}</span>
            <span class="tag-badge">👥 ${job.vacancyCount} Openings</span>
          </div>
          <p class="job-desc-snippet">${escapeHtml(job.description)}</p>
        </div>
        <div style="display: flex; gap: 12px; margin-top: 16px;">
          <button onclick="App.navigate('job/${job.jobId}')" class="btn btn-outline" style="flex: 1;">View Details</button>
          <button onclick="App.handleQuickApply(${job.jobId})" class="btn btn-teal" style="flex: 1;">
            ${Store.hasWorkerApplied(job.jobId) ? '✓ Applied' : 'Apply Now'}
          </button>
        </div>
      </div>
    `).join('');
  }

  // ==================== PAGE: JOB DETAILS ====================
  renderJobDetails(container, jobId) {
    const job = Store.getJobById(jobId);
    if (!job) {
      container.innerHTML = `
        <div class="wide-container" style="padding: 80px 24px; text-align: center;">
          <h2>Job Not Found</h2>
          <p style="color: var(--slate-500); margin: 12px 0 24px;">The job posting you are looking for does not exist or has been removed.</p>
          <button onclick="App.navigate('browse')" class="btn btn-primary">Back to Jobs</button>
        </div>
      `;
      return;
    }

    const session = Store.getSession();
    const hasApplied = Store.hasWorkerApplied(job.jobId);

    container.innerHTML = `
      <div class="wide-container wide-form-layout">
        <!-- Main Job Info -->
        <div class="form-main-card">
          <button onclick="App.navigate('browse')" class="btn btn-outline" style="margin-bottom: 24px;">← Back to All Jobs</button>
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
            <div>
              <h1 style="font-size: 28px; font-weight: 800; color: var(--slate-900);">${escapeHtml(job.jobTitle)}</h1>
              <div style="font-size: 16px; font-weight: 600; color: var(--primary-600); margin-top: 4px;">
                🏢 ${escapeHtml(job.employer.companyName || 'Verified Employer')}
              </div>
            </div>
            <span class="status-pill status-accepted" style="font-size: 14px; padding: 6px 16px;">${job.status}</span>
          </div>

          <div class="job-tags" style="margin: 20px 0;">
            <span class="tag-badge" style="font-size: 14px; padding: 6px 14px;">🛠️ ${formatTrade(job.jobCategory)}</span>
            <span class="tag-badge tag-city" style="font-size: 14px; padding: 6px 14px;">📍 ${escapeHtml(job.location)}</span>
            <span class="tag-badge tag-salary" style="font-size: 14px; padding: 6px 14px;">💰 ${escapeHtml(job.salary)}</span>
            <span class="tag-badge" style="font-size: 14px; padding: 6px 14px;">⏳ Min. Experience: ${job.experienceRequired} Years</span>
            <span class="tag-badge" style="font-size: 14px; padding: 6px 14px;">👥 Vacancies: ${job.vacancyCount}</span>
          </div>

          <div style="margin: 32px 0;">
            <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 12px;">Job Description</h3>
            <div style="font-size: 15px; color: var(--slate-700); line-height: 1.8; white-space: pre-line;">${escapeHtml(job.description)}</div>
          </div>

          <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid var(--slate-200);">
            ${hasApplied 
              ? `<div class="status-pill status-accepted" style="font-size: 15px; padding: 12px 24px;">✓ You have already applied for this position</div>`
              : `<button onclick="App.handleApplyInDetails(${job.jobId})" class="btn btn-teal" style="font-size: 16px; padding: 14px 36px;">
                  Apply for this Vacancy ➔
                 </button>`
            }
          </div>
        </div>

        <!-- Sidebar: Employer Info -->
        <div class="sidebar-info-card">
          <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 16px;">Employer Information</h3>
          <div style="margin-bottom: 14px;">
            <div style="font-size: 12px; color: var(--slate-500); font-weight: 600;">COMPANY NAME</div>
            <div style="font-size: 15px; font-weight: 700; color: var(--slate-800);">${escapeHtml(job.employer.companyName || 'Independent Employer')}</div>
          </div>
          <div style="margin-bottom: 14px;">
            <div style="font-size: 12px; color: var(--slate-500); font-weight: 600;">INDUSTRY SECTOR</div>
            <div style="font-size: 14px; color: var(--slate-800);">${escapeHtml(job.employer.industryType || 'General Facilities')}</div>
          </div>
          <div style="margin-bottom: 14px;">
            <div style="font-size: 12px; color: var(--slate-500); font-weight: 600;">SITE / OFFICE ADDRESS</div>
            <div style="font-size: 14px; color: var(--slate-800);">${escapeHtml(job.employer.address || 'Location provided upon selection')}</div>
          </div>
          <div style="margin-top: 24px; padding: 16px; background: var(--slate-50); border-radius: var(--radius-md); border: 1px solid var(--slate-200);">
            <div style="font-size: 13px; font-weight: 700; color: var(--accent-teal);">🛡️ Verified Hiring</div>
            <div style="font-size: 12px; color: var(--slate-600); margin-top: 4px;">Direct connection. No agency deductions.</div>
          </div>
        </div>
      </div>
    `;
  }

  // ==================== PAGE: LOGIN ====================
  renderLogin(container) {
    container.innerHTML = `
      <div class="wide-container" style="max-width: 520px; padding: 60px 24px;">
        <div class="form-main-card">
          <div style="text-align: center; margin-bottom: 28px;">
            <div style="font-size: 36px; margin-bottom: 12px;">🔐</div>
            <h1 class="form-title">Account Login</h1>
            <p class="form-subtitle">Enter your registered email and password to access your dashboard</p>
          </div>

          <form onsubmit="App.handleLogin(event)">
            <div class="form-group">
              <label class="form-label">Email Address *</label>
              <input type="email" id="login-email" class="form-control" required placeholder="name@example.com" value="ramesh.worker@example.com" />
            </div>

            <div class="form-group">
              <label class="form-label">Password *</label>
              <input type="password" id="login-password" class="form-control" required placeholder="Enter your password" value="password123" />
            </div>

            <button type="submit" class="btn btn-primary btn-block" style="padding: 14px; margin-top: 10px;">
              Sign In to RozgaarMitra
            </button>
          </form>

          <div style="margin-top: 24px; text-align: center; font-size: 14px; color: var(--slate-600);">
            Don't have an account? <br/>
            <a href="#register-worker" style="color: var(--accent-teal); font-weight: 700;">Join as Skilled Worker</a> • 
            <a href="#register-employer" style="color: var(--accent-orange); font-weight: 700;">Join as Employer</a>
          </div>
        </div>
      </div>
    `;
  }

  // ==================== PAGE: REGISTER WORKER ====================
  renderRegisterWorker(container) {
    container.innerHTML = `
      <div class="wide-container wide-form-layout">
        <div class="form-main-card">
          <h1 class="form-title">Skilled Worker Registration</h1>
          <p class="form-subtitle">Register your trade skills to connect directly with hiring employers in your city.</p>

          <form onsubmit="App.handleRegisterWorker(event)">
            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Full Name *</label>
                <input type="text" id="w-name" class="form-control" required placeholder="e.g. Ramesh Sharma" />
              </div>
              <div class="form-group">
                <label class="form-label">Phone Number *</label>
                <input type="tel" id="w-phone" class="form-control" required placeholder="e.g. +91 98765 43210" />
              </div>
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Email Address *</label>
                <input type="email" id="w-email" class="form-control" required placeholder="name@example.com" />
              </div>
              <div class="form-group">
                <label class="form-label">Password *</label>
                <input type="password" id="w-password" class="form-control" required minlength="6" placeholder="Min. 6 characters" />
              </div>
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Skilled Trade Category *</label>
                <select id="w-trade" class="form-control" required>
                  <option value="">Select your primary trade</option>
                  ${TRADES.map(t => `<option value="${t.value}">${t.label}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Years of Experience *</label>
                <input type="number" id="w-exp" class="form-control" required min="0" max="40" placeholder="e.g. 4" />
              </div>
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">City Location (Choose City) *</label>
                <select id="w-city" class="form-control" required>
                  <option value="">Choose City</option>
                  ${CITIES.map(c => `<option value="${c}">${c}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Availability Status *</label>
                <select id="w-avail" class="form-control" required>
                  <option value="">Select Availability</option>
                  ${AVAILABILITY_OPTIONS.map(a => `<option value="${a}">${a}</option>`).join('')}
                </select>
              </div>
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Work Type Preference *</label>
                <select id="w-hours" class="form-control" required>
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Vocational Qualification / ITI (Optional)</label>
                <input type="text" id="w-qual" class="form-control" placeholder="e.g. ITI Certified or Practical Apprenticeship" />
              </div>
            </div>

            <button type="submit" class="btn btn-teal btn-block" style="padding: 14px; margin-top: 10px;">
              Create Worker Profile & Sign In ➔
            </button>
          </form>
        </div>

        <!-- Sidebar Guide -->
        <div class="sidebar-info-card">
          <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 16px;">Why Join RozgaarMitra?</h3>
          <ul style="list-style: none; font-size: 14px; color: var(--slate-700); line-height: 1.8;">
            <li>✓ <strong>Direct Client Access:</strong> Connect with real employers without contractor commission cuts.</li>
            <li>✓ <strong>Transparent Pay:</strong> View guaranteed salary brackets before applying.</li>
            <li>✓ <strong>City-Specific Hiring:</strong> Discover local job vacancies right in your city.</li>
            <li>✓ <strong>Single-Click Application:</strong> Apply to jobs with instant status tracking.</li>
          </ul>
        </div>
      </div>
    `;
  }

  // ==================== PAGE: REGISTER EMPLOYER ====================
  renderRegisterEmployer(container) {
    container.innerHTML = `
      <div class="wide-container wide-form-layout">
        <div class="form-main-card">
          <h1 class="form-title">Employer / Contractor Registration</h1>
          <p class="form-subtitle">Register to post vacancies and hire verified skilled tradespeople.</p>

          <form onsubmit="App.handleRegisterEmployer(event)">
            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Full Name / Contact Person *</label>
                <input type="text" id="e-name" class="form-control" required placeholder="e.g. Ritesh Mahajan" />
              </div>
              <div class="form-group">
                <label class="form-label">Phone Number *</label>
                <input type="tel" id="e-phone" class="form-control" required placeholder="e.g. +91 91234 56789" />
              </div>
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Email Address *</label>
                <input type="email" id="e-email" class="form-control" required placeholder="name@company.com" />
              </div>
              <div class="form-group">
                <label class="form-label">Password *</label>
                <input type="password" id="e-password" class="form-control" required minlength="6" placeholder="Min. 6 characters" />
              </div>
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Company / Firm Name (Optional for Individuals)</label>
                <input type="text" id="e-company" class="form-control" placeholder="e.g. Apex Facilities & Services" />
              </div>
              <div class="form-group">
                <label class="form-label">Industry Sector *</label>
                <select id="e-industry" class="form-control" required>
                  <option value="">Select Industry Type</option>
                  ${INDUSTRY_OPTIONS.map(i => `<option value="${i}">${i}</option>`).join('')}
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Office / Site Address *</label>
              <textarea id="e-address" class="form-control" required rows="3" placeholder="Enter your office, shop, or principal work site address"></textarea>
            </div>

            <button type="submit" class="btn btn-primary btn-block" style="padding: 14px; margin-top: 10px;">
              Create Employer Profile & Start Hiring ➔
            </button>
          </form>
        </div>

        <!-- Sidebar Guide -->
        <div class="sidebar-info-card">
          <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 16px;">Hiring with RozgaarMitra</h3>
          <ul style="list-style: none; font-size: 14px; color: var(--slate-700); line-height: 1.8;">
            <li>✓ <strong>Verified Candidates:</strong> Review profiles with verified trades and verified years of experience.</li>
            <li>✓ <strong>Structured Pipeline:</strong> Filter, shortlist, accept, or decline applications effortlessly.</li>
            <li>✓ <strong>Direct Communication:</strong> Direct candidate phone and email access upon shortlisting.</li>
            <li>✓ <strong>100% Free Forever:</strong> Zero platform commission on jobs posted.</li>
          </ul>
        </div>
      </div>
    `;
  }

  // ==================== PAGE: WORKER DASHBOARD ====================
  renderWorkerDashboard(container) {
    const session = Store.getSession();
    const myApps = Store.getWorkerApplications();
    const openJobs = Store.getJobs({ status: 'OPEN' });

    container.innerHTML = `
      <div class="wide-container" style="padding: 40px 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
          <div>
            <h1 style="font-size: 28px; font-weight: 800;">Welcome, ${escapeHtml(session.name)} 👋</h1>
            <p style="color: var(--slate-500); font-size: 14px;">
              Trade: <strong>${formatTrade(session.profile.trade)}</strong> | City: <strong>${escapeHtml(session.profile.location)}</strong> | Status: <strong>${escapeHtml(session.profile.availability)}</strong>
            </p>
          </div>
          <button onclick="App.navigate('browse')" class="btn btn-teal">Search Jobs 🔍</button>
        </div>

        <!-- Quick Stats -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon" style="background:#eff6ff; color:#2563eb;">📄</div>
            <div>
              <div class="stat-num">${myApps.length}</div>
              <div class="stat-label">Applications Submitted</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:#fef3c7; color:#d97706;">⏳</div>
            <div>
              <div class="stat-num">${myApps.filter(a => a.status === 'PENDING').length}</div>
              <div class="stat-label">Pending Reviews</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:#dbeafe; color:#1d4ed8;">⭐</div>
            <div>
              <div class="stat-num">${myApps.filter(a => a.status === 'SHORTLISTED').length}</div>
              <div class="stat-label">Shortlisted Calls</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:#d1fae5; color:#059669;">🎉</div>
            <div>
              <div class="stat-num">${myApps.filter(a => a.status === 'ACCEPTED').length}</div>
              <div class="stat-label">Accepted / Hired</div>
            </div>
          </div>
        </div>

        <!-- Recent Applications Table -->
        <div class="form-main-card" style="margin-top: 32px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="font-size: 18px; font-weight: 700;">My Recent Applications</h3>
            <button onclick="App.navigate('my-applications')" class="btn btn-outline" style="padding: 6px 14px; font-size: 13px;">View All</button>
          </div>
          ${this.renderApplicationsTable(myApps.slice(0, 5))}
        </div>
      </div>
    `;
  }

  // ==================== PAGE: MY APPLICATIONS ====================
  renderMyApplications(container) {
    const myApps = Store.getWorkerApplications();

    container.innerHTML = `
      <div class="wide-container" style="padding: 40px 24px;">
        <h1 style="font-size: 28px; font-weight: 800; margin-bottom: 8px;">My Job Applications</h1>
        <p style="color: var(--slate-500); font-size: 14px; margin-bottom: 32px;">Track the real-time review status of all your submitted job applications.</p>
        <div class="form-main-card">
          ${this.renderApplicationsTable(myApps)}
        </div>
      </div>
    `;
  }

  renderApplicationsTable(apps) {
    if (!apps || apps.length === 0) {
      return `
        <div style="text-align: center; padding: 48px; color: var(--slate-500);">
          <div style="font-size: 36px; margin-bottom: 12px;">📭</div>
          <p>You haven't applied for any jobs yet.</p>
          <button onclick="App.navigate('browse')" class="btn btn-teal" style="margin-top: 16px;">Browse Open Vacancies</button>
        </div>
      `;
    }

    return `
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 14px;">
          <thead>
            <tr style="border-bottom: 2px solid var(--slate-200); color: var(--slate-600);">
              <th style="padding: 12px 16px;">Job Title</th>
              <th style="padding: 12px 16px;">Company</th>
              <th style="padding: 12px 16px;">City</th>
              <th style="padding: 12px 16px;">Salary</th>
              <th style="padding: 12px 16px;">Date Applied</th>
              <th style="padding: 12px 16px;">Application Status</th>
            </tr>
          </thead>
          <tbody>
            ${apps.map(app => `
              <tr style="border-bottom: 1px solid var(--slate-100);">
                <td style="padding: 16px; font-weight: 700; color: var(--slate-900);">
                  <a href="#job/${app.jobId}" style="color: inherit; text-decoration: none;">${escapeHtml(app.job.jobTitle || 'Job')}</a>
                </td>
                <td style="padding: 16px; color: var(--slate-600);">${escapeHtml(app.job.companyName || 'Verified Employer')}</td>
                <td style="padding: 16px;">📍 ${escapeHtml(app.job.location || 'India')}</td>
                <td style="padding: 16px; font-weight: 600; color: var(--success-text);">💰 ${escapeHtml(app.job.salary || 'Competitive')}</td>
                <td style="padding: 16px; color: var(--slate-500);">${new Date(app.applyDate).toLocaleDateString()}</td>
                <td style="padding: 16px;">
                  <span class="status-pill status-${app.status.toLowerCase()}">${app.status}</span>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // ==================== PAGE: EMPLOYER DASHBOARD ====================
  renderEmployerDashboard(container) {
    const session = Store.getSession();
    const jobsWithApps = Store.getEmployerJobsWithApplicants();

    const totalJobs = jobsWithApps.length;
    const totalApps = jobsWithApps.reduce((sum, j) => sum + j.applicantsCount, 0);
    const totalShortlisted = jobsWithApps.reduce((sum, j) => sum + j.applications.filter(a => a.status === 'SHORTLISTED').length, 0);

    container.innerHTML = `
      <div class="wide-container" style="padding: 40px 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
          <div>
            <h1 style="font-size: 28px; font-weight: 800;">Employer Dashboard</h1>
            <p style="color: var(--slate-500); font-size: 14px;">
              Manage your company postings, review incoming skilled trades applications, and update candidate hiring status.
            </p>
          </div>
          <button onclick="App.navigate('post-job')" class="btn btn-primary">➕ Post New Job</button>
        </div>

        <!-- Stats -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon" style="background:#eff6ff; color:#2563eb;">💼</div>
            <div>
              <div class="stat-num">${totalJobs}</div>
              <div class="stat-label">Jobs Posted</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:#ecfdf5; color:#059669;">👥</div>
            <div>
              <div class="stat-num">${totalApps}</div>
              <div class="stat-label">Total Applicants</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:#fef3c7; color:#d97706;">⭐</div>
            <div>
              <div class="stat-num">${totalShortlisted}</div>
              <div class="stat-label">Candidates Shortlisted</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon" style="background:#f3e8ff; color:#7c3aed;">⚡</div>
            <div>
              <div class="stat-num">5 Cities</div>
              <div class="stat-label">Target Reach</div>
            </div>
          </div>
        </div>

        <!-- Posted Jobs Overview -->
        <div class="form-main-card" style="margin-top: 32px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
            <h3 style="font-size: 18px; font-weight: 700;">My Active Vacancies</h3>
            <button onclick="App.navigate('manage-jobs')" class="btn btn-outline" style="padding: 6px 14px; font-size: 13px;">Manage All</button>
          </div>
          ${this.renderEmployerJobsList(jobsWithApps)}
        </div>
      </div>
    `;
  }

  // ==================== PAGE: POST A JOB ====================
  renderPostJob(container) {
    container.innerHTML = `
      <div class="wide-container wide-form-layout">
        <div class="form-main-card">
          <h1 class="form-title">Post a New Skilled Job Vacancy</h1>
          <p class="form-subtitle">Create a job listing with transparent location and salary to attract top tradespeople.</p>

          <form onsubmit="App.handleCreateJob(event)">
            <div class="form-group">
              <label class="form-label">Job Title *</label>
              <input type="text" id="j-title" class="form-control" required placeholder="e.g. Master Electrician for Residential Society Maintenance" />
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Trade Category *</label>
                <select id="j-category" class="form-control" required>
                  <option value="">Select Trade</option>
                  ${TRADES.map(t => `<option value="${t.value}">${t.label}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Job Location (City) *</label>
                <select id="j-city" class="form-control" required>
                  <option value="">Choose City</option>
                  ${CITIES.map(c => `<option value="${c}">${c}</option>`).join('')}
                </select>
              </div>
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Salary Range *</label>
                <input type="text" id="j-salary" class="form-control" required placeholder="e.g. ₹22,000 - ₹28,000 / month" />
              </div>
              <div class="form-group">
                <label class="form-label">Min. Experience Required (Years) *</label>
                <input type="number" id="j-exp" class="form-control" required min="0" max="30" value="2" />
              </div>
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Number of Vacancies *</label>
                <input type="number" id="j-vacancies" class="form-control" required min="1" max="100" value="2" />
              </div>
              <div class="form-group">
                <label class="form-label">Application Last Date *</label>
                <input type="date" id="j-deadline" class="form-control" required />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Detailed Job Description & Requirements *</label>
              <textarea id="j-desc" class="form-control" required rows="5" placeholder="Specify daily work tasks, required tool proficiency, working hours, and any safety certifications expected..."></textarea>
            </div>

            <button type="submit" class="btn btn-primary btn-block" style="padding: 14px; margin-top: 10px;">
              Publish Job Vacancy ➔
            </button>
          </form>
        </div>

        <div class="sidebar-info-card">
          <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 16px;">Tips for Fast Hiring</h3>
          <ul style="list-style: none; font-size: 14px; color: var(--slate-700); line-height: 1.8;">
            <li>✓ <strong>Be Specific:</strong> Mention whether power tools or specific licenses (e.g. Wireman license) are needed.</li>
            <li>✓ <strong>Realistic Salary:</strong> Competitive pay brackets get 3x faster applicant responses.</li>
            <li>✓ <strong>Target the City:</strong> Ensure your city matches your active project site.</li>
          </ul>
        </div>
      </div>
    `;

    // Set default deadline 30 days ahead
    const date = new Date(Date.now() + 30 * 86400000);
    document.getElementById('j-deadline').value = date.toISOString().split('T')[0];
  }

  // ==================== PAGE: MANAGE JOBS & APPLICANTS ====================
  renderManageJobs(container) {
    const jobsWithApps = Store.getEmployerJobsWithApplicants();

    container.innerHTML = `
      <div class="wide-container" style="padding: 40px 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px;">
          <div>
            <h1 style="font-size: 28px; font-weight: 800;">Manage Jobs & Applicants</h1>
            <p style="color: var(--slate-500); font-size: 14px;">Review applicant credentials and update hiring stages.</p>
          </div>
          <button onclick="App.navigate('post-job')" class="btn btn-primary">➕ Post a Job</button>
        </div>

        <div class="form-main-card">
          ${this.renderEmployerJobsList(jobsWithApps, true)}
        </div>
      </div>
    `;
  }

  renderEmployerJobsList(jobs, showApplicantDetails = false) {
    if (!jobs || jobs.length === 0) {
      return `
        <div style="text-align: center; padding: 48px; color: var(--slate-500);">
          <div style="font-size: 36px; margin-bottom: 12px;">📁</div>
          <p>You haven't posted any jobs yet.</p>
          <button onclick="App.navigate('post-job')" class="btn btn-primary" style="margin-top: 16px;">Post Your First Job</button>
        </div>
      `;
    }

    return jobs.map(job => `
      <div style="border: 1px solid var(--slate-200); border-radius: var(--radius-lg); padding: 24px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
          <div>
            <h3 style="font-size: 18px; font-weight: 700; color: var(--slate-900);">${escapeHtml(job.jobTitle)}</h3>
            <div style="display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap;">
              <span class="tag-badge">🛠️ ${formatTrade(job.jobCategory)}</span>
              <span class="tag-badge tag-city">📍 ${escapeHtml(job.location)}</span>
              <span class="tag-badge tag-salary">💰 ${escapeHtml(job.salary)}</span>
              <span class="tag-badge">👥 ${job.vacancyCount} Vacancies</span>
              <span class="status-pill status-${job.status === 'OPEN' ? 'accepted' : 'rejected'}">${job.status}</span>
            </div>
          </div>
          <div style="display: flex; gap: 10px;">
            <button onclick="App.handleToggleJobStatus(${job.jobId})" class="btn btn-outline" style="padding: 6px 14px; font-size: 13px;">
              ${job.status === 'OPEN' ? 'Close Listing' : 'Re-open Job'}
            </button>
          </div>
        </div>

        <!-- Applicants Section -->
        <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--slate-100);">
          <h4 style="font-size: 15px; font-weight: 700; color: var(--slate-800); margin-bottom: 14px;">
            Applicants (${job.applicantsCount})
          </h4>

          ${job.applications.length === 0 
            ? `<p style="font-size: 13px; color: var(--slate-500); font-style: italic;">No candidates have applied yet.</p>`
            : `
              <div style="display: flex; flex-direction: column; gap: 12px;">
                ${job.applications.map(app => `
                  <div style="display: flex; justify-content: space-between; align-items: center; background: var(--slate-50); padding: 14px 18px; border-radius: var(--radius-md); border: 1px solid var(--slate-200); flex-wrap: wrap; gap: 12px;">
                    <div>
                      <div style="font-weight: 700; color: var(--slate-900);">👷 ${escapeHtml(app.worker.name)}</div>
                      <div style="font-size: 13px; color: var(--slate-600); margin-top: 2px;">
                        📞 ${escapeHtml(app.worker.phoneNo)} | ✉️ ${escapeHtml(app.worker.email)}
                      </div>
                      <div style="font-size: 12px; color: var(--slate-500); margin-top: 4px;">
                        Exp: ${app.worker.experience} Years | City: ${escapeHtml(app.worker.location)} | Availability: ${escapeHtml(app.worker.availability)}
                      </div>
                    </div>

                    <div style="display: flex; align-items: center; gap: 10px;">
                      <span class="status-pill status-${app.status.toLowerCase()}">${app.status}</span>
                      <select onchange="App.handleUpdateAppStatus(${app.applicationId}, this.value)" class="form-control" style="width: auto; padding: 6px 12px; font-size: 13px;">
                        <option value="PENDING" ${app.status === 'PENDING' ? 'selected' : ''}>Pending</option>
                        <option value="SHORTLISTED" ${app.status === 'SHORTLISTED' ? 'selected' : ''}>Shortlisted</option>
                        <option value="ACCEPTED" ${app.status === 'ACCEPTED' ? 'selected' : ''}>Accepted</option>
                        <option value="REJECTED" ${app.status === 'REJECTED' ? 'selected' : ''}>Rejected</option>
                      </select>
                    </div>
                  </div>
                `).join('')}
              </div>
            `
          }
        </div>
      </div>
    `).join('');
  }

  // ==================== PAGE: WORKER PROFILE ====================
  renderWorkerProfile(container) {
    const session = Store.getSession();
    const w = session.profile;

    container.innerHTML = `
      <div class="wide-container wide-form-layout">
        <div class="form-main-card">
          <h1 class="form-title">My Worker Profile</h1>
          <p class="form-subtitle">Keep your skills and city availability updated so employers can discover you.</p>

          <form onsubmit="App.handleSaveWorkerProfile(event)">
            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Full Name</label>
                <input type="text" id="pw-name" class="form-control" required value="${escapeHtml(session.name)}" />
              </div>
              <div class="form-group">
                <label class="form-label">Phone Number</label>
                <input type="tel" id="pw-phone" class="form-control" required value="${escapeHtml(session.phoneNo)}" />
              </div>
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Trade Category</label>
                <select id="pw-trade" class="form-control" required>
                  ${TRADES.map(t => `<option value="${t.value}" ${w.trade === t.value ? 'selected' : ''}>${t.label}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Years of Experience</label>
                <input type="number" id="pw-exp" class="form-control" required value="${w.experience}" min="0" max="40" />
              </div>
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Location (City)</label>
                <select id="pw-city" class="form-control" required>
                  ${CITIES.map(c => `<option value="${c}" ${w.location === c ? 'selected' : ''}>${c}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Availability</label>
                <select id="pw-avail" class="form-control" required>
                  ${AVAILABILITY_OPTIONS.map(a => `<option value="${a}" ${w.availability === a ? 'selected' : ''}>${a}</option>`).join('')}
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Vocational Qualification</label>
              <input type="text" id="pw-qual" class="form-control" value="${escapeHtml(w.qualification || '')}" placeholder="e.g. ITI Certified Electrician" />
            </div>

            <button type="submit" class="btn btn-teal" style="padding: 12px 28px;">Save Profile Changes</button>
          </form>
        </div>

        <div class="sidebar-info-card">
          <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 12px;">Account Status</h3>
          <div style="font-size: 14px; color: var(--slate-700); line-height: 1.8;">
            <p><strong>Role:</strong> Skilled Worker</p>
            <p><strong>Email:</strong> ${escapeHtml(session.email)}</p>
            <p><strong>Member Since:</strong> November 2026</p>
          </div>
        </div>
      </div>
    `;
  }

  // ==================== PAGE: EMPLOYER PROFILE ====================
  renderEmployerProfile(container) {
    const session = Store.getSession();
    const e = session.profile;

    container.innerHTML = `
      <div class="wide-container wide-form-layout">
        <div class="form-main-card">
          <h1 class="form-title">Employer Company Profile</h1>
          <p class="form-subtitle">Update your business details and site address.</p>

          <form onsubmit="App.handleSaveEmployerProfile(event)">
            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Contact Person Name</label>
                <input type="text" id="pe-name" class="form-control" required value="${escapeHtml(session.name)}" />
              </div>
              <div class="form-group">
                <label class="form-label">Phone Number</label>
                <input type="tel" id="pe-phone" class="form-control" required value="${escapeHtml(session.phoneNo)}" />
              </div>
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label">Company / Firm Name</label>
                <input type="text" id="pe-company" class="form-control" value="${escapeHtml(e.companyName || '')}" />
              </div>
              <div class="form-group">
                <label class="form-label">Industry Sector</label>
                <select id="pe-industry" class="form-control" required>
                  ${INDUSTRY_OPTIONS.map(i => `<option value="${i}" ${e.industryType === i ? 'selected' : ''}>${i}</option>`).join('')}
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Site / Office Address</label>
              <textarea id="pe-address" class="form-control" required rows="3">${escapeHtml(e.address || '')}</textarea>
            </div>

            <button type="submit" class="btn btn-primary" style="padding: 12px 28px;">Save Profile Changes</button>
          </form>
        </div>

        <div class="sidebar-info-card">
          <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 12px;">Employer Account</h3>
          <div style="font-size: 14px; color: var(--slate-700); line-height: 1.8;">
            <p><strong>Role:</strong> Employer / Contractor</p>
            <p><strong>Email:</strong> ${escapeHtml(session.email)}</p>
            <p><strong>Status:</strong> Active Verified</p>
          </div>
        </div>
      </div>
    `;
  }
}

// Helpers
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatTrade(tradeKey) {
  const match = TRADES.find(t => t.value === tradeKey);
  return match ? match.label : (tradeKey || 'Trade');
}

// Global App Actions
window.App = {
  router: new AppRouter(),

  init() {
    this.router.init();
  },

  navigate(route) {
    this.router.navigate(route);
  },

  logout() {
    Store.clearSession();
    showToast('Logged out successfully.', 'info');
    this.router.renderNavbar();
    this.router.navigate('home');
  },

  handleHomeSearch() {
    const keyword = document.getElementById('home-search-keyword').value;
    const city = document.getElementById('home-search-city').value;
    this.navigate('browse');
    setTimeout(() => {
      if (document.getElementById('filter-search')) document.getElementById('filter-search').value = keyword;
      if (document.getElementById('filter-city')) document.getElementById('filter-city').value = city;
      this.applyFilters();
    }, 50);
  },

  applyFilters() {
    const search = document.getElementById('filter-search')?.value || '';
    const category = document.getElementById('filter-trade')?.value || '';
    const location = document.getElementById('filter-city')?.value || '';

    const filtered = Store.getJobs({
      status: 'OPEN',
      search: search,
      category: category,
      location: location
    });

    const listEl = document.getElementById('browse-jobs-list');
    if (listEl) {
      listEl.innerHTML = this.router.renderJobCardsHtml(filtered);
    }
  },

  resetFilters() {
    if (document.getElementById('filter-search')) document.getElementById('filter-search').value = '';
    if (document.getElementById('filter-trade')) document.getElementById('filter-trade').value = '';
    if (document.getElementById('filter-city')) document.getElementById('filter-city').value = '';
    this.applyFilters();
  },

  handleQuickApply(jobId) {
    const session = Store.getSession();
    if (!session) {
      showToast('Please login to apply for jobs.', 'info');
      return this.navigate('login');
    }
    if (session.role !== 'WORKER') {
      return showToast('Only registered workers can apply for jobs.', 'error');
    }

    try {
      Store.applyForJob(jobId);
      showToast('Applied successfully! Application status is Pending.', 'success');
      this.applyFilters();
    } catch (e) {
      showToast(e.message, 'error');
    }
  },

  handleApplyInDetails(jobId) {
    const session = Store.getSession();
    if (!session) {
      showToast('Please login to apply for jobs.', 'info');
      return this.navigate('login');
    }
    if (session.role !== 'WORKER') {
      return showToast('Only registered workers can apply for jobs.', 'error');
    }

    try {
      Store.applyForJob(jobId);
      showToast('Applied successfully! Application status is Pending.', 'success');
      this.router.renderJobDetails(document.getElementById('app-main'), jobId);
    } catch (e) {
      showToast(e.message, 'error');
    }
  },

  handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
      const session = Store.login(email, password);
      showToast(`Welcome back, ${session.name}!`, 'success');
      this.router.redirectByRole(session);
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  handleRegisterWorker(e) {
    e.preventDefault();
    const data = {
      name: document.getElementById('w-name').value,
      phoneNo: document.getElementById('w-phone').value,
      email: document.getElementById('w-email').value,
      password: document.getElementById('w-password').value,
      trade: document.getElementById('w-trade').value,
      experience: document.getElementById('w-exp').value,
      location: document.getElementById('w-city').value,
      availability: document.getElementById('w-avail').value,
      hoursWork: document.getElementById('w-hours').value,
      qualification: document.getElementById('w-qual').value
    };

    try {
      const session = Store.registerWorker(data);
      showToast('Account created successfully!', 'success');
      this.router.redirectByRole(session);
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  handleRegisterEmployer(e) {
    e.preventDefault();
    const data = {
      name: document.getElementById('e-name').value,
      phoneNo: document.getElementById('e-phone').value,
      email: document.getElementById('e-email').value,
      password: document.getElementById('e-password').value,
      companyName: document.getElementById('e-company').value,
      industryType: document.getElementById('e-industry').value,
      address: document.getElementById('e-address').value
    };

    try {
      const session = Store.registerEmployer(data);
      showToast('Employer account created successfully!', 'success');
      this.router.redirectByRole(session);
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  handleCreateJob(e) {
    e.preventDefault();
    const data = {
      jobTitle: document.getElementById('j-title').value,
      jobCategory: document.getElementById('j-category').value,
      location: document.getElementById('j-city').value,
      salary: document.getElementById('j-salary').value,
      experienceRequired: document.getElementById('j-exp').value,
      vacancyCount: document.getElementById('j-vacancies').value,
      lastDateToApply: document.getElementById('j-deadline').value,
      description: document.getElementById('j-desc').value
    };

    try {
      Store.createJob(data);
      showToast('Job vacancy posted successfully!', 'success');
      this.navigate('manage-jobs');
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  handleToggleJobStatus(jobId) {
    try {
      const job = Store.toggleJobStatus(jobId);
      showToast(`Job status updated to ${job.status}.`, 'info');
      this.router.renderManageJobs(document.getElementById('app-main'));
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  handleUpdateAppStatus(appId, newStatus) {
    try {
      Store.updateApplicationStatus(appId, newStatus);
      showToast(`Candidate status updated to ${newStatus}.`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  handleSaveWorkerProfile(e) {
    e.preventDefault();
    const data = {
      name: document.getElementById('pw-name').value,
      phoneNo: document.getElementById('pw-phone').value,
      trade: document.getElementById('pw-trade').value,
      experience: document.getElementById('pw-exp').value,
      location: document.getElementById('pw-city').value,
      availability: document.getElementById('pw-avail').value,
      qualification: document.getElementById('pw-qual').value
    };

    try {
      Store.updateWorkerProfile(data);
      showToast('Profile updated successfully!', 'success');
      this.router.renderNavbar();
    } catch (err) {
      showToast(err.message, 'error');
    }
  },

  handleSaveEmployerProfile(e) {
    e.preventDefault();
    const data = {
      name: document.getElementById('pe-name').value,
      phoneNo: document.getElementById('pe-phone').value,
      companyName: document.getElementById('pe-company').value,
      industryType: document.getElementById('pe-industry').value,
      address: document.getElementById('pe-address').value
    };

    try {
      Store.updateEmployerProfile(data);
      showToast('Profile updated successfully!', 'success');
      this.router.renderNavbar();
    } catch (err) {
      showToast(err.message, 'error');
    }
  }
};

// Start app on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.App.init();
});

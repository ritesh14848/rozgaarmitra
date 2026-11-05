// RozgaarMitra LocalStorage Database Engine (store.js)

const STORAGE_KEYS = {
  USERS: 'rozgaar_users',
  WORKERS: 'rozgaar_workers',
  EMPLOYERS: 'rozgaar_employers',
  JOBS: 'rozgaar_jobs',
  APPLICATIONS: 'rozgaar_applications',
  AUTH: 'rozgaar_auth_session'
};

// Initial Seed Data for immediate testing
const INITIAL_USERS = [
  {
    userId: 1,
    name: 'Ramesh Sharma',
    email: 'ramesh.worker@example.com',
    password: 'password123',
    phoneNo: '+91 98765 43210',
    role: 'WORKER'
  },
  {
    userId: 2,
    name: 'Ritesh Mahajan',
    email: 'ritesh.employer@example.com',
    password: 'password123',
    phoneNo: '+91 91234 56789',
    role: 'EMPLOYER'
  }
];

const INITIAL_WORKERS = [
  {
    workerId: 1,
    userId: 1,
    trade: 'ELECTRICIAN',
    experience: 5,
    availability: 'Immediate',
    location: 'Mumbai',
    hoursWork: 'FULL_TIME',
    qualification: 'ITI Certified Electrician'
  }
];

const INITIAL_EMPLOYERS = [
  {
    employerId: 1,
    userId: 2,
    companyName: 'Apex Facilities & Engineering',
    industryType: 'Residential & Home Services',
    address: 'Shop 14, Commercial Hub, Andheri East, Mumbai'
  }
];

const INITIAL_JOBS = [
  {
    jobId: 1,
    employerId: 1,
    jobTitle: 'Senior Commercial Electrician',
    jobCategory: 'ELECTRICIAN',
    description: 'Looking for a licensed electrician with 4+ years of experience in 3-phase wiring, breaker panels, and commercial conduit installations for residential building maintenance.',
    salary: '₹22,000 - ₹28,000 / month',
    location: 'Mumbai',
    experienceRequired: 4,
    vacancyCount: 3,
    postedDate: '2026-11-01T10:00:00.000Z',
    lastDateToApply: '2026-12-15T23:59:59.000Z',
    status: 'OPEN'
  },
  {
    jobId: 2,
    employerId: 1,
    jobTitle: 'Master Plumber & Pipefitter',
    jobCategory: 'PLUMBER',
    description: 'Urgent requirement for an experienced plumber proficient in PVC, CPVC, PPR plumbing lines, bathroom sanitary fittings, and water pump pressure valve maintenance.',
    salary: '₹20,000 - ₹25,000 / month',
    location: 'Pune',
    experienceRequired: 3,
    vacancyCount: 2,
    postedDate: '2026-11-02T11:30:00.000Z',
    lastDateToApply: '2026-12-10T23:59:59.000Z',
    status: 'OPEN'
  },
  {
    jobId: 3,
    employerId: 1,
    jobTitle: 'HVAC & Split AC Maintenance Technician',
    jobCategory: 'AC_TECHNICIAN',
    description: 'Need certified HVAC technician for servicing, coil cleaning, refrigerant gas charging (R32/R410A), inverter AC diagnostics, and compressor replacements across commercial client sites.',
    salary: '₹24,000 - ₹30,000 / month',
    location: 'Delhi',
    experienceRequired: 3,
    vacancyCount: 4,
    postedDate: '2026-11-03T09:15:00.000Z',
    lastDateToApply: '2026-12-20T23:59:59.000Z',
    status: 'OPEN'
  },
  {
    jobId: 4,
    employerId: 1,
    jobTitle: 'Interior Furniture Carpenter',
    jobCategory: 'CARPENTER',
    description: 'Skilled modular kitchen and interior woodwork carpenter needed. Must be able to read architectural drawings, operate power tools, and install edge-banding and hydraulic hinges.',
    salary: '₹21,000 - ₹26,000 / month',
    location: 'Kolkata',
    experienceRequired: 4,
    vacancyCount: 2,
    postedDate: '2026-11-03T14:00:00.000Z',
    lastDateToApply: '2026-12-05T23:59:59.000Z',
    status: 'OPEN'
  },
  {
    jobId: 5,
    employerId: 1,
    jobTitle: 'Industrial ARC & TIG Welder',
    jobCategory: 'WELDER',
    description: 'Experienced structural metal fabricator and welder needed for steel gate, grill, and industrial shed frame welding with high safety standards and precision.',
    salary: '₹23,000 - ₹27,000 / month',
    location: 'Chennai',
    experienceRequired: 5,
    vacancyCount: 2,
    postedDate: '2026-11-04T08:45:00.000Z',
    lastDateToApply: '2026-12-18T23:59:59.000Z',
    status: 'OPEN'
  }
];

const INITIAL_APPLICATIONS = [
  {
    applicationId: 1,
    workerId: 1,
    jobId: 1,
    applyDate: '2026-11-02T12:00:00.000Z',
    status: 'SHORTLISTED'
  }
];

// Initialize Storage
function initStore() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.WORKERS)) {
    localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(INITIAL_WORKERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.EMPLOYERS)) {
    localStorage.setItem(STORAGE_KEYS.EMPLOYERS, JSON.stringify(INITIAL_EMPLOYERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.JOBS)) {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(INITIAL_JOBS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
  }
}

// Helpers
function getStored(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch (e) {
    return [];
  }
}

function setStored(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Public Store API
window.Store = {
  init: initStore,

  // Auth & Session
  getSession() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.AUTH));
    } catch (e) {
      return null;
    }
  },

  setSession(sessionData) {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(sessionData));
  },

  clearSession() {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  },

  login(email, password) {
    const users = getStored(STORAGE_KEYS.USERS);
    const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user || user.password !== password) {
      throw new Error('Invalid email or password. Please try again.');
    }

    let profile = null;
    if (user.role === 'WORKER') {
      const workers = getStored(STORAGE_KEYS.WORKERS);
      profile = workers.find(w => w.userId === user.userId);
    } else {
      const employers = getStored(STORAGE_KEYS.EMPLOYERS);
      profile = employers.find(e => e.userId === user.userId);
    }

    const session = {
      userId: user.userId,
      name: user.name,
      email: user.email,
      phoneNo: user.phoneNo,
      role: user.role,
      profile: profile,
      token: 'jwt_mock_' + Date.now()
    };
    this.setSession(session);
    return session;
  },

  registerWorker(data) {
    const users = getStored(STORAGE_KEYS.USERS);
    if (users.some(u => u.email.toLowerCase() === data.email.trim().toLowerCase())) {
      throw new Error('Email is already registered. Please login or use a different email.');
    }

    const newUserId = users.length > 0 ? Math.max(...users.map(u => u.userId)) + 1 : 1;
    const newUser = {
      userId: newUserId,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      phoneNo: data.phoneNo.trim(),
      role: 'WORKER'
    };
    users.push(newUser);
    setStored(STORAGE_KEYS.USERS, users);

    const workers = getStored(STORAGE_KEYS.WORKERS);
    const newWorkerId = workers.length > 0 ? Math.max(...workers.map(w => w.workerId)) + 1 : 1;
    const newWorker = {
      workerId: newWorkerId,
      userId: newUserId,
      trade: data.trade,
      experience: parseInt(data.experience) || 0,
      availability: data.availability,
      location: data.location,
      hoursWork: data.hoursWork || 'FULL_TIME',
      qualification: data.qualification ? data.qualification.trim() : ''
    };
    workers.push(newWorker);
    setStored(STORAGE_KEYS.WORKERS, workers);

    const session = {
      userId: newUser.userId,
      name: newUser.name,
      email: newUser.email,
      phoneNo: newUser.phoneNo,
      role: newUser.role,
      profile: newWorker,
      token: 'jwt_mock_' + Date.now()
    };
    this.setSession(session);
    return session;
  },

  registerEmployer(data) {
    const users = getStored(STORAGE_KEYS.USERS);
    if (users.some(u => u.email.toLowerCase() === data.email.trim().toLowerCase())) {
      throw new Error('Email is already registered. Please login or use a different email.');
    }

    const newUserId = users.length > 0 ? Math.max(...users.map(u => u.userId)) + 1 : 1;
    const newUser = {
      userId: newUserId,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password,
      phoneNo: data.phoneNo.trim(),
      role: 'EMPLOYER'
    };
    users.push(newUser);
    setStored(STORAGE_KEYS.USERS, users);

    const employers = getStored(STORAGE_KEYS.EMPLOYERS);
    const newEmployerId = employers.length > 0 ? Math.max(...employers.map(e => e.employerId)) + 1 : 1;
    const newEmployer = {
      employerId: newEmployerId,
      userId: newUserId,
      companyName: data.companyName ? data.companyName.trim() : '',
      industryType: data.industryType,
      address: data.address.trim()
    };
    employers.push(newEmployer);
    setStored(STORAGE_KEYS.EMPLOYERS, employers);

    const session = {
      userId: newUser.userId,
      name: newUser.name,
      email: newUser.email,
      phoneNo: newUser.phoneNo,
      role: newUser.role,
      profile: newEmployer,
      token: 'jwt_mock_' + Date.now()
    };
    this.setSession(session);
    return session;
  },

  // Jobs
  getJobs(filters = {}) {
    const jobs = getStored(STORAGE_KEYS.JOBS);
    const employers = getStored(STORAGE_KEYS.EMPLOYERS);

    return jobs.filter(job => {
      if (filters.status && job.status !== filters.status) return false;
      if (filters.category && job.jobCategory !== filters.category) return false;
      if (filters.location && job.location.toLowerCase() !== filters.location.toLowerCase()) return false;
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesTitle = job.jobTitle.toLowerCase().includes(query);
        const matchesDesc = job.description.toLowerCase().includes(query);
        const matchesCat = job.jobCategory.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesCat) return false;
      }
      return true;
    }).map(job => {
      const employer = employers.find(e => e.employerId === job.employerId) || {};
      return { ...job, employer };
    }).sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
  },

  getJobById(jobId) {
    const jobs = getStored(STORAGE_KEYS.JOBS);
    const job = jobs.find(j => j.jobId === parseInt(jobId));
    if (!job) return null;

    const employers = getStored(STORAGE_KEYS.EMPLOYERS);
    const users = getStored(STORAGE_KEYS.USERS);
    const employer = employers.find(e => e.employerId === job.employerId) || {};
    const employerUser = users.find(u => u.userId === employer.userId) || {};

    return {
      ...job,
      employer: {
        ...employer,
        contactName: employerUser.name,
        contactEmail: employerUser.email,
        contactPhone: employerUser.phoneNo
      }
    };
  },

  createJob(jobData) {
    const session = this.getSession();
    if (!session || session.role !== 'EMPLOYER' || !session.profile) {
      throw new Error('Only registered employers can post a job vacancy.');
    }

    const jobs = getStored(STORAGE_KEYS.JOBS);
    const newJobId = jobs.length > 0 ? Math.max(...jobs.map(j => j.jobId)) + 1 : 1;

    const newJob = {
      jobId: newJobId,
      employerId: session.profile.employerId,
      jobTitle: jobData.jobTitle.trim(),
      jobCategory: jobData.jobCategory,
      description: jobData.description.trim(),
      salary: jobData.salary.trim(),
      location: jobData.location,
      experienceRequired: parseInt(jobData.experienceRequired) || 0,
      vacancyCount: parseInt(jobData.vacancyCount) || 1,
      postedDate: new Date().toISOString(),
      lastDateToApply: jobData.lastDateToApply || new Date(Date.now() + 30 * 86400000).toISOString(),
      status: 'OPEN'
    };

    jobs.unshift(newJob);
    setStored(STORAGE_KEYS.JOBS, jobs);
    return newJob;
  },

  toggleJobStatus(jobId) {
    const jobs = getStored(STORAGE_KEYS.JOBS);
    const job = jobs.find(j => j.jobId === parseInt(jobId));
    if (!job) throw new Error('Job not found.');
    job.status = job.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    setStored(STORAGE_KEYS.JOBS, jobs);
    return job;
  },

  // Applications
  applyForJob(jobId) {
    const session = this.getSession();
    if (!session || session.role !== 'WORKER' || !session.profile) {
      throw new Error('Please login as a skilled worker to apply for this job.');
    }

    const workerId = session.profile.workerId;
    const applications = getStored(STORAGE_KEYS.APPLICATIONS);

    // Prevent duplicate application
    const existing = applications.find(a => a.workerId === workerId && a.jobId === parseInt(jobId));
    if (existing) {
      throw new Error('You have already applied for this job vacancy.');
    }

    const newAppId = applications.length > 0 ? Math.max(...applications.map(a => a.applicationId)) + 1 : 1;
    const newApplication = {
      applicationId: newAppId,
      workerId: workerId,
      jobId: parseInt(jobId),
      applyDate: new Date().toISOString(),
      status: 'PENDING'
    };

    applications.push(newApplication);
    setStored(STORAGE_KEYS.APPLICATIONS, applications);
    return newApplication;
  },

  hasWorkerApplied(jobId) {
    const session = this.getSession();
    if (!session || session.role !== 'WORKER' || !session.profile) return false;
    const applications = getStored(STORAGE_KEYS.APPLICATIONS);
    return applications.some(a => a.workerId === session.profile.workerId && a.jobId === parseInt(jobId));
  },

  getWorkerApplications() {
    const session = this.getSession();
    if (!session || session.role !== 'WORKER' || !session.profile) return [];

    const applications = getStored(STORAGE_KEYS.APPLICATIONS);
    const jobs = getStored(STORAGE_KEYS.JOBS);
    const employers = getStored(STORAGE_KEYS.EMPLOYERS);

    return applications
      .filter(a => a.workerId === session.profile.workerId)
      .map(app => {
        const job = jobs.find(j => j.jobId === app.jobId) || {};
        const employer = employers.find(e => e.employerId === job.employerId) || {};
        return {
          ...app,
          job: {
            ...job,
            companyName: employer.companyName || 'Independent Employer'
          }
        };
      })
      .sort((a, b) => new Date(b.applyDate) - new Date(a.applyDate));
  },

  getEmployerJobsWithApplicants() {
    const session = this.getSession();
    if (!session || session.role !== 'EMPLOYER' || !session.profile) return [];

    const employerId = session.profile.employerId;
    const jobs = getStored(STORAGE_KEYS.JOBS).filter(j => j.employerId === employerId);
    const applications = getStored(STORAGE_KEYS.APPLICATIONS);
    const workers = getStored(STORAGE_KEYS.WORKERS);
    const users = getStored(STORAGE_KEYS.USERS);

    return jobs.map(job => {
      const jobApps = applications.filter(a => a.jobId === job.jobId).map(app => {
        const worker = workers.find(w => w.workerId === app.workerId) || {};
        const workerUser = users.find(u => u.userId === worker.userId) || {};
        return {
          ...app,
          worker: {
            ...worker,
            name: workerUser.name,
            email: workerUser.email,
            phoneNo: workerUser.phoneNo
          }
        };
      });
      return {
        ...job,
        applications: jobApps,
        applicantsCount: jobApps.length
      };
    });
  },

  updateApplicationStatus(applicationId, newStatus) {
    const applications = getStored(STORAGE_KEYS.APPLICATIONS);
    const app = applications.find(a => a.applicationId === parseInt(applicationId));
    if (!app) throw new Error('Application record not found.');
    app.status = newStatus;
    setStored(STORAGE_KEYS.APPLICATIONS, applications);
    return app;
  },

  // Profile Updates
  updateWorkerProfile(data) {
    const session = this.getSession();
    if (!session || session.role !== 'WORKER') throw new Error('Unauthorized');

    const users = getStored(STORAGE_KEYS.USERS);
    const user = users.find(u => u.userId === session.userId);
    if (user) {
      if (data.name) user.name = data.name.trim();
      if (data.phoneNo) user.phoneNo = data.phoneNo.trim();
      setStored(STORAGE_KEYS.USERS, users);
    }

    const workers = getStored(STORAGE_KEYS.WORKERS);
    const worker = workers.find(w => w.workerId === session.profile.workerId);
    if (worker) {
      if (data.trade) worker.trade = data.trade;
      if (data.experience !== undefined) worker.experience = parseInt(data.experience) || 0;
      if (data.availability) worker.availability = data.availability;
      if (data.location) worker.location = data.location;
      if (data.hoursWork) worker.hoursWork = data.hoursWork;
      if (data.qualification !== undefined) worker.qualification = data.qualification.trim();
      setStored(STORAGE_KEYS.WORKERS, workers);
    }

    session.name = user.name;
    session.phoneNo = user.phoneNo;
    session.profile = worker;
    this.setSession(session);
    return session;
  },

  updateEmployerProfile(data) {
    const session = this.getSession();
    if (!session || session.role !== 'EMPLOYER') throw new Error('Unauthorized');

    const users = getStored(STORAGE_KEYS.USERS);
    const user = users.find(u => u.userId === session.userId);
    if (user) {
      if (data.name) user.name = data.name.trim();
      if (data.phoneNo) user.phoneNo = data.phoneNo.trim();
      setStored(STORAGE_KEYS.USERS, users);
    }

    const employers = getStored(STORAGE_KEYS.EMPLOYERS);
    const employer = employers.find(e => e.employerId === session.profile.employerId);
    if (employer) {
      if (data.companyName !== undefined) employer.companyName = data.companyName.trim();
      if (data.industryType) employer.industryType = data.industryType;
      if (data.address) employer.address = data.address.trim();
      setStored(STORAGE_KEYS.EMPLOYERS, employers);
    }

    session.name = user.name;
    session.phoneNo = user.phoneNo;
    session.profile = employer;
    this.setSession(session);
    return session;
  }
};

// Auto-initialize on script load
window.Store.init();

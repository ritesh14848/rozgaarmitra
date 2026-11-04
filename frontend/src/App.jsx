import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './layouts/Navbar';
import { Footer } from './layouts/Footer';
import { ProtectedRoute } from './layouts/ProtectedRoute';

// Public Pages
import { HomePage } from './pages/HomePage';
import { BrowseJobsPage } from './pages/worker/BrowseJobsPage';
import { JobDetailsPage } from './pages/worker/JobDetailsPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterWorkerPage } from './pages/auth/RegisterWorkerPage';
import { RegisterEmployerPage } from './pages/auth/RegisterEmployerPage';

// Worker Pages
import { WorkerDashboardPage } from './pages/worker/WorkerDashboardPage';
import { MyApplicationsPage } from './pages/worker/MyApplicationsPage';
import { WorkerProfilePage } from './pages/worker/WorkerProfilePage';

// Employer Pages
import { EmployerDashboardPage } from './pages/employer/EmployerDashboardPage';
import { PostJobPage } from './pages/employer/PostJobPage';
import { ManageJobsPage } from './pages/employer/ManageJobsPage';
import { JobApplicantsPage } from './pages/employer/JobApplicantsPage';
import { EmployerProfilePage } from './pages/employer/EmployerProfilePage';

function App() {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<BrowseJobsPage />} />
          <Route path="/jobs/:id" element={<JobDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register/worker" element={<RegisterWorkerPage />} />
          <Route path="/register/employer" element={<RegisterEmployerPage />} />

          {/* Worker Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['WORKER']} />}>
            <Route path="/worker/dashboard" element={<WorkerDashboardPage />} />
            <Route path="/worker/applications" element={<MyApplicationsPage />} />
            <Route path="/worker/profile" element={<WorkerProfilePage />} />
          </Route>

          {/* Employer Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['EMPLOYER']} />}>
            <Route path="/employer/dashboard" element={<EmployerDashboardPage />} />
            <Route path="/employer/jobs" element={<ManageJobsPage />} />
            <Route path="/employer/post-job" element={<PostJobPage />} />
            <Route path="/employer/jobs/:jobId/applicants" element={<JobApplicantsPage />} />
            <Route path="/employer/profile" element={<EmployerProfilePage />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

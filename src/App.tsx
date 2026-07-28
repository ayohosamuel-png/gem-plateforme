import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { NotificationDrawer } from './components/NotificationDrawer';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { StudentDashboard } from './pages/dashboard/StudentDashboard';
import { SupervisorDashboard } from './pages/dashboard/SupervisorDashboard';
import { VisitorDashboard } from './pages/dashboard/VisitorDashboard';
import { AdminDashboard } from './pages/dashboard/AdminDashboard';
import { SubmitThesis } from './pages/theses/SubmitThesis';
import { SearchThesis } from './pages/theses/SearchThesis';
import { ThesisDetails } from './pages/theses/ThesisDetails';
import { ThemeChecker } from './pages/ai/ThemeChecker';
import { PlagiarismReportPage } from './pages/ai/PlagiarismReport';
import { AIAssistant } from './pages/ai/AIAssistant';
import { Payment } from './pages/payments/Payment';
import { CertificateVerification } from './pages/CertificateVerification';

export function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [pageParams, setPageParams] = useState<any>({});
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);

  const handleNavigate = (page: string, params: any = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'login':
        return <Login onNavigate={handleNavigate} />;
      case 'register':
        return <Register onNavigate={handleNavigate} />;
      
      // Dashboards (Protected)
      case 'dashboard-student':
        return (
          <ProtectedRoute allowedRoles={['student', 'admin']} onNavigate={handleNavigate}>
            <StudentDashboard onNavigate={handleNavigate} />
          </ProtectedRoute>
        );
      case 'dashboard-supervisor':
        return (
          <ProtectedRoute allowedRoles={['supervisor', 'admin']} onNavigate={handleNavigate}>
            <SupervisorDashboard onNavigate={handleNavigate} />
          </ProtectedRoute>
        );
      case 'dashboard-visitor':
        return (
          <ProtectedRoute allowedRoles={['visitor', 'student', 'supervisor', 'admin']} onNavigate={handleNavigate}>
            <VisitorDashboard onNavigate={handleNavigate} />
          </ProtectedRoute>
        );
      case 'dashboard-admin':
        return (
          <ProtectedRoute allowedRoles={['admin']} onNavigate={handleNavigate}>
            <AdminDashboard />
          </ProtectedRoute>
        );

      // Thesis pages
      case 'theses':
        return <SearchThesis onNavigate={handleNavigate} />;
      case 'thesis-details':
        return <ThesisDetails thesisId={pageParams.id || 'thm_1'} onNavigate={handleNavigate} />;
      case 'submit-thesis':
        return (
          <ProtectedRoute allowedRoles={['student', 'admin']} onNavigate={handleNavigate}>
            <SubmitThesis onNavigate={handleNavigate} />
          </ProtectedRoute>
        );

      // AI pages
      case 'theme-check':
        return <ThemeChecker />;
      case 'plagiarism-report':
        return <PlagiarismReportPage thesisId={pageParams.thesisId} onNavigate={handleNavigate} />;
      case 'ai-assistant':
        return <AIAssistant />;

      // Payments & Certs
      case 'payment':
        return (
          <ProtectedRoute onNavigate={handleNavigate}>
            <Payment thesisId={pageParams.thesisId || 'thm_1'} onNavigate={handleNavigate} />
          </ProtectedRoute>
        );
      case 'verify-certificate':
        return <CertificateVerification initialNumber={pageParams.number} />;

      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
        
        {/* Navigation Bar */}
        <Navbar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onToggleNotifications={() => setNotifDrawerOpen(!notifDrawerOpen)}
        />

        {/* Main Content View */}
        <main className="flex-1">
          {renderCurrentPage()}
        </main>

        {/* Footer */}
        <Footer onNavigate={handleNavigate} />

        {/* Slide-over Notification Drawer */}
        <NotificationDrawer
          isOpen={notifDrawerOpen}
          onClose={() => setNotifDrawerOpen(false)}
          onNavigate={handleNavigate}
        />

      </div>
    </AuthProvider>
  );
}

export default App;

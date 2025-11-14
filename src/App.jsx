import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import ExcelCleanerEnhanced from './components/ExcelCleanerEnhanced';
import AdminDashboard from './components/AdminDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';

function App() {
  const { user, isAuthenticated, logout } = useAuth();
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'admin-dashboard', 'employee-dashboard', 'excel-cleaner'
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  // Redirect to appropriate dashboard after login
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        setCurrentView('admin-dashboard');
      } else {
        setCurrentView('employee-dashboard');
      }
    } else {
      setCurrentView('landing');
    }
  }, [isAuthenticated, user]);

  const handleGetStarted = () => {
    // Open signup modal
    setIsSignupOpen(true);
  };

  const handleLogin = () => {
    setIsLoginOpen(true);
  };

  const handleSwitchToSignup = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsSignupOpen(false);
    setIsLoginOpen(true);
  };

  const handleNavigateToExcelCleaner = () => {
    if (isAuthenticated) {
      setCurrentView('excel-cleaner');
    } else {
      setIsLoginOpen(true);
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentView('landing');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'admin-dashboard':
        return (
          <AdminDashboard 
            user={user} 
            onNavigate={setCurrentView}
            onLogout={handleLogout}
          />
        );
      
      case 'employee-dashboard':
        return (
          <EmployeeDashboard 
            user={user} 
            onNavigate={setCurrentView}
            onLogout={handleLogout}
          />
        );
      
      case 'excel-cleaner':
        return (
          <div className="min-h-screen bg-slate-100">
            <div className="bg-gray-900 text-white px-8 py-4 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-green-500">GrowthCast</h1>
                <p className="text-sm text-gray-400">{user?.name} • {user?.role === 'admin' ? 'Administrator' : 'Employee'}</p>
              </div>
              <div className="space-x-4">
                <button
                  onClick={() => setCurrentView(user?.role === 'admin' ? 'admin-dashboard' : 'employee-dashboard')}
                  className="text-gray-300 hover:text-white transition"
                >
                  Back to Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            </div>
            <ExcelCleanerEnhanced />
          </div>
        );
      
      default:
        return <LandingPage onGetStarted={handleGetStarted} onNavigateToExcelCleaner={handleNavigateToExcelCleaner} />;
    }
  };

  return (
    <>
      {currentView === 'landing' && (
        <Navbar onLoginClick={handleLogin} onSignupClick={handleGetStarted} />
      )}
      
      {renderContent()}

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToSignup={handleSwitchToSignup}
      />

      <SignupModal
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
}

export default App;

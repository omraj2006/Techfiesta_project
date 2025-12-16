import React, { useState } from 'react';
import { AdminLogin } from './admin/AdminLogin';
import { AdminLayout } from './admin/AdminLayout';
import { AdminDashboard } from './admin/AdminDashboard';
import { ClaimsTable } from './admin/ClaimsTable';
import { ClaimReview } from './admin/ClaimReview';
import { FraudAlerts } from './admin/FraudAlerts';
import { UserManagement } from './admin/UserManagement';
import { PaymentsSettlement } from './admin/PaymentsSettlement';
import { ReportsAnalytics } from './admin/ReportsAnalytics';

type Page = 'dashboard' | 'claims' | 'claim-review' | 'fraud' | 'users' | 'payments' | 'reports' | 'settings';

export function AdminApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'claims':
        return <ClaimsTable />;
      case 'claim-review':
        return <ClaimReview onBack={() => setCurrentPage('claims')} />;
      case 'fraud':
        return <FraudAlerts />;
      case 'users':
        return <UserManagement />;
      case 'payments':
        return <PaymentsSettlement />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'settings':
        return (
          <div className="p-6">
            <h1>Settings</h1>
            <p className="text-muted-foreground mt-2">System settings coming soon...</p>
          </div>
        );
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <AdminLayout
      currentPage={currentPage}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    >
      {renderPage()}
    </AdminLayout>
  );
}
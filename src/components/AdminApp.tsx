import React, { useState, useEffect } from 'react';
import { AdminLogin } from './admin/AdminLogin';
import { AdminLayout } from './admin/AdminLayout';
import { AdminDashboard } from './admin/AdminDashboard';
import { ClaimsTable } from './admin/ClaimsTable';
import { ClaimReview } from './admin/ClaimReview';
import { FraudAlerts } from './admin/FraudAlerts';
import { UserManagement } from './admin/UserManagement';
import { PaymentsSettlement } from './admin/PaymentsSettlement';
import { ReportsAnalytics } from './admin/ReportsAnalytics';
import { ApplicationReview } from './admin/ApplicationReview';
import { ClaimsApplicationsManager } from './admin/ClaimsApplicationsManager';
import { ApplicationData } from './user/ApplicationStatus';

type Page = 'dashboard' | 'claims' | 'claim-review' | 'fraud' | 'users' | 'payments' | 'reports' | 'settings' | 'applications' | 'manage-all';

interface ClaimData {
  id: string;
  userName: string;
  userEmail: string;
  claimType: string;
  amount: string;
  status: string;
  submittedDate: string;
  reviewedDate?: string;
  adminNotes?: string;
  issues?: string[];
}

// 👇 CHANGE 1: Define the props interface
interface AdminAppProps {
  onLogout: () => void;
}

// 👇 CHANGE 2: Accept the prop here
export function AdminApp({ onLogout }: AdminAppProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [claims, setClaims] = useState<ClaimData[]>([]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    fetchApplications();
    fetchClaims();
  };

  useEffect(() => {
    if (isLoggedIn) {
      const interval = setInterval(() => {
        fetchApplications();
        fetchClaims();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  const fetchApplications = async () => {
    try {
      const response = await fetch('http://localhost:3000/applications');
      const data = await response.json();
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    }
  };

  const fetchClaims = async () => {
    try {
      const response = await fetch('http://localhost:3000/claims');
      const data = await response.json();
      if (data.success) {
        setClaims(data.claims);
      }
    } catch (error) {
      console.error('Failed to fetch claims:', error);
    }
  };

  const handleApproveApplication = async (applicationId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/applications/${applicationId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.success) {
        await fetchApplications();
      }
    } catch (error) {
      console.error('Failed to approve application:', error);
      alert('Failed to approve application. Please try again.');
    }
  };

  const handleRejectApplication = async (applicationId: string, reason: string, requiredInfo: string[]) => {
    try {
      const response = await fetch(`http://localhost:3000/applications/${applicationId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, requiredInformation: requiredInfo })
      });
      const data = await response.json();
      if (data.success) {
        await fetchApplications();
      }
    } catch (error) {
      console.error('Failed to reject application:', error);
      alert('Failed to reject application. Please try again.');
    }
  };

  const handleUpdateClaimStatus = async (claimId: string, status: string, notes: string) => {
    try {
      const response = await fetch(`http://localhost:3000/claims/${claimId}/update-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes: notes })
      });
      const data = await response.json();
      if (data.success) {
        await fetchClaims();
      }
    } catch (error) {
      console.error('Failed to update claim status:', error);
      alert('Failed to update claim status. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('dashboard');
    // 👇 CHANGE 3: Call the parent logout function
    onLogout();
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
      case 'applications':
        return <ApplicationReview applications={applications} onApprove={handleApproveApplication} onReject={handleRejectApplication} />;
      case 'manage-all':
        return <ClaimsApplicationsManager claims={claims} applications={applications} onUpdateClaimStatus={handleUpdateClaimStatus} onApproveApplication={handleApproveApplication} onRejectApplication={handleRejectApplication} onLogout={handleLogout} />;
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
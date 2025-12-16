import React, { useState } from 'react';
import { UserLogin } from './user/UserLogin';
import { UserLayout } from './user/UserLayout';
import { UserDashboard } from './user/UserDashboard';
import { ClaimInterface } from './user/ClaimInterface';
import { ClaimStatus } from './user/ClaimStatus';
import { ClaimHistory } from './user/ClaimHistory';
import { UserProfile } from './user/UserProfile';
import { Notifications } from './user/Notifications';

type Page = 'dashboard' | 'claims' | 'claim-status' | 'history' | 'profile' | 'notifications';

export function UserApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);

  const handleLogin = (name: string) => {
    setUserName(name);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    setSelectedClaimId(null);
  };

  const handleStartClaim = () => {
    setShowClaimModal(true);
  };

  const handleViewClaim = (claimId: string) => {
    setSelectedClaimId(claimId);
    setCurrentPage('claim-status');
  };

  const handleCloseClaimModal = () => {
    setShowClaimModal(false);
  };

  if (!isLoggedIn) {
    return <UserLogin onLogin={handleLogin} />;
  }

  const renderPage = () => {
    if (currentPage === 'claim-status' && selectedClaimId) {
      return (
        <ClaimStatus
          claimId={selectedClaimId}
          onBack={() => setCurrentPage('dashboard')}
        />
      );
    }

    switch (currentPage) {
      case 'dashboard':
        return (
          <UserDashboard
            onStartClaim={handleStartClaim}
            onViewClaim={handleViewClaim}
          />
        );
      case 'claims':
        return (
          <UserDashboard
            onStartClaim={handleStartClaim}
            onViewClaim={handleViewClaim}
          />
        );
      case 'history':
        return <ClaimHistory onViewClaim={handleViewClaim} />;
      case 'profile':
        return <UserProfile />;
      case 'notifications':
        return <Notifications />;
      default:
        return (
          <UserDashboard
            onStartClaim={handleStartClaim}
            onViewClaim={handleViewClaim}
          />
        );
    }
  };

  return (
    <>
      <UserLayout
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        userName={userName}
      >
        {renderPage()}
      </UserLayout>

      {/* Claim Modal */}
      {showClaimModal && <ClaimInterface onClose={handleCloseClaimModal} />}
    </>
  );
}

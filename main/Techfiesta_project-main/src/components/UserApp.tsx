import React, { useState, useEffect } from 'react';
import { UserLogin } from './user/UserLogin';
import { UserLayout } from './user/UserLayout';
import { UserDashboard } from './user/UserDashboard';
import { ClaimInterface } from './user/ClaimInterface';
import { ClaimStatus } from './user/ClaimStatus';
import { ClaimHistory } from './user/ClaimHistory';
import { UserProfile } from './user/UserProfile';
import { Notifications } from './user/Notifications';
import { MyClaims } from './user/MyClaims';
import { InsuranceStatus } from './user/InsuranceStatus';
import { InsuranceApplicationForm, ApplicationFormData } from './user/InsuranceApplicationForm';
import { ApplicationStatus, ApplicationData } from './user/ApplicationStatus';

type Page = 'dashboard' | 'claims' | 'claim-status' | 'history' | 'profile' | 'notifications' | 'my-claims' | 'insurance-status' | 'application-status' | 'new-application';

interface ClaimData {
  claimId: string;
  validationData: {
    status: 'APPROVED' | 'REJECTED' | 'MANUAL_REVIEW';
    issues?: string[];
    extractedData?: any;
    claimType: string;
    amount: string;
    submittedDate: string;
  };
}

export function UserApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const [claimsData, setClaimsData] = useState<Map<string, ClaimData>>(new Map());
  const [applications, setApplications] = useState<ApplicationData[]>([]);

  // Poll for updates when logged in
  useEffect(() => {
    if (isLoggedIn && userName) {
      const interval = setInterval(() => {
        fetchApplications(userEmail);
        fetchClaims(userName);
      }, 5000); // Poll every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, userName, userEmail]);


  const handleLogin = (name: string) => {
    setUserName(name);
    setUserEmail(`${name}@example.com`);
    setIsLoggedIn(true);
    fetchApplications(`${name}@example.com`);
    fetchClaims(name);
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

  const handleClaimSubmitted = async (claimData: {
    claimId: string;
    validationResponse: any;
    claimType: string;
    amount: string;
  }) => {
    const newClaimData: ClaimData = {
      claimId: claimData.claimId,
      validationData: {
        status: claimData.validationResponse.validation?.status || 'MANUAL_REVIEW',
        issues: claimData.validationResponse.validation?.issues || [],
        extractedData: claimData.validationResponse.data,
        claimType: claimData.claimType,
        amount: `$${claimData.amount}`,
        submittedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      },
    };
    
    // Submit claim to backend
    try {
      await fetch('http://localhost:3000/submit-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: userName,
          userEmail: userEmail,
          claimType: claimData.claimType,
          amount: claimData.amount,
          validationStatus: claimData.validationResponse.validation?.status || 'MANUAL_REVIEW',
          issues: claimData.validationResponse.validation?.issues || [],
          extractedData: claimData.validationResponse.data
        })
      });
    } catch (error) {
      console.error('Failed to submit claim to backend:', error);
    }
    
    setClaimsData(prev => {
      const updated = new Map(prev);
      updated.set(claimData.claimId, newClaimData);
      return updated;
    });
    setSelectedClaimId(claimData.claimId);
    setCurrentPage('claim-status');
    setShowClaimModal(false);
    
    // Refresh claims from backend
    await fetchClaims(userName);
  };

  const fetchApplications = async (email: string) => {
    try {
      const response = await fetch(`http://localhost:3000/applications?email=${email}`);
      const data = await response.json();
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    }
  };

  const handleApplicationSubmit = async (formData: ApplicationFormData) => {
    try {
      const response = await fetch('http://localhost:3000/submit-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        await fetchApplications(userEmail);
        setCurrentPage('application-status');
      }
    } catch (error) {
      console.error('Failed to submit application:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  const handleViewApplicationDetails = (applicationId: string) => {
    console.log('Viewing application:', applicationId);
  };

  const fetchClaims = async (userName: string) => {
    try {
      const response = await fetch(`http://localhost:3000/claims?userName=${userName}`);
      const data = await response.json();
      if (data.success && data.claims) {
        const claimsMap = new Map();
        data.claims.forEach((claim: any) => {
          claimsMap.set(claim.id, {
            claimId: claim.id,
            validationData: {
              status: claim.status,
              issues: claim.issues || [],
              extractedData: claim.extractedData,
              claimType: claim.claimType,
              amount: claim.amount,
              submittedDate: new Date(claim.submittedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            }
          });
        });
        setClaimsData(claimsMap);
      }
    } catch (error) {
      console.error('Failed to fetch claims:', error);
    }
  };

  if (!isLoggedIn) {
    return <UserLogin onLogin={handleLogin} />;
  }

  const renderPage = () => {
    if (currentPage === 'claim-status' && selectedClaimId) {
      const claimData = claimsData.get(selectedClaimId);
      return (
        <ClaimStatus
          claimId={selectedClaimId}
          onBack={() => setCurrentPage('dashboard')}
          validationData={claimData?.validationData}
        />
      );
    }

    switch (currentPage) {
      case 'dashboard':
        return (
          <UserDashboard
            onStartClaim={handleStartClaim}
            onViewClaim={handleViewClaim}
            onStartApplication={() => setCurrentPage('new-application')}
          />
        );
      case 'claims':
        return (
          <UserDashboard
            onStartClaim={handleStartClaim}
            onViewClaim={handleViewClaim}
            onStartApplication={() => setCurrentPage('new-application')}
          />
        );
      case 'my-claims':
        return <MyClaims claimsData={Array.from(claimsData.values())} onViewClaim={handleViewClaim} />;
      case 'insurance-status':
        return <InsuranceStatus />;
      case 'application-status':
        return <ApplicationStatus applications={applications} onViewDetails={handleViewApplicationDetails} onLogout={handleLogout} />;
      case 'new-application':
        return <InsuranceApplicationForm onSubmit={handleApplicationSubmit} onCancel={() => setCurrentPage('dashboard')} />;
      case 'history':
        return <ClaimHistory claimsData={Array.from(claimsData.values())} onViewClaim={handleViewClaim} />;
      case 'profile':
        return <UserProfile />;
      case 'notifications':
        return <Notifications />;
      default:
        return (
          <UserDashboard
            onStartClaim={handleStartClaim}
            onViewClaim={handleViewClaim}
            onStartApplication={() => setCurrentPage('new-application')}
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
      {showClaimModal && (
        <ClaimInterface
          onClose={handleCloseClaimModal}
          onClaimSubmitted={handleClaimSubmitted}
        />
      )}
    </>
  );
}

import React, { useState } from 'react';
import { FileText, CheckCircle, XCircle, Clock, AlertCircle, User, Mail, Calendar, DollarSign, Edit, LogOut } from 'lucide-react';
import { ApplicationData } from '../user/ApplicationStatus';

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

interface ClaimsApplicationsManagerProps {
  claims: ClaimData[];
  applications: ApplicationData[];
  onUpdateClaimStatus: (claimId: string, status: string, notes: string) => void;
  onApproveApplication: (applicationId: string) => void;
  onRejectApplication: (applicationId: string, reason: string, requiredInfo: string[]) => void;
  onLogout?: () => void;
}

export function ClaimsApplicationsManager({ 
  claims, 
  applications, 
  onUpdateClaimStatus,
  onApproveApplication,
  onRejectApplication,
  onLogout
}: ClaimsApplicationsManagerProps) {
  const [activeTab, setActiveTab] = useState<'claims' | 'applications'>('claims');
  const [selectedClaim, setSelectedClaim] = useState<ClaimData | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-success/20 text-success';
      case 'rejected':
        return 'bg-destructive/20 text-destructive';
      case 'pending':
      case 'manual_review':
        return 'bg-warning/20 text-warning';
      default:
        return 'bg-muted/20 text-muted-foreground';
    }
  };

  const handleUpdateStatus = () => {
    if (selectedClaim && newStatus) {
      onUpdateClaimStatus(selectedClaim.id, newStatus, adminNotes);
      setShowStatusModal(false);
      setSelectedClaim(null);
      setNewStatus('');
      setAdminNotes('');
    }
  };

  const openStatusModal = (claim: ClaimData) => {
    setSelectedClaim(claim);
    setNewStatus(claim.status);
    setAdminNotes(claim.adminNotes || '');
    setShowStatusModal(true);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Claims & Applications Management</h1>
          <p className="text-muted-foreground mt-1">View and manage all user submissions</p>
        </div>
        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-all"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-5 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <FileText className="text-primary" size={24} />
            <span className="text-2xl font-semibold">{claims.length}</span>
          </div>
          <p className="text-sm text-muted-foreground">Total Claims</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-5 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <FileText className="text-accent" size={24} />
            <span className="text-2xl font-semibold">{applications.length}</span>
          </div>
          <p className="text-sm text-muted-foreground">Total Applications</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-5 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <Clock className="text-warning" size={24} />
            <span className="text-2xl font-semibold">
              {claims.filter(c => c.status.toLowerCase() === 'pending' || c.status.toLowerCase() === 'manual_review').length}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Pending Claims</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-5 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <Clock className="text-warning" size={24} />
            <span className="text-2xl font-semibold">
              {applications.filter(a => a.status === 'pending').length}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">Pending Applications</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('claims')}
            className={`px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'claims'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Claims ({claims.length})
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-3 border-b-2 transition-colors ${
              activeTab === 'applications'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Applications ({applications.length})
          </button>
        </div>
      </div>

      {/* Claims Table */}
      {activeTab === 'claims' && (
        <div className="bg-card border border-border rounded-lg shadow-card">
          <div className="p-6 border-b border-border">
            <h3>All Claims</h3>
            <p className="text-sm text-muted-foreground mt-1">Manage insurance claims submitted by users</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Claim ID</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">User</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Type</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Submitted</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {claims.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                      No claims submitted yet
                    </td>
                  </tr>
                ) : (
                  claims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-primary">{claim.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium">{claim.userName}</p>
                          <p className="text-sm text-muted-foreground">{claim.userEmail}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{claim.claimType}</td>
                      <td className="px-6 py-4 font-semibold">{claim.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${getStatusColor(claim.status)}`}>
                          {claim.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-sm">
                        {new Date(claim.submittedDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openStatusModal(claim)}
                          className="text-primary hover:underline flex items-center gap-1 ml-auto"
                        >
                          <Edit size={14} />
                          Update Status
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Applications Table */}
      {activeTab === 'applications' && (
        <div className="bg-card border border-border rounded-lg shadow-card">
          <div className="p-6 border-b border-border">
            <h3>All Applications</h3>
            <p className="text-sm text-muted-foreground mt-1">Manage insurance applications submitted by users</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Application ID</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Applicant</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Type</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Coverage</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Submitted</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                      No applications submitted yet
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-primary">{app.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium">{app.fullName}</p>
                          <p className="text-sm text-muted-foreground">{app.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{app.insuranceType}</td>
                      <td className="px-6 py-4 font-semibold">{app.coverageAmount}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${getStatusColor(app.status)}`}>
                          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground text-sm">
                        {new Date(app.submittedDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {app.status === 'pending' && (
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => onApproveApplication(app.id)}
                              className="text-success hover:underline text-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {/* Will use existing ApplicationReview modal */}}
                              className="text-destructive hover:underline text-sm"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedClaim && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-xl max-w-2xl w-full shadow-card-elevated">
            <div className="p-6 border-b border-border">
              <h3 className="text-foreground">Update Claim Status</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Update the status and add notes for claim {selectedClaim.id}
              </p>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-muted/50 border border-border rounded-lg p-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">User</p>
                    <p className="font-medium">{selectedClaim.userName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Claim Type</p>
                    <p className="font-medium">{selectedClaim.claimType}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Amount</p>
                    <p className="font-medium">{selectedClaim.amount}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Current Status</p>
                    <p className="font-medium">{selectedClaim.status}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">New Status *</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-input-background border border-input px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                >
                  <option value="pending">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="MANUAL_REVIEW">Manual Review</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Admin Notes</label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add any notes about this claim review..."
                  rows={4}
                  className="w-full bg-input-background border border-input px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-border flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedClaim(null);
                }}
                className="px-4 py-2 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={!newStatus}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle size={18} />
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

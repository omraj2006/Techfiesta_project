import React, { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  FileText, 
  Calendar, 
  IndianRupee, 
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Eye,
  MessageSquare,
  Clock
} from 'lucide-react';

interface ClaimReviewProps {
  onBack: () => void;
}

export function ClaimReview({ onBack }: ClaimReviewProps) {
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [internalNote, setInternalNote] = useState('');

  const claim = {
    id: 'CLM-2024-1235',
    user: {
      name: 'Sarah Smith',
      email: 'sarah@example.com',
      phone: '+1 (555) 123-4567',
      userId: 'USR-8945'
    },
    policy: {
      number: 'POL-123789',
      type: 'Home Insurance',
      provider: 'SecureLife Insurance Co.',
      // MODIFIED: Changed to ₹
      coverage: '₹500,000',
      premium: '₹1,200/year'
    },
    claim: {
      amount: 12400,
      submitDate: '2024-12-15 09:45',
      incidentDate: '2024-12-10',
      description: 'Water damage to kitchen and living room due to burst pipe. Extensive damage to cabinets, flooring, and drywall. Emergency repairs completed.',
      category: 'Property Damage'
    },
    status: 'pending',
    priority: 'high',
    documents: [
      { name: 'Damage_Photos.pdf', size: '2.4 MB', type: 'photos', status: 'verified' },
      { name: 'Repair_Invoice.pdf', size: '156 KB', type: 'invoice', status: 'verified' },
      { name: 'Policy_Document.pdf', size: '892 KB', type: 'policy', status: 'verified' },
      { name: 'Incident_Report.pdf', size: '245 KB', type: 'report', status: 'verified' }
    ],
    ocrData: {
      policyNumber: 'POL-123789',
      claimantName: 'Sarah Smith',
      incidentDate: '2024-12-10',
      damageType: 'Water Damage',
      // MODIFIED: Changed to ₹
      estimatedCost: '₹12,400',
      confidence: 98.5
    },
    timeline: [
      { event: 'Claim Submitted', timestamp: '2024-12-15 09:45', user: 'Sarah Smith', status: 'completed' },
      { event: 'Documents Uploaded', timestamp: '2024-12-15 09:52', user: 'Sarah Smith', status: 'completed' },
      { event: 'OCR Processing', timestamp: '2024-12-15 09:53', user: 'System', status: 'completed' },
      { event: 'Fraud Check', timestamp: '2024-12-15 09:54', user: 'System', status: 'completed' },
      { event: 'Awaiting Review', timestamp: '2024-12-15 09:55', user: 'System', status: 'current' }
    ],
    fraudScore: {
      score: 12,
      risk: 'low',
      factors: [
        { check: 'Document Authenticity', status: 'passed', confidence: 99 },
        { check: 'Policy Status', status: 'passed', confidence: 100 },
        { check: 'Historical Claims', status: 'passed', confidence: 95 },
        { check: 'Amount Verification', status: 'passed', confidence: 97 }
      ]
    }
  };

  const handleApprove = () => {
    setShowApproveModal(true);
  };

  const handleReject = () => {
    setShowRejectModal(true);
  };

  const confirmApproval = () => {
    // Handle approval logic
    setShowApproveModal(false);
    onBack();
  };

  const confirmRejection = () => {
    // Handle rejection logic
    setShowRejectModal(false);
    onBack();
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1>Claim Review</h1>
            <p className="text-muted-foreground mt-1">Review and process claim details</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg transition-all hover:bg-accent hover:text-accent-foreground border border-border flex items-center gap-2">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Claim Info Card */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-card">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="mb-1">{claim.id}</h2>
                <p className="text-overline text-muted-foreground">{claim.policy.type}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-[#f59e0b]/20 text-[#f59e0b] px-3 py-1 rounded-full text-sm border border-[#f59e0b]/20">
                  Pending Review
                </span>
                <span className="bg-destructive/20 text-destructive px-3 py-1 rounded-full text-sm">
                  High Priority
                </span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="text-muted-foreground mt-0.5" size={18} />
                  <div>
                    <p className="text-caption text-muted-foreground">Claimant</p>
                    <p className="font-medium">{claim.user.name}</p>
                    <p className="text-sm text-muted-foreground">{claim.user.email}</p>
                    <p className="text-sm text-muted-foreground">{claim.user.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="text-muted-foreground mt-0.5" size={18} />
                  <div>
                    <p className="text-caption text-muted-foreground">Incident Date</p>
                    <p className="font-medium">{claim.claim.incidentDate}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  {/* MODIFIED: Changed DollarSign to IndianRupee */}
                  <IndianRupee className="text-muted-foreground mt-0.5" size={18} />
                  <div>
                    <p className="text-caption text-muted-foreground">Claim Amount</p>
                    {/* MODIFIED: Changed $ to ₹ */}
                    <p className="text-2xl font-semibold text-primary">₹{claim.claim.amount.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="text-muted-foreground mt-0.5" size={18} />
                  <div>
                    <p className="text-caption text-muted-foreground">Policy Number</p>
                    <p className="font-medium font-mono">{claim.policy.number}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <h4 className="mb-2">Description</h4>
              <p className="text-muted-foreground">{claim.claim.description}</p>
            </div>
          </div>

          {/* OCR Extracted Data */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3>OCR Extracted Data</h3>
                <p className="text-caption text-muted-foreground mt-1">Automatically extracted from documents</p>
              </div>
              <div className="flex items-center gap-2 bg-[#10b981]/10 border border-[#10b981]/20 px-3 py-1.5 rounded-lg">
                <CheckCircle className="text-[#10b981]" size={16} />
                <span className="text-sm text-[#10b981]">{claim.ocrData.confidence}% Confidence</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {Object.entries(claim.ocrData).map(([key, value]) => {
                if (key === 'confidence') return null;
                return (
                  <div key={key} className="bg-muted/30 border border-border rounded-lg p-4">
                    <p className="text-caption text-muted-foreground mb-1">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="font-medium">{value}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-card">
            <h3 className="mb-4">Supporting Documents</h3>
            <div className="space-y-3">
              {claim.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/30 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 border border-primary/20 p-2 rounded-lg">
                      <FileText className="text-primary" size={20} />
                    </div>
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-caption text-muted-foreground">{doc.size} • {doc.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#10b981]/20 text-[#10b981] px-2.5 py-1 rounded-full text-xs border border-[#10b981]/20 flex items-center gap-1">
                      <CheckCircle size={12} />
                      Verified
                    </span>
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="Download">
                      <Download size={18} className="text-muted-foreground" />
                    </button>
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="View">
                      <Eye size={18} className="text-muted-foreground" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Internal Notes */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-card">
            <h3 className="mb-4">Internal Notes</h3>
            <textarea
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              placeholder="Add notes for internal review team..."
              rows={4}
              className="w-full bg-input-background border border-input px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            ></textarea>
            <button className="mt-3 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg transition-all hover:bg-accent hover:text-accent-foreground border border-border">
              Save Note
            </button>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-card space-y-3">
            <h3 className="mb-4">Actions</h3>
            <button 
              onClick={handleApprove}
              className="w-full bg-[#10b981] text-white px-4 py-3 rounded-lg transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <CheckCircle size={20} />
              Approve Claim
            </button>
            <button 
              onClick={handleReject}
              className="w-full bg-destructive text-destructive-foreground px-4 py-3 rounded-lg transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <XCircle size={20} />
              Reject Claim
            </button>
            <button className="w-full bg-secondary text-secondary-foreground px-4 py-3 rounded-lg transition-all hover:bg-accent hover:text-accent-foreground border border-border flex items-center justify-center gap-2">
              <MessageSquare size={20} />
              Request Info
            </button>
          </div>

          {/* Fraud Analysis */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-card">
            <h3 className="mb-4">Fraud Analysis</h3>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">Risk Score</span>
                <span className="text-2xl font-semibold text-[#10b981]">{claim.fraudScore.score}/100</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#10b981] rounded-full transition-all" 
                  style={{ width: `${claim.fraudScore.score}%` }}
                ></div>
              </div>
              <p className="text-caption text-[#10b981] mt-2 flex items-center gap-1">
                <CheckCircle size={14} />
                Low Risk - Safe to Approve
              </p>
            </div>

            <div className="space-y-3">
              {claim.fraudScore.factors.map((factor, index) => (
                <div key={index} className="flex items-start justify-between p-3 bg-muted/30 border border-border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{factor.check}</p>
                    <p className="text-caption text-muted-foreground">{factor.confidence}% confidence</p>
                  </div>
                  <CheckCircle className="text-[#10b981]" size={18} />
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-card">
            <h3 className="mb-4">Activity Timeline</h3>
            <div className="space-y-4">
              {claim.timeline.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-full mt-1 ${
                    item.status === 'completed' ? 'bg-[#10b981]' : 
                    item.status === 'current' ? 'bg-[#f59e0b]' : 'bg-muted'
                  }`}>
                    {item.status === 'completed' ? (
                      <CheckCircle size={12} className="text-white" />
                    ) : item.status === 'current' ? (
                      <Clock size={12} className="text-white" />
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.event}</p>
                    <p className="text-caption text-muted-foreground">{item.user}</p>
                    <p className="text-caption text-muted-foreground">{item.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl p-6 max-w-md w-full shadow-card-elevated">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-[#10b981]/10 border border-[#10b981]/20 p-3 rounded-lg">
                <CheckCircle className="text-[#10b981]" size={24} />
              </div>
              <h3>Approve Claim</h3>
            </div>
            {/* MODIFIED: Changed $ to ₹ */}
            <p className="text-muted-foreground mb-6">
              Are you sure you want to approve this claim for ₹{claim.claim.amount.toLocaleString()}? This action will initiate the payment process.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowApproveModal(false)}
                className="flex-1 bg-secondary text-secondary-foreground px-4 py-2.5 rounded-lg transition-all hover:bg-accent hover:text-accent-foreground border border-border"
              >
                Cancel
              </button>
              <button 
                onClick={confirmApproval}
                className="flex-1 bg-[#10b981] text-white px-4 py-2.5 rounded-lg transition-all hover:opacity-90"
              >
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl p-6 max-w-md w-full shadow-card-elevated">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg">
                <XCircle className="text-destructive" size={24} />
              </div>
              <h3>Reject Claim</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Please provide a reason for rejecting this claim. This will be sent to the user.
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
              className="w-full bg-input-background border border-input px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none mb-4"
            ></textarea>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowRejectModal(false)}
                className="flex-1 bg-secondary text-secondary-foreground px-4 py-2.5 rounded-lg transition-all hover:bg-accent hover:text-accent-foreground border border-border"
              >
                Cancel
              </button>
              <button 
                onClick={confirmRejection}
                className="flex-1 bg-destructive text-destructive-foreground px-4 py-2.5 rounded-lg transition-all hover:opacity-90"
                disabled={!rejectReason}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
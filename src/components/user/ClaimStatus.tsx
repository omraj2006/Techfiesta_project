import React from 'react';
import { ArrowLeft, CheckCircle, Clock, FileText, Shield, DollarSign, AlertCircle, Download, MessageSquare } from 'lucide-react';

interface ClaimStatusProps {
  claimId: string;
  onBack: () => void;
}

export function ClaimStatus({ claimId, onBack }: ClaimStatusProps) {
  const claimData = {
    id: claimId,
    type: 'Auto Insurance',
    status: 'Under Review',
    statusColor: 'warning',
    amount: '$5,250',
    submittedDate: 'December 10, 2024',
    estimatedResponse: '2-3 business days',
    description: 'Vehicle damage from parking lot incident. Rear bumper and taillight damage requiring replacement.',
    documents: [
      { name: 'accident-photos.pdf', size: '2.4 MB', uploadedAt: 'Dec 10, 2024' },
      { name: 'police-report.pdf', size: '856 KB', uploadedAt: 'Dec 10, 2024' },
      { name: 'repair-estimate.pdf', size: '1.2 MB', uploadedAt: 'Dec 10, 2024' },
    ],
  };

  const timeline = [
    {
      status: 'Claim Submitted',
      date: 'Dec 10, 2024 - 2:30 PM',
      description: 'Your claim has been successfully submitted and assigned to a reviewer',
      completed: true,
      icon: FileText,
    },
    {
      status: 'Documents Verified',
      date: 'Dec 10, 2024 - 4:15 PM',
      description: 'All uploaded documents have been verified and processed',
      completed: true,
      icon: CheckCircle,
    },
    {
      status: 'Under Review',
      date: 'In Progress',
      description: 'Our claims specialist is reviewing your case and documents',
      completed: false,
      active: true,
      icon: Shield,
    },
    {
      status: 'Approval & Payment',
      date: 'Pending',
      description: 'Once approved, payment will be processed within 24-48 hours',
      completed: false,
      icon: DollarSign,
    },
  ];

  const getStatusColor = (color: string) => {
    switch (color) {
      case 'warning': return 'bg-warning/20 text-warning';
      case 'success': return 'bg-success/20 text-success';
      case 'primary': return 'bg-primary/20 text-primary';
      default: return 'bg-muted/20 text-muted-foreground';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft size={20} />
        Back to Dashboard
      </button>

      {/* Header */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-card mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-foreground">{claimData.id}</h1>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(claimData.statusColor)}`}>
                {claimData.status}
              </span>
            </div>
            <p className="text-muted-foreground">{claimData.type}</p>
          </div>
          <div className="text-left sm:text-right">
            <h3 className="text-foreground">{claimData.amount}</h3>
            <p className="text-sm text-muted-foreground mt-1">Claim Amount</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 pt-6 border-t border-border">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Submitted</p>
            <p className="text-foreground">{claimData.submittedDate}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Expected Response</p>
            <p className="text-foreground">{claimData.estimatedResponse}</p>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Timeline */}
        <div className="lg:col-span-2">
          <h2 className="text-foreground mb-6">Claim Timeline</h2>

          <div className="space-y-6">
            {timeline.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="relative">
                  {/* Connector Line */}
                  {index < timeline.length - 1 && (
                    <div
                      className={`absolute left-5 top-12 w-0.5 h-full ${
                        item.completed ? 'bg-success' : 'bg-border'
                      }`}
                    ></div>
                  )}

                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                        item.completed
                          ? 'bg-success/20 border-2 border-success'
                          : item.active
                          ? 'bg-warning/20 border-2 border-warning animate-pulse'
                          : 'bg-muted border-2 border-border'
                      }`}
                    >
                      <Icon
                        size={18}
                        className={
                          item.completed
                            ? 'text-success'
                            : item.active
                            ? 'text-warning'
                            : 'text-muted-foreground'
                        }
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-card border border-border rounded-xl p-4 shadow-card">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h4 className="text-foreground">{item.status}</h4>
                        {item.completed && (
                          <CheckCircle size={18} className="text-success shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{item.date}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          {/* Claim Details */}
          <div>
            <h3 className="text-foreground mb-4">Claim Details</h3>
            <div className="bg-card border border-border rounded-xl p-4 shadow-card">
              <p className="text-sm text-muted-foreground mb-2">Description</p>
              <p className="text-foreground">{claimData.description}</p>
            </div>
          </div>

          {/* Documents */}
          <div>
            <h3 className="text-foreground mb-4">Documents</h3>
            <div className="space-y-2">
              {claimData.documents.map((doc, index) => (
                <div
                  key={index}
                  className="bg-card border border-border rounded-xl p-4 shadow-card hover:shadow-card-hover transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <FileText size={20} className="text-primary shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-foreground truncate">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">{doc.size}</p>
                      </div>
                    </div>
                    <button className="text-primary hover:text-primary/80 transition-colors shrink-0">
                      <Download size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button className="w-full bg-primary text-primary-foreground px-4 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <MessageSquare size={18} />
              Contact Support
            </button>
            <button className="w-full bg-card border border-border text-foreground px-4 py-3 rounded-lg hover:bg-muted transition-colors flex items-center justify-center gap-2">
              <FileText size={18} />
              Add Documents
            </button>
          </div>

          {/* Info Card */}
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-foreground mb-2">Stay Updated</p>
                <p className="text-sm text-muted-foreground">
                  You'll receive email and SMS notifications when your claim status changes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

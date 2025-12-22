import React from 'react';
import { AlertTriangle, Eye, CheckCircle, XCircle, TrendingUp, Shield } from 'lucide-react';

export function FraudAlerts() {
  const alerts = [
    {
      id: 'FRD-001',
      claimId: 'CLM-2024-1250',
      user: 'Rahul Sharma', // MODIFIED
      type: 'Duplicate Claim',
      severity: 'high',
      riskScore: 87,
      description: 'Similar claim submitted 3 times in 2 weeks',
      flags: ['Multiple submissions', 'Same damage photos', 'Similar amounts'],
      status: 'pending',
      timestamp: '2024-12-15 14:23'
    },
    {
      id: 'FRD-002',
      claimId: 'CLM-2024-1248',
      user: 'Priya Patel', // MODIFIED
      type: 'Document Manipulation',
      severity: 'critical',
      riskScore: 94,
      description: 'Invoice appears to be digitally altered',
      flags: ['Metadata mismatch', 'Font inconsistencies', 'Date anomaly'],
      status: 'pending',
      timestamp: '2024-12-15 13:45'
    },
    {
      id: 'FRD-003',
      claimId: 'CLM-2024-1242',
      user: 'Amit Verma', // MODIFIED
      type: 'Unusual Pattern',
      severity: 'medium',
      riskScore: 68,
      description: '5th claim in 6 months - high frequency',
      flags: ['High claim frequency', 'Different policy types', 'Pattern detected'],
      status: 'reviewing',
      timestamp: '2024-12-15 11:20'
    },
    {
      id: 'FRD-004',
      claimId: 'CLM-2024-1238',
      user: 'Sneha Reddy', // MODIFIED
      type: 'Policy Mismatch',
      severity: 'medium',
      riskScore: 72,
      description: 'Claim amount exceeds policy coverage',
      flags: ['Coverage exceeded', 'Amount anomaly'],
      status: 'dismissed',
      timestamp: '2024-12-15 10:15'
    },
    {
      id: 'FRD-005',
      claimId: 'CLM-2024-1235',
      user: 'Vikram Singh', // MODIFIED
      type: 'Location Anomaly',
      severity: 'low',
      riskScore: 45,
      description: 'Incident location differs from policy address',
      flags: ['Location mismatch', 'Unverified address'],
      status: 'dismissed',
      timestamp: '2024-12-15 09:30'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-destructive/20 text-destructive border-destructive/20';
      case 'high':
        return 'bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b]/20';
      case 'medium':
        return 'bg-accent/20 text-accent border-accent/20';
      case 'low':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-[#f59e0b]/20 text-[#f59e0b]';
      case 'reviewing':
        return 'bg-accent/20 text-accent';
      case 'dismissed':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const stats = [
    { label: 'Total Alerts', value: '23', change: '-12.5%', trend: 'down' },
    { label: 'Critical', value: '3', change: '+2', trend: 'up' },
    { label: 'Under Review', value: '8', change: '-3', trend: 'down' },
    { label: 'Dismissed', value: '12', change: '+5', trend: 'up' }
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1>Fraud Detection Alerts</h1>
        <p className="text-muted-foreground mt-1">Monitor and investigate suspicious claims</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-5 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-caption text-muted-foreground">{stat.label}</p>
              <span className={`text-sm ${
                stat.trend === 'down' ? 'text-[#10b981]' : 'text-destructive'
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div 
            key={alert.id}
            className="bg-card border border-border rounded-lg p-6 shadow-card hover:shadow-card-hover transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              {/* Left - Alert Icon */}
              <div className="flex items-start gap-4 flex-1">
                <div className={`p-3 rounded-lg border ${
                  alert.severity === 'critical' 
                    ? 'bg-destructive/10 border-destructive/20' 
                    : alert.severity === 'high'
                    ? 'bg-[#f59e0b]/10 border-[#f59e0b]/20'
                    : 'bg-accent/10 border-accent/20'
                }`}>
                  <AlertTriangle className={
                    alert.severity === 'critical' ? 'text-destructive' : 
                    alert.severity === 'high' ? 'text-[#f59e0b]' : 'text-accent'
                  } size={24} />
                </div>

                {/* Alert Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="mb-1">{alert.type}</h3>
                      <p className="text-sm text-muted-foreground">Alert ID: {alert.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(alert.severity)}`}>
                        {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                        {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4">{alert.description}</p>

                  {/* Flags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {alert.flags.map((flag, index) => (
                      <span 
                        key={index}
                        className="bg-muted/50 border border-border px-3 py-1 rounded-full text-xs"
                      >
                        {flag}
                      </span>
                    ))}
                  </div>

                  {/* Meta Info */}
                  <div className="grid sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-caption text-muted-foreground">Claim ID</p>
                      <p className="font-mono text-primary">{alert.claimId}</p>
                    </div>
                    <div>
                      <p className="text-caption text-muted-foreground">User</p>
                      <p>{alert.user}</p>
                    </div>
                    <div>
                      <p className="text-caption text-muted-foreground">Detected</p>
                      <p>{alert.timestamp}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Risk Score & Actions */}
              <div className="flex flex-col gap-4 lg:w-64">
                {/* Risk Score */}
                <div className="bg-muted/30 border border-border rounded-lg p-4">
                  <p className="text-caption text-muted-foreground mb-2">Risk Score</p>
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-3xl font-semibold text-destructive">{alert.riskScore}</p>
                    <span className="text-muted-foreground">/100</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-destructive rounded-full" 
                      style={{ width: `${alert.riskScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* Actions */}
                {alert.status === 'pending' && (
                  <div className="flex flex-col gap-2">
                    <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg transition-all hover:opacity-90 flex items-center justify-center gap-2">
                      <Eye size={18} />
                      Investigate
                    </button>
                    <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg transition-all hover:bg-accent hover:text-accent-foreground border border-border flex items-center justify-center gap-2">
                      <CheckCircle size={18} />
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
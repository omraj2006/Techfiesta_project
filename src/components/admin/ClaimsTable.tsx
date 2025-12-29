import React, { useState } from 'react';
import { Search, Download, Eye, CheckCircle, XCircle, Clock, ChevronDown, ChevronLeft, ChevronRight, ShieldAlert, ShieldCheck, AlertTriangle, IndianRupee } from 'lucide-react';

interface Claim {
  id: string;
  user: string;
  email: string;
  type: string;
  policyNumber: string;
  amount: number;
  status: 'approved' | 'pending' | 'rejected' | 'review' | 'manual_review';
  priority: 'high' | 'medium' | 'low';
  submitDate: string;
  lastUpdate: string;
  aiRiskScore?: number; // 0-100 (High score = High Risk)
}

export function ClaimsTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Enhanced Mock Data with AI Risk Scores
  const claims: Claim[] = [
    { id: 'CLM-2024-1235', user: 'Sarah Smith', email: 'sarah@example.com', type: 'Home Insurance', policyNumber: 'POL-123789', amount: 12400, status: 'pending', priority: 'high', submitDate: '2024-12-15', lastUpdate: 'Today 09:45', aiRiskScore: 85 },
    { id: 'CLM-2024-1236', user: 'Mike Johnson', email: 'mike@example.com', type: 'Health Insurance', policyNumber: 'POL-456123', amount: 8750, status: 'review', priority: 'high', submitDate: '2024-12-15', lastUpdate: 'Today 09:12', aiRiskScore: 65 },
    { id: 'CLM-2024-1240', user: 'Robert Taylor', email: 'robert@example.com', type: 'Auto Insurance', policyNumber: 'POL-852369', amount: 4500, status: 'review', priority: 'medium', submitDate: '2024-12-15', lastUpdate: 'Today 07:48', aiRiskScore: 45 },
    { id: 'CLM-2024-1242', user: 'William Garcia', email: 'william@example.com', type: 'Health Insurance', policyNumber: 'POL-963852', amount: 6300, status: 'pending', priority: 'medium', submitDate: '2024-12-15', lastUpdate: 'Today 06:59', aiRiskScore: 30 },
    { id: 'CLM-2024-1234', user: 'John Doe', email: 'john@example.com', type: 'Auto Insurance', policyNumber: 'POL-789456', amount: 5250, status: 'approved', priority: 'medium', submitDate: '2024-12-14', lastUpdate: 'Yesterday', aiRiskScore: 10 },
    { id: 'CLM-2024-1237', user: 'Emily Brown', email: 'emily@example.com', type: 'Auto Insurance', policyNumber: 'POL-987654', amount: 3200, status: 'approved', priority: 'low', submitDate: '2024-12-14', lastUpdate: 'Yesterday', aiRiskScore: 5 },
    { id: 'CLM-2024-1238', user: 'David Wilson', email: 'david@example.com', type: 'Life Insurance', policyNumber: 'POL-321654', amount: 25000, status: 'rejected', priority: 'medium', submitDate: '2024-12-13', lastUpdate: '2 Days Ago', aiRiskScore: 92 },
  ];

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return <CheckCircle className="text-green-500" size={16} />;
      case 'rejected': return <XCircle className="text-red-500" size={16} />;
      case 'pending':
      case 'review':
      case 'manual_review': return <Clock className="text-amber-500" size={16} />;
      default: return null;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400';
      case 'pending':
      case 'review':
      case 'manual_review': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getRiskBadge = (score: number) => {
    if (score >= 80) return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700 border border-red-200">
        <ShieldAlert size={12} /> High Risk ({score}%)
      </span>
    );
    if (score >= 50) return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700 border border-yellow-200">
        <AlertTriangle size={12} /> Medium ({score}%)
      </span>
    );
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 border border-green-200">
        <ShieldCheck size={12} /> Low Risk ({score}%)
      </span>
    );
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Claims Processing</h1>
          <p className="text-muted-foreground mt-1">Review AI-analyzed claims queue.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white dark:bg-card text-foreground px-4 py-2 rounded-lg border border-border shadow-sm hover:bg-muted transition-all flex items-center gap-2 text-sm font-medium">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search - Spans 6 cols */}
          <div className="md:col-span-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Claim ID, Policy #, or User..."
              className="w-full bg-background border border-input pl-10 pr-4 py-2.5 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
          </div>

          {/* Filters - Span 3 cols each */}
          <div className="md:col-span-3 relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-background border border-input px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="pending">⏳ Pending Review</option>
              <option value="approved">✅ Approved</option>
              <option value="rejected">❌ Rejected</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
          </div>

          <div className="md:col-span-3 relative">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full bg-background border border-input px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Priorities</option>
              <option value="high">🔴 High Priority</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="low">🟢 Low Priority</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      {/* Smart Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/30 border-b border-border text-xs uppercase text-muted-foreground font-semibold">
              <tr>
                <th className="px-6 py-4">Claim Details</th>
                <th className="px-6 py-4">Policy Type</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">AI Risk Analysis</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {claims.map((claim) => (
                <tr key={claim.id} className="group hover:bg-muted/30 transition-colors">
                  
                  {/* Column 1: ID & User */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-mono font-medium text-primary mb-0.5">{claim.id}</span>
                      <span className="font-medium text-foreground">{claim.user}</span>
                      <span className="text-xs text-muted-foreground">{claim.email}</span>
                    </div>
                  </td>

                  {/* Column 2: Type & Policy */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium">{claim.type}</span>
                      <span className="text-xs text-muted-foreground font-mono">{claim.policyNumber}</span>
                    </div>
                  </td>

                  {/* Column 3: Amount */}
                  <td className="px-6 py-4 font-semibold text-foreground flex items-center gap-1 mt-3">
                    <IndianRupee size={14} />
                    {claim.amount.toLocaleString('en-IN')}
                  </td>

                  {/* Column 4: AI Risk Score (NEW) */}
                  <td className="px-6 py-4">
                    {claim.aiRiskScore !== undefined && getRiskBadge(claim.aiRiskScore)}
                  </td>

                  {/* Column 5: Status */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusClass(claim.status)}`}>
                      {getStatusIcon(claim.status)}
                      {claim.status === 'manual_review' ? 'Under Review' : claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                    </span>
                    <div className="text-xs text-muted-foreground mt-1 ml-1">
                      Updated: {claim.lastUpdate}
                    </div>
                  </td>

                  {/* Column 6: Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-background border border-border hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors shadow-sm" title="View Details">
                        <Eye size={16} />
                      </button>
                      {(claim.status === 'pending' || claim.status === 'review') && (
                        <>
                          <button className="p-2 bg-green-50 border border-green-200 hover:bg-green-100 rounded-lg text-green-600 transition-colors shadow-sm" title="Quick Approve">
                            <CheckCircle size={16} />
                          </button>
                          <button className="p-2 bg-red-50 border border-red-200 hover:bg-red-100 rounded-lg text-red-600 transition-colors shadow-sm" title="Quick Reject">
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="border-t border-border px-6 py-4 flex items-center justify-between bg-muted/20">
          <p className="text-xs text-muted-foreground">
            Showing <span className="font-medium text-foreground">1-7</span> of <span className="font-medium text-foreground">50</span> claims
          </p>
          <div className="flex items-center gap-1">
            <button className="p-1.5 hover:bg-muted rounded-md text-muted-foreground disabled:opacity-50" disabled>
              <ChevronLeft size={16} />
            </button>
            <button className="p-1.5 hover:bg-muted rounded-md text-muted-foreground">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
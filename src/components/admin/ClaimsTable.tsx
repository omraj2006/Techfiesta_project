import React, { useState } from 'react';
import { Search, Filter, Download, Eye, CheckCircle, XCircle, Clock, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface Claim {
  id: string;
  user: string;
  email: string;
  type: string;
  policyNumber: string;
  amount: number;
  status: 'approved' | 'pending' | 'rejected' | 'review';
  priority: 'high' | 'medium' | 'low';
  submitDate: string;
  lastUpdate: string;
}

export function ClaimsTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const claims: Claim[] = [
    { id: 'CLM-2024-1234', user: 'John Doe', email: 'john@example.com', type: 'Auto Insurance', policyNumber: 'POL-789456', amount: 5250, status: 'approved', priority: 'medium', submitDate: '2024-12-14', lastUpdate: '2024-12-15 10:23' },
    { id: 'CLM-2024-1235', user: 'Sarah Smith', email: 'sarah@example.com', type: 'Home Insurance', policyNumber: 'POL-123789', amount: 12400, status: 'pending', priority: 'high', submitDate: '2024-12-15', lastUpdate: '2024-12-15 09:45' },
    { id: 'CLM-2024-1236', user: 'Mike Johnson', email: 'mike@example.com', type: 'Health Insurance', policyNumber: 'POL-456123', amount: 8750, status: 'review', priority: 'high', submitDate: '2024-12-15', lastUpdate: '2024-12-15 09:12' },
    { id: 'CLM-2024-1237', user: 'Emily Brown', email: 'emily@example.com', type: 'Auto Insurance', policyNumber: 'POL-987654', amount: 3200, status: 'approved', priority: 'low', submitDate: '2024-12-14', lastUpdate: '2024-12-15 08:54' },
    { id: 'CLM-2024-1238', user: 'David Wilson', email: 'david@example.com', type: 'Life Insurance', policyNumber: 'POL-321654', amount: 25000, status: 'rejected', priority: 'medium', submitDate: '2024-12-13', lastUpdate: '2024-12-15 08:32' },
    { id: 'CLM-2024-1239', user: 'Lisa Anderson', email: 'lisa@example.com', type: 'Travel Insurance', policyNumber: 'POL-654987', amount: 1850, status: 'pending', priority: 'low', submitDate: '2024-12-15', lastUpdate: '2024-12-15 08:15' },
    { id: 'CLM-2024-1240', user: 'Robert Taylor', email: 'robert@example.com', type: 'Auto Insurance', policyNumber: 'POL-852369', amount: 4500, status: 'review', priority: 'medium', submitDate: '2024-12-15', lastUpdate: '2024-12-15 07:48' },
    { id: 'CLM-2024-1241', user: 'Jennifer Lee', email: 'jennifer@example.com', type: 'Home Insurance', policyNumber: 'POL-741852', amount: 18900, status: 'approved', priority: 'high', submitDate: '2024-12-14', lastUpdate: '2024-12-15 07:21' },
    { id: 'CLM-2024-1242', user: 'William Garcia', email: 'william@example.com', type: 'Health Insurance', policyNumber: 'POL-963852', amount: 6300, status: 'pending', priority: 'medium', submitDate: '2024-12-15', lastUpdate: '2024-12-15 06:59' },
    { id: 'CLM-2024-1243', user: 'Amanda Martinez', email: 'amanda@example.com', type: 'Auto Insurance', policyNumber: 'POL-159753', amount: 7800, status: 'review', priority: 'high', submitDate: '2024-12-15', lastUpdate: '2024-12-15 06:34' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="text-[#10b981]" size={18} />;
      case 'rejected':
        return <XCircle className="text-destructive" size={18} />;
      case 'pending':
      case 'review':
        return <Clock className="text-[#f59e0b]" size={18} />;
      default:
        return null;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-[#10b981]/20 text-[#10b981] border-[#10b981]/20';
      case 'rejected':
        return 'bg-destructive/20 text-destructive border-destructive/20';
      case 'pending':
        return 'bg-[#f59e0b]/20 text-[#f59e0b] border-[#f59e0b]/20';
      case 'review':
        return 'bg-accent/20 text-accent border-accent/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive/10 text-destructive';
      case 'medium':
        return 'bg-[#f59e0b]/10 text-[#f59e0b]';
      case 'low':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1>Claims Management</h1>
          <p className="text-muted-foreground mt-1">Review and manage all insurance claims</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg transition-all hover:bg-accent hover:text-accent-foreground border border-border flex items-center gap-2">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-card border border-border rounded-lg p-4 shadow-card">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by ID, user, policy number..."
                className="w-full bg-input-background border border-input pl-10 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-input-background border border-input px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all appearance-none"
            >
              <option value="all">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="review">In Review</option>
              <option value="rejected">Rejected</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={18} />
          </div>

          {/* Priority Filter */}
          <div className="relative">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full bg-input-background border border-input px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all appearance-none"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={18} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                  <input type="checkbox" className="w-4 h-4 rounded border-input bg-input-background accent-primary" />
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Claim ID</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">User</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Policy</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Amount</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Priority</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Last Update</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {claims.map((claim) => (
                <tr key={claim.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="w-4 h-4 rounded border-input bg-input-background accent-primary" />
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-primary font-medium">{claim.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{claim.user}</p>
                      <p className="text-caption text-muted-foreground">{claim.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{claim.type}</td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm">{claim.policyNumber}</span>
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    ${claim.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusClass(claim.status)}`}>
                      {getStatusIcon(claim.status)}
                      {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityClass(claim.priority)}`}>
                      {claim.priority.charAt(0).toUpperCase() + claim.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {claim.lastUpdate}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="View Details">
                        <Eye size={18} className="text-muted-foreground" />
                      </button>
                      {claim.status === 'pending' || claim.status === 'review' ? (
                        <>
                          <button className="p-2 hover:bg-[#10b981]/10 rounded-lg transition-colors" title="Approve">
                            <CheckCircle size={18} className="text-[#10b981]" />
                          </button>
                          <button className="p-2 hover:bg-destructive/10 rounded-lg transition-colors" title="Reject">
                            <XCircle size={18} className="text-destructive" />
                          </button>
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-border px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">1-10</span> of <span className="font-medium">243</span> claims
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
              <ChevronLeft size={18} />
            </button>
            <button className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg">1</button>
            <button className="px-3 py-1.5 hover:bg-muted rounded-lg transition-colors">2</button>
            <button className="px-3 py-1.5 hover:bg-muted rounded-lg transition-colors">3</button>
            <span className="px-2 text-muted-foreground">...</span>
            <button className="px-3 py-1.5 hover:bg-muted rounded-lg transition-colors">25</button>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

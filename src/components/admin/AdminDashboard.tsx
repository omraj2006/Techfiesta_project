import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle,
  DollarSign,
  Users,
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function AdminDashboard() {
  const kpis = [
    {
      title: 'Total Claims',
      value: '1,234',
      change: '+12.5%',
      trend: 'up',
      icon: FileText,
      color: 'primary'
    },
    {
      title: 'Approved Claims',
      value: '967',
      change: '+8.2%',
      trend: 'up',
      icon: CheckCircle,
      color: '[#10b981]'
    },
    {
      title: 'Pending Review',
      value: '156',
      change: '-5.3%',
      trend: 'down',
      icon: Clock,
      color: '[#f59e0b]'
    },
    {
      title: 'Rejected Claims',
      value: '111',
      change: '+2.1%',
      trend: 'up',
      icon: XCircle,
      color: 'destructive'
    },
    {
      title: 'Total Payout',
      value: '$2.4M',
      change: '+15.8%',
      trend: 'up',
      icon: DollarSign,
      color: 'accent'
    },
    {
      title: 'Active Users',
      value: '5,678',
      change: '+23.1%',
      trend: 'up',
      icon: Users,
      color: '[#8b5cf6]'
    },
    {
      title: 'Fraud Alerts',
      value: '23',
      change: '-12.5%',
      trend: 'down',
      icon: AlertTriangle,
      color: 'destructive'
    },
    {
      title: 'Avg Processing Time',
      value: '3.2 min',
      change: '-18.4%',
      trend: 'down',
      icon: TrendingDown,
      color: '[#10b981]'
    }
  ];

  const claimsData = [
    { month: 'Jan', approved: 120, pending: 45, rejected: 15 },
    { month: 'Feb', approved: 145, pending: 38, rejected: 12 },
    { month: 'Mar', approved: 168, pending: 42, rejected: 18 },
    { month: 'Apr', approved: 192, pending: 35, rejected: 14 },
    { month: 'May', approved: 215, pending: 48, rejected: 16 },
    { month: 'Jun', approved: 245, pending: 52, rejected: 19 }
  ];

  const statusData = [
    { name: 'Approved', value: 967, color: '#10b981' },
    { name: 'Pending', value: 156, color: '#f59e0b' },
    { name: 'Rejected', value: 111, color: '#ef4444' }
  ];

  const recentClaims = [
    { id: 'CLM-2024-1234', user: 'John Doe', type: 'Auto Insurance', amount: '$5,250', status: 'approved', time: '5 mins ago' },
    { id: 'CLM-2024-1235', user: 'Sarah Smith', type: 'Home Insurance', amount: '$12,400', status: 'pending', time: '12 mins ago' },
    { id: 'CLM-2024-1236', user: 'Mike Johnson', type: 'Health Insurance', amount: '$8,750', status: 'pending', time: '23 mins ago' },
    { id: 'CLM-2024-1237', user: 'Emily Brown', type: 'Auto Insurance', amount: '$3,200', status: 'approved', time: '35 mins ago' },
    { id: 'CLM-2024-1238', user: 'David Wilson', type: 'Life Insurance', amount: '$25,000', status: 'rejected', time: '42 mins ago' }
  ];

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1>Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg transition-all hover:bg-accent hover:text-accent-foreground border border-border">
            Export Report
          </button>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg transition-all hover:opacity-90">
            View All Claims
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <div key={index} className="bg-card border border-border rounded-lg p-5 shadow-card hover:shadow-card-hover transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className={`bg-${kpi.color}/10 border border-${kpi.color}/20 p-2.5 rounded-lg`}>
                <kpi.icon className={`text-${kpi.color}`} size={20} />
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                kpi.trend === 'up' ? 'text-[#10b981]' : 'text-destructive'
              }`}>
                {kpi.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {kpi.change}
              </div>
            </div>
            <p className="text-caption text-muted-foreground mb-1">{kpi.title}</p>
            <p className="text-2xl font-semibold">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Claims Trend */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-6 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3>Claims Overview</h3>
              <p className="text-caption text-muted-foreground mt-1">Monthly claims by status</p>
            </div>
            <select className="bg-input-background border border-input px-3 py-2 rounded-lg text-sm">
              <option>Last 6 Months</option>
              <option>Last 12 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={claimsData}>
              <defs>
                <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRejected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#141823', border: '1px solid #1e293b', borderRadius: '8px' }} />
              <Legend />
              <Area type="monotone" dataKey="approved" stroke="#10b981" fillOpacity={1} fill="url(#colorApproved)" />
              <Area type="monotone" dataKey="pending" stroke="#f59e0b" fillOpacity={1} fill="url(#colorPending)" />
              <Area type="monotone" dataKey="rejected" stroke="#ef4444" fillOpacity={1} fill="url(#colorRejected)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-card">
          <h3 className="mb-6">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#141823', border: '1px solid #1e293b', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-3 mt-4">
            {statusData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm">{item.name}</span>
                </div>
                <span className="text-sm font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Claims */}
      <div className="bg-card border border-border rounded-lg shadow-card">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h3>Recent Claims</h3>
            <p className="text-caption text-muted-foreground mt-1">Latest claim submissions</p>
          </div>
          <button className="text-primary hover:underline flex items-center gap-1">
            View All
            <ArrowUpRight size={16} />
          </button>
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
                <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Time</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentClaims.map((claim, index) => (
                <tr key={index} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-primary">{claim.id}</span>
                  </td>
                  <td className="px-6 py-4">{claim.user}</td>
                  <td className="px-6 py-4 text-muted-foreground">{claim.type}</td>
                  <td className="px-6 py-4 font-semibold">{claim.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      claim.status === 'approved' 
                        ? 'bg-[#10b981]/20 text-[#10b981]' 
                        : claim.status === 'pending'
                        ? 'bg-[#f59e0b]/20 text-[#f59e0b]'
                        : 'bg-destructive/20 text-destructive'
                    }`}>
                      {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-sm">{claim.time}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary hover:underline">Review</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

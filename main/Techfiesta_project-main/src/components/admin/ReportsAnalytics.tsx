import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, FileText, Clock, CheckCircle, Download, Calendar } from 'lucide-react';

export function ReportsAnalytics() {
  const [dateRange, setDateRange] = useState('30days');

  // Mock data for charts
  const claimsTrendData = [
    { month: 'Jul', submitted: 45, approved: 38, rejected: 7 },
    { month: 'Aug', submitted: 52, approved: 44, rejected: 8 },
    { month: 'Sep', submitted: 48, approved: 41, rejected: 7 },
    { month: 'Oct', submitted: 61, approved: 52, rejected: 9 },
    { month: 'Nov', submitted: 58, approved: 49, rejected: 9 },
    { month: 'Dec', submitted: 64, approved: 54, rejected: 10 },
  ];

  const claimsByTypeData = [
    { name: 'Auto', value: 145, color: '#3b82f6' },
    { name: 'Home', value: 98, color: '#10b981' },
    { name: 'Health', value: 127, color: '#f59e0b' },
    { name: 'Life', value: 43, color: '#8b5cf6' },
  ];

  const paymentTrendData = [
    { month: 'Jul', amount: 125000 },
    { month: 'Aug', amount: 148000 },
    { month: 'Sep', amount: 132000 },
    { month: 'Oct', amount: 165000 },
    { month: 'Nov', amount: 152000 },
    { month: 'Dec', amount: 178000 },
  ];

  const processingTimeData = [
    { range: '0-24h', count: 156 },
    { range: '1-2d', count: 142 },
    { range: '2-3d', count: 87 },
    { range: '3-5d', count: 45 },
    { range: '5d+', count: 23 },
  ];

  const stats = [
    {
      label: 'Total Claims',
      value: '328',
      change: '+12.5%',
      trending: 'up',
      icon: FileText,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Approval Rate',
      value: '84.2%',
      change: '+2.3%',
      trending: 'up',
      icon: CheckCircle,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      label: 'Avg Processing Time',
      value: '1.8 days',
      change: '-0.4 days',
      trending: 'down',
      icon: Clock,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    {
      label: 'Total Payout',
      value: '$900K',
      change: '+18.7%',
      trending: 'up',
      icon: DollarSign,
      color: 'text-success',
      bg: 'bg-success/10',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-foreground mb-2">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights into claims performance</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2">
            <Calendar size={18} className="text-muted-foreground" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-transparent text-foreground focus:outline-none"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="12months">Last 12 Months</option>
            </select>
          </div>

          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-lg hover:opacity-90 transition-opacity">
            <Download size={20} />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trending === 'up' ? TrendingUp : TrendingDown;
          return (
            <div key={index} className="bg-card border border-border rounded-xl p-6 shadow-card">
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.bg} p-3 rounded-lg`}>
                  <Icon size={24} className={stat.color} />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm ${
                    stat.trending === 'up' ? 'text-success' : 'text-destructive'
                  }`}
                >
                  <TrendIcon size={16} />
                  {stat.change}
                </div>
              </div>
              <h3 className="text-foreground">{stat.value}</h3>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Claims Trend */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-card">
          <h2 className="text-foreground mb-6">Claims Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={claimsTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a202c',
                  border: '1px solid #2d3748',
                  borderRadius: '0.5rem',
                  color: '#f1f5f9',
                }}
              />
              <Legend />
              <Bar dataKey="submitted" fill="#3b82f6" name="Submitted" />
              <Bar dataKey="approved" fill="#10b981" name="Approved" />
              <Bar dataKey="rejected" fill="#ef4444" name="Rejected" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Claims by Type */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-card">
          <h2 className="text-foreground mb-6">Claims by Type</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={claimsByTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {claimsByTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a202c',
                  border: '1px solid #2d3748',
                  borderRadius: '0.5rem',
                  color: '#f1f5f9',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Trend */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-card">
          <h2 className="text-foreground mb-6">Payment Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={paymentTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a202c',
                  border: '1px solid #2d3748',
                  borderRadius: '0.5rem',
                  color: '#f1f5f9',
                }}
                formatter={(value: number) => `$${value.toLocaleString()}`}
              />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} name="Total Payout" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Processing Time Distribution */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-card">
          <h2 className="text-foreground mb-6">Processing Time Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={processingTimeData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis type="number" stroke="#94a3b8" />
              <YAxis dataKey="range" type="category" stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a202c',
                  border: '1px solid #2d3748',
                  borderRadius: '0.5rem',
                  color: '#f1f5f9',
                }}
              />
              <Bar dataKey="count" fill="#f59e0b" name="Claims" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-card">
        <h2 className="text-foreground mb-6">Key Insights</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-success/10 p-2 rounded-lg shrink-0">
                <TrendingUp size={20} className="text-success" />
              </div>
              <div>
                <h4 className="text-foreground mb-1">Improved Processing Speed</h4>
                <p className="text-sm text-muted-foreground">
                  Average claim processing time decreased by 0.4 days compared to last month
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-success/10 p-2 rounded-lg shrink-0">
                <CheckCircle size={20} className="text-success" />
              </div>
              <div>
                <h4 className="text-foreground mb-1">High Approval Rate</h4>
                <p className="text-sm text-muted-foreground">
                  84.2% approval rate shows efficient claim processing and customer satisfaction
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-lg shrink-0">
                <FileText size={20} className="text-primary" />
              </div>
              <div>
                <h4 className="text-foreground mb-1">Health Insurance Leading</h4>
                <p className="text-sm text-muted-foreground">
                  Health insurance claims account for 31% of total submissions this period
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-warning/10 p-2 rounded-lg shrink-0">
                <DollarSign size={20} className="text-warning" />
              </div>
              <div>
                <h4 className="text-foreground mb-1">Growing Payouts</h4>
                <p className="text-sm text-muted-foreground">
                  Total payouts increased by 18.7%, indicating higher claim values and volume
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

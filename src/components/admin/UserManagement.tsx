import React, { useState } from 'react';
import { Search, Filter, UserPlus, Edit, Trash2, Shield, CheckCircle, XCircle, MoreVertical } from 'lucide-react';

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      status: 'active',
      verified: true,
      claimsCount: 12,
      joinedDate: 'Jan 15, 2023',
      lastActive: '2 hours ago',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1 (555) 234-5678',
      status: 'active',
      verified: true,
      claimsCount: 8,
      joinedDate: 'Mar 22, 2023',
      lastActive: '1 day ago',
    },
    {
      id: 3,
      name: 'Robert Johnson',
      email: 'robert.j@example.com',
      phone: '+1 (555) 345-6789',
      status: 'pending',
      verified: false,
      claimsCount: 2,
      joinedDate: 'Dec 1, 2024',
      lastActive: '3 days ago',
    },
    {
      id: 4,
      name: 'Sarah Williams',
      email: 'sarah.w@example.com',
      phone: '+1 (555) 456-7890',
      status: 'active',
      verified: true,
      claimsCount: 15,
      joinedDate: 'Feb 10, 2023',
      lastActive: '5 hours ago',
    },
    {
      id: 5,
      name: 'Michael Brown',
      email: 'michael.b@example.com',
      phone: '+1 (555) 567-8901',
      status: 'suspended',
      verified: true,
      claimsCount: 3,
      joinedDate: 'Aug 5, 2023',
      lastActive: '2 weeks ago',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success/20 text-success';
      case 'pending':
        return 'bg-warning/20 text-warning';
      case 'suspended':
        return 'bg-destructive/20 text-destructive';
      default:
        return 'bg-muted/20 text-muted-foreground';
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);

    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const stats = [
    { label: 'Total Users', value: users.length, color: 'text-primary' },
    { label: 'Active Users', value: users.filter((u) => u.status === 'active').length, color: 'text-success' },
    { label: 'Pending Verification', value: users.filter((u) => !u.verified).length, color: 'text-warning' },
    { label: 'Suspended', value: users.filter((u) => u.status === 'suspended').length, color: 'text-destructive' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-foreground mb-2">User Management</h1>
          <p className="text-muted-foreground">Manage policy holders and their accounts</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-lg hover:opacity-90 transition-opacity">
          <UserPlus size={20} />
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-card border border-border rounded-xl p-6 shadow-card">
            <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
            <h3 className={stat.color}>{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-card">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-muted-foreground" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-foreground">User</th>
                <th className="px-6 py-4 text-left text-foreground">Contact</th>
                <th className="px-6 py-4 text-left text-foreground">Status</th>
                <th className="px-6 py-4 text-left text-foreground">Verified</th>
                <th className="px-6 py-4 text-left text-foreground">Claims</th>
                <th className="px-6 py-4 text-left text-foreground">Joined</th>
                <th className="px-6 py-4 text-left text-foreground">Last Active</th>
                <th className="px-6 py-4 text-left text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                        <span className="text-sm text-white">
                          {user.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-foreground">{user.name}</p>
                        <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-foreground">{user.email}</p>
                    <p className="text-sm text-muted-foreground">{user.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm capitalize ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.verified ? (
                      <div className="flex items-center gap-2 text-success">
                        <CheckCircle size={18} />
                        <span className="text-sm">Verified</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-warning">
                        <XCircle size={18} />
                        <span className="text-sm">Pending</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-foreground">{user.claimsCount}</td>
                  <td className="px-6 py-4 text-muted-foreground">{user.joinedDate}</td>
                  <td className="px-6 py-4 text-muted-foreground">{user.lastActive}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="Edit user">
                        <Edit size={18} className="text-primary" />
                      </button>
                      <button className="p-2 hover:bg-destructive/10 rounded-lg transition-colors" title="Delete user">
                        <Trash2 size={18} className="text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden divide-y divide-border">
          {filteredUsers.map((user) => (
            <div key={user.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                    <span className="text-white">
                      {user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-foreground">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                  <MoreVertical size={18} className="text-muted-foreground" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs capitalize ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Verified</p>
                  {user.verified ? (
                    <CheckCircle size={18} className="text-success" />
                  ) : (
                    <XCircle size={18} className="text-warning" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Claims</p>
                  <p className="text-foreground">{user.claimsCount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Joined</p>
                  <p className="text-foreground">{user.joinedDate}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-12 text-center">
            <div className="bg-muted/50 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Search size={32} className="text-muted-foreground" />
            </div>
            <h3 className="text-foreground mb-2">No Users Found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

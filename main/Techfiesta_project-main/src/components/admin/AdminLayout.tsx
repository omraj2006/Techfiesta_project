import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  AlertTriangle, 
  Users, 
  DollarSign, 
  BarChart3, 
  Settings, 
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  Shield,
  User,
  FileCheck
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function AdminLayout({ children, currentPage, onNavigate, onLogout }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState(3);

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'manage-all', name: 'All Claims & Apps', icon: Shield, badge: null },
    { id: 'claims', name: 'Claims Management', icon: FileText, badge: null },
    { id: 'applications', name: 'Applications Review', icon: FileCheck, badge: null },
    { id: 'fraud', name: 'Fraud Alerts', icon: AlertTriangle, badge: 5 },
    { id: 'users', name: 'User Management', icon: Users, badge: null },
    { id: 'payments', name: 'Payments', icon: DollarSign, badge: null },
    { id: 'reports', name: 'Reports & Analytics', icon: BarChart3, badge: null },
    { id: 'settings', name: 'Settings', icon: Settings, badge: null }
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-40 bg-card border-r border-border transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-0 lg:w-20'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 border-b border-border flex items-center justify-between px-4">
            {isSidebarOpen && (
              <div className="flex items-center gap-2">
                <div className="bg-primary p-1.5 rounded-lg">
                  <Shield className="text-primary-foreground" size={20} />
                </div>
                <span className="font-semibold">SmartClaim</span>
              </div>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  currentPage === item.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {isSidebarOpen && (
                  <>
                    <span className="flex-1 text-left">{item.name}</span>
                    {item.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        currentPage === item.id
                          ? 'bg-primary-foreground text-primary'
                          : 'bg-destructive text-destructive-foreground'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            ))}
          </nav>

          {/* User Profile */}
          <div className="border-t border-border p-4">
            <div className={`flex items-center gap-3 ${isSidebarOpen ? '' : 'justify-center'}`}>
              <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="text-primary" size={20} />
              </div>
              {isSidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">Admin User</p>
                  <p className="text-caption text-muted-foreground truncate">admin@smartclaim.com</p>
                </div>
              )}
            </div>
            {isSidebarOpen && (
              <button
                onClick={onLogout}
                className="w-full mt-3 flex items-center justify-center gap-2 text-destructive hover:bg-destructive/10 px-3 py-2 rounded-lg transition-all"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-muted rounded-lg transition-colors lg:hidden"
            >
              <Menu size={20} />
            </button>
            
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search claims, users, policies..."
                className="bg-input-background border border-input pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all w-80"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
              <Bell size={20} />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
              )}
            </button>

            {/* Profile (desktop only) */}
            <div className="hidden lg:flex items-center gap-3 ml-3 pl-3 border-l border-border">
              <div className="w-8 h-8 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center">
                <User className="text-primary" size={16} />
              </div>
              <div>
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-caption text-muted-foreground">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

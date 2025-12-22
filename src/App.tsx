import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { AdminApp } from './components/AdminApp';
import { UserApp } from './components/UserApp';
import { ComponentShowcase } from './components/design-system/ComponentShowcase';
import { DeveloperHandoff } from './components/design-system/DeveloperHandoff';
import { DesignSystemShowcase } from './components/DesignSystemShowcase';
import { FileText, LayoutDashboard, Palette, Code, Home, User } from 'lucide-react';

type View = 'landing' | 'user' | 'admin' ;

export default function App() {
  const [currentView, setCurrentView] = useState<View>('landing');

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      {/* Navigation Menu */}
      <div className="fixed top-4 right-4 z-[100] bg-card border border-border rounded-xl shadow-card-elevated p-2 flex flex-col gap-2">
        
         
        <div className="border-t border-border my-1"></div>
        <button
          onClick={() => setCurrentView('landing')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            currentView === 'landing' 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-muted text-muted-foreground'
          }`}
          title="Landing Page"
        >
          <Home size={20} />
          <span className="hidden lg:inline text-sm">Landing</span>
        </button>
        <button
          onClick={() => setCurrentView('user')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            currentView === 'user' 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-muted text-muted-foreground'
          }`}
          title="User Portal"
        >
          <User size={20} />
          <span className="hidden lg:inline text-sm">User Portal</span>
        </button>
        <button
          onClick={() => setCurrentView('admin')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            currentView === 'admin' 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-muted text-muted-foreground'
          }`}
          title="Admin Dashboard"
        >
          <LayoutDashboard size={20} />
          <span className="hidden lg:inline text-sm">Admin</span>
        </button>
      </div>

      {/* Content */}
      {currentView === 'landing' && <LandingPage />}
      {currentView === 'user' && <UserApp />}
      {currentView === 'admin' && <AdminApp />}
    </div>
  );
}
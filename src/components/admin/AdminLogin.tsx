import React, { useState } from 'react';
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation for demo
    if (email && password) {
      onLogin();
    } else {
      setError('Please enter valid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none"></div>
      
      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 border border-primary/20 rounded-xl mb-4">
            <Shield className="text-primary" size={32} />
          </div>
          <h1 className="mb-2">SmartClaim Admin</h1>
          <p className="text-muted-foreground">Insurance Claims Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-card border border-border rounded-xl p-8 shadow-card-elevated">
          <div className="mb-6">
            <h2 className="mb-1">Sign In</h2>
            <p className="text-muted-foreground">Enter your credentials to access the admin panel</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-destructive flex-shrink-0 mt-0.5" size={20} />
              <p className="text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@smartclaim.com"
                  className="w-full bg-input-background border border-input pl-11 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-input-background border border-input pl-11 pr-12 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-input bg-input-background accent-primary cursor-pointer"
                />
                <span className="text-sm">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg transition-all hover:opacity-90 active:scale-[0.98]"
            >
              Sign In
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <Shield size={16} className="flex-shrink-0 mt-0.5 text-[#10b981]" />
              <p>
                This is a secure admin area. All actions are logged and monitored for security purposes.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Protected by enterprise-grade security</p>
          <p className="mt-1">© 2024 SmartClaim. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

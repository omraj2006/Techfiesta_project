import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Shield, FileText, Camera, Save, CheckCircle } from 'lucide-react';

export function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setIsEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-foreground mb-2">Profile & KYC</h1>
        <p className="text-muted-foreground">Manage your personal information and verification documents</p>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="bg-success/10 border border-success/20 rounded-xl p-4 mb-6 flex items-center gap-3">
          <CheckCircle size={20} className="text-success" />
          <p className="text-foreground">Profile updated successfully!</p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-foreground">Personal Information</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-primary hover:underline"
                >
                  Edit
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Save size={18} />
                    Save
                  </button>
                </div>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-foreground mb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <User size={16} className="text-muted-foreground" />
                    Full Name
                  </div>
                </label>
                <input
                  type="text"
                  defaultValue="John Doe"
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    !isEditing && 'opacity-60 cursor-not-allowed'
                  }`}
                />
              </div>

              <div>
                <label className="block text-foreground mb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail size={16} className="text-muted-foreground" />
                    Email Address
                  </div>
                </label>
                <input
                  type="email"
                  defaultValue="john.doe@example.com"
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    !isEditing && 'opacity-60 cursor-not-allowed'
                  }`}
                />
              </div>

              <div>
                <label className="block text-foreground mb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone size={16} className="text-muted-foreground" />
                    Phone Number
                  </div>
                </label>
                <input
                  type="tel"
                  defaultValue="+1 (555) 123-4567"
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    !isEditing && 'opacity-60 cursor-not-allowed'
                  }`}
                />
              </div>

              <div>
                <label className="block text-foreground mb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={16} className="text-muted-foreground" />
                    Date of Birth
                  </div>
                </label>
                <input
                  type="date"
                  defaultValue="1990-05-15"
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    !isEditing && 'opacity-60 cursor-not-allowed'
                  }`}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-foreground mb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={16} className="text-muted-foreground" />
                    Address
                  </div>
                </label>
                <input
                  type="text"
                  defaultValue="123 Main Street, Apt 4B, New York, NY 10001"
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    !isEditing && 'opacity-60 cursor-not-allowed'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* KYC Documents */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-foreground">KYC Documents</h2>
              <span className="bg-success/20 text-success px-3 py-1 rounded-full text-sm">
                Verified
              </span>
            </div>

            <div className="space-y-4">
              <div className="bg-muted/30 border border-border rounded-xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <FileText size={20} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground mb-1">Government ID</p>
                      <p className="text-sm text-muted-foreground">Driver's License • Verified on Dec 1, 2024</p>
                    </div>
                  </div>
                  <CheckCircle size={20} className="text-success shrink-0" />
                </div>
              </div>

              <div className="bg-muted/30 border border-border rounded-xl p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <FileText size={20} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground mb-1">Proof of Address</p>
                      <p className="text-sm text-muted-foreground">Utility Bill • Verified on Dec 1, 2024</p>
                    </div>
                  </div>
                  <CheckCircle size={20} className="text-success shrink-0" />
                </div>
              </div>

              <button className="w-full border-2 border-dashed border-border hover:border-primary/50 rounded-xl p-6 transition-all group">
                <div className="flex flex-col items-center gap-2">
                  <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors">
                    <Camera size={24} className="text-primary" />
                  </div>
                  <p className="text-foreground">Upload Additional Document</p>
                  <p className="text-sm text-muted-foreground">PDF, JPG, PNG • Max 10MB</p>
                </div>
              </button>
            </div>
          </div>

          {/* Security */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
            <h2 className="text-foreground mb-6">Security Settings</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                <div>
                  <p className="text-foreground mb-1">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-muted peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                <div>
                  <p className="text-foreground mb-1">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive claim updates via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-muted peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                <div>
                  <p className="text-foreground mb-1">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive claim updates via SMS</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-muted peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Profile Picture & Quick Stats */}
        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
            <h3 className="text-foreground mb-4">Profile Picture</h3>
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl text-white">JD</span>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-foreground transition-colors">
                <Camera size={18} />
                Change Photo
              </button>
            </div>
          </div>

          {/* Account Stats */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
            <h3 className="text-foreground mb-4">Account Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-muted-foreground">Member Since</span>
                <span className="text-foreground">Jan 2023</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-muted-foreground">Total Claims</span>
                <span className="text-foreground">12</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <span className="text-muted-foreground">Active Policies</span>
                <span className="text-foreground">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Verification Status</span>
                <span className="bg-success/20 text-success px-2 py-1 rounded text-sm">Verified</span>
              </div>
            </div>
          </div>

          {/* Help */}
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <Shield size={20} className="text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-foreground mb-2">Data Privacy</p>
                <p className="text-sm text-muted-foreground">
                  Your information is encrypted and secure. We never share your data without consent.
                </p>
              </div>
            </div>
            <button className="text-primary hover:underline text-sm">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

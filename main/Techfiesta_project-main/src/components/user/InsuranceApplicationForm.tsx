import React, { useState } from 'react';
import { Sparkles, Send, FileText, User, Mail, Phone, MapPin, Calendar, Users } from 'lucide-react';
import { generateAutofillData } from '../../utils/autofillData';

interface InsuranceApplicationFormProps {
  onSubmit: (formData: ApplicationFormData) => void;
  onCancel: () => void;
}

export interface ApplicationFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  dateOfBirth: string;
  gender: string;
  insuranceType: string;
  coverageAmount: string;
  policyDetails: string;
  medicalHistory?: string;
  occupation?: string;
  annualIncome?: string;
}

export function InsuranceApplicationForm({ onSubmit, onCancel }: InsuranceApplicationFormProps) {
  const [formData, setFormData] = useState<ApplicationFormData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    dateOfBirth: '',
    gender: '',
    insuranceType: 'health',
    coverageAmount: '',
    policyDetails: '',
    medicalHistory: '',
    occupation: '',
    annualIncome: ''
  });

  const [isAutoFilled, setIsAutoFilled] = useState(false);

  const handleAutofill = () => {
    const autoData = generateAutofillData();
    setFormData(prev => ({
      ...prev,
      fullName: autoData.fullName,
      email: autoData.email,
      phoneNumber: autoData.phoneNumber,
      address: autoData.address,
      city: autoData.city,
      state: autoData.state,
      zipCode: autoData.zipCode,
      dateOfBirth: autoData.dateOfBirth,
      gender: autoData.gender
    }));
    setIsAutoFilled(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-card border border-border rounded-xl shadow-card-elevated">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-foreground mb-2">Insurance Application Form</h2>
              <p className="text-muted-foreground">Fill out the form below to apply for insurance coverage</p>
            </div>
            <button
              type="button"
              onClick={handleAutofill}
              className="flex items-center gap-2 bg-accent/20 text-accent border border-accent/30 px-4 py-2 rounded-lg hover:bg-accent/30 transition-all"
            >
              <Sparkles size={18} />
              Auto-Fill Demo Data
            </button>
          </div>
          {isAutoFilled && (
            <div className="mt-4 bg-accent/10 border border-accent/20 rounded-lg p-3 text-sm text-accent">
              ✓ Common fields auto-filled. Please review and fill in private information manually.
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information Section */}
          <div>
            <h3 className="text-foreground mb-4 flex items-center gap-2">
              <User size={20} className="text-primary" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium">Full Name *</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-input-background border border-input px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email Address *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.doe@example.com"
                  className="w-full bg-input-background border border-input px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="text-sm font-medium">Phone Number *</label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="(555) 123-4567"
                  className="w-full bg-input-background border border-input px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="dateOfBirth" className="text-sm font-medium">Date of Birth *</label>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full bg-input-background border border-input px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="gender" className="text-sm font-medium">Gender *</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full bg-input-background border border-input px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div>
            <h3 className="text-foreground mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-primary" />
              Address Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="address" className="text-sm font-medium">Street Address *</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main Street"
                  className="w-full bg-input-background border border-input px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium">City *</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="New York"
                  className="w-full bg-input-background border border-input px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="state" className="text-sm font-medium">State *</label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="NY"
                  className="w-full bg-input-background border border-input px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="zipCode" className="text-sm font-medium">ZIP Code *</label>
                <input
                  id="zipCode"
                  name="zipCode"
                  type="text"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="10001"
                  className="w-full bg-input-background border border-input px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  required
                />
              </div>
            </div>
          </div>

          {/* Insurance Details Section */}
          <div>
            <h3 className="text-foreground mb-4 flex items-center gap-2">
              <FileText size={20} className="text-primary" />
              Insurance Details (Private Information)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="insuranceType" className="text-sm font-medium">Insurance Type *</label>
                <select
                  id="insuranceType"
                  name="insuranceType"
                  value={formData.insuranceType}
                  onChange={handleChange}
                  className="w-full bg-input-background border border-input px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  required
                >
                  <option value="health">Health Insurance</option>
                  <option value="life">Life Insurance</option>
                  <option value="auto">Auto Insurance</option>
                  <option value="home">Home Insurance</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="coverageAmount" className="text-sm font-medium">Coverage Amount *</label>
                <input
                  id="coverageAmount"
                  name="coverageAmount"
                  type="text"
                  value={formData.coverageAmount}
                  onChange={handleChange}
                  placeholder="$100,000"
                  className="w-full bg-input-background border border-input px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="occupation" className="text-sm font-medium">Occupation *</label>
                <input
                  id="occupation"
                  name="occupation"
                  type="text"
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder="Software Engineer"
                  className="w-full bg-input-background border border-input px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="annualIncome" className="text-sm font-medium">Annual Income *</label>
                <input
                  id="annualIncome"
                  name="annualIncome"
                  type="text"
                  value={formData.annualIncome}
                  onChange={handleChange}
                  placeholder="$75,000"
                  className="w-full bg-input-background border border-input px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="policyDetails" className="text-sm font-medium">Policy Details *</label>
                <textarea
                  id="policyDetails"
                  name="policyDetails"
                  value={formData.policyDetails}
                  onChange={handleChange}
                  placeholder="Describe the coverage you need and any specific requirements..."
                  rows={3}
                  className="w-full bg-input-background border border-input px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="medicalHistory" className="text-sm font-medium">Medical History (if applicable)</label>
                <textarea
                  id="medicalHistory"
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleChange}
                  placeholder="Please provide any relevant medical history..."
                  rows={3}
                  className="w-full bg-input-background border border-input px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 rounded-lg border border-border text-muted-foreground hover:bg-muted transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg hover:opacity-90 transition-all"
            >
              <Send size={18} />
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

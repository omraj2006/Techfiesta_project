import React, { useState } from 'react';
import { X, Upload, Camera, FileText, CheckCircle, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';

interface ClaimInterfaceProps {
  onClose: () => void;
}

type ClaimStep = 'type' | 'upload' | 'details' | 'review' | 'submitted';

export function ClaimInterface({ onClose }: ClaimInterfaceProps) {
  const [currentStep, setCurrentStep] = useState<ClaimStep>('type');
  const [selectedClaimType, setSelectedClaimType] = useState<string>('');

  const claimTypes = [
    { id: 'auto', label: 'Auto Insurance', icon: '🚗' },
    { id: 'home', label: 'Home Insurance', icon: '🏠' },
    { id: 'health', label: 'Health Insurance', icon: '🏥' },
    { id: 'life', label: 'Life Insurance', icon: '❤️' },
  ];

  const handleNext = () => {
    if (currentStep === 'type' && selectedClaimType) {
      setCurrentStep('upload');
    } else if (currentStep === 'upload') {
      setCurrentStep('details');
    } else if (currentStep === 'details') {
      setCurrentStep('review');
    } else if (currentStep === 'review') {
      setCurrentStep('submitted');
    }
  };

  const handleBack = () => {
    if (currentStep === 'upload') {
      setCurrentStep('type');
    } else if (currentStep === 'details') {
      setCurrentStep('upload');
    } else if (currentStep === 'review') {
      setCurrentStep('details');
    }
  };

  const getStepNumber = () => {
    const steps: Record<ClaimStep, number> = {
      'type': 1,
      'upload': 2,
      'details': 3,
      'review': 4,
      'submitted': 5
    };
    return steps[currentStep];
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl shadow-card-elevated max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-foreground">File New Claim</h2>
            {currentStep !== 'submitted' && (
              <p className="text-sm text-muted-foreground mt-1">Step {getStepNumber()} of 4</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={24} className="text-muted-foreground" />
          </button>
        </div>

        {/* Progress Bar */}
        {currentStep !== 'submitted' && (
          <div className="px-6 pt-4">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${(getStepNumber() / 4) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: Select Claim Type */}
          {currentStep === 'type' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-foreground mb-2">Select Claim Type</h3>
                <p className="text-muted-foreground">Choose the type of insurance claim you want to file</p>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {claimTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedClaimType(type.id)}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      selectedClaimType === type.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50 bg-card'
                    }`}
                  >
                    <div className="text-4xl mb-3">{type.icon}</div>
                    <h4 className="text-foreground">{type.label}</h4>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Upload Documents */}
          {currentStep === 'upload' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-foreground mb-2">Upload Documents</h3>
                <p className="text-muted-foreground">Take photos or upload documents related to your claim</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <button className="p-8 border-2 border-dashed border-border hover:border-primary/50 rounded-xl transition-all bg-card hover:bg-primary/5 group">
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-primary/10 p-4 rounded-full group-hover:bg-primary/20 transition-colors">
                      <Camera size={32} className="text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="text-foreground">Take Photo</p>
                      <p className="text-sm text-muted-foreground mt-1">Use your camera</p>
                    </div>
                  </div>
                </button>

                <button className="p-8 border-2 border-dashed border-border hover:border-primary/50 rounded-xl transition-all bg-card hover:bg-primary/5 group">
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-primary/10 p-4 rounded-full group-hover:bg-primary/20 transition-colors">
                      <Upload size={32} className="text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="text-foreground">Upload Files</p>
                      <p className="text-sm text-muted-foreground mt-1">From your device</p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex gap-3">
                <AlertCircle size={20} className="text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-foreground">Supported formats</p>
                  <p className="text-sm text-muted-foreground mt-1">JPG, PNG, PDF • Max 10MB per file</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Claim Details */}
          {currentStep === 'details' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-foreground mb-2">Claim Details</h3>
                <p className="text-muted-foreground">Tell us what happened</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-foreground mb-2">Incident Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-foreground mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="Where did the incident occur?"
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-foreground mb-2">Description</label>
                  <textarea
                    rows={5}
                    placeholder="Describe what happened in detail..."
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-foreground mb-2">Estimated Claim Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 'review' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-foreground mb-2">Review Your Claim</h3>
                <p className="text-muted-foreground">Make sure everything looks correct before submitting</p>
              </div>

              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Claim Type</p>
                  <p className="text-foreground">{claimTypes.find(t => t.id === selectedClaimType)?.label}</p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Documents</p>
                  <p className="text-foreground">2 files uploaded</p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Estimated Amount</p>
                  <p className="text-foreground">$5,250.00</p>
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex gap-3">
                <CheckCircle size={20} className="text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-foreground">Ready to submit</p>
                  <p className="text-sm text-muted-foreground mt-1">You'll receive updates via email and SMS</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Submitted */}
          {currentStep === 'submitted' && (
            <div className="text-center py-8 space-y-6">
              <div className="flex justify-center">
                <div className="bg-success/10 border border-success/20 p-6 rounded-full">
                  <CheckCircle size={64} className="text-success" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-foreground">Claim Submitted Successfully!</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Your claim has been received and is being processed. You'll receive updates as it progresses.
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 max-w-md mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">Claim ID</p>
                  <p className="text-foreground">#CLM-2024-{Math.floor(Math.random() * 10000)}</p>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span className="bg-warning/20 text-warning px-3 py-1 rounded-full text-sm">Processing</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Expected Response</p>
                  <p className="text-foreground">2-5 minutes</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="bg-primary text-primary-foreground px-8 py-3 rounded-lg transition-all hover:opacity-90 active:scale-[0.98]"
              >
                View Dashboard
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {currentStep !== 'submitted' && (
          <div className="p-6 border-t border-border flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 'type'}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                currentStep === 'type'
                  ? 'text-muted-foreground cursor-not-allowed'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              <ArrowLeft size={20} />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={currentStep === 'type' && !selectedClaimType}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                currentStep === 'type' && !selectedClaimType
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98]'
              }`}
            >
              {currentStep === 'review' ? 'Submit Claim' : 'Next'}
              <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
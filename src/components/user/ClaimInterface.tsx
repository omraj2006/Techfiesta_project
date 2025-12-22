import React, { useState } from 'react';
import { X, Upload, Camera, FileText, CheckCircle, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';

interface ClaimInterfaceProps {
  onClose: () => void;
  onClaimSubmitted?: (claimData: {
    claimId: string;
    validationResponse: ValidationResponse;
    claimType: string;
    amount: string;
  }) => void;
}

type ClaimStep = 'type' | 'upload' | 'details' | 'review' | 'submitted';

interface ValidationResponse {
  success: boolean;
  data?: any;
  validation?: {
    status: 'APPROVED' | 'REJECTED' | 'MANUAL_REVIEW';
    issues?: string[];
  };
}

export function ClaimInterface({ onClose, onClaimSubmitted }: ClaimInterfaceProps) {
  const [currentStep, setCurrentStep] = useState<ClaimStep>('type');
  const [selectedClaimType, setSelectedClaimType] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [claimAmount, setClaimAmount] = useState<string>('');
  const [incidentDate, setIncidentDate] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationResponse, setValidationResponse] = useState<ValidationResponse | null>(null);
  const [claimId, setClaimId] = useState<string>('');

  const claimTypes = [
    { id: 'vehicle', label: 'Auto Insurance', icon: '🚗' },
    { id: 'home', label: 'Home Insurance', icon: '🏠' },
    { id: 'health', label: 'Health Insurance', icon: '🏥' },
    { id: 'life', label: 'Life Insurance', icon: '❤️' },
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const submitClaimToBackend = async () => {
    if (!uploadedFile || !claimAmount || !selectedClaimType) {
      alert('Please upload a file and enter claim amount');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('image', uploadedFile);
      formData.append('amount', claimAmount);
      
      if (incidentDate) formData.append('incident_date', incidentDate);
      if (location) formData.append('location', location);
      if (description) formData.append('description', description);

      const endpoint = `/validate-${selectedClaimType}`;
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      const result: ValidationResponse = await response.json();
      setValidationResponse(result);
      
      const generatedClaimId = `#CLM-2024-${Math.floor(Math.random() * 10000)}`;
      setClaimId(generatedClaimId);
      
      if (onClaimSubmitted) {
        onClaimSubmitted({
          claimId: generatedClaimId,
          validationResponse: result,
          claimType: claimTypes.find(t => t.id === selectedClaimType)?.label || selectedClaimType,
          amount: claimAmount,
        });
      }
      
      setCurrentStep('submitted');
    } catch (error) {
      console.error('Error submitting claim:', error);
      alert('Failed to submit claim. Please ensure backend is running on http://localhost:3000');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentStep === 'type' && selectedClaimType) {
      setCurrentStep('upload');
    } else if (currentStep === 'upload') {
      if (!uploadedFile) {
        alert('Please upload a document');
        return;
      }
      setCurrentStep('details');
    } else if (currentStep === 'details') {
      if (!claimAmount) {
        alert('Please enter claim amount');
        return;
      }
      setCurrentStep('review');
    } else if (currentStep === 'review') {
      submitClaimToBackend();
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
                <label className="p-8 border-2 border-dashed border-border hover:border-primary/50 rounded-xl transition-all bg-card hover:bg-primary/5 group cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-primary/10 p-4 rounded-full group-hover:bg-primary/20 transition-colors">
                      <Camera size={32} className="text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="text-foreground">Take Photo</p>
                      <p className="text-sm text-muted-foreground mt-1">Use your camera</p>
                    </div>
                  </div>
                </label>

                <label className="p-8 border-2 border-dashed border-border hover:border-primary/50 rounded-xl transition-all bg-card hover:bg-primary/5 group cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-primary/10 p-4 rounded-full group-hover:bg-primary/20 transition-colors">
                      <Upload size={32} className="text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="text-foreground">Upload Files</p>
                      <p className="text-sm text-muted-foreground mt-1">From your device</p>
                    </div>
                  </div>
                </label>
              </div>

              {uploadedFile && (
                <div className="bg-success/10 border border-success/20 rounded-lg p-4 flex gap-3">
                  <CheckCircle size={20} className="text-success shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-foreground">File uploaded</p>
                    <p className="text-sm text-muted-foreground mt-1">{uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)</p>
                  </div>
                </div>
              )}

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
                    value={incidentDate}
                    onChange={(e) => setIncidentDate(e.target.value)}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-foreground mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="Where did the incident occur?"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div>
                  <label className="block text-foreground mb-2">Description</label>
                  <textarea
                    rows={5}
                    placeholder="Describe what happened in detail..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-foreground mb-2">Estimated Claim Amount *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={claimAmount}
                      onChange={(e) => setClaimAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      required
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
                  <p className="text-foreground">{uploadedFile ? uploadedFile.name : 'No file uploaded'}</p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">Estimated Amount</p>
                  <p className="text-foreground">${claimAmount || '0.00'}</p>
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
          {currentStep === 'submitted' && validationResponse && (
            <div className="text-center py-8 space-y-6">
              <div className="flex justify-center">
                <div className={`p-6 rounded-full ${
                  validationResponse.validation?.status === 'APPROVED'
                    ? 'bg-success/10 border border-success/20'
                    : validationResponse.validation?.status === 'REJECTED'
                    ? 'bg-destructive/10 border border-destructive/20'
                    : 'bg-warning/10 border border-warning/20'
                }`}>
                  <CheckCircle size={64} className={`${
                    validationResponse.validation?.status === 'APPROVED'
                      ? 'text-success'
                      : validationResponse.validation?.status === 'REJECTED'
                      ? 'text-destructive'
                      : 'text-warning'
                  }`} />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-foreground">Claim Submitted Successfully!</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Your claim has been received and processed. See validation results below.
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-6 max-w-md mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">Claim ID</p>
                  <p className="text-foreground">{claimId}</p>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    validationResponse.validation?.status === 'APPROVED'
                      ? 'bg-success/20 text-success'
                      : validationResponse.validation?.status === 'REJECTED'
                      ? 'bg-destructive/20 text-destructive'
                      : 'bg-warning/20 text-warning'
                  }`}>
                    {validationResponse.validation?.status || 'Processing'}
                  </span>
                </div>
                {validationResponse.validation?.issues && validationResponse.validation.issues.length > 0 && (
                  <div className="border-t border-border pt-4 mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Validation Issues:</p>
                    <ul className="text-sm text-foreground space-y-1 text-left">
                      {validationResponse.validation.issues.map((issue, idx) => (
                        <li key={idx}>• {issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {validationResponse.data && (
                  <div className="border-t border-border pt-4 mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Extracted Data:</p>
                    <div className="text-sm text-foreground text-left space-y-1">
                      {Object.entries(validationResponse.data).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-muted-foreground">{key}:</span>
                          <span>{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
              disabled={(currentStep === 'type' && !selectedClaimType) || isSubmitting}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                (currentStep === 'type' && !selectedClaimType) || isSubmitting
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98]'
              }`}
            >
              {isSubmitting ? 'Submitting...' : currentStep === 'review' ? 'Submit Claim' : 'Next'}
              {!isSubmitting && <ArrowRight size={20} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

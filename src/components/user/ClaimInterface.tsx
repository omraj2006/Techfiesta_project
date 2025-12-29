import React, { useState } from 'react';
import { X, Upload, CheckCircle, ArrowRight, ArrowLeft, ScanEye, FileText, Loader2, AlertTriangle, ChevronDown } from 'lucide-react';
import { useImageClassifier } from '../../hooks/useImageClassifier';

interface ClaimInterfaceProps {
  onClose: () => void;
  onClaimSubmitted?: (claimData: {
    claimId: string;
    validationResponse: ValidationResponse;
    claimType: string;
    amount: string;
  }) => void;
}

type ClaimStep = 'type' | 'evidence' | 'details' | 'review' | 'submitted';

interface ValidationResponse {
  success: boolean;
  data?: any;
  validation?: {
    status: 'APPROVED' | 'REJECTED' | 'MANUAL_REVIEW';
    issues?: string[];
  };
}

// Mock Policies
const MOCK_POLICIES: Record<string, string[]> = {
    'vehicle': ['POL-AUTO-9988 (Tata Nexon)', 'POL-AUTO-1122 (Honda City)'],
    'home': ['POL-HOME-4455 (Pune Flat)', 'POL-HOME-7788 (Mumbai Villa)'],
    'health': ['POL-HLTH-3344 (Family Floater)', 'POL-HLTH-5566 (Senior Citizen)'],
    'life': ['POL-LIFE-2211 (Term Plan)', 'POL-LIFE-9900 (Endowment)']
};

export function ClaimInterface({ onClose, onClaimSubmitted }: ClaimInterfaceProps) {
  const [currentStep, setCurrentStep] = useState<ClaimStep>('type');
  const [selectedClaimType, setSelectedClaimType] = useState<string>('');
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>('');
  
  // File State
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [policyFile, setPolicyFile] = useState<File | null>(null);

  // Form State
  const [claimAmount, setClaimAmount] = useState<string>('');
  const [incidentDate, setIncidentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState<string>('');
  
  // Processing State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationResponse, setValidationResponse] = useState<ValidationResponse | null>(null);
  const [claimId, setClaimId] = useState<string>('');
  const [isExtractingData, setIsExtractingData] = useState(false);
  const [extractedPolicyData, setExtractedPolicyData] = useState<any>(null);

  // AI Hook
  const { classifyImage, prediction, confidence, isAnalyzing } = useImageClassifier();

  const claimTypes = [
    { 
        id: 'vehicle', 
        label: 'Auto Insurance', 
        icon: '🚗', 
        aiClass: 'damage_vehicle', 
        evidenceLabel: 'Car Damage Photo',
        endpoint: '/validate-vehicle' 
    },
    { 
        id: 'home', 
        label: 'Home Insurance', 
        icon: '🏠', 
        aiClass: 'damage_home', 
        evidenceLabel: 'Home Damage Photo',
        endpoint: '/validate-home' 
    },
    { 
        id: 'health', 
        label: 'Health Insurance', 
        icon: '🏥', 
        aiClass: null,
        evidenceLabel: 'Medical Bill',
        endpoint: '/validate-health' 
    },
    { 
        id: 'life', 
        label: 'Life Insurance', 
        icon: '❤️', 
        aiClass: null,
        evidenceLabel: 'Death Certificate',
        endpoint: '/validate-life' 
    },
  ];

  // --- 1. HANDLE EVIDENCE UPLOAD ---
  const handleEvidenceSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setEvidenceFile(file);
      // Run Visual AI only if needed
      const selectedType = claimTypes.find(t => t.id === selectedClaimType);
      if (selectedType?.aiClass) {
          classifyImage(file);
      }
    }
  };

  // --- 2. HANDLE POLICY UPLOAD (REAL BACKEND INTEGRATION) ---
  const handlePolicySelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPolicyFile(file);
      setIsExtractingData(true);
      
      try {
        const selectedType = claimTypes.find(t => t.id === selectedClaimType);
        if (!selectedType) {
            alert("Please select a claim type first.");
            setIsExtractingData(false);
            return;
        }

        console.log(`📡 Uploading to: http://localhost:3000${selectedType.endpoint}`);

        const formData = new FormData();
        formData.append('image', file);
        formData.append('amount', '0'); // Default placeholder for the backend

        // 🚀 REAL API CALL
        const response = await fetch(`http://localhost:3000${selectedType.endpoint}`, {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();
        console.log("✅ OCR Result:", result);

        if (result.success && result.data) {
            setExtractedPolicyData(result.data);
            
            // Auto-Fill Form Logic
            let aiDesc = `Claim verified via OCR.\n`;
            if (result.data.policyNumber) aiDesc += `Policy #: ${result.data.policyNumber}\n`;
            if (result.data.extractedText) aiDesc += `\nSnippet: ${result.data.extractedText.substring(0, 100)}...`;
            
            setDescription(aiDesc);

            // Check for any of the possible amount fields
            const extractedAmount = result.data.sumInsuredVal || result.data.idvVal || result.data.sumAssuredVal;
            
            if (extractedAmount && extractedAmount > 0) {
                setClaimAmount(extractedAmount.toString());
            }

            // If backend found a policy number, try to set it
            if (result.data.policyNumber) {
                // In a real app, you might validate if this policy belongs to the user
                console.log("AI Found Policy:", result.data.policyNumber);
            }

        } else {
            alert("Backend could not extract data. Please ensure the image is clear.");
        }

      } catch (err) {
          console.error("❌ OCR Error:", err);
          alert("Could not connect to OCR Server. Is 'npm run server' running?");
      } finally {
          setIsExtractingData(false);
      }
    }
  };

  // --- FIXED VALIDATION HELPER ---
  const isEvidenceValid = () => {
    if (!prediction) return true;
    
    const selectedType = claimTypes.find(t => t.id === selectedClaimType);
    const expectedClass = selectedType?.aiClass;
    
    if (!expectedClass) return true;

    const cleanPred = prediction.toLowerCase().replace(/[-_ ]/g, '');
    const cleanExp = expectedClass.toLowerCase().replace(/[-_ ]/g, '');

    if (cleanPred.includes('nonvehicle') || cleanPred.includes('nonhome')) {
        return false;
    }
    
    return cleanPred.includes(cleanExp) || cleanExp.includes(cleanPred);
  };

  const handleNext = () => {
    if (currentStep === 'type') {
        if(!selectedClaimType) { alert("Select a claim type"); return; }
        if(!selectedPolicyId) { alert("Select a policy"); return; }
        setCurrentStep('evidence');
    } 
    else if (currentStep === 'evidence') {
        if (!evidenceFile || !policyFile) {
            alert('Please upload BOTH the Evidence Photo and the Policy Document.');
            return;
        }
        
        if (!isAnalyzing && prediction && !isEvidenceValid()) {
             const lbl = claimTypes.find(t => t.id === selectedClaimType)?.label;
             alert(`⚠️ Mismatch! You chose ${lbl}, but AI detected "${prediction}". Please upload a valid photo.`);
             return;
        }
        setCurrentStep('details');
    } 
    else if (currentStep === 'details') {
        if (!claimAmount) { alert('Enter amount'); return; }
        setCurrentStep('review');
    } 
    else if (currentStep === 'review') {
        submitClaimToBackend();
    }
  };

  const submitClaimToBackend = async () => {
    setIsSubmitting(true);
    
    try {
        const response = await fetch('http://localhost:3000/submit-claim', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userName: "Current User", // In a real app, get this from Auth Context
                claimType: selectedClaimType,
                policyId: selectedPolicyId,
                amount: claimAmount,
                incidentDate: incidentDate,
                description: description,
                validationStatus: isEvidenceValid() ? 'APPROVED' : 'MANUAL_REVIEW',
                aiPrediction: prediction,
                extractedData: extractedPolicyData
            })
        });

        const resultBackend = await response.json();
        console.log("✅ Submission Result:", resultBackend);

        const result: ValidationResponse = {
            success: true,
            validation: { status: 'APPROVED', issues: [] },
            data: { ai_tag: prediction, confidence: confidence }
        };
        
        setValidationResponse(result);
        // Use ID from backend if available, or fallback
        setClaimId(resultBackend.claim?.id || `#CLM-${Math.floor(Math.random() * 10000)}`);
        
        if (onClaimSubmitted) {
            onClaimSubmitted({
                claimId: resultBackend.claim?.id || "123", 
                validationResponse: result, 
                claimType: selectedClaimType, 
                amount: claimAmount
            });
        }
        setCurrentStep('submitted');
    } catch (error) {
        console.error("❌ Submission Failed:", error);
        alert("Failed to submit claim. Check console for details.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep === 'evidence') setCurrentStep('type');
    if (currentStep === 'details') setCurrentStep('evidence');
    if (currentStep === 'review') setCurrentStep('details');
  };

  const getStepNumber = () => {
    const steps: Record<ClaimStep, number> = { 'type': 1, 'evidence': 2, 'details': 3, 'review': 4, 'submitted': 5 };
    return steps[currentStep];
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl shadow-card-elevated max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/20">
          <div>
            <h2 className="text-xl font-bold text-foreground">File New Claim</h2>
            {currentStep !== 'submitted' && <p className="text-sm text-muted-foreground mt-1">Step {getStepNumber()} of 4</p>}
          </div>
          <button onClick={onClose}><X size={24} className="text-muted-foreground hover:text-foreground" /></button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* STEP 1: TYPE & POLICY SELECTION */}
          {currentStep === 'type' && (
            <div className="space-y-6">
                <div>
                    <h3 className="text-sm font-medium mb-3">1. Select Claim Type</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                    {claimTypes.map((type) => (
                        <button key={type.id} onClick={() => { setSelectedClaimType(type.id); setSelectedPolicyId(''); }} 
                        className={`p-4 rounded-xl border-2 text-left transition-all ${selectedClaimType === type.id ? 'border-primary bg-primary/5 shadow-md' : 'border-border bg-card hover:border-primary/50'}`}>
                        <div className="text-3xl mb-2">{type.icon}</div>
                        <h4 className="font-semibold text-foreground">{type.label}</h4>
                        </button>
                    ))}
                    </div>
                </div>

                {selectedClaimType && (
                    <div className="animate-in fade-in slide-in-from-bottom-2">
                        <h3 className="text-sm font-medium mb-2">2. Select Policy</h3>
                        <div className="relative">
                            <select 
                                value={selectedPolicyId}
                                onChange={(e) => setSelectedPolicyId(e.target.value)}
                                className="w-full appearance-none bg-input-background border border-input rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                            >
                                <option value="">-- Choose a Policy --</option>
                                {MOCK_POLICIES[selectedClaimType]?.map((policy) => (
                                    <option key={policy} value={policy}>{policy}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" size={18} />
                        </div>
                    </div>
                )}
            </div>
          )}

          {/* STEP 2: DUAL UPLOAD */}
          {currentStep === 'evidence' && (
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg flex gap-3 text-sm border border-blue-100 dark:border-blue-900/30">
                  <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-full h-fit"><ScanEye className="text-blue-600 dark:text-blue-400 w-4 h-4" /></div>
                  <div>
                      <p className="font-semibold text-blue-900 dark:text-blue-200">AI Verification Active</p>
                      <p className="text-blue-700 dark:text-blue-300">We analyze your evidence in real-time to speed up approval.</p>
                  </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Box A: Damage Photo (Visual AI) */}
                <div className={`p-6 rounded-xl border-2 border-dashed transition-all ${isEvidenceValid() ? 'border-border bg-muted/10' : 'border-red-300 bg-red-50 dark:bg-red-900/10'}`}>
                    <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                        <Upload size={16} /> 
                        {claimTypes.find(t => t.id === selectedClaimType)?.evidenceLabel}
                        {isAnalyzing && <Loader2 className="animate-spin h-3 w-3 ml-auto text-primary"/>}
                    </h3>
                    
                    <label className="cursor-pointer block">
                        <input type="file" accept="image/*" onChange={handleEvidenceSelect} className="hidden"/>
                        <div className="bg-background border border-border rounded-lg p-4 text-center hover:bg-muted transition-colors">
                            {evidenceFile ? <span className="text-primary font-medium">{evidenceFile.name}</span> : <span className="text-muted-foreground">Click to upload</span>}
                        </div>
                    </label>

                    {prediction && (
                        <div className={`mt-3 p-2 rounded text-xs font-medium flex items-center gap-2 ${isEvidenceValid() ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                            {isEvidenceValid() ? <CheckCircle size={14}/> : <AlertTriangle size={14}/>}
                            AI Detected: {prediction} ({(confidence * 100).toFixed(0)}%)
                        </div>
                    )}
                </div>

                {/* Box B: Policy Doc (Backend Extraction) */}
                <div className="p-6 rounded-xl border-2 border-dashed border-border bg-muted/10">
                    <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                        <FileText size={16} /> 
                        Policy Document
                        {isExtractingData && <Loader2 className="animate-spin h-3 w-3 ml-auto text-primary"/>}
                    </h3>
                    
                    <label className="cursor-pointer block">
                        <input type="file" accept="image/*,.pdf" onChange={handlePolicySelect} className="hidden"/>
                        <div className="bg-background border border-border rounded-lg p-4 text-center hover:bg-muted transition-colors">
                             {policyFile ? <span className="text-blue-600 font-medium">{policyFile.name}</span> : <span className="text-muted-foreground">Click to upload</span>}
                        </div>
                    </label>

                    {extractedPolicyData && (
                        <div className="mt-3 p-2 rounded text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 flex items-center gap-2">
                            <CheckCircle size={14}/>
                            Data Extracted Successfully
                        </div>
                    )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: DETAILS */}
          {currentStep === 'details' && (
            <div className="space-y-5">
               <div className="bg-muted p-4 rounded-xl mb-4">
                 <h4 className="font-semibold text-sm mb-2">Claim Summary</h4>
                 <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-muted-foreground">Type</p>
                        <p>{claimTypes.find(t => t.id === selectedClaimType)?.label}</p>
                    </div>
                    <div>
                        <p className="text-muted-foreground">Policy</p>
                        <p>{selectedPolicyId}</p>
                    </div>
                 </div>
               </div>

               <div>
                 <label className="block text-sm font-medium mb-2">Incident Date</label>
                 <input type="date" value={incidentDate} onChange={e => setIncidentDate(e.target.value)} className="w-full p-3 bg-input-background border border-input rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"/>
               </div>

               <div>
                 <label className="block text-sm font-medium mb-2">Description</label>
                 <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 bg-input-background border border-input rounded-xl focus:ring-2 focus:ring-primary/20 outline-none resize-none" placeholder="Describe what happened..."/>
               </div>

               <div>
                 <label className="block text-sm font-medium mb-2">Estimated Claim Amount (₹)</label>
                 <input type="number" value={claimAmount} onChange={e => setClaimAmount(e.target.value)} className="w-full p-3 bg-input-background border border-input rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" placeholder="0.00"/>
               </div>
            </div>
          )}

          {/* STEP 4: REVIEW */}
          {currentStep === 'review' && (
             <div className="space-y-4">
                <div className="p-6 bg-muted/30 rounded-xl border border-border text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} className="text-primary"/>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Ready to Submit?</h3>
                    <p className="text-muted-foreground">Please review your claim details before final submission.</p>
                </div>

                <div className="bg-card border border-border rounded-xl divide-y divide-border">
                    <div className="p-4 flex justify-between">
                        <span className="text-muted-foreground">Claim Type</span>
                        <span className="font-medium">{claimTypes.find(t => t.id === selectedClaimType)?.label}</span>
                    </div>
                    <div className="p-4 flex justify-between">
                        <span className="text-muted-foreground">Amount</span>
                        <span className="font-bold text-lg">₹{claimAmount}</span>
                    </div>
                    {prediction && (
                        <div className="p-4 flex justify-between bg-green-50 dark:bg-green-900/10">
                            <span className="text-green-700 dark:text-green-400 font-medium">AI Validation</span>
                            <span className="text-green-700 dark:text-green-400 font-bold">Passed ({prediction})</span>
                        </div>
                    )}
                </div>
             </div>
          )}

          {/* STEP 5: SUBMITTED */}
          {currentStep === 'submitted' && (
            <div className="text-center py-12">
               <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in spin-in-12 duration-500">
                   <CheckCircle size={40} className="text-green-600 dark:text-green-400"/>
               </div>
               <h3 className="text-2xl font-bold mb-2">Claim Submitted!</h3>
               <p className="text-muted-foreground mb-8">Your claim ID is <span className="font-mono text-foreground font-medium">{claimId}</span>.</p>
               <button onClick={onClose} className="bg-primary text-primary-foreground px-8 py-3 rounded-xl hover:opacity-90 transition-opacity">Return to Dashboard</button>
            </div>
          )}

        </div>

        {/* Footer */}
        {currentStep !== 'submitted' && (
          <div className="p-6 border-t border-border bg-background flex justify-between">
            <button onClick={handleBack} disabled={currentStep === 'type'} className="px-6 py-2.5 rounded-xl text-muted-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors">Back</button>
            <button 
                onClick={handleNext} 
                disabled={isAnalyzing || isExtractingData || (currentStep === 'type' && !selectedPolicyId)} 
                className="bg-primary text-primary-foreground px-8 py-2.5 rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
            >
                {(isAnalyzing || isExtractingData) ? <Loader2 className="animate-spin" size={18}/> : null}
                {currentStep === 'review' ? 'Submit Claim' : 'Next'}
                {currentStep !== 'review' && <ArrowRight size={18} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
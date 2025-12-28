import React, { useState } from 'react';
import { X, Upload, CheckCircle, ArrowRight, ArrowLeft, ScanEye, FileText, Loader2, AlertTriangle } from 'lucide-react';
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

export function ClaimInterface({ onClose, onClaimSubmitted }: ClaimInterfaceProps) {
  const [currentStep, setCurrentStep] = useState<ClaimStep>('type');
  const [selectedClaimType, setSelectedClaimType] = useState<string>('');
  
  // --- DUAL FILE STATE ---
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null); // Photo/Bill
  const [policyFile, setPolicyFile] = useState<File | null>(null);     // Policy Doc

  // Form State
  const [claimAmount, setClaimAmount] = useState<string>('');
  // DEFAULT TO TODAY'S DATE
  const [incidentDate, setIncidentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  
  // Processing State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationResponse, setValidationResponse] = useState<ValidationResponse | null>(null);
  const [claimId, setClaimId] = useState<string>('');
  
  // Backend Processing State
  const [isExtractingData, setIsExtractingData] = useState(false);
  const [extractedPolicyData, setExtractedPolicyData] = useState<any>(null);

  // AI Hook (Visual Check - Teachable Machine)
  const { classifyImage, prediction, confidence, isAnalyzing } = useImageClassifier();

  const claimTypes = [
    { 
        id: 'vehicle', 
        label: 'Auto Insurance', 
        icon: '🚗', 
        aiClass: 'Vehicle Damage', 
        evidenceLabel: 'Car Damage Photo',
        endpoint: '/validate-vehicle' 
    },
    { 
        id: 'home', 
        label: 'Home Insurance', 
        icon: '🏠', 
        aiClass: 'Home Damage', 
        evidenceLabel: 'Home Damage Photo',
        endpoint: '/validate-home' 
    },
    { 
        id: 'health', 
        label: 'Health Insurance', 
        icon: '🏥', 
        aiClass: 'Medical Docs', 
        evidenceLabel: 'Medical Bill',
        endpoint: '/validate-health' 
    },
    { 
        id: 'life', 
        label: 'Life Insurance', 
        icon: '❤️', 
        aiClass: 'Medical Docs', 
        evidenceLabel: 'Medical Bill',
        endpoint: '/validate-life' 
    },
  ];

  // --- 1. HANDLE EVIDENCE UPLOAD (VISUAL AI) ---
  const handleEvidenceSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setEvidenceFile(file);
      // Run Visual AI (Is this a car?)
      classifyImage(file);
    }
  };

  // --- 2. HANDLE POLICY UPLOAD (BACKEND OCR) ---
  const handlePolicySelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPolicyFile(file);
      setIsExtractingData(true);
      
      try {
        const selectedType = claimTypes.find(t => t.id === selectedClaimType);
        if (!selectedType) return;

        console.log(`Sending to backend: http://localhost:3000${selectedType.endpoint}`);

        const formData = new FormData();
        formData.append('image', file);
        formData.append('amount', '0'); // Placeholder

        // Call your SERVER.JS logic
        const response = await fetch(`http://localhost:3000${selectedType.endpoint}`, {
            method: 'POST',
            body: formData,
        });
        const result = await response.json();
        console.log("Backend Response:", result);
        
        if (result.success && result.data) {
            setExtractedPolicyData(result.data);
            
            // --- SMART AUTO-FILL LOGIC ---
            
            // 1. Description Construction
            let desc = `Claim verified by AI as: ${prediction || 'Pending'}.\n`;
            if (result.data.policyNumber) desc += `Policy #: ${result.data.policyNumber}\n`;
            if (result.data.vehicleNumber) desc += `Vehicle: ${result.data.vehicleNumber}\n`;
            if (result.data.extractedText) desc += `\nDoc Text: ${result.data.extractedText.substring(0, 100)}...`;
            
            setDescription(desc);

            // 2. Suggest Amount if found
            const foundAmount = result.data.sumInsuredVal || result.data.idvVal;
            if (foundAmount) {
                if(!claimAmount) setClaimAmount(foundAmount.toString());
            }
        }
      } catch (err) {
          console.error("OCR Error - Is Backend Running?", err);
          alert("Could not connect to backend. Make sure 'node server.js' is running!");
      } finally {
          setIsExtractingData(false);
      }
    }
  };

  // --- VALIDATION HELPER ---
  const isEvidenceValid = () => {
    if (!prediction) return true; // Fallback
    const selectedType = claimTypes.find(t => t.id === selectedClaimType);
    const expectedClass = selectedType?.aiClass;
    
    if (prediction === 'Invalid' || prediction === 'Random') return false;
    
    if (expectedClass) {
        const cleanPrediction = prediction.toLowerCase().trim();
        const cleanExpected = expectedClass.toLowerCase().trim();
        // Loose matching
        if (!cleanPrediction.includes(cleanExpected) && !cleanExpected.includes(cleanPrediction)) {
            return false;
        }
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 'type') {
        if(selectedClaimType) setCurrentStep('evidence');
    } 
    else if (currentStep === 'evidence') {
        if (!evidenceFile || !policyFile) {
            alert('Please upload BOTH the Evidence Photo and the Policy Document.');
            return;
        }
        // AI Guardrail
        if (!isAnalyzing && prediction && !isEvidenceValid()) {
             const lbl = claimTypes.find(t => t.id === selectedClaimType)?.label;
             alert(`⚠️ Mismatch! You chose ${lbl}, but AI detected "${prediction}". Upload a valid photo.`);
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
        await fetch('http://localhost:3000/submit-claim', {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
                 userName: "Demo User",
                 claimType: selectedClaimType,
                 amount: claimAmount,
                 validationStatus: prediction === 'Invalid' ? 'REJECTED' : 'pending',
                 extractedData: extractedPolicyData
             })
        });

      const result: ValidationResponse = {
        success: true,
        validation: { status: 'APPROVED', issues: [] }, // Mock success for demo
        data: { ai_tag: prediction, confidence: confidence }
      };
      
      setValidationResponse(result);
      setClaimId(`#CLM-${Math.floor(Math.random() * 10000)}`);
      
      if (onClaimSubmitted) {
        onClaimSubmitted({
          claimId: "123", validationResponse: result, claimType: selectedClaimType, amount: claimAmount
        });
      }
      setCurrentStep('submitted');
    } catch (error) {
      alert('Failed to submit.');
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
      <div className="bg-card border border-border rounded-2xl shadow-card-elevated max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-foreground">File New Claim</h2>
            {currentStep !== 'submitted' && <p className="text-sm text-muted-foreground mt-1">Step {getStepNumber()} of 4</p>}
          </div>
          <button onClick={onClose}><X size={24} className="text-muted-foreground" /></button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* STEP 1: TYPE SELECTION */}
          {currentStep === 'type' && (
            <div className="grid sm:grid-cols-2 gap-4">
              {claimTypes.map((type) => (
                <button key={type.id} onClick={() => setSelectedClaimType(type.id)} 
                  className={`p-6 rounded-xl border-2 text-left ${selectedClaimType === type.id ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}>
                  <div className="text-4xl mb-3">{type.icon}</div>
                  <h4 className="text-foreground">{type.label}</h4>
                </button>
              ))}
            </div>
          )}

          {/* STEP 2: DUAL UPLOAD (THE MAIN LOGIC) */}
          {currentStep === 'evidence' && (
            <div className="space-y-8">
              {/* Box A: Damage Photo (Visual AI) */}
              <div className="bg-muted/30 p-4 rounded-xl border border-dashed border-primary/30">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                   1. Upload {claimTypes.find(t => t.id === selectedClaimType)?.evidenceLabel}
                   {isAnalyzing && <Loader2 className="animate-spin h-4 w-4"/>}
                   {!isAnalyzing && prediction && (isEvidenceValid() ? <CheckCircle className="text-green-500 h-5 w-5"/> : <AlertTriangle className="text-red-500 h-5 w-5"/>)}
                </h3>
                <input type="file" accept="image/*" onChange={handleEvidenceSelect} className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"/>
                {prediction && (
                    <p className={`text-xs mt-2 ${isEvidenceValid() ? 'text-green-600' : 'text-red-600'}`}>
                        AI Detected: <b>{prediction}</b> ({(confidence * 100).toFixed(0)}%)
                    </p>
                )}
              </div>

              {/* Box B: Policy Doc (Backend Extraction) */}
              <div className="bg-muted/30 p-4 rounded-xl border border-dashed border-blue-500/30">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                    2. Upload Policy Document
                    {isExtractingData && <Loader2 className="animate-spin h-4 w-4"/>}
                    {extractedPolicyData && <CheckCircle className="text-green-500 h-5 w-5"/>}
                </h3>
                <input type="file" accept="image/*,.pdf" onChange={handlePolicySelect} className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"/>
                {extractedPolicyData && (
                    <div className="mt-2 text-xs text-blue-600 bg-blue-50 p-2 rounded">
                        Found Policy #: {extractedPolicyData.policyNumber || "Unknown"}
                    </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: DETAILS (AUTO-FILLED) */}
          {currentStep === 'details' && (
            <div className="space-y-4">
               <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex gap-3 text-sm">
                  <ScanEye className="text-blue-500 shrink-0" />
                  <div>
                    <p className="font-semibold">Auto-Filled by AI</p>
                    <p className="text-muted-foreground">We extracted details from your uploaded documents.</p>
                  </div>
               </div>

               <div>
                 <label className="block mb-2">Incident Date</label>
                 <input type="date" value={incidentDate} onChange={e => setIncidentDate(e.target.value)} className="w-full p-3 bg-input-background border rounded-lg"/>
               </div>

               <div>
                 <label className="block mb-2">Description</label>
                 <textarea rows={5} value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 bg-input-background border rounded-lg"/>
               </div>

               <div>
                 <label className="block mb-2">Claim Amount</label>
                 <input type="number" value={claimAmount} onChange={e => setClaimAmount(e.target.value)} className="w-full p-3 bg-input-background border rounded-lg" placeholder="0.00"/>
               </div>
            </div>
          )}

          {/* STEP 4: REVIEW */}
          {currentStep === 'review' && (
             <div className="space-y-4 text-sm">
                <div className="bg-muted p-4 rounded">Claim: {selectedClaimType}</div>
                <div className="bg-muted p-4 rounded">Amount: ${claimAmount}</div>
                <div className="bg-muted p-4 rounded">Status: Ready to Submit</div>
             </div>
          )}

          {/* STEP 5: SUBMITTED */}
          {currentStep === 'submitted' && (
            <div className="text-center py-8">
               <CheckCircle size={64} className="text-success mx-auto mb-4"/>
               <h3>Claim Submitted!</h3>
               <button onClick={onClose} className="mt-6 bg-primary text-white px-6 py-2 rounded">Close</button>
            </div>
          )}

        </div>

        {/* Footer */}
        {currentStep !== 'submitted' && (
          <div className="p-6 border-t flex justify-between">
            <button onClick={handleBack} disabled={currentStep === 'type'} className="px-6 py-2 rounded hover:bg-muted">Back</button>
            <button onClick={handleNext} disabled={isAnalyzing || isExtractingData} className="bg-primary text-white px-6 py-2 rounded">
                {(isAnalyzing || isExtractingData) ? 'Processing...' : 'Next'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
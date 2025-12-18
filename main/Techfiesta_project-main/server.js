import express from "express";
import multer from "multer";
import Tesseract from "tesseract.js";
import fs from "node:fs";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// =======================
// MIDDLEWARE
// =======================
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const upload = multer({ dest: "uploads/" });

// =======================
// UTILITY FUNCTIONS
// =======================
const parseSmartCurrency = (str) => {
  if (!str) return 0;

  let clean = str
    .replace(/[Oo]/g, "0")
    .replace(/[Ss]/g, "5")
    .replace(/[^0-9.,]/g, "");

  if ((clean.match(/\./g) || []).length > 1) {
    clean = clean.replace(/\./g, "");
  } else {
    clean = clean.replace(/,/g, "");
  }

  return parseInt(clean, 10) || 0;
};

const normalizeText = (text) =>
  text
    .replace(/\r/g, "\n")
    .replace(/\n+/g, "\n")
    .replace(/[ ]{2,}/g, " ")
    .toLowerCase();

const extractNear = (text, labels, valuePattern, window = 80) => {
  for (const label of labels) {
    const regex = new RegExp(
      `${label}.{0,${window}}?(${valuePattern})`,
      "i"
    );
    const match = text.match(regex);
    if (match) return match[1].trim();
  }
  return null;
};

// =======================
// HEALTH INSURANCE
// =======================
const parseHealthData = (text) => {
  const normalized = normalizeText(text);

  const sumInsured = parseSmartCurrency(
    extractNear(
      normalized,
      ["sum insured", "coverage", "insured amount"],
      "[0-9,. ]+"
    )
  );

  return {
    policyNumber: extractNear(
      normalized,
      ["policy no", "policy number", "policy id"],
      "[A-Z0-9/-]+"
    ),
    memberId: extractNear(
      normalized,
      ["member id", "member no", "id card"],
      "[A-Z0-9/-]+"
    ),
    validFrom: extractNear(
      normalized,
      ["valid from", "start date"],
      "[0-9/.-]+"
    ),
    validTo: extractNear(
      normalized,
      ["valid to", "expiry"],
      "[0-9/.-]+"
    ),
    sumInsuredVal: sumInsured,
    _fallbackApplied: false
  };
};

const validateHealthClaim = (data, claimAmount) => {
  let decision = { status: "APPROVED", issues: [] };

  if (!data.policyNumber && !data.memberId) {
    return {
      status: "REJECTED",
      issues: ["Policy Number or Member ID not detected"]
    };
  }

  if (data.validTo) {
    const parsed = Date.parse(data.validTo);
    if (!isNaN(parsed) && new Date() > new Date(parsed)) {
      return {
        status: "REJECTED",
        issues: [`Policy expired on ${data.validTo}`]
      };
    }
  } else {
    decision.status = "MANUAL_REVIEW";
    decision.issues.push("Policy expiry date not detected");
  }

  if (!data.sumInsuredVal) {
    decision.status = "MANUAL_REVIEW";
    decision.issues.push("Sum insured not detected");
  } else if (claimAmount > data.sumInsuredVal) {
    decision.status = "REJECTED";
    decision.issues.push("Claim exceeds sum insured");
  }

  return decision;
};

app.post("/validate-health", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  console.log("\n=== Health Insurance Validation ===");
  console.log("File received:", req.file.originalname);
  console.log("Claim amount:", req.body.amount);

  try {
    console.log("Starting OCR processing...");
    const {
      data: { text }
    } = await Tesseract.recognize(req.file.path, "eng", {
      logger: m => console.log(m)
    });

    console.log("\n--- Extracted Text ---");
    console.log(text);
    console.log("--- End Extracted Text ---\n");

    fs.unlinkSync(req.file.path);

    let data = parseHealthData(text);
    console.log("Parsed data:", JSON.stringify(data, null, 2));

    if (!data.sumInsuredVal) {
      data.sumInsuredVal = 500000;
      data._fallbackApplied = true;
      console.log("Applied fallback sum insured: 500000");
    }

    const claimAmount = Number(req.body.amount) || 0;
    const validation = validateHealthClaim(data, claimAmount);
    console.log("Validation result:", JSON.stringify(validation, null, 2));

    res.json({
      success: true,
      data: {
        ...data,
        extractedText: text.substring(0, 500),
        claimAmount: claimAmount
      },
      validation,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("OCR Error:", err);
    res.status(500).json({ error: "OCR failed", details: err.message });
  }
});

// =======================
// VEHICLE INSURANCE
// =======================
const parseVehicleData = (text) => {
  const normalized = normalizeText(text);
  const idv = parseSmartCurrency(
    extractNear(normalized, ["idv", "insured declared value", "vehicle value"], "[0-9,. ]+")
  );
  return {
    policyNumber: extractNear(normalized, ["policy no", "policy number"], "[A-Z0-9/-]+"),
    vehicleNumber: extractNear(normalized, ["vehicle no", "registration no", "reg no"], "[A-Z0-9- ]+"),
    validFrom: extractNear(normalized, ["valid from", "start date"], "[0-9/.-]+"),
    validTo: extractNear(normalized, ["valid to", "expiry"], "[0-9/.-]+"),
    idvVal: idv,
    _fallbackApplied: false
  };
};

const validateVehicleClaim = (data, claimAmount) => {
  let decision = { status: "APPROVED", issues: [] };
  if (!data.policyNumber) {
    return { status: "REJECTED", issues: ["Policy Number not detected"] };
  }
  if (data.validTo) {
    const parsed = Date.parse(data.validTo);
    if (!isNaN(parsed) && new Date() > new Date(parsed)) {
      return { status: "REJECTED", issues: [`Policy expired on ${data.validTo}`] };
    }
  } else {
    decision.status = "MANUAL_REVIEW";
    decision.issues.push("Policy expiry date not detected");
  }
  if (!data.idvVal) {
    decision.status = "MANUAL_REVIEW";
    decision.issues.push("IDV not detected");
  } else if (claimAmount > data.idvVal) {
    decision.status = "REJECTED";
    decision.issues.push("Claim exceeds IDV");
  }
  return decision;
};

app.post("/validate-vehicle", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image uploaded" });
  
  console.log("\n=== Vehicle Insurance Validation ===");
  console.log("File received:", req.file.originalname);
  
  try {
    const { data: { text } } = await Tesseract.recognize(req.file.path, "eng");
    console.log("Extracted text length:", text.length);
    fs.unlinkSync(req.file.path);
    
    let data = parseVehicleData(text);
    console.log("Parsed vehicle data:", JSON.stringify(data, null, 2));
    
    if (!data.idvVal) {
      data.idvVal = 300000;
      data._fallbackApplied = true;
    }
    const claimAmount = Number(req.body.amount) || 0;
    const validation = validateVehicleClaim(data, claimAmount);
    
    res.json({ 
      success: true, 
      data: { ...data, extractedText: text.substring(0, 500), claimAmount }, 
      validation,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("Vehicle OCR Error:", err);
    res.status(500).json({ error: "OCR failed", details: err.message });
  }
});

// =======================
// LIFE INSURANCE
// =======================
const parseLifeData = (text) => {
  const normalized = normalizeText(text);
  const sumAssured = parseSmartCurrency(
    extractNear(normalized, ["sum assured", "coverage", "death benefit"], "[0-9,. ]+")
  );
  return {
    policyNumber: extractNear(normalized, ["policy no", "policy number"], "[A-Z0-9/-]+"),
    insuredName: extractNear(normalized, ["insured name", "policyholder", "name"], "[A-Za-z ]+"),
    validFrom: extractNear(normalized, ["valid from", "start date"], "[0-9/.-]+"),
    validTo: extractNear(normalized, ["valid to", "maturity", "expiry"], "[0-9/.-]+"),
    sumAssuredVal: sumAssured,
    _fallbackApplied: false
  };
};

const validateLifeClaim = (data, claimAmount) => {
  let decision = { status: "APPROVED", issues: [] };
  if (!data.policyNumber) {
    return { status: "REJECTED", issues: ["Policy Number not detected"] };
  }
  if (data.validTo) {
    const parsed = Date.parse(data.validTo);
    if (!isNaN(parsed) && new Date() > new Date(parsed)) {
      return { status: "REJECTED", issues: [`Policy expired on ${data.validTo}`] };
    }
  } else {
    decision.status = "MANUAL_REVIEW";
    decision.issues.push("Policy expiry date not detected");
  }
  if (!data.sumAssuredVal) {
    decision.status = "MANUAL_REVIEW";
    decision.issues.push("Sum assured not detected");
  } else if (claimAmount > data.sumAssuredVal) {
    decision.status = "REJECTED";
    decision.issues.push("Claim exceeds sum assured");
  }
  return decision;
};

app.post("/validate-life", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image uploaded" });
  
  console.log("\n=== Life Insurance Validation ===");
  console.log("File received:", req.file.originalname);
  
  try {
    const { data: { text } } = await Tesseract.recognize(req.file.path, "eng");
    console.log("Extracted text length:", text.length);
    fs.unlinkSync(req.file.path);
    
    let data = parseLifeData(text);
    console.log("Parsed life data:", JSON.stringify(data, null, 2));
    
    if (!data.sumAssuredVal) {
      data.sumAssuredVal = 1000000;
      data._fallbackApplied = true;
    }
    const claimAmount = Number(req.body.amount) || 0;
    const validation = validateLifeClaim(data, claimAmount);
    
    res.json({ 
      success: true, 
      data: { ...data, extractedText: text.substring(0, 500), claimAmount }, 
      validation,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("Life OCR Error:", err);
    res.status(500).json({ error: "OCR failed", details: err.message });
  }
});

// =======================
// HOME INSURANCE
// =======================
const parseHomeData = (text) => {
  const normalized = normalizeText(text);
  const sumInsured = parseSmartCurrency(
    extractNear(normalized, ["sum insured", "coverage", "property value"], "[0-9,. ]+")
  );
  return {
    policyNumber: extractNear(normalized, ["policy no", "policy number"], "[A-Z0-9/-]+"),
    propertyAddress: extractNear(normalized, ["address", "property", "location"], "[A-Za-z0-9, ]+"),
    validFrom: extractNear(normalized, ["valid from", "start date"], "[0-9/.-]+"),
    validTo: extractNear(normalized, ["valid to", "expiry"], "[0-9/.-]+"),
    sumInsuredVal: sumInsured,
    _fallbackApplied: false
  };
};

const validateHomeClaim = (data, claimAmount) => {
  let decision = { status: "APPROVED", issues: [] };
  if (!data.policyNumber) {
    return { status: "REJECTED", issues: ["Policy Number not detected"] };
  }
  if (data.validTo) {
    const parsed = Date.parse(data.validTo);
    if (!isNaN(parsed) && new Date() > new Date(parsed)) {
      return { status: "REJECTED", issues: [`Policy expired on ${data.validTo}`] };
    }
  } else {
    decision.status = "MANUAL_REVIEW";
    decision.issues.push("Policy expiry date not detected");
  }
  if (!data.sumInsuredVal) {
    decision.status = "MANUAL_REVIEW";
    decision.issues.push("Sum insured not detected");
  } else if (claimAmount > data.sumInsuredVal) {
    decision.status = "REJECTED";
    decision.issues.push("Claim exceeds sum insured");
  }
  return decision;
};

app.post("/validate-home", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image uploaded" });
  
  console.log("\n=== Home Insurance Validation ===");
  console.log("File received:", req.file.originalname);
  
  try {
    const { data: { text } } = await Tesseract.recognize(req.file.path, "eng");
    console.log("Extracted text length:", text.length);
    fs.unlinkSync(req.file.path);
    
    let data = parseHomeData(text);
    console.log("Parsed home data:", JSON.stringify(data, null, 2));
    
    if (!data.sumInsuredVal) {
      data.sumInsuredVal = 2000000;
      data._fallbackApplied = true;
    }
    const claimAmount = Number(req.body.amount) || 0;
    const validation = validateHomeClaim(data, claimAmount);
    
    res.json({ 
      success: true, 
      data: { ...data, extractedText: text.substring(0, 500), claimAmount }, 
      validation,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("Home OCR Error:", err);
    res.status(500).json({ error: "OCR failed", details: err.message });
  }
});

// =======================
// AI/ML RISK ANALYSIS
// =======================
app.post("/analyze-risk", express.json(), (req, res) => {
  const { claimHistory, claimAmount, claimType, userProfile } = req.body;
  
  let riskScore = 0;
  let riskFactors = [];
  
  // Frequency analysis
  if (claimHistory && claimHistory.length > 3) {
    riskScore += 30;
    riskFactors.push("High claim frequency detected");
  }
  
  // Amount analysis
  if (claimAmount > 500000) {
    riskScore += 25;
    riskFactors.push("High claim amount");
  }
  
  // Pattern analysis
  if (claimHistory && claimHistory.length > 0) {
    const recentClaims = claimHistory.filter(c => {
      const claimDate = new Date(c.date);
      const monthsAgo = (new Date() - claimDate) / (1000 * 60 * 60 * 24 * 30);
      return monthsAgo < 6;
    });
    if (recentClaims.length > 2) {
      riskScore += 20;
      riskFactors.push("Multiple claims in short period");
    }
  }
  
  // Determine risk level
  let riskLevel = "LOW";
  let recommendation = "Claim appears normal";
  
  if (riskScore >= 50) {
    riskLevel = "HIGH";
    recommendation = "Recommend detailed investigation";
  } else if (riskScore >= 25) {
    riskLevel = "MEDIUM";
    recommendation = "Recommend additional verification";
  }
  
  res.json({
    success: true,
    riskAnalysis: {
      riskLevel,
      riskScore,
      riskFactors,
      recommendation
    }
  });
});

// =======================
// INSURANCE APPLICATION MANAGEMENT
// =======================
let applications = [];
let applicationIdCounter = 1;

// =======================
// CLAIMS STORAGE
// =======================
let claims = [];
let claimIdCounter = 1;

app.post("/submit-application", express.json(), (req, res) => {
  try {
    const applicationData = req.body;
    
    const newApplication = {
      id: `APP-2024-${String(applicationIdCounter++).padStart(4, '0')}`,
      ...applicationData,
      status: 'pending',
      submittedDate: new Date().toISOString(),
      reviewedDate: null,
      rejectionReason: null,
      requiredInformation: []
    };
    
    applications.push(newApplication);
    
    console.log(`\n=== New Application Submitted ===`);
    console.log(`Application ID: ${newApplication.id}`);
    console.log(`Applicant: ${newApplication.fullName}`);
    console.log(`Insurance Type: ${newApplication.insuranceType}`);
    
    res.json({
      success: true,
      application: newApplication,
      message: "Application submitted successfully"
    });
  } catch (err) {
    console.error("Application submission error:", err);
    res.status(500).json({ error: "Failed to submit application", details: err.message });
  }
});

app.get("/applications", (req, res) => {
  const { email, status } = req.query;
  
  let filteredApps = [...applications];
  
  if (email) {
    filteredApps = filteredApps.filter(app => app.email === email);
  }
  
  if (status) {
    filteredApps = filteredApps.filter(app => app.status === status);
  }
  
  res.json({
    success: true,
    applications: filteredApps,
    count: filteredApps.length
  });
});

app.get("/applications/:id", (req, res) => {
  const application = applications.find(app => app.id === req.params.id);
  
  if (!application) {
    return res.status(404).json({ error: "Application not found" });
  }
  
  res.json({
    success: true,
    application
  });
});

app.post("/applications/:id/approve", (req, res) => {
  const application = applications.find(app => app.id === req.params.id);
  
  if (!application) {
    return res.status(404).json({ success: false, error: "Application not found" });
  }
  
  if (application.status !== 'pending') {
    return res.status(400).json({ success: false, error: "Application has already been reviewed" });
  }
  
  application.status = 'approved';
  application.reviewedDate = new Date().toISOString();
  
  console.log(`\n=== Application Approved ===`);
  console.log(`Application ID: ${application.id}`);
  console.log(`Applicant: ${application.fullName}`);
  
  res.json({
    success: true,
    application,
    message: "Application approved successfully"
  });
});

app.post("/applications/:id/reject", (req, res) => {
  const { reason, requiredInformation } = req.body;
  const application = applications.find(app => app.id === req.params.id);
  
  if (!application) {
    return res.status(404).json({ success: false, error: "Application not found" });
  }
  
  if (application.status !== 'pending') {
    return res.status(400).json({ success: false, error: "Application has already been reviewed" });
  }
  
  if (!reason) {
    return res.status(400).json({ success: false, error: "Rejection reason is required" });
  }
  
  application.status = 'rejected';
  application.reviewedDate = new Date().toISOString();
  application.rejectionReason = reason;
  application.requiredInformation = requiredInformation || [];
  
  console.log(`\n=== Application Rejected ===`);
  console.log(`Application ID: ${application.id}`);
  console.log(`Applicant: ${application.fullName}`);
  console.log(`Reason: ${reason}`);
  
  res.json({
    success: true,
    application,
    message: "Application rejected"
  });
});

// =======================
// CLAIMS MANAGEMENT
// =======================
app.post("/submit-claim", express.json(), (req, res) => {
  try {
    const claimData = req.body;
    
    const newClaim = {
      id: `CLM-2024-${String(claimIdCounter++).padStart(4, '0')}`,
      ...claimData,
      status: claimData.validationStatus || 'pending',
      submittedDate: new Date().toISOString(),
      reviewedDate: null,
      adminNotes: null
    };
    
    claims.push(newClaim);
    
    console.log(`\n=== New Claim Submitted ===`);
    console.log(`Claim ID: ${newClaim.id}`);
    console.log(`User: ${newClaim.userName || 'Unknown'}`);
    console.log(`Type: ${newClaim.claimType}`);
    
    res.json({
      success: true,
      claim: newClaim,
      message: "Claim submitted successfully"
    });
  } catch (err) {
    console.error("Claim submission error:", err);
    res.status(500).json({ error: "Failed to submit claim", details: err.message });
  }
});

app.get("/claims", (req, res) => {
  const { userName, status } = req.query;
  
  let filteredClaims = [...claims];
  
  if (userName) {
    filteredClaims = filteredClaims.filter(claim => claim.userName === userName);
  }
  
  if (status) {
    filteredClaims = filteredClaims.filter(claim => claim.status === status);
  }
  
  res.json({
    success: true,
    claims: filteredClaims,
    count: filteredClaims.length
  });
});

app.get("/claims/:id", (req, res) => {
  const claim = claims.find(c => c.id === req.params.id);
  
  if (!claim) {
    return res.status(404).json({ error: "Claim not found" });
  }
  
  res.json({
    success: true,
    claim
  });
});

app.post("/claims/:id/update-status", express.json(), (req, res) => {
  const { status, adminNotes } = req.body;
  const claim = claims.find(c => c.id === req.params.id);
  
  if (!claim) {
    return res.status(404).json({ error: "Claim not found" });
  }
  
  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }
  
  claim.status = status;
  claim.reviewedDate = new Date().toISOString();
  claim.adminNotes = adminNotes || claim.adminNotes;
  
  console.log(`\n=== Claim Status Updated ===`);
  console.log(`Claim ID: ${claim.id}`);
  console.log(`New Status: ${status}`);
  
  res.json({
    success: true,
    claim,
    message: "Claim status updated successfully"
  });
});

// =======================
// ROOT
// =======================
app.get("/", (req, res) => {
  res.json({
    message: "Insurance Claim Validation API",
    endpoints: [
      "POST /validate-health",
      "POST /validate-vehicle",
      "POST /validate-life",
      "POST /validate-home",
      "POST /analyze-risk",
      "POST /submit-application",
      "GET /applications",
      "GET /applications/:id",
      "POST /applications/:id/approve",
      "POST /applications/:id/reject",
      "POST /submit-claim",
      "GET /claims",
      "GET /claims/:id",
      "POST /claims/:id/update-status"
    ]
  });
});

// =======================
// START SERVER
// =======================
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});

const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const fs = require('fs');

const app = express();
const port = 3000;
const upload = multer({ dest: 'uploads/' });

app.use(express.json());

// ==========================================
// 1. DATA CLEANING UTILS
// ==========================================
const cleanAmount = (amountString) => {
    if (!amountString) return 0;
    // Remove commas, spaces, and non-numeric characters (except decimal point)
    // Example: "Rs. 5,00,000.00" -> 500000.00
    const cleanStr = amountString.replace(/[^0-9.]/g, '');
    return parseFloat(cleanStr) || 0;
};

// ==========================================
// 2. PARSING LOGIC (Regex)
// ==========================================
const parseDocumentData = (text) => {
    let extracted = {};

    const extractPattern = (pattern) => {
        const match = text.match(pattern);
        if (match && match[1]) {
            return match[1].replace(/^[.:\-\s]+/, '').trim();
        }
        return null;
    };

    // --- POLICY DETAILS ---
    extracted.policyNumber = extractPattern(/(?:Policy|Certificate)\s*No[\s\.\-\:]*([A-Za-z0-9\/\-]+)/i);
    extracted.validTo = extractPattern(/(?:Valid To|Period To|Expiry Date|Midnight of)[\s\.\-\:]*([\d\/\.\-]+)/i);

    // --- FINANCIALS (CRITICAL FOR VALIDATION) ---
    // 1. Look for "Sum Insured" (Health)
    let rawSum = extractPattern(/(?:Sum\s*Insured|Coverage\s*Limit)[\s\.\-\:]*([0-9,]+)/i);
    
    // 2. If not found, look for "IDV" (Vehicle)
    if (!rawSum) {
        rawSum = extractPattern(/(?:IDV|Insured\s*Declared\s*Value)[\s\.\-\:]*([0-9,]+)/i);
    }

    // 3. Store both raw string and cleaned number
    extracted.rawLimit = rawSum; 
    extracted.limitValue = cleanAmount(rawSum);

    // --- VEHICLE / ID ---
    extracted.vehicleRegNo = extractPattern(/(?:Vehicle|Registration|Reg|vena)\s*No[\s\.\-\:]*([A-Za-z0-9]+)/i);

    return extracted;
};

// ==========================================
// 3. PURE IMAGE-BASED VALIDATION
// ==========================================
const validateFromImage = (extractedData, claimAmount) => {
    let result = {
        status: "PENDING",
        reasons: []
    };

    console.log(`Validating Claim: Requested ${claimAmount} vs Limit ${extractedData.limitValue}`);

    // RULE 1: Did we find a limit in the image?
    if (extractedData.limitValue === 0) {
        result.status = "MANUAL REVIEW REQUIRED";
        result.reasons.push("Could not read 'Sum Insured' or 'IDV' from the image.");
        return result; 
    }

    // RULE 2: Coverage Check (The Math)
    if (claimAmount > extractedData.limitValue) {
        result.status = "REJECTED";
        result.reasons.push(`Claim (${claimAmount}) exceeds Policy Limit extracted from image (${extractedData.limitValue}).`);
    }

    // RULE 3: Expiry Check (If date was found)
    if (extractedData.validTo) {
        // Attempt to parse date (assuming DD/MM/YYYY or YYYY-MM-DD)
        // Note: Date parsing is tricky with OCR; this is a basic attempt
        try {
            // normalizing separators to /
            const dateParts = extractedData.validTo.replace(/[-.]/g, '/').split('/'); 
            
            // Construct Date Object (assuming DD/MM/YYYY which is common in India)
            // If year is the first part (2025/...), handle accordingly
            let expiryDate;
            if (dateParts[0].length === 4) {
                 expiryDate = new Date(extractedData.validTo);
            } else {
                 expiryDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
            }

            if (new Date() > expiryDate) {
                result.status = "REJECTED";
                result.reasons.push(`Policy appears expired (Date on image: ${extractedData.validTo}).`);
            }
        } catch (e) {
            console.log("Date parsing failed, skipping expiry check.");
        }
    }

    // FINAL DECISION
    if (result.status === "PENDING") {
        result.status = "APPROVED";
        result.reasons.push("Claim is within the limit found on the document.");
    }

    return result;
};

// ==========================================
// 4. API ROUTE
// ==========================================
app.post('/validate-claim', upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
    const filePath = req.file.path;

    try {
        console.log(`Processing: ${req.file.originalname}`);
        
        // 1. OCR Extraction
        const { data: { text } } = await Tesseract.recognize(filePath, 'eng');
        fs.unlinkSync(filePath);

        // 2. Parse Data from Text
        const extractedData = parseDocumentData(text);

        // 3. Get User's Claim Request (e.g., from a form field)
        const claimAmount = parseFloat(req.body.amount) || 0;

        // 4. Validate Logic (Image Data vs User Request)
        const validationResult = validateFromImage(extractedData, claimAmount);

        res.json({ 
            success: true,
            extracted_data: extractedData,
            validation_result: validationResult
        });

    } catch (error) {
        console.error(error);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        res.status(500).json({ error: 'Processing failed' });
    }
});

app.listen(port, () => {
    console.log(`Image-First Validation Server running on http://localhost:${port}`);
});
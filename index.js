const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const fs = require('fs');

const app = express();
const port = 3000;
const upload = multer({ dest: 'uploads/' });

app.use(express.json());

// --- UNIVERSAL PARSER (Health & Vehicle) ---
const parseDocumentData = (text) => {
    let extracted = {};

    // Helper: Clean the OCR result (remove dots, special chars from start/end)
    const extractPattern = (pattern) => {
        const match = text.match(pattern);
        if (match && match[1]) {
            // Remove dots, colons, hyphens from the start of the captured text
            return match[1].replace(/^[.:\-\s]+/, '').trim();
        }
        return null;
    };

    // ==========================================
    // 1. COMMON FIELDS (Used in both types)
    // ==========================================
    
    // Policy Number (Matches "Policy No", "Certificate No", etc.)
    // Regex allows alphanumeric, dashes, and slashes (common in policy IDs)
    extracted.policyNumber = extractPattern(/(?:Policy|Certificate)\s*No[\s\.\-\:]*([A-Za-z0-9\/\-]+)/i);

    // Name (Insured / Proposer / Owner)
    extracted.name = extractPattern(/(?:Name of Insured|Proposer Name|Owner Name|Name)[\s\.\-\:]*([A-Za-z\s\.]+)/i);

    // Dates (Valid From / To)
    extracted.validFrom = extractPattern(/(?:Valid From|Period From|Commencing Date)[\s\.\-\:]*([\d\/\.\-]+)/i);
    extracted.validTo = extractPattern(/(?:Valid To|Period To|Expiry Date|Midnight of)[\s\.\-\:]*([\d\/\.\-]+)/i);

    // ==========================================
    // 2. VEHICLE SPECIFIC FIELDS
    // ==========================================
    
    // Registration Number (Matches "Vehicle No", "Reg No", or typo "vena No")
    extracted.vehicleRegNo = extractPattern(/(?:Vehicle|Registration|Reg|vena)\s*No[\s\.\-\:]*([A-Za-z0-9]+)/i);

    // Chassis Number
    extracted.chassisNo = extractPattern(/Chassis\s*No[\s\.\-\:]*([A-Za-z0-9]+)/i);

    // Engine Number
    extracted.engineNo = extractPattern(/Engine\s*No[\s\.\-\:]*([A-Za-z0-9]+)/i);

    // Make / Model
    extracted.makeModel = extractPattern(/(?:Make|Model)[\s\.\-\:]*([A-Za-z0-9\s]+)/i);

    // ==========================================
    // 3. HEALTH / FINANCIAL SPECIFIC FIELDS
    // ==========================================

    // Sum Insured / IDV (Insured Declared Value)
    extracted.sumInsured = extractPattern(/(?:Sum\s*Insured|IDV|Total Value)[\s\.\-\:]*([0-9,]+)/i);

    // Member ID (Specific to Health Cards)
    extracted.memberId = extractPattern(/(?:Member\s*ID|TPA\s*ID|Card\s*No)[\s\.\-\:]*([A-Za-z0-9]+)/i);

    return extracted;
};

// --- API ROUTE ---
app.post('/extract-text', upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
    const filePath = req.file.path;

    try {
        console.log(`Processing: ${req.file.originalname}`);
        console.log('--- OCR START ---');
        
        const { data: { text } } = await Tesseract.recognize(filePath, 'eng');
        
        // Clean up uploaded file
        fs.unlinkSync(filePath);

        // Run the universal parser
        const data = parseDocumentData(text);

        // Determine Document Type based on what we found
        let docType = "Unknown";
        if (data.vehicleRegNo || data.chassisNo) docType = "Vehicle/RTO";
        else if (data.memberId || (data.sumInsured && !data.vehicleRegNo)) docType = "Health/General Insurance";

        res.json({ 
            success: true,
            detectedType: docType,
            data: data,
            // debug_text: text // Uncomment if you need to see raw text again
        });

    } catch (error) {
        console.error(error);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        res.status(500).json({ error: 'OCR processing failed' });
    }
});

app.listen(port, () => {
    console.log(`Universal OCR Server running on http://localhost:${port}`);
});
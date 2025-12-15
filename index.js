const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const fs = require('fs');
const sharp = require('sharp'); // New library
const tf = require('@tensorflow/tfjs');
const cocoSsd = require('@tensorflow-models/coco-ssd');

const app = express();
const port = 3000;
const upload = multer({ dest: 'uploads/' });

app.use(express.json());

let objectModel;

// Load Model
(async () => {
    console.log('Loading Model...');
    await tf.setBackend('cpu');
    objectModel = await cocoSsd.load();
    console.log('Model Loaded!');
})();

// Helper: Decode ANY image using Sharp
const decodeImage = async (filePath) => {
    // Sharp converts WebP/PNG/JPG -> Raw Pixel Buffer
    const buffer = await sharp(filePath)
        .raw() // Get raw pixel data
        .toBuffer({ resolveWithObject: true });

    const { data, info } = buffer;

    // Create Tensor from raw data
    return tf.browser.fromPixels({
        data: new Uint8Array(data),
        width: info.width,
        height: info.height
    }, 3); // 3 channels (RGB)
};

app.post('/extract-text', upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
    const filePath = req.file.path;

    try {
        console.log('--- OCR START ---');
        // Tesseract handles most formats natively, no change needed
        const { data: { text } } = await Tesseract.recognize(filePath, 'eng');
        fs.unlinkSync(filePath);
        res.json({ success: true, type: 'text', data: text.trim() });
    } catch (error) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        res.status(500).json({ error: 'OCR failed' });
    }
});

app.post('/detect-objects', upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
    if (!objectModel) return res.status(503).json({ error: 'Model loading...' });

    const filePath = req.file.path;

    try {
        console.log('--- DETECTING OBJECTS ---');

        // 1. Decode ANY image format
        const imageTensor = await decodeImage(filePath);

        // 2. Run detection
        const predictions = await objectModel.detect(imageTensor);

        // 3. Cleanup
        imageTensor.dispose();
        fs.unlinkSync(filePath);

        // 4. Send results
        const detectedObjects = predictions.map(p => ({
            object: p.class,
            confidence: (p.score * 100).toFixed(2) + '%'
        }));

        console.log('Found:', detectedObjects);
        res.json({ success: true, type: 'objects', data: detectedObjects });

    } catch (error) {
        console.error('Detection Error:', error);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        res.status(500).json({ error: 'Detection failed' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
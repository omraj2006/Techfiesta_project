import express from "express";
import multer from "multer";
import path from "path";
import Tesseract from "tesseract.js";

const app = express();
app.use(express.json()); // for JSON payloads
app.use(express.urlencoded({ extended: true })); // for form data
const port = 3000;

// ----------------------
// STORAGE SETTINGS
// ----------------------

//by sudhan 16/12/25
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads/")); // absolute path
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});


const upload = multer({ storage: storage });

// ----------------------
// ROUTES
// ----------------------
app.get("/",(req,res)=>{
    res.render("index.ejs");
});
// Single image upload

//updated by sudhan on 16/12/25  12.52 am 
app.post("/uploadImage", upload.single("image"), async (req, res) => {
  try {
    // Get the uploaded file path
    const imagePath = req.file.path;

    // Run OCR using Tesseract.js
    const result = await Tesseract.recognize(
      imagePath,
      "eng"
    );

    // Send OCR text back in response
    res.send({
      message: "Image uploaded and OCR successful",
      extractedText: result.data.text,
      file: req.file
    });

  } catch (error) {
    res.status(500).send({
      message: "OCR failed",
      error: error.message
    });
  }
});


// Multiple images upload
app.post("/uploadImages", upload.array("images", 5), (req, res) => {
  res.send({
    message: "Multiple images uploaded successfully!",
    files: req.files
  });
});

// Any file upload (PDF, docs, etc.)
app.post("/uploadFiles", upload.array("files"), (req, res) => {
  res.send({
    message: "Files uploaded successfully!",
    files: req.files
  });
});

// ----------------------
// START SERVER
// ----------------------
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

import express from "express";
import multer from "multer";
import path from "path";

const app = express();
const port = 3000;

// ----------------------
// STORAGE SETTINGS
// ----------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // saves files to /uploads folder
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
app.post("/uploadImage", upload.single("image"), (req, res) => {
  res.send({
    message: "Image uploaded successfully!",
    file: req.file
  });
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

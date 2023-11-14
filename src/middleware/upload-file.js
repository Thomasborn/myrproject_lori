const multer = require('multer');
const path = require('path');

// Define the destination for uploaded images and PDFs
const publicDirectory = path.join(__dirname, '../public');

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(publicDirectory, 'images/model-produk'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const pdfStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(publicDirectory, 'pdfs'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const imageUpload = multer({
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit for images
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format for images.'));
    }
  },
}).array('foto', 5); // Allowing up to 5 image uploads
// const imageUpload = multer({
//   storage: imageStorage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit for images
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Invalid file format for images.'));
//     }
//   },
// }).single('foto'); // Allowing up to 5 image uploads

const pdfUpload = multer({
  storage: pdfStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit for PDFs
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format for PDFs.'));
    }
  },
}).single('pdf'); // Single PDF upload

module.exports = {
  imageUpload,
  pdfUpload,
};

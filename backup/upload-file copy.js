const multer = require('multer');
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(publicDirectory, 'images'));
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
  }).array('images', 5); // Allowing up to 5 image uploads
  
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
  
// Set up storage for uploaded files
const storage = multer.diskStorage({
   
  destination: (req, file, cb) => {
    const url =req.url;
    if(url.test("model-produk"))
    cb(null, 'uploads/produk');

    else if(url.test("bahan"))
    cb(null, 'uploads/bahan');

  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Create the multer instance
const upload = multer({ imageUpload,pdfStorage,storage});

module.exports = upload;
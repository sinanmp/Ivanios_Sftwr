import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './database/connectDb.js';
import adminRouter from './router/adminRouter.js';
import { uploadMiddleware } from './services/cloudinaryUpload.js';

dotenv.config();

const app = express();

// CORS Configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://192.168.137.1:5173',
    'https://ivaniosportal.vercel.app',
    'https://admin.ivaniosedutech.com',
  ],
  credentials: true
}));

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Hello from backend' });
});

app.use('/api', adminRouter);

// Upload route
app.post('/api/upload', uploadMiddleware.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        details: 'Please select a file to upload.',
      });
    }

    // File successfully uploaded to Cloudinary via multer-storage-cloudinary
    res.status(200).json({
      url: req.file.path,      // secure_url from Cloudinary
      public_id: req.file.filename, // public_id from Cloudinary
    });
  } catch (error) {
    console.error('Upload error:', error);

    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        details: 'Maximum file size is 10MB.',
      });
    }

    if (error.message.includes('Invalid file type')) {
      return res.status(400).json({
        error: 'Invalid file type',
        details: 'Only images, PDFs, and Word documents are allowed.',
      });
    }

    res.status(500).json({
      error: 'Failed to upload file',
      details: error.message,
    });
  }
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running locally on port ${PORT}`);
  });
}

// Export app for Vercel
export default app;

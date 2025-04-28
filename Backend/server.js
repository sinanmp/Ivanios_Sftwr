import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './database/connectDb.js';
import adminRouter from './router/adminRouter.js';

dotenv.config();

const app = express();

// CORS Configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://192.168.137.1:5173',
    'https://ivaniosportal.vercel.app'
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

// --- IMPORTANT ---
// Local server only when not in production (for local dev)
// Vercel will IGNORE app.listen and use "export default app"
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running locally on port ${PORT}`);
  });
}

// Export app for Vercel
export default app;

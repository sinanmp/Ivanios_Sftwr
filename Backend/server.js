import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';  // Import CORS
import connectDB from './database/connectDb.js';
import adminRouter from './router/adminRouter.js';

dotenv.config();  

// Initialize express app
const app = express();

// Enable CORS with specific settings
app.use(cors({
  origin: 'http://localhost:5173',  // Allow frontend origin
  credentials: true, // Allow cookies and authentication headers
}));

// Connect to MongoDB
connectDB();

app.use(express.json());  
app.use(express.urlencoded({ extended: false })); 

// Routes
app.use('/api', adminRouter);  

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

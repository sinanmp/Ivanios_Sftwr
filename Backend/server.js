import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database/connectDb.js';

dotenv.config();  

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

app.use(express.json());  // Parse JSON bodies (similar to bodyParser.json())
app.use(express.urlencoded({ extended: false })); 

// Routes
// app.use('/api/users', userRoutes);  // API routes for user management

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

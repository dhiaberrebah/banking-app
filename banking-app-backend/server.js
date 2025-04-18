import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import supportRoutes from './routes/supportRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
// import userRoutes from './routes/users.js';
// import accountRoutes from './routes/accounts.js';
// import transactionRoutes from './routes/transactions.js';
// import billPaymentRoutes from './routes/billPayments.js';
// import notificationRoutes from './routes/notifications.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Configure CORS
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true // Allow cookies to be sent
}));

// Parse cookies
app.use(cookieParser());

// Parse JSON bodies
app.use(express.json());

// database connection
// Connect to MongoDB with better error handling
mongoose.set('strictQuery', false);

console.log('Attempting to connect to MongoDB...');
// Add this before mongoose.connect
const connectionString = process.env.MONGODB_URI;
console.log('Connection string (without password):', 
  connectionString.replace(/\/\/[^:]+:([^@]+)@/, '//[username]:[hidden]@'));
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch(err => {
    console.error('MongoDB connection error details:', err.message);
    
    // If using Atlas, suggest checking credentials
    if (process.env.MONGODB_URI.includes('mongodb+srv')) {
      console.error('Please check your Atlas username and password');
      console.error('Try resetting your password in the Atlas dashboard');
    }
  });
//


//api routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/admin', adminRoutes); // Add admin routes
// app.use('/api/users', userRoutes);
// app.use('/api/accounts', accountRoutes);
// app.use('/api/transactions', transactionRoutes);
// app.use('/api/bill-payments', billPaymentRoutes);
// app.use('/api/notifications', notificationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'An error occurred on the server',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server with dynamic port selection
const PORT = process.env.PORT || 5001; // Changed default from 5000 to 5001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

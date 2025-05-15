import express from 'express';
import multer from 'multer';
import path from 'path';
import { checkAuth, createUserAccount, getUserAccounts, getAccountById, getAccountTransactions, updateAccountStatus, requestPasswordChange, verifyPasswordChange } from '../controllers/userController.js';
import { protectedRoute } from '../middleware/auth.middleware.js';
import { 
  createSimpleTransfer, 
  createBulkTransfer, 
  createRecurringTransfer, 
  verifyTransfer, 
  getUserTransfers, 
  getTransferById,
  cancelRecurringTransfer 
} from '../controllers/transferControllers.js';
import { getAllUserTransactions } from '../controllers/userController.js';
import { createLoanApplication, getUserLoans, getLoanById } from '../controllers/loanControllers.js';
import { 
  getUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  deleteNotification 
} from '../controllers/notificationController.js';
import fs from 'fs';

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadDir = 'uploads/account-documents/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/account-documents/');
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only .jpeg, .jpg, .png, and .pdf files are allowed'));
    }
  }
});

// Configure upload fields for account documents
const accountDocumentsUpload = upload.fields([
  { name: 'idDocument', maxCount: 1 },
  { name: 'proofOfAddress', maxCount: 1 },
  { name: 'proofOfIncome', maxCount: 1 }
]);

// Protected routes - require authentication
router.get('/check-auth', protectedRoute, checkAuth);
router.post('/accounts', protectedRoute, accountDocumentsUpload, createUserAccount);
router.get('/accounts', protectedRoute, getUserAccounts);
router.get('/accounts/:id', protectedRoute, getAccountById);
router.get('/accounts/:accountId/transactions', protectedRoute, getAccountTransactions);

// Transfer routes
router.post('/transfers/simple', protectedRoute, createSimpleTransfer);
router.post('/transfers/bulk', protectedRoute, createBulkTransfer);
router.post('/transfers/recurring', protectedRoute, createRecurringTransfer);
router.post('/transfers/verify', protectedRoute, verifyTransfer);
router.get('/transfers', protectedRoute, getUserTransfers);
router.get('/transfers/:transferId', protectedRoute, getTransferById);
router.patch('/transfers/recurring/:transferId/cancel', protectedRoute, cancelRecurringTransfer);

// Add this route to your existing routes
router.get('/transactions', protectedRoute, getAllUserTransactions);

// Add a route to get account details by ID
router.get('/accounts/:accountId', protectedRoute, async (req, res) => {
  try {
    const userId = req.user._id;
    const { accountId } = req.params;
    
    const Account = await import('../models/AccountModel.js').then(module => module.default);
    const account = await Account.findOne({ _id: accountId, userId });
    
    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found or does not belong to this user'
      });
    }
    
    res.status(200).json({
      success: true,
      account
    });
  } catch (error) {
    console.error('Get account error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error.message
    });
  }
});

// Create uploads directory if it doesn't exist
const loanDocsDir = 'uploads/loan-documents/';
if (!fs.existsSync(loanDocsDir)) {
  fs.mkdirSync(loanDocsDir, { recursive: true });
}

// Configure multer for loan documents
const loanStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/loan-documents/');
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const loanDocumentsUpload = multer({ 
  storage: loanStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only .jpeg, .jpg, .png, and .pdf files are allowed'));
    }
  }
});

// Loan routes
router.post('/loans', protectedRoute, loanDocumentsUpload.fields([
  { name: 'idDocument', maxCount: 1 },
  { name: 'proofOfIncome', maxCount: 1 },
  { name: 'bankStatements', maxCount: 1 }
]), createLoanApplication);
router.get('/loans', protectedRoute, getUserLoans);
router.get('/loans/:loanId', protectedRoute, getLoanById);

// Notification routes
router.get('/notifications', protectedRoute, getUserNotifications);
router.patch('/notifications/:notificationId/read', protectedRoute, markNotificationAsRead);
router.patch('/notifications/read-all', protectedRoute, markAllNotificationsAsRead);
router.delete('/notifications/:notificationId', protectedRoute, deleteNotification);

// Add this route for updating account status
router.patch('/accounts/:accountId/status', protectedRoute, updateAccountStatus);

// Add this route to handle profile updates
router.put('/update-profile', protectedRoute, async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, address } = req.body;
    
    // Get user from middleware
    const user = req.user;
    
    // Update user fields
    user.firstName = firstName;
    user.lastName = lastName;
    user.phoneNumber = phoneNumber;
    user.address = address;
    
    // Save updated user
    await user.save();
    
    res.status(200).json({
      success: true,
      message: "Profile updated successfully"
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile"
    });
  }
});

// Add these routes for password change with verification
router.post('/request-password-change', protectedRoute, requestPasswordChange);
router.post('/verify-password-change', protectedRoute, verifyPasswordChange);

export default router;





















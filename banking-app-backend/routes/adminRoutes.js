import express from 'express';
import { protectedRoute, adminRoute } from '../middleware/auth.middleware.js';
import { 
  getAllAccounts, 
  getAccountRequests, 
  updateAccountStatus,
  getAllUsers,
  getAllUsersComplete,
  getUserById,
  deleteUser,
  updateUserStatus,
  getDashboardStats,
  getAllTransfers,
  updateTransferStatus,
  getAllBankAccounts,
  getAccountById,
  getAllLoanApplications,
  getLoanById,
  updateLoanStatus,
} from '../controllers/adminController.js';

const router = express.Router();

// User management routes
router.get('/users/complete', protectedRoute, adminRoute, getAllUsersComplete);
router.get('/users', protectedRoute, adminRoute, getAllUsers);
router.get('/users/:userId', protectedRoute, adminRoute, getUserById);
router.delete('/users/:userId', protectedRoute, adminRoute, deleteUser);
router.patch('/users/:userId/status', protectedRoute, adminRoute, updateUserStatus);

// Bank account routes
router.get('/bank-accounts', protectedRoute, adminRoute, getAllBankAccounts);

// Account management routes
router.get('/accounts', protectedRoute, adminRoute, getAllAccounts);
router.get('/accounts/:id', protectedRoute, adminRoute, getAccountById);
router.get('/account-requests', protectedRoute, adminRoute, getAccountRequests);
router.patch('/accounts/:id/status', protectedRoute, adminRoute, updateAccountStatus);

// Transfer routes
router.get('/getAllTransfers', protectedRoute, adminRoute, getAllTransfers);

// Loan routes
router.get('/loans', protectedRoute, adminRoute, getAllLoanApplications);
router.get('/loans/:loanId', protectedRoute, adminRoute, getLoanById);
router.patch('/loans/:loanId/status', protectedRoute, adminRoute, updateLoanStatus);

// Dashboard statistics route
router.get('/dashboard-stats',protectedRoute, adminRoute, getDashboardStats);

export default router;












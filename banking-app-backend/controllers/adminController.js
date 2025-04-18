import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';  // Change from 'bcrypt' to 'bcryptjs'
import User from '../models/UserModel.js';
import Account from '../models/AccountModel.js';
import Transfer from '../models/TransferModel.js';
import { createNotification } from './notificationController.js';
import { sendAccountApprovalEmail } from '../utils/Email.js';

// Get all accounts with user details
export const getAllAccounts = async (req, res) => {
  try {
    console.log('Fetching all accounts'); // Add debug log
    
    // Extract filter parameters
    const { 
      status, 
      accountType, 
      startDate, 
      endDate, 
      search 
    } = req.query;
    
    // Build query object
    const query = {};
    
    // Apply status filter
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Apply account type filter
    if (accountType && accountType !== 'all') {
      query.accountType = accountType;
    }
    
    // Apply date filters
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const endDateObj = new Date(endDate);
        endDateObj.setHours(23, 59, 59, 999); // End of the day
        query.createdAt.$lte = endDateObj;
      }
    }
    
    // Get accounts with filters
    const accounts = await Account.find(query)
      .populate('userId', 'firstName lastName email phoneNumber')
      .sort({ createdAt: -1 });
    
    console.log(`Found ${accounts.length} accounts`); // Add debug log
    
    // Format accounts to match the Account model structure
    let formattedAccounts = accounts.map(account => {
      const accountObj = account.toObject();
      return {
        id: accountObj._id,
        accountNumber: accountObj.accountNumber,
        accountType: accountObj.accountType,
        currency: accountObj.currency,
        status: accountObj.status,
        balance: accountObj.balance,
        submittedDate: accountObj.createdAt,
        rejectionReason: accountObj.rejectionReason,
        applicationDetails: {
          personal: accountObj.applicationDetails?.personal || {},
          contact: accountObj.applicationDetails?.contact || {},
          employment: accountObj.applicationDetails?.employment || {},
          documents: accountObj.applicationDetails?.documents || {}
        },
        userId: accountObj.userId ? {
          id: accountObj.userId._id,
          firstName: accountObj.userId.firstName,
          lastName: accountObj.userId.lastName,
          email: accountObj.userId.email,
          phoneNumber: accountObj.userId.phoneNumber
        } : null
      };
    });
    
    // Apply search filter on the server side if provided
    if (search) {
      const searchLower = search.toLowerCase();
      formattedAccounts = formattedAccounts.filter(account => 
        (account.accountNumber?.toLowerCase() || "").includes(searchLower) ||
        ((account.userId?.firstName + ' ' + account.userId?.lastName)?.toLowerCase() || "").includes(searchLower) ||
        (account.userId?.email?.toLowerCase() || "").includes(searchLower)
      );
    }
    
    return res.status(200).json({
      success: true,
      accounts: formattedAccounts
    });  } catch (error) {
    console.error("Error fetching accounts:", error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch accounts',
      error: error.message
    });
  }
};

// Get pending account requests
export const getAccountRequests = async (req, res) => {
  try {
    console.log('Fetching pending account requests');
    const pendingAccounts = await Account.find({ status: 'pending' })
      .populate('userId', 'firstName lastName email phoneNumber');
    
    console.log(`Found ${pendingAccounts.length} pending accounts`);
    
    const formattedRequests = pendingAccounts.map(account => ({
      id: account._id,
      accountNumber: account.accountNumber,
      accountType: account.accountType,
      currency: account.currency,
      status: account.status,
      submittedDate: account.createdAt,
      applicant: {
        id: account.userId?._id || 'Unknown',
        name: account.userId ? `${account.userId.firstName} ${account.userId.lastName}` : 'Unknown User',
        email: account.userId?.email || 'No email',
        phone: account.userId?.phoneNumber || 'No phone'
      },
      applicationDetails: account.applicationDetails || {}
    }));
    
    return res.status(200).json({
      success: true,
      accounts: formattedRequests
    });
  } catch (error) {
    console.error('Error fetching account requests:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch account requests',
      error: error.message
    });
  }
};

// Update account status (approve/reject)
export const updateAccountStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;
    
    console.log(`Updating account ${id} status to ${status}`);
    
    // Validate account ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid account ID format'
      });
    }
    
    // Validate status value
    if (!['approved', 'rejected', 'pending', 'active', 'frozen', 'closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }
    
    // Prepare update data
    const updateData = { status };
    if (status === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }
    if (status === 'closed' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    // Find and update the account
    const updatedAccount = await Account.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'email firstName lastName');
    
    if (!updatedAccount) {
      console.log(`Account with ID ${id} not found`);
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }
    
    console.log(`Account updated successfully: ${updatedAccount._id}, new status: ${updatedAccount.status}`);
    
    // If account is approved, also update user's accountStatus
    if (status === 'approved' || status === 'active') {
      await User.findByIdAndUpdate(
        updatedAccount.userId._id,
        { accountStatus: 'approved' }
      );
      console.log(`User ${updatedAccount.userId._id} status updated to approved`);
    } else if (status === 'rejected') {
      await User.findByIdAndUpdate(
        updatedAccount.userId._id,
        { accountStatus: 'refused' }
      );
      console.log(`User ${updatedAccount.userId._id} status updated to refused`);
    }
    
    // Create notification for the user about account status change
    try {
      await createNotification({
        userId: updatedAccount.userId._id,
        title: `Account ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: `Your ${updatedAccount.accountType} account has been ${status}.`,
        type: 'account',
        relatedItemId: updatedAccount._id,
        relatedItemType: 'account'
      });
      console.log(`Notification created for user ${updatedAccount.userId._id}`);
    } catch (notificationError) {
      console.error("Error creating notification:", notificationError);
      // Continue with the response even if notification creation fails
    }
    
    return res.status(200).json({
      success: true,
      message: `Account ${status} successfully`,
      account: updatedAccount
    });
  } catch (error) {
    console.error("Error updating account status:", error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update account status',
      error: error.message
    });
  }
};

// Get all users from the database
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    
    const formattedUsers = users.map(user => ({
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phoneNumber,
      status: user.accountStatus || 'active',
      createdAt: user.createdAt
    }));
    
    return res.status(200).json({
      success: true,
      users: formattedUsers
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// Get user details by ID
export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        city: user.city,
        postalCode: user.postalCode,
        age: user.age,
        gender: user.gender,
        idCardNumber: user.idCardNumber,
        idCardFrontPhoto: user.idCardFrontPhoto,
        idCardBackPhoto: user.idCardBackPhoto,
        role: user.role,
        isOnline: user.isOnline,
        bankAccountList: user.bankAccountList,
        accountStatus: user.accountStatus,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user details',
      error: error.message
    });
  }
};


// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Get total users count
    const totalUsers = await User.countDocuments({});
    
    // Get accounts statistics
    const totalAccounts = await Account.countDocuments({});
    const pendingAccounts = await Account.countDocuments({ status: 'pending' });
    const activeAccounts = await Account.countDocuments({ status: 'approved' });
    
    // Get accounts by type
    const savingsAccounts = await Account.countDocuments({ accountType: 'savings' });
    const checkingAccounts = await Account.countDocuments({ accountType: 'checking' });
    const businessAccounts = await Account.countDocuments({ accountType: 'business' });
    
    return res.status(200).json({
      success: true,
      stats: {
        users: {
          total: totalUsers
        },
        accounts: {
          total: totalAccounts,
          pending: pendingAccounts,
          active: activeAccounts,
          byType: {
            savings: savingsAccounts,
            checking: checkingAccounts,
            business: businessAccounts
          }
        }
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
};

// Get accounts for a specific user
export const getUserAccounts = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }
    
    // Find all accounts for this user
    const accounts = await Account.find({ userId });
    
    return res.status(200).json({
      success: true,
      accounts: accounts.map(account => ({
        id: account._id,
        accountNumber: account.accountNumber,
        accountType: account.accountType,
        currency: account.currency,
        balance: account.balance,
        status: account.status,
        createdAt: account.createdAt
      }))
    });
  } catch (error) {
    console.error("Error fetching user accounts:", error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user accounts',
      error: error.message
    });
  }
};

// Get all loan applications
export const getAllLoanApplications = async (req, res) => {
  try {
    const Loan = await import('../models/LoanModel.js').then(module => module.default);
    
    const loans = await Loan.find({}).populate('userId', 'firstName lastName email phoneNumber');
    
    const formattedLoans = loans.map(loan => ({
      id: loan._id,
      loanType: loan.loanType,
      amount: loan.amount,
      term: loan.term,
      status: loan.status,
      submittedDate: loan.createdAt,
      applicant: {
        id: loan.userId?._id || 'Unknown',
        name: loan.userId ? `${loan.userId.firstName} ${loan.userId.lastName}` : 'Unknown User',
        email: loan.userId?.email || 'No email',
        phone: loan.userId?.phoneNumber || 'No phone'
      }
    }));
    
    return res.status(200).json({
      success: true,
      loans: formattedLoans
    });
  } catch (error) {
    console.error("Error fetching loan applications:", error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch loan applications',
      error: error.message
    });
  }
};

// Get loan application by ID
export const getLoanById = async (req, res) => {
  try {
    const { loanId } = req.params;
    const Loan = await import('../models/LoanModel.js').then(module => module.default);
    
    // Fully populate the userId field to get all user information
    const loan = await Loan.findById(loanId)
      .populate({
        path: 'userId',
        select: 'firstName lastName email phoneNumber address city postalCode'
      });
    
    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan application not found'
      });
    }
    
    // Format the response to include all loan details
    const formattedLoan = {
      id: loan._id,
      loanType: loan.loanType,
      amount: loan.amount,
      term: loan.term,
      interestRate: loan.interestRate,
      status: loan.status,
      currency: loan.currency || 'USD',
      monthlyPayment: loan.monthlyPayment,
      submittedDate: loan.createdAt,
      approvalDate: loan.approvalDate,
      rejectionReason: loan.rejectionReason,
      purpose: loan.applicationDetails?.purpose,
      notes: loan.notes,
      documents: loan.documents.map(doc => {
        // If the document path is already a full URL, return it as is
        if (doc.startsWith('http://') || doc.startsWith('https://')) {
          return doc;
        }
        // Otherwise, construct a full URL
        return `${process.env.BASE_URL || 'http://localhost:5001'}/uploads/${doc}`;
      }),
      creditScore: loan.creditScore,
      creditRating: loan.creditRating,
      paymentHistory: loan.paymentHistory,
      applicationDetails: {
        personal: {
          firstName: loan.applicationDetails?.personal?.firstName || loan.userId?.firstName || '',
          lastName: loan.applicationDetails?.personal?.lastName || loan.userId?.lastName || '',
          email: loan.applicationDetails?.personal?.email || loan.userId?.email || '',
          phone: loan.applicationDetails?.personal?.phone || loan.userId?.phoneNumber || '',
          address: loan.applicationDetails?.personal?.address || loan.userId?.address || '',
          city: loan.applicationDetails?.personal?.city || loan.userId?.city || '',
          postalCode: loan.applicationDetails?.personal?.postalCode || loan.userId?.postalCode || ''
        },
        employment: {
          status: loan.applicationDetails?.employment?.status || '',
          employerName: loan.applicationDetails?.employment?.employerName || '',
          monthlyIncome: loan.applicationDetails?.employment?.monthlyIncome || 0,
          otherLoans: loan.applicationDetails?.employment?.otherLoans || false,
          otherLoansAmount: loan.applicationDetails?.employment?.otherLoansAmount || 0
        },
        purpose: loan.applicationDetails?.purpose || '',
        additionalInfo: loan.applicationDetails?.additionalInfo || ''
      },
      applicant: {
        id: loan.userId?._id || '',
        name: loan.userId ? `${loan.userId.firstName || ''} ${loan.userId.lastName || ''}`.trim() || 'Unknown User' : 'Unknown User',
        email: loan.userId?.email || '',
        phone: loan.userId?.phoneNumber || '',
        address: loan.userId?.address || '',
        city: loan.userId?.city || '',
        postalCode: loan.userId?.postalCode || ''
      }
    };
    
    return res.status(200).json({
      success: true,
      loan: formattedLoan
    });
  } catch (error) {
    console.error("Error fetching loan details:", error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch loan details',
      error: error.message
    });
  }
};

// Update loan application status
export const updateLoanStatus = async (req, res) => {
  try {
    const { loanId } = req.params;
    const { status, rejectionReason } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Status must be either "approved" or "rejected"'
      });
    }
    
    if (status === 'rejected' && !rejectionReason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required when rejecting a loan'
      });
    }
    
    const Loan = await import('../models/LoanModel.js').then(module => module.default);
    const User = await import('../models/UserModel.js').then(module => module.default);
    const { createNotification } = await import('../controllers/notificationController.js');
    
    const loan = await Loan.findById(loanId);
    
    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan application not found'
      });
    }
    
    // Update loan status
    loan.status = status;
    if (status === 'rejected') {
      loan.rejectionReason = rejectionReason;
    }
    
    // If approved, set approval date
    if (status === 'approved') {
      loan.approvalDate = new Date();
      
      // If this is a disbursed loan, you might want to create a transaction
      // and update the user's account balance here
    }
    
    await loan.save();
    
    // Create notification for the user
    const user = await User.findById(loan.userId);
    if (user) {
      const notificationMessage = status === 'approved' 
        ? `Your loan application for ${loan.amount} ${loan.currency} has been approved!` 
        : `Your loan application has been rejected. Reason: ${rejectionReason}`;
      
      await createNotification({
        userId: user._id,
        title: `Loan Application ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: notificationMessage,
        type: status === 'approved' ? 'success' : 'alert',
        relatedDocumentId: loan._id,
        relatedDocumentType: 'loan'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: `Loan application ${status} successfully`,
      loan
    });
  } catch (error) {
    console.error("Error updating loan status:", error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update loan status',
      error: error.message
    });
  }
};

// Get all transfers with detailed user and account information
export const getAllTransfers = async (req, res) => {
  try {
    console.log('Admin fetching all transfers with detailed information');
    
    const transfers = await Transfer.find({})
      .populate('userId', 'firstName lastName email phoneNumber address city postalCode idCardNumber')
      .populate({
        path: 'fromAccount',
        select: 'accountNumber accountType currency balance',
        populate: {
          path: 'userId',
          select: 'firstName lastName email phoneNumber'
        }
      })
      .sort({ createdAt: -1 });
    
    console.log(`Found ${transfers.length} transfers`);
    
    const formattedTransfers = transfers.map(transfer => {
      // Get receiver information if it's an internal transfer
      let receiverInfo = { name: 'External Account', email: 'N/A', phone: 'N/A' };
      
      // If it's an internal transfer, try to extract receiver information
      if (transfer.type === 'internal' && transfer.toAccount) {
        // This assumes toAccount contains the account number for internal transfers
        // You might need to adjust this based on your data structure
        receiverInfo = {
          name: 'Internal Account Holder',
          accountNumber: transfer.toAccount,
          email: 'N/A',
          phone: 'N/A'
        };
      }
      
      return {
        _id: transfer._id,
        type: transfer.type,
        amount: transfer.amount,
        currency: transfer.currency || 'TND',
        status: transfer.status,
        description: transfer.description || '',
        reference: transfer.reference || '',
        createdAt: transfer.createdAt,
        completedAt: transfer.completedAt,
        isVerified: transfer.isVerified,
        
        // Sender information
        sender: {
          id: transfer.userId?._id || 'Unknown',
          name: transfer.userId ? `${transfer.userId.firstName} ${transfer.userId.lastName}` : 'Unknown User',
          email: transfer.userId?.email || 'N/A',
          phone: transfer.userId?.phoneNumber || 'N/A',
          address: transfer.userId?.address || 'N/A',
          city: transfer.userId?.city || 'N/A',
          postalCode: transfer.userId?.postalCode || 'N/A',
          idCardNumber: transfer.userId?.idCardNumber || 'N/A'
        },
        
        // Source account information
        sourceAccount: {
          id: transfer.fromAccount?._id || 'Unknown',
          accountNumber: transfer.fromAccount?.accountNumber || 'Unknown',
          accountType: transfer.fromAccount?.accountType || 'Unknown',
          currency: transfer.fromAccount?.currency || 'TND',
          balance: transfer.fromAccount?.balance || 0
        },
        
        // Destination account/receiver information
        destinationAccount: {
          accountNumber: transfer.toAccount || 'N/A',
          accountHolder: receiverInfo.name,
          email: receiverInfo.email,
          phone: receiverInfo.phone
        }
      };
    });
    
    return res.status(200).json({
      success: true,
      transfers: formattedTransfers
    });
  } catch (error) {
    console.error("Error fetching transfers:", error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch transfers',
      error: error.message
    });
  }
};

// Get transfer by ID
export const getTransferById = async (req, res) => {
  try {
    const { transferId } = req.params;
    
    const transfer = await Transfer.findById(transferId)
      .populate('userId', 'firstName lastName email phoneNumber')
      .populate('fromAccount', 'accountNumber accountType balance');
    
    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: 'Transfer not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      transfer
    });
  } catch (error) {
    console.error("Error fetching transfer:", error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch transfer details',
      error: error.message
    });
  }
};

// Update transfer status
export const updateTransferStatus = async (req, res) => {
  try {
    const { transferId } = req.params;
    const { status, reason } = req.body;
    
    // Validate status value
    if (!['pending', 'completed', 'failed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }
    
    const transfer = await Transfer.findById(transferId)
      .populate('userId', 'firstName lastName email');
    
    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: 'Transfer not found'
      });
    }
    
    // Update transfer status
    transfer.status = status;
    
    if (status === 'failed' || status === 'cancelled') {
      transfer.failureReason = reason || 'Cancelled by admin';
    }
    
    await transfer.save();
    
    // Create notification for the user
    if (transfer.userId) {
      const statusMessage = {
        completed: 'Your transfer has been completed successfully.',
        failed: `Your transfer has failed. Reason: ${reason || 'Processing error'}`,
        cancelled: `Your transfer has been cancelled. Reason: ${reason || 'Cancelled by admin'}`
      };
      
      await createNotification({
        userId: transfer.userId._id,
        title: `Transfer ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: statusMessage[status] || `Your transfer status has been updated to ${status}.`,
        type: status === 'completed' ? 'success' : 'alert',
        relatedItemId: transfer._id,
        relatedItemType: 'transfer'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: `Transfer status updated to ${status}`,
      transfer
    });
  } catch (error) {
    console.error("Error updating transfer status:", error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update transfer status',
      error: error.message
    });
  }
};

// Get all users with complete information
export const getAllUsersComplete = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    
    return res.status(200).json({
      success: true,
      users: users.map(user => ({
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        city: user.city,
        postalCode: user.postalCode,
        age: user.age,
        gender: user.gender,
        idCardNumber: user.idCardNumber,
        idCardFrontPhoto: user.idCardFrontPhoto,
        idCardBackPhoto: user.idCardBackPhoto,
        role: user.role,
        isOnline: user.isOnline,
        bankAccountList: user.bankAccountList,
        accountStatus: user.accountStatus || 'active',
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }))
    });
  } catch (error) {
    console.error("Error fetching complete users:", error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }
    
    // Find and delete the user
    const deletedUser = await User.findByIdAndDelete(userId);
    
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Also delete all associated accounts
    await Account.deleteMany({ userId: userId });
    
    // Delete associated transfers
    await Transfer.deleteMany({ 
      $or: [
        { senderId: userId },
        { recipientId: userId }
      ]
    });
    
    return res.status(200).json({
      success: true,
      message: 'User and all associated data deleted successfully'
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};

// Update user status
export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;
    
    // Validate user ID
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }
    
    // Validate status value
    if (!['pending', 'approved', 'refused', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }
    
    // Find and update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { accountStatus: status },
      { new: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Create notification for the user
    await createNotification({
      userId: updatedUser._id,
      title: `Account Status Updated`,
      message: `Your account status has been updated to ${status}.`,
      type: 'account',
      relatedDocumentType: 'user'
    });
    
    // If the status is 'approved', send an email with login credentials
    if (status === 'approved') {
      // Generate a temporary password (you might want to use a more secure method)
      const tempPassword = Math.random().toString(36).slice(-8);
      
      // Update user with the temporary password and set password change flag
      const hashedPassword = await bcrypt.hash(tempPassword, 10);
      await User.findByIdAndUpdate(userId, { 
        password: hashedPassword,
        passwordChangeRequired: true
      });
      
      // Send email with login credentials
      await sendAccountApprovalEmail(
        updatedUser.email, 
        updatedUser.firstName,
        tempPassword
      );
    }
    
    return res.status(200).json({
      success: true,
      message: `User status updated to ${status}`,
      user: {
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        accountStatus: updatedUser.accountStatus
      }
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update user status',
      error: error.message
    });
  }
};

// Get all bank accounts in the system
export const getAllBankAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({})
      .populate('userId', 'firstName lastName email phoneNumber')
      .sort({ createdAt: -1 });
    
    const formattedAccounts = accounts.map(account => ({
      id: account._id,
      accountNumber: account.accountNumber,
      accountType: account.accountType,
      currency: account.currency,
      balance: account.balance,
      status: account.status,
      createdAt: account.createdAt,
      owner: account.userId ? {
        id: account.userId._id,
        name: `${account.userId.firstName} ${account.userId.lastName}`,
        email: account.userId.email,
        phone: account.userId.phoneNumber
      } : null
    }));
    
    return res.status(200).json({
      success: true,
      accounts: formattedAccounts
    });
  } catch (error) {
    console.error("Error fetching all bank accounts:", error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch bank accounts',
      error: error.message
    });
  }
};

// Get account by ID
export const getAccountById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate account ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid account ID format'
      });
    }
    
    const account = await Account.findById(id)
      .populate('userId', 'firstName lastName email phoneNumber');
    
    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }
    
    // Format account to match the Account model structure
    const formattedAccount = {
      id: account._id,
      accountNumber: account.accountNumber,
      accountType: account.accountType,
      currency: account.currency,
      status: account.status,
      balance: account.balance,
      submittedDate: account.createdAt,
      applicationDetails: account.applicationDetails || {},
      owner: account.userId ? {
        id: account.userId._id,
        name: `${account.userId.firstName} ${account.userId.lastName}`,
        email: account.userId.email,
        phone: account.userId.phoneNumber
      } : null
    };
    
    return res.status(200).json({
      success: true,
      account: formattedAccount
    });
  } catch (error) {
    console.error("Error fetching account details:", error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch account details',
      error: error.message
    });
  }
};




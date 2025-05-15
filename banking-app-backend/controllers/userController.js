import User from '../models/UserModel.js';
import Account from '../models/AccountModel.js';
import mongoose from 'mongoose';
import { createNotification } from './notificationController.js';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '../utils/Email.js';
import cloudinary from '../utils/Cloudinary.js';
import fs from 'fs';

export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Create a new account for the user based on new-acc-form data
export const createUserAccount = async (req, res) => {
  try {
    const userId = req.user._id; // Get user ID from auth middleware
    
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    
    // Extract data from the new-acc-form submission
    const { 
      // Personal Information
      firstName,
      lastName,
      dateOfBirth,
      nationality,
      idType,
      idNumber,
      
      // Contact Information
      email,
      phone,
      address,
      city,
      postalCode,
      
      // Employment Information
      employmentStatus,
      employerName,
      jobTitle,
      monthlyIncome,
      
      // Account Information
      accountType,
      currency = 'TND',
      initialDeposit = 0,
    } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !dateOfBirth || !idType || !idNumber || 
        !email || !phone || !address || !accountType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    // Check if user already has an account of this type
    const existingAccount = await Account.findOne({
      userId,
      accountType
    });
    
    if (existingAccount) {
      return res.status(400).json({
        success: false,
        message: `You already have a ${accountType} account or application pending`
      });
    }
    
    // Process file uploads with Cloudinary
    let documentUrls = {
      idDocument: null,
      proofOfAddress: null,
      proofOfIncome: null
    };
    
    if (req.files) {
      // Upload ID document
      if (req.files.idDocument && req.files.idDocument[0]) {
        try {
          const result = await cloudinary.uploader.upload(
            req.files.idDocument[0].path,
            {
              folder: `banking-app/accounts/${userId}/documents`,
              resource_type: 'auto'
            }
          );
          documentUrls.idDocument = result.secure_url;
          
          // Delete local file after upload
          fs.unlinkSync(req.files.idDocument[0].path);
        } catch (error) {
          console.error('Error uploading ID document:', error);
        }
      }
      
      // Upload proof of address
      if (req.files.proofOfAddress && req.files.proofOfAddress[0]) {
        try {
          const result = await cloudinary.uploader.upload(
            req.files.proofOfAddress[0].path,
            {
              folder: `banking-app/accounts/${userId}/documents`,
              resource_type: 'auto'
            }
          );
          documentUrls.proofOfAddress = result.secure_url;
          
          // Delete local file after upload
          fs.unlinkSync(req.files.proofOfAddress[0].path);
        } catch (error) {
          console.error('Error uploading proof of address:', error);
        }
      }
      
      // Upload proof of income
      if (req.files.proofOfIncome && req.files.proofOfIncome[0]) {
        try {
          const result = await cloudinary.uploader.upload(
            req.files.proofOfIncome[0].path,
            {
              folder: `banking-app/accounts/${userId}/documents`,
              resource_type: 'auto'
            }
          );
          documentUrls.proofOfIncome = result.secure_url;
          
          // Delete local file after upload
          fs.unlinkSync(req.files.proofOfIncome[0].path);
        } catch (error) {
          console.error('Error uploading proof of income:', error);
        }
      }
    }
    
    // Validate required documents
    if (!documentUrls.idDocument) {
      return res.status(400).json({
        success: false,
        message: 'ID document is required'
      });
    }
    
    // Create new account with a unique account number
    const accountNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
    
    const newAccount = new Account({
      userId,
      accountNumber,
      accountType,
      currency,
      balance: parseFloat(initialDeposit) || 0,
      status: 'pending', // All new accounts start as pending
      applicationDetails: {
        personal: {
          firstName,
          lastName,
          dateOfBirth,
          nationality,
          idType,
          idNumber
        },
        contact: {
          email,
          phone,
          address,
          city,
          postalCode
        },
        employment: {
          status: employmentStatus,
          employerName: employerName || '',
          jobTitle: jobTitle || '',
          monthlyIncome: monthlyIncome || 0
        },
        documents: documentUrls
      },
      createdAt: new Date()
    });
    
    await newAccount.save();
    
    // Add the account to the user's bankAccountList
    await User.findByIdAndUpdate(
      userId,
      { $push: { bankAccountList: newAccount._id } }
    );
    
    // Create notification for the user
    await createNotification({
      userId: userId,
      title: 'Account Application Submitted',
      message: `Your application for a new ${accountType} account has been submitted and is pending approval.`,
      type: 'account',
      relatedItemId: newAccount._id,
      relatedItemType: 'account'
    });
    
    res.status(201).json({
      success: true,
      message: 'Account application submitted successfully and pending approval',
      applicationId: newAccount._id,
      account: {
        id: newAccount._id,
        accountNumber: newAccount.accountNumber,
        accountType: newAccount.accountType,
        currency: newAccount.currency,
        balance: newAccount.balance,
        status: newAccount.status,
        createdAt: newAccount.createdAt
      }
    });
  } catch (error) {
    console.error('Create account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create account',
      error: error.message
    });
  }
};

// Get all accounts for the current user
export const getUserAccounts = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const accounts = await Account.find({ userId });
    
    if (!accounts || accounts.length === 0) {
      return res.status(200).json({
        success: true,
        accounts: [],
        message: 'No accounts found for this user'
      });
    }
    
    res.status(200).json({
      success: true,
      accounts: accounts.map(account => ({
        _id: account._id,
        id: account._id,
        accountNumber: account.accountNumber,
        accountType: account.accountType,
        currency: account.currency,
        balance: account.balance,
        status: account.status,
        createdAt: account.createdAt,
        transactionCount: account.transactionCount || 0
      }))
    });
  } catch (error) {
    console.error('Get user accounts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve accounts',
      error: error.message
    });
  }
}

// Get account details by ID
export const getAccountById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Validate account ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid account ID format'
      });
    }

    // Find the account
    const account = await Account.findById(id);

    // Check if account exists
    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }

    // Check if the account belongs to the user
    if (account.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to view this account'
      });
    }

    // Format the account data
    const accountData = {
      id: account._id,
      accountNumber: account.accountNumber,
      accountType: account.accountType,
      currency: account.currency,
      balance: account.balance,
      status: account.status,
      createdAt: account.createdAt,
      rejectionReason: account.rejectionReason,
      // Include other fields as needed
    };

    return res.status(200).json({
      success: true,
      account: accountData
    });
  } catch (error) {
    console.error('Error fetching account details:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching account details'
    });
  }
};

// Get transactions for a specific account
export const getAccountTransactions = async (req, res) => {
  try {
    const userId = req.user._id;
    const { accountId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    // Convert to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // First verify the account belongs to the user
    const account = await Account.findOne({ _id: accountId, userId });
    
    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found or does not belong to this user'
      });
    }
    
    // If transactions are stored in the account model
    const transactions = account.transactions || [];
    
    // Apply pagination manually
    const paginatedTransactions = transactions
      .sort((a, b) => new Date(b.date) - new Date(a.date)) // Most recent first
      .slice(skip, skip + limitNum);
    
    // Get total count for pagination
    const totalCount = transactions.length;
    const totalPages = Math.ceil(totalCount / limitNum);
    
    res.status(200).json({
      success: true,
      transactions: paginatedTransactions.map(tx => ({
        id: tx._id,
        date: tx.date,
        description: tx.description,
        category: tx.category,
        amount: tx.amount,
        type: tx.type,
        account: account.accountNumber,
        reference: tx.reference
      })),
      currentPage: pageNum,
      totalPages,
      totalCount
    });
  } catch (error) {
    console.error('Get account transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve transactions',
      error: error.message
    });
  }
}

// Get details for a specific account
export const getAccountDetails = async (req, res) => {
  try {
    const userId = req.user._id;
    const { accountId } = req.params;
    
    const account = await Account.findOne({ _id: accountId, userId });
    
    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found or does not belong to this user'
      });
    }
    
    // Get transaction count for this account
    const transactionCount = account.transactions ? account.transactions.length : 0;
    
    // Get recent transactions (last 5)
    const recentTransactions = account.transactions 
      ? account.transactions
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5)
      : [];
    
    res.status(200).json({
      success: true,
      account: {
        id: account._id,
        accountNumber: account.accountNumber,
        accountType: account.accountType,
        currency: account.currency,
        balance: account.balance,
        availableBalance: account.availableBalance || account.balance,
        status: account.status,
        createdAt: account.createdAt,
        lastActivity: account.lastActivity || null,
        branch: account.branch || 'Main Branch',
        interestRate: account.interestRate || 0,
        iban: account.iban || `TN59${account.accountNumber}`,
        bic: account.bic || 'AMENTNTT',
        transactionCount,
        recentTransactions: recentTransactions.map(tx => ({
          id: tx._id,
          date: tx.date,
          description: tx.description,
          amount: tx.amount,
          type: tx.type
        }))
      }
    });
  } catch (error) {
    console.error('Get account details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve account details',
      error: error.message
    });
  }
}

// Get all transactions for a user across all accounts with filtering
export const getAllUserTransactions = async (req, res) => {
  try {
    const userId = req.user._id;
    const { 
      page = 1, 
      limit = 10,
      accountId,
      type,
      startDate,
      endDate,
      search
    } = req.query;
    
    // Convert to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    // Get accounts for this user (filtered by accountId if provided)
    const accountQuery = { userId };
    if (accountId && accountId !== 'all') {
      accountQuery._id = accountId;
    }
    
    const accounts = await Account.find(accountQuery);
    
    if (!accounts || accounts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No accounts found for this user'
      });
    }
    
    // Collect all transactions from all accounts
    let allTransactions = [];
    
    accounts.forEach(account => {
      const accountTransactions = (account.transactions || []).map(tx => ({
        ...tx.toObject(),
        accountNumber: account.accountNumber,
        accountType: account.accountType,
        accountId: account._id
      }));
      
      allTransactions = [...allTransactions, ...accountTransactions];
    });
    
    // Apply filters
    if (type && type !== 'all') {
      allTransactions = allTransactions.filter(tx => tx.type === type);
    }
    
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      allTransactions = allTransactions.filter(tx => new Date(tx.date) >= start);
    }
    
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      allTransactions = allTransactions.filter(tx => new Date(tx.date) <= end);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      allTransactions = allTransactions.filter(tx => 
        (tx.description && tx.description.toLowerCase().includes(searchLower)) ||
        (tx.category && tx.category.toLowerCase().includes(searchLower)) ||
        (tx.reference && tx.reference.toLowerCase().includes(searchLower))
      );
    }
    
    // Sort by date (most recent first)
    allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Apply pagination
    const totalCount = allTransactions.length;
    const totalPages = Math.ceil(totalCount / limitNum);
    
    const skip = (pageNum - 1) * limitNum;
    const paginatedTransactions = allTransactions.slice(skip, skip + limitNum);
    
    res.status(200).json({
      success: true,
      transactions: paginatedTransactions,
      currentPage: pageNum,
      totalPages,
      totalCount
    });
  } catch (error) {
    console.error('Get all transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error.message
    });
  }
};

// Export transactions as CSV
export const exportTransactions = async (req, res) => {
  try {
    const userId = req.user._id;
    const { 
      accountId,
      type,
      startDate,
      endDate,
      search
    } = req.query;
    
    // Get accounts for this user (filtered by accountId if provided)
    const accountQuery = { userId };
    if (accountId && accountId !== 'all') {
      accountQuery._id = accountId;
    }
    
    const accounts = await Account.find(accountQuery);
    
    if (!accounts || accounts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No accounts found for this user'
      });
    }
    
    // Collect all transactions from all accounts
    let allTransactions = [];
    
    accounts.forEach(account => {
      const accountTransactions = (account.transactions || []).map(tx => ({
        ...tx.toObject(),
        accountNumber: account.accountNumber,
        accountType: account.accountType
      }));
      
      allTransactions = [...allTransactions, ...accountTransactions];
    });
    
    // Apply filters
    if (type && type !== 'all') {
      allTransactions = allTransactions.filter(tx => tx.type === type);
    }
    
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      allTransactions = allTransactions.filter(tx => new Date(tx.date) >= start);
    }
    
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      allTransactions = allTransactions.filter(tx => new Date(tx.date) <= end);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      allTransactions = allTransactions.filter(tx => 
        (tx.description && tx.description.toLowerCase().includes(searchLower)) ||
        (tx.category && tx.category.toLowerCase().includes(searchLower)) ||
        (tx.reference && tx.reference.toLowerCase().includes(searchLower))
      );
    }
    
    // Sort by date (most recent first)
    allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Create CSV content
    const csvContent = [
      ['Date', 'Description', 'Category', 'Amount', 'Type', 'Account Number', 'Reference']
    ];
    
    allTransactions.forEach(tx => {
      csvContent.push([
        tx.date,
        tx.description,
        tx.category,
        tx.amount,
        tx.type,
        tx.accountNumber,
        tx.reference
      ]);
    });
    
    // Convert to CSV format
    const csv = csvContent.map(row => row.join(',')).join('\n');
    
    // Set response headers
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.csv');
    
    // Send the CSV content
    res.send(csv);
  } catch (error) {
    console.error('Export transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export transactions',
      error: error.message
    });
  }
};

// Add this function to handle account status updates
export const updateAccountStatus = async (req, res) => {
  try {
    const { accountId } = req.params;
    const { status } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(accountId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid account ID format'
      });
    }
    
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found'
      });
    }
    
    // Update account status
    account.status = status;
    await account.save();
    
    // Create notification for account status change
    await createNotification({
      userId: account.userId,
      title: `Account ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your ${account.accountType} account (${account.accountNumber}) has been ${status}.`,
      type: 'account',
      relatedItemId: account._id,
      relatedItemType: 'account'
    });
    
    res.status(200).json({
      success: true,
      message: `Account status updated to ${status}`,
      account
    });
  } catch (error) {
    console.error('Update account status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update account status',
      error: error.message
    });
  }
};

// Request password change with verification
export const requestPasswordChange = async (req, res) => {
  try {
    const { currentPassword } = req.body;
    const userId = req.user._id;
    
    // Verify current password
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if current password is correct
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Generate verification code
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Save verification code to user
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    await user.save();
    
    // Send verification email
    const emailSent = await sendVerificationEmail(user.email, verificationCode);
    
    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'Verification code sent to your email',
      token: user._id // Using user ID as token for simplicity
    });
  } catch (error) {
    console.error('Error in requestPasswordChange:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process password change request',
      error: error.message
    });
  }
};

// Verify code and change password
export const verifyPasswordChange = async (req, res) => {
  try {
    const { token, code, newPassword } = req.body;
    
    // Validate token (userId)
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request'
      });
    }
    
    // Find user by ID
    const user = await User.findById(token).select('+verificationCode +verificationCodeExpires');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if verification code exists and matches
    if (!user.verificationCode || user.verificationCode !== code) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }
    
    // Check if verification code has expired
    if (user.verificationCodeExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired'
      });
    }
    
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update password and clear verification code
    user.password = hashedPassword;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();
    
    // Create notification for password change
    await createNotification({
      userId: user._id,
      title: 'Password Changed',
      message: 'Your password has been successfully changed.',
      type: 'security',
      relatedItemType: 'passwordReset' // Changed from 'user' to an allowed value
    });
    
    // Return success
    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Password change verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    });
  }
};

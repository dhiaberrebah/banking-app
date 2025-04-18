import Transfer from '../models/TransferModel.js';
import Account from '../models/AccountModel.js';
import User from '../models/UserModel.js';
import { sendVerificationEmail } from '../utils/Email.js';
import mongoose from 'mongoose';
import { createNotification } from './notificationController.js';

// Generate a random 6-digit verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Simple transfer between accounts
export const createSimpleTransfer = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fromAccountId, toAccountNumber, amount, description } = req.body;
    
    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transfer amount'
      });
    }
    
    // Check if from account exists and belongs to user
    const fromAccount = await Account.findOne({ _id: fromAccountId, userId });
    if (!fromAccount) {
      return res.status(404).json({
        success: false,
        message: 'Source account not found or does not belong to this user'
      });
    }
    
    // Check if account has sufficient funds
    if (fromAccount.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient funds'
      });
    }
    
    // Create transfer record
    const transfer = await Transfer.create({
      userId,
      fromAccount: fromAccountId,
      toAccount: toAccountNumber,
      amount,
      description,
      type: 'simple',
      status: 'pending'
    });
    
    // Generate verification code
    const verificationCode = generateVerificationCode();
    transfer.verificationCode = verificationCode;
    transfer.verificationCodeExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    await transfer.save();
    
    // Send verification email
    const user = await User.findById(userId);
    const emailSent = await sendVerificationEmail(user.email, verificationCode);
    
    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email'
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Transfer initiated. Please verify with the code sent to your email.',
      transferId: transfer._id
    });
  } catch (error) {
    console.error('Simple transfer error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error.message
    });
  }
};

// Bulk transfer to multiple beneficiaries
export const createBulkTransfer = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fromAccountId, beneficiaries } = req.body;
    
    // Log the received account ID for debugging
    console.log("Received fromAccountId:", fromAccountId);
    
    // Validate account ID format
    if (!fromAccountId) {
      return res.status(400).json({
        success: false,
        message: 'Missing account ID'
      });
    }
    
    // Extract ID if a display string was sent instead of just the ID
    let accountId = fromAccountId;
    if (typeof fromAccountId === 'string' && !mongoose.Types.ObjectId.isValid(fromAccountId)) {
      console.log("Received display string instead of ID, attempting to extract ID");
      // Try to extract the ID from the frontend display format
      const match = fromAccountId.match(/^[^-]+ - (\d+)/);
      if (match && match[1]) {
        // Look up the account by account number
        const account = await Account.findOne({ accountNumber: match[1], userId });
        if (account) {
          accountId = account._id.toString();
          console.log("Found account by number, using ID:", accountId);
        } else {
          return res.status(400).json({
            success: false,
            message: 'Invalid account ID format'
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid account ID format'
        });
      }
    }
    
    // Validate beneficiaries
    if (!beneficiaries || !Array.isArray(beneficiaries) || beneficiaries.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid beneficiaries data'
      });
    }
    
    // Validate each beneficiary has required fields
    for (const beneficiary of beneficiaries) {
      if (!beneficiary.accountNumber || !beneficiary.amount || isNaN(Number(beneficiary.amount))) {
        return res.status(400).json({
          success: false,
          message: 'Each beneficiary must have a valid account number and amount'
        });
      }
    }
    
    // Calculate total amount
    const totalAmount = beneficiaries.reduce((sum, b) => sum + Number(b.amount), 0);
    
    // Check if from account exists and belongs to user
    const fromAccount = await Account.findOne({ _id: accountId, userId });
    if (!fromAccount) {
      return res.status(404).json({
        success: false,
        message: 'Source account not found or does not belong to this user'
      });
    }
    
    // Check if account has sufficient funds
    if (fromAccount.balance < totalAmount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient funds for bulk transfer'
      });
    }
    
    // Create bulk transfer record
    const transfer = await Transfer.create({
      userId,
      fromAccount: accountId,
      toAccount: 'multiple',
      amount: totalAmount,
      description: 'Bulk transfer',
      type: 'bulk',
      status: 'pending',
      beneficiaries
    });
    
    // Generate verification code
    const verificationCode = generateVerificationCode();
    transfer.verificationCode = verificationCode;
    transfer.verificationCodeExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    await transfer.save();
    
    // Send verification email
    const user = await User.findById(userId);
    const emailSent = await sendVerificationEmail(user.email, verificationCode);
    
    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email'
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Bulk transfer initiated. Please verify with the code sent to your email.',
      transferId: transfer._id
    });
  } catch (error) {
    console.error('Bulk transfer error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error.message
    });
  }
};

// Create recurring transfer
export const createRecurringTransfer = async (req, res) => {
  try {
    const userId = req.user._id;
    const { 
      fromAccountId, 
      toAccountNumber, 
      amount, 
      description, 
      frequency,
      startDate,
      endDate
    } = req.body;
    
    // Validate inputs
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transfer amount'
      });
    }
    
    if (!['daily', 'weekly', 'monthly', 'quarterly', 'annually'].includes(frequency)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid frequency'
      });
    }
    
    // Extract ID if a display string was sent instead of just the ID
    let accountId = fromAccountId;
    if (typeof fromAccountId === 'string' && !mongoose.Types.ObjectId.isValid(fromAccountId)) {
      console.log("Received display string instead of ID, attempting to extract ID");
      // Try to extract the ID from the frontend display format
      const match = fromAccountId.match(/^[^-]+ - (\d+)/);
      if (match && match[1]) {
        // Look up the account by account number
        const account = await Account.findOne({ accountNumber: match[1], userId });
        if (account) {
          accountId = account._id.toString();
          console.log("Found account by number, using ID:", accountId);
        } else {
          return res.status(400).json({
            success: false,
            message: 'Invalid account ID format'
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid account ID format'
        });
      }
    }
    
    // Check if from account exists and belongs to user
    const fromAccount = await Account.findOne({ _id: accountId, userId });
    if (!fromAccount) {
      return res.status(404).json({
        success: false,
        message: 'Source account not found or does not belong to this user'
      });
    }
    
    // Calculate next execution date
    const startDateObj = new Date(startDate);
    
    // Create recurring transfer record
    const transfer = await Transfer.create({
      userId,
      fromAccount: accountId,
      toAccount: toAccountNumber,
      amount,
      description,
      type: 'recurring',
      status: 'pending',
      frequency,
      startDate: startDateObj,
      endDate: endDate ? new Date(endDate) : null,
      nextExecution: startDateObj
    });
    
    // Generate verification code
    const verificationCode = generateVerificationCode();
    transfer.verificationCode = verificationCode;
    transfer.verificationCodeExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    await transfer.save();
    
    // Send verification email
    const user = await User.findById(userId);
    const emailSent = await sendVerificationEmail(user.email, verificationCode);
    
    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email'
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Recurring transfer scheduled. Please verify with the code sent to your email.',
      transferId: transfer._id
    });
  } catch (error) {
    console.error('Recurring transfer error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error.message
    });
  }
};

// Request verification code for recurring transfer
export const requestRecurringTransferVerification = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fromAccountId, amount } = req.body;
    
    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transfer amount'
      });
    }
    
    // Check if from account exists and belongs to user
    const fromAccount = await Account.findOne({ _id: fromAccountId, userId });
    if (!fromAccount) {
      return res.status(404).json({
        success: false,
        message: 'Source account not found or does not belong to this user'
      });
    }
    
    // Check if account has sufficient funds
    if (fromAccount.balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient funds'
      });
    }
    
    // Create transfer record
    const transfer = await Transfer.create({
      userId,
      fromAccount: fromAccountId,
      toAccount: 'unknown', // Set to 'unknown' initially
      amount,
      description: 'Recurring transfer request',
      type: 'recurring',
      status: 'pending'
    });
    
    // Generate verification code
    const verificationCode = generateVerificationCode();
    transfer.verificationCode = verificationCode;
    transfer.verificationCodeExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    await transfer.save();
    
    // Send verification email
    const user = await User.findById(userId);
    const emailSent = await sendVerificationEmail(user.email, verificationCode);
    
    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email'
      });
    }
    
    res.status(201).json({
      success: true,
      message: 'Recurring transfer request initiated. Please verify with the code sent to your email.',
      transferId: transfer._id
    });
  } catch (error) {
    console.error('Recurring transfer request error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error.message
    });
  }
};

// Process recurring transfers (to be called by a scheduler)
export const processRecurringTransfers = async () => {
  try {
    console.log('Processing recurring transfers...');
    
    // Find all active recurring transfers that are due for execution
    const now = new Date();
    // Set time to beginning of the day for more precise date comparison
    now.setHours(0, 0, 0, 0);
    
    const transfers = await Transfer.find({
      type: 'recurring',
      status: 'active',
      isVerified: true,
      nextExecution: { $lte: now }
    });
    
    console.log(`Found ${transfers.length} recurring transfers to process`);
    
    for (const transfer of transfers) {
      try {
        // Check if end date has passed
        if (transfer.endDate && new Date(transfer.endDate) < now) {
          transfer.status = 'completed';
          await transfer.save();
          console.log(`Recurring transfer ${transfer._id} completed (end date reached)`);
          continue;
        }
        
        // Get source account
        const fromAccount = await Account.findById(transfer.fromAccount);
        if (!fromAccount) {
          console.error(`Source account ${transfer.fromAccount} not found for transfer ${transfer._id}`);
          continue;
        }
        
        // Check balance
        if (fromAccount.balance < transfer.amount) {
          console.error(`Insufficient funds in account ${transfer.fromAccount} for transfer ${transfer._id}`);
          // Update next execution date based on frequency
          transfer.nextExecution = calculateNextExecutionDate(transfer.nextExecution, transfer.frequency);
          await transfer.save();
          
          // Notify user about insufficient funds (you can implement this)
          continue;
        }
        
        // Process the transfer...
        // [existing transfer processing code]
        
        // Update last executed date
        transfer.lastExecuted = now;
        
        // Calculate next execution date
        transfer.nextExecution = calculateNextExecutionDate(transfer.nextExecution, transfer.frequency);
        
        // Keep status as active
        transfer.status = 'active';
        
        await transfer.save();
        console.log(`Processed recurring transfer ${transfer._id}`);
      } catch (err) {
        console.error(`Error processing recurring transfer ${transfer._id}:`, err);
      }
    }
    
    console.log('Finished processing recurring transfers');
  } catch (error) {
    console.error('Error in processRecurringTransfers:', error);
  }
};

// Helper function to calculate next execution date with improved precision
const calculateNextExecutionDate = (currentDate, frequency) => {
  const date = new Date(currentDate);
  // Preserve the original time of day for the execution
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  
  switch (frequency) {
    case 'daily':
      date.setDate(date.getDate() + 1);
      break;
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'monthly':
      // Handle month end cases properly
      const currentMonth = date.getMonth();
      date.setMonth(currentMonth + 1);
      // If the day became smaller, it means we hit month end (e.g., Jan 31 -> Feb 28)
      if (date.getMonth() !== ((currentMonth + 1) % 12)) {
        // Set to last day of previous month
        date.setDate(0);
      }
      break;
    case 'quarterly':
      // Handle quarter end cases properly
      const currentQuarterMonth = date.getMonth();
      date.setMonth(currentQuarterMonth + 3);
      // Check if day is valid in the new month
      if (date.getMonth() !== ((currentQuarterMonth + 3) % 12)) {
        // Set to last day of previous month
        date.setDate(0);
      }
      break;
    case 'annually':
      // Handle Feb 29 in leap years
      const currentYear = date.getFullYear();
      date.setFullYear(currentYear + 1);
      // Check if day is valid in the new month (Feb 29 -> Feb 28 in non-leap years)
      if (date.getMonth() !== currentDate.getMonth()) {
        // Set to last day of the month
        date.setDate(0);
      }
      break;
    default:
      date.setMonth(date.getMonth() + 1); // Default to monthly
  }
  
  // Restore the original time of day
  date.setHours(hours, minutes, seconds, 0);
  
  return date;
};

// Verify transfer with code
export const verifyTransfer = async (req, res) => {
  try {
    const { transferId, code } = req.body;
    
    // Find transfer by ID
    const transfer = await Transfer.findById(transferId).select('+verificationCode +verificationCodeExpires');
    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: 'Transfer not found'
      });
    }
    
    // Check if verification code exists and matches
    if (!transfer.verificationCode || transfer.verificationCode !== code) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }
    
    // Check if verification code has expired
    if (transfer.verificationCodeExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired'
      });
    }
    
    // Mark as verified
    transfer.isVerified = true;
    
    // Process the transfer based on type
    if (transfer.type === 'simple') {
      await processSimpleTransfer(transfer);
    } else if (transfer.type === 'bulk') {
      await processBulkTransfer(transfer);
    } else if (transfer.type === 'recurring') {
      // For recurring transfers, set status to active
      transfer.status = 'active';
      
      // If no nextExecution is set, use the startDate
      if (!transfer.nextExecution && transfer.startDate) {
        transfer.nextExecution = new Date(transfer.startDate);
      }
      
      await transfer.save();
      console.log('Recurring transfer verified and activated:', transfer._id);
    }
    
    res.status(200).json({
      success: true,
      message: 'Transfer verified and processed successfully'
    });
  } catch (error) {
    console.error('Transfer verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error.message
    });
  }
};

// Process simple transfer
const processSimpleTransfer = async (transfer) => {
  // Get source account
  const fromAccount = await Account.findById(transfer.fromAccount);
  
  // Check balance again
  if (fromAccount.balance < transfer.amount) {
    transfer.status = 'failed';
    await transfer.save();
    throw new Error('Insufficient funds');
  }
  
  // Update source account balance
  fromAccount.balance -= transfer.amount;
  
  // Add transaction to source account as "transfer"
  fromAccount.transactions.push({
    description: transfer.description || 'Transfer out',
    category: 'Transfer',
    amount: -transfer.amount,
    type: 'transfer',
    toAccountNumber: transfer.toAccount,
    reference: transfer._id.toString(),
    date: new Date()
  });
  
  await fromAccount.save();
  
  // Try to find destination account in our system
  const toAccount = await Account.findOne({ accountNumber: transfer.toAccount });
  if (toAccount) {
    // If destination account exists in our system, update its balance
    toAccount.balance += transfer.amount;
    
    // Add transaction to destination account as "deposit"
    toAccount.transactions.push({
      description: transfer.description || 'Deposit via transfer',
      category: 'Deposit',
      amount: transfer.amount,
      type: 'deposit',
      fromAccountNumber: fromAccount.accountNumber,
      reference: transfer._id.toString(),
      date: new Date()
    });
    
    await toAccount.save();
  } else {
    // Log external transfer for record keeping
    console.log(`External transfer of ${transfer.amount} to account ${transfer.toAccount}`);
  }
  
  // Mark transfer as completed
  transfer.status = 'completed';
  transfer.isVerified = true;
  await transfer.save();
  
  // Create notification for sender
  await createNotification({
    userId: transfer.userId,
    title: 'Transfer Completed',
    message: `Your transfer of ${transfer.amount} to account ${transfer.toAccount} has been completed.`,
    type: 'transaction',
    relatedItemId: transfer._id,
    relatedItemType: 'transfer'
  });
  
  // If destination account is in our system, notify recipient too
  if (toAccount) {
    const recipientUser = await User.findById(toAccount.userId);
    if (recipientUser) {
      await createNotification({
        userId: recipientUser._id,
        title: 'Funds Received',
        message: `You have received ${transfer.amount} from account ${fromAccount.accountNumber}.`,
        type: 'transaction',
        relatedItemId: transfer._id,
        relatedItemType: 'transfer'
      });
    }
  }
};

// Process bulk transfer
const processBulkTransfer = async (transfer) => {
  // Get source account
  const fromAccount = await Account.findById(transfer.fromAccount);
  
  // Check balance again
  if (fromAccount.balance < transfer.amount) {
    transfer.status = 'failed';
    await transfer.save();
    throw new Error('Insufficient funds');
  }
  
  // Update source account balance
  fromAccount.balance -= transfer.amount;
  
  // Add transaction to source account
  fromAccount.transactions.push({
    description: 'Bulk transfer',
    category: 'Transfer',
    amount: -transfer.amount,
    type: 'transfer',
    reference: transfer._id.toString(),
    date: new Date()
  });
  
  await fromAccount.save();
  
  // Process each beneficiary
  for (const beneficiary of transfer.beneficiaries) {
    // Try to find destination account in our system
    const toAccount = await Account.findOne({ accountNumber: beneficiary.accountNumber });
    if (toAccount) {
      // If destination account exists in our system, update its balance
      toAccount.balance += beneficiary.amount;
      
      // Add transaction to destination account as "deposit"
      toAccount.transactions.push({
        description: beneficiary.description || 'Deposit via bulk transfer',
        category: 'Deposit',
        amount: beneficiary.amount,
        type: 'deposit',
        fromAccountNumber: fromAccount.accountNumber,
        reference: transfer._id.toString(),
        date: new Date()
      });
      
      await toAccount.save();
    } else {
      // Log external transfer for record keeping
      console.log(`External bulk transfer of ${beneficiary.amount} to account ${beneficiary.accountNumber}`);
    }
    
    // Mark beneficiary as completed
    beneficiary.status = 'completed';
  }
  
  // Mark transfer as completed
  transfer.status = 'completed';
  transfer.isVerified = true;
  await transfer.save();
  
  // Create notification for sender
  await createNotification({
    userId: transfer.userId,
    title: 'Bulk Transfer Completed',
    message: `Your bulk transfer of ${transfer.amount} to ${transfer.beneficiaries.length} recipients has been completed.`,
    type: 'transaction',
    relatedItemId: transfer._id,
    relatedItemType: 'transfer'
  });
  
  // Notify recipients if they are in our system
  for (const beneficiary of transfer.beneficiaries) {
    const toAccount = await Account.findOne({ accountNumber: beneficiary.accountNumber });
    if (toAccount) {
      const recipientUser = await User.findById(toAccount.userId);
      if (recipientUser) {
        await createNotification({
          userId: recipientUser._id,
          title: 'Funds Received',
          message: `You have received ${beneficiary.amount} from account ${fromAccount.accountNumber}.`,
          type: 'transaction',
          relatedItemId: transfer._id,
          relatedItemType: 'transfer'
        });
      }
    }
  }
};

// Get user transfers with optional filtering
export const getUserTransfers = async (req, res) => {
  try {
    const userId = req.user._id;
    const { type, status } = req.query;
    
    // Build query
    const query = { userId };
    
    // Add type filter if provided
    if (type) {
      query.type = type;
    }
    
    // Add status filter if provided
    if (status) {
      query.status = status;
    }
    
    // Get transfers
    const transfers = await Transfer.find(query)
      .sort({ createdAt: -1 })
      .populate('fromAccount', 'accountNumber accountType balance currency');
    
    res.status(200).json({
      success: true,
      transfers
    });
  } catch (error) {
    console.error('Get transfers error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error.message
    });
  }
};

// Get a specific transfer
export const getTransferById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { transferId } = req.params;
    
    // Check if transferId is a special filter value
    if (transferId === 'recurring') {
      // Handle recurring transfers specifically
      const transfers = await Transfer.find({ 
        userId, 
        type: 'recurring' 
      }).populate('fromAccount', 'accountNumber accountType');
      
      return res.status(200).json({
        success: true,
        transfers
      });
    }
    
    // Validate that transferId is a valid ObjectId before querying
    if (!mongoose.Types.ObjectId.isValid(transferId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transfer ID format'
      });
    }
    
    // Normal case - find by ID
    const transfer = await Transfer.findOne({ _id: transferId, userId })
      .populate('fromAccount', 'accountNumber accountType');
    
    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: 'Transfer not found'
      });
    }
    
    res.status(200).json({
      success: true,
      transfer
    });
  } catch (error) {
    console.error('Get transfer error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error.message
    });
  }
};

// Cancel a recurring transfer
export const cancelRecurringTransfer = async (req, res) => {
  try {
    const userId = req.user._id;
    const { transferId } = req.params;
    
    const transfer = await Transfer.findOne({ 
      _id: transferId, 
      userId,
      type: 'recurring'
    });
    
    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: 'Recurring transfer not found'
      });
    }
    
    // Mark as cancelled
    transfer.status = 'cancelled';
    await transfer.save();
    
    res.status(200).json({
      success: true,
      message: 'Recurring transfer cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel transfer error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error.message
    });
  }
};






















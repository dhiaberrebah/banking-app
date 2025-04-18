import Loan from '../models/LoanModel.js';
import User from '../models/UserModel.js';
import { sendEmail } from '../utils/Email.js';
import cloudinary from '../utils/Cloudinary.js';
import fs from 'fs';
import { createNotification } from './notificationController.js';

// Create a new loan application
export const createLoanApplication = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      loanType,
      amount,
      term,
      interestRate,
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      postalCode,
      employmentStatus,
      employerName,
      monthlyIncome,
      otherLoans,
      otherLoansAmount,
      purpose,
      additionalInfo
    } = req.body;

    // Validate required fields
    if (!loanType || !amount || !term || !interestRate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required loan details'
      });
    }

    // Process uploaded documents
    const documentUrls = [];
    
    if (req.files) {
      console.log('Uploaded files:', req.files);
      
      // Upload files to Cloudinary
      for (const fieldName in req.files) {
        const file = req.files[fieldName][0];
        try {
          // Upload to Cloudinary
          const result = await cloudinary.uploader.upload(file.path, {
            folder: `banking-app/loans/${userId}`,
            resource_type: 'auto'
          });
          
          documentUrls.push(result.secure_url);
          
          // Delete local file after upload
          fs.unlinkSync(file.path);
        } catch (error) {
          console.error(`Error uploading ${fieldName}:`, error);
        }
      }
    }

    // Create new loan application with document URLs
    const newLoan = await Loan.create({
      userId,
      loanType,
      amount: parseFloat(amount),
      term: parseInt(term),
      interestRate: parseFloat(interestRate),
      status: 'pending',
      applicationDetails: {
        personal: {
          firstName,
          lastName,
          email,
          phone,
          address,
          city,
          postalCode
        },
        employment: {
          status: employmentStatus,
          employerName,
          monthlyIncome: parseFloat(monthlyIncome),
          otherLoans: otherLoans === 'yes',
          otherLoansAmount: otherLoansAmount ? parseFloat(otherLoansAmount) : 0
        },
        purpose,
        additionalInfo
      },
      documents: documentUrls,
      notes: 'Application submitted and pending review'
    });

    // Create notification for the user
    await createNotification({
      userId: userId,
      title: 'Loan Application Submitted',
      message: `Your application for a ${loanType} loan of ${amount} TND has been submitted and is under review.`,
      type: 'loan',
      relatedItemId: newLoan._id,
      relatedItemType: 'loan'
    });

    // Send confirmation email to user
    const user = await User.findById(userId);
    if (user && user.email) {
      await sendEmail({
        to: user.email,
        subject: 'Loan Application Received',
        html: `
          <h1>Loan Application Received</h1>
          <p>Dear ${firstName || user.firstName},</p>
          <p>We have received your application for a ${loanType} loan of ${amount} TND.</p>
          <p>Your application is now under review. We will notify you of any updates.</p>
          <p>Application Reference: ${newLoan._id}</p>
        `
      });
    }

    res.status(201).json({
      success: true,
      message: 'Loan application submitted successfully',
      loanId: newLoan._id,
      loan: {
        id: newLoan._id,
        loanType: newLoan.loanType,
        amount: newLoan.amount,
        term: newLoan.term,
        interestRate: newLoan.interestRate,
        status: newLoan.status,
        createdAt: newLoan.createdAt
      }
    });
  } catch (error) {
    console.error('Create loan application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit loan application',
      error: error.message
    });
  }
};

// Get all loan applications for a user
export const getUserLoans = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const loans = await Loan.find({ userId }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      loans: loans.map(loan => ({
        id: loan._id,
        loanType: loan.loanType,
        amount: loan.amount,
        term: loan.term,
        interestRate: loan.interestRate,
        status: loan.status,
        createdAt: loan.createdAt
      }))
    });
  } catch (error) {
    console.error('Get user loans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve loan applications',
      error: error.message
    });
  }
};

// Get details of a specific loan
export const getLoanById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { loanId } = req.params;
    
    const loan = await Loan.findOne({ _id: loanId, userId });
    
    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Loan application not found'
      });
    }
    
    res.status(200).json({
      success: true,
      loan: {
        id: loan._id,
        loanType: loan.loanType,
        amount: loan.amount,
        term: loan.term,
        interestRate: loan.interestRate,
        status: loan.status,
        applicationDetails: loan.applicationDetails,
        documents: loan.documents,
        notes: loan.notes,
        createdAt: loan.createdAt,
        updatedAt: loan.updatedAt
      }
    });
  } catch (error) {
    console.error('Get loan details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve loan details',
      error: error.message
    });
  }
};


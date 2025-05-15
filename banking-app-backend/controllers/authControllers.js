import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';
import cloudinary from '../utils/Cloudinary.js';
import { GenerateToken } from '../utils/Generatetoken.js';
import { sendVerificationEmail } from '../utils/Email.js';
import PasswordReset from '../models/PasswordResetModel.js';
import { createNotification } from './notificationController.js';

// Generate a random 4-digit verification code
const generateVerificationCode = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};


export const checkAuth = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized' });
    } 

    // Get the complete user object including the role
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Return the complete user object
    res.status(200).json({ 
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        age: user.age,
        gender: user.gender,
        idCardNumber: user.idCardNumber,
        role: user.role,
        accountStatus: user.accountStatus,
        isVerified: user.isVerified
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};  
export const signup = async (req, res) => {
  try {
    const { 
      firstName, 
      lastName, 
      address, 
      phoneNumber, 
      age, 
      gender, 
      email, 
      password, 
      idCardNumber 
    } = req.body;

    // Check if user already exists with the same email
    const existingUserEmail = await User.findOne({ email });
    if (existingUserEmail) {
      return res.status(400).json({ 
        success: false,
        message: 'User with this email already exists' 
      });
    }

    // Check if user already exists with the same phone number
    const existingUserPhone = await User.findOne({ phoneNumber });
    if (existingUserPhone) {
      return res.status(400).json({ 
        success: false,
        message: 'User with this phone number already exists' 
      });
    }

    // Check if user already exists with the same ID card number
    const existingUserIdCard = await User.findOne({ idCardNumber });
    if (existingUserIdCard) {
      return res.status(400).json({ 
        success: false,
        message: 'User with this ID card number already exists' 
      });
    }

    // Debug: Log the request files
    console.log('Request files:', req.files);

    // Handle file uploads if they exist in the request
    let idCardFrontPhotoUrl = '';
    let idCardBackPhotoUrl = '';

    if (req.files) {
      try {
        // Check if we have the front photo
        if (req.files.idCardFrontPhoto && req.files.idCardFrontPhoto.length > 0) {
          const frontPhotoResult = await cloudinary.uploader.upload(
            req.files.idCardFrontPhoto[0].path, 
            {
              folder: 'banking-app/users/id-cards/front',
              resource_type: 'auto'
            }
          );
          idCardFrontPhotoUrl = frontPhotoResult.secure_url;
          console.log('Front photo uploaded:', idCardFrontPhotoUrl);
        } else {
          console.log('No front photo found in request');
        }
        
        // Check if we have the back photo
        if (req.files.idCardBackPhoto && req.files.idCardBackPhoto.length > 0) {
          const backPhotoResult = await cloudinary.uploader.upload(
            req.files.idCardBackPhoto[0].path, 
            {
              folder: 'banking-app/users/id-cards/back',
              resource_type: 'auto'
            }
          );
          idCardBackPhotoUrl = backPhotoResult.secure_url;
          console.log('Back photo uploaded:', idCardBackPhotoUrl);
        } else {
          console.log('No back photo found in request');
        }
      } catch (error) {
        console.error('Error uploading ID card photos:', error);
        return res.status(400).json({ message: 'Error uploading ID card photos' });
      }
    } else {
      console.log('No files in request');
    }

    // Validate that we have the required photo URLs
    if (!idCardFrontPhotoUrl || !idCardBackPhotoUrl) {
      return res.status(400).json({ 
        message: 'ID card photos are required',
        frontPhotoMissing: !idCardFrontPhotoUrl,
        backPhotoMissing: !idCardBackPhotoUrl
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user with all the form fields
    const newUser = await User.create({
      firstName,
      lastName,
      address,
      phoneNumber,
      age,
      gender,
      email,
      password: hashedPassword,
      idCardNumber,
      idCardFrontPhoto: idCardFrontPhotoUrl,
      idCardBackPhoto: idCardBackPhotoUrl,
      accountStatus: 'pending',
      isVerified: false
    });

    // Return success without generating a token or sending verification email
    res.status(201).json({ 
      success: true,
      message: 'User registered successfully. Your account is pending approval.',
      userId: newUser._id 
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Registration failed', 
      error: error.message 
    });
  }
};






export const logout = async (req, res) => {
  try {
    res.clearCookie('jwt');
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Add this function to handle forgot password requests
export const forgotPasswordRequest = async (req, res) => {
  try {
    const { fullName, email, idCardNumber, lastPassword } = req.body;

    // Validate required fields
    if (!fullName || !email || !idCardNumber || !req.file) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address'
      });
    }

    // Verify ID card number matches
    if (user.idCardNumber !== idCardNumber) {
      return res.status(400).json({
        success: false,
        message: 'ID card number does not match our records'
      });
    }

    // Upload ID card photo to cloudinary
    let idCardPhotoUrl = '';
    try {
      if (req.file) {
        const photoResult = await cloudinary.uploader.upload(
          req.file.path,
          {
            folder: 'banking-app/password-reset-requests',
            resource_type: 'auto'
          }
        );
        idCardPhotoUrl = photoResult.secure_url;
      }
    } catch (error) {
      console.error('Error uploading ID card photo:', error);
      return res.status(400).json({ 
        success: false,
        message: 'Error uploading ID card photo' 
      });
    }

    // Check if there's already a pending request
    const existingRequest = await PasswordReset.findOne({ 
      userId: user._id,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending password reset request'
      });
    }

    // Create password reset request
    const passwordResetRequest = await PasswordReset.create({
      userId: user._id,
      fullName,
      email,
      idCardNumber,
      lastPassword: lastPassword || undefined,
      idCardPhoto: idCardPhotoUrl,
      status: 'pending',
      requestDate: new Date()
    });

    // Send notification to admin (you can implement this later)
    // For now, just log it
    console.log(`Password reset request received from ${email}`);

    // Create notification for the user
    await createNotification({
      userId: user._id,
      title: 'Password Reset Requested',
      message: 'Your password reset request has been submitted and is pending approval.',
      type: 'security',
      relatedItemId: passwordResetRequest._id,
      relatedItemType: 'passwordReset'
    });

    res.status(200).json({
      success: true,
      message: 'Password reset request submitted successfully',
      requestId: passwordResetRequest._id
    });
  } catch (error) {
    console.error('Forgot password request error:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: error.message
    });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide email and password' 
      });
    }
    
    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    // Check if account is pending
    if (user.accountStatus === 'pending') {
      return res.status(401).json({ 
        success: false,
        message: 'Your account is pending approval',
        accountStatus: 'pending'
      });
    }
    
    // Check if account is refused
    if (user.accountStatus === 'refused') {
      return res.status(401).json({ 
        success: false,
        message: 'Your account registration has been declined',
        accountStatus: 'refused'
      });
    }
    
    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }
    
    // Generate verification code for login
    const verificationCode = generateVerificationCode();
    console.log(`TESTING - Verification code for ${email}: ${verificationCode}`);
    
    // Save verification code to user
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    await user.save();
    
    // Send verification email
    const emailSent = await sendVerificationEmail(user.email, verificationCode);
    
    if (!emailSent) {
      console.error(`Failed to send verification email to ${user.email}`);
      // Continue with the login process even if email fails, but log the error
    }
    
    // Return success without generating a token yet
    return res.status(200).json({
      success: true,
      message: 'Credentials verified. Please check your email for verification code.',
      userId: user._id,
      requiresVerification: true,
      email: user.email
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Something went wrong',
      error: error.message
    });
  }
};

// Add verification code controller
export const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    
    console.log(`Verifying code for email: ${email}, code: ${code}`);
    
    // Find user by email
    const user = await User.findOne({ email }).select('+verificationCode +verificationCodeExpires');
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
    
    // Clear verification code after successful verification
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();
    
    // Generate JWT token after successful verification
    const token = GenerateToken(user._id, res);
    
    // Return user data and token
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
        age: user.age,
        gender: user.gender,
        idCardNumber: user.idCardNumber,
        role: user.role,
        accountStatus: user.accountStatus,
        isVerified: user.isVerified
      },
      token
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Something went wrong',
      error: error.message
    });
  }
};

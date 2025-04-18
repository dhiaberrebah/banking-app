import SibApiV3Sdk from 'sib-api-v3-sdk';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

// Initialize Brevo API client
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY; // Set your Brevo API key

// Update the API base path to use Brevo's domain
defaultClient.basePath = 'https://api.brevo.com/v3';

// Initialize the transactional email API
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Generic email sending function
export const sendEmail = async (options) => {
  try {
    // Check if API key is set
    if (!process.env.BREVO_API_KEY) {
      console.error('Error sending email: BREVO_API_KEY not set');
      return { success: false, error: 'API key not set' };
    }
    
    console.log('Attempting to send email with Brevo API...');
    
    // Email content and details
    const sender = {
      email: process.env.GMAIL_USER || 'noreply@bankingapp.com',
      name: options.senderName || 'Banking App'
    };
    
    const recipients = [
      {
        email: options.to,
        name: options.recipientName || 'Valued Customer'
      },
    ];
    
    // Create email object
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = sender;
    sendSmtpEmail.to = recipients;
    sendSmtpEmail.subject = options.subject;
    sendSmtpEmail.htmlContent = options.html;
    
    if (options.text) {
      sendSmtpEmail.textContent = options.text;
    }
    
    // Send email
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent successfully to:', options.to);
    return { success: true, info: response };
  } catch (error) {
    console.error('Error sending email:', error.message);
    if (error.response) {
      console.error('Brevo API error details:', error.response.body);
    }
    return { success: false, error };
  }
};

// Verification email function using the generic sendEmail
export const sendVerificationEmail = async (email, code) => {
  try {
    console.log(`Attempting to send verification email to ${email} with code ${code}`);
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333;">Email Verification</h2>
        <p>Thank you for using our Banking App. To complete your login, please use the verification code below:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
          <h1 style="margin: 0; color: #4a6ee0; letter-spacing: 5px;">${code}</h1>
        </div>
        <p>This code will expire in 30 minutes.</p>
        <p>If you did not request this verification, please ignore this email or contact support immediately.</p>
        <p>Best regards,<br>Banking App Team</p>
      </div>
    `;
    
    const textContent = `Your verification code is: ${code}. This code will expire in 30 minutes.`;
    
    const result = await sendEmail({
      to: email,
      subject: 'Your Banking App Verification Code',
      html: htmlContent,
      text: textContent,
      senderName: 'Banking App',
      recipientName: 'Valued Customer'
    });
    
    if (result.success) {
      console.log(`Verification email sent successfully to ${email}`);
      return true;
    } else {
      console.error(`Failed to send verification email to ${email}:`, result.error);
      return false;
    }
  } catch (error) {
    console.error(`Exception when sending verification email to ${email}:`, error);
    return false;
  }
};

// Add a password reset email function
export const sendPasswordResetEmail = async (email, code) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #333;">Password Reset Request</h2>
      <p>We received a request to reset your password. Please use the verification code below:</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
        <h1 style="margin: 0; color: #4a6ee0; letter-spacing: 5px;">${code}</h1>
      </div>
      <p>This code will expire in 30 minutes.</p>
      <p>If you did not request this password reset, please ignore this email or contact support.</p>
      <p>Best regards,<br>Banking App Team</p>
    </div>
  `;
  
  const textContent = `Your password reset code is: ${code}. This code will expire in 30 minutes.`;
  
  const result = await sendEmail({
    to: email,
    subject: 'Your Banking App Password Reset Code',
    html: htmlContent,
    text: textContent,
    senderName: 'Banking App',
    recipientName: 'Valued Customer'
  });
  
  return result.success;
};

// Account approval email with login credentials
export const sendAccountApprovalEmail = async (email, firstName, tempPassword) => {
  try {
    console.log(`Attempting to send account approval email to ${email}`);
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333;">Account Approved!</h2>
        <p>Dear ${firstName},</p>
        <p>Congratulations! Your Banking App account has been approved. You can now log in to access all features.</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #4a6ee0;">Your Login Credentials</h3>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Temporary Password:</strong> ${tempPassword}</p>
        </div>
        
        <p><strong>Important:</strong> For security reasons, please change your password immediately after logging in.</p>
        
        <p>If you have any questions or need assistance, please contact our support team.</p>
        
        <p>Best regards,<br>Banking App Team</p>
      </div>
    `;
    
    const textContent = `
      Account Approved!
      
      Dear ${firstName},
      
      Congratulations! Your Banking App account has been approved. You can now log in to access all features.
      
      Your Login Credentials:
      Email: ${email}
      Temporary Password: ${tempPassword}
      
      Important: For security reasons, please change your password immediately after logging in.
      
      If you have any questions or need assistance, please contact our support team.
      
      Best regards,
      Banking App Team
    `;
    
    const result = await sendEmail({
      to: email,
      subject: 'Your Banking App Account Has Been Approved',
      html: htmlContent,
      text: textContent,
      senderName: 'Banking App',
      recipientName: firstName
    });
    
    if (result.success) {
      console.log(`Account approval email sent successfully to ${email}`);
      return true;
    } else {
      console.error(`Failed to send account approval email to ${email}:`, result.error);
      return false;
    }
  } catch (error) {
    console.error(`Exception when sending account approval email to ${email}:`, error);
    return false;
  }
};

// Add a verification email function if it doesn't exist
export const sendPasswordChangeVerificationEmail = async (email, code) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <h2 style="color: #333;">Password Change Verification</h2>
      <p>You requested to change your password. Please use the verification code below:</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
        <h1 style="margin: 0; color: #4a6ee0; letter-spacing: 5px;">${code}</h1>
      </div>
      <p>This code will expire in 30 minutes.</p>
      <p>If you did not request this password change, please ignore this email or contact support.</p>
      <p>Best regards,<br>Banking App Team</p>
    </div>
  `;
  
  const textContent = `Your password change verification code is: ${code}. This code will expire in 30 minutes.`;
  
  const result = await sendEmail({
    to: email,
    subject: 'Your Banking App Password Change Verification Code',
    html: htmlContent,
    text: textContent,
    senderName: 'Banking App',
    recipientName: 'Valued Customer'
  });
  
  return result.success;
};

import express from 'express';
import { body, validationResult } from 'express-validator';
import Contact from '../models/Contact.js';
import { generateChatbotResponse } from '../controllers/chatbotController.js';

const router = express.Router();

// Add this at the top of your routes file, before other routes
router.get('/test', (req, res) => {
  res.status(200).json({ message: 'Support routes are working!' });
});

// Contact form submission endpoint with validation
router.post('/contact', [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('email').isEmail().withMessage('Please enter a valid email address'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array()
      });
    }

    const { firstName, lastName, email, subject, message } = req.body;
    
    // Save to database
    const newContact = new Contact({
      firstName,
      lastName,
      email,
      subject,
      message
    });
    
    await newContact.save();
    
    res.status(200).json({
      success: true,
      message: "Your message has been sent successfully. We'll get back to you soon."
    });
  } catch (error) {
    console.error("Error in contact form submission:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process your request. Please try again later."
    });
  }
});

// Add this route for chatbot functionality
router.post('/chatbot', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }
    
    // Call your OpenAI integration function here
    const response = await generateChatbotResponse(message);
    
    res.status(200).json({
      success: true,
      response
    });
  } catch (error) {
    console.error("Error in chatbot:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process your request. Please try again later."
    });
  }
});

export default router;






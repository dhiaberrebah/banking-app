import express from 'express';
import { 
  signup, 
  login, 
  logout, 
  checkAuth, 
  verifyCode, 
  forgotPasswordRequest,
  
} from '../controllers/authControllers.js';
import upload from '../middleware/multer.js';

const router = express.Router();

// Define file upload fields for ID card photos
const idCardUpload = upload.fields([
  { name: 'idCardFrontPhoto', maxCount: 1 },
  { name: 'idCardBackPhoto', maxCount: 1 }
]);

// Auth routes
router.post('/signup', idCardUpload, signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/checkAuth', checkAuth);
router.post('/verify-code', verifyCode);
router.post('/forgot-password', forgotPasswordRequest);

export default router;  

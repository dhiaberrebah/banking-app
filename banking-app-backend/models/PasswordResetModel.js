import mongoose from 'mongoose';

const passwordResetSchema = mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  fullName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  idCardNumber: { 
    type: String, 
    required: true 
  },
  lastPassword: { 
    type: String
  },
  idCardPhoto: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  requestDate: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema);

export default PasswordReset;

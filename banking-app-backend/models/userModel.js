import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  idCardNumber: { type: String, required: true },
  idCardFrontPhoto: { type: String, required: true },
  idCardBackPhoto: { type: String, required: true },
  role: { type: String, default: 'user' },
  isOnline: { type: Boolean, default: false },
  bankAccountList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }],
  accountStatus: { type: String, enum: ['pending', 'approved', 'refused'], default: 'pending' },
  verificationCode: {
    type: String,
    select: false // Not included in query results by default for security
  },
  verificationCodeExpires: {
    type: Date,
    select: false
  },
  isVerified: {
    type: Boolean,
    default: true  // Changed from false to true
  },
  passwordChangeRequired: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;







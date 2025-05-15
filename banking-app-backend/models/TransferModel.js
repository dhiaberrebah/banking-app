import mongoose from 'mongoose';

const transferSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fromAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  toAccount: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: 'Transfer'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'active', 'cancelled'],
    default: 'pending'
  },
  type: {
    type: String,
    enum: ['simple', 'bulk', 'recurring'],
    required: true
  },
  // For recurring transfers
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'quarterly', 'annually'],
    required: function() { return this.type === 'recurring'; }
  },
  startDate: {
    type: Date,
    required: function() { return this.type === 'recurring'; }
  },
  endDate: {
    type: Date,
    required: function() { return this.type === 'recurring'; }
  },
  lastExecuted: {
    type: Date
  },
  nextExecution: {
    type: Date
  },
  // For bulk transfers
  beneficiaries: [{
    name: String,
    accountNumber: String,
    amount: Number,
    description: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    }
  }],
  verificationCode: {
    type: String,
    select: false
  },
  verificationCodeExpires: {
    type: Date,
    select: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Transfer = mongoose.model('Transfer', transferSchema);

export default Transfer;

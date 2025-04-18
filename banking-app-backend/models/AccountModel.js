import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'transfer'],
    required: true
  },
  fromAccountNumber: {
    type: String
  },
  toAccountNumber: {
    type: String
  },
  reference: {
    type: String
  }
});

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  accountNumber: {
    type: String,
    unique: true,
    default: () => Math.floor(Math.random() * 9000000000) + 1000000000
  },
  accountType: {
    type: String,
    required: true,
    enum: ['current', 'savings']
  },
  currency: {
    type: String,
    required: true,
    default: 'TND'
  },
  balance: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'active', 'frozen', 'closed'],
    default: 'pending'
  },
  rejectionReason: {
    type: String
  },
  transactions: [transactionSchema],
  applicationDetails: {
    personal: {
      firstName: String,
      lastName: String,
      dateOfBirth: String,
      nationality: String,
      idType: String,
      idNumber: String
    },
    contact: {
      email: String,
      phone: String,
      address: String,
      city: String,
      postalCode: String
    },
    employment: {
      status: String,
      employerName: String,
      jobTitle: String,
      monthlyIncome: Number
    },
    documents: {
      idDocument: String,
      proofOfAddress: String,
      proofOfIncome: String
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Account = mongoose.model('Account', accountSchema);

export default Account;




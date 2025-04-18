import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  loanType: {
    type: String,
    required: true,
    enum: ['personal', 'auto', 'mortgage', 'education', 'business']
  },
  amount: {
    type: Number,
    required: true
  },
  term: {
    type: Number,
    required: true
  },
  interestRate: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'active', 'closed'],
    default: 'pending'
  },
  applicationDetails: {
    personal: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      postalCode: String
    },
    employment: {
      status: String,
      employerName: String,
      monthlyIncome: Number,
      otherLoans: Boolean,
      otherLoansAmount: Number
    },
    purpose: String,
    additionalInfo: String
  },
  documents: [String],
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date
  }
});

const Loan = mongoose.model('Loan', loanSchema);

export default Loan;
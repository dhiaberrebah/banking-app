import mongoose from 'mongoose';

const notificationSchema = mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['transaction', 'security', 'account', 'promotion', 'loan', 'transfer'],
    required: true 
  },
  relatedItemId: { 
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  relatedItemType: {
    type: String,
    enum: ['account', 'transfer', 'loan', 'passwordReset', 'transaction'],
    default: null
  },
  read: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Index for faster queries
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
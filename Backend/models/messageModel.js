import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"]
  },
  email: {
    type: String,
    required: [true, "Please enter your email"]
  },
  phone: {
    type: String,
    required: [true, "Please enter your phone number"]
  },
  message: {
    type: String,
    required: [true, "Please enter your message"]
  },
  status: {
    type: String,
    enum: ['read', 'unread'],
    default: 'unread'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.model('Message', messageSchema);

export default Message; 
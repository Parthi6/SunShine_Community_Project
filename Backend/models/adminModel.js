import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter admin name'],
    maxLength: [30, 'Name cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter admin email'],
    unique: true,
    validate: {
      validator: function(v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: 'Please enter a valid email'
    }
  },
  password: {
    type: String,
    required: [true, 'Please enter admin password'],
    minLength: [8, 'Password should be at least 8 characters long'],
    select: false
  },
  role: {
    type: String,
    default: 'admin'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  console.log('Hashing password for admin:', this.email);
  this.password = await bcrypt.hash(this.password, 10);
  console.log('Password hashed successfully');
  next();
});

// Compare password method
adminSchema.methods.comparePassword = async function(enteredPassword) {
  console.log('Stored hashed password:', this.password);
  console.log('Entered password:', enteredPassword);
  const result = await bcrypt.compare(enteredPassword, this.password);
  console.log('Password comparison result:', result);
  return result;
};

// Generate JWT Token
adminSchema.methods.getJWTToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Export as "Admin" (this will create a collection named "admins")
export default mongoose.model('Admin', adminSchema); 
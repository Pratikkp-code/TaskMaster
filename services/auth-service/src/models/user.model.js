import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // 1. IMPORT BCRYPTJS HERE

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// --- CORRECTED MIDDLEWARE ---
// This function runs automatically BEFORE a user document is saved
UserSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // 2. Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    // 3. Assign the hashed password back to the document
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error); // Pass any errors to the next middleware
  }
});

// --- CORRECTED CUSTOM METHOD ---
// This adds a new method to every user document
UserSchema.methods.isPasswordCorrect = async function (password) {
  // Compares the provided password with the stored hashed password
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', UserSchema);

export default User;
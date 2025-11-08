import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Configurable salt rounds for bcrypt (use .env BCRYPT_ROUNDS), default to 12
const SALT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS, 10) || 12;

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  name: { 
    type: String, 
    required: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  purchasedGames: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Game' 
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
    // Si la contraseña ya tiene formato bcrypt, no volver a hashearla.
    if (typeof this.password === 'string' && /^\$2[aby]\$/.test(this.password)) {
      return next();
    }
  
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};


export default mongoose.model('User', userSchema);
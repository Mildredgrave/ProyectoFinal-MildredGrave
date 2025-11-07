import mongoose from 'mongoose';

const scoreSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  game: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Game', 
    required: true 
  },
  score: { 
    type: Number, 
    required: true,
    min: 0
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
});

scoreSchema.index({ game: 1, score: -1 });

export default mongoose.model('Score', scoreSchema);
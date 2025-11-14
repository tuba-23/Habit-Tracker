import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  category: { type: String, default: '' },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    default: 'daily',
  },
  completions: [{ date: { type: Date, default: Date.now } }],
  weirdnessScore: { type: Number, default: 0 },
  group: { type: String, default: 'Speedster' },
  aiComment: { type: String },
  streak: { type: Number, default: 0 },
  xpEarned: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Habit', habitSchema);
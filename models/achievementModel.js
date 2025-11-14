// models/achievementModel.js
import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true }, // e.g., "Streak Master"
  description: { type: String },
  xpReward: { type: Number, default: 50 },
  unlockedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Achievement', achievementSchema);
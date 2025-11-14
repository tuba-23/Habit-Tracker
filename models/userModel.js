import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  passkeyId: {
    type: String,
    unique: true,
    sparse: true,
  },
  profile: {
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    group: { 
      type: String, 
      enum: ["Regular", "Early Bird", "Night Owl", "Speedster", "Binge Master", "Consistency Champ"],
      default: "Regular" 
    },
    avatar: { type: String, default: "default-avatar" },
    accessories: [String],
  },
  stats: {
    totalHabits: { type: Number, default: 0 },
    completedHabits: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  xp: { type: Number, default: 0 },
});

// Update timestamp on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("User", userSchema);
import express from "express";
import User from "../models/userModel.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find()
      .select("username profile.level profile.xp profile.avatar stats")
      .sort({ "profile.xp": -1 })
      .limit(100);

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      username: user.username,
      level: user.profile.level,
      xp: user.profile.xp,
      avatar: user.profile.avatar,
      stats: user.stats,
    }));

    res.json({ success: true, leaderboard });
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch leaderboard" 
    });
  }
});

export default router;
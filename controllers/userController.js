import User from "../models/userModel.js";

export async function getProfile(req, res) {
  try {
    const user = await User.findById(req.userId).select("-passkeyId");
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: "User not found" 
      });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to fetch profile" 
    });
  }
}

export async function updateProfile(req, res) {
  try {
    const { avatar, accessories } = req.body;
    
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: "User not found" 
      });
    }

    if (avatar) user.profile.avatar = avatar;
    if (accessories) user.profile.accessories = accessories;

    await user.save();

    res.json({ 
      success: true, 
      user: {
        id: user._id,
        username: user.username,
        profile: user.profile,
      }
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to update profile" 
    });
  }
}

export async function addXP(userId, xpAmount) {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    user.profile.xp += xpAmount;

    // Level up logic (100 XP per level)
    const newLevel = Math.floor(user.profile.xp / 100) + 1;
    if (newLevel > user.profile.level) {
      user.profile.level = newLevel;
    }

    await user.save();
    return user;
  } catch (error) {
    console.error("Add XP error:", error);
    return null;
  }
}
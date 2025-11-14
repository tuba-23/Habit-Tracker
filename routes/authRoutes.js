import express from "express";
import { 
  startPasskeyRegistration, 
  finishPasskeyRegistration,
  startPasskeyLogin, 
  finishPasskeyLogin 
} from "../services/passkeyService.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// Start passkey registration
router.post("/passkeys/register/start", async (req, res) => {
  try {
    const { userId, username, email } = req.body;
    
    if (!userId || !username) {
      return res.status(400).json({ 
        success: false, 
        error: "userId and username are required" 
      });
    }
    
    const options = await startPasskeyRegistration(userId, username);
    res.json({ success: true, options });
  } catch (err) {
    console.error("Register start error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Finish passkey registration
router.post("/passkeys/register/finish", async (req, res) => {
  try {
    const credential = req.body;
    const result = await finishPasskeyRegistration(credential);
    
    // Set cookie with token
    res.cookie('hanko', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.json({ 
      success: true, 
      token: result.token,
      user: result.user 
    });
  } catch (err) {
    console.error("Register finish error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start passkey login
router.post("/passkeys/login/start", async (req, res) => {
  try {
    const options = await startPasskeyLogin();
    res.json({ success: true, options });
  } catch (err) {
    console.error("Login start error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Finish passkey login
router.post("/passkeys/login/finish", async (req, res) => {
  try {
    const assertion = req.body;
    const result = await finishPasskeyLogin(assertion);
    
    // Set cookie with token
    res.cookie('hanko', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.json({ 
      success: true, 
      token: result.token,
      user: result.user 
    });
  } catch (err) {
    console.error("Login finish error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get current user info
router.get("/me", isAuthenticated, async (req, res) => {
  try {
    // You can fetch additional user data from your database here
    // For now, return the user info from the JWT payload
    res.json({ 
      success: true,
      user: {
        id: req.userId,
        ...req.user
      }
    });
  } catch (err) {
    console.error("Get user error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie('hanko');
  res.json({ success: true, message: "Logged out successfully" });
});

export default router;
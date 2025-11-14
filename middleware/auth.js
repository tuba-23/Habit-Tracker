// middleware/auth.js
import * as jose from 'jose';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
dotenv.config();

const JWKS = jose.createRemoteJWKSet(new URL(`${process.env.HANKO_API_URI}/.well-known/jwks.json`));

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per IP
  message: 'Too many authentication attempts, please try again later.',
});

export async function isAuthenticated(req, res, next) {
  let token = req.headers.authorization?.split(' ')[1] || req.cookies?.hanko;
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized – no token' });
  }

  try {
    const { payload } = await jose.jwtVerify(token, JWKS);
    req.userId = payload.sub;
    req.user = payload;
    next();
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(401).json({ success: false, message: 'Unauthorized – invalid token' });
  }
}

export async function refreshToken(req, res) {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ success: false, message: 'No refresh token' });
  }

  try {
    const { payload } = await jose.jwtVerify(refreshToken, JWKS);
    const newAccessToken = await generateAccessToken(payload.sub);
    res.cookie('hanko', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ success: true, token: newAccessToken });
  } catch (err) {
    res.clearCookie('refreshToken');
    return res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
}

async function generateAccessToken(userId) {
  // Implement token generation logic with Hanko or JWT
  return 'new-access-token'; // Placeholder
}
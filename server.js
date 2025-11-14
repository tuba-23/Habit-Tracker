import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Server } from 'socket.io';
import http from 'http';
import cron from 'node-cron';
import sanitize from 'sanitize-html';
import connectDB from './db.js';
import { isAuthenticated } from './middleware/auth.js';
import authRoutes from './routes/authRoutes.js';
import habitRoutes from './routes/habitRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import statusRouter from './routes/index.js';

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL || 'http://localhost:3000'],
    credentials: true,
  },
});

const PORT = process.env.PORT || 8080;
connectDB();

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://passkeys.hanko.io'],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'", process.env.HANKO_API_URI, process.env.FRONTEND_URL],
    },
  },
}));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'Too many requests from this IP, please try again after 15 minutes',
}));

app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:3000'],
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));
app.use((req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitize(req.body[key]);
      }
    });
  }
  next();
});

io.on('connection', (socket) => {
  socket.on('joinUserRoom', (userId) => {
    socket.join(userId);
  });
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.set('io', io);
cron.schedule('0 0 * * *', () => {
  updateDailyTasksAndRankings().catch(console.error);
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.use('/api/auth', authRoutes);
app.use('/api', statusRouter);
app.use('/api/habits', isAuthenticated, habitRoutes);
app.use('/api/leaderboard', isAuthenticated, leaderboardRoutes);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
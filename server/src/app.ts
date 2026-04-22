import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';

// Load Config
dotenv.config();
connectDB();

const app = express();

// Required for express-rate-limit to work correctly behind Render/Vercel proxies
app.set('trust proxy', 1);

const httpServer = createServer(app);

// Socket.io Setup
const io = new Server(httpServer, {
  cors: {
    origin: [
      'http://localhost:3000',
      'https://collaborative-task-manager-five.vercel.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://collaborative-task-manager-five.vercel.app',
    ],
    credentials: true,
  })
);
app.use(express.json());

// Rate Limiting — protect auth routes from brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                   // max 20 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});

// ROUTE HANDLERS
app.use('/api/users', authLimiter, userRoutes);
app.use('/api/tasks', taskRoutes);

// Basic Health Check Route
app.get('/', (req, res) => {
  res.send('API is running live!');
});

// Socket Connection Event
io.on('connection', (socket) => {
  socket.on('disconnect', () => {});
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export { io };
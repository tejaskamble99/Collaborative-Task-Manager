import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes'; 
import taskRoutes from './routes/taskRoutes';

// Load Config
dotenv.config();
connectDB();

const app = express();
const httpServer = createServer(app);

// Socket.io Setup (The "Real-Time" Link)
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:3000",                            // Localhost
      "https://collaborative-task-manager-five.vercel.app" // 👈 YOUR VERCEL DOMAIN
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",                         // 👈 YOUR LOCAL HOST
    "https://collaborative-task-manager-five.vercel.app" // 👈 YOUR VERCEL DOMAIN
  ],
  credentials: true
}));
app.use(express.json());

// ROUTE HANDLERS
app.use('/api/users', userRoutes); 
app.use('/api/tasks', taskRoutes);

// Basic Test Route
app.get('/', (req, res) => {
  res.send('API is running live!');
});

// Socket Connection Event
io.on('connection', (socket) => {
  console.log('⚡ User Connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User Disconnected');
  });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export { io };
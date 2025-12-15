import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes'; // <-- ADDED

// Load Config
dotenv.config();
connectDB();

const app = express();
const httpServer = createServer(app);

// Socket.io Setup (The "Real-Time" Link)
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Allow Frontend (Vite)
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// ROUTE HANDLERS
app.use('/api/users', userRoutes); // <-- ADDED

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
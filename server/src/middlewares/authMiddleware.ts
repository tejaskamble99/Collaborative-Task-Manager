import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: {
    _id: string;
    email: string;
  };
}

const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  // DEBUG LOGS (Check your terminal for these!)
  console.log("1. Full Authorization Header:", req.headers.authorization);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      
      console.log("2. Extracted Token:", token); // <--- THIS WILL SHOW THE PROBLEM

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123') as JwtPayload;

      // Get user from the token
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      
      req.user = { _id: user._id.toString(), email: user.email };
      next();
    } catch (error) {
      console.error("JWT Error:", error); // Print the full error
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export { protect };
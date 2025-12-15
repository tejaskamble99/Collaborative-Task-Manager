import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { RegisterSchema, LoginSchema } from '../dtos/UserDto';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  register = async (req: Request, res: Response) => {
    try {
      // 1. Validate Input using Zod (DTO Requirement)
      const validatedData = RegisterSchema.parse(req.body);

      // 2. Call Service
      const result = await this.userService.register(validatedData);

      // 3. Send Success Response
      res.status(201).json(result);
    } catch (error: any) {
      // Handle Zod or Service errors
      res.status(400).json({ message: error.message || "Registration failed" });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const validatedData = LoginSchema.parse(req.body);
      const result = await this.userService.login(validatedData);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(401).json({ message: error.message || "Invalid credentials" });
    }
  };
}
import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import {
  RegisterSchema,
  LoginSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
} from '../dtos/UserDto';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  register = async (req: Request, res: Response) => {
    try {
      const validatedData = RegisterSchema.parse(req.body);
      const result = await this.userService.register(validatedData);
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Registration failed' });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const validatedData = LoginSchema.parse(req.body);
      const result = await this.userService.login(validatedData);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(401).json({ message: error.message || 'Invalid credentials' });
    }
  };

  forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = ForgotPasswordSchema.parse(req.body);
      await this.userService.forgotPassword(email);

      // Always return 200 — never reveal whether the email exists
      return res.status(200).json({ message: 'If that email is registered, a reset link has been sent.' });
    } catch (error: any) {
      // Only expose generic error (e.g. email send failure)
      return res.status(500).json({ message: 'Could not send reset email. Try again later.' });
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const { token, password } = ResetPasswordSchema.parse(req.body);
      await this.userService.resetPassword(token, password);
      return res.status(200).json({ message: 'Password reset successfully' });
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Reset failed' });
    }
  };
}
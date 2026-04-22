import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { RegisterDto, LoginDto } from './../dtos/UserDto';
import { UserRepository } from './../repositories/UserRepository';

export class UserService {
  private userRepo = new UserRepository();

  constructor() {
    this.userRepo = new UserRepository();
  }

  private generateToken(id: string) {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
      expiresIn: '30d',
    });
  }

  private getMailTransporter() {
    // Uses env vars — configure with Gmail, Mailtrap, Resend, etc.
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async register(data: RegisterDto) {
    const existingUser = await this.userRepo.findByEmail(data.email);
    if (existingUser) throw new Error('User already exists');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const newUser = await this.userRepo.create({ ...data, password: hashedPassword });

    return {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      token: this.generateToken(newUser._id.toString()),
    };
  }

  async login(data: LoginDto) {
    const user = await this.userRepo.findByEmail(data.email);
    if (!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new Error('Invalid Credentials');

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: this.generateToken(user._id.toString()),
    };
  }

  async forgotPassword(email: string) {
    const user = await this.userRepo.findByEmail(email);

    // Silently return if user not found — avoids leaking which emails exist
    if (!user) return;

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Save hashed token + 1-hour expiry to DB
    await this.userRepo.setResetToken(
      user._id.toString(),
      hashedToken,
      new Date(Date.now() + 60 * 60 * 1000) // 1 hour
    );

    // Build reset URL — points to Next.js reset page with the plain token
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const resetUrl = `${clientUrl}/reset-password?token=${resetToken}`;

    const transporter = this.getMailTransporter();
    await transporter.sendMail({
      from: `"TaskFlow" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: 'Reset your TaskFlow password',
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
          <h2>Password Reset Request</h2>
          <p>Hi ${user.name},</p>
          <p>Click the button below to reset your password. This link expires in <strong>1 hour</strong>.</p>
          <a href="${resetUrl}"
             style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none;font-weight:600;margin:16px 0;">
            Reset Password
          </a>
          <p style="color:#6b7280;font-size:12px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });
  }

  async resetPassword(plainToken: string, newPassword: string) {
    // Hash the incoming token to compare with what's stored in DB
    const hashedToken = crypto.createHash('sha256').update(plainToken).digest('hex');

    const user = await this.userRepo.findByResetToken(hashedToken);

    if (!user) throw new Error('Reset link is invalid or has expired');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await this.userRepo.resetPassword(user._id.toString(), hashedPassword);
  }
}
import User from '../models/User';
import { RegisterDto } from './../dtos/UserDto';

export class UserRepository {
  async findByEmail(email: string) {
    return await User.findOne({ email });
  }

  async create(userData: RegisterDto & { password: string }) {
    return await User.create(userData);
  }

  async setResetToken(userId: string, hashedToken: string, expiry: Date) {
    return await User.findByIdAndUpdate(userId, {
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: expiry,
    });
  }

  async findByResetToken(hashedToken: string) {
    return await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: new Date() }, // token must not be expired
    });
  }

  async resetPassword(userId: string, hashedPassword: string) {
    return await User.findByIdAndUpdate(userId, {
      password: hashedPassword,
      resetPasswordToken: null,    // invalidate token after use
      resetPasswordExpiry: null,
    });
  }
}
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { RegisterDto, LoginDto } from "./../dtos/UserDto";
import { UserRepository } from './../repositories/UserRepository';


export class UserService {
  private userRepo = new UserRepository();

  constructor() {
    this.userRepo = new UserRepository();
  }

  private generateToken(id: string) {
    return jwt.sign({ id }, process.env.JWT_SECRET || "secret12345", {
      expiresIn: "30d",
    });
  }

  async register(data: RegisterDto) {
    const existingUser = await this.userRepo.findByEmail(data.email);
    if (existingUser) {
      throw new Error("User already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);
    const newUser = await this.userRepo.create({
      ...data,
      password: hashedPassword,
    });
    return {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      token: this.generateToken(newUser._id.toString()),
    };
  }

  async login(data: LoginDto) {
    const user = await this.userRepo.findByEmail(data.email);
    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new Error("Invalid Credentials");
    }
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      token: this.generateToken(user._id.toString()),
    };
  }
}

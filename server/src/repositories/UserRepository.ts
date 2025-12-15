import User from "../models/User";
import { RegisterDto, LoginDto } from "./../dtos/UserDto";

export class UserRepository {
    async findByEmail(email: string) {
        return await User.findOne({ email });
    }
    async create(userData: RegisterDto) {
        return await User.create(userData);
    }
}
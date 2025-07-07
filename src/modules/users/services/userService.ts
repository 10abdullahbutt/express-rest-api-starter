import { User, IUser } from '../models/User';

export class UserService {
  static async createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return await user.save();
  }

  static async getAllUsers(): Promise<IUser[]> {
    return await User.find({ isActive: true }).sort({ createdAt: -1 });
  }

  static async getUserById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  static async getUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email, isActive: true });
  }

  static async updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
  }

  static async deleteUser(id: string): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );
  }

  static async hardDeleteUser(id: string): Promise<IUser | null> {
    return await User.findByIdAndDelete(id);
  }
} 
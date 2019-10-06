import { DatabaseProvider } from "../database";
import { User } from "../models/user";

export class UserService {
  // public async getById(id: number): Promise<User> {
  //   const connection = await DatabaseProvider.getConnection();
  //   return await connection.getRepository(User).findOne(id);
  // }

  public async list(): Promise<User[]> {
    const connection = await DatabaseProvider.getConnection();
    return await connection.getRepository(User).find();
  }
}

export const userService = new UserService();

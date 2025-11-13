import { User } from 'src/entities/user.entity';
import {
  CreateUserParams,
  FindAllUsersParams,
  FindAllUsersResult,
  UpdateUserParams,
} from '../types/user-service.types';

export interface IUserService {
  create(params: CreateUserParams): Promise<User>;
  findAll(params: FindAllUsersParams): Promise<FindAllUsersResult>;
  findOne(id: number): Promise<User>;
  findByEmail(email: string): Promise<User>;
  update(id: number, params: UpdateUserParams): Promise<User>;
  remove(id: number): Promise<void>;
}

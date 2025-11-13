import { User } from 'src/entities/user.entity';
import {
  CreateUserParams,
  UpdateUserParams,
  FindUsersParams,
  UserPaginationResult,
} from '../types/user-service.types';

export interface IUsersService {
  create(params: CreateUserParams): Promise<User>;
  findAll(params: FindUsersParams): Promise<UserPaginationResult>;
  findOne(id: number): Promise<User>;
  update(params: UpdateUserParams): Promise<User>;
  remove(id: number): Promise<void>;
  softRemove(id: number, deletedById: number): Promise<void>;
}

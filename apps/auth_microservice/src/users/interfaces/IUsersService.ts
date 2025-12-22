import { User, UserRole } from 'src/entities/user.entity';
import {
  CreateUserParams,
  UpdateUserParams,
  FindUsersParams,
  UserResult,
} from '../types/user-service.types';
import { PaginationResult } from 'src/common/types/service.types';
import { EntityManager } from 'typeorm';

export interface IUsersService {
  create(
    params: CreateUserParams,
    createdById?: number,
    transactionalEntityManager?: EntityManager,
  ): Promise<UserResult>;
  findAll(params: FindUsersParams): Promise<PaginationResult<UserResult>>;
  findOne(id: number): Promise<UserResult>;
  findByEmail(email: string): Promise<UserResult>;
  update(params: UpdateUserParams): Promise<UserResult>;
  remove(id: number): Promise<void>;
  softRemove(id: number, deletedById: number): Promise<void>;
}

import {
  CreateProfileParams,
  UpdateProfileParams,
} from '../types/profile-params.types';

export interface IProfilesService {
  create(createProfileDto: CreateProfileParams);
  findOne(id: number);
  update(id: number, updateProfileDto: UpdateProfileParams);
  remove(id: number);
  findByUserId(userId: number);
}

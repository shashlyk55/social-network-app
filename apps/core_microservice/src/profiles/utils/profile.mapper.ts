import { Injectable } from '@nestjs/common';
import { FullRegisterDto } from 'src/auth/dto/full-register.dto';
import { Profile } from 'src/entities/profile.entity';
import { ProfileResponseDto } from '../dto/profile-response.dto';
import {
  CreateProfileParams,
  UpdateProfileParams,
} from '../types/profile-params.types';
import { ProfileResult } from 'src/auth/types/auth-params.types';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@Injectable()
export class ProfileMapper {
  static toCreateParams(
    dto: FullRegisterDto,
    userId: number,
  ): CreateProfileParams {
    return {
      userId: userId,
      username: dto.username,
      displayName: dto.displayName,
      birthday: new Date(dto.birthday),
      bio: dto.bio,
      avatarUrl: dto.avatarUrl,
      isPublic: dto.isPublic ?? true,
      createdById: userId,
    };
  }

  static toUpdateParams(dto: UpdateProfileDto, userId: number) {
    const params: UpdateProfileParams = {
      updatedById: userId,
      avatarUrl: dto.avatarUrl,
      bio: dto.bio,
      birthday: dto.birthday ? new Date(dto.birthday) : null,
      displayName: dto.displayName,
      isPublic: dto.isPublic,
      username: dto.username,
    };
    return params;
  }

  static toResponseDto(profile: Profile): ProfileResponseDto {
    return {
      id: profile.id,
      username: profile.username,
      displayName: profile.displayName,
      birthday: profile.birthday,
      bio: profile.bio,
      avatarUrl: profile.avatarUrl,
      isPublic: profile.isPublic,
      createdAt: profile.createdAt,
    };
  }

  static toResult(profile: Profile): ProfileResult {
    let birthday;
    if (profile.birthday) {
      birthday =
        profile.birthday instanceof Date
          ? profile.birthday.toISOString()
          : new Date(profile.birthday).toISOString();
    } else {
      birthday = undefined;
    }

    return {
      id: profile.id,
      username: profile.username,
      displayName: profile.displayName,
      birthday: birthday,
      bio: profile.bio ?? undefined,
      avatarUrl: profile.avatarUrl ?? undefined,

      isPublic: profile.isPublic,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}

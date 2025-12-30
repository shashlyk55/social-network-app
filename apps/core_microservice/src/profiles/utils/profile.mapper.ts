import { Injectable } from '@nestjs/common';
import { FullRegisterDto } from 'src/auth/dto/full-register.dto';
import { Profile } from 'src/entities/profile.entity';
import { ProfileResponseDto } from '../dto/profile-response.dto';
import { CreateProfileParams } from '../types/profile-params.types';
import { ProfileResult } from 'src/auth/types/auth-params.types';

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
    return {
      id: profile.id,
      username: profile.username,
      displayName: profile.displayName,
      birthday:
        profile.birthday instanceof Date
          ? profile.birthday.toISOString()
          : new Date(profile.birthday).toISOString(),

      bio: profile.bio ?? undefined,
      avatarUrl: profile.avatarUrl ?? undefined,

      isPublic: profile.isPublic,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}

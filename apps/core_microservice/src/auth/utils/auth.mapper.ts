import { Profile } from 'src/entities/profile.entity';
import { InternalAuthDto } from '../dto/internal-auth-response.dto';
import { AuthResult } from '../types/auth-params.types';

export class AuthMapper {
  static toAuthResult(authDto: InternalAuthDto, profile: Profile): AuthResult {
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
      tokens: authDto.tokens,
      user: {
        //id: authDto.user.id,
        role: authDto.user.role,
        disabled: authDto.user.disabled,
      },
      profile: {
        id: profile.id,
        username: profile.username,
        displayName: profile.displayName,
        birthday: birthday,
        bio: profile.bio ?? undefined,
        avatarUrl: profile.avatarUrl ?? undefined,
        isPublic: profile.isPublic,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    };
  }
}
